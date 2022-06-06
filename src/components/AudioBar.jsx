import React from "react";

import config from "../config";
import { shortenAddress } from "./Header.jsx";

const TIMESTAMP = Math.round(new Date().getTime());
const id = {
  audio: `audio_element_${TIMESTAMP}`,
  statusBarContainer: `status_bar_container_${TIMESTAMP}`,
  volumeButton: `volume_button_${TIMESTAMP}`,
};

const xxxsMediaMatch = window.matchMedia("screen");
const xxsMediaMatch = window.matchMedia("screen and (min-width: 250px)");
const xsMediaMatch = window.matchMedia("screen and (min-width: 430px)");
const smMediaMatch = window.matchMedia("screen and (min-width: 560px)");
const mdMediaMatch = window.matchMedia("screen and (min-width: 767px)");
const lgMediaMatch = window.matchMedia("screen and (min-width: 910px)");

const PREFER_ALT_URI = false;

function secondsToMMSS(floatTime) {
  if (floatTime == null || floatTime == undefined) {
    return "--:--";
  }
  let sec = Math.floor(floatTime);
  let minutes = Math.floor(sec / 60);
  let seconds = Math.floor(floatTime - minutes * 60);

  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return minutes + ":" + seconds;
}

function stringifyBitrate(bitrate) {
  let b = bitrate / 1000;
  return b + "kbps";
}

