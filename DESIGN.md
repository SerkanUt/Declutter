---
name: Decluttered
description: A warm paper sketchbook that hands artists four word tags a day, in fountain-pen cobalt and blue-black ink.
colors:
  paper: "oklch(96.5% 0.02 85)"
  paper-deep: "oklch(92.5% 0.026 82)"
  card: "oklch(98.8% 0.01 85)"
  line: "oklch(86% 0.024 82)"
  ink: "oklch(22% 0.04 265)"
  ink-soft: "oklch(40% 0.035 265)"
  ink-faint: "oklch(49% 0.03 265)"
  cobalt: "oklch(47% 0.2 268)"
  cobalt-press: "oklch(41% 0.2 268)"
  cobalt-wash: "oklch(92% 0.045 268)"
  on-cobalt: "oklch(98% 0.012 85)"
  flame: "oklch(62% 0.19 42)"
  tag-rose: "oklch(88% 0.075 12)"
  tag-butter: "oklch(91% 0.1 92)"
  tag-sage: "oklch(89% 0.07 150)"
  tag-sky: "oklch(89% 0.055 235)"
  danger: "oklch(48% 0.19 28)"
typography:
  display:
    fontFamily: "'Young Serif', Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2.1rem, 9.5vw, 2.6rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Young Serif', Georgia, 'Times New Roman', serif"
    fontSize: "1.75rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "'Young Serif', Georgia, 'Times New Roman', serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.15
  body:
    fontFamily: "'Hanken Grotesk Variable', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  writing:
    fontFamily: "'Hanken Grotesk Variable', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Hanken Grotesk Variable', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.5
  caption:
    fontFamily: "'Hanken Grotesk Variable', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.5
rounded:
  day: "10px"
  sm: "12px"
  control: "14px"
  md: "16px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  gutter: "20px"
  nav-height: "76px"
components:
  button-primary:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.on-cobalt}"
    rounded: "{rounded.control}"
    height: "48px"
    padding: "0 18px"
  button-primary-hover:
    backgroundColor: "{colors.cobalt-press}"
  button-soft:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "48px"
    padding: "0 18px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.cobalt}"
    rounded: "{rounded.control}"
    height: "48px"
  word-tag:
    backgroundColor: "{colors.tag-butter}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "76px"
    padding: "14px 14px 12px"
  word-tag-used:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  writing-surface:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px"
  text-field:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "52px"
    padding: "0 16px"
  streak-pill:
    backgroundColor: "{colors.card}"
    textColor: "{colors.flame}"
    rounded: "{rounded.pill}"
    height: "36px"
  nav-tab-active:
    backgroundColor: "{colors.cobalt-wash}"
    textColor: "{colors.cobalt}"
    rounded: "{rounded.pill}"
    width: "56px"
    height: "32px"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
---

# Design System: Decluttered

## Overview

**Creative North Star: "The Torn-Tag Sketchbook"**

A sheet of warm cream paper that hands you four paper tags each morning. Everything else is quiet stationery: blue-black ink for type, one fountain-pen cobalt for actions, soft cards with layered shadows, a faint paper grain. The single idea the system owns is the word tag; it is tappable, paper-stock colored, and turns to ink once the word is used.

The system is calm, tactile and small-handed. It is built for short phone sessions: one column, big touch targets, no dashboards or metrics competing with the writing box. The category's familiar shell (bottom tab bar, single-column editor, month-grid calendar) is kept on purpose; the personality lives in material, type and the tag.

**Key Characteristics:**
- Warm cream paper tinted toward the ink's blue, never flat grey; paper grain via a generated SVG noise tile (no raster files).
- One cobalt accent for actions and the active tab; the streak flame is the only warm color.
- Young Serif for words, headings and wordmark; Hanken Grotesk for everything else.
- Four paper-stock tag colors (rose, butter, sage, sky), used only on word tags.
- Layered soft shadows; a 480px phone-width sheet centered on larger screens.
- Light theme only; no dark theme exists.

## Colors

Cream paper and blue-black ink with one cobalt voice and one flame; the pastel tags are the only other chroma.

### Primary
- **Fountain-Pen Cobalt** (oklch(47% 0.2 268)): primary buttons, active tab label, links and ghost buttons, focus ring and caret, today's calendar outline, the avatar and logo disc. Pressed state is Cobalt Press (oklch(41% 0.2 268)); tinted fills (selected icon button, done calendar day, active tab pill, focus halo) use Cobalt Wash (oklch(92% 0.045 268)). Text on cobalt is Warm White (oklch(98% 0.012 85)).

### Secondary
- **Streak Flame** (oklch(62% 0.19 42)): the streak pill's flame and count only when the streak is lit. Nothing else is warm-saturated.

### Tertiary
- **Tag Rose** (oklch(88% 0.075 12)), **Tag Butter** (oklch(91% 0.1 92)), **Tag Sage** (oklch(89% 0.07 150)), **Tag Sky** (oklch(89% 0.055 235)): color, movie, object and place word tags respectively. They appear on tags and nowhere else.

