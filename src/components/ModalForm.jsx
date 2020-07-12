import React from 'react';

export default class ModalForm extends React.Component {
  constructor(props){
    super(props);
    let timestamp = Math.round(new Date().getTime());
    this.id = {
      formContainer: `form_container_${timestamp}`,
      form: `form_${timestamp}`
    };
    this.state = {
      // display: this.props.display !== null ? this.props.display : false,
      form: this.props.form !== null ? this.props.form : "join",
    };
    this.joinText = this.joinText.bind(this);
    this.loginText = this.loginText.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.renderJoinLogin = this.renderJoinLogin.bind(this);
    this.renderAbout = this.renderAbout.bind(this);
    this.renderProfile = this.renderProfile.bind(this);
  }
  joinText (){
    return {
      headerText: "Join Nautical Minds",
      url: "/join",
      altHeader: "or Login",
      altUrl: "/login",
      passwordPlaceholder: "Create a password...",
    }
  }
  loginText() {
    return {
      headerText: "Login",
      url: "/login",
      altHeader: "New? Join",
      altUrl: "/join",
      passwordPlaceholder: "Password",
    }
  }
  submitForm(submitEvent, url){
    submitEvent.preventDefault();
  
    // form validation
    let email = document.getElementsByName("email")[0].value;
    let password = document.getElementsByName("password")[0].value;
  
    if (this.validateEmail(email)){
      if (this.validatePassword(password)){
        // send request
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("X-CSRFToken", document.getElementById("_csrf_token").value);
        xhr.send(JSON.stringify({
          email: email,
          password: password
        }))
        xhr.onload = (resp) => {
          if (xhr.status !== 200 ){
            let div = document.createElement("div")
            document.getElementById(this.id.formContainer).appendChild(div);
            div.className = "form-alert error";
            div.innerHTML = `<span>${xhr.status}:${xhr.statusText}</span>`
            setTimeout(()=>{
              div.parentNode.removeChild(div);
            }, 3000);
          } else if (JSON.parse(xhr.response).status !== 'success') {
            console.log(xhr.response);
            let div = document.createElement("div");
            document.getElementById(this.id.formContainer).appendChild(div);
            div.className = "form-alert error";
            div.innerHTML = `<span>${JSON.parse(xhr.response).message}</span>`
            setTimeout(()=>{
              div.parentNode.removeChild(div);
            }, 3000);
          } else {
            let div = document.createElement("div")
            document.getElementById(this.id.formContainer).appendChild(div);
            div.className = "form-alert success";
            div.innerHTML = `<span>${JSON.parse(xhr.response).message}</span>`
            setTimeout(()=>{
              div.remove();
              this.setState(()=>{
                return {
                  display: false,
                }
              });
  
              // let siteAlert = document.createElement('div');
              // document.getElementsByTagName('body')[0].appendChild(siteAlert);
              // siteAlert.className = "site-alert success"
              // siteAlert.innerHTML = `${JSON.parse(xhr.response).siteMessage}`;
              // setTimeout(()=>{
              //   siteAlert.remove();
              // }, 5000);
              document.getElementById(this.id.form).reset();
              if (url === "/login") {
                this.props.onLogin();
              } else if (url === "/join") {
                this.props.onJoin();
              }
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
        document.getElementById(this.id.formContainer).appendChild(div);
        setTimeout(()=>{
          div.remove();
        }, 3000);
      }
    } else {
      let div = document.createElement("div")
      div.style = "display: none; transition: display 1s ease-in";
      div.className = "form-alert error";
      div.innerHTML = "<span>Invalid email. Please try again.</span>";
      div.style.display = "block";
      document.getElementById(this.id.formContainer).appendChild(div);
      setTimeout(()=>{
        div.remove();
      }, 3000);
    }
  }
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  }
  validatePassword(password){
    return password.length >= 8
  }
  renderJoinLogin() {
    let text;
    if (this.props.form == 'Login'){
      text = this.loginText();
    } else { // (this.props.form == 'Join')
      text = this.joinText();
    }
    return (
      <div className="form-container center-relative dark-modal" id={this.id.formContainer}
        style={
          this.props.display ? 
          {visibility: "visible", opacity: 1, display: "block"} : 
          {visibility: "visible", opacity: 0, display: "none"}
        }>
        <div style={{display: "flex"}}>
          <h3 className="form-header">{text.headerText}</h3>
          <h6 style={{margin: "10px 10px 10px auto"}} onClick={this.props.altOnClick}>
            <i>{text.altHeader.split(" ")[0]} </i><a href={text.altUrl}>{text.altHeader.split(" ")[1]}</a>
          </h6>
        </div>
        <form className="flex-col" id={this.id.form}>
          <div className="input-container">
            <input type="email" placeholder="Email" name="email" className="join-input" autoComplete="username"/>
            <input type="password" placeholder={text.passwordPlaceholder} name="password" className="join-input" autoComplete="current-password"/>
            <hr/>
          </div>
          <div className="button-container">
            <button className="dark-grey submit-btn" type="submit" onClick={(e)=>this.submitForm(e, text.url)}>Submit</button>
            <button className="dark-grey reset-btn" type="reset">Reset</button>
          </div>
        </form>
      </div>
    )
  }
  renderProfile(){
    return (
      <div className="form-container center-relative dark-modal"
        style={
          this.props.display ? 
          {visibility: "visible", opacity: 1, display: "block"} : 
          {visibility: "visible", opacity: 0, display: "none"}
        }>
        <h3 className="form-header">Profile</h3>
        <form className="flex-col">
          <div className="input-container">
            <input type="text" placeholder="Name" name="name" className="join-input"/>
            <input type="date" placeholder="DOB" name="dob" className="join-input"/>
            <hr/>
          </div>
          <div className="button-container">
            <button className="dark-grey submit-btn" type="submit" onClick={(e)=>this.submitForm(e, "/profile")}>Submit</button>
            <button className="dark-grey reset-btn" type="reset">Reset</button>
          </div>
        </form>
      </div>
    )
  }
  renderAbout(){
    return (
      <div className="about-container center-relative dark-modal" 
        style={
          this.props.display ? 
          {visibility: "visible", opacity: 1, display: "block"} : 
          {visibility: "visible", opacity: 0, display: "none"}
        }>
        <h3 className="form-header">About</h3>
        <p className="right-justified">
          Nautical Minds is a music duo, formed in Florida in 2012, consisting of Jason Marcus (vox) and Jason Traub (guitar).
        </p>
        <h3 className="form-header">Contact</h3>
        <p className="right-justified" style={{paddingTop: 0, textAlign: "end"}}>
          <a className="contact-link" href="mailto:info@nauticalminds.com">info@nauticalminds.com</a>
        </p>
        <h3 className="form-header">Links</h3>
        <p className="right-justified" style={{paddingTop: 0, textAlign: "end"}}>
          <a className="contact-link-blue" href="https://linktr.ee/nauticalminds" target="_blank">linktr.ee</a>
        </p>
      </div>
    )
  }
  render(){
    let contentFunction;
    if (this.props.form == "Join" || this.props.form == "Login") {
      contentFunction = this.renderJoinLogin;
    } else if (this.props.form == "About") {
      contentFunction = this.renderAbout;
    } else if (this.props.form == "Profile") {
      contentFunction = this.renderProfile;
    } else {
      contentFunction = null;
    }

    return (
      <div>
        <div className="nautical-minds-container backdrop" onClick={this.props.backdropOnClick} 
            style={this.props.display ? 
                  {visibility: "visible", opacity: 1, zIndex: 2, backdropFilter: "blur(15px)"} : 
                  {opacity: 0, display: "none", zIndex: 0}}/>
        {contentFunction()}       
      </div>
    )
  }
}