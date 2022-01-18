import React, { useState } from "react";

const TOKENS = {
  ETH: {
    minVal: 1e18,
  },
};

function TipModal(props) {
  const [currency, setCurrency] = useState("ETH");
  let containerClass = "modal-container";
  if (props.visible) {
    containerClass += " opaque";
  }

  return (
    <div className={containerClass}>
      <div className="modal-backdrop" onClick={props.onClick} />
      <div className="modal-content dark-bg m-4 sm:m-auto sm:max-w-md">
        <button
          className="far fa-window-close modal-close"
          onClick={props.onClick}
        />
        <h3 className="form-header text-xl">Tip</h3>
        <div className="font-mono text-white">
          <div className="flex flex-col">
            <div className="flex flex-row">To: Nautical Minds</div>
            <div className="flex flex-row">
              <input
                className="m-1 text-black text-center"
                min="0.000000001"
                step="0.000000001"
                placeholder="Amount"
                name="amount"
                type="number"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default TipModal;
