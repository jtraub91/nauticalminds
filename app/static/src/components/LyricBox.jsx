import React from 'react';

export default class LyricBox extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div style={this.props.style}>

            </div>
        )
    }
}

LyricBox.defaultProps = {
    audioContext: null,
    lyrics: [
        // [ time , phrase]
        ["I built it all up, now this my breakthrough", "I'm sure that some of you, already planned an escape route",
        "I hope that a better place it can take you, if you close your eyes, maybe this feeling is something that you can relate to",
        "while you're energized and while your trying to admire when inspiring ya to conspire, what?, to harness the power of fire",
        "or play it hard up in flames, from taking the reigns of the game its inescapable pain",
            "writing this way is that untraceable fate, I won't beg but pardon all 0f these statements I make",
        "Life is too short, by the time you know that, everything important to you is now a throwback",
        "If it's important to ya', don't let it go, while you've got that feeling, don't let it go, if it's got that meaning, don't let it go," +
        "I gotta let you know, I ain't gonna let you know",
            "I gotta let you know, I ain't gonna let you know",
        "If something's important ya hold it close, hypocrites say life's about balance but then they go out and they overdose",
        "() will let the moment the pass, don't get a pass, so when you see the chance open ya hands dog",
        "and you better grasp it tighter than you ever have you might not get to get it back so let's relax and get a sack and a hit of that",
        "so while I'm feeling it let me get mean a bit, just to show you how I be MC if you agree with it, uh",
        "I spit real shit, you notice without additives, and you could never spit more nouns than I spit adjectives",
        "and you fly in his eye so why am I so adamant and at of it, and at the same time still proud of it",
        "Would you kill to be real? Steal for a deal put on a fake face just for a pill.",
        "Do you, just grace hate or say grace cuz it pays the bills, Only time will tell if our wounds were healed. Yo are you for real?",
        "If it's important to ya, don't let it go, while you got that feeling, don't let it go, if its got that meaning, don't let it go",
        "I gotta let you know, I gotta let you know, I ain't gonna let you go",
        "I gotta let you know",
        "Before I knew which direction to take this, I'm sure some of you were already ready to change and hate",
            "because you're anxious for that 808 bas kick and there ain't and so there's anguish and I thought that this would be painless",
        "But I got that feeling ain't gonna let it go",
            "Feel like I'm treading snow I lifting this heavy load but Ima get a throw eventually cuz I still get to grow",
        "right now anything less than success in unacceptable",
        "If it's important to ya, don't let it go, while you've got that feeling don't let it go",
        "If it's got that meaning, don't let it go", "I got"]
    ],
};
