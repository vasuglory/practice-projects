import express from "express";
import bodyParser from "body-parser";
const port = 2000;
const app = express();
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.get("/",(_req,res)=>{
  //Read the data from tasks table and render it to ejs file
  res.render("home");
})
app.post("/add",(req,res)=>{
  console.log(req.body.task);
})
app.listen(port,()=>{
  console.log(`server started on port: ${port}`);
});