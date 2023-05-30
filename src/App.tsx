import { useEffect, useRef, useState } from "react";
import { WebMidi } from "webmidi";
import { Keyboard } from "./Keyboard";
import * as Tone from "tone";
import "./index.css";

const keys = [
  "a",
  "w",
  "s",
  "e",
  "d",
  "f",
  "t",
  "g",
  "y",
  "h",
  "u",
  "j",
  "k",
  "o",
  "l",
  "p",
  ";",
  "'"
];

const keyIndexToHue = (index: number) => Math.floor((index * 360) / 12);

const hueToColorString = (hue: number) => `hsl(${hue} 60% 50%)`;

const huesToLinearGradient = (
  hues: Array<number>,
  angleInDeg: number,
  xPos: number,
  yPos: number
) =>
  `conic-gradient( from ${angleInDeg}deg at ${xPos}% ${yPos}%, ${hues
    .map(hueToColorString)
    .join(",")})`;

export default function App() {
  const [keysPressed, setKeysPressed] = useState<Array<number>>([]);
  const [keyCharsPressed, setKeyCharsPressed] = useState<Array<string>>([]);
  const [background, setBackground] = useState<string>();
  const [opacity, setOpacity] = useState(0);
  const [angleInDeg, setAngleInDeg] = useState<number>(
    Math.floor(Math.random() * 360)
  );
  const [xPos, setXPos] = useState<number>(Math.random() * 100);
  const [yPos, setYPos] = useState<number>(Math.random() * 100);
  const [initialized, setInitialized] = useState(false);

  const synthRef = useRef<Tone.PolySynth<Tone.Synth<Tone.SynthOptions>>>();

  const onNoteOn = (e) => {
    const key = e.note.number - 60;
    setKeysPressed((keysPressed) => {
      if (keysPressed.includes(key)) {
        return keysPressed;
      }
      const newKeysPressed = keysPressed.slice();
      newKeysPressed.push(key);
      return newKeysPressed;
    });
  };

  const onNoteOff = (e) => {
    const key = e.note.number - 60;
    setKeysPressed((keysPressed) => {
      const newKeysPressed = keysPressed.slice();
      const index = newKeysPressed.indexOf(key);
      if (index > -1) {
        newKeysPressed.splice(index, 1);
      }
      return newKeysPressed;
    });
  };

  useEffect(() => {
    WebMidi.enable()
      .then(() => {
        setInitialized(true);
      })
      .catch((err) => alert(err));
  }, []);

  useEffect(() => {
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      // oscillator: {
      //   type: "sawtooth"
      // }
    }).toDestination();
  }, []);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    WebMidi.inputs.forEach((input, i) => {
      input.addListener("noteon", onNoteOn);
      input.addListener("noteoff", onNoteOff);
    });
  }, [initialized]);

  useEffect(() => {
    if (keysPressed.length) {
      const hues = keysPressed.map(keyIndexToHue);
      setOpacity(1);
      if (hues.length > 1) {
        setBackground(huesToLinearGradient(hues, angleInDeg, xPos, yPos));
      } else {
        setBackground(hueToColorString(hues[0]));
      }
    } else {
      setOpacity(0);
      setAngleInDeg(Math.floor(Math.random() * 360));
      setXPos(Math.random() * 100);
      setYPos(Math.random() * 100);
    }
  }, [keysPressed]);

  window.onkeydown = (e) => {
    const keyChar = e.key;

    const index = keys.indexOf(keyChar);
    if (keysPressed.includes(index) || index < 0) {
      return;
    }
    synthRef.current?.triggerAttack(
      Tone.Frequency(60 + index, "midi").toFrequency()
    );
    setKeyCharsPressed((keyCharsPressed) => {
      const newKeyCharsPressed = keyCharsPressed.slice();
      if (!newKeyCharsPressed.includes(keyChar)) {
        newKeyCharsPressed.push(keyChar);
      }
      return newKeyCharsPressed;
    });
    const newKeysPressed = keysPressed.slice();
    newKeysPressed.push(index);
    setKeysPressed(newKeysPressed);
  };

  window.onkeyup = (e) => {
    const keyChar = e.key;
    setKeyCharsPressed((keyCharsPressed) => {
      const newKeyCharsPressed = keyCharsPressed.slice();
      if (newKeyCharsPressed.includes(keyChar)) {
        const keyCharIndex = newKeyCharsPressed.indexOf(keyChar);
        if (keyCharIndex > -1) {
          newKeyCharsPressed.splice(keyCharIndex, 1);
        }
      }
      return newKeyCharsPressed;
    });
    const index = keys.indexOf(keyChar);
    if (index < 0) {
      return;
    }
    synthRef.current?.triggerRelease(
      Tone.Frequency(60 + index, "midi").toFrequency()
    );
    const newKeysPressed = keysPressed.slice();
    const keyIndex = newKeysPressed.indexOf(index);
    if (keyIndex > -1) {
      newKeysPressed.splice(keyIndex, 1);
    }
    setKeysPressed(newKeysPressed);
  };

  return (
    <div
      className="App"
      style={{
        background, opacity
      }}
    >
      <Keyboard {...{ keyCharsPressed }} />
      {/* <div
        className="pulsatingDot"
        style={{ display: keysPressed.length ? "none" : "block" }}
      /> */}
    </div>
  );
}