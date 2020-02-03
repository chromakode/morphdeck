import Nanocomponent from 'nanocomponent'
import html from 'nanohtml'
import clamp from 'lodash/clamp'

import {parseHash, serializeHash} from '../url'
import SpeakerView from './SpeakerView'
import PresentView from './PresentView'

class MorphDeck extends Nanocomponent {
  constructor({slides}) {
    super()
    this.viewComponent = null
    const {idx, mode} = parseHash()
    this.idx = idx
    this.mode = mode
    this.slides = slides
  }

  load() {
    window.addEventListener('keydown', ev => this.handleKeyDown(ev))
    window.addEventListener('hashchange', () => this.render(parseHash()))
  }

  handleKeyDown(ev) {
    let idx
    if (ev.key === 'ArrowLeft') {
      this.render({idx: this.idx - 1, mode: this.mode})
    } else if (ev.key === 'ArrowRight') {
      this.render({idx: this.idx + 1, mode: this.mode})
    }
  }

  createElement() {
    if (!this.viewComponent) {
      const ViewCls = this.mode === 'speaker' ? SpeakerView : PresentView
      this.viewComponent = new ViewCls({
        slides: this.slides,
      })
    }

    return html`
      <div id="deck">
        ${this.viewComponent.render({idx: this.idx})}
      </div>
    `
  }

  update({idx, mode}) {
    idx = clamp(idx, 1, this.slides.length)
    if (idx !== this.idx) {
      this.idx = idx
      location.hash = serializeHash({idx: idx, mode: this.mode})
      return true
    }

    if (mode !== this.mode) {
      this.viewComponent = null
      this.mode = mode
      return true
    }

    return false
  }
}

export default MorphDeck
