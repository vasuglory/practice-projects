const addNewUser = document.getElementById("add-new-member");
const addAUser = document.querySelector(".add-a-user-container");
const usersDiv = document.querySelector(".users");
let currentUser = 0;
//get hold of all users
if (users) {
  // let firstUserObject = JSON.parse(users.firstUserObject);
  currentUser = firstUserObject.currentUser;
  console.log(currentUser);
  //append them all with username and selected color in the div
  users.forEach((user) => {
    
    console.log("currentUser: "+currentUser);
    const a = document.createElement("a");

    a.setAttribute("href", `/user/${user.user_id}`);
    a.setAttribute("data-set", user.user_id);
    a.innerText = user.user_name;
    // a.addEventListener("click", fetchUserData);
    if (user.color) {
      a.style.backgroundColor = user.color;
    } else {
      a.style.backgroundColor = "teal";
    }
    a.classList.add("user");
    usersDiv.append(a);
  });
 console.log(users);
}
// console.log(addAUser)
addNewUser.addEventListener("click", () => {
  console.log("clicked");
  addAUser.classList.add("visibility");
});

document.getElementById("close-svg").addEventListener("click", () => {
  addAUser.classList.remove("visibility");
});

//fetch add country
document
  .getElementById("add-country-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = {
      user_id: currentUser,
      country: e.target.country.value,
    };
    const result = await fetch("/addCountry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const addedResult = await result.json();
    console.log(addedResult);
  });

//addUser
document
  .getElementById("add-user-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    let formData = {
      userName: e.target.userName.value,
      color: e.target.color.value,
    };
    const result = await fetch("/addUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const member = await result.json();
    console.log(member);

    const a = document.createElement("a");
    a.innerText = member.name;
    // a.addEventListener("click", fetchUserData);
    a.setAttribute("data-set", member.id);
    a.setAttribute("href", `/user/${member.id}`);
    a.classList.add("user");

    a.style.backgroundColor = member.color;
    usersDiv.append(a);
  });

//particular user
const add = document.getElementById("user-id-country");
/*
async function fetchUserData(event) {
  try {
    event.preventDefault();
    // console.log("id of user: " + this.getAttribute("id"));
    const id = this.getAttribute("data-set");
    // console.log("type of id", typeof id);
    const result = await fetch(`user/${id}`);
    // add.setAttribute("data-set", this.getAttribute("id"));
    const userData = await result.json();
    if (userData) {
      console.log("we have user data");
      userData.forEach((countryCode) => {
        console.log(countryCode);
        document.getElementById(countryCode).style.fill = "teal";
      });
    }
    currentUser = parseInt(id, 10);
    console.log(userData);
  } catch (err) {
    console.log(err.message);
  }
}
*/