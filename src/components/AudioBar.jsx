import React from 'react';

const TIMESTAMP = Math.round(new Date().getTime());
const STATUS_DX = 60;
const id = {
  audio: `audio_element_${TIMESTAMP}`,
  statusText: `status_text_${TIMESTAMP}`,
  statusBarContainer: `status_bar_container_${TIMESTAMP}`,
  infoButton: `info_button_${TIMESTAMP}`,
  commentButton: `comment_button_${TIMESTAMP}`,
  barsButton: `bars_button_${TIMESTAMP}`,
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
      buttonsActive: ["playPause", "status", "bars"],
      // unordered list containing any of:
      // ["prev", "playPause", "next", "vol", "clock", "status", "info", "comment", "bars"]
      infoData: null,
      controlOpen: "",  // ["info"|"comment"|"bars"]
      playButtonClassName: "fa fa-play ctrl-btn audiobar-btn", // fa-play or fa-pause
    };

  }
  componentDidMount(){
    // audio
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
        this.setState({
          audioTime: this.audioElement.currentTime,
          audioDuration: this.audioElement.duration,
          statusBarStyle: {
            position: "absolute",
            height: "100%",
            width: this.audioElement.currentTime / this.audioElement.duration * 100 + "%",
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
      this.setState({
        audioTime: this.audioElement.currentTime,
        audioDuration: this.audioElement.duration
      })
    });
    
    let statusText = document.getElementById(id.statusText);
    let statusTextClientWidth = Number(statusText.getClientRects()[0].width);
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
    // timers
    if (this.props.animateStatus){
      this.statusIntervalHandle = setInterval(()=>{
        if (parseInt(this.state.dx) > STATUS_DX - Math.floor(3.0 * statusTextClientWidth)){
          this.setState({
            dx: parseInt(dx) - STATUS_DX,
            statusBarStyle: {
              position: "absolute",
              height: "100%",
              width: audioTime ? (((audioTime / audioDuration) * 100) + "%") : "0",
            }
          });
        } else {
          this.setState({
            dx: "0",
            statusBarStyle: {
              position: "absolute",
              height: "100%",
              width: this.state.audioTime ? (((this.state.audioTime / this.state.audioDuration) * 100) + "%") : "0",
            }
          });
        }
      }, 444);
    }

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
        buttonsActive: ["prev", "playPause", "next", "vol", "clock", "status", "info", "bars", "download"],
      });
    } else if (smMediaMatch.matches) {
      this.setState({
        buttonsActive: ["prev", "playPause", "next", "vol", "status", "info", "bars", "download"],
      });
    } else if (xsMediaMatch.matches) {
      this.setState({
        buttonsActive: ["prev", "playPause", "next", "status", "info", "bars", "download"],
      })
    } else if (xxsMediaMatch.matches){
      this.setState({
        buttonsActive: ["playPause", "status", "bars"],
      });
    } else if (xxxsMediaMatch.matches){
      this.setState({
        buttonsActive: ["playPause", "bars"],
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
    if (prev >= 0) {
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
  onInfo = ()=>{
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
  onComment = ()=>{
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
  onBars = ()=>{
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
  onDownload = ()=>{
    //
  }
  render(){    
    let volumeButtonClass;
    if (this.state.audioMuted){
      volumeButtonClass = "fa fa-volume-off ctrl-btn audiobar-btn";
    } else {
      volumeButtonClass = "fa fa-volume-up ctrl-btn audiobar-btn vol-btn-animation";
    }
    
    let infoClass = "fas fa fa-info-circle audiobar-btn green";
    let infoContainerStyle = {display: "none"};
    let commentClass = "far fa-comment alt audiobar-btn green";
    let commentContainerStyle = {display: "none"}
    let barsClass = "fas fa-bars audiobar-btn green";
    let barsContainerStyle = {display: "none"}
    if (this.state.controlOpen === "info") {
      infoClass += " green";
      infoContainerStyle = {display: "flex", flexDirection: "column"};
    } else if (this.state.controlOpen === "comment") {
      commentClass += " green";
      commentContainerStyle = {display: "block"};
    } else if (this.state.controlOpen === "bars") {
      barsClass += " active";
      barsContainerStyle = {display: "block"};
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
              style={this.state.buttonsActive.indexOf("prev") >= 0 ? {} : {display: "none"}}
              title="Back" onClick={this.onPrev}/>
            <button className={this.state.playButtonClassName} id="playButton"
              style={this.state.buttonsActive.indexOf("playPause") >= 0 ? {} : {display: "none"}}
              title="Play" onClick={this.onPlayPause}/>
            <button className="fas fa-step-forward ctrl-btn audiobar-btn" 
              style={this.state.buttonsActive.indexOf("next") >= 0 ? {} : {display: "none"}}
              title="Forward" onClick={this.onNext}/>
            <i style={this.state.buttonsActive.indexOf("vol") >= 0 ? {} : {display: "none"}}
              className={volumeButtonClass} 
              id={id.volumeButton}>
              <input className="vol-slider"
                type="range" min="-36" max="6" step="0.5" defaultValue="0" />
            </i>
          </div>
          <div className="flex flex-row" style={{right: "0", bottom: "7.5px", width: "100%", justifyContent: "flex-end"}}>
            <div className="flex flex-row" style={{width: "100%", justifyContent: "flex-end"}}>
              <div className="clock"
                style={this.state.buttonsActive.indexOf("clock") >= 0 ? {} : {display: "none"}}>
                <span className="m-auto">
                  {secondsToMMSS(this.state.audioTime)}
                </span>
                <span className="m-auto">
                  |
                </span>
                <span className="m-auto">
                    {secondsToMMSS(this.state.audioDuration)}
                </span>
              </div>
              <div style={this.state.buttonsActive.indexOf("status") >= 0 ? {}: {display: "none"}}
                className="status">
                <div className="absolute w-full h-full" id={id.statusBarContainer}>
                  <div style={this.state.statusBarStyle} className="status-invert"/>
                  <div style={this.state.mouseoverStatusBarStyle}/>
                </div>
                <svg viewBox="0 0 100 100" width="0%" height="20px" style={{margin: "auto 5px"}}>
                  <text fill="lawngreen" x="-870" y="87"
                    dx={this.state.dx} dy={this.state.dy}
                    fontSize="100" letterSpacing="20" id={id.statusText}>
                    {title}
                  </text>
                </svg>
                <div className="status-title">
                  {title}
                </div>
              </div>
            </div>
            <div className="audioBarControls">
              <button className={infoClass}
                title="Song Info"
                onClick={this.onInfo} id={id.infoButton}
                style={this.state.buttonsActive.indexOf("info") >= 0 ? {} : {display: "none"}}>
                  <div className="info-container" style={infoContainerStyle}>
                    {
                      this.props.trackList ? 
                      <div>
                        <u>Information:</u><br/>
                        <div>
                          Artist: {this.props.trackList[this.state.trackNo].artist}
                        </div>
                        <div>
                          Title: {this.props.trackList[this.state.trackNo].title}
                        </div>
                        <div>
                          Year: {this.props.trackList[this.state.trackNo].year}
                        </div>
                      </div>
                      : 
                      <div className="sk-chase m-auto">
                        <div className="sk-chase-dot"></div>
                        <div className="sk-chase-dot"></div>
                        <div className="sk-chase-dot"></div>
                        <div className="sk-chase-dot"></div>
                        <div className="sk-chase-dot"></div>
                        <div className="sk-chase-dot"></div>
                      </div>
                    }                   
                  </div>
              </button>
              <button className={commentClass} id={id.commentButton}
                title="Comment"
                onClick={this.onComment}
                style={this.state.buttonsActive.indexOf("comment") >= 0 ? {} : {display: "none"}}/>
              <button className={barsClass} id={id.barsButton}
                title="Track List"
                onClick={this.onBars}
                style={this.state.buttonsActive.indexOf("bars") >= 0 ? {} : {display: "none"}}>
                <div className="bars-container" style={barsContainerStyle}>
                  <ol>
                    {
                      this.props.trackList ? 
                      this.props.trackList.map(
                        (track)=>
                          <li className="bars-container-item"
                            key={`bars_track_${this.props.trackList.indexOf(track)}`}
                            onClick={()=>this.onClickBarsItem(track)}>
                            {track.title}
                          </li>
                      ) :
                      {}
                    }
                  </ol>
                </div>
              </button>
              <button className="fa fa-download alt green audiobar-btn" 
                style={this.state.buttonsActive.indexOf("download") >= 0 ? {} : {display: "none"}} 
                title={`Download ${title}`}
                onClick={this.onDownload}/>
            </div>
          </div>
          <audio src={src} id={id.audio}/>
        </div>
        <div className="comment-container" style={commentContainerStyle}>
          <form className="flex-col">
            <textarea placeholder="Leave a comment"/>
            <button className="fa fa-undo blue top-right comment-reset-btn" type="reset"/>
            <button className="green black bottom-right form-btn">Submit</button>
          </form>
        </div>
      </div>
    );
  }
}