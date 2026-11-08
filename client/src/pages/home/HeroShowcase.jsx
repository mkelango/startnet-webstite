// Home hero photo showcase (SPEC §5.1 #1, the Plug and Play home hero): StartNet's own photographs, one large photo
// at a time. Each photo holds for HOLD_MS, then the next one crossfades in over it. The order walks the categories in
// turn (the first photo of each category, then the second of each, ...), so consecutive photos change subject.
// The category of the photo on screen names the slideshow (aria-label); each photo's caption is its figcaption for
// assistive tech (no caption chips over the photo, no category chip row).
//
// Motion rules: pauses on hover and keyboard focus, while the hero is off screen or the tab is hidden, and with the
// pause button (WCAG 2.2.2). Reduced motion: no autoplay and no fades.
// Prerender-safe: the first state is fixed (the first category's first photo).
// Every photo here is marked as taken on the page (hintFixedPhoto), so no other home slot repeats it.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useLang } from '../../lib/i18n.jsx';
import { photoFor, hintFixedPhoto } from '../../data/photos.js';
import { cx } from '../../components/_utils.js';

// One photo every three beats of the old 1.6s mosaic tick: a full-bleed photo needs time to be seen.
const TICK_MS = 1600;
const HOLD_MS = TICK_MS * 3;

// [manifest key, short caption EN, short caption TA]. The first photo opens the showcase.
const CATEGORIES = [
  {
    id: 'summits', brand: 'connect', label: ['Summits', 'உச்சி மாநாடுகள்'],
    photos: [
      ['event/saas-connect/2025-10', 'SaaS.Connect 2025 · lighting the lamp', 'SaaS.Connect 2025 · குத்துவிளக்கு ஏற்றல்'],
      ['event/d2c-connect/2024', 'D2C Connect 2024 · Coimbatore', 'D2C Connect 2024 · கோயம்புத்தூர்'],
      ['event/genai-connect/2024-lamp', 'GenAI Connect 2024 · Salem', 'GenAI Connect 2024 · சேலம்'],
      ['event/saas-connect/2025-8', 'SaaS.Connect 2025 · main stage', 'SaaS.Connect 2025 · முதன்மை மேடை'],
      ['event/saas-connect/2025-6', 'SaaS.Connect 2025 · front rows', 'SaaS.Connect 2025 · முன்வரிசை'],
    ],
  },
  {
    id: 'campuses', brand: 'vibe', label: ['Campuses', 'கல்லூரிகள்'],
    photos: [
      ['pool/vibereal/01', 'StartNet Vibe · TNGSS 2025', 'StartNet Vibe · TNGSS 2025'],
      ['event/vibe-coding-summit/2025-coimbatore-3', 'Vibe Coding Summit 2025', 'Vibe Coding Summit 2025'],
      ['pool/vibereal/11', 'The StartNet booth · TNGSS 2025', 'StartNet அரங்கு · TNGSS 2025'],
      ['event/vibe-marketing-summit-2025/2', 'Vibe Marketing Summit 2025 · Salem', 'Vibe Marketing Summit 2025 · சேலம்'],
      ['pool/vibereal/15', 'The Vibe team · TNGSS 2025', 'Vibe குழு · TNGSS 2025'],
    ],
  },
  {
    id: 'women', brand: 'women', label: ['Women', 'பெண்கள்'],
    photos: [
      ['pool/womenreal/03', 'Women founders with the StartNet team', 'StartNet குழுவுடன் பெண் நிறுவனர்கள்'],
      ['event/nirf-higher-ed-summit/2024-coimbatore-3', 'Keynote · NIRF Summit 2024', 'முதன்மை உரை · NIRF Summit 2024'],
      ['event/nirf-higher-ed-summit/2024-coimbatore-2', 'Lighting the lamp · NIRF Summit 2024', 'குத்துவிளக்கு ஏற்றல் · NIRF Summit 2024'],
    ],
  },
  {
    id: 'research', brand: 'research', label: ['Research', 'ஆய்வு'],
    photos: [
      ['event/nirf-higher-ed-summit/2024-salem-4', 'NIRF Summit 2024 · Salem', 'NIRF Summit 2024 · சேலம்'],
      ['event/nirf-higher-ed-summit/2024-coimbatore-4', 'Faculty round table · Coimbatore', 'பேராசிரியர் வட்டமேசை · கோயம்புத்தூர்'],
      ['event/nirf-higher-ed-summit/2024-salem', 'Institution leaders · Salem', 'கல்வி நிறுவனத் தலைவர்கள் · சேலம்'],
      ['event/nirf-higher-ed-summit/2024-coimbatore-7', 'Session talk · NIRF Summit 2024', 'அமர்வு உரை · NIRF Summit 2024'],
      ['event/nirf-higher-ed-summit/2024-coimbatore-5', 'Table discussion · Coimbatore', 'மேசை விவாதம் · கோயம்புத்தூர்'],
    ],
  },
  {
    id: 'community', brand: 'startnet', label: ['Community', 'சமூகம்'],
    photos: [
      ['pool/connectreal/02', 'A StartNet Connect meet-up', 'StartNet Connect சந்திப்பு'],
      ['pool/team/01', 'StartNet’s first anniversary · 2024', 'StartNet முதல் ஆண்டு விழா · 2024'],
      ['pool/team/04', 'Raising Star Startup Award', 'Raising Star Startup விருது'],
      ['pool/investors/02', 'Founders meet investors', 'முதலீட்டாளர்களுடன் நிறுவனர்கள்'],
      ['pool/stage/10', 'Network meeting · Sept 2023', 'வலையமைப்புக் கூட்டம் · செப். 2023'],
    ],
  },
];

