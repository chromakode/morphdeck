import style from 'dom-css'
import isFunction from 'lodash/isFunction'

import {moveAttr} from '../utils'

const effects = new Map()

function reverseEffect({from, to}) {
  return {from: to, to: from}
}

function createEffect(inName, outName, {from, to}) {
  const effect = {from, to}
  effects.set(inName, effect)
  effects.set(outName, reverseEffect(effect))
}

createEffect('slide-up', 'slide-down', {
  from: {
    transform: 'translate(0, 50%)',
    transformBox: 'fill-box',
    opacity: 0,
  },
  to: {
    transform: null,
    opacity: 1,
  }
})

createEffect('fade-in', 'fade-out', {
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  }
})

createEffect('drop-in', 'lift-out', {
  from: {
    transform: 'scale(1.25)',
    transformBox: 'fill-box',
    transformOrigin: 'center',
    opacity: 0,
  },
  to: {
    transform: 'scale(1)',
    opacity: 1,
  }
})

createEffect('drop-out', 'lift-in', {
  from: {
    transform: 'scale(1)',
    opacity: 1,
  },
  to: {
    transform: 'scale(.75)',
    transformBox: 'fill-box',
    transformOrigin: 'center',
    opacity: 0,
  }
})

function applyEffect({from, to}, el) {
  el.style.transition = 'none'

  if (isFunction(from)) {
    from(el)
  } else {
    style(el, from)
  }

  // Force layout so styles apply immediately.
  el.getBoundingClientRect()

  // TODO: use CSS
  el.style.transition = 'all .5s ease-in-out'

  if (isFunction(to)) {
    to(el)
  } else {
    style(el, to)
  }
}

// after

function handleNodeAdded({el, dir}) {
  const enterEffect = el.getAttribute(dir > 0 ? 'data-enter-effect' : 'data-exit-effect')
  if (!enterEffect) {
    return
  }

  let effect = effects.get(enterEffect)
  if (!effect) { 
    return
  }

  if (dir < 0) {
    effect = reverseEffect(effect)
  }

  applyEffect(effect, el)
}

function handleNodeBeforeDiscard({el, dir, cancelDiscard}) {
  const attrName = dir > 0 ? 'data-exit-effect' : 'data-enter-effect'
  const exitEffect = el.getAttribute(attrName)
  if (!exitEffect) {
    return
  }

  let effect = effects.get(exitEffect)
  if (!effect) { 
    return
  }

  if (dir < 0) {
    effect = reverseEffect(effect)
  }

  applyEffect(effect, el)

  // The next time this would be discarded, don't animate. (This makes the
  // element disappear immediately when a slide is decremented past the
  // animation)
  el.removeAttribute(attrName)

  el.addEventListener('transitionend', () => {
    if (!el.parentNode) {
      // Element already removed from the DOM.
      return
    }
    el.parentNode.removeChild(el)
  })

  cancelDiscard()
}

export default function* enterExitEffects(slides) {
  for (const slide of slides) {
    slide.on('node:added', handleNodeAdded)
    slide.on('node:beforediscard', handleNodeBeforeDiscard)

    // TODO: gather all adds/discards, pass to effect so it can stagger?

    const withEffect = slide.svg.querySelectorAll('[data-enter-effect], [data-exit-effect]')
    for (const el of withEffect) {
      const g = document.createElementNS(slide.parentSVG.namespaceURI, 'g')
      moveAttr('data-enter-effect', el, g)
      moveAttr('data-exit-effect', el, g)
      const key = el.getAttribute('data-key')
      if (key) {
        g.setAttribute('data-key', '$effect-parent:' + key)
      }
      el.parentNode.replaceChild(g, el)
      g.appendChild(el)
    }

    yield slide
  }
}
