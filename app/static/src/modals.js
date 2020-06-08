var MODAL_OPEN = false;
var rootContainer = document.getRootNode().body;
var backdrop = null;

var aboutButton = document.getElementById("aboutButton");
var aboutModal = document.getElementById("aboutModal")

aboutButton.onclick = function (e) {

}

var loginButton = document.getElementById("loginButton");
var formContainer = null;

function submitForm(submitEvent){
  submitEvent.preventDefault();

  // form validation
  let email = document.getElementsByName("onboardEmail")[0].value;
  let password = document.getElementsByName("onboardPassword")[0].value;

  if (validateEmail(email)){
    if (validatePassword(password)){
      // send request
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/onboard", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("X-CSRFToken", document.getElementById("_csrf_token").value);
      xhr.send(JSON.stringify({
        email: email,
        password: password
      }))
      xhr.onload = (d) => {
        console.log(d);
        console.log(xhr);
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
          formContainer.appendChild(div);
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
      div.className = "form-alert";
      div.innerHTML = "<span>Password must be at least 8 characters.</span>"
      formContainer.appendChild(div);
      setTimeout(()=>{
        div.style = "display: none; transition: display 1s ease-out";
      }, 3000);
    }
  } else {
    let div = document.createElement("div")
    div.style = "display: none; transition: display 1s ease-in";
    div.className = "form-alert";
    div.innerHTML = "<span>Invalid email. Please try again.</span>";
    div.style.display = "block";
    formContainer.appendChild(div);
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


loginButton.onclick = function (e) {

  if (formContainer === null){
    formContainer = document.createElement("div");
    formContainer.className = "form-container center-relative dark-modal";
    formContainer.id = "formConatiner"
    let header = document.createElement("h3");
    header.className = "form-header";
    header.innerHTML = "Join Nautical Minds";
    let form = document.createElement("form");
    form.className = "flex-col";
    let email = document.createElement("input");
    email.type = "email"; email.placeholder = "Email"; email.name = "onboardEmail";
    email.className = "join-input"
    let password = document.createElement("input");
    password.type = "password"; password.placeholder = "Create a password..."; password.name = "onboardPassword";
    password.className = "join-input"

    let inputContainer = document.createElement("div");
    inputContainer.className = "input-container"
    inputContainer.appendChild(email);
    inputContainer.appendChild(password);

    let hr = document.createElement("hr");
    inputContainer.appendChild(hr);

    // let h6 = document.createElement("h6");
    // h6.innerHTML = "Optional";
    // inputContainer.appendChild(h6);

    // let name = document.createElement("input");
    // name.type = "text"; name.placeholder = "Name"; name.name = "onboardName";
    // name.className = "join-input";
    // Object.assign(name.style, {
    //   margin: "0 10px 5px auto"
    // });

    // let dob = document.createElement("input");
    // dob.type = "date"; dob.placeholder = "DOB"; dob.name = "onboardDob";
    // dob.className = "join-input";

    // inputContainer.appendChild(name);
    // inputContainer.appendChild(dob);

    let submit = document.createElement("button");
    submit.type = "submit";
    submit.innerHTML = "Submit";
    submit.onclick = submitForm;
    submit.className = "dark-grey submit-btn";

    let reset = document.createElement("button");
    reset.type = "reset";
    reset.innerHTML = "Reset";
    reset.className = "dark-grey reset-btn";

    let buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";
    buttonContainer.appendChild(submit);
    buttonContainer.appendChild(reset);

    form.appendChild(header);
    form.appendChild(inputContainer);
    form.appendChild(buttonContainer);

    formContainer.appendChild(form);

    backdrop = document.createElement("div");
    backdrop.className = "nautical-minds-container backdrop"
    backdrop.onclick = function () {
      // formContainer.style.visibility = "hidden";
      formContainer.style.opacity = 0;
      // this.style.visibility = "hidden";
      this.style.opacity = 0;
      this.style.zIndex = 0;
    }
    rootContainer.appendChild(backdrop);
    rootContainer.appendChild(formContainer);
  }
  formContainer.style.visibility = "visible";
  formContainer.style.opacity = 1;
  backdrop.style.visibility = "visible";
  backdrop.style.opacity = 1;
  backdrop.style.zIndex = 2;
  backdrop.style.backdropFilter = "blur(15px)";
};
