import React from 'react';

export default class UserPanel extends React.Component {
  constructor(props){
    super(props);
    // if user cookies set state.loggedIn = true
    let timestamp = Math.round(new Date().getTime());
    this.id = {
      joinLoginButton: `join_login_button_${timestamp}`
    }
    this.state = {
      dropdownOpen: false,
    }
  }
  componentDidMount(){
    let joinLoginButton = document.getElementById(this.id.joinButton)
    if (joinLoginButton){
      joinLoginButton.onclick = this.props.joinLoginOnClick;
    }
  }
  render(){
    let joinLoginClassName = "header-button nautical-btn color-wheel";
    if (this.props.joinLoginText == "Login") {
      joinLoginClassName += " green";
    }
    let iconClassName;
    if (this.props.userIconInverted) {
      iconClassName = "user-icon-container inverted"
    } else {
      iconClassName = "user-icon-container";
    }
    return (
      <div className="button-group">
      {
        this.props.loggedIn ? 
        <div className="loginIconContainer">
          <div className={iconClassName}>
            <img onClick={this.props.userOnClick}
              src="/static/images/nauticalstarship-alt.svg" 
              title={`Logged in as ${this.props.userEmail}`}/>
          </div>
        </div>
        :
        <button className={joinLoginClassName} id={this.id.joinLoginButton} onClick={this.props.joinLoginOnClick}>
          <a href={this.props.joinLoginUrl}>{this.props.joinLoginText}</a>
        </button>
      }
      </div>
    )
  }
}