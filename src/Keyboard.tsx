import { MIDDLE_C, KEYS } from "./constants";

const blackKeys = "we tyu op";
const whiteKeys = "asdfghjkl;";

interface IKeyboardProps {
  activeNotes: Array<number>;
  onKeyDown: (note: number) => void;
  onKeyUp: (note: number) => void;
}

export const Keyboard = ({
  activeNotes,
  onKeyDown,
  onKeyUp,
}: IKeyboardProps) => {
  const activeKeys = activeNotes.map((note) => KEYS[note - MIDDLE_C]);
  return (
    <div className="keyboard">
      <div className="white-keys">
        {Array.from(whiteKeys).map((key, i) => (
          <div
            key={key + i}
            className={activeKeys.includes(key) ? "pressed" : undefined}
            onMouseDown={() => onKeyDown(KEYS.indexOf(key) + MIDDLE_C)}
            onMouseUp={() => onKeyUp(KEYS.indexOf(key) + MIDDLE_C)}
            onMouseLeave={() => onKeyUp(KEYS.indexOf(key) + MIDDLE_C)}
            onTouchStart={() => onKeyDown(KEYS.indexOf(key) + MIDDLE_C)}
            onTouchEnd={() => onKeyUp(KEYS.indexOf(key) + MIDDLE_C)}
          >
            {key}
          </div>
        ))}
      </div>
      <div className="black-keys">
        {Array.from(blackKeys).map((key, i) => (
          <div
            key={key + i}
            className={
              key === " "
                ? "blank"
                : activeKeys.includes(key)
                ? "pressed"
                : undefined
            }
            onMouseDown={() => onKeyDown(KEYS.indexOf(key) + MIDDLE_C)}
            onMouseUp={() => onKeyUp(KEYS.indexOf(key) + MIDDLE_C)}
            onMouseLeave={() => onKeyUp(KEYS.indexOf(key) + MIDDLE_C)}
            onTouchStart={() => onKeyDown(KEYS.indexOf(key) + MIDDLE_C)}
            onTouchEnd={() => onKeyUp(KEYS.indexOf(key) + MIDDLE_C)}
          >
            {key}
          </div>
        ))}
      </div>
    </div>
  );
};
