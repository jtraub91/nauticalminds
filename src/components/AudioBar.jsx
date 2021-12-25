import $ from 'jquery';
import React from 'react';

export default class AudioBar extends React.Component{
  constructor(props) {
    super(props);
    this.__usage_stats = {};
    this._EXPANDED_HEIGHT = "300px";
    this._COLLAPSED_HEIGHT = "50px";
    this.STATUS_DX = 60;
    this.props = props;
    let timestamp = Math.round(new Date().getTime());
    this.id = {
      audioBar: this.props.id ? this.props.id : `audioBar${timestamp}`,
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
      volumeSliderInput: `volume_slider_input_${timestamp}`
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
        letterSpacing: "3px"
      },
      clockSvg: {
        minWidth: "100%",
      },
      status: {
        display: "flex",
        position: "relative",
        minWidth: "75px",
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
        minHeight: "50px",
        position: "absolute",
        // transform: "translate(-90%, -115%)",
        border: "1px solid lawngreen",
        backgroundColor: "rgba(0,0,0,0.5)",
        transition: "height 0.3s linear, width 0.3s linear",
        fontFamily: "Courier New",
        fontSize: "0.75rem",
        lineHeight: "1rem",
        color: "white",
        padding: "10px",
        display: "none",
        borderRadius: "3px",
        right: "15px",
        bottom: "60px"
      },
      commentContainer: {
        display: "none",
        position: "fixed",
        bottom: "50px",
        // border: "1px solid lawngreen",
        // backgroundColor: "rgba(0,0,0,0.5)",
        transition: "height 0.3s linear, width 0.3s linear",
        fontFamily: "Courier New",
        fontSize: "12px",
        right: "25px",
        borderRadius: "3px",
        minWidth: "250px",
        maxWidth: "350px",
        width: "90%",
      },
      barsContainer: {
        display: "none",
        width: "250px",
        height: "auto",
        position: "absolute",
        transform: "translate(-90%, -111%)",
        border: "1px solid lawngreen",
        backgroundColor: "rgba(0,0,0,0.5)",
        transition: "height 0.3s linear, width 0.3s linear",
        fontFamily: "Courier New",
        fontSize: "1rem",
        color: "white",
        borderRadius: "3px"
      },
      barsContainerItem: {
        height: "25px",
        width: "100%"
      },
      button: {
        height: "33px",
        width: "33px",
        margin: "auto 4px",
        display: "flex",
      },
      volumeButton: {
        height: "33px",
        width: "33px",
        minWidth: "33px",
        margin: "auto 4px",
        display: "flex",
      },
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
      clockDisplay: false,
      buttonsActive: ["playPause", "info", "comment", "bars"],
      volumeButtonStyle: {display: "none"},
      infoData: null,
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
    this.xsMediaMatchListener = this.xsMediaMatchListener.bind(this);
    this.smMediaMatchListener = this.smMediaMatchListener.bind(this);
    this.mdMediaMatchListener = this.mdMediaMatchListener.bind(this);
    this.setBasedOnMediaMatch = this.setBasedOnMediaMatch.bind(this);
    this.onInfo = this.onInfo.bind(this);
    this.getInfo = this.getInfo.bind(this);
    this.onComment = this.onComment.bind(this);
    this.onBars = this.onBars.bind(this);
    this.onClickBarsItem = this.onClickBarsItem.bind(this);
    this.onMute = this.onMute.bind(this);
    this.createCommentContainer = this.createCommentContainer.bind(this);
    this.setVolumeOrientation = this.setVolumeOrientation.bind(this);
    this.handleMouseEnterX = this.handleMouseEnterX.bind(this);
    this.handleMouseLeaveX = this.handleMouseLeaveX.bind(this);
    this.handleMouseEnterY = this.handleMouseEnterY.bind(this);
    this.handleMouseLeaveY = this.handleMouseLeaveY.bind(this);
    this.onDownload = this.onDownload.bind(this);
  }
  handleMouseEnterX(){
    this.setState(()=>{
      return {
        volumeButtonStyle: { 
          height: "33px",
          width: "200px",
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
  handleMouseLeaveX(){
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
  handleMouseEnterY(){
    this.setState(()=>{
      return {
        volumeButtonStyle: { 
          height: "33px",
          width: "200px",
          margin: "auto 4px",
          display: "flex",
          // transform: "rotate(-90deg)",
          position: "relative",
          // top: "-85px",
          // left: "-85px"
        },
        volumeSliderStyle: {
          display: "inline-block",
          width: "100%",
          "margin": "auto 10px"
        }
      }
    });

  }
  
  handleMouseLeaveY(){
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
  setVolumeOrientation(){
    if (this.volMatch.matches){
      this.volBtn.addEventListener("mouseenter", this.handleMouseEnterX);
      this.volBtn.addEventListener("click", this.handleMouseEnterX);
      this.volBtn.addEventListener("mouseleave", this.handleMouseLeaveX);

      this.volBtn.removeEventListener("mouseenter", this.handleMouseEnterY);
      this.volBtn.removeEventListener("click", this.handleMouseEnterY);
      this.volBtn.removeEventListener("mouseleave", this.handleMouseLeaveY);
    } else {
      this.volBtn.addEventListener("mouseenter", this.handleMouseEnterY);
      this.volBtn.addEventListener("click", this.handleMouseEnterY);
      this.volBtn.addEventListener("mouseleave", this.handleMouseLeaveY);

      this.volBtn.removeEventListener("mouseenter", this.handleMouseEnterX);
      this.volBtn.removeEventListener("click", this.handleMouseEnterX);
      this.volBtn.removeEventListener("mouseleave", this.handleMouseLeaveX);
    }
  }
  mdMediaMatchListener () {
    this.setBasedOnMediaMatch();
  }
  smMediaMatchListener () {
    this.setBasedOnMediaMatch();
  }
  xsMediaMatchListener () {
    this.setBasedOnMediaMatch();
  }
  createCommentContainer(){
    let commentContainer = document.createElement("div");
    commentContainer.id = this.id.commentContainer;
    Object.assign(commentContainer.style, this.style.commentContainer);
    
    let form = document.createElement("form");
    Object.assign(
      form.style, 
      {
        display: "flex", 
        flexDirection: "column",
      }
    );

    let textarea = document.createElement("textarea");
    Object.assign(textarea.style, {
      width: "auto",
      height: "150px",
      margin: "4px",
      // fontFamily: "Comic Sans MS",
      padding: "10px",
      letterSpacing: "1px",
      fontSize: "14px",
      resize: "none",
      minHeight: "150px",
      maxHeight: "720px",
      padding: "5px 70px 10px 10px",
    })
    textarea.placeholder = "Leave a comment"
    const MAX_LENGTH = 1000;
    textarea.oninput = function(){
      if (textarea.textLength >= MAX_LENGTH){
        textarea.value = textarea.value.slice(0, MAX_LENGTH - 1);
      }
    }
    let resetBtn = document.createElement("button");
    resetBtn.className = "fa fa-undo blue top-right comment-reset-btn";
    resetBtn.type = "reset";

    let sendBtn = document.createElement("button");
    sendBtn.type = "submit";
    sendBtn.innerHTML = "Send";
    sendBtn.className = "green black bottom-right form-btn";
    sendBtn.onclick = (e)=>{
      e.preventDefault();
      if (!textarea.value){
        let formAlert = document.createElement("div");
        formAlert.className = "form-alert comment error big";
        formAlert.innerHTML = "Empty";
        form.appendChild(formAlert);
        setTimeout(()=>{
          formAlert.remove();
        }, 3000);
      } else {
        let spinnerDiv = document.createElement("div");
        Object.assign(spinnerDiv.style, {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50px",
          height: "50px",
        });
        let spinner = document.createElement("div");
        spinner.className = "spinner-border"
        Object.assign(spinner.style, {
          position: "absolute",
          width: "50px",
          height: "50px",
          // top: "50%",
          // left: "50%",
          // transform: "translate(-50%, -50%)"
        });
        spinnerDiv.appendChild(spinner);
        form.appendChild(spinnerDiv);
        $.post({
          url: '/comment',  // todo: sync trackNo and song_id from db
          headers: {
            "X-CSRF-TOKEN": document.getElementById("_csrf_token").value,
            "Content-Type": "application/json"
          },
          data: JSON.stringify({
            comment: textarea.value,
          }),
          dataType: 'json',
          success: (res)=>{
            spinner.remove();
            if (res.status == "success"){
              textarea.value = "";  // reset textarea
              let formAlert = document.createElement("div");
              formAlert.className = "form-alert comment success big";
              formAlert.innerHTML = res.message;
              form.appendChild(formAlert);
              setTimeout(()=>{
                formAlert.remove();
              }, 3000);
            } else if (res.status == "error") {
              let formAlert = document.createElement("div");
              formAlert.className = "form-alert comment error big";
              formAlert.innerHTML = res.message;
              form.appendChild(formAlert);
              setTimeout(()=>{
                formAlert.remove();
              }, 3000);
            }
            console.log(res)
          },
          error: (e)=>{
            let formAlert = document.createElement("div");
            formAlert.className = "form-alert comment error big";
            formAlert.innerHTML = "An unexpected error occured. Please try again.";
            form.appendChild(formAlert);
            setTimeout(()=>{
              formAlert.remove();
            }, 3000);
            spinner.remove();
            console.log(e)
          }
        });
      }
    }

    form.appendChild(textarea);
    form.appendChild(resetBtn);
    form.appendChild(sendBtn);

    commentContainer.appendChild(form);
    return commentContainer
  }

  componentDidMount () {
    this.parentElement = document.getElementById(this.id.audioBar);
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
            width: time ? (((time / this.state.audioDuration) * 100) + "%") : "0",
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
    this.mdMediaMatch = window.matchMedia("screen and (min-width: 800px)");
    this.mdMediaMatch.addListener(this.mdMediaMatchListener);

    this.smMediaMatch = window.matchMedia("screen and (min-width: 560px)");
    this.smMediaMatch.addListener(this.smMediaMatchListener);

    this.xsMediaMatch = window.matchMedia("screen and (max-width: 510px)");
    this.xsMediaMatch.addListener(this.xsMediaMatchListener);

    // initialize Controls based on mediaMatch
    this.setBasedOnMediaMatch();

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
      // $.post({
      //   url: `/pauses?song_id=${this.state.trackNo+1}`,  // todo: sync trackNo and song_id from db
      //   headers: {
      //     "X-CSRF-TOKEN": document.getElementById("_csrf_token").value,
      //   },
      //   success: (res)=>{
      //     console.log(res)
      //   },
      //   error: (e)=>{
      //     console.log(e)
      //   }
      // });
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
      // $.post({
      //   url: `/plays?song_id=${this.state.trackNo+1}`,  // todo: sync trackNo and song_id from db
      //   headers: {
      //     "X-CSRF-TOKEN": document.getElementById("_csrf_token").value,
      //   },
      //   success: (res)=>{
      //     console.log(res)
      //   },
      //   error: (e)=>{
      //     console.log(e)
      //   }
      // });
      this.audioElement.autoplay = true;
      this.setState({
        audioPlaying: true,
      });
      this.clockId = setInterval(()=>{
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
      }, 500);
    });

    // other listeners
    this.volBtn = document.getElementById(this.id.volumeButton);
    this.volBtnSldr = this.volBtn.getElementsByTagName("input")[0];
    this.volMatch = window.matchMedia("screen and (min-width: 950px)");
    this.volMatch.addListener(this.setVolumeOrientation);
    this.setVolumeOrientation();

    // timers
    if (this.props.src.length > 0){
      this.statusAnimationTimerId = setInterval(()=>{
        if (parseInt(this.state.dx) > this.STATUS_DX - Math.floor(3.0 * this.statusTextClientWidth)){
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
              dx: "0",
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
  }
  setBasedOnMediaMatch(){
    if (this.mdMediaMatch.matches) {
      console.log("md")
      this.setState(()=>{
        return {
          clockDisplay: true,
          buttonsActive: ["prev", "playPause", "next", "info", "comment", "bars"],
          volumeButtonStyle: this.style.volumeButton,
        }
      });
    } else if (this.smMediaMatch.matches) {
      console.log("sm")
      this.setState(()=>{
        return {
          clockDisplay: false,
          buttonsActive: ["prev", "playPause", "next", "info", "comment", "bars"],
          volumeButtonStyle: this.style.volumeButton,
        }
      });
    } else if (this.xsMediaMatch.matches) {
      console.log("xs")
      this.setState(()=>{
        return {
          clockDisplay: false,
          buttonsActive: ["playPause", "info", "comment", "bars"],
          volumeButtonStyle: {display: "none"},
        }
      });
    } else {
      console.log("else")
    }
  }
  componentWillUnmount(){
    clearInterval(this.statusAnimationTimerId);
  }
  secondsToMMSS(floatTime) {
    if (floatTime == null || floatTime == undefined || (floatTime == 0 && !this.audioElement.duration)){
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
          infoData: null,
          dx: "0",
        }
      });
      this.getInfo(this.props.src[next]);
    } else {
      this.setState(()=>{
        return {
          trackNo: 0,
          infoData: null,
          dx: "0",
        }
      });
      this.getInfo(this.props.src[0]);
    }
  }
  onPrev(){
    let prev = this.state.trackNo - 1;
    if (prev >= 0) {
      this.setState(()=>{
        return {
          trackNo: prev,
          infoData: null,
          dx: "0",
        }
      });
      this.getInfo(this.props.src[prev]);
    } else {
      this.setState(()=>{
        return {
          trackNo: this.state.src.length + prev,
          infoData: null,
          dx: "0",
        }
      });
      this.getInfo(this.props.src[this.state.src.length + prev]);
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
    let info = this.getInfo(this.props.src[this.state.trackNo]);
    let infoBtn = document.getElementById(this.id.infoButton);
    if (this.state.controlOpen === "info" || !info) {
      this.infoElement.style.display = "none";
      this.commentContainer.style.display = "none";
      this.barsContainer.style.display = "none";
      this.setState(()=>{
        return {
          controlOpen: null
        }
      })
    } else {
      this.infoElement.style.display = "flex";
      this.infoElement.style.flexDirection = "column";
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
    if (src && src.infoUrl){
      var xhr = new XMLHttpRequest();
      var URL = src.infoUrl;
      xhr.onreadystatechange = ()=>{
        if (xhr.readyState == 4 && xhr.status == 200){
          this.setState({
            infoData: JSON.parse(xhr.responseText),
          });
          console.log(JSON.parse(xhr.responseText))
        }
      };
      xhr.open("GET", URL, true);
      xhr.send();
      return true
    } else {
      console.debug("No info url provided for this track.")
      return false
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
    if (!this.props.src[this.state.trackNo] || this.state.controlOpen === "bars") {
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
    this.setState(()=>{
      return {
        audioMuted: !this.state.audioMuted
      }
    });
  }
  onDownload(){
    if (this.props.src[this.state.trackNo] && this.props.src[this.state.trackNo].downloadUrl){
      window.location = this.props.src[this.state.trackNo].downloadUrl + "?download=True";
    }
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
      volumeButtonClass = "fa fa-volume-off ctrl-btn audiobar-btn";
    } else {
      volumeButtonClass = "fa fa-volume-up ctrl-btn audiobar-btn";
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

    let title; let src;
    if (this.state.src[this.state.trackNo]){
      title = this.state.src[this.state.trackNo].title;
      src = this.state.src[this.state.trackNo].src;
    } else if (this.props._disabledStatus) {
      title = this.props._disabledStatus;
      src = "";
    } else {
      title = "";
      src = "";
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
      <div className="audioBar" id={this.id.audioBar} style={this.props.style}>
        <div style={this.style.audioBar}>
          {/* <i style={this.style.expandButton} className={expandButtonClassName} onClick={this.expandCollapse}/> */}
          <div style={this.style.controls} className="audioBarControls ml-15">
            <button className="fas fa-step-backward ctrl-btn audiobar-btn" 
              style={this.state.buttonsActive.indexOf("prev") >= 0 ? this.style.button : {display: "none"}}
              title="Back" onClick={this.props.onPrev ? this.props.onPrev : this.onPrev}/>
            <button className={playButtonClass} id="playButton"
              style={this.state.buttonsActive.indexOf("playPause") >= 0 ? this.style.button : {display: "none"}}
              title="Play" onClick={this.onPlayPause}/>
            <button className="fas fa-step-forward ctrl-btn audiobar-btn" 
              style={this.state.buttonsActive.indexOf("next") >= 0 ? this.style.button : {display: "none"}}
              title="Forward" onClick={this.props.onNext ? this.props.onNext : this.onNext}/>
            <i className={volumeButtonClass} style={this.state.volumeButtonStyle} id={this.id.volumeButton}>
              {/* <div style={{position: "fixed", height: "33px", width: "33px"}} onClick={this.onMute}/> */}
              <input type="range" min="-36" max="6" step="0.5" defaultValue="0" 
                style={this.state.volumeSliderStyle} id={this.id.volumeSliderInput}/>
            </i>
          </div>
          <div className="flex-group" style={{right: "0", bottom: "7.5px", width: "100%", justifyContent: "flex-end"}}>
            <div className="flex-group" style={{width: "100%", justifyContent: "flex-end"}}>
              <div style={this.state.clockDisplay ? this.style.clock : {display: "none"}} className="clock">
                <span className="m-auto">
                  {this.secondsToMMSS(this.state.audioTime)}
                </span>
                <span className="m-auto">
                  |
                </span>
                <span className="m-auto">
                    {this.secondsToMMSS(this.state.audioDuration)}
                </span>
              </div>
              <div style={this.style.status} className="status">
                <div style={this.style.statusBarContainer} id={this.id.statusBarContainer}>
                  <div style={this.state.statusBarStyle} className="status-invert"/>
                  <div style={this.state.mouseoverStatusBarStyle}/>
                </div>
                <svg viewBox="0 0 100 100" width="95%" height="20px" style={{margin: "auto 5px"}}>
                  <text fill="lawngreen" x="-870" y="87" dx={this.state.dx} dy={this.state.dy} fontSize="100" letterSpacing="20" id={this.id.statusText}>
                    {title}
                  </text>
                </svg>
              </div>
            </div>
            <div className="flex-group my-auto mx-5">
              <button className={infoClass}
                title="Song Info"
                onClick={this.onInfo} id={this.id.infoButton}
                style={this.state.buttonsActive.indexOf("info") >= 0 ? this.style.button : {display: "none"}}>
                  <div style={this.style.infoContainer} id={this.id.infoContainer}>
                    
                    {
                      this.state.infoData ? 
                      <div>
                        <u>Information:</u><br/>
                        Song: {this.state.infoData ? this.state.infoData.name : null}<br/>
                        Artist: {this.state.infoData ? this.state.infoData.artist : null}<br/>
                        Release Year: {this.state.infoData ? this.state.infoData.releaseYear : null}
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
              {/* comment container built in componentDidMount */}
              {/* <button className={commentClass} id={this.id.commentButton}
                title="Comment"
                onClick={this.onComment}
                style={this.state.buttonsActive.indexOf("comment") >= 0 ? this.style.button : {display: "none"}}>
              </button> */}
              <button className={barsClass} id={this.id.barsButton}
                title="Track List"
                onClick={this.onBars}
                style={this.state.buttonsActive.indexOf("bars") >= 0 ? this.style.button : {display: "none"}}>
                <div style={this.style.barsContainer} id={this.id.barsContainer}>
                  <div>
                    {
                      this.props.src ? 
                      this.props.src.map(
                      (src)=>
                        <div key={`bars_track${this.props.src.indexOf(src)}`}
                          style={this.style.barsContainerItem} 
                          className="bars-container-item"
                          onClick={()=>this.onClickBarsItem(src)}>
                          {src.title.split(" - ").slice(-1)[0]}
                        </div>
                      ) :
                      {}
                    }
                  </div>
                </div>
              </button>
              <button className="fa fa-download alt green audiobar-btn" 
                style={this.style.button} 
                title={`Download ${title}`}
                onClick={this.props.onDownload ? this.props.onDownload : this.onDownload}/>
            </div>
          </div>
          <audio src={src} id={this.id.audio} type="audio/mpeg"></audio>
        </div>
      </div>
    );
  }
}