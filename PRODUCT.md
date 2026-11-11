# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React + TypeScript PWA, mobile-first and installable. Data is local-only in IndexedDB. Confirmed by the user.

## Users

Artists of any discipline (illustrators, painters, designers, photographers) who get stuck and want a small daily push. They use it in short sessions, mostly on a phone, often at a desk or in a studio with a sketchbook nearby.

## Product Purpose

Decluttered gives artists four new words a day, one each from color, movie, object and place. Each word is a random Wikipedia article title. The artist writes down the ideas the words spark and adds photos or sketches. A daily streak and a calendar archive reward showing up. Success is a habit: opening it every day and ending with a saved entry.

## Positioning

A prompt generator, a journal and a visual archive in one place. The words are pulled from Wikipedia, so they are unpredictable and wide-ranging, and each day's entry holds the words, the writing and the images together.

## Operating Context

- One entry per calendar day, in local time.
- Each day shows 4 words (color, movie, object, place), the same for every user on a given date.
- An entry can hold text, photos and drawings made in a built-in sketch canvas.
- Screens, from the user's wireframes in `Decluttered.pdf`: Login, Home (keywords, quick writing box, Add image / Add sketch / Save), Journal (detailed writing with a photo section), Photos (gallery with Add), Archive (monthly calendar with entry thumbnails). A User tab was added.
- Bottom navigation: Home, Journal, Archive, User.

## Capabilities and Constraints

- Local-only for now. "Login" is a local profile (name + PIN) with no server. Cloud sync is undecided and out of scope.
- Words come from a build-time pool pulled from the Wikipedia API (not scraped), then picked deterministically by date. The app makes no runtime network calls for words.
- Works offline once loaded.
- The wireframes are the structural reference. The user asked for better usability and looks while staying close to their structure.
- Name: Decluttered. The login headline is "Artblock? Never exists. Record, write, create."

## Brand Commitments

- Name "Decluttered" and the headline above, from the user's wireframe.
- The user chose a warm sketchbook look: cream paper, ink-black type, one bold accent, serif display type.
- Design approach: the impeccable skill plus Emil Kowalski's design-engineering rules for motion and polish.

## Evidence on Hand

- `Decluttered.pdf`: five mobile wireframes with notes. There are no real brand assets (the logo is a placeholder circle), no user content, no analytics.

## Product Principles

1. Lower the cost of starting. Opening the app should put the user within one tap of writing.
2. The words are the spark and the user's work is the point. The interface stays quiet around writing and images.
3. Make the daily habit feel good, never guilty. Show the streak and celebrate saving, but don't punish a missed day.
4. Every entry is a keepsake. The archive should be pleasant to browse and the data easy to export.

## Accessibility & Inclusion

No specific standard was stated. Target WCAG AA contrast, 44px touch targets, keyboard-usable controls, reduced-motion support, and text that stays readable at large font sizes.
