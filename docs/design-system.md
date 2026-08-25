# StartNet — Design System

**Version 1.0 · Masterbrand · August 2026**

This is the written half of the system. The working half is the site itself, and
the live specimen page at **[/design-system](../design-system.html)**, which
renders from the same tokens and components every other page uses. Where the two
disagree, the live page is correct and this document is out of date.

---

## 1. The idea

StartNet is not a sixth product. It is the entity that stands behind five
independently branded, independently credible properties. The design system
exists to make that relationship legible in about fifteen seconds.

Three consequences follow, and every decision below traces back to one of them:

1. **The parent must read calmer than any of its children.** More whitespace,
   less colour, slower motion. If a choice is between more interesting and more
   credible, take credible.
2. **The five sub-brands are guests here.** Each gets exactly one visual cue — a
   swatch dot. Nothing else of their identity is allowed onto this page.
3. **Nothing on the page may outrank the evidence.** Numbers carry their sources.
   Claims that cannot be sourced are cut rather than softened.

---

## 2. The Dot

> The StartNet wordmark ends in a red dot. That dot is the whole identity system.

A full stop is a claim of finality — it ends a sentence someone is prepared to
stand behind. It is also the smallest possible mark, which means it can be
multiplied, arranged and animated without ever being distorted. A circle has no
wrong angle.

### 2.1 The six states

Every ring, arc and node on the site is the same element in one of six states.
They are not six graphics; they are one set of marks described by four numbers,
which is why any state can morph into any other.

| State | What it looks like | What it means |
|---|---|---|
| `mark` | one dot | identity at rest |
| `path` | evenly spaced dots | a journey with steps |
| `signal` | dots graded large → small | momentum, decay, direction |
| `measure` | dots stretched into ticks | evidence, the numbers |
| `orbit` | marks fused into one stroke | infrastructure |
| `network` | concentric lanes | one system on more than one level |

Each mark is a rounded rectangle carrying four values:

| Value | Meaning |
|---|---|
| `w` | tangential width — along the arc |
| `h` | radial height — across the arc |
| `dr` | radial offset — which concentric lane it sits in |
| `op` | opacity |

A dot is `w = h`. A tick is `h ≫ w`. A solid arc is `w =` the segment length plus
its own cap diameter. A hairline lane is a long, thin mark on a non-zero `dr`.
Morphing between any two states is a straight interpolation of four numbers,
which is why it stays smooth on a phone.

Implementation: [`assets/js/dot-system.js`](../assets/js/dot-system.js).

### 2.2 Rules for the ring

- **A ring is always cropped by a section edge.** Never fully contained. A
  masterbrand should imply a system larger than the frame it is shown in.
- **One ring per section.** Two rings compete and neither means anything.
- **Rotation never exceeds 0.6°/second.** Slow reads as expensive; fast reads
  as a loading spinner.
- **A ring may bleed off the page. It may never sit under running text.** On
  narrow screens the section grows a band underneath the copy and the ring
  lives there.
- **Rings pause when off-screen** and freeze entirely under
  `prefers-reduced-motion`, settling on `orbit`.

### 2.3 The brand full stop

`[.]` in any headline renders the full stop as a true circle in Signal red — the
same period that ends the wordmark. It stays real text, so it is still read
aloud as punctuation.

Diameter is 0.215em, sitting on the baseline: the same proportion the dot has to
the cap height in the master artwork.

**One per screen.** It is the brand signing the sentence, so it belongs only at
the end of a statement the company is prepared to own.

### 2.4 Do and don't

| Do | Don't |
|---|---|
| Let the dot travel — eyebrow bullet, card swatch, journey node, ring mark | Re-tint the dot to a property colour |
| Keep it a perfect circle at every size | Stretch it, outline it, gradient it, rotate it |
| Use one brand stop per screen | Put a second stop in the same headline |

---

## 3. Colour

Two brand constants, sampled directly from the master logo artwork.

| Token | Value | Role |
|---|---|---|
| `--sn-ink` | `#000000` | brand black — the wordmark |
| `--sn-signal` | `#CC3029` | brand red — the dot |

