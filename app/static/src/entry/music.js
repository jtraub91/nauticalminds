import '../misc';
import '../components/AudioManager.js';
import React from 'react';
import ReactDOM from 'react-dom';
import AudioBar from '../components/AudioBar.jsx';
import Song from '../components/Song.jsx';
import MusicPlayer from "../components/MusicPlayer";


ReactDOM.render(<MusicPlayer/>, document.getElementById("music_player"));
