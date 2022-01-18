import React from "react";
import { useState, useEffect } from "react";

function MintModal(props) {
  let containerClass = "modal-container";
  if (props.visible) {
    containerClass += " opaque";
  }
  function secondsToMMSS(floatTime) {
    let sec = Math.floor(floatTime);
    let minutes = Math.floor(sec / 60);
    let seconds = Math.floor(floatTime - minutes * 60);

    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return minutes + ":" + seconds;
  }
  function bitrateToHumanReadable(bitrate) {
    let kbps = parseInt(bitrate / 1000);
    return kbps + "kbps";
  }
  return (
    <div className={containerClass}>
      <div className="modal-backdrop" onClick={props.onClick} />
      <div className="modal-content dark-bg m-auto border-black border-solid border-2 max-w-md max-h-96 overflow-y-scroll">
        <h3 className="form-header">Mint {props._metaData.name}</h3>
        {props.userAccount && props._metaData.trackList ? (
          <div className="flex flex-col font-mono text-white">
            <img
              className="my-4 mx-auto w-6/12 border-cyan"
              src="/static/images/NauticalMindsEP.jpg"
            />
            <div className="w-6/12 mt-2 mb-4 mx-auto">
              <div className="flex">
                <span className="w-4/12 text-right my-0.25 mx-0.5">
                  Artist:
                </span>
                <span className="w-8/12 text-left my-0.25 mx-0.5">
                  {props._metaData.artist}
                </span>
              </div>
              <div className="flex">
                <span className="w-4/12 text-right my-0.25 mx-0.5">Album:</span>
                <span className="w-8/12 text-left my-0.25 mx-0.5">
                  {props._metaData.album}
                </span>
              </div>
              <div className="flex">
                <span className="w-4/12 text-right my-0.25 mx-0.5">
                  Album Year:
                </span>
                <span className="w-8/12 text-left my-0.25 mx-0.5">
                  {props._metaData.albumYear}
                </span>
              </div>
            </div>
            <div className="w-8/12 mx-auto mb-1">
              {props._metaData.trackList.map((tr) => {
                return (
                  <div className="flex m-auto" key={`mint_track_${tr.track}`}>
                    <span className="px-1 text-right">{tr.track}.</span>
                    <span className="px-1 text-left">
                      {tr.title} ({tr.fileType},{" "}
                      {bitrateToHumanReadable(tr.bitrate)})
                    </span>
                    <span className="px-1 ml-auto mr-0 text-right">
                      {secondsToMMSS((tr.size * 8) / tr.bitrate)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="w-8/12 text-center my-2 m-auto italic">
              NMEP is an ERC 721 token on the public Ethereum blockchain, that
              also gives you certain access on nauticalminds.com the terms of
              such governed by Nautical Records LLC Terms of Service.
            </div>
            <button className="wallet-btn mt-2 mb-4 mx-auto p-1">
              <div className="wallet-btn-text-container">Mint EP</div>
            </button>
          </div>
        ) : (
          <p className="text-white m-auto w-full p-5">
            <a href="#" className="contact-link-green">
              Connect
            </a>{" "}
            your wallet to mint a copy &#x1F609;
          </p>
        )}
      </div>
    </div>
  );
}
export default MintModal;