Signal red is an **accent, never a surface**. The moment it becomes a background
it stops meaning "here". Its only large-format appearance is as a ring, where it
is a drawn mark rather than a fill.

### 3.1 Neutrals

A warm-neutral ramp, so paper reads as paper rather than as screen.
`--sn-neutral-025` through `--sn-neutral-950`; see
[`assets/css/tokens.css`](../assets/css/tokens.css).

`--sn-neutral-500` (`#6D6D64`) is the lightest neutral permitted on text. It is
set precisely at the point where 12px type still clears WCAG AA against the
paper surface.

### 3.2 Portfolio swatches

One restrained cue per property, all at roughly equal chroma so no property
shouts louder than another.

| Property | Token | Value |
|---|---|---|
| AI Flywheel | `--sn-prop-flywheel` | `#C4801F` amber |
| Nooru.AI | `--sn-prop-nooru` | `#1F7A63` jade |
| Agentic AI Connect | `--sn-prop-agentic` | `#2F5BD0` blue |
| Physical AI Connect | `--sn-prop-physical` | `#9B2C63` magenta |
| SNX | `--sn-prop-snx` | `#4B3FA8` indigo |

**Permitted uses:** a dot, a 3px hairline on that property's own card, a hover
wash on that card, a node on the journey line, a segment of the spectrum
hairline between sections.

**Not permitted:** a section fill, a button, a headline, or any surface. Five
sub-brands must not be able to repaint the parent.

### 3.3 Surfaces

Three contexts, switched with a `data-theme` attribute on any element. Components
never branch on theme — they read the semantic token and the token re-points.

| Context | Surface | Use |
|---|---|---|
| default | `#FFFFFF` | most sections |
| `data-theme="paper"` | `#F6F6F4` | the band between two white sections |
| `data-theme="dark"` | `#0A0A0A` | the ecosystem story, the footer, event promotion |

---

## 4. Typography

Two families, three voices.

| Voice | Family | Job |
|---|---|---|
| Structure | **Archivo** | authority, everything functional |
| Editorial | **Instrument Serif** italic | the human aside |
| Micro | Archivo, 11–12px, `0.09em` | labels, eyebrows, data |

### 4.1 The accent

The signature move: a serif italic phrase set inside a sans headline. Written as
braces in the source — `accent('Five doors. {One ecosystem}[.]')`.

- **At most one accent phrase per headline**, on the words that carry the idea.
  Two accents in one line cancel each other and the sentence loses its centre of
  gravity.
- The serif runs optically smaller and sits slightly high, so it is compensated
  once in `.accent` (`1.1em`) rather than by eye at each call site.
- Keep the accent short. A whole clause in italic serif stops being an accent
  and becomes a second typeface.

### 4.2 Scale

Fluid; the minimum is the 360px value and the maximum the ~976px value.

| Token | Range |
|---|---|
| `--text-display-1` | 40 → 76px |
| `--text-display-2` | 34 → 60px |
| `--text-title-1` | 28 → 44px |
| `--text-title-2` | 24 → 34px |
| `--text-title-3` | 20 → 26px |
| `--text-lead` | 17 → 21px |
| `--text-body` | 16px / 1.62 |
| `--text-small` | 14px |
| `--text-micro` | 12px |
| `--text-nano` | 11px |

Display tracking is `-0.032em`. Large sans needs to be pulled in tight; micro
labels open up to `0.09em` or `0.16em`.

---

## 5. Layout

| Token | Value |
|---|---|
| `--layout-max` | 1440px |
| `--layout-inset` | `clamp(1.25rem, 0.4rem + 4vw, 5.5rem)` |
| `--layout-gutter` | `clamp(1rem, 0.5rem + 1.6vw, 2rem)` |
| `--space-section` | `clamp(4.5rem, 2.5rem + 8vw, 10rem)` |

Space runs on a 4px base unit, `--space-1` … `--space-32`.

