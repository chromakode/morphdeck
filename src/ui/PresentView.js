import Nanocomponent from 'nanocomponent'
import html from 'nanohtml'

import Slide from './Slide'

class PresentView extends Nanocomponent {
  constructor({slides}) {
    super()
    this.idx = null
    this.slides = slides
    this.slideComponent = new Slide()
  }

  createElement({idx}) {
    const slide = this.slides[idx - 1]
    return html`
      <div class="present">    
        ${this.slideComponent.render({slide})}
      </div>
    `
  }

  update({idx}) {
    if (idx !== this.idx) {
      this.idx = idx
      return true
    }
    return false
  }
}

export default PresentView
