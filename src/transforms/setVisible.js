export default function* setVisible(slides) {
  for (const slide of slides) {
    slide.svg.style.display = null
    slide.svg.removeAttribute('display')
    yield slide
  }
}
