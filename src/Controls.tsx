import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import { IconButton } from "@mui/material";

import styles from "./Controls.module.css";

interface IControlsProps {
  isMuted: boolean;
  isCapturingScreenShot: boolean;
  handleCaptureScreenShot: () => void;
  handleCopyLink: () => void;
  toggleMuted: () => void;
}

export const Controls = ({
  isMuted,
  isCapturingScreenShot,
  handleCaptureScreenShot,
  handleCopyLink,
  toggleMuted,
}: IControlsProps) => (
  <div className={styles.controls}>
    <IconButton
      onClick={handleCaptureScreenShot}
      className={isCapturingScreenShot ? styles.active : undefined}
      size="large"
    >
      <PhotoCameraIcon fontSize="small" />
    </IconButton>
    <IconButton onClick={handleCopyLink} size="large">
      <InsertLinkIcon fontSize="small" />
    </IconButton>
    <IconButton onClick={toggleMuted} size="large">
      {isMuted ? (
        <VolumeOffIcon fontSize="small" />
      ) : (
        <VolumeUpIcon fontSize="small" />
      )}
    </IconButton>
  </div>
);
