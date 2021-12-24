import React from 'react';
import ReactDOM from 'react-dom';

import NauticalStarship from './nauticalStarship';
import NauticalMinds from './NauticalMinds.jsx';
// import About from './routes/About.jsx';

var nautical = new NauticalStarship({
  parent: document.getElementsByTagName("body")[0],
  width: window.innerWidth,
  height: window.innerHeight,
  canvasStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1000,
  },
});
nautical.draw(0.99);
console.log(document.cookie);
ReactDOM.render(
  <NauticalMinds>
    <div className="center-rocket-container">
      <img src="/static/images/nauticalstarship-alt.svg"/>
    </div>
  </NauticalMinds>,
  document.getElementById("reactApp")
);
