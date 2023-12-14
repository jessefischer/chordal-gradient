import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
// import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

import { IconButton } from "@mui/material";

import styles from "./Controls.module.css";
import { Keyboard } from "./Keyboard";

interface IControlsProps {
  activeNotes: Array<number>;
  isMuted: boolean;
  isCapturingScreenShot: boolean;
  onKeyDown: (note: number) => void;
  onKeyUp: (note: number) => void;
  handleCaptureScreenShot: () => void;
  handleCopyLink: () => void;
  toggleMuted: () => void;
  showOverlay: () => void;
}

export const Controls = ({
  activeNotes,
  isMuted,
  // isCapturingScreenShot,
  onKeyDown,
  onKeyUp,
  // handleCaptureScreenShot,
  handleCopyLink,
  toggleMuted,
  showOverlay
}: IControlsProps) => (
  <div className={styles.controls}>
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
    <div className={styles.row}>
      {/* <IconButton
        onClick={handleCaptureScreenShot}
        className={isCapturingScreenShot ? styles.active : undefined}
        size="large"
      >
        <PhotoCameraIcon fontSize="small" />
      </IconButton> */}
      <IconButton onClick={handleCopyLink} size="large">
        <InsertLinkIcon fontSize="small" />
      </IconButton>
      <IconButton onClick={showOverlay} size="large">
        <QuestionMarkIcon fontSize="small" />
      </IconButton>
      <IconButton onClick={toggleMuted} size="large">
        {isMuted ? (
          <VolumeOffIcon fontSize="small" />
        ) : (
          <VolumeUpIcon fontSize="small" />
        )}
      </IconButton>
    </div>
  </div>
);
