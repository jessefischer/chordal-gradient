import { useEffect, useRef } from "react";
import * as Tone from "tone";

interface ISynthConnectorProps {
  activeNotes: Array<number>;
  isMuted: boolean;
}

export const SynthConnector = ({
  activeNotes,
  isMuted,
}: ISynthConnectorProps) => {
  const synthRef = useRef<Tone.PolySynth<Tone.Synth<Tone.SynthOptions>>>();
  const previousNotes = useRef<Array<number>>([]);

  /* Initialize synth */
  useEffect(() => {
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: "fatsawtooth",
        count: 4,
        spread: 25,
      },
      volume: -12,
      envelope: {
        attack: 0.025,
        decay: 5,
        sustain: 0.333,
        release: 0.8,
      },
    });

    const filter = new Tone.Filter(900, "lowpass");
    const chorus = new Tone.Chorus(3.333, 1, 0.125).start();
    const feedbackDelay = new Tone.FeedbackDelay({
      delayTime: 0.75,
      feedback: 0.25,
      wet: 0.0625,
    });
    const reverb = new Tone.Reverb({ decay: 4, wet: 0.0625 }).toDestination();

    synthRef.current.connect(filter);
    filter.connect(chorus);
    chorus.connect(feedbackDelay);
    feedbackDelay.connect(reverb);
  }, []);

  useEffect(() => {
    /* For each new key added, trigger attack of that note */
    activeNotes
      .filter((note) => !previousNotes.current.includes(note))
      .forEach((note) => {
        synthRef.current?.triggerAttack(
          Tone.Frequency(note, "midi").toFrequency(),
          Tone.now()
        );
      });
    /* For each key removed, trigger release of that note */
    previousNotes.current
      .filter((note) => !activeNotes.includes(note))
      .forEach((note) => {
        synthRef.current?.triggerRelease(
          Tone.Frequency(note, "midi").toFrequency()
        );
      });
    previousNotes.current = activeNotes.slice();
  }, [activeNotes]);

  /* Update volume on change of muted state */
  useEffect(() => {
    if (!synthRef.current) return;
    synthRef.current.volume.value = isMuted ? -Infinity : 0;
  }, [isMuted]);

  return null;
};
