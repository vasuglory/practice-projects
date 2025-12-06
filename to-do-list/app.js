import express from "express";
const port = 2000;
const app = express();
app.set("view engine","ejs");

app.get("/",(_req,res)=>{
  res.render("home");
})
app.listen(port,()=>{
  console.log(`server started on port: ${port}`);
});