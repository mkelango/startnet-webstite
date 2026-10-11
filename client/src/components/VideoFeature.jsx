import { useEffect, useId, useRef, useState } from 'react';
import { useLang } from '../lib/i18n.jsx';
import { videosFor } from '../data/videos.js';
import { cx, safeId } from './_utils.js';
import './VideoFeature.css';

const poster = (id, size) => `https://i.ytimg.com/vi/${id}/${size}.jpg`;
const isShort = (video) => video?.aspect === '9:16';
const pick = (lang, en, ta) => (lang === 'ta' && ta) || en;

/**
 * Poster source with the YouTube fallback chain: maxresdefault (or `video.poster`), then hqdefault, which always
 * exists. YouTube answers a missing maxres poster with a 120 px grey image rather than an error, so the check also
 * runs after mount: in a prerendered page the image can finish loading before React attaches onLoad.
 */
function usePoster(video) {
  const first = video.poster || 'maxresdefault';
  const [src, setSrc] = useState(poster(video.id, first));
  const ref = useRef(null);
  const toHq = () => setSrc((s) => (s.includes('/hqdefault') ? s : poster(video.id, 'hqdefault')));
  const check = (img) => {
    if (img && img.complete && img.naturalWidth > 0 && img.naturalWidth <= 120) toHq();
  };
  useEffect(() => {
    setSrc(poster(video.id, first));
  }, [video.id, first]);
  useEffect(() => check(ref.current));
  return { src, ref, onLoad: (e) => check(e.currentTarget), onError: toHq };
}

const PlayGlyph = ({ size = 28 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} focusable="false" aria-hidden="true">
    <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
  </svg>
);

/**
 * One event video in a 12 px frame: the paper-ink poster, an animated round play button and a duration chip.
 * Nothing from YouTube runs until the visitor presses play; then the privacy-enhanced player (youtube-nocookie.com)
 * replaces the poster and starts. The production CSP allows exactly these two hosts (server/src/main.ts).
 * The poster <img> and the caption are plain markup, so the prerendered HTML carries both.
 *
 * Props: video (data/videos.js entry), className, priority (eager poster), variant 'card' (default; the frame
 * takes the video's own ratio, 16:9 or 9:16) or 'stage' (always 16:9; a 9:16 video sits centred on a blurred copy
 * of its poster), autoPlay (start with the player, for a playlist swap after the visitor already pressed play),
 * onPlay, caption (false hides the figcaption).
 */
