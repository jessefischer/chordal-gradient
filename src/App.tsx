import { useEffect, useState } from "react";
// import { NoteMessageEvent, WebMidi } from "webmidi";

import { Controls } from "./Controls";
import { KeyboardGroup } from "./KeyboardGroup";
import { SynthConnector } from "./SynthConnector";

import "./index.css";

import { KEYS, MIDDLE_C } from "./constants";

export default function App() {
  const [activeNotes, setActiveNotes] = useState<Array<number>>([]);
  const [isMuted, setMuted] = useState(false);

  // const [initialized, setInitialized] = useState(false);

  // const onNoteOn = (e: NoteMessageEvent) => {
  //   const key = e.note.number - 60;
  //   setKeysPressed((KEYSPressed) => {
  //     if (KEYSPressed.includes(key)) {
  //       return KEYSPressed;
  //     }
  //     const newKeysPressed = KEYSPressed.slice();
  //     newKeysPressed.push(key);
  //     return newKeysPressed;
  //   });
  // };

  // const onNoteOff = (e: NoteMessageEvent) => {
  //   const key = e.note.number - 60;
  //   setKeysPressed((KEYSPressed) => {
  //     const newKeysPressed = KEYSPressed.slice();
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

  useEffect(() => {
    window.onkeydown = (e) => {
      if (!KEYS.includes(e.key)) return;

      const note = KEYS.indexOf(e.key) + MIDDLE_C;

      if (activeNotes.includes(note)) return;

      const updatedActiveNotes = activeNotes.slice();
      updatedActiveNotes.push(note);
      setActiveNotes(updatedActiveNotes);
    };

    window.onkeyup = (e) => {
      if (!KEYS.includes(e.key)) return;

      const note = KEYS.indexOf(e.key) + MIDDLE_C;

      if (!activeNotes.includes(note)) return;

      const updatedActiveNotes = activeNotes.slice();
      updatedActiveNotes.splice(activeNotes.indexOf(note), 1);

      setActiveNotes(updatedActiveNotes);
    };
  }, [activeNotes]);

  return (
    <div className="app">
      {/* <Backdrop activeNotes={activeNotes} /> */}
      <SynthConnector activeNotes={activeNotes} isMuted={isMuted} />
      <KeyboardGroup activeNotes={activeNotes} />
      <Controls isMuted={isMuted} toggleMuted={() => setMuted(!isMuted)} />
    </div>
  );
}
