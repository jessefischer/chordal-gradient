import { IconButton } from "@mui/material";
import styles from "./Overlay.module.css";
import { Close } from "@mui/icons-material";

interface IOverlayProps {
  handleClose: () => void;
}

const Overlay = ({handleClose}:IOverlayProps) => 

    <div className={styles.overlay}>
      <div className={styles['close-button']}>
      <IconButton onClick={handleClose} size="large">
        <Close fontSize="small" />
      </IconButton>
      </div>
      <h1>What is this?</h1>
      <p>
      Inspired by some beautiful artwork created in 2022 by my <a href="https://work.co">Work & Co</a> colleagues{" "}
      <a href="https://manoel.work/">Manoel Amaral</a> and <a href="https://augustang.com/"> 
      August Tang</a> (in turn inspired by the diversity of gender identity flags), it’s an interactive
      visual and audio art generator called <b>Rainbow Sounds</b>. You can use a touch screen, your computer
      keyboard or a MIDI keyboard to create unique color gradients based on the musical notes and chords you
      play. As someone who aspires to be a meaningful ally to so many of my co-workers, friends and loved ones
      who identify as LGBTQ+ (and as someone with auditory-visual synesthesia!), I thought it would be really
      powerful to explore connections between sound, color, and identity. Give it a try and please feel free
      to share what you come up with!
      </p>
      <h1>How did I build it?</h1>
      <p>
        <b>Rainbow Sounds</b> is built with <a href="https://react.dev/">React</a>, <a href="https://www.typescriptlang.org/">TypeScript</a>,
        <a href="https://tonejs.github.io/">Tone.js</a>, and <a href="https://webmidijs.org/">WebMIDI</a>. It’s hosted on Vercel and uses
        Material UI for the UI components, as well as Puppeteer for capturing screen shots. The code is open source
        and available on <a href="https://github.com/jessefischer/chordal-gradient">GitHub</a>.
      </p>
    </div>


export default Overlay;
