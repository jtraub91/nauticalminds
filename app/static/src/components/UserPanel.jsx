import React from 'react';

export default class UserPanel extends React.Component {
  constructor(props){
    super(props);
    // if user cookies set state.loggedIn = true
  }
  render(){
    return (
      <div>
      {
        this.props.loggedIn ? 
        <div className="loginIconContainer">
          <img src="/static/images/openclipart/svg/big-rocket-blast-off-fat.svg"/>
        </div>
        :
        <button className="header-button nautical-btn color-wheel" id="loginButton">
          <a href="/join">Join</a>
        </button>
      }
      </div>
    )
  }
}