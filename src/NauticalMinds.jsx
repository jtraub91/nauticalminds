import Web3 from 'web3';
// import NauticalMindsEp from "../contracts_build/NauticalMindsEp.json";

import React, { useState, useEffect } from 'react';

import AudioBar from './components/AudioBar.jsx';
import AboutModal from './components/AboutModal.jsx';
import ConnectModal from './components/ConnectModal.jsx';
import MintModal from './components/MintModal.jsx';

// const contractAbi = NauticalMindsEp.abi;
// const contractAddress = "0x73C9499205a1fdc69539252dbE2Da96c01C8228D";
const metaUri = "ipfs://QmbMJCJgN5WABDvVkuMJmMzPBF4wGBjme5igck1qCpdvd3";

import debugMeta from "./debugMeta.json";

function NauticalMinds(props){

  const [userData, setUserData] = useState({});
  const [userAccount, setUserAccount] = useState("");
  const [connectModalVisible, setConnectModalVisible] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [mintModalVisible, setMintModalVisible] = useState(false)
  const [userAddressExpanded, setUserAddressExpanded] = useState(false);
  const [metaData, setMetaData] = useState({})

  useEffect(()=>{
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      // const contract = new window.web3.eth.Contract(contractAbi, contractAddress);
  
      window.ethereum.on('accountsChanged', (accounts)=>setUserAccount(accounts[0]));
      window.ethereum.on('chainChanged', (chainId)=>window.location.reload());
    } else {
      console.log("Please install MetaMask");
    }
  
    let metaReq = new XMLHttpRequest();
    metaReq.onreadystatechange = (resp)=>{
      if (resp.currentTarget.readyState === 4){
        let data = JSON.parse(resp.currentTarget.responseText);
        setMetaData(data);
      }
    }
    metaReq.open("GET", `/ipfs/${metaUri.split("ipfs://")[1]}`);
    metaReq.setRequestHeader("Content-Type", "application/json");
    metaReq.send();
  }, []);
  function rocketShipOnClick(){
    setMintModalVisible(true);
  }
  function connectOnClick(e){
    setConnectModalVisible(true);
  }
  function aboutOnClick(){
    setAboutModalVisible(true);
  }
  function modalBackdropOnClick(e){
    console.log('parent')
    setConnectModalVisible(false);
    setAboutModalVisible(false);
    setMintModalVisible(false);
  }
  function shortenAddress(address, length=8, ellipsis="..."){
    if (address == undefined){
      return ""
    }
    let addr = "0x";
    let half_length = length / 2;
    if (parseInt(half_length) !== half_length){
      // odd
      for (let i = 0; i < parseInt(half_length); i += 1){
        addr += address[i + 2] 
      }
      addr += ellipsis
      for (let i = 0; i < Math.round(half_length); i += 1){
        addr += address[address.length - i + 1]
      }
      return addr
    } else {
      // even
      for (let i = 0; i < half_length; i += 1){
        addr += address[i + 2]  // skip 0x
      }
      addr += ellipsis
      for (let i = 0; i < half_length; i += 1){
        addr += address[address.length - i - 1]
      }
      return addr
    }
  }

  function userAddressOnClick(){
    setUserAddressExpanded(!userAddressExpanded)
  }
  function connectMetmaskCallback(accounts){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (resp) {
      if (xhr.readyState === 4){
        let data = resp.currentTarget.response;
        data = JSON.parse(data)
        if (("0x" + data.ethAddress == accounts[0]) && (data.sigRequest !== undefined)){
          window.web3.eth.sign(JSON.stringify(data), accounts[0]).then((resp)=>{
            let req = new XMLHttpRequest();
            req.onreadystatechange = (resp)=>{
              console.log(resp)
              // document.cookie = ""
            };
            req.onerror = (e)=>console.error(e);
            req.open("POST", "/jwt");
            req.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify({
              ethAddress: accounts[0],
              signedData: resp,
            }));

          })
        }
      }
    }
    xhr.onerror = function (err){
      console.error(err)
    }
    xhr.open("POST", "/connect");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
      ethAddress: accounts[0]
    }));
    setUserAccount(accounts[0]);
    setConnectModalVisible(false);
  }

  let userAddressClassName = "user-address";
  if (userAddressExpanded){
    userAddressClassName += " expanded"
  }
  return (
    <div>
      <div className="header">
        <div className="button-group">
          <button className="header-button nautical-btn purple purple-bg p-1" 
            onClick={(e)=>{aboutOnClick(e)}}
            id="aboutButton">
            About
          </button>
        </div>
        <h1 id="nauticalMindsHeader">
          Nautical Minds
        </h1>
        {
          userAccount ?
          <div className="button-group">
            <div className={userAddressClassName} onClick={userAddressOnClick}>
              {
                userAddressExpanded ? 
                shortenAddress(userAccount, 20, "......") 
                : 
                shortenAddress(userAccount)
              }
              {
                userAddressExpanded ? 
                <div className="wallet-detail-container">
                  <img className="wallet-detail-img" src="/static/images/NauticalMindsEP.jpg"/>
                  <div className="wallet-text-container">
                    <div className="font-zcool text-xs wallet-text-row">
                      <span className="text-right w-4/6 px-1">NMEP owned:</span>
                      <span className="text-left w-2/6 px-1">{userData.nftsOwned ? userData.nftsOwned : 0}</span>
                    </div>
                    <div className="font-zcool text-xs wallet-text-row">
                      <span className="text-right w-4/6 px-1">Access granted:</span>
                      <span className="text-left w-2/6 px-1">{userData.accessGranted ? userData.accessGranted : "false"}</span>
                    </div>
                  </div>
                </div>
                :
                null
              }
            </div>
            <div className="loginIconContainer" title="Mint a copy">
              <div className="user-icon-container">
                <img onClick={rocketShipOnClick} src="/static/images/nauticalstarship-alt.svg"/>
              </div>
            </div>
          </div>
            :
          <div className="button-group">
            <button onClick={(e)=>{connectOnClick(e)}} className="header-button nautical-btn green green-bg p-1" id="connectButton">
              Connect
            </button>
          </div>
        }
      </div>
      {props.children}
      <MintModal
        _metaData={metaData}
        userAccount={userAccount}
        visible={mintModalVisible}
        onClick={modalBackdropOnClick}/>
      <ConnectModal 
        connectMetamaskCallback={connectMetmaskCallback}
        visible={connectModalVisible} 
        onClick={modalBackdropOnClick}/>
      <AboutModal 
        visible={aboutModalVisible}
        onClick={modalBackdropOnClick}/>
      <AudioBar 
        _disabledStatus="Mint NMEP to listen"
        trackList={debugMeta.trackList}/>
        {/* trackList={metaData.trackList ? metaData.trackList : []}/> */}
    </div>
  )
}
export default NauticalMinds;