// Resolve manifest records once; drop any photo that is missing from the manifest.
const SETS = CATEGORIES.map((c) => ({
  ...c,
  photos: c.photos.map(([key, en, ta]) => ({ key, en, ta, pic: photoFor(key) })).filter((p) => p.pic),
})).filter((c) => c.photos.length > 0);

// The play order: photo 1 of every category, then photo 2 of every category, and so on.
const SEQUENCE = (() => {
  const out = [];
  const longest = Math.max(0, ...SETS.map((s) => s.photos.length));
  for (let i = 0; i < longest; i += 1) {
    SETS.forEach((s) => { if (s.photos[i]) out.push({ ...s.photos[i], set: s }); });
  }
  return out;
})();

// The photo box is about half the viewport wide and nearly the full hero tall (>=1024), so a 3:2 photo set to cover
// it needs its height x 1.5 in width (not the box width): that picks the 1200 / 1280 variants on desktop. Tablets show
// it full bleed at 4/3, phones full bleed at 4/5 (capped at 72svh).
const STAGE_SIZES = '(min-width: 1024px) calc((100vh - 8rem) * 1.5), (min-width: 600px) 100vw, 150vw';

function Picture({ photo, sizes, priority, alt }) {
  const pic = photo.pic;
  return (
    <picture className="hero-show__picture">
      {pic.formats?.includes('webp') && (
        <source type="image/webp" srcSet={pic.widths.map((w) => `${pic.base}-${w}.webp ${w}w`).join(', ')} sizes={sizes} />
      )}
      <img
        className="hero-show__img"
        sizes={sizes}
        srcSet={(pic.jpgWidths || pic.widths).map((w) => `${pic.base}-${w}.jpg ${w}w`).join(', ')}
        src={`${pic.base}-${(pic.jpgWidths || pic.widths)[0]}.jpg`}
        width={pic.width}
        height={pic.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : undefined}
        decoding={priority ? 'sync' : 'async'}
        style={{ objectPosition: pic.focus || '50% 50%' }}
      />
    </picture>
  );
}

