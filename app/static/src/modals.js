var loginButton = document.getElementById("loginButton");
var loginModal = document.getElementById("loginModal");

loginButton.onclick = function (e) {
  loginModal.style.visibility = "visible";
  loginModal.style.opacity = 1;
}

var csb = document.getElementById("cancelSignupButton");
// csb.onclick = (e) => {
//   e.preventDefault();
//   loginModal.style.visibility = "hidden";
//   loginModal.style.opacity = 0;
// }

var submitButton = document.getElementById("submitButton");
submitButton.onclick = (e) => {
  e.preventDefault();

  // form validation
  let email = document.getElementsByName("onboardEmail")[0].value;
  let password = document.getElementsByName("onboardPassword")[0].value;

  if (validateEmail(email)){
    if (validatePassword(password)){
      // send request
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/onboard", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify({
        email: email,
        password: password
      }))
      xhr.onload = (d) => {
        if (JSON.parse(xhr.response).result === false) {
          let div = document.createElement("div")
          document.getElementById("form1").appendChild(div);
          div.className = "form-alert";
          div.innerHTML = `<span>${JSON.parse(xhr.response).message}</span>`
          setTimeout(()=>{
            div.style = "display: none; transition: display 1s ease-out";
          }, 3000);
        } else {
          loginButton.innerHTML = "Welcome";
          let div = document.createElement("div")
          document.getElementById("form1").appendChild(div);
          div.className = "form-success";
          div.innerHTML = `<span>${JSON.parse(xhr.response).message}</span>`
          setTimeout(()=>{
            loginModal.style.visibility = "hidden";
            loginModal.style.opacity = 0;
          }, 3000);
        }
      }
      xhr.onerror = (e) =>{
        console.error(e);
      }
    } else {
      let div = document.createElement("div")
      document.getElementById("form1").appendChild(div);
      div.className = "form-alert";
      div.innerHTML = "<span>Password must be at least 8 characters.</span>"
      setTimeout(()=>{
        div.style = "display: none; transition: display 1s ease-out";
      }, 3000);
    }
  } else {
    let div = document.createElement("div")
    document.getElementById("form1").appendChild(div);
    div.style = "display: none; transition: display 1s ease-in";
    div.className = "form-alert";
    div.innerHTML = "<span>Invalid email. Please try again.</span>";
    div.style.display = "block";
    setTimeout(()=>{
      div.style = "display: none; transition: display 1s ease-out";
    }, 3000);
  }
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

function validatePassword(password){
  return password.length >= 8
}
