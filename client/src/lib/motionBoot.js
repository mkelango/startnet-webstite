// Loaded lazily from main.jsx after first paint.
import { initSmoothScroll } from './smoothScrollBoot.js';
import { initPointerFx } from './pointerFx.js';

let booted = false;
export function bootMotion() {
  if (booted) return;
  booted = true;
  initSmoothScroll();
  initPointerFx();
}
