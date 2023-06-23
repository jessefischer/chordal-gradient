import { MIDDLE_C, KEYS } from "./constants";

const blackKeys = "we tyu op";
const whiteKeys = "asdfghjkl;";

interface IKeyboardProps {
  activeNotes: Array<number>;
}

export const Keyboard = ({ activeNotes }: IKeyboardProps) => {
  const activeKeys = activeNotes.map((note) => KEYS[note - MIDDLE_C]);
  return (
    <div className="keyboard">
      <div className="white-keys">
        {Array.from(whiteKeys).map((key, i) => (
          <div
            key={key + i}
            className={activeKeys.includes(key) ? "pressed" : undefined}
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
          >
            {key}
          </div>
        ))}
      </div>
    </div>
  );
};
