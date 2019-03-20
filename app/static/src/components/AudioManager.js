export default class AudioManager{
    constructor(){
        this.audioElement = document.createElement("audio");

        this.init = this.init.bind(this);
        this.setSrc = this.setSrc.bind(this);
        this.close = this.close.bind(this);
    }

    init(){
        this.audioContext = new AudioContext();
        this.gainNode = this.audioContext.createGain();
        this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);
        this.analyserNode = this.audioContext.createAnalyser();

        this.sourceNode.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
        this.sourceNode.connect(this.analyserNode);
    }

    setSrc(src){
        this.audioElement.src = src;
    }

    close(){
        this.audioContext.close();
    }
}
