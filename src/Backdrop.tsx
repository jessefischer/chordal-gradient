import { useEffect, useState } from "react";
import { KEYS, MIDDLE_C } from "./constants";

import classNames from 'classnames/bind'

import styles from "./Backdrop.module.css";

const cx = classNames.bind(styles)

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
  angleInDeg: number;
  xPos: number;
  yPos: number;
}

export const Backdrop = ({ activeNotes, shouldFadeIn, angleInDeg, xPos, yPos }: IBackdropProps) => {
  const [background, setBackground] = useState<string>();
  const [opacity, setOpacity] = useState(0);

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

  return (
    <div
      className={cx('backdrop', { shouldFadeIn: shouldFadeIn })}
      style={{
        background,
        opacity,
      }}
    />
  );
};
