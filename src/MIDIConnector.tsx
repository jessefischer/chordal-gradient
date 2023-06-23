import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { NoteMessageEvent, WebMidi } from "webmidi";

interface IMIDIConnectorProps {
  setActiveNotes: Dispatch<SetStateAction<Array<number>>>;
}

export const MIDIConnector = ({ setActiveNotes }: IMIDIConnectorProps) => {
  const [initialized, setInitialized] = useState(false);

  const onNoteOn = (e: NoteMessageEvent) => {
    const note = e.note.number;
    setActiveNotes((activeNotes: Array<number>) => {
      if (activeNotes.includes(note)) {
        return activeNotes;
      }
      const updatedActiveNotes = activeNotes.slice();
      updatedActiveNotes.push(note);
      return updatedActiveNotes;
    });
  };

  const onNoteOff = (e: NoteMessageEvent) => {
    const note = e.note.number;
    setActiveNotes((activeNotes) => {
      const updatedActiveNotes = activeNotes.slice();
      if (activeNotes.includes(note)) {
        updatedActiveNotes.splice(activeNotes.indexOf(note), 1);
      }
      return updatedActiveNotes;
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

  return null;
};