### Neutral
- **Cream Paper** (oklch(96.5% 0.02 85)): the page sheet and sticky action fade.
- **Deep Paper** (oklch(92.5% 0.026 82)): the body behind the sheet, hover and pressed rows, segmented-control track.
- **Card Stock** (oklch(98.8% 0.01 85)): writing surface, cards, fields, soft buttons.
- **Pencil Line** (oklch(86% 0.024 82)): 1px borders and dividers.
- **Blue-Black Ink** (oklch(22% 0.04 265)): primary text, used tags, toasts.
- **Ink Soft** (oklch(40% 0.035 265)) and **Ink Faint** (oklch(49% 0.03 265)): secondary text; Ink Faint is the floor for placeholders and fine print (4.9:1 on paper).
- **Danger** (oklch(48% 0.19 28)): the only error color; invalid fields, destructive buttons and the delete row.

### Named Rules
**The One Voice Rule.** Cobalt is the only accent. Do not add a second action color.

**The Lone Flame Rule.** The flame hue belongs to the streak. No other element may be warm-saturated.

**The Tags-Only Rule.** Rose, butter, sage and sky exist only on word tags.

## Typography

**Display Font:** Young Serif (with Georgia, Times New Roman, serif)
**Body Font:** Hanken Grotesk Variable (with system-ui, -apple-system, Segoe UI, sans-serif)

**Character:** A sturdy, slightly quirky serif for the things you read as words (the tags, the page titles, your name), against a clean grotesk for everything you operate. Tabular numerals are on globally.

### Hierarchy
- **Display** (400, clamp(2.1rem, 9.5vw, 2.6rem), 1.04, -0.02em): login headline only, with one cobalt-colored phrase.
- **Headline** (400, 1.75rem, 1.1, -0.01em): page and "Today's words" headings, balanced wrap.
- **Title** (400, 1.25rem, 1.15): word on a tag, section heads, wordmark, empty-state titles, profile name.
- **Body** (400, 1rem, 1.5): default UI text; supporting copy at 0.875rem in Ink Soft.
- **Writing** (400, 1.0625rem, 1.6): the textarea; never below 16px so iOS does not zoom. Same 17px for text fields.
- **Label** (600, 0.875rem): field labels, menu rows, toasts.
- **Caption** (600-700, 0.75rem): tab labels, calendar weekday names, legend.

### Named Rules
**The Words Are Serif Rule.** Anything that is a prompt word, heading or identity is Young Serif; anything tappable as an action is Hanken Grotesk.

## Layout

A single column inside a 480px sheet (`max-width: 480px`, centered, with a hairline and shadow only at 520px and wider). Page gutter is 20px; vertical gap between blocks is 20px (14px on short screens). Bottom padding clears a fixed 76px tab bar plus safe-area inset. The Save/action row is sticky above the tab bar with a paper fade behind it. Word tags sit in a 2-column grid (12px gap); photos in a 2-column masonry (12px gap); calendar in a 7-column grid (4px gap). Spacing steps in use: 4, 8, 10, 12, 14, 16, 20.

Responsive behavior is height-led: at `max-height: 760px` the editor's action row collapses to one compact three-column row with short labels, and tags drop to 56px, so the writing box keeps its room. The viewport uses `interactive-widget=resizes-content`, so the keyboard shrinks the layout and nothing shifts on focus. Touch targets are 40px minimum (48px for primary buttons, 44px for icon buttons).

## Elevation & Depth

Hybrid: paper layering plus soft, warm-tinted shadows. Surfaces are lifted a hair off the page by 1px borders and a layered offset-plus-blur shadow tinted toward warm brown (never black, never a hard offset). Tags use stacked `drop-shadow` filters so the cut corner casts correctly.

### Shadow Vocabulary
- **Rest** (`box-shadow: 0 1px 1px oklch(30% 0.05 80 / 0.06), 0 2px 6px oklch(30% 0.05 80 / 0.06)`): cards, soft and primary buttons, writing surface, streak pill.
- **Float** (`box-shadow: 0 2px 4px oklch(30% 0.05 80 / 0.06), 0 10px 24px oklch(30% 0.05 80 / 0.1)`): the sheet on wide screens, toasts.
- **Tag** (`filter: drop-shadow(0 1px 1px oklch(30% 0.05 80 / 0.12)) drop-shadow(0 4px 8px oklch(30% 0.05 80 / 0.1))`): word tags.
- **Focus halo** (`box-shadow: 0 0 0 3px` in Cobalt Wash) on the writing surface and fields, with border shifting to cobalt.

### Named Rules
**The Paper Material Rule.** Writing surface, calendar and sheet carry the grain tile (`feTurbulence` SVG data URI, 180px, 7% alpha); the writing textarea additionally carries notebook ruling, one line per line box (1.6em), in a pale blue rule that scrolls with the text.

