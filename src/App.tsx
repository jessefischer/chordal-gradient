import { useEffect, useState } from "react";
import { NoteMessageEvent, WebMidi } from "webmidi";

import { Controls } from "./Controls";
import { Overlay } from "./Overlay";
import { Backdrop } from "./Backdrop";
import { SynthConnector } from "./SynthConnector";

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
  "'",
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

  const [isMuted, setMuted] = useState(false);

  const onNoteOn = (e: NoteMessageEvent) => {
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

  const onNoteOff = (e: NoteMessageEvent) => {
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
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    WebMidi.inputs.forEach((input) => {
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
  }, [keysPressed, angleInDeg, xPos, yPos]);

  window.onkeydown = (e) => {
    const keyChar = e.key;

    console.log("keydown)");
    const index = keys.indexOf(keyChar);
    if (keysPressed.includes(index) || index < 0) {
      return;
    }
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
    console.log({ newKeysPressed });
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

    const newKeysPressed = keysPressed.slice();
    const keyIndex = newKeysPressed.indexOf(index);
    if (keyIndex > -1) {
      newKeysPressed.splice(keyIndex, 1);
    }
    setKeysPressed(newKeysPressed);
  };

  return (
    <div className="app">
      <Backdrop {...{ background, opacity }} />
      <SynthConnector {...{ keysPressed }} isMuted={isMuted} />
      <Overlay {...{ keyCharsPressed }} />
      <Controls isMuted={isMuted} toggleMuted={() => setMuted(!isMuted)} />
    </div>
  );
}
