# MUSE Website — Image Guidelines

Guidelines for all images used on the MUSE website (`mt-muse.com`).

---

## Brand Palette Reference

| Role | Hex | Usage |
|---|---|---|
| Background | `#0d0d0d` | Page backgrounds |
| Gold (primary accent) | `#EFA527` | Ambrosia, CTAs, highlights |
| Red | `#cc2200` | Clio, Jubilee accents |
| Purple | `#7b2fbf` | Odyssey accents |
| Light text | `#f5f5f5` | Headings |
| Body text | `#cccccc` | Paragraphs |

---

## File Format & Size

- **Format:** PNG for assets with transparency; JPG/WebP for photos
- **Max file size:** 500 KB for photos, 200 KB for graphics
- **WebP preferred** for gallery photos to improve page load speed
- Lossless PNG for logos, icons, and label artwork

---

## Dimensions by Usage

### Hero / Banner Background
- **Minimum:** 1920 × 1080 px
- **Aspect ratio:** 16:9 or wider
- Must accommodate a dark overlay (`rgba(13,13,13,0.82)`) — avoid pure black subjects in the center-left

### Logo (`MUSE Web Banner Text 2.png`)
- **Displayed at:** height 44 px (navbar)
- **Source file:** minimum 300 px tall, transparent background (PNG)
- Keep adequate padding around the logotype

### About Section (`6 About us (M_F).png`)
- **Minimum:** 800 × 800 px
- Square or portrait orientation preferred
- High contrast subjects work best against the dark site background

### Gallery Images (`7 Gallery 1–12.png`)
- **Minimum:** 800 × 800 px per image
- **Displayed at:** 260 px tall, `object-fit: cover`
- Subjects should be centered; the grid crops to square/landscape
- Hover overlay is `rgba(239, 165, 39, 0.25)` (gold tint) — avoid heavily gold-tinted source photos

### Services Slides (`8 Services slide 1–3.png`)
- **Minimum:** 1200 × 600 px
- Full-width layout — use a wide aspect ratio (2:1 or wider)
- White border appears on hover — ensure image edges are not pure white

### Contact Section Background (`MUSE Website Build bottom.png`)
- **Minimum:** 1920 × 700 px
- A semi-transparent dark overlay (`rgba(13,13,13,0.65)`) is applied — use vivid, high-contrast imagery

---

## Naming Convention

```
[section number] [Descriptive name].[ext]
```

Examples:
- `7 Gallery 1.png`
- `8 Services slide 2.png`
- `6 About us (M_F).png`

Spaces are acceptable; parentheses for variants. Keep filenames consistent with references in HTML.

---

## Alt Text

Every `<img>` tag must include a descriptive `alt` attribute:

- Gallery: `alt="Gallery [number]"` or a brief description of the subject
- Services: `alt="MUSE Services"` with a short descriptor where possible
- About: `alt="MUSE — [section description]"`
- Logo: `alt="MUSE"`

---

## Accessibility & Performance

- Use `loading="lazy"` on gallery images below the fold
- Provide `width` and `height` attributes on images where dimensions are fixed to prevent layout shift
- Gallery images must meet a minimum contrast ratio of 3:1 for any text overlaid on them
- Do not embed text in images that conveys essential information — use HTML text instead

---

## SKU / Product Photography

For individual SKU pages (e.g., `clio.html`):

- **Bottle shots:** minimum 600 × 900 px, transparent PNG background preferred
- **Lifestyle shots:** minimum 1200 × 800 px
- Color temperature should complement the SKU accent color:
  - Clio / Jubilee: warm reds, sunset tones
  - Odyssey: deep blues, purples, evening atmosphere
  - Ambrosia: bright golds, daylight/brunch settings
