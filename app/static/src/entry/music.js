import 'jquery';
import 'popper.js';
import 'bootstrap';

import '../misc';
import React from 'react';
import ReactDOM from 'react-dom';
import MusicPlayer from "../components/MusicPlayer.jsx";

ReactDOM.render(<MusicPlayer/>, document.getElementById("music_player"));
