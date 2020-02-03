import Nanocomponent from 'nanocomponent'
import html from 'nanohtml'
import raw from 'nanohtml/raw'

import {getSlides} from './slides'
import MorphDeck from './ui/MorphDeck'
import defaultTransforms from './transforms'

const defaultSelector = 'svg > g'

const defaultStyle = `
body {
  margin: 0;
  font-family: sans-serif;
  font-size: 24px;
  overflow: hidden;
}

#deck {
  width: 100vw;
  height: 100vh;
  background: black;
  display: flex;
}

.no-animations * {
  transition: none !important;
  animation: none !important;
}

.present, .slide-container {
  display: flex;
  width: 100%;
  overflow: hidden;
}

.slide-container > svg {
  height: auto;
  width: 100%;
}

.slide-container > svg [data-key] {
  transition: all .5s ease-in-out;
}

#speaker-view {
  display: flex;
  width: 100%;
  flex-direction: column;
}

#speaker-view main {
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: hidden;
}

#speaker-view .deck {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 75%;
}

#speaker-view .sidebar {
  margin-left: 10px;
  flex: 1;
}

#speaker-view #notes {
  color: white;
  padding: 10px;
  max-width: 35em;
  min-height: 10em;
  flex-shrink: 0;
}

#speaker-view footer {
  display: flex;
  color: white;
  padding: 10px 20px;
  opacity: .75;
}

#speaker-view footer button {
  background: white;
  color: black;
  border: none;
  border-radius: 4px;
  padding: 0 12px;
  font-size: 16px;
}

#speaker-view footer button:active {
  background: #ccc;
}

#speaker-view footer .left {
  display: flex;
}

#speaker-view footer .right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}
`

function defaultSortSlides(slides) {
  return slides.reverse()
}

function present(svg, {
  selector = defaultSelector,
  generateSlides,
  sortSlides = defaultSortSlides,
  transforms = defaultTransforms,
  css = '',
} = {}) {
  const styleEl = html`<style>${raw(css + defaultStyle)}</style>`
  document.body.appendChild(styleEl)

  const slides = getSlides(svg, {
    selector,
    generateSlides,
    sortSlides,
    transforms,
  })

  const presentation = new MorphDeck({slides})
  const el = presentation.render()
  document.body.appendChild(el)
}

export {present}
