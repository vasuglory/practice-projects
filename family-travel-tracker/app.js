import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import pg from 'pg';
const port = 4000;
const app = express();
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

const db = new pg.Pool({
  user:process.env.user,
   host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port
});
async function getAllUsers(){
  let users = [];

  try{
    const usersResult = await db.query("SELECT * FROM users");
    if(usersResult.rowCount >=1){
      users = usersResult.rows;
    }
     
  }catch(err){
    console.log(err.stack);
  }
  return users;
}

app.get("/",async (_req,res)=>{
  //check all users and send them
  let users = await getAllUsers();
  res.render("index",{users: JSON.stringify(users)});
});

app.post("/addUser",async (req,res)=>{
  //not null and required in html
  let username = req.body.userName;
  let color = req.body.color || "teal";
  console.log(username);
  console.log(color);
  let newMember = {};
  try{
    const insertUser = await db.query("INSERT INTO users(user_name,color) VALUES($1, $2) RETURNING users.user_id",[username,color]);
    
    if(insertUser.rowCount == 1){
      newMember.status = "added";
      newMember.name = username;
      newMember.color = color;
      newMember.id = insertUser.rows[0].user_id;
    }
  }catch(err){
    newMember.status = "not added";
    console.log(err.stack);
     res.json(newMember);
  }
  res.json(newMember);
});
app.get("/user/:user_id",async (req,res)=>{
 
  let user_id = parseInt(req.params.user_id, 10);

  //get all the countries user been to.

const query = "SELECT countries.country_code AS country_code FROM users JOIN visited ON visited.user_id = users.user_id JOIN countries ON countries.id = visited.country_id WHERE users.user_id = $1 ";
let countryCodes = [];
countryCodes.forEach
try{
  const getAllcountryCodes = await db.query(query,[user_id]);
  if(getAllcountryCodes.rowCount > 0){
    rows.forEach(row =>{
      countryCodes.push(row.countrt_code);
    });
    return res.json(countryCodes);
  }
  else{
    return res.json(countryCodes);
  }
}catch(err){
  console.log("error");
  console.log(err.stack);
  return res.json(countryCodes);
}
});
app.post
app.listen(port,()=>{
  console.log(`server listening on port, ${port}`);
});

