import React from 'react';

function AboutModal (props){

  let containerClass = "modal-container";
  if (props.visible){
    containerClass += " opaque"
  }

  return (
    <div className={containerClass}>
      <div className="modal-backdrop" onClick={props.onClick}/>
      <div className="modal-content dark-bg m-auto border-black border-solid border-2 max-w-md" onClick={(e)=>console.log('child')}>
        <h3 className="form-header">About</h3>
        <p className="font-mono text-right text-white py-5 pr-5 pl-10 w-full text-mono">
          Nautical Minds is the musical collaboration of Jason Marcus and Jason Traub
        </p>
        <p className="font-mono text-right text-white py-5 pr-5 pl-10 w-full">
          Nautical Minds EP was released in 2015
        </p>
        <h4 className="form-header">Contact</h4>
        <p className="font-mono text-right text-white py-1 px-5 w-full">
          <a className="contact-link-blue" href="mailto:nauticalmindsmusic@gmail.com">nauticalmindsmusic@gmail.com</a>
        </p>
        <h5 className="form-header">Links</h5>
        <p className="font-mono text-right text-white py-1 px-5 w-full mb-5">
          <a className="contact-link-green" href="https://linktr.ee/nauticalminds" target="_blank">linktr.ee</a>
        </p>
        <footer className='font-mono text-center'>
          &copy; Nautical Records 2022
        </footer>
      </div>
    </div>
  )
}
export default AboutModal;