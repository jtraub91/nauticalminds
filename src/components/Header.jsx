import React, { useState, useEffect } from "react";

import { clearCookie } from "../utils";

// copied from AudioBar
const xxxsMediaMatch = window.matchMedia("screen");
const xxsMediaMatch = window.matchMedia("screen and (min-width: 210px)");
const xsMediaMatch = window.matchMedia("screen and (min-width: 430px)");
const smMediaMatch = window.matchMedia("screen and (min-width: 560px)");
const mdMediaMatch = window.matchMedia("screen and (min-width: 775px)");

export function shortenAddress(
  address,
  length = 8,
  ellipsis = "...",
  ethereum = false
) {
  if (address == undefined) {
    return "";
  }
  let addressNormalized = address.split("0x");
  addressNormalized = addressNormalized[addressNormalized.length - 1];

  let addr = ethereum ? "0x" : "";
  let half_length = length / 2;
  if (parseInt(half_length) !== half_length) {
    // odd; UNTESTED
    for (let i = 0; i < parseInt(half_length); i += 1) {
      addr += addressNormalized[i];
    }
    addr += ellipsis;
    for (let i = 0; i < Math.round(half_length); i += 1) {
      addr += addressNormalized[addressNormalized.length - i + 1];
    }
    return addr;
  } else {
    // even
    for (let i = 0; i < half_length; i += 1) {
      addr += addressNormalized[i];
    }
    addr += ellipsis;
    for (let i = 0; i < half_length; i += 1) {
      addr += addressNormalized[addressNormalized.length - half_length + i];
    }
    return addr;
  }
}

export default function Header(props) {
  const [shortenedAddress, setShortenedAddress] = useState("");
  const [userAddressExpanded, setUserAddressExpanded] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    window.addEventListener("click", (e) => {
      setDropdownOpen(false);
    });
  }, []);
  useEffect(() => {
    setShortenedAddress(shortenAddress(props.userAccount));
  }, [props.userAccount]);
  function userAddressOnClick() {
    if (userAddressExpanded) {
      setTimeout(() => {
        setShortenedAddress(shortenAddress(props.userAccount));
      }, 0);
    } else {
      setTimeout(() => {
        setShortenedAddress(shortenAddress(props.userAccount, 20, "......"));
      }, 300);
    }
    setUserAddressExpanded(!userAddressExpanded);
  }
  function rocketShipOnClick(e) {
    e.stopPropagation();
    if (userAddressExpanded) {
      setTimeout(() => {
        setShortenedAddress(shortenAddress(props.userAccount));
      }, 0);
      setUserAddressExpanded(!userAddressExpanded);
    }
    setDropdownOpen(!dropdownOpen);
  }
  return (
    <div className="header">
      <div className="flex flex-col ml-0 m-auto">
        <button
          className="header-button deep-purple text-white px-0.5"
          onClick={props.aboutOnClick}
          id="aboutButton"
        >
          About
        </button>
      </div>
      <h1
        className="nautical-minds-header text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-lobster"
        id="nauticalMindsHeader"
      >
        Nautical Minds
      </h1>
      {props.userAccount ? (
        <div className="flex flex-row mr-0 m-auto">
          <div
            className={
              userAddressExpanded
                ? "user-address hidden md:flex expanded"
                : "user-address hidden md:flex"
            }
            onClick={userAddressOnClick}
          >
            {shortenedAddress}
            {userAddressExpanded ? (
              <div className="wallet-detail-container">
                <img
                  className="wallet-detail-img"
                  src="/static/images/NauticalMindsEP.jpg"
                />
                <div className="wallet-text-container">
                  <div className="font-zcool text-xs wallet-text-row">
                    <span className="text-right w-4/6 px-0.5">NMEP owned:</span>
                    <span className="text-left w-2/6 px-0.5">
                      {props.userData.nmepOwned ? props.userData.nmepOwned : 0}
                    </span>
                  </div>
                  <div className="font-zcool text-xs wallet-text-row">
                    <span className="text-right w-4/6 px-0.5">
                      NMT balance:
                    </span>
                    <span className="text-left w-2/6 px-0.5">
                      {props.userData.nmtBalance
                        ? props.userData.nmtBalance
                        : 0}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <div className="loginIconContainer m-auto" title="Mint a copy">
            <div className="user-icon-container">
              <img
                onClick={rocketShipOnClick}
                src="/static/images/nauticalstarship-alt.svg"
              />
            </div>
          </div>
          <div
            className="user-dropdown-container hidden-fade-in"
            onClick={(e) => e.stopPropagation()}
            style={dropdownOpen ? { opacity: 1, visibility: "visible" } : {}}
          >
            <div className="flex flex-col">
              <a
                onClick={(e) => {
                  clearCookie("token");
                  window.location.reload();
                  setDropdownOpen(false);
                }}
                href="#"
                className="user-dropdown-container-item"
              >
                Disconnect
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col mr-0 m-auto">
          <button
            disabled
            onClick={props.connectOnClick}
            className="header-button connect green px-0.5 cursor-not-allowed"
            id="connectButton"
          >
            Connect
          </button>
        </div>
      )}
    </div>
  );
}
