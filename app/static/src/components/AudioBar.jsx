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
      volumeButton: `volume_button_${timestamp}`,
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
        display: "flex"
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
        fontFamily: "Courier New",
        fontSize: "0.75rem",
        color: "white",
        padding: "10px",
        display: "none",
        borderRadius: "3px"
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
        left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "3px"
      },
      barsContainer: {
        display: "none",
        width: "300px",
        height: "auto",
        position: "absolute",
        transform: "translate(-90%, -120%)",
        border: "1px solid lawngreen",
        backgroundColor: "rgba(0,0,0,0.5)",
        transition: "height 0.3s linear, width 0.3s linear",
        fontFamily: "Courier New",
        fontSize: "1rem",
        color: "white",
        overflowY: "scroll",
        borderRadius: "3px"
      },
      barsContainerItem: {
        height: "25px",
        width: "100%"
      }
    };

    this.state = {
      audioPlaying: false,
      audioMuted: false,
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
      mouseoverStatusBarStyle: {
        position: "absolute",
        height: "100%",
        width: "0",
        display: "none"
      },
      buttonStyle: {
        height: "33px",
        width: "33px",
        margin: "auto 4px",
        display: "none",
      },
      volumeButtonStyle:{
        height: "33px",
        width: "33px",
        minWidth: "33px",
        margin: "auto 4px",
        display: "none",
      },
      infoData: {},
      volumeSliderStyle: {
        display: "none"
      },
      controlOpen: null, // variable to denote which control is open (info, comment, etc.) assuming only 1 is open at a time 
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
    this.onMute = this.onMute.bind(this);
    this.createCommentContainer = this.createCommentContainer.bind(this);
  }
  mdMediaMatchListener () {
    if (this.mdMediaMatch.matches){
      this.setState((state) => {
        return {
          buttonStyle: {
              height: "33px",
              width: "33px",
              margin: "auto 4px",
              display: "flex"
          },
          volumeButtonStyle: { 
              height: "33px",
              width: "33px",
              minWidth: "33px",
              margin: "auto 4px",
              display: "flex"
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
          },
          volumeButtonStyle: {
            height: "33px",
            width: "33px",
            minWidth: "33px",
            margin: "auto 4px",
            display: "none"
          }
        }
      });
    }
  }
  createCommentContainer(){
    let commentContainer = document.createElement("div");
    commentContainer.id = this.id.commentContainer;
    Object.assign(commentContainer.style, this.style.commentContainer);
    
    let form = document.createElement("form");

    let header = document.createElement("h5");
    header.innerHTML = "Comment Box";
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

    commentContainer.appendChild(form);
    return commentContainer
  }

  componentDidMount () {
    this.parentElement = document.getElementById(this.props.id);
    this.statusText = document.getElementById(this.id.statusText);
    this.statusTextClientWidth = Number(this.statusText.getClientRects()[0].width);
    this.statusBarContainer = document.getElementById(this.id.statusBarContainer);
    this.nauticalRocket = document.getElementById("nauticalRocket");
    
    this.infoElement = document.getElementById(this.id.infoContainer);
    this.commentContainer = this.createCommentContainer();
    this.parentElement.appendChild(this.commentContainer);
    this.barsContainer = document.getElementById(this.id.barsContainer);

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
    this.statusBarContainer.addEventListener("mousemove", (e)=>{
      let rect = this.statusBarContainer.getBoundingClientRect();
      let x = e.clientX - rect.left; //x position within the element.
      this.setState(()=>{
        return {
          mouseoverStatusBarStyle: {
            position: "absolute",
            height: "100%",
            width: (100 * x / this.statusBarContainer.offsetWidth) + "%",
            borderRight: "1px solid lawngreen",
          }
        }
      })
    });
    this.statusBarContainer.addEventListener("mouseleave", (e)=>{
      this.setState(()=>{
        return {
          mouseoverStatusBarStyle: {
            display: "none"
          }
        }
      })
    });
    this.mdMediaMatch = window.matchMedia("screen and (min-width: 520px)");
    this.mdMediaMatchListener();
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
      $.post({
        url: `/pauses?song_id=${this.state.trackNo+1}`,  // todo: sync trackNo and song_id from db
        headers: {
          "X-CSRFToken": document.getElementById("_csrf_token").value
        },
        success: (res)=>{
          console.log(res)
        },
        error: (e)=>{
          console.log(e)
        }
      });
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
        url: `/plays?song_id=${this.state.trackNo+1}`,  // todo: sync trackNo and song_id from db
        headers: {
          "X-CSRFToken": document.getElementById("_csrf_token").value
        },
        success: (res)=>{
          console.log(res)
        },
        error: (e)=>{
          console.log(e)
        }
      });
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

    // other listeners
    this.volBtn = document.getElementById(this.id.volumeButton);
    this.volBtnSldr = this.volBtn.getElementsByTagName("input")[0];
    this.volBtn.addEventListener("mouseenter",
      ()=>{
        this.setState(()=>{
          return {
            volumeButtonStyle: { 
              height: "33px",
              width: "350px",
              margin: "auto 4px",
              display: "flex",
            },
            volumeSliderStyle: {
              display: "inline-block",
              width: "100%",
              "margin": "auto 10px"
            }
          }
        });
      }
    );
    this.volBtn.addEventListener("click",
      ()=>{
        this.setState(()=>{
          return {
            volumeButtonStyle: { 
              height: "33px",
              width: "350px",
              margin: "auto 4px",
              display: "flex",
            },
            volumeSliderStyle: {
              display: "inline-block",
              width: "100%",
              margin: "auto 10px",
            }
          }
        });
      }
    );
    this.volBtn.addEventListener("mouseleave",
      ()=>{
        this.setState(()=>{
          return {
            volumeButtonStyle: { 
              height: "33px",
              width: "33px",
              minWidth: "33px",
              margin: "auto 4px",
              display: "flex"
            },
            volumeSliderStyle: {
              display: "none"
            }
          }
        });
      }
    );

    // timers
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
      // update gain value
      if (this.state.audioMuted){
        this.gainNode.gain.value = 0;
      } else {
        this.gainNode.gain.value = 10 ** (parseFloat(this.volBtnSldr.value) / 20);  // log scale
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
    this.getInfo(this.props.src[this.state.trackNo]);
    let infoBtn = document.getElementById(this.id.infoButton);
    if (this.state.controlOpen === "info") {
      this.infoElement.style.display = "none";
      this.commentContainer.style.display = "none";
      this.barsContainer.style.display = "none";
      this.setState(()=>{
        return {
          controlOpen: null
        }
      })
    } else {
      this.infoElement.style.display = "block";
      this.commentContainer.style.display = "none";
      this.barsContainer.style.display = "none";
      this.setState(()=>{
        return {
          controlOpen: "info"
        }
      })
    }
  }
  getInfo(src){
    // todo: inject spinner until info is retrieved
    // todo: obtain info only once per page refresh
    if (src.infoUrl){
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
      console.debug("No info url provided for this track.")
    }
  }
  onComment(){
    if (this.state.controlOpen === "comment") {
      this.infoElement.style.display = "none";
      this.commentContainer.style.display = "none";
      this.barsContainer.style.display = "none";
      this.setState(()=>{
        return {
          controlOpen: null
        }
      })
    } else {
      this.infoElement.style.display = "none";
      this.commentContainer.style.display = "block";
      this.barsContainer.style.display = "none";
      this.setState(()=>{
        return {
          controlOpen: "comment"
        }
      })
    }
  }
  onBars(){    
    if (this.state.controlOpen === "bars") {
      this.infoElement.style.display = "none";
      this.commentContainer.style.display = "none";
      this.barsContainer.style.display = "none";
      this.setState(()=>{
        return {
          controlOpen: null
        }
      })
    } else {
      this.infoElement.style.display = "none";
      this.commentContainer.style.display = "none";
      this.barsContainer.style.display = "block";
      this.setState(()=>{
        return {
          controlOpen: "bars"
        }
      })
    }
  }
  onClickBarsItem(src){
    let index = this.props.src.findIndex((el)=>{
      return el === src
    });
    this.setState(()=>{
      return {
        trackNo: index,
      }
    })
  }

  onMute(){
    console.log("onmute");
    this.setState(()=>{
      return {
        audioMuted: !this.state.audioMuted
      }
    });
  }
  render() {
    let playButtonClass;
    if (this.state.audioPlaying == true){
      playButtonClass = "fa fa-pause ctrl-btn audiobar-btn";
    } else {
      playButtonClass = "fa fa-play ctrl-btn audiobar-btn";
    }
    
    let volumeButtonClass;
    if (this.state.audioMuted){
      volumeButtonClass = "fa fa-volume-off extend ctrl-btn audiobar-btn";
    } else {
      volumeButtonClass = "fa fa-volume-up extend ctrl-btn audiobar-btn";
    }
    

    let infoClass;
    let commentClass;
    let barsClass;
    if (this.state.controlOpen === null){
      infoClass = "fas fa fa-info-circle green audiobar-btn";
      commentClass = "far fa-comment alt green audiobar-btn";
      barsClass = "fas fa-bars green audiobar-btn";
    } else if (this.state.controlOpen === "info") {
      infoClass = "fas fa fa-info-circle green-active audiobar-btn";
      commentClass = "far fa-comment alt green audiobar-btn";
      barsClass = "fas fa-bars green audiobar-btn";
    } else if (this.state.controlOpen === "comment") {
      infoClass = "fas fa fa-info-circle green audiobar-btn";
      commentClass = "far fa-comment alt green-active audiobar-btn";
      barsClass = "fas fa-bars green audiobar-btn";
    } else if (this.state.controlOpen === "bars") {
      infoClass = "fas fa fa-info-circle green audiobar-btn";
      commentClass = "far fa-comment alt green audiobar-btn";
      barsClass = "fas fa-bars green-active audiobar-btn";
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
            <button className="fas fa-step-backward ctrl-btn audiobar-btn" style={this.state.buttonStyle}
              title="Back" onClick={this.props.onPrev ? this.props.onPrev : this.onPrev}/>
            <button className={playButtonClass} style={this.style.button} id="playButton"
              title="Play" onClick={this.onPlayPause}/>
            <button className="fas fa-step-forward ctrl-btn audiobar-btn" style={this.state.buttonStyle}
              title="Forward" onClick={this.props.onNext ? this.props.onNext : this.onNext}/>
            <i className={volumeButtonClass} style={this.state.volumeButtonStyle} id={this.id.volumeButton}>
              <div style={{position: "fixed", height: "33px", width: "33px"}} onClick={this.onMute}></div>
              <input type="range" min="-36" max="6" step="0.5" defaultValue="0" style={this.state.volumeSliderStyle}></input>
            </i>
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
                  <div style={this.state.mouseoverStatusBarStyle}/>
                </div>
                <svg viewBox="0 0 100 100" width="95%" height="20px" className="m-auto">
                  <text fill="lawngreen" x="-520" y="87" dx={this.state.dx} dy={this.state.dy} fontSize="100" letterSpacing="20" id={this.id.statusText}>
                    {this.state.src[this.state.trackNo].title}
                  </text>
                </svg>
              </div>
            </div>
            <div className="flex-group" style={{margin: "auto 25px"}}>
              <button className={infoClass} 
                onClick={this.onInfo} id={this.id.infoButton}
                style={this.state.buttonStyle}>
                  <div style={this.style.infoContainer} id={this.id.infoContainer}>
                    <u>Information:</u><br/>
                    Song: {this.state.infoData ? this.state.infoData.name : null}<br/>
                    Artist: {this.state.infoData ? this.state.infoData.artist : null}<br/>
                    Release Date: {this.state.infoData.info ? this.state.infoData.info.releaseDate : null}<br/>
                    Recorded In: {this.state.infoData.info ? this.state.infoData.info.recordedIn : null}<br/><br/>
                    <u>Statistics:</u><br/>
                    All-time plays: {this.state.infoData ? this.state.infoData.plays : null}<br/>
                    All-time downloads: {null}
                  </div>
                </button>
              <button className={commentClass} id={this.id.commentButton}
                onClick={this.onComment}
                style={this.state.buttonStyle}>
                {/* comment container built in componentDidMount */}
              </button>
              <button className={barsClass} id={this.id.barsButton}
                onClick={this.onBars}
                style={this.state.buttonStyle}>
                <div style={this.style.barsContainer} id={this.id.barsContainer}>
                  <ol>
                    {
                      this.props.src.map(
                      (src)=>
                        <li key={`bars_track${this.props.src.indexOf(src)}`}
                          style={this.style.barsContainerItem} 
                          className="bars-container-item"
                          onClick={()=>this.onClickBarsItem(src)}>
                          {src.title.split(" - ").slice(-1)[0]}
                        </li>
                      )
                    }
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