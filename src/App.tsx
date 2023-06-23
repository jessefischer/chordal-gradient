import { useState } from "react";
// import { NoteMessageEvent, WebMidi } from "webmidi";

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

export default function App() {
  const [keysPressed, setKeysPressed] = useState<Array<number>>([]);
  const [keyCharsPressed, setKeyCharsPressed] = useState<Array<string>>([]);

  // const [initialized, setInitialized] = useState(false);

  const [isMuted, setMuted] = useState(false);

  // const onNoteOn = (e: NoteMessageEvent) => {
  //   const key = e.note.number - 60;
  //   setKeysPressed((keysPressed) => {
  //     if (keysPressed.includes(key)) {
  //       return keysPressed;
  //     }
  //     const newKeysPressed = keysPressed.slice();
  //     newKeysPressed.push(key);
  //     return newKeysPressed;
  //   });
  // };

  // const onNoteOff = (e: NoteMessageEvent) => {
  //   const key = e.note.number - 60;
  //   setKeysPressed((keysPressed) => {
  //     const newKeysPressed = keysPressed.slice();
  //     const index = newKeysPressed.indexOf(key);
  //     if (index > -1) {
  //       newKeysPressed.splice(index, 1);
  //     }
  //     return newKeysPressed;
  //   });
  // };

  // useEffect(() => {
  //   WebMidi.enable()
  //     .then(() => {
  //       setInitialized(true);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  // useEffect(() => {
  //   if (!initialized) {
  //     return;
  //   }
  //   WebMidi.inputs.forEach((input) => {
  //     input.addListener("noteon", onNoteOn);
  //     input.addListener("noteoff", onNoteOff);
  //   });
  // }, [initialized]);

  window.onkeydown = (e) => {
    const keyChar = e.key;

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
      <Backdrop keysPressed={keysPressed} />
      <SynthConnector {...{ keysPressed }} isMuted={isMuted} />
      <Overlay {...{ keyCharsPressed }} />
      <Controls isMuted={isMuted} toggleMuted={() => setMuted(!isMuted)} />
    </div>
  );
}
