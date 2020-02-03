export default function* backgroundSlide(slides) {
  const bgSlide = slides.find(s => s.svg.getAttribute('data-key') === 'deck-background')
  if (!bgSlide) {
    return
  }

  for (const slide of slides) {
    if (slide === bgSlide) {
      continue
    }
    slide.svg.insertBefore(bgSlide.svg.cloneNode(true), slide.svg.firstChild)
    yield slide
  }
}
