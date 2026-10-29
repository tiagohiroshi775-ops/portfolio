<script setup lang="ts">
import { gsap } from 'gsap'
import { getLenis } from '~/utils/scroll'

// Pétalas de sakura em canvas 2D. O vento reage à velocidade da rolagem (Lenis).
const canvas = ref<HTMLCanvasElement | null>(null)
let tick: (() => void) | null = null
let aoRedimensionar: (() => void) | null = null

interface Petala { x: number; y: number; s: number; rot: number; vr: number; vy: number; fase: number; vf: number; amp: number }

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !canvas.value) return
  const el = canvas.value
  const ctx = el.getContext('2d')!
  let w = 0
  let h = 0

  aoRedimensionar = () => {
    const dpr = Math.min(window.devicePixelRatio, 2)
    w = window.innerWidth
    h = window.innerHeight
    el.width = w * dpr
    el.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  aoRedimensionar()
  window.addEventListener('resize', aoRedimensionar)

  const nova = (inicial: boolean): Petala => ({
    x: Math.random() * w,
    y: inicial ? Math.random() * h : -20,
    s: 7 + Math.random() * 9,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.03,
    vy: 0.35 + Math.random() * 0.6,
    fase: Math.random() * Math.PI * 2,
    vf: 0.01 + Math.random() * 0.015,
    amp: 0.3 + Math.random() * 0.6
  })
  const petalas: Petala[] = Array.from({ length: w < 700 ? 14 : 28 }, () => nova(true))

  function desenhar(p: Petala) {
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rot)
    ctx.scale(1, 0.55 + Math.abs(Math.sin(p.fase)) * 0.45)
    const g = ctx.createLinearGradient(-p.s, 0, p.s, 0)
    g.addColorStop(0, '#ff9eb8')
    g.addColorStop(1, '#ff3d71')
    ctx.fillStyle = g
    ctx.globalAlpha = 0.85
    ctx.beginPath()
    ctx.moveTo(0, -p.s)
    ctx.bezierCurveTo(p.s * 0.9, -p.s * 0.6, p.s * 0.7, p.s * 0.7, 0, p.s)
    ctx.bezierCurveTo(-p.s * 0.7, p.s * 0.7, -p.s * 0.9, -p.s * 0.6, 0, -p.s)
    ctx.fill()
    ctx.restore()
  }

  tick = () => {
    const vel = getLenis()?.velocity ?? 0
    ctx.clearRect(0, 0, w, h)
    for (const p of petalas) {
      p.fase += p.vf
      p.x += Math.sin(p.fase) * p.amp + 0.25 + vel * 0.04
      p.y += p.vy + Math.abs(vel) * 0.08
      p.rot += p.vr + vel * 0.002
      if (p.y > h + 30) Object.assign(p, nova(false))
      if (p.x > w + 40) p.x = -30
      if (p.x < -40) p.x = w + 30
      desenhar(p)
    }
  }
  gsap.ticker.add(tick)
})

onBeforeUnmount(() => {
  if (tick) gsap.ticker.remove(tick)
  if (aoRedimensionar) window.removeEventListener('resize', aoRedimensionar)
})
</script>

<template>
  <canvas ref="canvas" class="pointer-events-none fixed inset-0 z-40 h-full w-full" aria-hidden="true" />
</template>
