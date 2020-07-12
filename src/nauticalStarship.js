//var nj = require('numjs');

export default class NauticalStarship {
  constructor (props) {
    this.canvas = document.createElement("canvas");
    Object.assign(this.canvas.style, props.canvasStyle);

    this.audioCtx = new AudioContext();
    
    this.canvas.width = props.width;
    this.canvas.height = props.height;

    this.ctx = this.canvas.getContext("2d");
    this.imgData = new ImageData(this.canvas.width, this.canvas.height);
    this.array = this.imgData.data;
    
    this.state = {};

    props.parent.appendChild(this.canvas);
    
    this.backupCanvas = document.createElement("canvas");
    this.backupCanvas.width = "2400";
    this.backupCanvas.height = "2400";
    Object.assign(
      this.backupCanvas.style, 
      {
        position: "absolute", 
        top: 0, 
        left: 0,
        zIndex: -2000,
      }
    );
    this.backupCtx = this.backupCanvas.getContext('2d');
    props.parent.appendChild(this.backupCanvas);

    this.start = this.start.bind(this);
    this.draw = this.draw.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.blur = this.blur.bind(this);
    this.brighten = this.brighten.bind(this);
    this.playAudio = this.playAudio.bind(this);
  }

  start (){
    // this.timer = setInterval(this.putFrame, 1000 / 40);
    setInterval(this.putFrame, 1000 / 40);
  }

  draw(thresh=0.98) {
    for (let i = 0; i < this.array.length; i += 4){
      let rand = Math.random();
      
      if (rand > thresh) {
        let intensity = Math.floor(Math.random() * 255);
        // let r = Math.floor(Math.random() * 255);
        // let g = Math.floor(Math.random() * 255);
        // let b = Math.floor(Math.random() * 255);
        this.array[i] = intensity;
        this.array[i+1] = intensity;
        this.array[i+2] = intensity;
        this.array[i+3] = 255;
      } else{
        this.array[i] = 0;
        this.array[i+1] = 0;
        this.array[i+2] = 0;
        this.array[i+3] = 255;
      }
    };
    this.ctx.putImageData(this.imgData, 0, 0);
    let pattern = this.backupCtx.createPattern(this.canvas, "repeat");
    this.backupCtx.rect(0, 0, this.backupCanvas.width, this.backupCanvas.height);
    this.backupCtx.fillStyle = pattern;
    this.backupCtx.fill();
  }
  applyFilter(kernel) {
    let imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    let values = Array.from(imgData.data);
    console.log(values);
    
    // constants
    const DATA_DIMENSION = 4; // RGBA
    let KERNEL_DIMENSION = kernel.length;
    let kernelNd = nj.array(kernel);
    console.log(kernelNd);
    // build expanded copy of data to have values out of bounds
    // only need to expand by KERNEL_DIMENSION - 1
    // expanding method: mirror
    let valuesNd = nj.array(values).reshape(
      this.canvas.width, this.canvas.height, DATA_DIMENSION
    );
    // simplify problem for now. work in grey scale. turns 3d conv into 2d conv
    valuesNd = valuesNd.slice(null, null, [0,1]).reshape(this.canvas.width, this.canvas.height)
    console.log("valuesNd:")
    console.log(valuesNd);
    // // get North slice mirrored
    // let nSlice = nj.array(
    //   valuesNd.slice([0, KERNEL_DIMENSION]) // first KERNEL_DIMENSION rows
    //     .tolist().reverse()  // reverse (mirror) on x axis
    // );
    /* actually just copy array; inefficient but easier for now */
    let concatValuesNd = nj.array(nj.concatenate(valuesNd.T, valuesNd.T, valuesNd.T).T.tolist());
    concatValuesNd = nj.array(nj.concatenate(concatValuesNd, concatValuesNd, concatValuesNd).tolist());
    // console.debug(concatValuesNd);

    // // do convolution 
    let conv = nj.convolve(concatValuesNd, kernelNd.tolist());
    console.log(conv);

    // take relevant output (remove concatted area)   xlen - 1 + Math.floor(KERNEL_DIMENSION / 2)
    let output = nj.array(
      conv.slice(
        [valuesNd.shape[0] - Math.floor(KERNEL_DIMENSION / 2), 2 * valuesNd.shape[0] - Math.floor(KERNEL_DIMENSION / 2)], 
        [valuesNd.shape[1] - Math.floor(KERNEL_DIMENSION / 2), 2 * valuesNd.shape[1] - Math.floor(KERNEL_DIMENSION / 2)]
      ).tolist()
    );
    console.log("output:")
    console.log(output);
    let oTest = output.reshape(output.shape[0] * output.shape[1]).tolist();
    let vTest = valuesNd.reshape(valuesNd.shape[0] * valuesNd.shape[1]).tolist();

    function arraysEqual(a, b){
      if (a === b) return true;
      if (a == null || b == null) {
        console.log("null");
        return false;
      }
      if (a.length != b.length) {
        console.log("arrays not the same len");
        return false;
      }
      for (let i = 0; i < a.length; i += 1){
        if (a[i] !== b[i]) {
          console.log(i);
          return false;
        }
      }
      return true;
    }
    // console.log(arraysEqual(oTest, vTest));
    // this.array mutable from this.imgData.data
    for (let i = 0; i < oTest.length; i += 1){
      this.array[DATA_DIMENSION * i] = Math.floor(oTest[i]);
      this.array[DATA_DIMENSION * i + 1] = Math.floor(oTest[i]);
      this.array[DATA_DIMENSION * i + 2] = Math.floor(oTest[i]);
      this.array[DATA_DIMENSION * i + 3] = 255;
    }
    console.log(this.array);
    // TODO: remove, no longer necessary
    // format array
    // let columns = [];
    // for (let row = 0; row < this.canvas.height; row += 1){
    //   let row = [];
    //   for(let col = 0; col < DATA_DIMENSION * imgData.width; col += DATA_DIMENSION) {
    //     let datum = [];
    //     for (let elem = 0; elem < DATA_DIMENSION; elem += 1){
    //       datum.push(data[col + elem]);
    //     }
    //     row.push(datum);
    //   }
    //   columns.push(row);
    // }
    // data = nj.uint8(columns);
    // data = data.convolve(kernel);
    // data = new Uint8ClampedArray(data.tolist());

    this.ctx.putImageData(this.imgData, 0, 0);
  }
  blur() {
    if (this.canvas.style.webkitFilter) {
      this.canvas.style.webkitFilter = undefined;
    } else {
      this.canvas.style.webkitFilter = "blur(1px)";
    }
  }
  brighten () {
    let imgData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    let data = imgData.data;
    let tmp;
    
    for (let i = 0; i < data.length; i += 4){
      tmp = Math.floor(data[i] * 1.1);
      data[i] = tmp;
      data[i + 1] = tmp;
      data[i + 2] = tmp;
      data[i + 3] = 255;
    }
    this.ctx.putImageData(imgData, 0, 0);
  }
  playAudio(){
    var buf = this.audioCtx.createBuffer(2, 2048, 44100);

    for (let i = 0; i < buf.numberOfChannels; i += 1){
      let ch = buf.getChannelData(i);
      for (let j = 0; j < ch.length; j += 1) {
        ch[j] = Math.random() * 2 - 1;
      }
    }
    var source = this.audioCtx.createBufferSource();
    source.buffer = buf;
    source.connect(this.audioCtx.destination);
    source.start();

    this.audioTimer = setInterval()
  }

}