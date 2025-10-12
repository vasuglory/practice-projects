const form = document.getElementById("form");
const question = document.getElementById("question");
const totalScore = document.getElementById("totalScore");
const button = document.getElementById("submit");
const answer = document.getElementById("answer");
const body = document.getElementById("app");
const sounds = ["/sounds/correct.mp3","/sounds/wrong.mp3"];
form.addEventListener("submit",async (e)=>{
  e.preventDefault();
  let object = {
    answer: e.target.answer.value
  }
  console.log(answer.value);
  try{
  const response = await fetch("/submit",{
    method: "POST",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify(object)
  });
  let data = await response.json();
  console.log(data.isCorrect);
  console.log(typeof(data.isCorrect));
  if(data.isCorrect){
    const sound = new Audio(sounds[0]);
    sound.currentTime = 0;
    await sound.play();
    const span = document.createElement("span");
    span.textContent = "✅";
    span.classList.add("isCorrect");
    
    button.appendChild(span);

    setTimeout(()=>{
      button.removeChild(span);
    },500);
    answer.value = "";
      totalScore.textContent = `Total Score: ${data.totalScore}`;
  question.textContent = data.question;
  }
  else{
    const wrong = new Audio(sounds[1]);
    wrong.currentTime = 0;
    wrong.play();
    const span = document.createElement("span");
    span.classList.add("isCorrect");
    span.textContent = "❌"
    button.appendChild(span);
    setTimeout(()=>{
      button.removeChild(span);
      window.alert(`'Game over! Final best score: ${data.totalScore}`);
      body.innerHTML = `<button  id= "restartBtn"><a href= "/">Restart</a></button>`
    },500);
    
    
  }

}catch(err){
  console.log(err.message);
}
});