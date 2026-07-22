# MUSE Shopify Theme — Context Handoff

_Last updated: 2026-07-22. Paste this into a new chat to continue without rework._

## Project in one line
Building a Shopify Online Store 2.0 theme ("MT-MUSE") that recreates the MUSE RTD
Cocktails static site, deployed to Shopify via GitHub two-way sync.

## ✅ BIGGEST WIN THIS SESSION — blank Theme settings gear is FIXED
- **Symptom:** the gear (Theme settings) rendered blank in the Shopify editor, even
  though it worked on other themes and on cart/checkout. No 4xx/5xx in DevTools.
- **Root cause (found via `shopify theme check`):** in `config/settings_schema.json`
  the `theme_info` block had `"theme_documentation_url": ""` and
  `"theme_support_url": ""`. **Empty strings are invalid URIs.** When `theme_info`
  fails validation, Shopify refuses to parse the WHOLE schema → blank panel.
- **Fix:** set both to `"https://muse-rtd.com"` (any valid URI, or omit the fields).
- **Status:** pushed to `MUSE-00-Shopify_Theme` (live/Shopify-connected) and
  `claude/pensive-brahmagupta-j15urg`. Re-run of theme-check confirms error gone.
- **⏳ AWAITING USER CONFIRMATION** that reloading the editor now shows the gear
  populated (Brand / Typography / Coming soon groups). If still blank, re-run
  `shopify theme check` — there may be a second schema offense.

## Key tools/knowledge unlocked
- **`shopify theme check` works in the sandbox** (CLI v4.5.2 installed globally via
  `npm install -g @shopify/cli@latest`; Node v22.22.2). It's a STATIC validator —
  no store/login needed. Run it from the theme root. This is THE debugging tool.
- The CLI needs the **whole theme folder** (layout/, templates/, sections/,
  snippets/, config/, locales/, assets/) — not a subset.

## Branch / repo layout (IMPORTANT — two different structures!)
- Repo: `yssibala/mtm1t1`
- **`MUSE-00-Shopify_Theme`** = the branch Shopify syncs to (LIVE). Theme files are
  at the **repo ROOT** (config/, sections/, ... directly).
- **`claude/opti-path-m16926`** = dev branch. Theme is under
  **`mt-muse-shopify-theme/`** subdirectory.
- **`claude/pensive-brahmagupta-j15urg`** = the "designated" branch per task
  instructions (kept in sync with opti-path).
- ⚠️ The two branches have **diverged structurally** (root vs subdir, and MUSE-00
  deleted the old static index.html/services.html). A plain `git merge` between them
  CONFLICTS. To port a fix, apply it to each branch's own path separately (that's
  what was done for the gear fix). Do NOT try to merge them wholesale.

## Workflow gotchas
- **Push identity:** must be `Claude <noreply@anthropic.com>`. Set with
  `git config user.email noreply@anthropic.com && git config user.name Claude`
  BEFORE committing, or a stop-hook flags "Unverified" and you must
  `git commit --amend --no-edit --reset-author`.
- **Push auth (403 fix):** `git remote set-url origin https://yssibala:<PAT>@github.com/yssibala/mtm1t1.git`
  PAT: provided separately in-session — use ONLY in the remote URL, NEVER commit it
  (GitHub push protection will block any commit containing a `ghp_...` token).
- **Shopify write-back bot** commits to MUSE-00 (adds `/* auto-generated */` JSONC
  headers). Before pushing MUSE-00, `git pull --rebase origin MUSE-00-Shopify_Theme`.
  **NEVER clobber Shopify write-back files:** `config/settings_data.json`,
  `templates/index.json`, and the user's page templates (page.about-us,
  page.account-page, page.error-404, page.gallery-2, page.product-spec-page,
  page.shop-page).
- Do NOT open a PR unless explicitly asked.

## Schema rules learned the hard way (avoid these = avoid blank gear)
- `select` option `value` must NOT contain quotes or commas → that's why font stacks
  were moved into the `font-stack.liquid` snippet keyed by plain words
  (site/display/text/ogg).
- `range`: integer min/max/step AND (max-min)/step ≤ ~101 steps.
- `theme_info` URLs must be valid URIs or omitted (the bug above).
- `settings_schema.json` top-level is an array; first element is `theme_info`.

## Features already built & shipped this session
- **Hero (`sections/hero.liquid`):** image group (add/position below/left/right/
  background, focal via object-position, height, radius, opacity); split-grid layout.
- **Footer (`sections/footer.liquid`):** `brand_align` (left/center/right) so tagline
  lines up with company name; optional nav "menu bar" (`show_nav` + `nav_menu`
  link_list + `nav_align`).
- **All sections:** text vertical spacing controls (`space_preheader`,
  `space_heading` ranges 0-80) in a "Text spacing" group; button icon moved to the
  RIGHT of the label; button size options (via `pill-button.liquid` `size` param,
  em-based padding so whole pill scales). Applies to flexible, body-section.
- Section min/max height already existed via `min_height` in `section-style.liquid`.

## Key snippets (behavior)
- `section-style.liquid` — inline style for section wrapper (bg solid/gradient/image,
  min-height, padding). Kept deliberately simple.
- `font-stack.liquid` — maps key → CSS font-family (dodges select-value quote/comma ban).
- `pill-button.liquid` — single/dual pill; icon AFTER label; `size` sets inline
  font-size px with em padding.

## Remaining / optional TODO (non-blocking)
`shopify theme check` reported 32 offenses; only the gear one blocked anything.
Leftovers (cosmetic/perf, user hasn't decided yet):
- `ImgWidthAndHeight` (~most errors): add explicit width/height to `<img>` tags.
- `ParserBlockingScript`: add `defer` to `theme.js` load in layout/theme.liquid.
- `RemoteAsset`/`AssetPreload`: Typekit/Adobe Fonts links — expected, intentional.
- (If gear confirmed working) optionally re-add vertical-centering control
  (`content_valign`) the safe CSS way.
- Possibly extend text-spacing to fixed sections (hero, gallery-row) if user confirms.

## Immediate next step in new chat
1. Ask user: did the gear populate after reloading the editor?
2. If yes → offer the ImgWidthAndHeight / defer cleanup pass.
3. If no → run `shopify theme check` from theme root again, look for another
   schema/JSON offense.
