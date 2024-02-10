var props = {
  parent: document.getElementsByTagName("body")[0],
  width: window.innerWidth,
  height: window.innerHeight,
  canvasStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1000,
  },
};

let canvas = document.createElement("canvas");
Object.assign(canvas.style, props.canvasStyle);

canvas.width = props.width;
canvas.height = props.height;

let ctx = canvas.getContext("2d");
let imgData = new ImageData(canvas.width, canvas.height);
let array = imgData.data;

props.parent.appendChild(canvas);

let backupCanvas = document.createElement("canvas");
backupCanvas.width = "2400";
backupCanvas.height = "2400";
Object.assign(backupCanvas.style, {
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: -2000,
});
backupCtx = backupCanvas.getContext("2d");
props.parent.appendChild(backupCanvas);

function draw(thresh = 0.98) {
  for (let i = 0; i < array.length; i += 4) {
    let rand = Math.random();

    if (rand > thresh) {
      let intensity = Math.floor(Math.random() * 255);
      // let r = Math.floor(Math.random() * 255);
      // let g = Math.floor(Math.random() * 255);
      // let b = Math.floor(Math.random() * 255);
      array[i] = intensity;
      array[i + 1] = intensity;
      array[i + 2] = intensity;
      array[i + 3] = 255;
    } else {
      array[i] = 0;
      array[i + 1] = 0;
      array[i + 2] = 0;
      array[i + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  // let pattern = backupCtx.createPattern(canvas, "repeat");
  // backupCtx.rect(0, 0, backupCanvas.width, backupCanvas.height);
  // backupCtx.fillStyle = pattern;
  // backupCtx.fill();
}
draw(0.99);
