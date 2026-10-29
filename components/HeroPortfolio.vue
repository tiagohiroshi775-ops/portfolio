<script setup lang="ts">
import { gsap } from 'gsap'
import { perfil, navegacao } from '~/data/conteudo'
import { scrollToTarget } from '~/utils/scroll'

// Tela inicial do portfólio: é o que aparece "dentro" do notebook.
const raiz = ref<HTMLElement | null>(null)
let linha: gsap.core.Timeline | null = null

const tituloCompleto = perfil.saudacao.map((p) => p.texto).join(' ')
const reduzir = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function ocultar() {
  if (!raiz.value) return
  const q = gsap.utils.selector(raiz.value)
  gsap.set(q('.letra, .h-foto, .h-sol, .h-role, .h-kanji'), { autoAlpha: 0 })
  gsap.set(q('.h-item'), { clipPath: 'inset(0 100% 0 0)' })
  gsap.set(q('.h-marca'), { backgroundSize: '0% 100%' })
}

// opts.sol === false: o sol vermelho já foi posicionado pela intro (SamuraiSplash, agora a bandeira do Japão)
function play(opts: { sol?: boolean } = {}) {
  if (!raiz.value || reduzir()) return
  const q = gsap.utils.selector(raiz.value)
  const comSol = opts.sol !== false
  linha?.kill()
  ocultar()
  if (!comSol) gsap.set(q('.h-sol'), { autoAlpha: 1, clearProps: 'transform' })
  linha = gsap.timeline()
  linha.fromTo(q('.h-foto'), { autoAlpha: 0, scale: 0.8, rotation: -8 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 1.1, ease: 'power3.out' }, 0)
  if (comSol) {
    linha.fromTo(q('.h-sol'), { autoAlpha: 0, yPercent: 45, scale: 0.7 }, { autoAlpha: 1, yPercent: 0, scale: 1, duration: 1.4, ease: 'power3.out' }, 0.25)
  }
  linha
    .to(q('.h-item'), { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'power3.inOut', stagger: 0.14 }, 0.5)
    .fromTo(
      q('.letra'),
      { autoAlpha: 0, y: '0.4em', rotation: 5, filter: 'blur(6px)' },
      { autoAlpha: 1, y: 0, rotation: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out', stagger: 0.05 },
      0.6
    )
    .to(q('.h-marca'), { backgroundSize: '100% 100%', duration: 0.9, ease: 'power3.inOut' }, '>-0.3')
    .fromTo(q('.h-role'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '<0.2')
    .fromTo(q('.h-kanji'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out' }, '<0.2')
}

function reset() {
  linha?.kill()
  if (!reduzir()) ocultar()
}

onMounted(() => {
  if (!reduzir()) ocultar()
})
onBeforeUnmount(() => linha?.kill())

defineExpose({ play, reset })
</script>

<template>
  <div
    id="inicio"
    ref="raiz"
    class="relative mx-auto grid min-h-full w-[min(1120px,calc(100%-2rem))] content-center items-center gap-6 pb-8 pt-24 lg:grid-cols-[1.1fr_.9fr] lg:gap-24 lg:pt-28"
  >
    <KanjiVertical texto="継続は力なり" class="h-kanji absolute -left-24 top-1/2 hidden -translate-y-1/2 2xl:flex" />

    <div>
      <figure class="relative isolate mb-8 w-[min(46%,11rem)] sm:w-[min(60%,16rem)] lg:mb-10 lg:w-[min(100%,25rem)]">
        <div class="h-sol sol-shu absolute -right-6 -top-4 -z-10 aspect-square w-[82%] rounded-full lg:-right-12 lg:-top-6" />
        <img
          src="/imagens/fotominha.png"
          alt="Foto de Tiago Hiroshi"
          class="h-foto foto-moldura aspect-square w-full rounded-full object-cover object-[center_15%]"
        />
      </figure>

      <h1 :aria-label="tituloCompleto" class="mb-3 font-mincho text-[1.9rem] font-extrabold leading-[1.15] text-texto sm:text-4xl lg:mb-4 lg:text-[3.1rem]">
        <template v-for="(parte, i) in perfil.saudacao" :key="i">
          <span :class="parte.destaque ? 'h-marca destaque-nome text-shu' : ''">
            <span
              v-for="(palavra, j) in parte.texto.split(' ')"
              :key="j"
              class="mr-[0.26em] inline-block whitespace-nowrap"
              aria-hidden="true"
            >
              <span v-for="(letra, k) in palavra.split('')" :key="k" class="letra inline-block">{{ letra }}</span>
            </span>
          </span>
        </template>
      </h1>

      <p class="h-role max-w-[34ch] border-l-[3px] border-shu pl-3 text-base font-medium leading-relaxed text-suave lg:text-lg">
        {{ perfil.role }}
      </p>
    </div>

    <nav aria-label="Navegação principal">
      <ul class="border-t-2 border-borda">
        <li v-for="item in navegacao" :key="item.id" class="h-item border-b-2 border-borda">
          <a
            :href="`#${item.id}`"
            class="flex items-baseline justify-between gap-4 bg-[linear-gradient(#d9002f,#d9002f)] bg-[length:0%_100%] bg-left bg-no-repeat px-3 py-3.5 text-texto transition-[background-size,color,padding] duration-500 hover:bg-[length:100%_100%] hover:pl-6 hover:text-claro focus-visible:bg-[length:100%_100%] focus-visible:pl-6 focus-visible:text-claro lg:py-5 [&:hover_.jp]:text-ouro"
            @click.prevent="scrollToTarget(`#${item.id}`)"
          >
            <span class="font-mincho text-xl font-bold lg:text-[1.75rem]">{{ item.rotulo }}</span>
            <span lang="ja" aria-hidden="true" class="jp text-sm font-bold tracking-[0.15em] text-shu transition-colors duration-300">{{ item.jp }}</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>
