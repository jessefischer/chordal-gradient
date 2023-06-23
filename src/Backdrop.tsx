import { useEffect, useState } from "react";

const keyIndexToHue = (index: number) => Math.floor((index * 360) / 12);

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

export const Backdrop = ({ keysPressed }: { keysPressed: Array<number> }) => {
  const [background, setBackground] = useState<string>();
  const [opacity, setOpacity] = useState(0);
  const [angleInDeg, setAngleInDeg] = useState<number>(
    Math.floor(Math.random() * 360)
  );
  const [xPos, setXPos] = useState<number>(Math.random() * 100);
  const [yPos, setYPos] = useState<number>(Math.random() * 100);

  useEffect(() => {
    if (keysPressed.length) {
      const hues = keysPressed.map(keyIndexToHue);
      setOpacity(1);
      if (hues.length > 1) {
        setBackground(huesToLinearGradient(hues, angleInDeg, xPos, yPos));
      } else {
        setBackground(hueToColorString(hues[0]));
      }
    } else {
      setOpacity(0);
      setAngleInDeg(Math.floor(Math.random() * 360));
      setXPos(Math.random() * 100);
      setYPos(Math.random() * 100);
    }
  }, [keysPressed, angleInDeg, xPos, yPos]);

  return (
    <div
      className="backdrop"
      style={{
        background,
        opacity,
      }}
    />
  );
};
