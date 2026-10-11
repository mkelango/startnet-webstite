// framer-motion feature bundle for the kit's <MotionFeatures>, in a module of its own so it is only ever loaded with
// a dynamic import (lib/motionFeatures.js). Importing a feature bundle statically from anything the entry reaches put
// ~46 KB br of animation code in the entry chunk (F-33).
// domAnimation, the same bundle the shell's <LazyMotion> (layout/motionFeatures.js) loads, so Rollup emits one shared
// chunk. No component uses framer-motion drag or layout animations, which are the only extras domMax adds.
import { domAnimation } from 'framer-motion';

export default domAnimation;
