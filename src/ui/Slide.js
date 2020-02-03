import Nanocomponent from 'nanocomponent'
import html from 'nanohtml'

import morphSlide from '../morphSlide'

class Slide extends Nanocomponent {
  createElement({slide, animate}) {
    let slideEl
    if (this.element) {
      const slideSVG = slide.parentSVG.cloneNode(true)
      slideSVG.appendChild(slide.svg.cloneNode(true))
      slideEl = slide.renderSlide(slideSVG)
    }

    const className = ['slide-container']
    if (animate === false) {
      className.push('no-animations')
    }

    return html`
      <div class="${className.join(' ')}">
        ${slideEl}
      </div>
    `
  }
  
  load() {
    this.render(...this._arguments)
  }

  update(...args) {
    const [{slide}] = args
    const lastIdx = this.lastIdx || 0
    const dir = Math.sign(slide.idx - lastIdx)
    this.lastIdx = slide.idx

    const newEl = this._handleRender(args)

    // Interrupt any animations.
    this.element.classList.add('no-animations')

    // Use our own morphdom instead of nanocomponent's built in nanomorph so we can customize the svg element replacement.
    morphSlide(this.element, newEl, {
      emit: slide.emit,
      dir,
    })

    return false
  }
}

export default Slide
