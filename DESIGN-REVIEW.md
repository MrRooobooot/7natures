# SVN group: design review and fix list

Scope: root hub (`index.html`, `assets/svn/hub.css`), SeveNatures (`sevenatures/`), SVN Studio (`svn-studio/`), Mojy (`mojy/`).
Method: lead visual check in browser (desktop and phone) + three read-only code audits (accessibility, tokens, responsive, states).
Palette and type values are working values, not official brand specs.

Status key: **FIX** = verified and to be fixed. **VERIFY** = to check in the browser before changing. **DECIDE** = needs the owner.

## Hub (root)
- FIX: header title reads "SeveNatures" while the kicker says "SVN · Brand Group". Owner decision: group name in title (DECIDE).
- FIX: card hover lift and identity strip were checked; keep.

## SeveNatures (`sevenatures/`)
- FIX (high): work-card and feature hover lift never applies. `.reveal.is-visible{transform:none}` (style.css:670) overrides `.work-card:hover` (style.css:459) with equal specificity. Use the `translate` property for hover lift.
- FIX (med): every YouTube link is `href="#"` in the markup and only gets its real URL from JS (main.js:14-16). Put the real URL `https://www.youtube.com/@SeveNatures` directly in each href.
- FIX (med): English titles and tags inside Persian cards have no `lang`/`dir` in markup (index.html:163-201). Add `lang="en" dir="ltr"`.
- FIX (med): hero video and zoom auto-move with no pause control (WCAG 2.2.2). Add a visible pause button (aria-pressed) that stops the video loop and the zoom.
- FIX (med): `body{overflow-x:hidden}` hides overflow instead of fixing it (style.css:73). Remove and fix the overflowing element.
- FIX (low): Escape calls focus on the toggle even when the menu is closed (main.js:44-46). Only act when open.
- FIX (low): aria-label on the menu toggle flips with aria-expanded. Keep it constant.
- FIX (low): `.btn:active` is overridden by the hover rule (style.css:147-149). Move it below the hover media block.
- FIX (low): hover-only affordances need `:focus-visible` equivalents (nav, work-card, work-play, footer, to-top).
- FIX (low): `.feature` lifts on hover but is not clickable. Remove the lift.
- FIX (low): `target="_blank"` links need an accessible "opens in a new tab" hint.
- FIX (low): about-badge padding is physical (style.css:433); use logical padding.
- FIX (low): body text uses weight 300 at small sizes (style.css:126, 313, 512). Use 400 for paragraphs.
- FIX (low): work-tag at 0.72rem is smaller than the `--fs-xs` token. Use the token.
- FIX (low): hard-coded colours, radii and durations bypass :root tokens. Add tokens and reference them.
- FIX (low): dead custom properties `--surface-strong`, `--accent-2`, `--warm`. Delete.
- FIX (low): mixed Latin and Persian numerals (strip, timeline, footer year). Use one system.
- FIX (low): `--fs-base` is overridden to 16px below 760px (style.css:691). Set the token instead.
- VERIFY: hero text contrast over bright video frames. Raise overlay behind text column to about 0.85 if the brightest frame reduces contrast.
- VERIFY: desktop nav at 761-900px may not fit in the 72px header. Test at 761, 800 and 900px.
- VERIFY: breakpoint mismatch: JS switches to the 960px clips below 900px while CSS switches layout at 760px. Use one shared breakpoint.
- VERIFY: `.to-top` may cover text on very narrow screens.

## SVN Studio (`svn-studio/`)
- FIX (high): the only contact action is an `href="#"` Instagram placeholder. Label it as a placeholder in visible text and remove the dead href (render as a non-link with "به زودی").
- FIX (med): focus outline against the ink header is low contrast. Use the pastel for focus outline on dark surfaces.
- FIX (med): "SVN Studio" in Persian copy is not wrapped in `dir="ltr" lang="en"` consistently (index.html:19-20 do, line 28 does not). Wrap every instance, including footer.
- FIX (med): hard-coded `#fff` card surface has no token. Add a documented surface token.
- FIX (low): portfolio tiles labelled "پروژه ۱..۶" read like real projects. Rename to clearly placeholder labels and tie the note to the list with aria-describedby.
- FIX (low): `role="list"` on lists where list-style is removed (Safari VoiceOver).
- FIX (low): `.back:focus-visible` needs the same underline as hover.
- FIX (low): hard-coded radii and focus width. Add tokens.
- FIX (low): repeated magic sizes and paddings. Add scale tokens.
- FIX (low): grid tracks use bare `1fr`. Use `minmax(0,1fr)`.
- FIX (low): dead reduced-motion block and dead `position:relative` on `.tile`. Remove.
- FIX (low): `.lead` line-height 2 overrides the body value. Use a shared token.
- DECIDE: unconfirmed business claims in the copy (tutorials, brand collaborations, process details). Owner to confirm or soften.
- VERIFY: back-link arrow direction in RTL (point the arrow in the reading direction).

## Mojy (`mojy/`)
- FIX (high): Persian section heading "ایده‌ها" has `letter-spacing: 0.2em` (mojy.css:136-139), which breaks Persian letter joining. Remove tracking from Persian text; keep tracking only on Latin spans.
- FIX (high): hero focus outline is pastel on purple-soft, about 1.35:1 (mojy.css:79-81). Remove the hero override so the global accent outline applies.
- FIX (med): "دنبال کردن در اینستاگرام" is an `href="#"` placeholder that reads as live. Label it as a placeholder or hide it until the URL exists.
- FIX (med): the quote has no source. Label it as the owner's own wording or as a placeholder. Do not present an unsourced quote as known.
- FIX (low): `.subline` applies uppercase and tracking to the whole element. Scope it to Latin spans only.
- FIX (low): back link has no persistent underline and a small hit area. Add a persistent underline and vertical padding.
- FIX (low): arrow inside the link text is announced by screen readers. Wrap it in `aria-hidden`.
- FIX (low): dead `col--1` class and redundant `-webkit-text-size-adjust`. Remove.
- FIX (low): repeated spacing and size literals. Add scale tokens.
- FIX (low): grid uses bare `1fr`. Use `minmax(0,1fr)`.
- FIX (low): gradient `left bottom` position. Use logical or plain bottom.
- FIX (low): the places strip is labelled "مکان‌ها و سفر" but contains "روزمره". Rename the label to match.
- DECIDE: the copy promises artworks but the page has no samples. Add a labelled placeholder for samples, or soften the copy.
- VERIFY: wordmark descender clearance at 1280 and 1440px. The fixed rem gap may need an em-based value.
- VERIFY: `.col-t` line-height 1.4 may clip Persian ascenders. Raise to about 1.6.
