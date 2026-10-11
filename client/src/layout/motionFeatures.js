// framer-motion feature bundle for the shell's <LazyMotion> (SiteLayout.jsx). Loaded as its own chunk after first
// paint, so layout files render with the light `m` component. domAnimation (not domMax): nothing in the app uses
// framer-motion drag or layout animations (the mobile drawer animates with plain transforms), and domMax added
// ~13 KB gz to every page. Non-strict LazyMotion: any page still using `motion` keeps working.
// Same bundle as lib/motionBundle.js, so Rollup emits one shared chunk.
import { domAnimation } from 'framer-motion';

export default domAnimation;
