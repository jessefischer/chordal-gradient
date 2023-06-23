import { Keyboard } from "./Keyboard";

import styles from "./KeyboardGroup.module.css";

interface IKeyboardGroupProps {
  activeNotes: Array<number>;
  onKeyDown: (note: number) => void;
  onKeyUp: (note: number) => void;
}

export const KeyboardGroup = ({
  activeNotes,
  onKeyDown,
  onKeyUp,
}: IKeyboardGroupProps) => (
  <div className={styles["keyboard-group"]}>
    <p
      className={
        activeNotes.length
          ? styles["helper-text-hidden"]
          : styles["helper-text"]
      }
    >
      Press and hold or tap a key combination to create your Rainbow Sound
      Identity.
    </p>
    <Keyboard
      activeNotes={activeNotes}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
    />
  </div>
);
