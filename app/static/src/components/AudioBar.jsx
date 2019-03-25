import React from 'react';
import AudioClock from './AudioClock.jsx';

export default class AudioBar extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        let playButtonClass;
        if (this.props.isPlaying) {
            playButtonClass = "fa fa-pause my-auto mx-1 p-1 hover";
        } else {
            playButtonClass = "fa fa-play my-auto mx-1 p-1 hover";
        }

        let muteStyle = {};
        if (this.props.isMuted){
            muteStyle = {
                color: "dodgerblue",
            };
        }
        return (
            <nav className="navbar fixed-bottom bg-dark" id="audioNavbar">
                <div className="d-inline-flex w-100">
                    <i className="fas fa-volume-mute my-auto mx-2 hover" style={muteStyle}
                       data-toggle="tooltip" data-placement="top" title="Mute" onClick={this.props.onMute}/>
                    <i className="fas fa-volume-down my-auto mx-2 hover"
                       data-toggle="tooltip" data-placement="top" title="Vol Down" onClick={this.props.onVolDown}/>
                    <i className="fas fa-volume-up my-auto mx-2 hover"
                       data-toggle="tooltip" data-placement="top" title="Vol Up" onClick={this.props.onVolUp}/>
                    <i className="fas fa-step-backward my-auto ml-2 mr-1 hover" id="step_backward_button"
                       data-toggle="tooltip" data-placement="top" title="Back" onClick={this.props.onPrev}/>
                    <i className={playButtonClass} aria-hidden="true" id="play_pause_button"
                       data-toggle="tooltip" data-placement="top" title="Play" onClick={this.props.onPlayPause}/>
                    <i className="fas fa-step-forward my-auto mx-1 hover" id="step_forward_button"
                       data-toggle="tooltip" data-placement="top" title="Forward" onClick={this.props.onNext}/>
                    <div className="mx-3 my-auto" style={{fontFamily: 'Bookman', fontSize: "1.25rem"}} id="nowPlaying">
                        {this.props.nowPlaying}
                    </div>
                    <AudioClock trackTime={this.props.trackTime} trackDuration={this.props.trackDuration}/>
                </div>
            </nav>
        )
    }
}

AudioBar.defaultProps = {
    isPlaying: false,
    onAutoPlay: null,
    autoPlay: false,
    nowPlaying: null,
    onMute: null,
};
