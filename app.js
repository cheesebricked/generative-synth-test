/*
TODO (in order ish):
    - how to add ADSR
    - how to change wave type
    - how to add effects
    - how to make visualization

*/


const startButton = document.getElementById("start");
const muteButton = document.getElementById("mute");
const volSlider = document.getElementById("vol-slider");
const volLabel = document.getElementById("vol-label")

let muted = false



// SOUND SETUP

// setup synth
var synthSettings = {
    "oscillator": {
        "type": "triangle"
    },
    "filter": {
        "Q": 1,
        "type": "highpass",
        "rolloff": -24,
        "frequency": 50
    },
    "filter": {
        "Q": 1,
        "type": "lowpass",
        "rolloff": -12,
    },
    "envelope": {
        "attack": 0.005,
        "decay": 1,
        "sustain": 0.3,
        "release": 3
    },
    "filterEnvelope": {
        "attack": 0.01,
        "decay": 10,
        "sustain": 0.5,
        "release": 1,
        "baseFrequency": 360,
        "octaves": 2
    }
};

const vol = new Tone.Volume(-15).toDestination()
const synth = new Tone.PolySynth(Tone.MonoSynth, synthSettings).connect(vol);
const reverb = new Tone.Reverb();

reverb.generate().then(
    function(value) {
        synth.connect(reverb)
        reverb.connect(vol)
    },
    function(error) {console.log(error)}
)

synth.volume.value = 0
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

function logslider(position) {
    // position will be between 0 and 100
    var minp = 0;
    var maxp = 100;
  
    // The result should be between 100 an 10000000
    var minv = Math.log(100);
    var maxv = Math.log(10000000);
  
    // calculate adjustment factor
    var scale = (maxv-minv) / (maxp-minp);
  
    return (Math.exp(minv + scale*(position-minp)) / 100000) - 100;
  }



// SOUND GENERATION

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
        length,
        Tone.now(),
        Math.random());
    length = 10
    index = getRandomInt(notelist.length - 1)
}

let bool = true

function loop(bool) {
    let interval = setInterval(function() {
            // main loop
            if (Math.random() * 100 < 30) {
                playNote() 
            }
            //console.log(synth.activeVoices)
    }, getRandomInt(1500) + 10);
}


function mute(toMute) {
    if (toMute) {
        muted = true
        vol.mute = true
        muteButton.innerHTML = "unmute" 
    } else {
        muted = false
        vol.mute = false
        muteButton.innerHTML = "mute"
    }
}

// INTERACTIVITY

startButton.addEventListener("click", () => {
    mute(false)
    loop()
    playNote()
})
muteButton.addEventListener("click", () => {
    mute(!muted)
})
volSlider.oninput = function() {
    vol.volume.value = logslider(this.value);
    volLabel.innerHTML = `Volume: ${logslider(this.value).toFixed(2)}`
    //console.log(logslider(this.value))
}
volLabel.innerHTML = `Volume: ${logslider(volSlider.value).toFixed(2)}`