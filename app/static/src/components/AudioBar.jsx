import $ from 'jquery';
import React from 'react';

export default class AudioBar extends React.Component{
  constructor(props) {
    super(props);
    this.__usage_stats = {};
    this._EXPANDED_HEIGHT = "300px";
    this._COLLAPSED_HEIGHT = "50px";
    this.STATUS_DX = 63;
    this.MAX_DX = 500;
    this.props = props;
    let timestamp = Math.round(new Date().getTime());
    this.id = {
      audio: `audio_bar_audio_element_${timestamp}`,
      statusText: `status_text_${timestamp}`,
      statusBarContainer: `status_bar_container_${timestamp}`,
      infoButton: `info_button_${timestamp}`,
      infoContainer: `info_container_${timestamp}`,
      commentButton: `comment_button_${timestamp}`,
      commentContainer: `comment_container_${timestamp}`,
      barsButton: `bars_button_${timestamp}`,
      barsContainer: `bars_container_${timestamp}`,
    }
    this.style = {
      audioBar: {
        display: "flex",
        justifyContent: "space-between",
        height: "100%",
        maxHeight: "50px",
        width: "100%",
      },
      button: {
        height: "33px",
        width: "33px",
        margin: "auto 4px",
        display: "block"
      },
      expandButton: {
        width: "auto",
        height: "auto",
        position: "absolute",
        left: "50%",
        top: "0",
        transform: "translateY(-50%)",
        zIndex: 3000,
      },
      controls: {
        display: "inline-flex",
        height: "100%",
      },
      clock: {
        display: "flex",
        width: "125px",
        height: "33px",
        margin: "auto 2px",
      },
      clockSvg: {
        minWidth: "100%",
      },
      status: {
        display: "flex",
        position: "relative",
        minWidth: "220px",
        width: "100%",
        maxWidth: "400px",
      },
      statusBarContainer: {
        position: "absolute",
        width: "100%",
        height: "100%",
      },
      infoContainer: {
        width: "250px",
        height: "auto",
        minHeight: "100px",
        position: "absolute",
        transform: "translate(-90%, -120%)",
        border: "1px solid lawngreen",
        backgroundColor: "rgba(0,0,0,0.5)",
        transition: "height 0.3s linear, width 0.3s linear",
        fontFamily: "ZCOOL QingKe HuangYou",
        fontSize: "1rem",
        letterSpacing: "2px",
        color: "white",
        padding: "10px",
        display: "none",
      },
      commentContainer: {
        display: "none",
        width: "450px",
        height: "450px",
        position: "absolute",
        bottom: "100px",
        right: "100px",
        border: "1px solid lawngreen",
        backgroundColor: "rgba(0,0,0,0.5)",
        transition: "height 0.3s linear, width 0.3s linear",
        fontFamily: "Courier New",
        fontSize: "12px",
      },
      barsContainer: {
        display: "none",
        width: "250px",
        height: "auto",
        position: "absolute",
        transform: "translate(-90%, -120%)",
        border: "1px solid lawngreen",
        backgroundColor: "rgba(0,0,0,0.5)",
        transition: "height 0.3s linear, width 0.3s linear",
        fontFamily: "Courier New",
        fontSize: "12px",
        color: "white",
        overflowY: "scroll",
      },
      barsContainerItem: {
        height: "25px",
        width: "100%"
      }
    };

    this.state = {
      audioPlaying: false,
      audioTime: null,
      audioDuration: null,
      audioSrc: undefined,
      expanded: false,
      trackNo: undefined,
      trackTitle: undefined,
      dx: "0",
      dy: "0",
      statusBarStyle: {
        position: "absolute",
        height: "100%",
        width: "0",
      },
      buttonStyle: {
        height: "33px",
        width: "33px",
        margin: "auto 4px",
        display: "none",
      },
      infoData: {}
    }

    if (typeof(props.src) == 'string'){
      this.state.audioSrc = props.src;
      this.state.trackTitle = props.title;
    } else if (typeof(props.src) == 'object') {
      this.state.src = props.src;
      this.state.trackNo = 0;
    } else {
      console.error(`Unrecognized type: ${typeof(props.src)}`);
    }

    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onPrev = this.onPrev.bind(this);
    this.onPlayPause = this.onPlayPause.bind(this);
    this.expandCollapse = this.expandCollapse.bind(this);
    this.mdMediaMatchListener = this.mdMediaMatchListener.bind(this);
    this.onInfo = this.onInfo.bind(this);
    this.getInfo = this.getInfo.bind(this);
    this.onComment = this.onComment.bind(this);
    this.onBars = this.onBars.bind(this);
    this.onClickBarsItem = this.onClickBarsItem.bind(this);
  }
  mdMediaMatchListener () {
    if (this.mdMediaMatch.matches){
      this.setState((state) => {
        return {
          buttonStyle: {
              height: "33px",
              width: "33px",
              margin: "auto 4px",
              display: "block"
          }
        }
      });
    } else {
      this.setState((state) => {
        return {
          buttonStyle: {
              height: "33px",
              width: "33px",
              margin: "auto 4px",
              display: "none"
          }
        }
      });
    }
  }

