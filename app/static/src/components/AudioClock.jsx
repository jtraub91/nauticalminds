import React from 'react';


export default class AudioClock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            duration: this.props.audioCtx.getDuration(),
            currentTime: this.props.audioCtx.getCurrentTime()
        };
        this.style = {
            span: {
                fontFamily: "ZCOOL QingKe HuangYou"
            },
            div: {
                backgroundColor: "black",
            }
        };
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.getTime(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    getTime() {
        this.setState({
            currentTime: this.props.audioCtx.getCurrentTime(),
            duration: this.props.audioCtx.getDuration(),
        })
    }

    secondsToMMSS(float_time) {
        let sec = Math.floor(float_time);
        let minutes = Math.floor(sec / 60);
        let seconds = Math.floor(float_time - (minutes * 60));

        if (minutes < 10){
            minutes = "0" + minutes;
        }
        if (seconds < 10){
            seconds = "0" + seconds;
        }
        return minutes + ":" + seconds;
    }

    render() {
        let currentTime;
        let duration;
        let slash;

        if (this.state.currentTime) {
            currentTime = this.secondsToMMSS(this.state.currentTime);
        } else {
            currentTime = "";
        }

        if (this.state.duration) {
            duration = this.secondsToMMSS(this.state.duration);
            slash = "/";
        } else {
            duration = "";
            slash = "";
        }

        return (
            <div className="my-auto mx-1" style={this.style.div} id="clock">
                <span className="my-auto mx-1" style={this.style.span} id="current_clock">{currentTime}</span>
                <span className="my-auto" style={this.style.span}>{slash}</span>
                <span className="my-auto mx-1" style={this.style.span} id="total_clock">{duration}</span>
            </div>
        )
    }
}
