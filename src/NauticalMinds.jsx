import Web3 from 'web3';
import NauticalMindsEp from "../contracts_build/NauticalMindsEp.json";

import React, { useState } from 'react';

import AudioBar from './components/AudioBar.jsx';
import SRC_LIST from './srcList.json';

const contractAbi = NauticalMindsEp.abi;
const contractAddress = "0x73C9499205a1fdc69539252dbE2Da96c01C8228D";

function NauticalMinds(props){
  
  let [userAccounts, setUserAccounts] = useState([]);

  if (window.ethereum) {
    console.log("Metamask installed");

    window.web3 = new Web3(window.ethereum);
    const contract = new window.web3.eth.Contract(contractAbi, contractAddress);

    window.ethereum.on('accountsChanged', (accounts)=>setUserAccounts(accounts));
    window.ethereum.on('chainChanged', (chainId)=>window.location.reload());
  } else {
    console.log("Please install MetaMask");
  }
  function rocketShipOnClick(){
    console.log("mint")
  }
  function connectOnClick(e){
    if (window.ethereum){
      window.ethereum.request({method: "eth_requestAccounts"})
        .then((accounts)=>{
          setUserAccounts(accounts)
        })
        .catch((error)=>console.error(error))
    } else {
      console.log("please install Metamask")
    }
  }
  function shortenAddress(address){
    if (address == undefined){
      return ""
    }
    return address[0] + address[1] + address[2] + address[3] + address[4] +
      address[5] + "..." + address[address.length - 4] + 
      address[address.length - 3] + address[address.length - 2] +
      address[address.length - 1]
  }
  function userOnClick(){
    console.log("other")
  }
  return (
    <div>
      <div className="header">
        <div className="button-group">
          <button className="header-button nautical-btn purple" id="aboutButton">
            <a href="#">About</a>
          </button>
          {/* <div className="loginIconContainer">
            <div className="user-icon-container">
              <img onClick={rocketShipOnClick} src="/static/images/nauticalstarship-alt.svg"/>
            </div>
          </div> */}
        </div>
        <h1 id="nauticalMindsHeader">
          <a href="#">Nautical Minds</a>
        </h1>
        {
          userAccounts.length > 0 ? 
            <button className="user-address" onClick={userOnClick}>
              {shortenAddress(userAccounts[0])}
            </button> :
            <button onClick={(e)=>{connectOnClick(e)}} className="header-button nautical-btn green" id="connectButton">
              Connect
            </button>
        }
      </div>
      {props.children}
      <AudioBar src={document.cookie.jwt ? SRC_LIST : []} id="audioBar"/>
    </div>
  )
}
export default NauticalMinds;