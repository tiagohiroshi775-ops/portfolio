import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { setLenis } from '~/utils/scroll'

// Registra o ScrollTrigger e liga o Lenis (rolagem "manteiga") ao ticker do GSAP.
export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger)

  const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lenis = new Lenis({
    lerp: reduzir ? 1 : 0.09,
    smoothWheel: !reduzir
  })

  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((tempo) => lenis.raf(tempo * 1000))
  gsap.ticker.lagSmoothing(0)

  setLenis(lenis)
})
