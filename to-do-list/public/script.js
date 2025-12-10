
const form = document.getElementById("add-a-task-form");
form.addEventListener("submit",addTask);

//when add the task button got clicked
async function addTask(e){
  e.preventDefault();
  console.log(e.target.task.value);
  const data = {
    task: e.target.task.value
  }
  const result = await fetch("/add",{
    method: "POST",
    headers:{
      "content-type":"application/json"
    },
    body:JSON.stringify(data)
  });
  
}
