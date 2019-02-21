import MusicPlayer from '../audio.js';
import AudioClock from './AudioClock.jsx';
import React from 'react';

export default class AudioBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            playButtonClass: "fa fa-play my-auto mx-1 p-1"
        };
        this.style = {
            label: {
                fontFamily: "ZCOOL QingKe HuangYou",
                fontSize: "1rem",
            }
        };
    }

    componentDidMount() {
        let playButton = document.querySelector("#play_pause_button");
        playButton.addEventListener('click', () => {
            if (this.props.audioCtx.isPlaying()) {
                this.props.audioCtx.pause();
                this.setState({
                    playButtonClass: "fa fa-pause my-auto mx-1 p-1"
                });
            } else {
                this.props.audioCtx.play();
                this.setState({
                    playButtonClass: "fa fa-play my-auto mx-1 p-1"
                });
            }
        });

        let forwardButton = document.querySelector("#step_forward_button");
        forwardButton.addEventListener('click', () => {
            MusicPlayer.next();
        });
    }

    componentWillUnmount() {
        let playButton = document.querySelector("#play_pause_button");
        playButton.removeEventListener('click', () => {
            if (this.props.audioCtx.isPlaying()) {
                this.props.audioCtx.pause();
                this.setState({
                    playButtonClass: "fa fa-pause my-auto mx-1 p-1"
                });
            } else {
                this.props.audioCtx.play();
                this.setState({
                    playButtonClass: "fa fa-play my-auto mx-1 p-1"
                });
            }
        });
    }


    render() {
        let playButtonClass;
        if (this.props.audioCtx.isPlaying()) {
            playButtonClass = "fa fa-pause my-auto mx-1 p-1";
        } else {
            playButtonClass = "fa fa-play my-auto mx-1 p-1";
        }
        return (
            <nav className="navbar fixed-bottom bg-dark">
                <div className="d-inline-flex w-100 justify-content-between">
                    <div className="d-flex m-auto w-100" id="audioBar">
                        <i className="fas fa-step-backward mx-1 p-1" id="step_backward_button"/>
                        <i className={playButtonClass} aria-hidden="true" id="play_pause_button"/>
                        <i className="fas fa-step-forward mx-1 p-1" id="step_forward_button"/>
                        <AudioClock audioCtx={this.props.audioCtx}/>
                        <input className="my-auto mx-2" type="checkbox" name="autoplay" id="autoplay" value="true"/>
                        <label className="my-auto mr-1" style={this.style.label} htmlFor="autoplay">Autoplay</label>
                    </div>
                </div>
            </nav>
        )
    }
}
