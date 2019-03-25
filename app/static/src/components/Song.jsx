import React from 'react';
import $ from "jquery";

export default class Song extends React.Component{
    constructor(props) {
        super(props);
        this.onPlay = this.onPlay.bind(this);
    }

    onPlay(){
        this.props.trackCallback(this.props.trackNo);
        this.props.playCallback();
    }

    render(){
        let playButtonClass;
        if (this.props.isPlaying){
            playButtonClass = "fa fa-pause my-auto mx-auto hover";
        } else {
            playButtonClass = "fa fa-play my-auto mx-auto hover";
        }
        let imgStyle;
        if(this.props.rocket === true){
            imgStyle = {
                height: "35px",
                width: "auto",
                display: "block",
                top: "-18px",
            };
            if (this.props.isPlaying){
                imgStyle = $.extend({}, {
                    animation: "pulsing infinite 1s linear",
                }, imgStyle);
            }
        } else {
            imgStyle = {
                display: "none",
            }
        }

        return(
            <div className="d-inline-flex" style={{height: "35px"}}>
                <div style={{height: "auto", width: "35px"}}>
                    <img src="/static/images/openclipart/svg/big-rocket-blast-off-fat.svg"
                         className="mx-auto" style={imgStyle} id="rocket"/>
                </div>
                <div className="d-flex h-100" style={{width: "25px"}}>
                    <i className={playButtonClass} onClick={this.onPlay}/>
                </div>
                <h4 className="my-auto mx-2" style={{display: "block", width: "auto"}}>
                    {this.props.songTitle}
                </h4>
                <div className="my-auto" style={{display: "inline-block", color: "gray", width: "25px", height: "auto"}}>
                    <i className="fa fa-play mx-1 fa-xs my-auto" style={{display: "inline", color: "inherit"}}/>
                    <div className="my-auto" style={{display: "inline", color: "inherit"}}>
                        {this.props.songPlays}
                    </div>
                </div>
            </div>
        )
    }
}

Song.defaultProps = {
    songTitle: null,
    songPlays: null,
    isPlaying: false,
    playCallback: null,
    trackCallback: null,
    trackNo: null,
    rocket: false,
};
