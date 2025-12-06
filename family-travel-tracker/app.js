import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import pg from "pg";
const port = 4000;
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const db = new pg.Pool({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port,
});
async function getAllUsers() {
  /*
  let users = {
    allUsers:[],
    firstUserObject:{}
  }
    */
  let users = [];
  try {
    const usersResult = await db.query(
      "SELECT * FROM users ORDER BY user_id ASC"
    );
    if (usersResult.rowCount >= 1) {
      // let firstUserId = usersResult.rows[0].user_id;
      // let userObject = await getUserInfo(firstUserId);
      // console.log(userObject);
      users = usersResult.rows;
      // users.firstUserObject = JSON.stringify(userObject);
      // console.log(users.firstUserObject);
    }
  } catch (err) {
    console.log(err.stack);
  }
  return users;
}
 async function getUserInfo(id){
  console.log(id);
  console.log(typeof(id));
  let userObject = {
    currentUser:id,
    visitedCountries:false,
    countryCodesOfFirstUser:[]
  }
  const query = "SELECT countries.country_code AS country_code FROM countries JOIN visited ON visited.country_id = countries.id WHERE visited.user_id = $1";
  try{
    const visitedResult = await db.query(query,[id]);
    if(visitedResult.rowCount >= 1){
      //then user visited some countries
      userObject.visitedCountries = true;
      visitedResult.rows.forEach(user =>{
        userObject.countryCodesOfFirstUser.push(user.country_code);
      });
    }
  }catch(err){
    console.log(err.stack);
  }
  return userObject;
}
app.get("/", async (_req, res) => {
  //check all users and send them
  let currentUser = 1;
  let users = await getAllUsers();
  let firstUserObject= await getUserInfo(currentUser);
  if(users){
    //get 
  }
  res.render("index", { users: JSON.stringify(users),firstUserObject:JSON.stringify(firstUserObject)});
});

app.post("/addUser", async (req, res) => {
  //not null and required in html
  let username = req.body.userName;
  let color = req.body.color || "teal";
  console.log(username);
  console.log(color);
  let newMember = {};
  try {
    const insertUser = await db.query(
      "INSERT INTO users(user_name,color) VALUES($1, $2) RETURNING users.user_id",
      [username, color]
    );

    if (insertUser.rowCount == 1) {
      newMember.status = "added";
      newMember.name = username;
      newMember.color = color;
      newMember.id = insertUser.rows[0].user_id;
    }
  } catch (err) {
    newMember.status = "not added";
    console.log(err.stack);
    res.json(newMember);
  }
  res.json(newMember);
});
app.get("/user/:user_id", async (req, res) => {
  let user_id = parseInt(req.params.user_id, 10);

  //get all the countries user been to.
  let users = await getAllUsers();
  
  
});
app.post("/addCountry", async (req, res) => {
  let userId = req.body.user_id;
  let countryName = req.body.country.toLowerCase();
  //check if countryName is valid.
  const checkcountryNameQuery =
    "SELECT id FROM countries WHERE LOWER(country_name) = $1";
  let countryId;
  const visitedQuery =
          "INSERT INTO visited(user_id,country_id) VALUES($1,$2)";
  try {
    const countriesResult = await db.query(checkcountryNameQuery, [
      countryName,
    ]);
    if (countriesResult.rowCount == 1) {
      countryId = countriesResult.rows[0].id;
      //now check if user already visited this country.
      const checkVisitedQuery =
        "SELECT country_id FROM visited WHERE user_id = $1";
      const visitedResult = await db.query(checkVisitedQuery, [userId]);
      if (visitedResult.rowCount > 0) {
        //the user visited some countries so check if the user visited mentioned country or not
        const userVisited = visitedResult.rows.find(
          (user) => user.country_id == countryId
        );
        if (userVisited) {
          console.log("user already visited: " + JSON.stringify(userVisited));
          return res.json({ alreadyVisited: true });
        } else {
          //add to visited
          
          try {
            await db.query(visitedQuery, [userId, countryId]);
            return res.redirect(`/user/${userId}`);
          } catch (err) {
            console.log(err.stack);
          }
        }
      } else {
        //user didn't visited any countries add first one
        try {
          await db.query(visitedQuery, [userId, countryId]);
          return res.redirect(`/user/${userId}`);
        } catch (err) {
          console.log(err.stack);
        }
      }
    }
  } catch (err) {
    console.log(err.stack);
  }
});
app.listen(port, () => {
  console.log(`server listening on port, ${port}`);
});
