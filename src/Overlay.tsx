import { Keyboard } from "./Keyboard";

export const Overlay = ({
    keyCharsPressed,
}: {
    keyCharsPressed: Array<string>;
}) =>
    <div className="overlay">
        <p
            className={
                keyCharsPressed.length ? "helper-text-hidden" : "helper-text"
            }
        >
            Press and hold or tap a key combination to create your Rainbow Sound Identity.
        </p>
        <Keyboard {...{ keyCharsPressed }} />
    </div>