  componentDidMount () {
    this.parentElement = document.getElementById(this.props.id);
    this.statusText = document.getElementById(this.id.statusText);
    this.statusTextClientWidth = Number(this.statusText.getClientRects()[0].width);
    this.statusBarContainer = document.getElementById(this.id.statusBarContainer);
    this.nauticalRocket = document.getElementById("nauticalRocket");
    this.statusBarContainer.onclick = (e) => {
      // e = Mouse click event.
      let rect = this.statusBarContainer.getBoundingClientRect();
      let x = e.clientX - rect.left; //x position within the element.

      // var y = e.clientY - rect.top;  //y position within the element.
      let time = (x / this.statusBarContainer.offsetWidth) * this.state.audioDuration;
      this.audioElement.currentTime = time;
      this.setState(()=>{
        return {
          audioTime: time,
          // audioDuration: this.audioElement.duration,
          statusBarStyle: {
            position: "absolute",
            height: "100%",
            width: this.state.audioTime ? (((this.state.audioTime / this.state.audioDuration) * 100) + "%") : "0",
          }
        }
      });
    };
    this.mdMediaMatch = window.matchMedia("screen and (min-width: 520px)");
    this.mdMediaMatchListener()
    this.mdMediaMatch.addListener(this.mdMediaMatchListener);
    
    this.audioCtx = new AudioContext();
    
    
    if (this.props.videoSrc){
      this.audioSource = this.audioCtx.createMediaElementSource(this.props.videoSrc)
      this.audioElement = this.audioSource;
    } else {
      this.audioElement = document.getElementById(this.id.audio)
      this.audioSource = this.audioCtx.createMediaElementSource(this.audioElement)
    }
    
    this.gainNode = this.audioCtx.createGain()
    this.audioSource.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);