export default class AudioBar extends React.Component {
  constructor(props) {
    super(props);

    this.audioElement = "";

    this.state = {
      tipInfo: {
        address: config.tipAddresses.btc,
        currency: "BTC",
      },
      tipAddrCopyConfirmActive: false,
      statusBarStyle: {
        position: "absolute",
        height: "100%",
        width: "0",
      },
      mouseoverStatusBarStyle: {
        position: "absolute",
        height: "100%",
        width: "0",
        display: "none",
      },
      audioTime: null, // change to clockTime with default
      audioDuration: null, // ^ similar
      trackNo: 0,
      audioMuted: false,
      dx: "0",
      dy: "0",
      controlsActive: ["playPause", "info", "bars", "tip"],
      // unordered list containing any of:
      // ["prev", "playPause", "next", "vol", "clock", "status", "info", "comment", "bars", "download", "tip"]
      infoData: null,
      controlOpen: "", // ["info"|"comment"|"bars"]
      playButtonClassName: "fa fa-play audiobar-btn deep-purple text-white", // fa-play or fa-pause
      albumImgUri: true,
    };
  }
  componentDidMount() {
    // audio
    window.onclick = () => {
      this.setState({
        controlOpen: null,
      });
    };
    this.audioContext = new AudioContext();
    this.audioElement = document.getElementById(id.audio);
    this.audioSource = this.audioContext.createMediaElementSource(
      this.audioElement
    );
    this.gainNode = this.audioContext.createGain();

    this.audioSource.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    // audio event listeners
    this.audioElement.addEventListener("play", (e) => {
      this.audioElement.autoplay = true;
      this.setState({
        playButtonClassName: "fa fa-pause audiobar-btn deep-purple text-white",
      });
      this.intervalHandle = setInterval(() => {
        let track = this.props.trackList[this.state.trackNo];
        let metaDuration = (8 * track.size) / track.bitrate;
        let duration;
        if (this.audioElement.duration == Infinity) {
          duration = metaDuration;
        } else {
          duration = this.audioElement.duration;
        }
        this.setState({
          audioTime: this.audioElement.currentTime,
          audioDuration: duration,
          statusBarStyle: {
            position: "absolute",
            height: "100%",
            width: (this.audioElement.currentTime / duration) * 100 + "%",
          },
        });
      }, 699);
    });
    this.audioElement.addEventListener("ended", (e) => {
      if (this.state.trackNo == this.props.trackList.length - 1) {
        this.audioElement.autoplay = false;
      }
      this.setState({
        playButtonClassName: "fa fa-play audiobar-btn deep-purple text-white",
      });
      clearInterval(this.intervalHandle);
      this.onNext(); // auto go to next song
    });
    this.audioElement.addEventListener("pause", (e) => {
      this.setState({
        playButtonClassName: "fa fa-play audiobar-btn deep-purple text-white",
      });
      clearInterval(this.intervalHandle);
    });
    this.audioElement.addEventListener("canplay", (e) => {
      let track = this.props.trackList[this.state.trackNo];
      let metaDuration = (8 * track.size) / track.bitrate;
      let duration;
      if (this.audioElement.duration == Infinity) {
        duration = metaDuration;
      } else {
        duration = this.audioElement.duration;
      }
      this.setState({
        audioTime: this.audioElement.currentTime,
        audioDuration: duration,
      });
    });

    let statusBarContainer = document.getElementById(id.statusBarContainer);

    // status bar event listeners
    statusBarContainer.onclick = (e) => {
      // set audio time and status bar style based upon where user clicks
      //    in status bar container
      let rect = statusBarContainer.getBoundingClientRect();
      let x = e.clientX - rect.left; //x position within the element.

      // var y = e.clientY - rect.top;  //y position within the element.
      let time =
        (x / statusBarContainer.offsetWidth) * this.state.audioDuration;

      console.log(time);
      this.audioElement.currentTime = time;
      this.setState({
        audioTime: time,
        statusBarStyle: {
          position: "absolute",
          height: "100%",
          width: time ? (time / this.state.audioDuration) * 100 + "%" : "0",
        },
      });
    };
    statusBarContainer.addEventListener("mousemove", (e) => {
      // follow mouse with status bar cursor
      let rect = statusBarContainer.getBoundingClientRect();
      let x = e.clientX - rect.left; // x position within the element.
      this.setState({
        mouseoverStatusBarStyle: {
          position: "absolute",
          height: "100%",
          width: (100 * x) / statusBarContainer.offsetWidth + "%",
          borderRight: "2px solid lawngreen",
        },
      });
    });
    statusBarContainer.addEventListener("mouseleave", (e) => {
      // remove cursor when mouse leaves
      this.setState({
        mouseoverStatusBarStyle: { display: "none" },
      });
    });

    // other listeners
    this.volumeButton = document.getElementById(id.volumeButton);
    this.volumeButtonSlider =
      this.volumeButton.getElementsByTagName("input")[0];
    this.volumeButtonSlider.onchange = (e) => {
      this.gainNode.gain.value = 10 ** (parseFloat(e.target.value) / 20); // log scale
    };

    // set visible controls based on media match
    this.setControlsBasedOnMediaMatch();
    // and update on change to any
    xxxsMediaMatch.addEventListener(
      "change",
      this.setControlsBasedOnMediaMatch
    );
    xxsMediaMatch.addEventListener("change", this.setControlsBasedOnMediaMatch);
    xsMediaMatch.addEventListener("change", this.setControlsBasedOnMediaMatch);
    smMediaMatch.addEventListener("change", this.setControlsBasedOnMediaMatch);
    mdMediaMatch.addEventListener("change", this.setControlsBasedOnMediaMatch);
    lgMediaMatch.addEventListener("change", this.setControlsBasedOnMediaMatch);
  }
  componentWillUnmount() {
    clearInterval(this.intervalHandle);
    clearInterval(this.statusIntervalHandle);
  }
  setControlsBasedOnMediaMatch = () => {
    // ["prev", "playPause", "next", "vol", "clock", "status", "info", "comment", "bars", "download", "tip"],
    if (lgMediaMatch.matches) {
      this.setState({
        controlsActive: [
          "prev",
          "playPause",
          "next",
          "vol",
          "clock",
          "status",
          "info",
          "bars",
          "tip",
        ],
      });
    } else if (mdMediaMatch.matches) {
      this.setState({
        controlsActive: [
          "prev",
          "playPause",
          "next",
          // "vol",
          // "clock",
          "status",
          "info",
          "bars",
          "tip",
        ],
      });
    } else if (smMediaMatch.matches) {
      this.setState({
        controlsActive: [
          "prev",
          "playPause",
          "next",
          "status",
          "info",
          "bars",
          "tip",
        ],
      });
    } else if (xsMediaMatch.matches) {
      this.setState({
        controlsActive: [
          "prev",
          "playPause",
          "next",
          "status",
          "info",
          "bars",
          "tip",
        ],
      });
    } else if (xxsMediaMatch.matches) {
      this.setState({
        controlsActive: ["prev", "playPause", "next", "info", "bars", "tip"],
      });
    } else if (xxxsMediaMatch.matches) {
      this.setState({
        controlsActive: ["playPause", "info", "bars", "tip"],
      });
    } else {
      console.log("else");
    }
  };
  onCommentSubmit = (e) => {
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
  };
  onPlayPause = () => {
    if (this.audioContext.state == "suspended") {
      this.audioContext.resume();
    }
    if (this.audioElement.paused === true) {
      this.audioElement.play();
    } else {
      this.audioElement.pause();
    }
  };
  onNext = () => {
    let next = this.state.trackNo + 1;
    if (next < this.props.trackList.length) {
      this.setState({
        trackNo: next,
        infoData: null,
        dx: "0",
      });
    } else {
      this.setState({
        trackNo: 0,
        infoData: null,
        dx: "0",
      });
    }
  };
  onPrev = () => {
    let prev = this.state.trackNo - 1;
    if (this.state.audioTime > 2) {
      this.audioElement.currentTime = 0;
    } else if (prev >= 0) {
      this.setState({
        trackNo: prev,
        infoData: null,
        dx: "0",
      });
    } else {
      this.setState({
        trackNo: this.props.trackList.length + prev,
        infoData: null,
        dx: "0",
      });
    }
  };
  onInfo = (e) => {
    e.stopPropagation();
    if (this.state.controlOpen === "info") {
      this.setState({
        controlOpen: null,
      });
    } else {
      this.setState({
        controlOpen: "info",
      });
    }
  };
  onComment = (e) => {
    e.stopPropagation();
    if (this.state.controlOpen === "comment") {
      this.setState({
        controlOpen: null,
      });
    } else {
      this.setState({
        controlOpen: "comment",
      });
    }
  };
  onBars = (e) => {
    e.stopPropagation();
    if (
      !this.props.trackList[this.state.trackNo] ||
      this.state.controlOpen === "bars"
    ) {
      this.setState({
        controlOpen: null,
      });
    } else {
      this.setState({
        controlOpen: "bars",
      });
    }
  };
  onDownload = (e) => {
    e.stopPropagation();
    //
    if (this.state.controlOpen == "download") {
      this.setState({
        controlOpen: null,
      });
    } else {
      this.setState({
        controlOpen: "download",
      });
    }
  };
  onTip = (e) => {
    e.stopPropagation();
    if (this.state.controlOpen == "tip") {
      this.setState({
        controlOpen: null,
      });
    } else {
      this.setState({
        controlOpen: "tip",
      });
    }
  };
  onClickBarsItem = (src) => {
    let index = this.props.trackList.findIndex((el) => {
      return el === src;
    });
    this.setState({
      trackNo: index,
    });
  };
  onMute = () => {
    this.setState({
      audioMuted: !this.state.audioMuted,
    });
  };
  onAlbumImg = () => {
    if (this.props._metaData) {
      this.setState({
        albumImgUri: !this.state.albumImgUri,
      });
    }
  };
  setTipInfo = (e) => {
    e.persist();
    this.setState({
      tipInfo: {
        currency: e.target.value,
        address: config.tipAddresses[e.target.value.toLowerCase()],
      },
    });
    if (this.tipAddrCopyConfirmTimerHandle) {
      clearInterval(this.tipAddrCopyConfirmTimerHandle);
      this.setState({
        tipAddrCopyConfirmActive: false,
      });
    }
  };
  tipAddressCopy = () => {
    navigator.clipboard
      .writeText(this.state.tipInfo.address)
      .then(() => {
        console.log(
          `${this.state.tipInfo.currency} address copied to clipboard`
        );
      })
      .catch(() => console.error("failed to copy tip address to clipboard"));
    this.setState({
      tipAddrCopyConfirmActive: true,
    });
    this.tipAddrCopyConfirmTimerHandle = setTimeout(() => {
      this.setState({
        tipAddrCopyConfirmActive: false,
      });
    }, 3333);
  };
  render() {
    let runtime = 0;
    let noSongs = 0;
    if (this.props._metaData && this.props._metaData.trackList) {
      noSongs = this.props._metaData.trackList.length;
      for (let i = 0; i < noSongs; i += 1) {
        runtime +=
          (this.props._metaData.trackList[i].size * 8) /
          this.props._metaData.trackList[i].bitrate;
      }
    }
    let volumeButtonClass;
    if (this.state.audioMuted) {
      volumeButtonClass =
        "fa fa-volume-off audiobar-btn deep-purple text-white";
    } else {
      volumeButtonClass =
        "fa fa-volume-up audiobar-btn deep-purple text-white vol-btn-animation";
    }
    let title = "";
    let src = undefined;
    if (this.props.trackList.length > 0) {
      title = this.props.trackList[this.state.trackNo].title;
      if (this.props.trackList[this.state.trackNo].altUri && PREFER_ALT_URI) {
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
          <div className="flex flex-row h-full my-auto ml-1 mr-auto">
            <button
              className="fas fa-step-backward audiobar-btn deep-purple text-white"
              style={
                this.state.controlsActive.indexOf("prev") >= 0
                  ? {}
                  : { display: "none" }
              }
              title="Back"
              onClick={this.onPrev}
            />
            <button
              className={this.state.playButtonClassName}
              id="playButton"
              style={
                this.state.controlsActive.indexOf("playPause") >= 0
                  ? {}
                  : { display: "none" }
              }
              title="Play"
              onClick={this.onPlayPause}
            />
            <button
              className="fas fa-step-forward audiobar-btn deep-purple text-white"
              style={
                this.state.controlsActive.indexOf("next") >= 0
                  ? {}
                  : { display: "none" }
              }
              title="Forward"
              onClick={this.onNext}
            />
            <i
              style={
                this.state.controlsActive.indexOf("vol") >= 0
                  ? {}
                  : { display: "none" }
              }
              className={volumeButtonClass}
              id={id.volumeButton}
            >
              <input
                className="vol-slider"
                type="range"
                min="-36"
                max="6"
                step="0.5"
                defaultValue="0"
              />
            </i>
          </div>
          <div className="flex flex-row right-0 w-full">
            <div className="flex flex-row w-full justify-end">
              <div
                className="clock"
                style={
                  this.state.controlsActive.indexOf("clock") >= 0
                    ? {}
                    : { display: "none" }
                }
              >
                <div className="clock-digit-container">
                  <span className="clock-digit">
                    {secondsToMMSS(this.state.audioTime)}
                  </span>
                </div>
                <div className="clock-digit-container">
                  <span className="clock-digit">
                    {secondsToMMSS(this.state.audioDuration)}
                  </span>
                </div>
              </div>
              <div
                style={
                  this.state.controlsActive.indexOf("status") >= 0
                    ? {}
                    : { display: "none" }
                }
                className="status w-full md:max-w-xs"
              >
                <div
                  className="absolute w-full h-full"
                  id={id.statusBarContainer}
                >
                  <div
                    style={this.state.statusBarStyle}
                    className="status-invert"
                  />
                  <div
                    className=""
                    style={this.state.mouseoverStatusBarStyle}
                  />
                </div>
                <div className="status-title">{title}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-row h-full my-auto ml-auto mr-1">
            <button
              className={
                this.state.controlOpen == "info"
                  ? "fas fa fa-info-circle audiobar-btn green active"
                  : "fas fa fa-info-circle audiobar-btn green"
              }
              title="Info"
              onClick={this.onInfo}
              style={
                this.state.controlsActive.indexOf("info") >= 0
                  ? {}
                  : { display: "none" }
              }
            />
            <button
              className={
                this.state.controlOpen == "comment"
                  ? "far fa-comment alt audiobar-btn green active"
                  : "far fa-comment alt audiobar-btn green"
              }
              title="Comment"
              onClick={this.onComment}
              style={
                this.state.controlsActive.indexOf("comment") >= 0
                  ? {}
                  : { display: "none" }
              }
            />
            <button
              className={
                this.state.controlOpen == "bars"
                  ? "fas fa-list audiobar-btn green active"
                  : "fas fa-list audiobar-btn green"
              }
              title="Track List"
              onClick={this.onBars}
              style={
                this.state.controlsActive.indexOf("bars") >= 0
                  ? {}
                  : { display: "none" }
              }
            />
            <button
              className={
                this.state.controlOpen == "download"
                  ? "fa fa-download alt audiobar-btn green active"
                  : "fa fa-download alt audiobar-btn green"
              }
              style={
                this.state.controlsActive.indexOf("download") >= 0
                  ? {}
                  : { display: "none" }
              }
              title="Download"
              onClick={this.onDownload}
            />
            <button
              className={
                this.state.controlOpen == "tip"
                  ? "fab fa-bitcoin audiobar-btn green active"
                  : "fab fa-bitcoin audiobar-btn green"
              }
              style={
                this.state.controlsActive.indexOf("tip") >= 0
                  ? {}
                  : { display: "none" }
              }
              onClick={this.onTip}
              title="Tip"
            />
          </div>
          <audio src={src} id={id.audio} />
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          className="info-container hidden-fade-in"
          style={
            this.state.controlOpen == "info"
              ? { opacity: 1, visibility: "visible" }
              : {}
          }
        >
          <div className="flex flex-col font-mono justify-between">
            {this.props.trackList.length > 0
              ? Object.keys(this.props.trackList[this.state.trackNo]).map(
                  (attr) => {
                    if (
                      ["track", "title", "artist", "album", "year"].indexOf(
                        attr
                      ) >= 0
                    ) {
                      return (
                        <div className="flex w-auto" key={attr}>
                          <span className="my-auto mx-0.5 text-right">
                            {attr}:
                          </span>
                          <span className="my-auto mx-0.5 text-left">
                            {this.props.trackList[this.state.trackNo][attr]}
                          </span>
                        </div>
                      );
                    } else {
                      return;
                    }
                  }
                )
              : null}
          </div>
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          className="comment-container hidden-fade-in"
          style={
            this.state.controlOpen == "comment"
              ? { opacity: 1, visibility: "visible" }
              : {}
          }
        >
          <form className="flex flex-col">
            <textarea placeholder="Leave a comment" />
            <button className="fa fa-undo comment-reset-btn" type="reset" />
            <button className="comment-submit-btn">Submit</button>
          </form>
        </div>
        <div
          className="bars-container hidden-fade-in"
          style={
            this.state.controlOpen == "bars"
              ? { opacity: 1, visibility: "visible" }
              : {}
          }
        >
          <div className="flex flex-col">
            {this.props.trackList
              ? this.props.trackList.map((track) => (
                  <a
                    className="bars-container-item"
                    href="#"
                    key={`bars_track_${this.props.trackList.indexOf(track)}`}
                    onClick={(e) => {
                      e.preventDefault();
                      this.onClickBarsItem(track);
                    }}
                  >
                    {track.track}. {track.title}
                  </a>
                ))
              : {}}
          </div>
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          className="download-container hidden-fade-in"
          style={
            this.state.controlOpen == "download"
              ? { opacity: 1, visibility: "visible" }
              : {}
          }
        >
          <div className="flex flex-col">
            <div className="flex flex-row">
              <div className="download-container-album-img">
                <button className="fas fa-angle-left img-btn left-0" />
                <button className="fas fa-angle-right img-btn right-0" />
                <img
                  onClick={this.onAlbumImg}
                  className="w-full h-full"
                  src={
                    this.state.albumImgUri
                      ? this.props._metaData.albumCoverUri
                      : this.props._metaData.altAlbumCoverUri
                  }
                />
              </div>
              <div className="download-container-album-details">
                <div className="flex flex-col m-auto">
                  <span className="m-auto">{this.props._metaData.album}</span>
                  <span className="flex">
                    <span className="m-auto">
                      {this.props._metaData.trackList
                        ? this.props._metaData.trackList[0].fileType
                        : ""}
                    </span>
                    <span className="m-auto">-</span>
                    <span className="m-auto">
                      {this.props._metaData.trackList
                        ? stringifyBitrate(
                            this.props._metaData.trackList[0].bitrate
                          )
                        : ""}
                    </span>
                  </span>
                  <span className="m-auto">{noSongs} songs</span>
                  <span className="m-auto">{secondsToMMSS(runtime)}</span>
                </div>
              </div>
            </div>
          </div>
          <button
            className="download-btn"
            onClick={() => {
              window.location = "/download";
            }}
          >
            <span className="w-auto">Download</span>
            <i className="fa fa-download mx-1" />
          </button>
          <button
            className="download-btn bitcoin"
            onClick={this.props.tipModalOpenCallback}
          >
            <span className="w-auto">Tip?</span>
            <i className="fab fa-bitcoin mx-1" />
          </button>
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          className="tip-container hidden-fade-in"
          style={
            this.state.controlOpen == "tip"
              ? { opacity: 1, visibility: "visible" }
              : {}
          }
        >
          <div className="flex flex-col font-mono">
            <div className="flex w-full">
              <h4 className="font-mono">Tip?</h4>
              <select
                onChange={this.setTipInfo}
                className="text-black ml-auto mr-0"
              >
                <option value="BTC">BTC</option>
                <option value="XMR">XMR</option>
              </select>
            </div>
            <div className="flex my-4">
              <div
                id="tip_addr"
                className="tip-address-container-address w-auto select-none text-center"
                title={this.state.tipInfo.address}
              >
                {this.state.tipAddrCopyConfirmActive
                  ? // `${this.state.tipInfo.currency} address copied to clipboard` :
                    "address copied"
                  : shortenAddress(this.state.tipInfo.address, (length = 16))}
              </div>
              <button
                className="tip-address-container-copy"
                onClick={this.tipAddressCopy}
              >
                <i className="far fa-copy purple" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
