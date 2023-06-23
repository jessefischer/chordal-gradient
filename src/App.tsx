import { useEffect, useState } from "react";

import { Controls } from "./Controls";
import { KeyboardGroup } from "./KeyboardGroup";
import { SynthConnector } from "./SynthConnector";

import "./index.css";

import { KEYS, MIDDLE_C } from "./constants";
import { Backdrop } from "./Backdrop";
import { MIDIConnector } from "./MIDIConnector";

export default function App() {
  const [activeNotes, setActiveNotes] = useState<Array<number>>([]);
  const [isMuted, setMuted] = useState(false);

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
      <Backdrop activeNotes={activeNotes} />
      <SynthConnector activeNotes={activeNotes} isMuted={isMuted} />
      <MIDIConnector setActiveNotes={setActiveNotes} />
      <KeyboardGroup activeNotes={activeNotes} />
      <Controls isMuted={isMuted} toggleMuted={() => setMuted(!isMuted)} />
    </div>
  );
}
