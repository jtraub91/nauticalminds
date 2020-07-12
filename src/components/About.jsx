import React from 'react';

export default class About extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    return (
      <div className="button-group">
        <button className="header-button nautical-btn purple" id="aboutButton"
          onClick={this.props.onClick}>
          <a href="/about">About</a>
        </button>
        {/* <button className="header-button nautical-btn yellow mr-15">
          <a href="/tip" onClick={(e)=>e.preventDefault()}>Tip</a>
        </button> */}
      </div>
    )
  }
}