    // audio event listeners
    this.audioElement.addEventListener("ended", (e)=>{
      if (this.state.trackNo == this.state.src.length - 1){
        this.audioElement.autoplay = false;
      }
      this.setState(()=>{
        return {
          // audioPlaying: false,
          audioTime: this.audioElement.currentTime,
          audioDuration: this.audioElement.duration,
          statusBarStyle: {
            position: "absolute",
            height: "100%",
            width: this.audioElement.currentTime ? (((this.audioElement.currentTime / this.audioElement.duration) * 100) + "%") : "0",
          },
          // dx: "0",
        }
      });
      clearInterval(this.clockId);
      this.onNext();  // auto go to next song
    });
    this.audioElement.addEventListener("pause", (e)=>{
      this.setState({
        audioPlaying: false,
      });
      clearInterval(this.clockId);
    });
    this.audioElement.addEventListener("canplay", (e)=>{
      this.setState({
        audioTime: this.audioElement.currentTime,
        audioDuration: this.audioElement.duration
      })
      if (this.state.audioPlaying){
        // if state is already playing before we load, ie song is swithched
        // play track immediately
        this.audioElement.play()
        this.setState({
          audioPlaying: true,
        });
      }
    });
    this.audioElement.addEventListener("play", (e)=>{
      $.post({
        url: `/data/plays?song_id=${this.state.trackNo}`
      })
      this.audioElement.autoplay = true;
      this.setState({
        audioPlaying: true,
      });
      this.clockId = setInterval(()=>{
        // let event = new CustomEvent('audio-tick', {detail: {
        //   id: this.audioElement.id,
        //   time: Math.floor(this.audioElement.currentTime),
        //   duration: Math.floor(this.audioElement.duration),
        // }});
        // this.lyricBox.dispatchEvent(event);
        this.setState(()=>{
          return {
            audioTime: this.audioElement.currentTime,
            audioDuration: this.audioElement.duration,
            statusBarStyle: {
              position: "absolute",
              height: "100%",
              width: ((this.audioElement.currentTime / this.audioElement.duration) * 100) + "%",
            }
          };
        });
      }, 1000);
    });
    this.statusAnimationTimerId = setInterval(()=>{
      if (parseInt(this.state.dx) > this.STATUS_DX - Math.floor(4.5 * this.statusTextClientWidth)){
        this.setState(() =>{
          return {
            dx: parseInt(this.state.dx) - this.STATUS_DX,
            statusBarStyle: {
              position: "absolute",
              height: "100%",
              width: this.state.audioTime ? (((this.state.audioTime / this.state.audioDuration) * 100) + "%") : "0",
            }
          }
        });
       
      } else {
        this.setState((state) =>{
          return {
            dx: "60",
            statusBarStyle: {
              position: "absolute",
              height: "100%",
              width: this.state.audioTime ? (((this.state.audioTime / this.state.audioDuration) * 100) + "%") : "0",
            }
          }
        });
        // clearInterval(this.statusAnimationTimerId);
      }
    }, 500);
  }
  componentWillUnmount(){
    clearInterval(this.statusAnimationTimerId);
  }
  secondsToMMSS(floatTime) {
    if (floatTime === null || floatTime === undefined){
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
  play() {
    this.audioElement.play();
  }
  pause () {
    this.audioElement.pause();
  }
  onPlayPause() {
    if (this.state.audioPlaying == false){
      this.play();
    } else {
      this.pause();
    }
  }
  onNext(){
    let next = this.state.trackNo + 1;
    if (next < this.state.src.length) {
      this.setState(()=>{
        return {
          trackNo: next,
        }
      });
    } else {
      this.setState(()=>{
        return {
          trackNo: 0,
        }
      });
    }
  }
  onPrev(){
    let prev = this.state.trackNo - 1;
    if (prev >= 0) {
      this.setState(()=>{
        return {
          trackNo: prev,
        }
      });
    } else {
      this.setState(()=>{
        return {
          trackNo: this.state.src.length + prev,
        }
      });
    }    
  }

  expandCollapse() {
    if (this.state.expanded !== true){
      this.setState(()=>{
        return {
          expanded: true
        }
      });
    } else {
      this.setState(()=>{
        return {
          expanded: false
        }
      });
    }
  }
  onInfo(){
    // if (this.infoElement){
      this.getInfo(this.props.src[this.state.trackNo]);
      let infoBtn = document.getElementById(this.id.infoButton);
      if (infoBtn.className.endsWith("green-active")){
        infoBtn.className = infoBtn.className.split(" green-active")[0] + " green";
        this.infoElement.style.display = "none";
      } else {
        infoBtn.className = infoBtn.className.split(" green")[0] + " green-active";
        this.infoElement.style.display = "";
      }
    // } else {
    //   this.getInfo(this.props.src[this.state.trackNo])
    //   this.infoBtn = document.getElementById(this.id.infoButton);
    //   this.infoBtn.className = this.infoBtn.className.split(" green")[0] + " green-active";

    //   this.infoElement.style.width = "250px";
    //   this.infoElement.style.height = "auto";
    //   this.infoElement.style.minHeight = "100px";
      
    // }
    
  }
  getInfo(src){
    if (src.infoUrl){
      this.infoElement = document.getElementById(this.id.infoContainer);
      var xhr = new XMLHttpRequest();
      var URL = src.infoUrl;
      xhr.onreadystatechange = ()=>{
        if (xhr.readyState == 4 && xhr.status == 200){
          this.setState({
            infoData: JSON.parse(xhr.responseText),
          });
        }
      };
      xhr.open("GET", URL, true);
      xhr.send();
      
    } else {
      console.debug("No info found for this track.")
    }
  }
  onComment(){
    if (!this.commentContainer){
      // this.commentContainer = document.getElementById(this.id.commentContainer);
      // create comment container
      this.commentContainer = document.createElement("div");
      this.commentContainer.id = this.id.commentContainer;
      Object.assign(this.commentContainer.style, this.style.commentContainer);
      
      let form = document.createElement("form");

      let header = document.createElement("h5");
      header.innerHTML = "Comment";
      let textarea = document.createElement("textarea");
      let sendBtn = document.createElement("button");
      sendBtn.type = "submit";
      sendBtn.innerHTML = "Send";
      sendBtn.className = "blue";
      let clearBtn = document.createElement("button");
      clearBtn.type = "reset";
      clearBtn.className ="blue";
      clearBtn.innerHTML = "Clear";

      form.appendChild(header);
      form.appendChild(textarea);
      form.appendChild(sendBtn);
      form.appendChild(clearBtn);

      this.commentContainer.appendChild(form);
      document.getElementById("nauticalMindsContainer").appendChild(this.commentContainer);
    }
    let comBtn = document.getElementById(this.id.commentButton);
    if (comBtn.className.endsWith("green-active")){
      comBtn.className = comBtn.className.split(" green-active")[0] + " green";
      this.commentContainer.style.display = "none";
    } else {
      comBtn.className = comBtn.className.split(" green")[0] + " green-active";
      this.commentContainer.style.display = "";
    }
  }
  onBars(){
    if (!this.barsContainer){
      this.barsContainer = document.getElementById(this.id.barsContainer);
    }
    let barsBtn = document.getElementById(this.id.barsButton);
    if (barsBtn.className.endsWith("green-active")){
      barsBtn.className = barsBtn.className.split(" green-active")[0] + " green";
      this.barsContainer.style.display = "none";
    } else {
      barsBtn.className = barsBtn.className.split(" green")[0] + " green-active";
      this.barsContainer.style.display = "";
    }
    
  }
  onClickBarsItem(src){
    let index = this.props.src.findIndex((el)=>{
      return el === src
    });
    console.log(index);
    this.setState(()=>{
      return {
        trackNo: index,
      }
    })

  }
  render() {
    let playButtonClass;
    if (this.state.audioPlaying == true){
      playButtonClass = "fa fa-pause ctrl-btn";
    } else {
      playButtonClass = "fa fa-play ctrl-btn";
    }
    
    // let expandButtonClassName;
    // if (this.state.expanded === true){
    //   this.parentElement.style.height = this._EXPANDED_HEIGHT;
    //   expandButtonClassName = "fas fa-arrow-circle-down pulsing-fast";
    // } else if (this.parentElement){
    //   this.parentElement.style.height = this._COLLAPSED_HEIGHT;
    //   expandButtonClassName = "fas fa-arrow-circle-up pulsing-fast"
    // }
    return (
      <div className="audioBar" id={this.props.id}>
        <div style={this.style.audioBar}>
          {/* <i style={this.style.expandButton} className={expandButtonClassName} onClick={this.expandCollapse}/> */}
          <div style={this.style.controls} className="audioBarControls ml-15">
            <button className="fas fa-step-backward ctrl-btn" style={this.state.buttonStyle}
              title="Back" onClick={this.props.onPrev ? this.props.onPrev : this.onPrev}/>
            <button className={playButtonClass} style={this.style.button} id="playButton"
              title="Play" onClick={this.onPlayPause}/>
            <button className="fas fa-step-forward ctrl-btn" style={this.state.buttonStyle}
              title="Forward" onClick={this.props.onNext ? this.props.onNext : this.onNext}/>
          </div>
          <div className="flex-group">
            <div className="flex-group">
              <div style={this.style.clock} className="clock">
                <svg viewBox="0 0 100 50" height="100%">
                  <text fill="lawngreen" x="15" y="39" fontSize="35">
                    {this.secondsToMMSS(this.state.audioTime)}
                  </text>
                </svg>
                <svg viewBox="0 0 30 50" width="15px" height="100%">
                  <text fill="lawngreen" x="11" y="40" fontSize="40">
                    |
                  </text>
                </svg>
                <svg viewBox="0 0 100 50" height="100%">
                  <text fill="lawngreen" x="8" y="39" fontSize="35">
                    {this.secondsToMMSS(this.state.audioDuration)}
                  </text>
                </svg>
              </div>
              <div style={this.style.status} className="status">
                <div style={this.style.statusBarContainer} id={this.id.statusBarContainer}>
                  <div style={this.state.statusBarStyle} className="status-invert"/>
                </div>
                <svg viewBox="0 0 100 100" width="95%" height="20px" className="m-auto">
                  <text fill="lawngreen" x="-520" y="87" dx={this.state.dx} dy={this.state.dy} fontSize="100" letterSpacing="20" id={this.id.statusText}>
                    {this.state.src[this.state.trackNo].title}
                  </text>
                </svg>
              </div>
            </div>
            <div className="flex-group" style={{margin: "auto 25px"}}>
              <button className="fas fa fa-info-circle green" 
                onClick={this.onInfo} id={this.id.infoButton}
                style={this.state.buttonStyle}>
                  <div style={this.style.infoContainer} id={this.id.infoContainer}>
                    <u>Information:</u><br/>
                    Song: {this.state.infoData.song}<br/>
                    Artist: {this.state.infoData.artist}<br/>
                    Release Date: {this.state.infoData.releaseDate}<br/>
                    Recorded In: {this.state.infoData.recordedIn}<br/><br/>
                    <u>Statistics:</u><br/>
                    All-time plays: {this.state.infoData.plays}<br/>
                    All-time donwloads: {this.state.infoData.downloads}
                  </div>
                </button>
              <button className="far fa-comment alt green" id={this.id.commentButton}
                onClick={this.onComment}
                style={this.state.buttonStyle}>
                <div style={this.style.commentContainer} id={this.id.commentContainer}>
                  <form>
                    <h6>Comment</h6>
                    <textarea/>
                    <button type="submit" className="blue">Send</button>
                    <button type="reset" className="blue">Clear</button>
                  </form>
                </div>
              </button>
              <button className="fas fa-bars green" id={this.id.barsButton}
                onClick={this.onBars}
                style={this.state.buttonStyle}>
                <div style={this.style.barsContainer} id={this.id.barsContainer}>
                  <ol>
                    {this.props.src.map(
                      (src)=>
                        <li style={this.style.barsContainerItem} 
                          className="bars-container-item"
                          onClick={()=>this.onClickBarsItem(src)}>
                          {src.title.split(" - ").slice(-1)[0]}
                          </li>
                        )}
                  </ol>
                </div>
              </button>
            </div>
          </div>
          <audio src={this.state.src[this.state.trackNo].src} id={this.id.audio}></audio>
        </div>
      </div>
    );
  }
}