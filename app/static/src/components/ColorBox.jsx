import React from 'react';

export default class ColorBox extends React.Component {
    constructor(props) {
        super(props);
        this.drawRandom = this.drawRandom.bind(this);
        this.drawColorSpectra = this.drawColorSpectra.bind(this);
        this.drawBoxPattern = this.drawBoxPattern.bind(this);
        this.drawFftRainbow = this.drawFftRainbow.bind(this);
    }
    drawRandom() {
        // form imgData buffer
        for (let i = 0; i < this.pixelArray.length; i = i + 4) {
            this.pixelArray[i] = Math.random() * 255;
            this.pixelArray[i + 1] = Math.random() * 255;
            this.pixelArray[i + 2] = Math.random() * 255;
            this.pixelArray[i + 3] = Math.random() * 255;

        }
        //
        let imgData = new ImageData(this.pixelArray, this.canvas.width, this.canvas.height);
        this.canvasContext.putImageData(imgData, 0, 0);
    }

    drawColorSpectra(){
        this.analyserNode.getByteFrequencyData(this.fftArray);
        let freqResolution = this.analyserNode.context.sampleRate / (2 * this.analyserNode.frequencyBinCount);

        let frequency;
        let freqIndex;
        let value;
        let valueNormalized;

        let colors = Object.keys(this.colorMap);
        for (let i=0; i < colors.length; i++){
            frequency = this.colorMap[colors[i]]["frequency"];
            freqIndex = Math.round(frequency / freqResolution);
            value = this.fftArray[freqIndex];
            valueNormalized = Math.round(this.canvas.height * value / 255);
            this.colorMap[colors[i]]["canvasContext"].lineTo(this.canvasIndex, this.canvas.height - valueNormalized);  // coordinate system starts with 0,0 at top left
            this.colorMap[colors[i]]["canvasContext"].stroke();
        }
        this.canvasIndex = this.canvasIndex + 1;
    }
    drawBoxPattern() {
        console.log(1);
        this.fftArray = new Uint8Array(this.props.analyserNode.frequencyBinCount);
        this.canvasContext.clearRect(0,0, this.canvas.width, this.canvas.height);

        let array = new Uint8Array(this.props.analyserNode.frequencyBinCount);
        this.props.analyserNode.getByteFrequencyData(array);
        let freqResolution = this.props.analyserNode.context.sampleRate / (2 * this.props.analyserNode.frequencyBinCount);


        let width = this.canvas.width;
        let height = this.canvas.height;
        // assume square
        let boxSize = Math.sqrt(width * height / this.props.analyserNode.frequencyBinCount);

        let x = 0;
        let y = 0;
        for (let i = 0; i < array.length; i++) {
            let frequency = i * freqResolution;
            let rgbArray = this.noteToRgb(this.frequencyToNote(frequency))[1];
            let freqMagnitude = array[i] / 255;
            this.canvasContext.fillStyle = "rgba(" + rgbArray[0] + "," + rgbArray[1] + "," + rgbArray[2] + "," + freqMagnitude + ")";
            this.canvasContext.fillRect(x, y, x + boxSize, y + boxSize);
            x = x + boxSize;
            if (x >= this.canvas.width) {
                x = 0;
                y = y + boxSize;
            }
        }
    }

    drawFftRainbow(){
        this.canvasContext.clearRect(0,0, this.canvas.width, this.canvas.height);

        let array = new Uint8Array(this.props.analyserNode.frequencyBinCount);
        this.props.analyserNode.getByteFrequencyData(array);
        let freqResolution = this.props.analyserNode.context.sampleRate / (2 * this.props.analyserNode.frequencyBinCount);


        let width = this.canvas.width;
        let height = this.canvas.height;

        let barWidth = Math.floor(width / 12);

        let colorComponent = {
            "A": [],
            "A#": [],
            "B": [],
            "C": [],
            "C#": [],
            "D": [],
            "D#": [],
            "E": [],
            "F": [],
            "F#": [],
            "G": [],
            "G#": []
        };

        let note; let frequency;
        for (let i = 1; i < array.length; i++){
            frequency = i * freqResolution;
            note = this.frequencyToNote(frequency);
            colorComponent[note].push(array[i]);
        }

        let notes = Object.keys(colorComponent);
        let x=0; let y=0;
        for (let i = 0; i < notes.length; i++){
            let arr = colorComponent[notes[i]];
            let sum = 0;
            for (let j = 0; arr.length; j++){
                sum = sum + arr[j];
            }
            let avg = Math.floor(sum / arr.length);
            let rgb = this.noteToRgb(notes[i]);
            this.canvasContext.fillStyle = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + (avg / 255) + ")";
            this.canvasContext.fillRect(x, y, x+barWidth,  avg*this.canvas.height);
            x = x + barWidth;
        }
    }

    frequencyToNote(frequency) {
        // code adapted from python code I found
        let notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        let a4 = 440;
        let c0 = a4 * Math.pow(2, -4.75);
        let h; let octave; let n; let note;

        if (frequency === 0) {
            return [0, 0, 0]  // rgb black
        } else {
            h = Math.round(12 * Math.log2(frequency / c0));
            octave = Math.floor(h / 12);
            n = h % 12;
            note = notes[n];
        }
        return [note, octave]
    }

    noteToRgb(note){
        if (note === "C"){ // yellow
            return [255, 255, 0]
        } else if (note === "C#"){ // greenyellow
            return [173, 255, 47]
        } else if (note === "D"){ // green
            return [34, 139, 34]
        } else if (note === "D#"){ // turquoise
            return [64, 224, 208]
        } else if (note === "E"){ // blue
            return [0, 0, 255]
        } else if (note === "F"){ // indigo
            return [75, 0, 130]
        } else if (note === "F#"){ // darkmagenta
            return [139, 0, 139]
        } else if (note === "G"){ // violet
            return [148, 0, 211]
        } else if (note === "G#"){ // red-violet
            return [199, 21, 133]
        } else if (note === "A"){ // red
            return [255, 0, 0]
        } else if (note === "A#"){ // red-orange
            return [255, 83, 73]
        } else if (note === "B"){ // orange
            return [255, 165, 0]
        } else {
            return [255, 255, 255]  // white
        }
    }

    componentDidMount() {
        this.canvas = document.querySelector("canvas");
        this.canvasContext = this.canvas.getContext('2d');

    }
    render() {
        if (this.props.isPlaying){
            this.timerId = setInterval(this.drawBoxPattern, 1000/40);
        } else {
            clearInterval(this.timerId);
        }
        return (
            <canvas/>
        )
    }
}
