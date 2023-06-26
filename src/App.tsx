import { useCallback, useEffect, useState } from "react";

import { Controls } from "./Controls";
import { KeyboardGroup } from "./KeyboardGroup";
import { SynthConnector } from "./SynthConnector";

import styles from "./App.module.css";

import { KEYS, MIDDLE_C } from "./constants";
import { Backdrop } from "./Backdrop";
import { MIDIConnector } from "./MIDIConnector";

export default function App() {
  const [activeNotes, setActiveNotes] = useState<Array<number>>([]);
  const [isMuted, setMuted] = useState(false);
  const [showUI, setShowUI] = useState(true);

  const handleKeyDown = useCallback(
    (note: number) => {
      if (activeNotes.includes(note)) return;

      const updatedActiveNotes = activeNotes.slice();
      updatedActiveNotes.push(note);
      setActiveNotes(updatedActiveNotes);
    },
    [activeNotes]
  );

  const handleKeyUp = useCallback(
    (note: number) => {
      if (!activeNotes.includes(note)) return;

      const updatedActiveNotes = activeNotes.slice();
      updatedActiveNotes.splice(activeNotes.indexOf(note), 1);

      setActiveNotes(updatedActiveNotes);
    },
    [activeNotes]
  );

  useEffect(() => {
    window.onkeydown = (e) => {
      if (!KEYS.includes(e.key)) return;
      const note = KEYS.indexOf(e.key) + MIDDLE_C;
      handleKeyDown(note);
    };

    window.onkeyup = (e) => {
      if (!KEYS.includes(e.key)) return;
      const note = KEYS.indexOf(e.key) + MIDDLE_C;
      handleKeyUp(note);
    };
  }, [activeNotes, handleKeyDown, handleKeyUp]);

  // useEffect(() => {
  //   const searchParams = new URLSearchParams();
  //   if (activeNotes.length) {
  //     searchParams.set("activeNotes", JSON.stringify(activeNotes));
  //   }
  //   searchParams.set("isMuted", JSON.stringify(isMuted));
  //   history.pushState({}, "", "?" + searchParams.toString());
  // }, [activeNotes, isMuted]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const activeNotesString = searchParams.get("activeNotes");
    const showUIString = searchParams.get("showUI");
    if (showUIString) {
      setShowUI(JSON.parse(showUIString));
    }
    if (activeNotesString) {
      setActiveNotes(JSON.parse(activeNotesString));
      setMuted(true);
    }
  }, []);

  return (
    <div className={styles.app}>
      <Backdrop activeNotes={activeNotes} />
      <SynthConnector activeNotes={activeNotes} isMuted={isMuted} />
      <MIDIConnector setActiveNotes={setActiveNotes} />
      {showUI && (
        <>
          <KeyboardGroup
            activeNotes={activeNotes}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
          />
          <Controls isMuted={isMuted} toggleMuted={() => setMuted(!isMuted)} />
        </>
      )}
    </div>
  );
}
