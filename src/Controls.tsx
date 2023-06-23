import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { IconButton } from "@mui/material";

interface IControlsProps {
  isMuted: boolean;
  toggleMuted: () => void;
}

export const Controls = ({ isMuted, toggleMuted }: IControlsProps) => (
  <div className="controls">
    <IconButton onClick={toggleMuted} size="large">
      {isMuted ? (
        <VolumeOffIcon fontSize="small" />
      ) : (
        <VolumeUpIcon fontSize="small" />
      )}
    </IconButton>
  </div>
);
