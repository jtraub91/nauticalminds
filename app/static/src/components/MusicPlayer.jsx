import $ from 'jquery';
import React from 'react';
import Song from './Song.jsx';
import AudioBar from "./AudioBar.jsx";
// import ColorBox from "./ColorBox.jsx";

export default class MusicPlayer extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            trackNo: 1,
            trackTime: null,
            trackDuration: null,
            autoPlay: false,
            isPlaying: false,
            isMuted: false,
            gain: 1,
        };

        // assigned in componentDidMount
        this.audioElement = null;
        this.audioContext = null;
        this.sourceNode = null;
        this.gainNode = null;
        this.analyserNode = null;


        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.playPause = this.playPause.bind(this);
        this.mute = this.mute.bind(this);
        this.setTrackNo = this.setTrackNo.bind(this);
        this.volDown = this.volDown.bind(this);
        this.volUp = this.volUp.bind(this);
        this.drawRadiantCircle = this.drawRadiantCircle.bind(this);
    }

    componentDidMount(){
        this.audioElement = document.getElementById("music_player").querySelector("audio");

        // audio event listeners
        this.audioElement.addEventListener("ended", ()=>{
            this.setState({
                isPlaying: false,
            });
            if (this.state.autoPlay){
                this.next();
            }
        });
        this.audioElement.addEventListener("pause", ()=>{
            this.setState({
               isPlaying: false,
            });
        });
        this.audioElement.addEventListener("loaded", ()=>{
            this.setState({
                trackTime: this.audioElement.currentTime,
                trackDuration: this.audioElement.duration
            })
        });
        this.audioElement.addEventListener("play", ()=>{
            this.setState({
                isPlaying: true,
            });
            // post to api to increment database song play counter
            // todo: clean this up
            $.ajax({
                url: '/plays/' + songTags[this.state.trackNo - 1],
                type: 'POST',
                contentType: "application/json",
                success: (data)=>{
                    console.log("success");
                    console.log(data);
                },
                error: (e)=>{
                    console.log("error");
                    console.log(e);
                }
            });
        });

        // retrieve plays for each song
        // kinda hacky; todo: make this better
        let songTags = ["gotta_let_you_know", "aint_gotta_care", "funk1", "spacy_stacy", "sidestreet_robbery", "off_the_clock"];
        for (let i = 0; i < songTags.length; i++){
            $.ajax({
                url: '/plays/' + songTags[i],
                type: 'GET',
                contentType: "application/json",
                success: (data)=>{
                    console.log("success");
                    console.log(data);
                    this.state[songTags[i]] = data.plays
                },
                error: (e)=>{
                    console.log("error");
                    console.log(e);
                }
            });
        }

        // I think I should move this to Audio Clock perhaps give a prop ref to the element
        this.clockId = setInterval(()=>{
            this.setState({
                trackTime: this.audioElement.currentTime,
                trackDuration: this.audioElement.duration,
            });
        }, 1000);
        // kinda cool, idk keep?
        document.body.onkeyup = (e)=>{
            if (e.keyCode === 32){
                this.playPause();
            }
        }
    }

    componentWillUnmount(){
        clearInterval(this.clockId)
    }

    next(){
        console.log("next");
        this.audioElement.pause();

        let nextTrackNo = this.state.trackNo + 1;
        if (nextTrackNo > Object.keys(this.props.trackList).length){
            nextTrackNo = 1;
        }

        this.setState({
            trackNo: nextTrackNo
        });
        this.moveRocket(nextTrackNo);
    }

    moveRocket(trackNo){
        console.log("moveRocket");
        let img = document.querySelector("#rocket");
        img.style.transition = "transform 1s ease 0.1s";
        img.style.transform = "translateY(" + ((trackNo - 1) * 35) + "px)";
        console.log((trackNo - 1) * 35);
    }

    playPause(){
        if (!this.audioContext){
            // new audio context
            this.audioContext = new AudioContext();

            // create audio nodes
            this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);
            this.gainNode = this.audioContext.createGain();
            this.analyserNode = this.audioContext.createAnalyser();

            // form audio graph
            this.sourceNode.connect(this.gainNode);
            this.sourceNode.connect(this.analyserNode);
            this.gainNode.connect(this.audioContext.destination);

            // after users first click set autoPlay to true
            this.setState({
                autoPlay: true,
            });
        }
        if (this.state.isPlaying){
            this.audioElement.pause();
        } else {
            this.audioElement.play();
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
            this.moveRocket(prevTrackNo);
        } else {
            // rewind to beginning
            this.audioElement.currentTime = 0;
        }
    }
    mute(){
        if (this.state.isMuted){
            // unmute
            this.gainNode.gain.value = this.state.gain;
        } else {
            // mute
            this.gainNode.gain.value = 0;
        }

        this.setState({
            isMuted: !this.state.isMuted,
        });
    }
    volDown(){
        let step = 0.05;
        if (this.gainNode.gain.value > 0) {
            this.gainNode.gain.value = this.gainNode.gain.value - step;
        }
    }
    volUp(){
        let step = 0.05;
        if (this.gainNode.gain.value < 1) {
            this.gainNode.gain.value = this.gainNode.gain.value + step;
        }
    }

    setTrackNo(trackNo){
        this.setState({
            trackNo: trackNo
        });
        this.moveRocket(trackNo);
    }

    noteOctaveToFrequency(note, octave) {
        let a4 = 440; // Hz
        // calculate steps
        let dict = {
            "a": 0,
            "d": 5,
            "g": 10,
        };
        let delta = dict[note];
        delta = delta + (octave - 4) * 12;
        return a4 * Math.pow(2, delta / 12);
    }

    drawRadiantCircle(node, array, ctx, canvas){
        /*
            note | color
            ---- | ----
              A  | red
              D  | green
              G  | blue

            Algorithm:

            For each octave, convolve the frequency array with a bell curve weighted function,
                centered on its frequency, respectively, for each of r, g, & b.
                Use magnitudes to correspond to r, g, & b, respectively. (i.e. determines color)
                Radius increases with higher octaves but lower octaves are on top
                    and radius inversely proportional to octave

            Radiant Circles By Jason Traub
         */
        // ctx.clearRect(0,0, canvas.width, canvas.height);
        // node.getByteFrequencyData(array);
        //
        // let power = 0;
        // array.map((val)=>{
        //     power = power + val * val;
        // });
        // power = power / array.length;
        // power = Math.sqrt(power);
        // console.log(power);
        //
        // let r0 = 64; // px
        // let center = [Math.floor(canvas.width / 2), Math.floor(canvas.height / 2)];
        //
        // // node.getByteFrequencyData(array);
        // let freqResolution = node.context.sampleRate / (node.fftSize);
        //
        // let freq;
        //
        // let notes = ["a", "d", "g"];
        // let index; let red; let green; let blue;
        // for (let oct = 4; oct > 3; oct--){
        //     for (let i = 0; i < 3; i++){
        //         freq = this.noteOctaveToFrequency(notes[i], oct);
        //         index = Math.round(freq / freqResolution);
        //         if (i === 0){
        //             red = array[index];
        //         } else if (i === 1){
        //             green = array[index];
        //         } else if (i === 2){
        //             blue = array[index];
        //         }
        //     }
        //     ctx.fillStyle = "rgba(" + red + "," + green + "," + blue + "," + power + ")";
        //     ctx.beginPath();
        //     ctx.arc(center[0], center[1], r0, 0, 2 * Math.PI);
        //     ctx.fill();
        //     // console.log(r0);
        //     // console.log(red); console.log(green); console.log(blue);
        //     r0 = r0 / 2;
        // }
    }

    render(){
        return (
            <div className="d-flex flex-column justify-content-center align-items-center">
                <audio src={this.props.trackList[this.state.trackNo].url} autoPlay={this.state.autoPlay}/>
                <h3 style={{whiteSpace: "nowrap"}}><u>Track List</u></h3>
                <div className="d-flex flex-column">
                    <Song trackNo={1} songTitle={this.props.trackList[1].title}
                          isPlaying={this.state.trackNo === 1 && this.state.isPlaying}
                          songPlays={this.state.gotta_let_you_know} rocket={true}
                          playCallback={this.playPause} trackCallback={this.setTrackNo}/>
                    <Song trackNo={2} songTitle={this.props.trackList[2].title}
                          isPlaying={this.state.trackNo === 2 && this.state.isPlaying}
                          songPlays={this.state.aint_gotta_care}
                          playCallback={this.playPause} trackCallback={this.setTrackNo}/>
                    <Song trackNo={3} songTitle={this.props.trackList[3].title}
                          isPlaying={this.state.trackNo === 3 && this.state.isPlaying}
                          songPlays={this.state.funk1}
                          playCallback={this.playPause} trackCallback={this.setTrackNo}/>
                    <Song trackNo={4} songTitle={this.props.trackList[4].title}
                          isPlaying={this.state.trackNo === 4 && this.state.isPlaying}
                          songPlays={this.state.spacy_stacy}
                          playCallback={this.playPause} trackCallback={this.setTrackNo}/>
                    <Song trackNo={5} songTitle={this.props.trackList[5].title}
                          isPlaying={this.state.trackNo === 5 && this.state.isPlaying}
                          songPlays={this.state.sidestreet_robbery}
                          playCallback={this.playPause} trackCallback={this.setTrackNo}/>
                    <Song trackNo={6} songTitle={this.props.trackList[6].title}
                          isPlaying={this.state.trackNo === 6 && this.state.isPlaying}
                          songPlays={this.state.off_the_clock}
                          playCallback={this.playPause} trackCallback={this.setTrackNo}/>
                </div>
                {/*<ColorBox isPlaying={this.state.isPlaying} analyserNode={this.analyserNode} drawCallback={this.drawRadiantCircle}/>*/}

                <AudioBar isPlaying={this.state.isPlaying} isMuted={this.state.isMuted}
                          onNext={this.next} onPrev={this.prev} onPlayPause={this.playPause} onMute={this.mute}
                          onVolDown={this.volDown} onVolUp={this.volUp}
                          trackTime={this.state.trackTime} trackDuration={this.state.trackDuration}
                          nowPlaying={this.props.trackList[this.state.trackNo].title}/>
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
