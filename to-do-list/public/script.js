const form = document.getElementById("add-a-task-form");
form.addEventListener("submit", addTask);

const tasksContainer = document.querySelector(".tasks-container");
//get all tasks

function tasksComponent(id, task) {
  const taskContainer = document.createElement("div");
  taskContainer.classList.add("task-container");

  const checkboxEl = document.createElement("span");
  checkboxEl.classList.add("round-shaped-checkbox");

  const taskEl = document.createElement("p");
  taskEl.textContent = task;
  taskEl.classList.add("task-data");

  const editIconEl = document.createElement("button");
  editIconEl.classList.add("edit-task");

  const deleteIconEl = document.createElement("button");
  deleteIconEl.classList.add("delete-task");
  deleteIconEl.setAttribute("task-id", id);
  deleteIconEl.addEventListener("click",deleteTask);
  
  taskContainer.append(checkboxEl,taskEl,editIconEl,deleteIconEl);
  tasksContainer.append(taskContainer);
  
}

async function addTasksToPage() {
  const result = await fetch("/getAllTasks");
  if (!result.ok) {
    console.log("internal server error.");
  } else {
    //no server error
    let tasks = await result.json();
    console.log(tasks.length);
    if (tasks.length > 0) {
      tasks.forEach(task => {
        tasksComponent(task.id,task.task);
      })
    }
  }
}
addTasksToPage();

//when add the task button got clicked
async function addTask(e) {
  e.preventDefault();
  const data = {
    task: e.target.task.value,
  };
  const result = await fetch("/add", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!result.ok) {
    console.log("try again.");
    let msg = await result.text();
    console.log(msg);
  }
  else{
   const newTask =  await result.json();
   if(Object.keys(newTask).length >= 1){
    console.log("i am here");
    console.log(newTask);
    console.log(newTask.task)
    tasksComponent(newTask.id,newTask.task);
   }
   
  }
}
//delete task from home page
async function deleteTask(){
  let obj = {
    id:this.getAttribute("task-id")
  }
  const result = await fetch("/deleteTask",{
    method:"PATCH",
    headers:{
     "content-type": "application/json"
    },
    body:JSON.stringify(obj)
  });
  const status = await result.json();
  console.log(status);
  this.parentElement.remove();
}



