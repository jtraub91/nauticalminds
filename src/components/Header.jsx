import React, { useState, useEffect } from "react";

export default function Header(props) {

  return (
    <div className="header">
      <div className="flex flex-col ml-0 m-auto">
        <button
          className="font-mono text-underline deep-purple text-white px-0.5 mx-2"
          onClick={props.aboutOnClick}
        >
          About
        </button>
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-lobster">
        Nautical Minds
      </h1>
      
      <div className="flex flex-col mr-0 m-auto">
        <button
          onClick={props.buyOnClick}
          className="font-mono text-underline green p-0.5 mx-2">
          Buy NMEP
        </button>
      </div>
    </div>
  );
}