export function VideoFeature({ video, className, priority = false, variant = 'card', autoPlay = false, onPlay, caption: showCaption = true }) {
  const { t, lang } = useLang();
  const [playing, setPlaying] = useState(autoPlay);
  const frameRef = useRef(null);
  const img = usePoster(video);
  const short = isShort(video);
  const stage = variant === 'stage';
  const title = pick(lang, video.title, video.titleTa);
  const caption = pick(lang, video.caption, video.captionTa);
  const chips = (lang === 'ta' && video.chipsTa) || video.chips || [];
  const embed = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1&modestbranding=1${video.start ? `&start=${video.start}` : ''}`;

  useEffect(() => {
    setPlaying(autoPlay);
  }, [video.id, autoPlay]);

  const pressed = useRef(false);
  const play = () => {
    pressed.current = true;
    setPlaying(true);
    onPlay?.(video);
  };
  // Keep keyboard focus in the player once the poster button is gone (only after a press, never on autoPlay).
  useEffect(() => {
    if (playing && pressed.current) {
      pressed.current = false;
      frameRef.current?.querySelector('iframe')?.focus();
    }
  }, [playing]);

  return (
    <figure
      className={cx('video-feature', short && 'video-feature--short', stage && 'video-feature--stage', playing && 'is-playing', className)}
      style={video.posterZoom ? { '--poster-zoom': video.posterZoom } : undefined}
    >
      <div className="video-feature__frame" ref={frameRef}>
        {stage && short && (
          <img className="video-feature__backdrop" src={poster(video.id, 'hqdefault')} alt="" aria-hidden="true" loading="lazy" decoding="async" />
        )}
        <div className="video-feature__screen">
          {playing ? (
            <iframe
              className="video-feature__player"
              src={embed}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              className="video-feature__poster"
              onClick={play}
            >
              {/* Name from content, so it includes the visible duration (WCAG 2.5.3 Label in Name) */}
              <span className="visually-hidden">{t(`Play video: ${title}`, `காணொளியை இயக்கு: ${title}`)}{video.duration ? ', ' : ''}</span>
              {stage && (
                // The rail already loaded this hq thumbnail: show it at once while the large poster arrives.
                <span className="video-feature__placeholder" style={{ backgroundImage: `url(${poster(video.id, 'hqdefault')})` }} aria-hidden="true" />
              )}
              <img
                ref={img.ref}
                src={img.src}
                alt=""
                loading={priority || stage ? 'eager' : 'lazy'}
                decoding="async"
                width={short ? 720 : 1280}
                height={short ? 1280 : 720}
                onLoad={img.onLoad}
                onError={img.onError}
              />
              <span className="video-feature__play" aria-hidden="true">
                <PlayGlyph />
              </span>
              {video.duration && (
                <span className="video-feature__duration">
                  <PlayGlyph size={10} />
                  {video.duration}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
      {showCaption && (
        <figcaption className="video-feature__caption">
          <span className="video-feature__title">{title}</span>
          {caption && <span className="video-feature__meta">{caption}</span>}
          <span className="video-feature__row">
            {chips.map((c) => (
              <span key={c} className="video-feature__chip">{c}</span>
            ))}
            <a className="video-feature__source" href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
              {video.credit || t('Watch on YouTube', 'YouTube-இல் பார்க்க')}
              <span className="visually-hidden">{t(' (opens in a new tab)', ' (புதிய தாவலில் திறக்கும்)')}</span>
            </a>
          </span>
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Playlist for 2–4 videos: one large stage plus a rail of thumbnails. Selecting a thumbnail swaps the stage; if the
 * visitor had already pressed play, the next video starts too, otherwise only its poster changes (YouTube still
 * loads only on a press). ARIA tabs: the rail is a tablist (arrow keys, Home / End move focus; Enter / Space or a
 * click selects), the stage is the tabpanel. Every title is in the rail markup, so the prerender carries them all.
 * Props: videos, label (tablist name), className.
 */
export function VideoPlaylist({ videos, label, className }) {
  const { t, lang } = useLang();
  const uid = safeId(useId());
  const list = (videos || []).filter(Boolean);
  const [active, setActive] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const tabs = useRef([]);
  if (!list.length) return null;
  const current = list[Math.min(active, list.length - 1)];

  const onKeyDown = (e, i) => {
    let n = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (i + 1) % list.length;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (i - 1 + list.length) % list.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = list.length - 1;
    if (n === null) return;
    e.preventDefault();
    tabs.current[n]?.focus();
  };

  return (
    <div className={cx('video-playlist', engaged && 'is-engaged', className)}>
      <div className="video-playlist__inner">
        <div className="video-playlist__stage" role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${active}`}>
          <VideoFeature key={current.id} video={current} variant="stage" autoPlay={engaged} onPlay={() => setEngaged(true)} />
        </div>
        <div className="video-playlist__rail">
          <div className="video-playlist__list" role="tablist" aria-label={label || t('Videos', 'காணொளிகள்')} aria-orientation="vertical">
            {list.map((v, i) => {
              const selected = v === current;
              return (
                <button
                  key={v.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${uid}-tab-${i}`}
                  aria-selected={selected}
                  aria-controls={`${uid}-panel`}
                  tabIndex={selected ? 0 : -1}
                  className={cx('video-playlist__item', selected && 'is-active')}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                >
                  <span className={cx('video-playlist__thumb', isShort(v) && 'video-playlist__thumb--short')}>
                    <img src={poster(v.id, 'hqdefault')} alt="" loading="lazy" decoding="async" width="480" height="360" />
                    {v.duration && <span className="video-playlist__duration">{v.duration}</span>}
                    {selected && (
                      <span className="video-playlist__now" aria-hidden="true">
                        <span className="video-playlist__bars"><i /><i /><i /></span>
                      </span>
                    )}
                  </span>
                  <span className="video-playlist__text">
                    <span className="video-playlist__index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <span className="video-playlist__title">{pick(lang, v.title, v.titleTa)}</span>
                    {(v.caption || v.captionTa) && <span className="video-playlist__meta">{pick(lang, v.caption, v.captionTa)}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * "On film": the verified videos of one event series (and optionally one edition), from data/videos.js, or the
 * `videos` given. Renders nothing when there are none, so it can sit on any event page without leaving an empty
 * block.
 * layout: 'auto' (default: a grid for 1–2 videos, the playlist for 3+), 'grid' or 'playlist'. With the default
 * max={2} the existing calls render exactly as before (grid).
 */
export function EventVideos({ series, edition, videos: list, max = 2, headingLevel = 2, title, eyebrow, className, layout = 'auto', playlistLabel }) {
  const { t } = useLang();
  const headingId = `${safeId(useId())}-title`;
  const videos = (list || videosFor(series, edition)).slice(0, max);
  if (!videos.length) return null;
  const H = `h${Math.min(Math.max(Number(headingLevel) || 2, 2), 6)}`;
  const asPlaylist = videos.length > 1 && (layout === 'playlist' || (layout === 'auto' && videos.length > 2));
  const heading = title || t('See the room for yourself', 'அரங்கை நீங்களே பாருங்கள்');
  return (
    <section
      className={cx('event-videos', !asPlaylist && videos.length > 1 && 'event-videos--pair', asPlaylist && 'event-videos--playlist', className)}
      aria-labelledby={headingId}
    >
      <div className="event-videos__head">
        <p className="eyebrow">{eyebrow || t('On film', 'காணொளியில்')}</p>
        <H className="event-videos__title" id={headingId}>{heading}</H>
      </div>
      {asPlaylist ? (
        <VideoPlaylist videos={videos} label={playlistLabel || (typeof heading === 'string' ? heading : undefined)} />
      ) : (
        <div className="event-videos__list">
          {videos.map((v) => <VideoFeature key={v.id} video={v} />)}
        </div>
      )}
    </section>
  );
}
