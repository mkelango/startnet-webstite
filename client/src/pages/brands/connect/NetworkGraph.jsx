import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../../hooks/useReducedMotion.js';
import { useLang } from '../../../lib/i18n.jsx';
import { NETWORK_GROUPS } from './connectData.js';
import './NetworkGraph.css';

const W = 800, H = 520, HUB = [410, 285], GRID = 8;
// label placement per group: [dx, dy, anchor]
const LABEL = { professionals: [0, -86, 'middle'], founders: [0, 100, 'middle'], mentors: [96, 6, 'start'], gccs: [0, -86, 'middle'], investors: [0, 100, 'middle'] };
const snap = (v) => Math.round(v / GRID) * GRID;

/** Precomputed, deterministic layout (no simulation on the client — Book 4 R4 pattern 17). */
function buildGraph() {
  let s = 20261005;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const nodes = [], edges = [];
  const hubIndex = {};
  const range = {};
  NETWORK_GROUPS.forEach((g, gi) => {
    const [cx, cy] = g.at;
    hubIndex[g.id] = nodes.length;
    nodes.push({ id: `${g.id}-hub`, group: g.id, x: cx, y: cy, hub: true });
    const first = nodes.length;
    const count = 7;
    for (let k = 0; k < count; k++) {
      const a = gi * 0.9 + (k / count) * Math.PI * 2 + (rnd() - 0.5) * 0.5;
      const r = 44 + rnd() * 34;
      nodes.push({ id: `${g.id}-${k}`, group: g.id, x: snap(cx + Math.cos(a) * r), y: snap(cy + Math.sin(a) * r * 0.85) });
      edges.push({ a: hubIndex[g.id], b: nodes.length - 1, kind: 'inner' });
      if (k > 0 && rnd() > 0.35) edges.push({ a: nodes.length - 2, b: nodes.length - 1, kind: 'inner' });
    }
    range[g.id] = [first, nodes.length];
  });
  const centre = nodes.length;
  nodes.push({ id: 'connect', group: 'connect', x: HUB[0], y: HUB[1], centre: true });
  NETWORK_GROUPS.forEach((g) => edges.push({ a: hubIndex[g.id], b: centre, kind: 'bridge' }));
  const seen = new Set();
  NETWORK_GROUPS.forEach((g) => g.links.forEach((other) => {
    const key = [g.id, other].sort().join('|');
    if (seen.has(key)) return;
    seen.add(key);
    // join the nearest pair of satellites between the two groups
    const og = NETWORK_GROUPS.find((x) => x.id === other);
    let best = null;
    for (let i = range[g.id][0]; i < range[g.id][1]; i++) for (let j = range[og.id][0]; j < range[og.id][1]; j++) {
      const d = (nodes[i].x - nodes[j].x) ** 2 + (nodes[i].y - nodes[j].y) ** 2;
      if (!best || d < best.d) best = { i, j, d };
    }
    edges.push({ a: best.i, b: best.j, kind: 'cross' });
  }));
  return { nodes, edges, hubIndex };
}

