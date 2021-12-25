import React from 'react';

function MintModal(props){
  let containerClass = "modal-container";
  if (props.visible){
    containerClass += " opaque"
  }
  return (
    <div className={containerClass}>
      <div className="modal-backdrop" onClick={props.onClick}/>
      <div className="modal-content dark-bg m-auto border-black border-solid border-2 max-w-md">
        <h3 className="form-header">Mint Nautical Minds EP</h3>
        {
          props.userAccounts.length > 0 ? 
          <p className="text-white m-auto w-full p-5 text-center font-mono">
            Mint info
          </p> 
          :
          <p className="text-white m-auto w-full p-5">
            <a href="#" className="contact-link-green">Connect</a> your wallet to mint a copy &#x1F609;
          </p>
        }
      </div>
    </div>
  )
}
export default MintModal;