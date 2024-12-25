import React, { useEffect, useState } from "react";
import { createCanvas, drawStars } from "./NauticalStarship";

const TIMESTAMP = Date.now();

function AboutModal(props) {
  const [maximized, setMaximized] = useState(true);

  useEffect(() => {
    document.onkeydown = (e) => {
      if (e.key === "Escape") {
        props.onClick();
      }
    }
    let parent = document.getElementById(`__about_modal_content_${TIMESTAMP}`);
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

  return (
    <div className={props.visible ? "modal-container opaque": "modal-container"}>
      <div className="modal-backdrop" onClick={props.onClick} />
      <div id={`__about_modal_content_${TIMESTAMP}`}
        className={maximized ?  "overflow-x-hidden z-20 flex flex-col dark-bg ease-in transition-all duration-300 border-2 border-cyan-300 relative w-full h-full m-auto" : "overflow-x-hidden z-20 flex flex-col dark-bg ease-in transition-all duration-500 border-2 border-cyan-300 relative w-[480px] h-[480px] m-auto"}>
        <div className="flex justify-end absolute w-full p-1">
          <button onClick={toggleMaximize}
            className={maximized ? "text-xl m-2 text-yellow-200 hover:text-lime-500 transition-colors ease-in-out fa-solid fa-compress" : "text-xl m-2 text-yellow-200 hover:text-lime-500 transition-colors ease-in-out fa-solid fa-expand"}/>
          <button
            className="far fa-window-close text-xl m-2 text-yellow-200 hover:text-lime-500 transition-colors ease-in-out "
            onClick={props.onClick}
          />
        </div>
        <div class="m-auto">
          <div className="flex flex-col max-w-md m-auto p-4 transition-all ease-in duration-500">
            <h3 className="text-2xl font-serif">About</h3>
            <div className="flex flex-col font-mono text-center text-white py-5 pr-5 pl-10 w-full text-mono">
              <span className="">Nautical Minds</span>
              <span className="">is the musical collaboration of</span>
              <div className="flex w-full justify-center">
                <a className="m-1 text-underline contact-link-blue" target="_blank" href="https://www.instagram.com/jasonmarcushiphop/">Jason Marcus</a> 
                <span className="m-1">and</span> 
                <a className="m-1 text-underline contact-link-blue" target="_blank" href="https://www.instagram.com/jason.traub/">Jason Traub</a>
              </div>
              
            </div>
            <div className="font-mono text-center text-white py-5 pr-5 pl-10 w-full">
              Nautical Minds EP was released in 2015
            </div>
            <h4 className="font-serif text-xl">Contact</h4>
            <div className="font-mono text-center text-white py-1 px-5 w-full">
              <a
                className="contact-link-purple"
                href="mailto:nauticalmindsmusic@gmail.com"
              >
                nauticalmindsmusic@gmail.com
              </a>
            </div>
            <h5 className="font-serif text-lg">Links</h5>
            <div className="font-mono text-center text-white py-1 px-5 w-full mb-5">
              <a
                className="contact-link-green"
                href="https://linktr.ee/nauticalminds"
                target="_blank"
              >
                linktr.ee
              </a>
            </div>
            <footer className="font-mono w-full text-center text-white">
              &copy; Nautical Records 2024
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AboutModal;
