import { MIDDLE_C, KEYS } from "./constants";

import styles from "./Keyboard.module.css";

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
    <div className={styles.keyboard}>
      <div className={styles["white-keys"]}>
        {Array.from(whiteKeys).map((key, i) => (
          <div
            key={key + i}
            className={activeKeys.includes(key) ? styles.pressed : undefined}
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
      <div className={styles["black-keys"]}>
        {Array.from(blackKeys).map((key, i) => (
          <div
            key={key + i}
            className={
              key === " "
                ? styles.blank
                : activeKeys.includes(key)
                ? styles.pressed
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
