import React from 'react';

export default class UserPanel extends React.Component {
  constructor(props){
    super(props);
    // if user cookies set state.loggedIn = true
    this.state = {
      loggedIn: false,
    }
  }
  render(){
    return (
      <div>
      {
        this.state.loggedIn ? 
        null
        :
        <button className="header-button nautical-btn color-wheel" id="loginButton">
          <a href="/join">Join</a>
        </button>
      }
      </div>
    )
  }
}