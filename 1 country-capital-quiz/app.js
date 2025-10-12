import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import "dotenv/config";

const app = express();
const port = 4000;
const db = new pg.Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());


let totalScore;



db.connect();
let array = [];
db.query("SELECT * FROM  capitals ORDER BY id ASC ",(err,res)=>{
  if(err){
    console.error("Failed fetching data from db, "+err.message);
  } else {
    
    array = res.rows;
    
  }
  db.end();
});


let currentQuestion = {};
function getQuestion(){
  let random = Math.floor(Math.random() * array.length);
  currentQuestion = array[random];
}
app.set("view engine","ejs");
app.use(express.static("public"));
app.get("/",(req,res)=>{
  totalScore = 0;
  getQuestion();
  res.render("index",{question:currentQuestion.country});
});

app.post("/submit",(req,res)=>{
  
  let answer = req.body.answer?.trim().toLowerCase() || "";
  console.log(answer);
  let isCorrect = false;
  if(currentQuestion.capital?.toLowerCase() || "" === answer){
    totalScore+=1;
    isCorrect = true;
  }
  getQuestion();
  let object = {
    isCorrect: isCorrect,
    totalScore: totalScore,
    question: currentQuestion.country
  }
  res.json(object);
});


app.listen(port,()=>{
  console.log(`server is running at localhost:${port}`);
});