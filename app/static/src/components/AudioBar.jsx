import MusicPlayer from '../components/MusicPlayer.js';
import AudioClock from './AudioClock.jsx';
import React from 'react';
import ReactDOM from 'react-dom';

export default class AudioBar extends React.Component{
    constructor(props) {
        super(props);
    }


    render() {
        let playButtonClass;
        if (this.props.isPlaying) {
            playButtonClass = "fa fa-pause my-auto mx-1 p-1";
        } else {
            playButtonClass = "fa fa-play my-auto mx-1 p-1";
        }
        return (
            <nav className="navbar fixed-bottom bg-dark" id="audio_bar">
                <div className="d-inline-flex w-100 justify-content-between">
                    <div className="d-flex m-auto w-100" id="audioBar">
                        <i className="fas fa-step-backward my-auto mx-1 p-1" id="step_backward_button"
                           onClick={this.props.onPrev}/>
                        <i className={playButtonClass} aria-hidden="true" id="play_pause_button"
                           onClick={this.props.onPlayPause}/>
                        <i className="fas fa-step-forward my-auto mx-1 p-1" id="step_forward_button"
                           onClick={this.props.onNext}/>
                        {/*<AudioClock audioCtx={this.props.audioCtx}/>*/}
                        <input className="my-auto mx-2" type="checkbox" name="autoplay" id="autoplay"/>
                        <label className="my-auto mx-2" htmlFor="autoplay" id="autoplay_label"
                               onClick={null}>Autoplay</label>
                    </div>
                </div>
            </nav>
        )
    }
}

AudioBar.defaultProps = {
    isPlaying: false
};
