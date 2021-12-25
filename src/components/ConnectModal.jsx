import React from 'react';

function ConnectModal (props){

  let containerClass = "modal-container";
  if (props.visible){
    containerClass += " opaque"
  }
  let hasMetamask = false;
  if (typeof window.web3 !== "undefined"){
    if (window.web3.currentProvider.isMetaMask === true){
      hasMetamask = true;
    } else {
      console.log("Only metamask is currently supported")
    }
  }

  function metamaskOnClick(){
    if (hasMetamask){
      window.ethereum.request({method: "eth_requestAccounts"})
        .then((accounts)=>{
          props.connectMetamaskCallback(accounts)
        })
        .catch((error)=>console.error(error))
    } else {
      window.open("https://metamask.io/download", "_blank")
    }
  }
  return (
    <div className={containerClass}>
      <div className="modal-backdrop" onClick={props.onClick}/>
      <div className="modal-content dark-bg m-auto border-black border-solid border-2 max-w-md">
        <h3 className="form-header">Connect</h3>
        <p className="font-mono text-white m-auto w-full p-5">
          By connecting a wallet, you agree to Nautical Records <a className="contact-link-blue" href="#">Terms of Use</a> and <a className="contact-link-green" href="#">Privacy Policy</a>
        </p>
        <button className="wallet-btn mb-5 mx-10" onClick={metamaskOnClick}>
          <img className="wallet-logo" src="/static/images/metamask/metamask.svg"/> 
          {
            hasMetamask ? 
            <div className="wallet-btn-text-container">
              <span>Connect with MetaMask</span>
            </div> :
            <div className="wallet-btn-text-container">
              <span>Install MetaMask</span>
            </div>
          }
          
        </button>
      </div>
    </div>
  )
}
export default ConnectModal;