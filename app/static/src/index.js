import './misc';
import './react';
import './modals';
import NauticalStarship from './nauticalStarship';

var nautical = new NauticalStarship({
    parent: document.getRootNode().body,
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