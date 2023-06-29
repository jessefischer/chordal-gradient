import { useCallback, useEffect, useState } from "react";
import Snackbar from '@mui/material/Snackbar';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isCapturingScreenShot, setIsCapturingScreenShot] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("")

  const [angleInDeg, setAngleInDeg] = useState<number>(() =>
    Math.floor(Math.random() * 360)
  );
  const [xPos, setXPos] = useState<number>(() => Math.random() * 100);
  const [yPos, setYPos] = useState<number>(() => Math.random() * 100);

  useEffect(() => {
    if (prevActiveNotes.length === 0) {
      setAngleInDeg(Math.floor(Math.random() * 360));
      setXPos(Math.random() * 100);
      setYPos(Math.random() * 100);
    }
  }, [prevActiveNotes]);

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
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setSnackbarOpen(true);
        setSnackbarMessage("Link copied to clipboard.");
      })
      .catch(() => {
        setSnackbarOpen(true);
        setSnackbarMessage("Failed to copy to clipboard.");
      });
  };

  /* Capture screen shot */
  const handleCaptureScreenShot = () => {
    setIsCapturingScreenShot(true);
    setSnackbarOpen(true);
    setSnackbarMessage("Preparing image download...");
    window.location.href =
      window.location.origin + "/api/capture?notes=" +
      encodeURIComponent(JSON.stringify(lastActiveNotes));
    setPrevActiveNotes([]);
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

  useEffect(() => {
    const searchParams = new URLSearchParams();
    if (lastActiveNotes.length) {
      searchParams.set("notes", JSON.stringify(lastActiveNotes));
    }
    history.pushState({}, "", "?" + searchParams.toString());
  }, [lastActiveNotes, isMuted]);

  return (
    <div className={styles.app}>
      <Backdrop activeNotes={lastActiveNotes} shouldFadeIn={showUI} angleInDeg={angleInDeg} xPos={xPos} yPos={yPos} />
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
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setSnackbarOpen(false)}
      />

    </div>
  );
}
