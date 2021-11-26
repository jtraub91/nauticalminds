import React from 'react';
import ReactDOM from 'react-dom';

import NauticalStarship from './nauticalStarship';
import NauticalMinds from './NauticalMinds.jsx';
import About from './routes/About.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<NauticalMinds/>}>
        <Route path="/about" element={<About/>}/>
      </Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById("reactApp")
);