/** The stage: the new photo fades in over the previous one, which is dropped once the fade is done. */
function Stage({ photo }) {
  const { lang } = useLang();
  const [layers, setLayers] = useState([photo]);
  useEffect(() => {
    setLayers((l) => (l[l.length - 1].key === photo.key ? l : [l[l.length - 1], photo]));
  }, [photo]);
  const first = useRef(true);
  useEffect(() => { first.current = false; }, []);
  const top = layers[layers.length - 1];
  return (
    <figure className="home-hero__tile home-hero__tile--main">
      {layers.map((p, i) => (
        <div
          key={p.key}
          className={cx('hero-show__layer', i === layers.length - 1 && layers.length > 1 && 'is-in')}
          onAnimationEnd={i === layers.length - 1 ? () => setLayers([p]) : undefined}
        >
          <Picture photo={p} sizes={STAGE_SIZES} priority={first.current && i === 0} alt={p.pic.alt || ''} />
        </div>
      ))}
      {/* The caption names the event and city for assistive tech; nothing is burned over the photo (PnP tiles are clean). */}
      <figcaption className="visually-hidden">{lang === 'ta' ? top.ta : top.en}</figcaption>
    </figure>
  );
}

export default function HeroShowcase() {
  const { t, basePath } = useLang();
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageShown, setPageShown] = useState(true);
  const [reduced, setReduced] = useState(false);
  const rootRef = useRef(null);
  const elapsed = useRef(0);

  // Mark every showcase photo as taken on this page, so other slots never repeat one.
  const path = basePath || '/';
  useMemo(() => { SETS.forEach((s) => s.photos.forEach((p) => hintFixedPhoto(path, p.key))); }, [path]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const read = () => setReduced(mq.matches || document.documentElement.dataset.motion === 'reduced');
    read();
    mq.addEventListener?.('change', read);
    const io = 'IntersectionObserver' in window && rootRef.current
      ? new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 })
      : null;
    if (io) io.observe(rootRef.current);
    const vis = () => setPageShown(!document.hidden);
    document.addEventListener('visibilitychange', vis);
    return () => { mq.removeEventListener?.('change', read); io?.disconnect(); document.removeEventListener('visibilitychange', vis); };
  }, []);

  const playing = !reduced && !userPaused && !hover && !focusIn && inView && pageShown && SEQUENCE.length > 1;

  // One clock: the time the current photo has been on screen.
  useEffect(() => {
    if (!playing) return undefined;
    let raf = 0;
    let last = performance.now();
    const step = (now) => {
      elapsed.current += now - last;
      last = now;
      if (elapsed.current >= HOLD_MS) {
        elapsed.current = 0;
        setIndex((i) => (i + 1) % SEQUENCE.length);
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  // Warm the next photo while this one shows.
  useEffect(() => {
    const next = SEQUENCE[(index + 1) % SEQUENCE.length];
    if (!next) return undefined;
    const id = window.setTimeout(() => {
      const img = new Image();
      img.sizes = STAGE_SIZES;
      img.srcset = next.pic.widths.map((w) => `${next.pic.base}-${w}.webp ${w}w`).join(', ');
    }, 400);
    return () => window.clearTimeout(id);
  }, [index]);

  const photo = SEQUENCE[index];
  if (!photo) return null;
  const set = photo.set;
  return (
    <div
      ref={rootRef}
      className={cx('hero-show', !playing && 'is-paused', reduced && 'is-still')}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocusIn(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocusIn(false); }}
    >
      <div className="home-hero__mosaic" id="hero-show-mosaic" role="group" aria-roledescription={t('slideshow', 'படக்காட்சி')} aria-label={t(set.label[0], set.label[1])}>
        <Stage photo={photo} />
      </div>
      {!reduced && SEQUENCE.length > 1 && (
        <button
          type="button"
          className="hero-show__pause"
          aria-controls="hero-show-mosaic"
          onClick={() => setUserPaused((p) => !p)}
          aria-label={userPaused ? t('Play the photo slideshow', 'படக்காட்சியை இயக்கு') : t('Pause the photo slideshow', 'படக்காட்சியை நிறுத்து')}
        >
          {userPaused ? <Play size={14} strokeWidth={2} aria-hidden="true" /> : <Pause size={14} strokeWidth={2} aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}
