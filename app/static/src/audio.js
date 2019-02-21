import WaveSurfer from '../node_modules/wavesurfer.js';

export default class MusicPlayer {
    constructor() {
        this.playlist = {
            1: ["Gotta Let You Know", "gotta_let_you_know"],
            2: ["Ain't Gotta Care", "aint_gotta_care"],
            3: ["Funk1", "funk1"],
            4: ["Spacy Stacy", "spacy_stacy"],
            5: ["Sidestreet Robbery", "sidestreet_robbery"],
            6: ["Off The Clock", "off_the_clock"]
        };
        this.surfer = null;
        this.state = {
            "track_no": 1,
            "next_track_no": 2,
            "prev_track_no": 6,
            "auto_play": true
        };
        this.init();
    }

    init() {
        let div = document.createElement("div");
        div.id = "wave";

        let element = document.getElementById("gotta_let_you_know");
        element.appendChild(div);

        this.surfer = WaveSurfer.create({
            container: "#" + div.id,
            progressColor: 'cyan',
        });
        this.surfer.load('/static/music/nautical_minds_ep/mp3/' + this.playlist[this.state.track_no][1] + '.mp3');
        this.surfer.on('ready', () => {
            this.surfer.play();
        });
        this.surfer.on('finish', () => {
            if (this.state.auto_play === true) {
                this.next();
            } else {
                console.log("not true");
            }
        });
    }

    next () {
        /* remove old child */
        let div = document.getElementById("wave");
        let parent = document.getElementById(this.playlist[this.state.track_no][1]);
        parent.removeChild(div);

        /* append new child */
        let child = document.createElement("div");
        child.id = "wave";
        parent = document.getElementById(this.playlist[this.state.next_track_no][1]);
        parent.appendChild(child);

        /* plays next song and updates state */
        this.surfer = WaveSurfer.create({
            container: "#" + child.id,
            waveColor: 'white',
            progressColor: 'cyan',
        });
        this.surfer.load('/static/music/nautical_minds_ep/mp3/' + this.playlist[this.state.next_track_no][1] + '.mp3');
        this.surfer.on('ready', () => {
            this.surfer.play();
        });
        this.surfer.on('finish', () => {
            if (this.state.auto_play === true) {
                this.next();
            } else {
                console.log("not true");
            }
        });

        let track_no = this.state.next_track_no;

        let next_track_no = track_no + 1;
        if (next_track_no > Object.keys(this.playlist).length) {
            next_track_no = 1;
        }
        let prev_track_no = track_no - 1;
        if (prev_track_no < 1) {
            prev_track_no = 6;
        }

        this.state = {
            "track_no": track_no,
            "next_track_no": next_track_no,
            "prev_track_no": prev_track_no,
            "auto_play": true
        };
    }
}
