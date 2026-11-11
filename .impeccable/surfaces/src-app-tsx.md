---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Surface brief: Decluttered app (all screens)

Visitor mode: Operate. A daily-use journal where the user completes one task: read today's four words, write, add an image or sketch, save.

Audience and job: artists who feel stuck; short phone sessions at a desk or in a studio. Constraints: local-only data, offline, mobile-first PWA, wireframes in Decluttered.pdf are the structural reference.

Direction source: pinned by the user ("warm sketchbook": cream paper, ink type, one bold accent, serif display). The direction roll was not run because a brief-pinned direction beats the roll. Material translation: the accent is fountain-pen cobalt, not the common terracotta, and the display face is Young Serif rather than a default serif.

## Direction contract

THESIS: A paper sketchbook that hands you four torn tags each morning. The one idea this surface owns is the word tag: tappable, paper-stock colored, and it turns to ink once you have used the word. It refuses the category default of grey cards, a hero metric, and a chat-style editor.

OWN-WORLD: Warm cream paper (oklch 96.5% .02 85), blue-black ink (oklch 22% .04 265), one cobalt accent (oklch 47% .2 268) for actions and the active tab, a single warm flame color reserved for the streak. Four soft paper-stock tag colors (rose, butter, sage, sky) used only on word tags. Young Serif for words, headings and the wordmark; Hanken Grotesk for everything else. Tags are slightly tilted with a cut, folded corner; cards have layered soft shadows; sketch paper is #fbf8f1.

STORY: The user opens the app and knows in one glance what today's four words are, taps a tag to drop it into their writing, writes, adds a photo or sketch, presses Save, and sees the streak tick up. Later they browse a calendar of thumbnails.

FIRST VIEWPORT: Home at 390x844. Top bar with the logo and wordmark left, streak pill right. "Today's words" in 28px serif with the date beneath. A 2x2 grid of word tags (about 76px tall). Below it a writing card with an expand icon, then the media strip when there is one, then Add image / Add sketch and a full-width primary Save pinned above the bottom nav. Bottom nav: Home, Journal, Archive, User.

FORM: A working journaling app in its category's familiar shell: bottom tab bar, single-column editor, month grid calendar. Position 1 on the pinned list (user-chosen). seed: none (direction pinned by the user, no roll run)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
- Dark theme not built; the scene is daylight or lamplight desk work.
- Logo is a placeholder mark drawn for this build (scribble that resolves into a line), not an approved brand asset.
