# Decluttered

A daily-words journal for artists. Every day you get four words (a color, a movie, an object and a place), pulled from Wikipedia article titles. Write about them, add photos or sketches, save, and keep your streak going.

## Run it

    npm install
    npm run dev      # dev server
    npm run build    # production build
    npm test         # unit tests

`npm run words` rebuilds the word list in `src/data/words.json` from Wikipedia. You only need it if you want fresh words.

## How it works

- Vite, React and TypeScript, installable as a PWA and usable offline.
- Everything is stored on the device in IndexedDB. The "login" is a name and PIN kept locally, there's no server.
- One entry per calendar day. An entry only adds to the streak if you save it on its own day.
- Everyone gets the same four words on the same date. The word list is picked by day number, so nothing is stored.
- Screens: Login, Home, Journal, Photos, Archive (calendar), User. They follow the wireframes in `Decluttered.pdf`.

## Not done yet

Cloud sync, a dark theme, and a proper logo.
