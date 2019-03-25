import React from 'react';


export default class AudioClock extends React.Component {
    constructor(props) {
        super(props);
    }

    secondsToMMSS(float_time) {
        if (float_time === null || float_time === undefined){
            return "--:--";
        }
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
        return (
            <div className="my-auto mx-2" style={{fontFamily: "Bookman", fontSize: "1.25rem"}}>
                <span className="my-auto mx-1" id="current_clock">
                    {this.secondsToMMSS(this.props.trackTime)}
                </span>
                <span className="my-auto mx-1">|</span>
                <span className="my-auto mx-1">
                    {this.secondsToMMSS(this.props.trackDuration)}
                </span>
            </div>
        )
    }
}
