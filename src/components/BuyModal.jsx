import React, { useEffect, useState } from "react";
import { createCanvas, drawStars } from "./NauticalStarship";

const TIMESTAMP = Date.now();

function BuyModal(props) {
  const [maximized, setMaximized] = useState(true);

  useEffect(() => {
    document.onkeydown = (e) => {
      if (e.key === "Escape") {
        props.onClick();
      }
    }
    let parent = document.getElementById(`__buy_modal_content_${TIMESTAMP}`);
    canvas.width = 1920;
    canvas.height = 1080;
    drawStars(canvas);
    let canvasURL = canvas.toDataURL();
    parent.style.backgroundImage = `url(${canvasURL})`;
    parent.style.backgroundSize = "cover";
    console.log(canvasURL)
    setMaximized(false);
  }, []);

  function toggleMaximize(){
    setMaximized(!maximized);
  }
  function handleBuyClick(){
    if (window.unisat){
      console.log(window.unisat)
    } else {
      console.log("No unisat")
    }
  }

  return (
    <div className={props.visible ? "modal-container opaque": "modal-container"}>
      <div className="modal-backdrop" onClick={props.onClick} />
      <div id={`__buy_modal_content_${TIMESTAMP}`}
        className={maximized ?  "overflow-x-hidden z-20 flex flex-col dark-bg ease-in transition-all duration-300 border-2 border-cyan-300 relative w-full h-full m-auto" : "overflow-x-hidden z-20 flex flex-col dark-bg ease-in transition-all duration-500 border-2 border-cyan-300 relative w-[480px] h-[480px] m-auto"}>
        <div className="flex justify-end absolute w-full p-1">
          <button onClick={toggleMaximize}
            className={maximized ? "text-xl m-2 text-yellow-200 hover:text-lime-500 transition-colors ease-in-out fa-solid fa-compress" : "text-xl m-2 text-yellow-200 hover:text-lime-500 transition-colors ease-in-out fa-solid fa-expand"}/>
          <button
            className="far fa-window-close text-xl m-2 text-yellow-200 hover:text-lime-500 transition-colors ease-in-out "
            onClick={props.onClick}
          />
        </div>
        <div className="flex flex-col max-w-md m-auto p-4 transition-all ease-in duration-500">
          <h3 className="text-2xl font-serif">Buy Nautical Minds EP</h3>
          <div className="flex flex-col">
            <img className="h-36 w-36 m-auto" src="/images/NauticalMindsEP.jpg"></img>
            <button onClick={handleBuyClick}
              className="m-auto font-mono text-white bg-transparent border-2 border-teal-500 hover:bg-teal-500">Buy Now</button>
          </div>
          <footer className="font-mono w-full text-center text-white">
            &copy; Nautical Records 2024
          </footer>
        </div>
      </div>
    </div>
  );
}
export default BuyModal;
