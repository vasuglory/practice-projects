import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import "dotenv/config";
const port = 2000;
const app = express();

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

const db = new pg.Pool({
  user:process.env.user,
  password:process.env.password,
  port:process.env.port,
  host:process.env.host,
  database:process.env.database
});


//render an structure of page quickly
app.get("/",(_req,res)=>{
  //Read the data from tasks table and render it to ejs file
  res.render("home");
});

//get all tasks from the database
app.get("/getAllTasks",async (_req,res)=>{
  try{
    let tasks = [];
    const result = await db.query("SELECT * FROM tasks WHERE is_task_done = false ORDER BY id ASC");
    if(result.rowCount > 0){
      //has some tasks that isn't completed
      result.rows.forEach(row =>{
        tasks.push(row);
      });
      console.log(JSON.stringify(tasks[0].created_on));
      
    }
    return res.json(tasks);
  }catch(err){
    console.log("Error while getting all tasks from db: "+err.stack);
  }
  
});

//add a task to the database
app.post("/add",async (req,res)=>{
  let task = req.body.task;
  let newTask = {
    
  }
  if(task){
    try{
      const result = await db.query("INSERT INTO tasks(task) VALUES($1) RETURNING id",[task]);
      console.log(result.rows[0].id);
      newTask.id = result.rows[0].id;
      newTask.task = task;
    }
    catch(err){
      console.log("error while adding a task to db: "+err.stack);
      return res.status(500).send("database error");
    }
    }
    console.log(newTask.task)
    return res.json(newTask);
    
  
});

app.patch("/deleteTask",async (req,res)=>{
  let id = req.body.id;
  let status = {
    is_task_done:false
  }
  if(id){
    try{
      const result = await db.query("UPDATE tasks SET is_task_done = TRUE WHERE id = $1 RETURNING is_task_done",[id]);
      status.is_task_done = result.rows[0].is_task_done;
    }catch(err){
      console.log("error while updating task status: "+err.stack);
    }
  }
  return res.json(status);
})
app.listen(port,()=>{
  console.log(`server started on port: ${port}`);
});