export default function NetworkGraph() {
  const reduced = useReducedMotion();
  const { t } = useLang();
  const label = (g) => t(g.label, g.labelTa);
  const { nodes, edges, hubIndex } = useMemo(buildGraph, []);
  const [active, setActive] = useState(null);
  const group = NETWORK_GROUPS.find((g) => g.id === active);
  const lit = new Set(group ? [group.id, ...group.links] : []);

  const nodeState = (n) => {
    if (!active) return 'rest';
    if (n.centre) return 'lit';
    if (n.group === active) return 'active';
    return lit.has(n.group) ? 'lit' : 'dim';
  };
  const edgeState = (e) => {
    if (!active) return 'rest';
    const ga = nodes[e.a].group, gb = nodes[e.b].group;
    if (ga === active || gb === active) return (lit.has(ga) || ga === 'connect') && (lit.has(gb) || gb === 'connect') ? 'active' : 'dim';
    return 'dim';
  };

  const hidden = reduced ? false : 'hidden';
  const lineV = { hidden: { pathLength: 0 }, show: (i) => ({ pathLength: 1, transition: { duration: 0.8, delay: 0.1 + (i % 12) * 0.03, ease: [0.22, 1, 0.36, 1] } }) };
  const nodeV = { hidden: { scale: 0 }, show: (i) => ({ scale: 1, transition: { duration: 0.32, delay: 0.3 + (i % 8) * 0.03, ease: [0, 0, 0.3, 1] } }) };

  return (
    <div className="connect-network">
      <div className="connect-network__stage">
        <motion.svg
          className="connect-network__svg"
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={t(
            'A network diagram: professionals, founders, mentors, GCCs and corporates, and investors, each a cluster of dots, all joined through StartNet Connect at the centre.',
            'ஒரு வலையமைப்பு வரைபடம்: தொழில் வல்லுநர்கள், நிறுவனர்கள், வழிகாட்டிகள், GCC-கள் மற்றும் பெருநிறுவனங்கள், முதலீட்டாளர்கள்; ஒவ்வொன்றும் புள்ளிகளின் தொகுப்பு, அனைத்தும் மையத்தில் உள்ள StartNet Connect மூலம் இணைக்கப்பட்டுள்ளன.'
          )}
          initial={hidden}
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          onMouseLeave={() => setActive(null)}
        >
          {edges.map((e, i) => (
            <g key={`e${i}`} className={`connect-network__edge connect-network__edge--${e.kind}`} data-state={edgeState(e)}>
              <motion.line x1={nodes[e.a].x} y1={nodes[e.a].y} x2={nodes[e.b].x} y2={nodes[e.b].y} variants={lineV} custom={i} />
            </g>
          ))}
          {nodes.map((n, i) => (
            <g
              key={n.id}
              className={`connect-network__node${n.hub ? ' connect-network__node--hub' : ''}${n.centre ? ' connect-network__node--centre' : ''}`}
              data-group={n.group}
              data-state={nodeState(n)}
              onMouseEnter={n.centre ? undefined : () => setActive(n.group)}
            >
              {n.hub && <circle className="connect-network__hit" cx={n.x} cy={n.y} r="26" />}
              <motion.circle cx={n.x} cy={n.y} r={n.centre ? 11 : n.hub ? 9 : 4.5} variants={nodeV} custom={i} />
            </g>
          ))}
          {NETWORK_GROUPS.map((g) => {
            const n = nodes[hubIndex[g.id]];
            const [dx, dy, anchor] = LABEL[g.id] || [0, -86, 'middle'];
            return (
              <text key={g.id} className="connect-network__label" data-state={!active ? 'rest' : g.id === active ? 'active' : lit.has(g.id) ? 'lit' : 'dim'} x={n.x + dx} y={n.y + dy} textAnchor={anchor}>
                {label(g)}
              </text>
            );
          })}
          <text className="connect-network__label connect-network__label--centre" x={HUB[0]} y={HUB[1] + 36} textAnchor="middle">StartNet Connect</text>
        </motion.svg>
      </div>

      <div className="connect-network__side">
        <ul className="connect-network__keys" aria-label={t('Who meets whom through Connect', 'Connect மூலம் யார் யாரைச் சந்திக்கிறார்கள்')}>
          {NETWORK_GROUPS.map((g) => (
            <li key={g.id}>
              <button
                type="button"
                className="chip connect-network__key"
                aria-pressed={active === g.id}
                onMouseEnter={() => setActive(g.id)}
                onFocus={() => setActive(g.id)}
                onClick={() => setActive(g.id)}
              >
                <span className={`connect-network__swatch connect-network__swatch--${g.id}`} aria-hidden="true" />
                {label(g)}
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              className="chip connect-network__key connect-network__key--all"
              aria-pressed={active === null}
              onClick={() => setActive(null)}
            >
              {t('Show all', 'அனைத்தையும் காட்டு')}
            </button>
          </li>
        </ul>
        <div className="connect-network__caption" aria-live="polite">
          {group ? (
            <>
              <p className="h5">{label(group)}</p>
              <p className="connect-network__how">{t(group.how, group.howTa)}</p>
              <p className="caption">{t('Meets:', 'சந்திப்பவர்கள்:')} {group.links.map((l) => label(NETWORK_GROUPS.find((x) => x.id === l))).join(', ')}</p>
            </>
          ) : (
            <p className="connect-network__how muted">{t(
              'Hover, tap or tab to a group to see who it meets, and where. Choose “Show all” to reset.',
              'ஒரு குழு யாரை, எங்கே சந்திக்கிறது என்று பார்க்க அதன் மீது சுட்டியை வையுங்கள், தட்டுங்கள் அல்லது Tab மூலம் செல்லுங்கள். மீட்டமைக்க “அனைத்தையும் காட்டு” என்பதைத் தேர்ந்தெடுங்கள்.'
            )}</p>
          )}
        </div>
      </div>
    </div>
  );
}
