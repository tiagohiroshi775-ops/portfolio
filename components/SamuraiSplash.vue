<script setup lang="ts">
import { gsap } from 'gsap'

// Intro (splash): a bandeira do Japão aparece sobre o fundo escuro; o campo branco se dissolve
// e o círculo vermelho (o "sol") desliza até o sol vermelho do Hero (.h-sol), que assume o lugar.
// O nome do arquivo ficou "SamuraiSplash" só para não quebrar o IntroLaptop.
const emit = defineEmits<{ feito: [] }>()

interface HeroApi { play: (o?: { sol?: boolean }) => void }

const raiz = ref<HTMLElement | null>(null)
const fundo = ref<HTMLElement | null>(null)
const bandeira = ref<HTMLElement | null>(null)
const campo = ref<HTMLElement | null>(null)
const legenda = ref<HTMLElement | null>(null)
const bola = ref<HTMLElement | null>(null)

let hero: HeroApi | null = null
let ativo = false
let saindo = false
let linha: gsap.core.Timeline | null = null
let centro = { cx: 0, cy: 0, dia: 0 }

// A bandeira cobre a tela inteira; a barra do topo (assinatura + nome, z-50) continua visível por cima.
// O círculo fica no centro da área abaixo da barra, com 3/5 da altura disponível (como na bandeira oficial).
function medir() {
  if (!raiz.value) return
  const rw = raiz.value.clientWidth
  const rh = raiz.value.clientHeight
  const barra = (document.querySelector('header') as HTMLElement | null)?.offsetHeight ?? 72
  const util = rh - barra
  centro = { cx: rw / 2, cy: barra + util / 2, dia: Math.min(util * 0.6, rw * 0.7) }
  posBola(centro.cx, centro.cy, centro.dia)
}

function posBola(cx: number, cy: number, dia: number) {
  gsap.set(bola.value, { x: cx - dia / 2, y: cy - dia / 2, width: dia, height: dia })
}

function parar() {
  linha?.kill()
  linha = null
}

function esconder() {
  gsap.set(raiz.value, { autoAlpha: 0, display: 'none' })
  ativo = false
}

function finalizar(comSol: boolean) {
  parar()
  hero?.play({ sol: comSol })
  esconder()
  emit('feito')
}

function sair() {
  if (saindo || !raiz.value) return
  saindo = true
  const alvoEl = document.querySelector('.h-sol') as HTMLElement | null
  if (!alvoEl) return finalizar(true)

  const p = { k: 0 }
  linha?.kill()
  linha = gsap.timeline({ onComplete: () => finalizar(false) })
  // o campo branco da bandeira se dissolve e sobra só o círculo
  linha.to(campo.value, { autoAlpha: 0, duration: 0.9, ease: 'power2.inOut' }, 0)
  linha.to(legenda.value, { autoAlpha: 0, y: 10, duration: 0.4 }, 0)
  // revela o portfólio por trás
  linha.to(fundo.value, { autoAlpha: 0, duration: 0.9, ease: 'power1.inOut' }, 0.5)
  // o círculo desliza até o sol do Hero (alvo recalculado a cada quadro)
  linha.to(
    p,
    {
      k: 1,
      duration: 1.7,
      ease: 'power3.inOut',
      onUpdate: () => {
        const r = raiz.value!.getBoundingClientRect()
        const a = alvoEl.getBoundingClientRect()
        const fim = { cx: a.left - r.left + a.width / 2, cy: a.top - r.top + a.height / 2, dia: a.width }
        const k = p.k
        const arco = Math.sin(k * Math.PI) * -r.height * 0.06 // leve curva, mais orgânico
        posBola(
          centro.cx + (fim.cx - centro.cx) * k,
          centro.cy + (fim.cy - centro.cy) * k + arco,
          centro.dia + (fim.dia - centro.dia) * k
        )
        bola.value!.style.setProperty('--sol-mix', String(Math.min(1, k * 1.4)))
      }
    },
    0.6
  )
}

function play(h: HeroApi) {
  if (!raiz.value) return
  cancel()
  hero = h
  ativo = true
  saindo = false
  gsap.set(raiz.value, { display: 'block', autoAlpha: 0 })
  gsap.set(fundo.value, { autoAlpha: 1 })
  gsap.set(campo.value, { autoAlpha: 1, scale: 1 })
  gsap.set(legenda.value, { autoAlpha: 0, y: 0 })
  bola.value!.style.setProperty('--sol-mix', '0')
  medir()

  linha = gsap.timeline({ onComplete: sair })
  linha
    .to(raiz.value, { autoAlpha: 1, duration: 0.45, ease: 'power1.out' }, 0)
    .fromTo(bandeira.value, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, 0.1)
    .fromTo(bola.value, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'back.out(1.7)' }, 0.55)
    .to(legenda.value, { autoAlpha: 1, duration: 0.6 }, 0.9)
    .to({}, { duration: 1.1 }) // pausa para o usuário ver a bandeira
}

function cancel() {
  if (!ativo) return
  parar()
  esconder()
}

function pular() {
  if (ativo) finalizar(true)
}

onMounted(() => window.addEventListener('resize', medir))
onBeforeUnmount(() => {
  window.removeEventListener('resize', medir)
  parar()
})

defineExpose({ play, cancel })
</script>

<template>
  <div ref="raiz" class="absolute inset-0 z-30 hidden isolate overflow-hidden" aria-label="Introdução">
    <div ref="fundo" class="absolute inset-0 bg-[#070a14]">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(34,228,255,0.10),transparent_60%)]" />
    </div>

    <!-- bandeira do Japão em tela cheia (campo branco; o círculo é a "bola", que sai voando depois) -->
    <div ref="bandeira" class="absolute inset-0" aria-hidden="true">
      <div ref="campo" class="absolute inset-0 bg-white" />
      <p
        ref="legenda"
        lang="ja"
        class="absolute inset-x-0 bottom-8 text-center font-mincho text-sm uppercase tracking-[0.5em] text-[#14110f]/60"
      >
        日本 · NIHON
      </p>
    </div>

    <div ref="bola" class="splash-bola pointer-events-none" aria-hidden="true" />

    <button
      type="button"
      class="absolute bottom-6 right-6 border border-neon/60 bg-ai/70 px-4 py-2 font-mincho text-xs uppercase tracking-[0.3em] text-neon backdrop-blur hover:bg-neon hover:text-ai"
      @click="pular"
    >
      Pular
    </button>
  </div>
</template>
