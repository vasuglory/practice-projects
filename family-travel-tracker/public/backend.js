const addNewUser = document.getElementById('add-new-member');
const addAUser = document.querySelector('.add-a-user-container');
const usersDiv = document.querySelector(".users");
//get hold of all users
if(users){
  //append them all with username and selected color in the div
  users.forEach(user => {
    const a = document.createElement('a');
    a.setAttribute('href',`/user/${user.user_id}`);
    a.setAttribute('id',user.user_id);
    a.innerText = user.user_name;
    a.addEventListener('click',fetchUserData);
    if(user.color){
      a.style.backgroundColor = user.color;
    }else{
      a.style.backgroundColor = 'teal';
    }
    a.classList.add('user');
    usersDiv.append(a);

  })
}
// console.log(addAUser)
addNewUser.addEventListener('click',()=>{
  console.log("clicked");
  addAUser.classList.add("visibility");

})

document.getElementById('close-svg').addEventListener('click',()=>{
  addAUser.classList.remove("visibility");
});




//fetch add country 
document.getElementById("add-country-form").addEventListener('submit',(e)=>{
  e.preventDefault();
  const formData = {
     country : e.target.country
  }
  fetch("/addCountry",{
    method: 'POST',
    headers : {"Content-Type":"application/json"},
    body: JSON.stringify(formData)
  });
  

})

//addUser
document.getElementById("add-user-form").addEventListener('submit',async (e)=>{
  e.preventDefault();
  let formData = {
    userName : e.target.userName.value,
    color : e.target.color.value
  }
  const result = await fetch("/addUser",{
    method: 'POST',
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify(formData)
  });
  const member =  await result.json();
  console.log(member);
  
  const a = document.createElement('a');
  a.innerText  = member.name;
  a.addEventListener('click',fetchUserData)
  a.setAttribute('id',member.id);
  a.setAttribute('href',`/user/${member.id}`);
  a.classList.add('user');
  
  
  a.style.backgroundColor = member.color;
  usersDiv.append(a);
})

//particular user
const add = document.getElementById("user-id-country");
async function fetchUserData(event){
  try{
  event.preventDefault();
  console.log("id of user: "+this.getAttribute('id'));
  const id = this.getAttribute('id');
  console.log("type of id",typeof(id));
  const result = await fetch(`user/${id}`);
  add.setAttribute('data-set',this.getAttribute('id'));
  console.log("data attribute value of add: "+add.getAttribute('data-set'))
  const userData = await result.json();
  console.log(userData);
  }catch(err){
    console.log(err.message);
  }
  
}