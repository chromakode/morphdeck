import identity from 'lodash/identity'
import mitt from 'mitt'

import {materialize} from './utils'

class SlideData {
  constructor({svg, parentSVG, notes, renderSlide, listeners={}}) {
    this.svg = svg
    this.parentSVG = parentSVG
    this.notes = notes
    this.renderSlide = renderSlide
    this.listeners = listeners

    const events = mitt(listeners)
    this.on = events.on
    this.off = events.off
    this.emit = events.emit
  }
  
  clone() {
    const {svg, parentSVG, notes, renderSlide, listeners} = this
    return new SlideData({
      svg: svg.cloneNode(true),
      parentSVG,
      notes,
      renderSlide,
      listeners: {...listeners},
    })
  }
}

function getSlides(svg, {selector, generateSlides, sortSlides, transforms}) {
  // Create the SVG in the real DOM (positioned way offscreen) so measuring
  // element positions works as expected.
  const svgEl = materialize(svg).querySelector('svg')

  const defsLayer = svgEl.querySelector('#deck-defs')
  if (defsLayer) {
    svgEl.querySelector('defs').appendChild(defsLayer)
  }

  const slideSVGs = [...svgEl.querySelectorAll(selector)]

  let slides = slideSVGs.map(s => new SlideData({
    svg: s,
    parentSVG: svgEl,
    notes: s.getAttribute('data-notes'),
    renderSlide: identity,
  }))

  slides = sortSlides(slides)

  // Run pipeline of transforms, potentially generating more slides.
  for (const transform of Object.values(transforms)) {
    const nextSlides = [...transform(slides)]
    if (!nextSlides.length) {
      // Transform returned without yielding anything.
      continue
    }
    slides = nextSlides
  }

  if (generateSlides) {
    slides = [...generateSlides(slides)]
  }

  for (let idx = 0; idx < slides.length; idx++) {
    slides[idx].idx = idx + 1
  }

  // Once the slides have been generated, clean up the parentSVG, which we'll
  // use as the template for rendering slides into.
  for (const slideSVG of slideSVGs) {
    slideSVG.parentNode.removeChild(slideSVG)
  }

  return slides
}

export {getSlides}