## Shapes

Soft but not bubbly: 16px for large surfaces (writing card, calendar, menu), 14px for buttons, fields and toasts, 12px for thumbnails and list rows, 10px for calendar days, full pill for the streak, tab indicator, segmented control and confirm pills, circles for icon buttons and avatar. Borders are 1px Pencil Line. The signature silhouette is the word tag: a rectangle with its top-right corner cut at 45 degrees (20px, 14px compact) and a darker folded triangle in the cut, each tag tilted by under 1.5 degrees in a fixed per-position pattern.

## Components

### Buttons
- **Shape:** 14px radius, 48px tall (40px small, 52px for Save), 600 weight.
- **Primary:** Cobalt fill, warm-white text, Rest shadow. Hover (fine pointers only) darkens to Cobalt Press.
- **Soft:** Card Stock with Pencil Line border; hover to Deep Paper. Ghost: transparent, cobalt text.
- **Press:** `transform: scale(0.97)` on active (icon buttons 0.92), 160ms on `--ease-out`. Disabled is 45% opacity.
- **Icon buttons:** 44px circle, transparent; selected state is Cobalt Wash with cobalt glyph.

### Word Tag (signature)
The one reused idea. Paper-stock fill by category, 76px tall, serif word at the bottom with a small uppercase category label above it, cut and folded top-right corner, slight tilt. Tapping straightens it (hover lifts 2px, press 0.97) and, once the word is used in the entry, it inverts to Blue-Black Ink with paper-colored text and a lighter fold. Tags enter staggered at 55ms over 380ms (translate 10px, scale 0.96).

### Writing Surface
Card Stock with grain, 16px radius, Rest shadow, notebook ruling inside the textarea, 17px text, 168px minimum height, an expand icon button in the top-right corner. Focus: cobalt border plus 3px Cobalt Wash halo.

### Inputs / Fields
52px tall, 14px radius, Card Stock, Pencil Line border, 17px text, Ink Faint placeholder, 600 label above in Ink Soft. Focus matches the writing surface. Invalid: Danger border and a 600 Danger message beneath.

### Navigation
Fixed four-tab bar (Home, Journal, Archive, User), 76px, translucent paper (94%) with 14px backdrop blur and a top hairline. Tab is a 56x32 pill icon over a 12px label; active is cobalt with a Cobalt Wash pill. Icons are one stroke family (24px grid, 1.75 stroke, round caps) drawn as inline SVG.

### Streak Pill
36px pill, Card Stock, hairline, flame glyph. Unlit is Ink Faint; lit turns flame and count stays ink; done fills the glyph. On increment it bumps to 1.18 scale over 560ms.

### Calendar Day
Square cell, 10px radius, paper fill. Done is Cobalt Wash with cobalt number; today has a 2px cobalt outline; days with images show the thumbnail with a shadowed number; a solid cobalt dot means saved, a ring dot means draft; future days are dashed at 40% opacity.

### Toast and Confirm Pills
Ink pill or 14px-radius toast, paper text, enters from above 10px over 240ms.

### Motion
Strong ease-out `cubic-bezier(0.23, 1, 0.32, 1)` for entrances and presses; `cubic-bezier(0.77, 0, 0.175, 1)` for on-screen moves. Durations 140-240ms for interaction, 380-560ms for the tag entrance and streak bump. Under `prefers-reduced-motion: reduce`, tags fade only (no tilt, no translate), the streak bump stops, toasts fade, and press scaling is removed; fades stay.

## Do's and Don'ts

### Do:
- **Do** keep cobalt (oklch(47% 0.2 268)) as the only action color and use Cobalt Wash for selected and focus fills.
- **Do** reserve the flame hue for the streak and the four pastel tag colors for tags.
- **Do** set prompt words, headings and identity in Young Serif and all operable UI in Hanken Grotesk.
- **Do** give every pressable control a `scale(0.97)` press on the strong ease-out, hover effects gated to `(hover: hover) and (pointer: fine)`.
- **Do** keep text inputs at 17px, touch targets at 40px or more, and placeholder or fine print at Ink Faint or darker.
- **Do** tint shadows warm and layer two of them; carry depth with a 1px Pencil Line border as well.
- **Do** draw icons in the one stroke family (24px grid, 1.75 stroke, round caps) as inline SVG.

### Don't:
- **Don't** add a second accent, a gradient accent, or warm saturation outside the streak.
- **Don't** use grey cards, pure black or white, or a hard offset shadow; paper and ink stay tinted.
- **Don't** introduce a hero metric or a chat-style editor; the writing box is a ruled page.
- **Don't** use a system display face for headings; Georgia is a fallback only.
- **Don't** drive layout from width breakpoints beyond the 480px sheet; compactness follows height (760px).
- **Don't** animate layout properties or let the keyboard cause a layout shift on focus.
