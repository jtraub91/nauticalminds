import React from 'react';

const TIMESTAMP = Math.round(new Date().getTime());
const id = {
  audio: `audio_element_${TIMESTAMP}`,
  statusBarContainer: `status_bar_container_${TIMESTAMP}`,
  volumeButton: `volume_button_${TIMESTAMP}`,
}

const xxxsMediaMatch = window.matchMedia("screen");
const xxsMediaMatch = window.matchMedia("screen and (min-width: 210px)");
const xsMediaMatch = window.matchMedia("screen and (min-width: 430px)");
const smMediaMatch = window.matchMedia("screen and (min-width: 560px)");
const mdMediaMatch = window.matchMedia("screen and (min-width: 775px)");

function secondsToMMSS(floatTime) {
  if (floatTime == null || floatTime == undefined){
      return "--:--";
  }
  let sec = Math.floor(floatTime);
  let minutes = Math.floor(sec / 60);
  let seconds = Math.floor(floatTime - (minutes * 60));

  if (minutes < 10){
    minutes = "0" + minutes;
  }
  if (seconds < 10){
    seconds = "0" + seconds;
  }
  return minutes + ":" + seconds;
}

export default class AudioBar extends React.Component{
  constructor(props){
    super(props);

    this.audioElement = "";

    this.state = {
      statusBarStyle: {
        position: "absolute",
        height: "100%",
        width: "0",
      },
      mouseoverStatusBarStyle: {
        position: "absolute",
        height: "100%",
        width: "0",
        display: "none"
      },
      audioTime: null,  // change to clockTime with default
      audioDuration: null, // ^ similar
      trackNo: 0,
      audioMuted: false,
      dx: "0",
      dy: "0",
      controlsActive: ["playPause", "status", "bars"],
      // unordered list containing any of:
      // ["prev", "playPause", "next", "vol", "clock", "status", "info", "comment", "bars"]
      infoData: null,
      controlOpen: "",  // ["info"|"comment"|"bars"]
      playButtonClassName: "fa fa-play ctrl-btn audiobar-btn", // fa-play or fa-pause
    };

  }
  componentDidMount(){
    // audio
    window.onclick = ()=>{
      this.setState({
        controlOpen: null
      })
    }
    
    this.audioContext = new AudioContext();
    this.audioElement = document.getElementById(id.audio);
    this.audioSource = this.audioContext.createMediaElementSource(
      this.audioElement
    );
    this.gainNode = this.audioContext.createGain();

    this.audioSource.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    // audio event listeners
    this.audioElement.addEventListener("play", (e)=>{
      this.audioElement.autoplay = true;
      this.setState({
        playButtonClassName: "fa fa-pause ctrl-btn audiobar-btn"
      })
      this.intervalHandle = setInterval(()=>{
        let track = this.props.trackList[this.state.trackNo]
        let metaDuration = 8 * track.size / track.bitrate;
        let duration;
        if (this.audioElement.duration == Infinity){
          duration = metaDuration
        } else {
          duration = this.audioElement.duration;
        }
        this.setState({
          audioTime: this.audioElement.currentTime,
          audioDuration: duration,
          statusBarStyle: {
            position: "absolute",
            height: "100%",
            width: this.audioElement.currentTime / duration * 100 + "%",
          }
        });
      }, 699);
    });
    this.audioElement.addEventListener("ended", (e)=>{
      if (this.state.trackNo == this.props.trackList.length - 1){
        this.audioElement.autoplay = false;
      }
      this.setState({
        playButtonClassName: "fa fa-play ctrl-btn audiobar-btn"
      })
      clearInterval(this.intervalHandle);
      this.onNext();  // auto go to next song
    });
    this.audioElement.addEventListener("pause", (e)=>{
      this.setState({
        playButtonClassName: "fa fa-play ctrl-btn audiobar-btn"
      })
      clearInterval(this.intervalHandle);
    });
    this.audioElement.addEventListener("canplay", (e)=>{
      let track = this.props.trackList[this.state.trackNo]
      let metaDuration = 8 * track.size / track.bitrate;
      let duration;
      if (this.audioElement.duration == Infinity){
        duration = metaDuration
      } else {
        duration = this.audioElement.duration;
      }
      this.setState({
        audioTime: this.audioElement.currentTime,
        audioDuration: duration
      })
    });
    
    let statusBarContainer = document.getElementById(id.statusBarContainer);

    // status bar event listeners
    statusBarContainer.onclick = (e)=>{
      // set audio time and status bar style based upon where user clicks
      //    in status bar container
      let rect = statusBarContainer.getBoundingClientRect();
      let x = e.clientX - rect.left; //x position within the element.

      // var y = e.clientY - rect.top;  //y position within the element.
      let time = (x / statusBarContainer.offsetWidth) * this.state.audioDuration;
    
      console.log(time)
      this.audioElement.currentTime = time;
      this.setState({
        audioTime: time,
        statusBarStyle: {
          position: "absolute",
          height: "100%",
          width: time ? (((time / this.state.audioDuration) * 100) + "%") : "0",
        }
      });
    }
    statusBarContainer.addEventListener("mousemove", (e)=>{
      // follow mouse with status bar cursor
      let rect = statusBarContainer.getBoundingClientRect();
      let x = e.clientX - rect.left; // x position within the element.
      this.setState({
        mouseoverStatusBarStyle: {
          position: "absolute",
          height: "100%",
          width: (100 * x / statusBarContainer.offsetWidth) + "%",
          borderRight: "1px solid lawngreen",
        }
      });
    });
    statusBarContainer.addEventListener("mouseleave", (e)=>{
      // remove cursor when mouse leaves
      this.setState({
        mouseoverStatusBarStyle: {display: "none"}
      })
    });

    // other listeners
    this.volumeButton = document.getElementById(id.volumeButton);
    this.volumeButtonSlider = this.volumeButton.getElementsByTagName("input")[0];
    this.volumeButtonSlider.onchange = (e)=>{
      this.gainNode.gain.value = 10 ** (parseFloat(e.target.value) / 20);  // log scale
    }

    // set visible controls based on media match
    this.setControlsBasedOnMediaMatch();
    // and update on change to any
    xxxsMediaMatch.addEventListener("change", this.setControlsBasedOnMediaMatch);
    xxsMediaMatch.addEventListener("change", this.setControlsBasedOnMediaMatch);
    xsMediaMatch.addEventListener("change", this.setControlsBasedOnMediaMatch);
    smMediaMatch.addEventListener("change", this.setControlsBasedOnMediaMatch); 
    mdMediaMatch.addEventListener("change", this.setControlsBasedOnMediaMatch);
  }
  componentWillUnmount(){
    clearInterval(this.intervalHandle);
    clearInterval(this.statusIntervalHandle);
  }
  setControlsBasedOnMediaMatch = ()=>{
    // ["prev", "playPause", "next", "vol", "clock", "status", "info", "comment", "bars", "download"],
    if (mdMediaMatch.matches) {
      this.setState({
        controlsActive: ["prev", "playPause", "next", "vol", "clock", "status", "info", "bars", "download"],
      });
    } else if (smMediaMatch.matches) {
      this.setState({
        controlsActive: ["prev", "playPause", "next", "vol", "status", "info", "bars", "download"],
      });
    } else if (xsMediaMatch.matches) {
      this.setState({
        controlsActive: ["prev", "playPause", "next", "status", "info", "bars", "download"],
      })
    } else if (xxsMediaMatch.matches){
      this.setState({
        controlsActive: ["playPause", "status", "bars"],
      });
    } else if (xxxsMediaMatch.matches){
      this.setState({
        controlsActive: ["playPause", "bars"],
      })
    } else {
      console.log("else")
    }
  }
  onCommentSubmit = (e)=>{
    // untested
    e.preventDefault();
    console.log(e);
    // const MAX_LENGTH = 1000;
    // textarea.oninput = function(){
    //   if (textarea.textLength >= MAX_LENGTH){
    //     textarea.value = textarea.value.slice(0, MAX_LENGTH - 1);
    //   }
    // }
    // if (!textarea.value){
    //   let formAlert = document.createElement("div");
    //   formAlert.className = "form-alert comment error big";
    //   formAlert.innerHTML = "Empty";
    //   form.appendChild(formAlert);
    //   setTimeout(()=>{
    //     formAlert.remove();
    //   }, 3000);
    // } else {
    //   let spinnerDiv = document.createElement("div");
    //   Object.assign(spinnerDiv.style, {
    //     position: "absolute",
    //     top: "50%",
    //     left: "50%",
    //     transform: "translate(-50%, -50%)",
    //     width: "50px",
    //     height: "50px",
    //   });
    //   let spinner = document.createElement("div");
    //   spinner.className = "spinner-border"
    //   Object.assign(spinner.style, {
    //     position: "absolute",
    //     width: "50px",
    //     height: "50px",
    //     // top: "50%",
    //     // left: "50%",
    //     // transform: "translate(-50%, -50%)"
    //   });
    //   spinnerDiv.appendChild(spinner);
    //   form.appendChild(spinnerDiv);
      // $.post({
      //   url: '/comment',  // todo: sync trackNo and song_id from db
      //   headers: {
      //     "X-CSRF-TOKEN": document.getElementById("_csrf_token").value,
      //     "Content-Type": "application/json"
      //   },
      //   data: JSON.stringify({
      //     comment: textarea.value,
      //   }),
      //   dataType: 'json',
      //   success: (res)=>{
      //     spinner.remove();
      //     if (res.status == "success"){
      //       textarea.value = "";  // reset textarea
      //       let formAlert = document.createElement("div");
      //       formAlert.className = "form-alert comment success big";
      //       formAlert.innerHTML = res.message;
      //       form.appendChild(formAlert);
      //       setTimeout(()=>{
      //         formAlert.remove();
      //       }, 3000);
      //     } else if (res.status == "error") {
      //       let formAlert = document.createElement("div");
      //       formAlert.className = "form-alert comment error big";
      //       formAlert.innerHTML = res.message;
      //       form.appendChild(formAlert);
      //       setTimeout(()=>{
      //         formAlert.remove();
      //       }, 3000);
      //     }
      //     console.log(res)
      //   },
      //   error: (e)=>{
      //     let formAlert = document.createElement("div");
      //     formAlert.className = "form-alert comment error big";
      //     formAlert.innerHTML = "An unexpected error occured. Please try again.";
      //     form.appendChild(formAlert);
      //     setTimeout(()=>{
      //       formAlert.remove();
      //     }, 3000);
      //     spinner.remove();
      //     console.log(e)
      //   }
      // });
    // }
  }
  onPlayPause = ()=>{
    if (this.audioContext.state == "suspended"){
      this.audioContext.resume();
    }
    if (this.audioElement.paused === true){
      this.audioElement.play();
    } else {
      this.audioElement.pause();
    }
  }
  onNext = ()=>{
    let next = this.state.trackNo + 1;
    if (next < this.props.trackList.length) {
      this.setState({
        trackNo: next,
        infoData: null,
        dx: "0"
      })
    } else {
      this.setState({
        trackNo: 0,
        infoData: null,
        dx: "0"
      });
    }
  }
   onPrev = ()=>{
    let prev = this.state.trackNo - 1;
    if(this.state.audioTime > 2) {
      this.audioElement.currentTime = 0
    } else if (prev >= 0) {
      this.setState({
        trackNo: prev,
        infoData: null,
        dx: "0"
      });
    } else {
      this.setState({
        trackNo: this.props.trackList.length + prev,
        infoData: null,
        dx: "0"
      });
    }    
  }
  onInfo = (e)=>{
    e.stopPropagation();
    if (this.state.controlOpen === "info") {
      this.setState({
        controlOpen: null
      });
    } else {
      this.setState({
        controlOpen: "info"
      });
    }
  }
  onComment = (e)=>{
    e.stopPropagation();
    if (this.state.controlOpen === "comment") {
      this.setState({
        controlOpen: null
      });
    } else {
      this.setState({
        controlOpen: "comment"
      });
    }
  }
  onBars = (e)=>{
    e.stopPropagation();
    if (!this.props.trackList[this.state.trackNo] || this.state.controlOpen === "bars") {
      this.setState({
        controlOpen: null
      });
    } else {
      this.setState({
        controlOpen: "bars"
      });
    }
  }
  onClickBarsItem = (src)=>{
    let index = this.props.trackList.findIndex((el)=>{
      return el === src
    });
    this.setState({
      trackNo: index
    });
  }
  onMute = ()=>{
    this.setState({
      audioMuted: !this.state.audioMuted
    });
  }
  onDownload = (e)=>{
    e.stopPropagation();
    //
  }
  render(){    
    let volumeButtonClass;
    if (this.state.audioMuted){
      volumeButtonClass = "fa fa-volume-off ctrl-btn audiobar-btn";
    } else {
      volumeButtonClass = "fa fa-volume-up ctrl-btn audiobar-btn vol-btn-animation";
    }
    let title = "";
    let src = undefined;
    if (this.props.trackList.length > 0){
      title = this.props.trackList[this.state.trackNo].title;
      if (this.props.trackList[this.state.trackNo].altUri){
        src = this.props.trackList[this.state.trackNo].altUri;
      } else {
        let metaUri = this.props.trackList[this.state.trackNo].uri;
        if (metaUri.startsWith("ipfs://")) {
          src = `/ipfs/${metaUri.split("ipfs://")[1]}?file_type=mp3`;
        } else {
          src = metaUri;
        }
      }
    } else {
      title = this.props._disabledStatus;
    }
    return (
      <div className="audioBar">
        <div className="audiobar-container">
          <div className="audioBarControls">
            <button className="fas fa-step-backward ctrl-btn audiobar-btn" 
              style={this.state.controlsActive.indexOf("prev") >= 0 ? {} : {display: "none"}}
              title="Back" onClick={this.onPrev}/>
            <button className={this.state.playButtonClassName} id="playButton"
              style={this.state.controlsActive.indexOf("playPause") >= 0 ? {} : {display: "none"}}
              title="Play" onClick={this.onPlayPause}/>
            <button className="fas fa-step-forward ctrl-btn audiobar-btn" 
              style={this.state.controlsActive.indexOf("next") >= 0 ? {} : {display: "none"}}
              title="Forward" onClick={this.onNext}/>
            <i style={this.state.controlsActive.indexOf("vol") >= 0 ? {} : {display: "none"}}
              className={volumeButtonClass} 
              id={id.volumeButton}>
              <input className="vol-slider"
                type="range" min="-36" max="6" step="0.5" defaultValue="0" />
            </i>
          </div>
          <div className="flex flex-row" style={{right: "0", bottom: "7.5px", width: "100%", justifyContent: "flex-end"}}>
            <div className="flex flex-row" style={{width: "100%", justifyContent: "flex-end"}}>
              <div className="clock"
                style={this.state.controlsActive.indexOf("clock") >= 0 ? {} : {display: "none"}}>
                <div className="clock-digit-container">
                  <span className="clock-digit">{secondsToMMSS(this.state.audioTime)}</span>
                </div>
                <div className="clock-digit-container">
                  <span className="clock-digit">{secondsToMMSS(this.state.audioDuration)}</span>
                </div>
              </div>
              <div style={this.state.controlsActive.indexOf("status") >= 0 ? {}: {display: "none"}}
                className="status">
                <div className="absolute w-full h-full" id={id.statusBarContainer}>
                  <div style={this.state.statusBarStyle} className="status-invert"/>
                  <div style={this.state.mouseoverStatusBarStyle}/>
                </div>
                <div className="status-title">
                  {title}
                </div>
              </div>
            </div>
            <div className="audioBarControls">
              <button className="fas fa fa-info-circle audiobar-btn green"
                title="Song Info"
                onClick={this.onInfo}
                style={this.state.controlsActive.indexOf("info") >= 0 ? {} : {display: "none"}}/>
              <button className="far fa-comment alt audiobar-btn green"
                title="Comment"
                onClick={this.onComment}
                style={this.state.controlsActive.indexOf("comment") >= 0 ? {} : {display: "none"}}/>
              <button className="fas fa-bars audiobar-btn green"
                title="Track List"
                onClick={this.onBars}
                style={this.state.controlsActive.indexOf("bars") >= 0 ? {} : {display: "none"}}/>
              <button className="fa fa-download alt green audiobar-btn" 
                style={this.state.controlsActive.indexOf("download") >= 0 ? {} : {display: "none"}} 
                title="Download"
                onClick={this.onDownload}/>
            </div>
          </div>
          <audio src={src} id={id.audio}/>
        </div>
        <div onClick={(e)=>e.stopPropagation()}
          className="info-container" style={this.state.controlOpen == "info" ? {} : {display: "none"}}>
          {
            this.props.trackList ? 
            <div className="flex flex-col font-mono justify-between">
              <div className="flex h-4">
                <span className="w-4/12 my-auto mx-0.5 text-right">Track:</span>
                <span className="w-8/12 my-auto mx-1 text-left">{this.props.trackList[this.state.trackNo].track}</span>
              </div>
              <div className="flex h-4">
                <span className="w-4/12 my-auto mx-0.5 text-right">Artist:</span>
                <span className="w-8/12 my-auto mx-1 text-left">{this.props.trackList[this.state.trackNo].artist}</span>
              </div>
              <div className="flex h-4">
                <span className="w-4/12 my-auto mx-0.5 text-right">Album:</span>
                <span className="w-8/12 my-auto mx-1 text-left">{this.props.trackList[this.state.trackNo].album}</span>
              </div>
              <div className="flex h-4">
                <span className="w-4/12 my-auto mx-0.5 text-right">Title:</span>
                <span className="w-8/12 my-auto mx-1 text-left">{this.props.trackList[this.state.trackNo].title}</span>
              </div>
              <div className="flex h-4">
                <span className="w-4/12 my-auto mx-0.5 text-right">Year:</span>
                <span className="w-8/12 my-auto mx-1 text-left">{this.props.trackList[this.state.trackNo].year}</span>
              </div>
            </div>
            : null
          }                   
        </div>
        <div className="comment-container" style={this.state.controlOpen == "comment" ? {} : {display: "none"}}>
          <form className="flex-col">
            <textarea placeholder="Leave a comment"/>
            <button className="fa fa-undo blue top-right comment-reset-btn" type="reset"/>
            <button className="green black bottom-right form-btn">Submit</button>
          </form>
        </div>
        <div className="bars-container" style={this.state.controlOpen == "bars" ? {} : {display: "none"}}>
          <div className="flex flex-col">
            {
              this.props.trackList ? 
              this.props.trackList.map(
                (track)=>
                  <a className="bars-container-item" href="#"
                    key={`bars_track_${this.props.trackList.indexOf(track)}`}
                    onClick={(e)=>{e.preventDefault(); this.onClickBarsItem(track)}}>
                    {track.track}. {track.title}
                  </a>
              ) :
              {}
            }
          </div>
        </div>
        <div className="download-container" style={this.state.controlOpen == "download" ? {} : {display: "none"}}>
          <div className="flex flex-col">
            <button></button>
          </div>
        </div>
      </div>
    );
  }
}