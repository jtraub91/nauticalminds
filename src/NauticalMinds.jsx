import Web3 from "web3";
// import NauticalMindsEp from "../contracts_build/NauticalMindsEp.json";

import React, { useState, useEffect } from "react";

import AudioBar from "./components/AudioBar.jsx";
import AboutModal from "./components/AboutModal.jsx";
import ConnectModal from "./components/ConnectModal.jsx";
import Header from "./components/Header.jsx";
import MintModal from "./components/MintModal.jsx";
import { getCookie, getCookieValue, clearCookie, parseJwt } from "./utils";
import TipModal from "./components/TipModal.jsx";

import config from "./config";

// const contractAbi = NauticalMindsEp.abi;
// const contractAddress = "0x73C9499205a1fdc69539252dbE2Da96c01C8228D";
const metaUri = "ipfs://QmTspwroiCnV3KpP3Gj63WmJpJaRDNMki8JbWGvdbrDzC3";

function NauticalMinds(props) {
  const [userEntered, setUserEntered] = useState(false);
  const [userAccount, setUserAccount] = useState("");
  const [connectModalVisible, setConnectModalVisible] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [mintModalVisible, setMintModalVisible] = useState(false);
  const [tipModalVisible, setTipModalVisible] = useState(false);
  const [metaData, setMetaData] = useState({});

  useEffect(() => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      // const contract = new window.web3.eth.Contract(contractAbi, contractAddress);

      window.web3.eth
        .getAccounts()
        .then((accounts) => {
          let token = getCookieValue("token");
          if (accounts.length > 0 && token) {
            let payload = parseJwt(token);
            let acct = accounts[0].toLowerCase();
            if (acct !== "0x" + payload.ethAddress) {
              console.log("invalid token cookie will be cleared");
              clearCookie("token");
            } else {
              console.log("valid cookie");
              setUserAccount("0x" + payload.ethAddress.toUpperCase()); // capitalize
              fetchMetadata();
            }
          } else if (accounts.length > 0) {
            console.log("connected accounts but no jwt token");
            console.log(accounts);
          } else {
            console.log("no connected accounts");
          }
        })
        .catch((e) => console.error(e));
      window.ethereum.on("accountsChanged", (accounts) => {
        clearCookie("token");
        setUserAccount(""); // force user to click connect and sign in
      });
      window.ethereum.on("chainChanged", (chainId) => window.location.reload());
    } else {
      console.log("Please install MetaMask");
    }
  }, []);
  function fetchMetadata() {
    let metaReq = new XMLHttpRequest();
    metaReq.onreadystatechange = (resp) => {
      if (resp.currentTarget.readyState === 4) {
        let data = JSON.parse(resp.currentTarget.responseText);
        setMetaData(data);
      }
    };
    metaReq.open("GET", `/ipfs/${metaUri.split("ipfs://")[1]}?file_type=json`);
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
  function connectMetamaskCallback(accounts) {
    let acct = accounts[0].toLowerCase();
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (resp) {
      if (xhr.readyState === 4) {
        let data = resp.currentTarget.response;
        data = JSON.parse(data);
        if ("0x" + data.ethAddress == acct && data.sigRequest !== undefined) {
          window.web3.eth.personal
            .sign(data.sigRequest, acct)
            .then((sig) => {
              let req = new XMLHttpRequest();
              req.onreadystatechange = (resp) => {
                if (req.readyState === 4) {
                  let sigResp = JSON.parse(resp.currentTarget.responseText);
                  if (sigResp.error) {
                    console.error(sigResp.error);
                  } else {
                    // set token cookie
                    document.cookie = `token=${sigResp.token}; Path=/; SameSite=strict;`; // todo: expires
                    setConnectModalVisible(false);
                    setUserAccount(data.ethAddress.toUpperCase());
                    fetchMetadata();
                  }
                }
              };
              req.onerror = (e) => console.error(e);
              req.open("POST", "/sig");
              req.setRequestHeader("Content-Type", "application/json");
              req.send(
                JSON.stringify({
                  ethAddress: data.ethAddress,
                  signature: sig,
                })
              );
            })
            .catch((e) => {
              console.error(e);
            });
        } else {
          console.debug(resp);
        }
      }
    };
    xhr.onerror = function (err) {
      console.error(err);
    };
    xhr.open("POST", "/connect");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
      JSON.stringify({
        ethAddress: acct,
      })
    );
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
      <ConnectModal
        connectMetamaskCallback={connectMetamaskCallback}
        visible={connectModalVisible}
        onClick={modalBackdropOnClick}
      />
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
            <img src="/static/images/nauticalstarship-alt.svg" />
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
