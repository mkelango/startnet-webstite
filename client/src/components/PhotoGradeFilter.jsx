// The site's photo grade as an SVG filter, for images the photo pipeline does not process (YouTube video posters and
// playlist thumbnails). Same grade as tools/images/photo-grade.json (fitted 14 Oct 2026 to StartNet's reference photos):
// keep 11% of the colour, then map each channel through the tone-and-tint curve, sampled at 17 points.
// Use in CSS as  filter: url(#sn-photo-grade)  (optionally followed by brightness() for legibility under text).
const R = '0.004 0.039 0.110 0.184 0.255 0.329 0.400 0.471 0.545 0.616 0.686 0.761 0.831 0.902 0.973 0.996 1.000';
const G = '0.004 0.039 0.106 0.176 0.247 0.322 0.388 0.459 0.529 0.600 0.671 0.741 0.816 0.886 0.957 0.992 1.000';
const B = '0.004 0.035 0.098 0.165 0.235 0.302 0.369 0.439 0.506 0.573 0.643 0.710 0.776 0.843 0.914 0.965 0.992';

export function PhotoGradeFilter() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <filter id="sn-photo-grade" colorInterpolationFilters="sRGB">
        <feColorMatrix type="saturate" values="0.11" />
        <feComponentTransfer>
          <feFuncR type="table" tableValues={R} />
          <feFuncG type="table" tableValues={G} />
          <feFuncB type="table" tableValues={B} />
        </feComponentTransfer>
      </filter>
    </svg>
  );
}

export default PhotoGradeFilter;
