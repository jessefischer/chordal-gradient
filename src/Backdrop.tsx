import { useEffect, useState } from "react";
import { KEYS, MIDDLE_C } from "./constants";

import styles from "./Backdrop.module.css";

const noteToHue = (note: number) =>
  Math.floor(((note - MIDDLE_C) * 360) / KEYS.length);

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

interface IBackdropProps {
  activeNotes: Array<number>;
  shouldFadeIn: boolean;
}

export const Backdrop = ({ activeNotes, shouldFadeIn }: IBackdropProps) => {
  const [background, setBackground] = useState<string>();
  const [opacity, setOpacity] = useState(0);

  const [angleInDeg, setAngleInDeg] = useState<number>(() =>
    Math.floor(Math.random() * 360)
  );
  const [xPos, setXPos] = useState<number>(() => Math.random() * 100);
  const [yPos, setYPos] = useState<number>(() => Math.random() * 100);

  useEffect(() => {
    if (activeNotes.length) {
      const hues = activeNotes.map(noteToHue);
      setOpacity(1);
      if (hues.length > 1) {
        setBackground(huesToLinearGradient(hues, angleInDeg, xPos, yPos));
      } else {
        setBackground(hueToColorString(hues[0]));
      }
    } else {
      setOpacity(0);
    }
  }, [activeNotes, angleInDeg, xPos, yPos]);

  useEffect(() => {
    if (activeNotes.length === 0) {
      setAngleInDeg(Math.floor(Math.random() * 360));
      setXPos(Math.random() * 100);
      setYPos(Math.random() * 100);
    }
  }, [activeNotes]);

  return (
    <div
      className={styles.backdrop + shouldFadeIn ? " " + styles.transition : ""}
      style={{
        background,
        opacity,
      }}
    />
  );
};
