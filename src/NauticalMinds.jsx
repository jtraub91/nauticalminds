import React, { useState, useEffect } from "react";

import AudioBar from "./components/AudioBar.jsx";
import AboutModal from "./components/AboutModal.jsx";
import Header from "./components/Header.jsx";
import TipModal from "./components/TipModal.jsx";

import config from "./config";

const metaUri = config.metaUri;
const metaAltUri = config.metaAltUri;
const PREFER_ALT_URI = true;

function NauticalMinds(props) {
  const [userEntered, setUserEntered] = useState(true);
  const [userAccount, setUserAccount] = useState("");
  const [connectModalVisible, setConnectModalVisible] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [mintModalVisible, setMintModalVisible] = useState(false);
  const [tipModalVisible, setTipModalVisible] = useState(false);
  const [metaData, setMetaData] = useState({});

  useEffect(() => {
    fetchMetadata();
  }, []);
  function fetchMetadata() {
    let metaReq = new XMLHttpRequest();
    metaReq.onreadystatechange = (resp) => {
      if (resp.currentTarget.readyState === 4) {
        let data = JSON.parse(resp.currentTarget.responseText);
        setMetaData(data);
      }
    };
    if (PREFER_ALT_URI) {
      metaReq.open("GET", metaAltUri);
    } else {
      metaReq.open(
        "GET",
        `/ipfs/${metaUri.split("ipfs://")[1]}?file_type=json`
      );
    }
    metaReq.setRequestHeader("Content-Type", "application/json");
    metaReq.send();
  }
  function connectOnClick(e) {
    console.log(document.cookie);
    setConnectModalVisible(true);
  }
  function aboutOnClick(e) {
    setAboutModalVisible(true);
  }
  function modalBackdropOnClick(e) {
    console.log("parent");
    setConnectModalVisible(false);
    setAboutModalVisible(false);
    setMintModalVisible(false);
    setTipModalVisible(false);
  }
  return (
    <div>
      <Header
        userData={{}}
        userAccount={userAccount}
        aboutOnClick={aboutOnClick}
        connectOnClick={connectOnClick}
      />
      {props.children}
      {/* <MintModal
        _metaData={metaData}
        userAccount={userAccount}
        visible={mintModalVisible}
        onClick={modalBackdropOnClick}/> */}
      <AboutModal visible={aboutModalVisible} onClick={modalBackdropOnClick} />
      <TipModal
        btcWalletAddress={config.btcWalletAddress}
        ethWalletAddress={config.ethWalletAddress}
        visible={tipModalVisible}
        onClick={modalBackdropOnClick}
      />
      {userEntered ? (
        <AudioBar
          _metaData={metaData}
          //   _disabledStatus="Connect to listen"
          tipModalOpenCallback={() => setTipModalVisible(true)}
          trackList={metaData.trackList ? metaData.trackList : []}
        />
      ) : (
        <div>
          <button
            className="center-rocket-container"
            onClick={(e) => {
              setUserEntered(true);
              fetchMetadata();
            }}
          >
            <div className="enter-text">Enter</div>
            <img src="/images/nauticalstarship-alt.svg" />
          </button>
          <footer className="absolute bottom-0 left-0">
            &copy; 2022 Nautical Records LLC
          </footer>
        </div>
      )}
    </div>
  );
}
export default NauticalMinds;
