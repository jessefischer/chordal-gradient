import { Keyboard } from "./Keyboard";

interface IKeyboardGroupProps {
  activeNotes: Array<number>;
}

export const KeyboardGroup = ({ activeNotes }: IKeyboardGroupProps) => (
  <div className="KeyboardGroup">
    <p className={activeNotes.length ? "helper-text-hidden" : "helper-text"}>
      Press and hold or tap a key combination to create your Rainbow Sound
      Identity.
    </p>
    <Keyboard activeNotes={activeNotes} />
  </div>
);
