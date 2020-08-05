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
  render(){
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
        <div className="button-group" id="userPanel">
          <button className="header-button nautical-btn color-wheel" id={this.id.joinLoginButton} onClick={this.props.joinOnClick}>
            <a href="/join">Join</a>
          </button>
          <button className="header-button nautical-btn color-wheel green" onClick={this.props.loginOnClick}>
            <a href="/login">Login</a>
          </button>
        </div>
      }
      </div>
    )
  }
}