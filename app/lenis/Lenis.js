// lenis-scroll.js
'use client'
import Lenis from '@studio-freight/lenis'

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: true,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Optional: Custom scroll-based parallax elements
window.addEventListener('scroll', () => {
  const parallaxEls = document.querySelectorAll('[data-parallax]')
  parallaxEls.forEach((el) => {
    const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3
    el.style.transform = `translateY(${window.scrollY * speed}px)`
  })
})
