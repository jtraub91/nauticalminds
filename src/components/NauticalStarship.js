export function createCanvas(parent) {
  /**
   * Create canvas in parent element
   */
  let canvas = document.createElement("canvas");
  Object.assign(canvas.style, {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1000,
  });

  canvas.width = parent.clientWidth;
  canvas.height = parent.clientHeight;
  parent.appendChild(canvas);
  return canvas;
}

export function drawStars(canvas) {
  /**
   * Draw stars on said canvas
   */
  let ctx = canvas.getContext("2d");
  let imgData = new ImageData(canvas.offsetWidth, canvas.offsetHeight);
  let arr = imgData.data;

  for (let i = 0; i < arr.length; i += 4) {
    let rand = Math.random();
    if (rand > 0.99) {
      let intensity = Math.floor(Math.random() * 255);
      // let r = Math.floor(Math.random() * 255);
      // let g = Math.floor(Math.random() * 255);
      // let b = Math.floor(Math.random() * 255);
      arr[i] = intensity;
      arr[i + 1] = intensity;
      arr[i + 2] = intensity;
      arr[i + 3] = 255;
    } else {
      arr[i] = 0;
      arr[i + 1] = 0;
      arr[i + 2] = 0;
      arr[i + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}
