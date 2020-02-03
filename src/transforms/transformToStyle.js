import {convertSVGTransformToCSS} from '../utils'

export default function* transformToStyle(slides) {
  for (const slide of slides) {
    // Firefox does not know how to transition SVG transform attributes, but it works if we convert them to styles.
    // https://bugzilla.mozilla.org/show_bug.cgi?id=951539
    for (const el of slide.svg.querySelectorAll('[transform]')) {
      const transform = el.getAttribute('transform')
      if (transform) {
        el.style.transform = convertSVGTransformToCSS(el)
        el.removeAttribute('transform')
      }
    }

    yield slide
  }
}
