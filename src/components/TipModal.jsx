import React, { useState, useEffect } from "react";
import { shortenAddress } from "../components/Header.jsx";
import { createCanvas, drawStars } from "./NauticalStarship";

const TIMESTAMP = Date.now();
const xsMediaMatch = window.matchMedia("screen and (min-width: 430px)");

function TipModal(props) {
  const [currency, setCurrency] = useState("ETH");
  const [ethWalletAddress, setEthWalletAddress] = useState(
    props.ethWalletAddress
  );
  const [btcWalletAddress, setBtcWalletAddress] = useState(
    props.btcWalletAddress
  );

  const [ethButtonActive, setEthButtonActive] = useState(false);
  const [btcButtonActive, setBtcButtonActive] = useState(false);

  const [btcCopyIconClass, setBtcCopyIconClass] =
    useState("far fa-copy purple");
  const [ethCopyIconClass, setEthCopyIconClass] =
    useState("far fa-copy purple");

  let containerClass = "modal-container";
  if (props.visible) {
    containerClass += " opaque";
  }

  function btcOnClick() {
    if (btcButtonActive) {
      return;
    }
    // copy text
    let textEl = document.getElementById("tip_btc");
    navigator.clipboard.writeText(textEl.innerText);

    setBtcButtonActive(true);
    setBtcWalletAddress("copied to clipboard");
    setBtcCopyIconClass("fas fa-check-circle lime-green");
    setTimeout(() => {
      if (xsMediaMatch.matches) {
        setBtcWalletAddress(props.btcWalletAddress);
      } else {
        setBtcWalletAddress(shortenAddress(props.btcWalletAddress));
      }
      setBtcButtonActive(false);
      setBtcCopyIconClass("far fa-copy purple");
    }, 3000);
  }
  function ethOnClick() {
    if (ethButtonActive) {
      return;
    }
    setEthButtonActive(true);
    setEthWalletAddress("copied to clipboard");
    setEthCopyIconClass("fas fa-check-circle lime-green");
    setTimeout(() => {
      if (xsMediaMatch.matches) {
        setEthWalletAddress(props.ethWalletAddress);
      } else {
        setEthWalletAddress(shortenAddress(props.ethWalletAddress));
      }
      setEthButtonActive(false);
      setEthCopyIconClass("far fa-copy purple");
    }, 3000);
  }
  useEffect(() => {
    if (xsMediaMatch.matches) {
      setEthWalletAddress(props.ethWalletAddress);
      setBtcWalletAddress(props.btcWalletAddress);
    } else {
      setEthWalletAddress(shortenAddress(props.ethWalletAddress));
      setBtcWalletAddress(shortenAddress(props.btcWalletAddress));
    }

    xsMediaMatch.addEventListener("change", () => {
      if (xsMediaMatch.matches) {
        setEthWalletAddress(props.ethWalletAddress);
        setBtcWalletAddress(props.btcWalletAddress);
      } else {
        setEthWalletAddress(shortenAddress(props.ethWalletAddress));
        setBtcWalletAddress(shortenAddress(props.btcWalletAddress));
      }
    });

    let parent = document.getElementById(`__tip_modal_content_${TIMESTAMP}`);
    let canvas = createCanvas(parent);
    drawStars(canvas);
  }, []);

  return (
    <div className={containerClass}>
      <div className="modal-backdrop" onClick={props.onClick} />
      <div
        id={`__tip_modal_content_${TIMESTAMP}`}
        className="modal-content dark-bg m-4 sm:m-auto sm:max-w-md"
      >
        <button
          className="far fa-window-close modal-close"
          onClick={props.onClick}
        />
        <h3 className="form-header text-xl">Tip</h3>
        <div className="font-mono text-white">
          <div className="flex flex-col my-2 mx-0.5">
            <div className="w-50 m-auto">
              <label className="mx-2" for="currency">
                Currency
              </label>
              <select name="currency" className="text-black mx-2">
                <option value="btc">BTC</option>
                <option value="eth">ETH</option>
                <option value="ltc">LTC</option>
                <option value="xmr">XMR</option>
                <option value="etc">ETC</option>
              </select>
            </div>
            <div className="tip-address-container">
              <a
                href="https://bitcoin.org"
                target="_blank"
                className="tip-address-container-symbol"
              >
                BTC
              </a>
              <button
                onClick={btcOnClick}
                id="tip_btc"
                className="tip-address-container-address w-auto"
                title={props.btcWalletAddress}
              >
                {btcWalletAddress}
              </button>
              <button
                onClick={btcOnClick}
                className="tip-address-container-copy"
              >
                <i className={btcCopyIconClass} />
              </button>
            </div>
            <div className="tip-address-container">
              <a
                href="https://ethereum.org"
                target="_blank"
                className="tip-address-container-symbol"
              >
                ETH
              </a>
              <button
                onClick={ethOnClick}
                id="tip_eth"
                className="tip-address-container-address w-auto"
                title={props.ethWalletAddress}
              >
                {ethWalletAddress}
              </button>
              <button
                onClick={ethOnClick}
                className="tip-address-container-copy"
              >
                <i className={ethCopyIconClass} />
              </button>
            </div>
            {/* <div className="flex flex-row">
              <input
                className="m-1 text-black text-center"
                placeholder="Amount"
                name="amount"
                type="text"
              />
              <button className="m-1 p-1 text-white bg-lime-600 flex">
                <span className="m-auto">ETH</span>
                <i className="fab fa-ethereum m-auto" />
              </button>
            </div>
            <div className="flex flex-row justify-between">
              <button className="border-grey m-1 p-1" type="reset">
                Reset
              </button>
              <button className="border-blue m-1 p-1" type="submit">
                Submit
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
export default TipModal;
