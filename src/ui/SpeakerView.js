import Nanocomponent from 'nanocomponent'
import html from 'nanohtml'
import raw from 'nanohtml/raw'
import marked from 'marked'

import {serializeHash} from '../url'
import Slide from './Slide'
import Clock from './Clock'

class SpeakerView extends Nanocomponent {
  constructor({slides}) {
    super()
    this.idx = null
    this.slides = slides
    this.curSlideComponent = new Slide()
    this.nextSlideComponent = new Slide()
    this.clock = new Clock()
    this.followerWin = null
    this.handleOpenFollower = this.handleOpenFollower.bind(this)
  }

  createElement({idx}) {
    const curSlide = this.slides[idx - 1]
    const nextSlide = this.slides[idx]

    return html`
      <div id="speaker-view">
        <main>
          <div class="deck">
            ${this.curSlideComponent.render({slide: curSlide})}
            <div id="notes">${curSlide.notes && raw(marked(curSlide.notes))}</div>
          </div>
          <div class="sidebar">
            ${nextSlide && this.nextSlideComponent.render({slide: nextSlide, animate: false})}
          </div>
        </main>
        <footer>
          <div class="left">
            <span style="margin-right: 16px">${idx} / ${this.slides.length}</span>
            <button onclick=${this.handleOpenFollower}>present</button>
          </div>
          <div class="right">${this.clock.render()}</div>
        </footer>
      </div>
    `
  }

  update({idx}) {
    if (idx !== this.idx) {
      this.idx = idx
      if (this.followerWin) {
        this.followerWin.location.hash = serializeHash({idx: this.idx})
      }
      return true
    }
    return false
  }

  handleOpenFollower() {
    this.followerWin = window.open('#' + serializeHash({idx: this.idx}))
  }
}

export default SpeakerView
