import { Keyboard } from "./Keyboard";

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
  <div className="keyboard-group">
    <p className={activeNotes.length ? "helper-text-hidden" : "helper-text"}>
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
