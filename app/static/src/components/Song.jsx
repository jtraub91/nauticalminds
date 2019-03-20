import React from 'react';

export default class Song extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        let imgStyle;
        if (this.props.isActive && this.props.isPlaying){
            imgStyle = {
                display: "block",
                height: "40px",
                width: "auto",
                animation: "pulsing infinite 1s linear",
            }
        } else if (this.props.isActive) {
            imgStyle = {
                display: "block",
                height: "40px",
                width: "auto",
            }
        } else {
            imgStyle = {
                display: "none",
            }
        }
        let canvasDisplay;
        if (this.props.isActive){
            canvasDisplay = {
                display: "block",
                border: "solid 1px white",
            }
        } else {
            canvasDisplay = {
                display: "none",
            }
        }
        return(
            <div className="d-flex flex-column justify-content-center align-items-center" id={this.props.songData.id}>
                <div className="d-inline-flex">
                    <img className="my-auto mx-1"
                         src="https://openclipart.org/download/261339/big-rocket-blast-off-fat.svg"
                         style={imgStyle}/>
                    <h4 className="my-auto mx-1">{this.props.songData.title}</h4>
                </div>
                <canvas style={canvasDisplay}/>
            </div>
        )
    }
}

Song.defaultProps = {
    songData: {
        id: "id",
        title: "Title"
    },
    isActive: false,
    isPlaying: false,
};
