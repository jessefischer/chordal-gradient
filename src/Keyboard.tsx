const whiteKeys = "asdfghjkl;";
const blackKeys = "we tyu op";

export const Keyboard = ({
  keyCharsPressed
}: {
  keyCharsPressed: Array<string>;
}) => (
  <div className={keyCharsPressed.length ? "keyboard" : "keyboard pulsating"}>
    <div className="white-keys">
      {Array.from(whiteKeys).map((char, i) => (
        <div
          key={char + i}
          className={keyCharsPressed.includes(char) ? "pressed" : undefined}
        >
          {char}
        </div>
      ))}
    </div>
    <div className="black-keys">
      {Array.from(blackKeys).map((char, i) => (
        <div
          key={char + i}
          className={
            char === " "
              ? "blank"
              : keyCharsPressed.includes(char)
              ? "pressed"
              : undefined
          }
        >
          {char}
        </div>
      ))}
    </div>
  </div>
);