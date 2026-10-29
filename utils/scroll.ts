import type Lenis from 'lenis'

// Guarda a instância do Lenis para qualquer componente poder rolar até uma seção.
let instance: Lenis | null = null

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis
}

export const getLenis = () => instance

export function scrollToTarget(target: string | HTMLElement | number, offset = -96) {
  if (instance) {
    instance.scrollTo(target as any, { offset, duration: 1.6 })
    return
  }
  if (typeof target === 'string') document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  else if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' })
  else target.scrollIntoView({ behavior: 'smooth' })
}
