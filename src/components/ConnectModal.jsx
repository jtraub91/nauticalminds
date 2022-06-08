import React, { useEffect } from "react";
import { createCanvas, drawStars } from "./NauticalStarship";

const TIMESTAMP = Date.now();

function ConnectModal(props) {
  useEffect(() => {
    let parent = document.getElementById(
      `__connect_modal_content_${TIMESTAMP}`
    );
    let canvas = createCanvas(parent);
    drawStars(canvas);
  }, []);

  let containerClass = "modal-container";
  if (props.visible) {
    containerClass += " opaque";
  }
  let hasMetamask = false;
  if (typeof window.web3 !== "undefined") {
    if (window.web3.currentProvider.isMetaMask === true) {
      hasMetamask = true;
    } else {
      console.log("Only metamask is currently supported");
    }
  }

  function metamaskOnClick() {
    if (hasMetamask) {
      window.web3.eth
        .getAccounts()
        .then((accounts) => {
          props.connectMetamaskCallback(accounts);
        })
        .catch((error) => console.error(error));
    } else {
      window.open("https://metamask.io/download", "_blank");
    }
  }
  return (
    <div className={containerClass}>
      <div className="modal-backdrop" onClick={props.onClick} />
      <div
        id={`__connect_modal_content_${TIMESTAMP}`}
        className="modal-content dark-bg m-auto border-black border-solid border-2 max-w-md"
      >
        <button
          className="far fa-window-close modal-close"
          onClick={props.onClick}
        />
        <h3 className="form-header text-xl">Connect</h3>
        <p className="font-mono text-white m-auto w-full p-5">
          <span>By connecting a wallet, you agree to the </span>
          <a className="contact-link-blue" href="/tos" target="_blank">
            Terms of Use
          </a>
          <span> and </span>
          <a className="contact-link-green" href="/pp" target="_blank">
            Privacy Policy
          </a>
        </p>
        <button className="wallet-btn mb-5 mx-10" onClick={metamaskOnClick}>
          <img className="wallet-logo" src="/images/metamask/metamask.svg" />
          {hasMetamask ? (
            <div className="wallet-btn-text-container">
              <span>Connect with MetaMask</span>
            </div>
          ) : (
            <div className="wallet-btn-text-container">
              <span>Install MetaMask</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
export default ConnectModal;
