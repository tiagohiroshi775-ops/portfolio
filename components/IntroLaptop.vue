<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createLaptopScene, type LaptopScene } from '~/composables/laptopScene'
import { getLenis } from '~/utils/scroll'

// Seção fixa (pin) com a cena 3D. A rolagem controla a câmera:
//   0%   → plano aberto: notebook sobre a mesa, bambus e luzes
//   0–84% → zoom contínuo até a tela preencher a janela
//   84–100% → a tela "vira" o portfólio real (HeroPortfolio) e a barra do topo aparece
const entrou = useState('entrou', () => false)
const lanternas = useState('lanternas', () => false) // lanternas só acendem depois da intro

const raiz = ref<HTMLElement | null>(null)
const cena = ref<HTMLElement | null>(null)
const tela = ref<HTMLCanvasElement | null>(null)
const dica = ref<HTMLElement | null>(null)
const portal = ref<HTMLElement | null>(null)
const hero = ref<{ play: (o?: { sol?: boolean }) => void; reset: () => void } | null>(null)
const splash = ref<{ play: (h: NonNullable<typeof hero.value>) => void; cancel: () => void } | null>(null)

let cenario: LaptopScene | null = null
let ctx: gsap.Context | null = null
let aoMover: ((e: PointerEvent) => void) | null = null
let removerGestos: (() => void) | null = null

// Celular/tablet: uma única rolagem (ou toque) dispara a animação inteira, que segue sozinha.
const ehMobile = ref(false)
const MOBILE_DURACAO = 3.8 // segundos da animação automática

function destravar() {
  document.documentElement.classList.remove('travado')
  getLenis()?.start()
}

onMounted(async () => {
  const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const mobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches
  ehMobile.value = mobile

  if (!reduzir) {
    try {
      cenario = await createLaptopScene(tela.value!, cena.value!, mobile ? 'celular' : 'monitor')
    } catch (erro) {
      console.warn('WebGL indisponível, mostrando o portfólio direto.', erro)
    }
  }

  // Sem 3D (movimento reduzido ou sem WebGL): mostra o portfólio direto.
  if (!cenario) {
    gsap.set(portal.value, { autoAlpha: 1 })
    gsap.set([cena.value, dica.value], { display: 'none' })
    entrou.value = true
    lanternas.value = true
    hero.value?.play()
    return
  }

  const estado = { p: 0 }
  let tocou = false

  aoMover = (e: PointerEvent) => cenario?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1)
  window.addEventListener('pointermove', aoMover)

  ctx = gsap.context(() => {
    gsap.set(portal.value, { autoAlpha: 0 })
    gsap.to('.dica-roda', { y: 12, autoAlpha: 0, duration: 1.1, ease: 'power1.in', repeat: -1 })

    const linha = gsap.timeline({
      defaults: { ease: 'none' },
      paused: mobile,
      ...(mobile
        ? {}
        : {
            scrollTrigger: {
              trigger: raiz.value,
              start: 'top top',
              end: () => `+=${Math.round(window.innerHeight * 3.4)}`,
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => cenario?.setActive(self.progress < 0.995)
            }
          }),
      onComplete: () => {
        if (!mobile) return
        cenario?.setActive(false)
        destravar()
        ScrollTrigger.refresh()
      }
    })

    linha.to(
      estado,
      {
        p: 1,
        duration: 1,
        onUpdate: () => {
          cenario?.setProgress(estado.p)
          if (estado.p > 0.86 && !tocou) {
            tocou = true
            entrou.value = true
            // intro (bandeira do Japão) → círculo vermelho desliza até o sol do Hero → Hero anima
            if (splash.value && hero.value) splash.value.play(hero.value)
            else hero.value?.play()
          } else if (estado.p < 0.6 && tocou) {
            tocou = false
            entrou.value = false
            lanternas.value = false
            splash.value?.cancel()
            hero.value?.reset()
          }
        }
      },
      0
    )
    linha.to(dica.value, { autoAlpha: 0, duration: 0.06 }, 0)
    linha.to(cena.value, { autoAlpha: 0, duration: 0.14 }, 0.86)
    linha.fromTo(
      portal.value,
      { autoAlpha: 0, scale: 1.08, filter: 'blur(8px)' },
      { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.16, ease: 'power2.out' },
      0.84
    )

    if (mobile) {
      // trava a página no topo até o usuário fazer o primeiro gesto
      window.scrollTo(0, 0)
      document.documentElement.classList.add('travado')
      getLenis()?.stop()
      linha.timeScale(1 / MOBILE_DURACAO)

      let disparou = false
      let yInicial = 0
      const disparar = () => {
        if (disparou) return
        disparou = true
        removerGestos?.()
        linha.play()
      }
      const aoTocar = (e: TouchEvent) => { yInicial = e.touches[0]?.clientY ?? 0 }
      const aoDeslizar = (e: TouchEvent) => {
        if (Math.abs((e.touches[0]?.clientY ?? 0) - yInicial) > 12) disparar()
      }
      window.addEventListener('touchstart', aoTocar, { passive: true })
      window.addEventListener('touchmove', aoDeslizar, { passive: true })
      window.addEventListener('wheel', disparar, { passive: true })
      window.addEventListener('keydown', disparar)
      raiz.value?.addEventListener('click', disparar)
      removerGestos = () => {
        window.removeEventListener('touchstart', aoTocar)
        window.removeEventListener('touchmove', aoDeslizar)
        window.removeEventListener('wheel', disparar)
        window.removeEventListener('keydown', disparar)
        raiz.value?.removeEventListener('click', disparar)
      }
    }
  }, raiz.value!)

  // as fontes mudam a altura da página: recalcula os pontos do scroll
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
})

onBeforeUnmount(() => {
  if (aoMover) window.removeEventListener('pointermove', aoMover)
  removerGestos?.()
  destravar()
  ctx?.revert()
  cenario?.dispose()
})
</script>

<template>
  <section ref="raiz" class="relative h-screen w-full overflow-hidden bg-[#0b0907]" aria-label="Introdução">
    <h2 class="sr-only">Portfólio de Tiago Hiroshi Abe Da Silva</h2>

    <div ref="cena" class="intro-cena absolute inset-0">
      <canvas ref="tela" class="block h-full w-full" aria-hidden="true" />
      <div class="vinheta pointer-events-none absolute inset-0" />
    </div>

    <div ref="dica" class="intro-dica pointer-events-none absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-3 text-claro">
      <span class="font-mincho text-xs uppercase tracking-[0.45em] text-ouro sm:text-sm">{{ ehMobile ? 'Deslize para entrar' : 'Role para entrar' }}</span>
      <span class="relative h-12 w-7 rounded-full border-2 border-claro/70">
        <span class="dica-roda absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 rounded bg-ouro" />
      </span>
      <span lang="ja" aria-hidden="true" class="font-mincho text-2xl text-shu">入</span>
    </div>

    <!-- Intro: bandeira do Japão + círculo vermelho; fica por cima do portal -->
    <SamuraiSplash ref="splash" @feito="lanternas = true" />

    <!-- O portfólio "dentro" da tela do notebook -->
    <div ref="portal" class="portal invisible absolute inset-0 overflow-y-auto opacity-0">
      <div class="fundo-ondas min-h-full overflow-hidden">
        <HeroPortfolio ref="hero" />
      </div>
    </div>
  </section>
</template>

<style>
html.travado,
html.travado body {
  overflow: hidden;
  overscroll-behavior: none;
}
</style>
