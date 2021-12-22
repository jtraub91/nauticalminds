import Web3 from 'web3';
import NauticalMindsEp from "../contracts_build/NauticalMindsEp.json";

import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import AudioBar from './components/AudioBar.jsx';

import SRC_LIST from './srcList.json';

export default class NauticalMinds extends React.Component {
  constructor(props){
    super(props);

    this.contractAbi = NauticalMindsEp.abi;
    this.contractAddress = "0x73C9499205a1fdc69539252dbE2Da96c01C8228D";

    if (window.ethereum) {
      console.log("Metamask installed");

      window.web3 = new Web3(window.ethereum);
      this.contract = new window.web3.eth.Contract(this.contractAbi, this.contractAddress);
    } else {
      console.log("Please install MetaMask");
    }
    // functions
    this.rocketShipOnClick = this.rocketShipOnClick.bind(this);
    this.connectOnClick = this.connectOnClick.bind(this);
    this.shortenAddress = this.shortenAddress.bind(this);
    this.userOnClick = this.userOnClick.bind(this);

    this.state = {
      userAccounts: [],
      srcList: SRC_LIST,
      dropdownOpen: false,
    }
  }
  componentDidMount(){
    if (window.ethereum.isConnected()){
      window.ethereum.request({method: "eth_requestAccounts"})
        .then((accounts)=>{
          this.setState(()=>{
            return {
              userAccounts: accounts,
            }
          })

          // sign in request
        })
        .catch((data)=>{
          console.log(data)
        })

      window.ethereum.on('accountsChanged', (accounts) => {
        this.setState(()=>{
          return {
            userAccounts: accounts
          }
        })
      });
      window.ethereum.on('chainChanged', (chainId) => {
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.
        window.location.reload();
      });
    }
  }
  rocketShipOnClick(){
    this.setState(()=>{
      return {
        dropdownOpen: !this.state.dropdownOpen
      }
    })
  }
  connectOnClick(e){
    window.ethereum.request({method: "eth_requestAccounts"})
      .then((accounts)=>{
        this.setState(()=>{
          return {
            userAccounts: accounts,
          }
        })
      })
      .catch((data)=>{
        console.log(data)
      })
  }
  shortenAddress(address){
    if (address == undefined){
      return ""
    }
    return address[0] + address[1] + address[2] + address[3] + address[4] +
      address[5] + "..." + address[address.length - 4] + 
      address[address.length - 3] + address[address.length - 2] +
      address[address.length - 1]
  }
  userOnClick(){
    let message = "Sign me in to nauticalminds.com"
    window.ethereum.request(
      {method: "personal_sign", params: [message, this.state.userAccounts[0]]}
    ).then((sig)=>{
      console.log(sig)
    }).catch((e)=>console.log(e))
  }
  render(){
    let iconContainerClassName = "user-icon-container";
    if (this.state.dropdownOpen){
      iconContainerClassName += " inverted"
    }
    return (
      <div>
        <div style={{display: this.state.dropdownOpen ? "block" : "none"}} className="user-dropdown">
          <div className="flex-col">
            <button className="user-container-item no-border" onClick={this.onLogout}>About</button>
          </div>
        </div>
        <div className="header">
          <div className="button-group">
            {/* <button className="header-button nautical-btn purple" id="aboutButton">
              <Link to="/about">About</Link>
            </button> */}
            <div className="loginIconContainer">
              <div className={iconContainerClassName}>
                <img onClick={this.rocketShipOnClick} src="/static/images/nauticalstarship-alt.svg"/>
              </div>
            </div>
          </div>
          <h1 id="nauticalMindsHeader">
            <Link to="/">Nautical Minds</Link>
          </h1>
          {
            this.state.userAccounts ? 
              <button className="user-address" onClick={this.userOnClick}>
                {this.shortenAddress(this.state.userAccounts[0])}
              </button> :
              <button onClick={(e)=>{this.connectOnClick(e)}} className="header-button nautical-btn green" id="connectButton">
                Connect
              </button>
          }
        </div>
        {this.props.children}
        <AudioBar src={this.state.srcList} id="audioBar"/>
      </div>
    )
  }
}
