import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import AudioBar from './components/AudioBar.jsx';
import About from './routes/About.jsx';

var SRC_LIST = [
  {
    src: "/music/nautical_minds_ep/gotta_let_you_know.wav",
    downloadUrl: "/music/nautical_minds_ep/gotta_let_you_know.mp3?download=True",
    title: "Nautical Minds - Gotta Let You Know",
    infoUrl: "/info?song_id=1"
  },
  {
    src: "/music/nautical_minds_ep/aint_gotta_care.wav",
    downloadUrl: "/music/nautical_minds_ep/aint_gotta_care.mp3?download=True",
    title: "Nautical Minds - Ain't Gotta Care",
    infoUrl: "/info?song_id=2"
  },
  {
    src: "/music/nautical_minds_ep/funk1.wav",
    downloadUrl: "/music/nautical_minds_ep/funk1.mp3?download=True",
    title: "Nautical Minds - Funk 1 (ft. B.I.G. Jay)",
    infoUrl: "/info?song_id=3"
  },
  {
    src: "/music/nautical_minds_ep/spacy_stacy.wav",
    downloadUrl: "/music/nautical_minds_ep/spacy_stacy.mp3?download=True",
    title: "Nautical Minds - Spacy Stacy",
    infoUrl: "/info?song_id=4"
  },
  {
    src: "/music/nautical_minds_ep/sidestreet_robbery.wav",
    downloadUrl: "/music/nautical_minds_ep/sidestreet_robbery.mp3?download=True",
    title: "Nautical Minds - Side Street Robbery",
    infoUrl: "/info?song_id=5"
  }, 
  {
    src: "/music/nautical_minds_ep/off_the_clock.wav",
    downloadUrl: "/music/nautical_minds_ep/off_the_clock.mp3?download=True",
    title: "Nautical Minds - Off The Clock",
    infoUrl: "/info?song_id=6"
  },
];

export default class NauticalMinds extends React.Component {
  render(){
    return (
      <div>
        <div className="header">
          <div className="button-group">
            <button className="header-button nautical-btn purple" id="aboutButton">
              <Link to="/about">About</Link>
            </button>
          </div>
          <h1 style={{margin: "7.5px"}} id="nauticalMindsHeader">
            <a href="/" onClick={(e)=>e.preventDefault()}>Nautical Minds</a>
          </h1>
          <div className="button-group">
            {/* <button className="header-button nautical-btn green" id="connectButton">
              <a href="#">Connect</a>
            </button> */}

            <div className="loginIconContainer">
              <div className="user-icon-container">
                <img src="/static/images/nauticalstarship-alt.svg"/>
              </div>
            </div>
          
          </div>
        </div>
        {this.props.children}
        <AudioBar src={SRC_LIST} id="audioBar"/>
      </div>
    )
  }
}
