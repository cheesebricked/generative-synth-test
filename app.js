/*
TODO (in order ish):
    - how to add ADSR
    - how to change wave type
    - how to add effects
    - how to make visualization

*/


const startButton = document.getElementById("start")

// setup synth
var synthSettings = {
    "oscillator": {
        "type": "triangle"
    },
    "filter": {
        "Q": 1,
        "type": "lowpass",
        "rolloff": -12
    },
    "envelope": {
        "attack": 0.01,
        "decay": 1,
        "sustain": 0.3,
        "release": 10
    },
    "filterEnvelope": {
        "attack": 0.01,
        "decay": 0.32,
        "sustain": 0.9,
        "release": 1,
        "baseFrequency": 50,
        "octaves": 4
    }
};
const synth = new Tone.PolySynth(Tone.MonoSynth, synthSettings).toDestination();

synth.volume.value = -7
synth.maxPolyphony = 15
synth.set({ detune: -600 });

//setup notes
notelist = ["E3", "B3", "C3", "E4", "G4", "B4", "C5", "D5", "E5", "G5", "B5", "C6", "D6"]

// get ranim int from 0-max (inclusive)
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// chance to do something, if not do other thing
function chanceToDo(percent, one, two) {
    if (Math.random() * 100 <= percent) {
        return one
    } else {
        return two
    }
}

// set index of a note from note list
let index = getRandomInt(notelist.length - 1)

function playNote() {
    if (length <= 0) {
        length = 10
    }
    //synth.volume.value = getRandomInt(10) - 10
    synth.triggerAttackRelease(
        // % chance to trigger 2 notes
        chanceToDo(
            42,
            [notelist[index], notelist[getRandomInt(notelist.length - 1)]],
            [notelist[index]]
        ),
        length);
    length = 10
    index = getRandomInt(notelist.length - 1)
}

startButton.addEventListener("click", () => {
    begin()
    playNote()
})

function begin() {
    const interval = setInterval(function() {
    // main loop
    if (Math.random() * 100 < 30) {
        playNote() 
    }
    console.log(synth.activeVoices)
}, getRandomInt(1000) + 500);
}

 
//clearInterval(interval);