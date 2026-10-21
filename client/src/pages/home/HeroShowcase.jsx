// Home hero photo showcase (M01 v3.1, 14 Oct 2026): StartNet's own photographs grouped by category, shown three at a
// time in the bento mosaic. Inside a category one tile crossfades to the next photo every TICK_MS; after the
// category's photos have all been shown, the whole mosaic moves on to the next category (staggered crossfade).
// The category tabs under the mosaic name each set, carry the brand dot and a progress line, and can be clicked.
//
// Motion rules: pauses on hover and keyboard focus, while the hero is off screen or the tab is hidden, and with the
// pause button (WCAG 2.2.2). Reduced motion: no autoplay and no fades; the tabs still switch the set.
// Prerender-safe: the first state is fixed (first category, its first three photos).
// Every photo here is marked as taken on the page (hintFixedPhoto), so no other home slot repeats it.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useLang } from '../../lib/i18n.jsx';
import { photoFor, hintFixedPhoto } from '../../data/photos.js';
import { cx } from '../../components/_utils.js';

const TICK_MS = 1600;

// [manifest key, short caption EN, short caption TA]. The first photo opens the tall tile.
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
})).filter((c) => c.photos.length >= 3);

const TILE_SIZES = ['(min-width: 1024px) 26vw, 56vw', '(min-width: 1024px) 20vw, 44vw', '(min-width: 1024px) 20vw, 44vw'];

/** Which photo each of the three tiles shows at a given tick of a category. */
function tilesAt(set, tick) {
  const t = [0, 1, 2];
  const extra = set.photos.length - 3;
  // tick 1 swaps the top tile, tick 2 the bottom tile, … using the photos after the first three.
  for (let i = 1; i <= Math.min(tick, extra); i += 1) t[1 + ((i - 1) % 2)] = 2 + i;
  return t;
}
// Every category stays on screen for three ticks, even one with only three photos (it simply has no swaps).
const ticksFor = () => 3;

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

/** One tile: the new photo fades in over the previous one, which is dropped once the fade is done. */
function Tile({ photo, index, cls, catKey }) {
  const { lang } = useLang();
  const [layers, setLayers] = useState([photo]);
  useEffect(() => {
    setLayers((l) => (l[l.length - 1].key === photo.key ? l : [l[l.length - 1], photo]));
  }, [photo]);
  const first = useRef(true);
  useEffect(() => { first.current = false; }, []);
  const top = layers[layers.length - 1];
  const caption = lang === 'ta' ? top.ta : top.en;
  return (
    <figure className={`home-hero__tile home-hero__tile--${cls}`} style={{ '--i': index }}>
      {layers.map((p, i) => (
        <div
          key={p.key}
          className={cx('hero-show__layer', i === layers.length - 1 && layers.length > 1 && 'is-in')}
          onAnimationEnd={i === layers.length - 1 ? () => setLayers([p]) : undefined}
        >
          <Picture photo={p} sizes={TILE_SIZES[index]} priority={first.current && index === 0} alt={p.pic.alt || ''} />
        </div>
      ))}
      <figcaption className="home-hero__chip" key={`${catKey}-${top.key}`}>{caption}</figcaption>
    </figure>
  );
}

export default function HeroShowcase() {
  const { t, basePath } = useLang();
  const [cat, setCat] = useState(0);
  const [tick, setTick] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageShown, setPageShown] = useState(true);
  const [reduced, setReduced] = useState(false);
  const rootRef = useRef(null);
  const barRef = useRef(null);
  const tabsRef = useRef(null);
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

  const set = SETS[cat];
  const ticks = ticksFor(set);
  const catMs = ticks * TICK_MS;
  const playing = !reduced && !userPaused && !hover && !focusIn && inView && pageShown && SETS.length > 1;

  // One clock: elapsed time in the current category drives both the swaps and the tab's progress line.
  useEffect(() => {
    if (!playing) return undefined;
    let raf = 0;
    let last = performance.now();
    const step = (now) => {
      elapsed.current += now - last;
      last = now;
      if (elapsed.current >= catMs) {
        elapsed.current = 0;
        setTick(0);
        setCat((c) => (c + 1) % SETS.length);
      } else {
        const tk = Math.floor(elapsed.current / TICK_MS);
        setTick((prev) => (prev === tk ? prev : tk));
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(1, elapsed.current / catMs)})`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing, catMs]);

  // Keep the active tab in view when the row scrolls (phones). Scrolls the row only, never the page.
  useEffect(() => {
    const row = tabsRef.current;
    const tab = row?.querySelector('.is-active');
    if (!row || !tab || row.scrollWidth <= row.clientWidth) return;
    const left = tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2;
    row.scrollTo({ left: Math.max(0, left), behavior: reduced ? 'auto' : 'smooth' });
  }, [cat, reduced]);

  // Warm the next category's photos while this one plays.
  useEffect(() => {
    const next = SETS[(cat + 1) % SETS.length];
    const id = window.setTimeout(() => {
      next.photos.forEach((p, i) => {
        const img = new Image();
        img.sizes = TILE_SIZES[Math.min(i, 2)];
        img.srcset = p.pic.widths.map((w) => `${p.pic.base}-${w}.webp ${w}w`).join(', ');
      });
    }, 400);
    return () => window.clearTimeout(id);
  }, [cat]);

  const choose = (i) => {
    elapsed.current = 0;
    setTick(0);
    setCat(i);
    if (barRef.current) barRef.current.style.transform = 'scaleX(0)';
  };

  const idx = tilesAt(set, tick);
  const tiles = ['main', 'top', 'bottom'];
  return (
    <div
      ref={rootRef}
      className={cx('hero-show home-hero__rise home-hero__rise--1', !playing && 'is-paused', reduced && 'is-still')}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocusIn(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocusIn(false); }}
    >
      <div className="home-hero__mosaic" id="hero-show-mosaic" role="group" aria-roledescription={t('slideshow', 'படக்காட்சி')} aria-label={t(set.label[0], set.label[1])}>
        {tiles.map((cls, i) => (
          <Tile key={cls} cls={cls} index={i} catKey={set.id} photo={set.photos[idx[i]]} />
        ))}
      </div>

      <div className="hero-show__bar">
        <div className="hero-show__tabs" ref={tabsRef} role="group" aria-label={t('Photo categories', 'புகைப்பட வகைகள்')}>
          {SETS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={cx('hero-show__tab', i === cat && 'is-active')}
              data-brand={s.brand}
              aria-pressed={i === cat}
              aria-controls="hero-show-mosaic"
              onClick={() => choose(i)}
            >
              <span className="hero-show__dot" aria-hidden="true" />
              {t(s.label[0], s.label[1])}
              {i === cat && <span className="hero-show__progress" aria-hidden="true"><span ref={barRef} /></span>}
            </button>
          ))}
        </div>
        {!reduced && (
          <button
            type="button"
            className="hero-show__pause"
            onClick={() => setUserPaused((p) => !p)}
            aria-label={userPaused ? t('Play the photo slideshow', 'படக்காட்சியை இயக்கு') : t('Pause the photo slideshow', 'படக்காட்சியை நிறுத்து')}
          >
            {userPaused ? <Play size={14} strokeWidth={2} aria-hidden="true" /> : <Pause size={14} strokeWidth={2} aria-hidden="true" />}
          </button>
        )}
      </div>
    </div>
  );
}
