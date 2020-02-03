import html from 'nanohtml'
import style from 'dom-css'

export function convertSVGTransformToCSS(el) {
  const {matrix: {a, b, c, d, e, f}} = el.transform.baseVal.consolidate()
  return `matrix(${[a, b, c, d, e, f].join(',')})`
}

export function areSameMatrix(m1, m2) {
  return m1.a == m2.a && m1.b == m2.b && m1.c == m2.c && m1.d == m2.d && m1.e == m2.e && m1.f == m2.f
}

export function materialize(el) {
  const containerEl = html`<div />`
  style(containerEl, {
    position: 'absolute',
    left: 9999,
  })
  document.body.appendChild(containerEl)

  if (typeof el === 'string') {
    containerEl.innerHTML = el
  } else {
    containerEl.appendChild(el)
  }

  setTimeout(() => {
    document.body.removeChild(containerEl)
  }, 0)

  return containerEl
}

export function moveAttr(attrName, from, to) {
  const val = from.getAttribute(attrName)
  if (!val) {
    return
  }

  to.setAttribute(attrName, val)
  from.removeAttribute(attrName)
  return val
}

export function ltrPosition(el) {
  // Return a key value for sorting elements visually in top-down/left-to-right order.
  const {x, y} = el.getBoundingClientRect()
  return [y, x]
}