**The canonical section head** is a two-column split: eyebrow + headline on the
left, editorial deck + call to action on the right. The eye always knows where
the claim ends and the invitation begins.

---

## 6. Components

Full specimens on the [live page](../design-system.html). Source:
[`src/lib/ui.js`](../src/lib/ui.js) for markup,
[`assets/css/components.css`](../assets/css/components.css) for style.

### Button

A pill and a **detached** circular arrow badge. The gap between the two halves
closes on hover and the badge rotates 45°. A masterbrand's whole job is routing
people onward; the button should look like it is already going.

Variants: `primary`, `accent`, `inverse`, `ghost`. Sizes: `md`, `sm`.

### Eyebrow

A pill carrying the brand dot at its smallest working scale. This is the
section's name badge, not a heading — it never replaces one.

### Property card

A window into a sub-brand, not a transplant of it. Carries the canonical
one-line description verbatim, a swatch dot, a 3px top rule that grows on hover,
and a single outbound call to action.

### The Orbit

Five dots on one ring; the active one opens into the centre. This is the
component that carries the strategic argument — that the five are one system,
not five links — and it does it with the brand's own atomic element rather than
a stock carousel.

The markup is complete and readable before JavaScript runs: all five names,
descriptions and outbound links sit in the DOM as a plain list. That list is
what search and answer engines index; the ring only enhances it.

### Stat

A figure, a label, and its **source**. The source line is not optional — it is
the component's reason for existing.

---

## 7. Motion

| Token | Value |
|---|---|
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` — the house curve |
| `--duration-fast` | 180ms |
| `--duration-base` | 320ms |
| `--duration-reveal` | 900ms |
| `--dot-cycle` | 3600ms |
| `--dot-rotation` | 150s per revolution |

**Motion is decoration, never information.** Nothing on this site requires an
animation to be understood. Under `prefers-reduced-motion` every duration
collapses to 1ms, reveals resolve immediately, counters print their final
figure, and rings settle on `orbit`. The page reads identically.

Elements reveal **once** and are then unobserved. Content that re-animates on
every scroll pass reads as decoration, and this page is asking to be believed.

---

## 8. Accessibility

- One `<h1>` per page; heading order never skips.
- Focus is visible, branded Signal red, and never removed.
- All body text meets WCAG AA; `--sn-neutral-500` is calibrated to the AA floor
  on the paper surface at 12px.
- The mobile overlay is a real modal: focus trap, `Escape` to close, scroll lock,
  and the burger stays above it as the close control.
- The Orbit is a `tablist` with roving `tabindex` and arrow-key navigation;
  autoplay pauses on hover and on focus.
- Filters announce their result count through `role="status"`.
- Every enhancement is additive — the site is complete, readable and navigable
  with JavaScript disabled.

---

## 9. Governance

Carried over from the masterbrand strategy and enforced in code:

1. **The canonical property line lives in exactly one place** —
   `line` in [`src/data/site.js`](../src/data/site.js). It is rendered verbatim
   in the nav dropdown, the homepage grid, the footer directory and the
   portfolio page. It is never re-worded per context. It is also published
   machine-readably at `/portfolio.json`.
2. **Proof rows carry a `verified` flag.** A row that is not verified is not
   rendered. There is no code path that prints an unsourced number.
3. **The flagship-event module changes state on a date range**, not a manual
   edit — see `nextEvent.windowDays`. Inside the window it expands and moves
   above "Who this is for".
4. **Outbound clicks are instrumented from day one**
   ([`assets/js/telemetry.js`](../assets/js/telemetry.js)). Routing people to
   the right door is this site's primary success metric, so every portfolio
   click emits the property, the domain and the surface that produced it.
5. **The parent site never gets ahead of the sub-brands.** If a claim cannot be
   verified against that property's own reporting, it does not go up.

---

## 10. Deliberately absent

No logins. No dashboards. No registration flows, course catalogues or cohort
applications. Every transactional action routes **out** to the property that
owns it. The parent site must never let a visitor start a journey and abandon
it here.
