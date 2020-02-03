import morphdom from 'morphdom'
import partialRight from 'lodash/partialRight'

import {areSameMatrix} from './utils'

function getNodeKey(el) {
  if (!el || !el.getAttribute) {
    return
  }

  return el.getAttribute('data-key')
}

function onBeforeElUpdated(fromEl, toEl) {
  const key = fromEl.getAttribute('data-key')
  if (!key) {
    return
  }

  // If a keyed node is moved to a new parent, the node may jump on the screen
  // instead of smoothly transitioning to its new position. This is caused by
  // the new parent's coordinate system taking immediate effect. We compensate
  // for this by comparing the parent node's transform matrix before and after
  // it is updated. If the matrices differ, we calculate a transform matrix to
  // position the node where it used to be in screen space before the update.
  // We immediately apply this transform. When the element is updated by
  // morphdom, this transform is replaced with the element's final position,
  // and we animate to there.
  const beforeM = fromEl.__parentCTM
  const afterM = fromEl.parentNode.getCTM()
  if (!areSameMatrix(beforeM, afterM)) {
    fromEl.style.transition = 'none'
    // Calculate the relative transform between before and after, then invert it.
    const matrix = beforeM.inverse().multiply(afterM).inverse()
    const {a, b, c, d, e, f} = matrix
    fromEl.style.transform += ` matrix(${[a, b, c, d, e, f].join(',')})`
  }

  // Force layout so transitions have a start position.
  fromEl.getBoundingClientRect()
}

function onNodeAdded(el, {emit, dir}) {
  if (!el || !el.getAttribute) {
    return
  }

  emit('node:added', {el, dir})
}

function onBeforeNodeDiscarded(el, {emit, dir}) {
  if (!el || !el.getAttribute) {
    return
  }
  
  let canceled = false
  const cancelDiscard = () => { canceled = true }
  emit('node:beforediscard', {el, dir, cancelDiscard})

  return !canceled
}


export default function morphSlide(fromSlide, toSlide, {emit, dir}) {
  // Capture parent transform matrix prior to new slide.
  // This is used to compensate for coordinate system changes in onBeforeElUpdated.
  for (const el of fromSlide.querySelectorAll('[data-key]')) {
    el.__parentCTM = el.parentNode.getCTM()
  }

  morphdom(fromSlide, toSlide, {
    getNodeKey,
    onBeforeElUpdated,
    onNodeAdded: partialRight(onNodeAdded, {emit, dir}),
    onBeforeNodeDiscarded: partialRight(onBeforeNodeDiscarded, {emit, dir}),
  })
}
