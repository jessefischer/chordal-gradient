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
  const [lastActiveNotes, setLastActiveNotes] = useState<Array<number>>([]);
  const [prevActiveNotes, setPrevActiveNotes] = useState<Array<number>>([]);

  const [isMuted, setMuted] = useState(false);
  const [isCapturingScreenShot, setIsCapturingScreenShot] = useState(false);
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard");
  };

  const handleCaptureScreenShot = () => {
    setIsCapturingScreenShot(true);
    setTimeout(() => setIsCapturingScreenShot(false), 3000);
  };

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

  /* Update lastActiveNotes */
  useEffect(() => {
    if (
      activeNotes.length > lastActiveNotes.length ||
      (activeNotes.length && prevActiveNotes.length === 0)
    ) {
      setLastActiveNotes(activeNotes.slice());
    }
  }, [activeNotes, lastActiveNotes.length, prevActiveNotes.length]);

  /* Store previous activeNotes state */
  useEffect(() => {
    return () => setPrevActiveNotes(activeNotes.slice());
  }, [activeNotes]);

  useEffect(() => {
    const searchParams = new URLSearchParams();
    if (lastActiveNotes.length) {
      searchParams.set("notes", JSON.stringify(lastActiveNotes));
    }
    history.pushState({}, "", "?" + searchParams.toString());
  }, [lastActiveNotes, isMuted]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const activeNotesString = searchParams.get("notes");
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
          <Controls
            isCapturingScreenShot={isCapturingScreenShot}
            handleCaptureScreenShot={handleCaptureScreenShot}
            handleCopyLink={handleCopyLink}
            toggleMuted={() => setMuted(!isMuted)}
            isMuted={isMuted}
          />
        </>
      )}
    </div>
  );
}
