import sortBy from 'lodash/sortBy'

import {ltrPosition} from '../utils'

export default function* appear(slides) {
  for (const slide of slides) {
    // Slide with nothing appearing yet
    yield slide

    const appears = slide.svg.querySelectorAll('[data-appear]')
    if (!appears.length) {
      continue
    }

    const sortedAppears = sortBy(appears, el => 
      [el.getAttribute('data-appear'), ...ltrPosition(el)]
    )

    for (const el of appears) {
      el.parentNode.removeChild(el)
    }

    const allVisible = []
    for (const nextAppear of sortedAppears) {
      allVisible.push(nextAppear)

      const newSlide = slide.clone()
      newSlide.notes = nextAppear.getAttribute('data-notes') || slide.notes
      for (const visibleEl of allVisible) {
        newSlide.svg.appendChild(visibleEl.cloneNode(true))
      }

      yield newSlide
    }
  }
}
