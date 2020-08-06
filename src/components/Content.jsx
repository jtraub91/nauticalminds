import React from 'react';

export default class Content extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className="content-container" style={{display: this.props.userLoggedIn ? "none" : "flex"}}>
        <p className="nautical hover" onClick={this.props.joinLoginOnClick}>
          <a className="no-link-style" href="/join"><span className="hover-title blue-violet">Join</span> Nautical Minds to <span className="hover-title orange">listen</span> and <span className="hover-title green-red">download</span>!</a>
        </p>
        <div className="flex-col my-50 bg-dark container-item">
          <p className="cursive">
            Stream
          </p>
          <div className="link-container">
            <div className="apple">
              <a href="https://music.apple.com/us/artist/nautical-minds/1039080300" target="_blank">
                <img src="/static/images/apple/US-UK_Apple_Music_Badge_RGB.svg"/>
              </a>
            </div>
          </div>
          <div className="link-container">
            <div>
              <a href="https://open.spotify.com/artist/6A65EVaN2mxZYACrqkUBwN?si=VvkOYQsHR8uoVLe1CD8JtA"
                target="_blank">
                <img className="spotify" src="/static/images/spotify/Spotify_Logo_CMYK_Green.png" />
              </a>
            </div>
          </div>
        </div>
        <div className="flex-col my-50 bg-dark container-item">
          <p className="cursive">
            Follow
          </p>
          <div className="flex-row">
            <div className="link-item">
              <a href="https://twitter.com/Nautical_Minds" target="_blank">
                <img className="social-icon twitter" src="/static/images/twitter/Twitter_Social_Icon_Square_White.svg"/>
              </a>
            </div>
            <div className="link-item">
              <a href="https://www.facebook.com/NauticalMindsMusic" target="_blank">
                <img className="social-icon facebook" src="/static/images/facebook/f_logo_RGB-Blue_58.png"/>
              </a>
            </div>
            <div className="link-item">
              <a href="https://www.instagram.com/nautical_minds" target="_blank">
                <img className="social-icon instagram" src="/static/images/instagram/IG_Glyph_Fill-0.png"/>
              </a>
            </div>
            <div className="link-item">
              <iframe allowtransparency="true" scrolling="no" frameBorder="no" src="https://w.soundcloud.com/icon/?url=http%3A%2F%2Fsoundcloud.com%2Fnautical-minds&color=orange_white&size=32" style={{width: "32px", height: "32px", margin: "auto"}}/> 
            </div>
          </div>
        </div>
        <div className="flex-col my-50 bg-dark container-item">
          <p className="cursive">Watch</p>
          <div className="video-container">
            <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/uCdglojfI0w" frameBorder="0" allow="encrypted-media; picture-in-picture" allowFullScreen></iframe>
          </div>
        </div>
        <footer className="footer">
          &copy; 2020 Nautical Records
        </footer>
      </div>
    )
  }
}
