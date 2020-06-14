var MODAL_OPEN = false;
var rootContainer = document.getRootNode().body;
var backdrop = null;

var aboutButton = document.getElementById("aboutButton");
var aboutModal = document.getElementById("aboutModal")

var aboutContainer = null;
aboutButton.onclick = function (e) {
  e.preventDefault();
  if (aboutContainer === null){
    aboutContainer = document.createElement("div");
    aboutContainer.className = "about-container center-relative dark-modal";
    aboutContainer.id = "aboutContainer"
    let header = document.createElement("h3");
    header.className = "form-header";
    header.innerHTML = "About";

    let div = document.createElement("div");
    div.innerHTML = "\n"

    let p = document.createElement("p");
    p.className = "right-justified";
    p.innerHTML = "Nautical Minds is a music duo formed in Florida in 2012, consisting of Jason Marcus (vox) and Jason Traub (guitar)."
    aboutContainer.appendChild(header);
    aboutContainer.appendChild(p);

    if (backdrop === null){
      backdrop = document.createElement("div");
      backdrop.className = "nautical-minds-container backdrop"
      backdrop.style.backgroundColor = "rgba(0,0,0,0.25)";
      backdrop.onclick = function () {
        if (formContainer){
          formContainer.style.opacity = 0;
        }
        if (aboutContainer){
          aboutContainer.style.opacity = 0;
        }
        this.style.opacity = 0;
        this.style.zIndex = 0;
      }
      rootContainer.appendChild(backdrop);
    }
    rootContainer.appendChild(aboutContainer);
  }
  aboutContainer.style.visibility = "visible";
  aboutContainer.style.opacity = 1;
  backdrop.style.visibility = "visible";
  backdrop.style.opacity = 1;
  backdrop.style.zIndex = 2;
  backdrop.style.backdropFilter = "blur(15px)";
  
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
      xhr.onload = (resp) => {
        if (xhr.status !== 200) {
          let div = document.createElement("div")
          formContainer.appendChild(div);
          div.className = "form-alert error";
          div.innerHTML = `<span>${xhr.status}:${xhr.statusText}</span>`
          setTimeout(()=>{
            div.style = "display: none; transition: display 1s ease-out";
          }, 3000);
        } else {
          let div = document.createElement("div")
          formContainer.appendChild(div);
          div.className = "form-alert success";
          console.log(xhr.response);
          div.innerHTML = `<span>${JSON.parse(xhr.response).message}</span>`
          setTimeout(()=>{
            formContainer.style.visibility = "hidden";
            formContainer.style.opacity = 0;
            backdrop.style.opacity = 0;
            backdrop.style.zIndex = 0;
          }, 3000);
        }
      }
      xhr.onerror = (e) =>{
        console.error(e);
      }
    } else {
      let div = document.createElement("div")
      div.className = "form-alert error";
      div.innerHTML = "<span>Password must be at least 8 characters.</span>"
      formContainer.appendChild(div);
      setTimeout(()=>{
        div.style = "display: none; transition: display 1s ease-out";
      }, 3000);
    }
  } else {
    let div = document.createElement("div")
    div.style = "display: none; transition: display 1s ease-in";
    div.className = "form-alert error";
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

function join(e) {
  e.preventDefault();
  if (formContainer === null){
    formContainer = document.createElement("div");
    formContainer.className = "form-container center-relative dark-modal";
    formContainer.id = "formConatiner"

    let header = document.createElement("h3");
    header.className = "form-header";
    header.innerHTML = "Join Nautical Minds";
    
    let altHeader = document.createElement("h6");
    altHeader.innerHTML = '<i>or </i><a href="/login">Login</a';
    altHeader.style.margin = "10px 10px 10px auto";

    let headerContainer = document.createElement("div");
    headerContainer.style.display = "flex";
    headerContainer.appendChild(header);
    headerContainer.appendChild(altHeader);

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

    form.appendChild(headerContainer);
    form.appendChild(inputContainer);
    form.appendChild(buttonContainer);

    formContainer.appendChild(form);

    if (backdrop === null) {
      backdrop = document.createElement("div");
      backdrop.className = "nautical-minds-container backdrop"
      backdrop.onclick = function () {
        if (formContainer){
          formContainer.style.opacity = 0;
        }
        if (aboutContainer){
          aboutContainer.style.opacity = 0;
        }
        this.style.opacity = 0;
        this.style.zIndex = 0;
      }
      rootContainer.appendChild(backdrop);
    }
    rootContainer.appendChild(formContainer);
  }
  formContainer.style.visibility = "visible";
  formContainer.style.opacity = 1;
  backdrop.style.visibility = "visible";
  backdrop.style.opacity = 1;
  backdrop.style.zIndex = 2;
  backdrop.style.backdropFilter = "blur(15px)";
};
loginButton.onclick = join;

var joinLink = document.getElementById("joinLink");
joinLink.onclick = join;