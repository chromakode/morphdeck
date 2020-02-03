# Morphdeck [WIP]

Morphdeck turns SVGs into animated web presentations.

Features:

* Animated slide transitions
* Speaker view with notes, next slide preview, and timer
* Design slides using your favorite SVG illustration tool. WYSIWYG!
* Enhance and generate slides using code.
* Deploy and share your deck easily with a single self-contained html file.
* Zero configuration


## 🚧 WIP

Morphdeck is currently a work-in-progress. Most of its features are complete, but it's possible there may be breaking changes to parameters in the future.


## Developing a deck

The easiest way to run morphdeck is using `npx`. For a list of commands and arguments, run:

```
npx morphdeck --help
```

Morphdeck provides a live-reloading webserver for previewing your deck. To start, launch `morphdeck`:

```
npx morphdeck <your-deck.svg> [optional-deck.js]
```

The first line of output will include the host and port morphdeck is running on, e.g.:

```
ℹ ｢wds｣: Project is running at http://node-dev-2018.local:5000/
```


## Exporting your deck as HTML

Morphdeck can build a self-contained HTML version of your deck. Run:

```
npx morphdeck build <your-deck.svg> [optional-deck.js]
```

Morphdeck will output a file with the same name as your SVG (e.g. "your-deck.html").


## Animations

Morphdeck uses annotations in your SVG data to determine if an element of a slide is the same as on a following slide.

To animate an SVG element from one position to another, give it a unique `data-key` attribute and use it consistently across slides. Upon slide transition, Morphdeck uses CSS transitions to animate any elements which have a consistent key across slides.


## Adding JavaScript to a deck

WIP! Example:

```
import deck from 'deck.svg'
import {present} from 'svg-morph-deck'

import RobotoMedium from './Roboto-Medium.woff'

// You can add custom CSS, or embed fonts:
const css = `
@font-face {
  font-family: "Roboto";
  font-weight: normal;
  src: url(${RobotoMedium}) format("woff");
}
`

function* generateSlides(slides) {
  for (const slide of slides) {
    if (slide.svg.getAttribute('data-key') === 'my-slide') {
      // Manipulate slide.svg here.
    }
    yield slide
  }
}

present(deck, {
  css,
  generateSlides,
})

```
