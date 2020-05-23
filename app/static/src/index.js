import React from 'react';
import ReactDOM from 'react-dom';
import AudioBar from './components/AudioBar.jsx';
import './modals';

var play = document.getElementById("playMusicVideo");
var video = null;
var videoContainer = document.getElementById("videoContainer");
play.onclick = function () {
  if (!video){
    video = document.createElement("video");
    videoContainer.appendChild(video);
    video.style.width = "75%";
    video.style.height = "auto";
    video.style.backgroundColor = "rgba(0,0,0,0.75)";
  }
  
  ReactDOM.render(
    <AudioBar videoSrc="/static/video/nautical_minds_gotta_let_you_know_official_music_video_trim.mp4"/>, 
    document.getElementById("audioBar")
  );
  play.style.display = "none";
};

ReactDOM.render(<AudioBar 
  src={[
    {
      src: "/static/music/nautical_minds_ep/mp3/gotta_let_you_know.mp3",
      title: "Nautical Minds - Gotta Let You Know",
      releaseDate: "September 11, 2015",
      artist: "Nautical Minds",
      infoUrl: "/static/music/nautical_minds_ep/mp3/gotta_let_you_know.json"
    },
    {
      src: "/static/music/nautical_minds_ep/mp3/aint_gotta_care.mp3",
      title: "Nautical Minds - Ain't Gotta Care",
      releaseDate: "September 11, 2015",
      artist: "Nautical Minds",
      infoUrl: "/static/music/nautical_minds_ep/mp3/aint_gotta_care.json"
    },
    {
      src: "/static/music/nautical_minds_ep/mp3/funk1.mp3",
      title: "Nautical Minds - Funk 1 (ft. B.I.G. Jay)",
      releaseDate: "September 11, 2015",
      artist: "Nautical Minds",
      infoUrl: "/static/music/nautical_minds_ep/mp3/funk1.json"
    },
    {
      src: "/static/music/nautical_minds_ep/mp3/spacy_stacy.mp3",
      title: "Nautical Minds - Spacy Stacy",
      releaseDate: "September 11, 2015",
      artist: "Nautical Minds",
      infoUrl: "/static/music/nautical_minds_ep/mp3/spacy_stacy.json"
    },
    {
      src: "/static/music/nautical_minds_ep/mp3/sidestreet_robbery.mp3",
      title: "Nautical Minds - Side Street Robbery",
      releaseDate: "September 11, 2015",
      artist: "Nautical Minds",
      infoUrl: "/static/music/nautical_minds_ep/mp3/sidestreet_robbery.json"
    }, 
    {
      src: "/static/music/nautical_minds_ep/mp3/off_the_clock.mp3",
      title: "Nautical Minds - Off The Clock",
      releaseDate: "September 11, 2015",
      artist: "Nautical Minds",
      infoUrl: "/static/music/nautical_minds_ep/mp3/off_the_clock.json"
    },
  ]} id="audioBar"/>,
  document.getElementById("audioBar")
);