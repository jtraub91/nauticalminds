import React from 'react';

export default class About extends React.Component {
  render(){
    return (
      <div className="about-container center-relative dark-modal" 
        style={{visibility: "visible", opacity: 1, display: "block"}}>
        <h3 className="form-header">About</h3>
        <p className="right-justified">
          Nautical Minds is a music duo from Florida, consisting of Jason Marcus (vox) and Jason Traub (guitar).
        </p>
        <h4 className="form-header">Contact</h4>
        <p className="right-justified" style={{paddingTop: 0, textAlign: "end"}}>
          <a className="contact-link" href="mailto:nauticalmindsmusic@gmail.com">nauticalmindsmusic@gmail.com</a>
        </p>
        <h5 className="form-header">Links</h5>
        <p className="right-justified" style={{paddingTop: 0, textAlign: "end"}}>
          <a className="contact-link-blue" href="https://linktr.ee/nauticalminds" target="_blank">linktr.ee</a>
        </p>
      </div>
    )
  }
}