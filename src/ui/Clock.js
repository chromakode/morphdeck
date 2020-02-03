import Nanocomponent from 'nanocomponent'
import html from 'nanohtml'

class Clock extends Nanocomponent {
  constructor() {
    super()
    this._interval = null
    this.startTime = null
    this.handleReset = this.handleReset.bind(this)
    this.handleStart = this.handleStart.bind(this)
  }

  createElement() {
    const now = new Date()

    let timer
    if (this.startTime) {
      const duration = Math.floor((now - this.startTime) / 1000)
      const minutes = Math.floor(duration / 60)
      const seconds = duration - minutes * 60
      timer = html`
        <span style="margin-left: 16px">
          ${minutes}m ${String(seconds).padStart(2, '0')}s
        </span>
      `
    }

    const timerButton = this.startTime === null
      ? html`<button onclick=${this.handleStart}>start</button>`
      : html`<button onclick=${this.handleReset}>reset</button>`

    return html`
      <div style="display: flex">
        ${timerButton}
        ${timer}
        <span style="margin-left: 16px">
          ${now.toLocaleTimeString(undefined, {timeStyle: 'short'})}
        </span>
      </div>
    `
  }

  update() {
    return true
  }
  
  handleReset() {
    this.startTime = null
    this.rerender()
  }

  handleStart() {
    this.startTime = Date.now()
    this.rerender()
  }

  handleTick() {
    this.rerender()
  }

  load() {
    this._interval = setInterval(() => this.handleTick(), 1000)
  }

  unload() {
    clearInterval(this._interval)
  }
}

export default Clock
