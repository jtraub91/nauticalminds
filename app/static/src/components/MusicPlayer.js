import React from 'react';
import Song from './Song.jsx';
import AudioBar from "./AudioBar.jsx";

export default class MusicPlayer extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            autoPlay: false,
            isPlaying: false,
            trackNo: 1,
            audioElement: null,
        };

        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.playPause = this.playPause.bind(this);
    }

    componentDidMount(){
        this.audioElement = document.getElementById("music_player").querySelector("audio");
    }

    next(){
        this.audioElement.pause();
        this.setState({
            isPlaying: false
        });

        let nextTrackNo = this.state.trackNo + 1;
        if (nextTrackNo > Object.keys(this.props.trackList).length){
            nextTrackNo = 1;
        }

        this.setState({
            trackNo: nextTrackNo
        });
    }

    playPause(){
        if (this.state.isPlaying){
            this.audioElement.pause();
            this.setState({
                isPlaying: false,
            });
        } else{
            this.audioElement.play();
            this.setState({
                isPlaying: true,
            });
        }
    }

    prev(){
        this.audioElement.pause();
        this.setState({
            isPlaying: false
        });
        if (this.audioElement.currentTime < 3) {
            // skip to prev track
            let prevTrackNo = this.state.trackNo - 1;
            if (prevTrackNo < 1){
                prevTrackNo = Object.keys(this.props.trackList).length;
            }
            this.setState({
                trackNo: prevTrackNo,
            });
        } else {
            // rewind to beginning
            this.audioElement.currentTime = 0;
        }
    }

    render(){
        return (
            <div>
                <audio src={this.props.trackList[this.state.trackNo].url} autoPlay={this.props.autoPlay}/>
                <h3 className="text-center"><u>Track List</u></h3>
                <Song songData={this.props.trackList[1]} isActive={this.state.trackNo === 1} isPlaying={this.state.isPlaying}/>
                <Song songData={this.props.trackList[2]} isActive={this.state.trackNo === 2} isPlaying={this.state.isPlaying}/>
                <Song songData={this.props.trackList[3]} isActive={this.state.trackNo === 3} isPlaying={this.state.isPlaying}/>
                <Song songData={this.props.trackList[4]} isActive={this.state.trackNo === 4} isPlaying={this.state.isPlaying}/>
                <Song songData={this.props.trackList[5]} isActive={this.state.trackNo === 5} isPlaying={this.state.isPlaying}/>
                <Song songData={this.props.trackList[6]} isActive={this.state.trackNo === 6} isPlaying={this.state.isPlaying}/>
                <AudioBar isPlaying={this.state.isPlaying}
                          onNext={this.next} onPrev={this.prev} onPlayPause={this.playPause}/>
            </div>
        )
    }
}

MusicPlayer.defaultProps = {
    trackList: {
        1: {
            title: "Gotta Let You Know",
            id: "gotta_let_you_know",
            url: "/static/music/nautical_minds_ep/mp3/gotta_let_you_know.mp3",
        },
        2: {
            title: "Ain't Gotta Care",
            id: "aint_gotta_care",
            url: "/static/music/nautical_minds_ep/mp3/aint_gotta_care.mp3",
        },
        3: {
            title: "Funk 1",
            id: "funk_1",
            url: "/static/music/nautical_minds_ep/mp3/funk1.mp3",
        },
        4: {
            title: "Spacy Stacy",
            id: "spacy_stacy",
            url: "/static/music/nautical_minds_ep/mp3/spacy_stacy.mp3",
        },
        5: {
            title: "Side Street Robbery",
            id: "sidestreet_robbery",
            url: "/static/music/nautical_minds_ep/mp3/sidestreet_robbery.mp3",
        },
        6: {
            title: "Off The Clock",
            id: "off_the_clock",
            url: "/static/music/nautical_minds_ep/mp3/off_the_clock.mp3",
        },
    },
};
