<script setup lang="ts">
import { gsap } from 'gsap'

// Cartão de seção: cantos vermelhos, selo (hanko) carimbado e entrada ao rolar.
const props = defineProps<{ id: string; titulo: string; kanji: string }>()

const raiz = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !raiz.value) return
  ctx = gsap.context(() => {
    gsap
      .timeline({ scrollTrigger: { trigger: raiz.value, start: 'top 82%', once: true } })
      .from(raiz.value, { y: 60, autoAlpha: 0, duration: 1, ease: 'power3.out' })
      .from('.sec-linha', { scaleX: 0, transformOrigin: 'left center', duration: 0.9, ease: 'power3.inOut' }, 0.25)
      .from('.sec-canto', { scale: 0, duration: 0.5, ease: 'back.out(2)', stagger: 0.12 }, 0.25)
      .from('.hanko', { scale: 1.9, rotation: -14, autoAlpha: 0, duration: 0.5, ease: 'back.out(2.2)' }, 0.6)
      .from('.sec-conteudo', { y: 24, autoAlpha: 0, duration: 0.8, ease: 'power2.out' }, 0.5)
  }, raiz.value)
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section
    :id="props.id"
    ref="raiz"
    class="relative mb-10 scroll-mt-28 border-2 border-borda bg-painel p-6 shadow-[8px_8px_0_rgba(34,228,255,0.10)] sm:p-10"
  >
    <span class="sec-canto absolute -left-0.5 -top-0.5 h-7 w-7 origin-top-left border-l-4 border-t-4 border-shu" />
    <span class="sec-canto absolute -bottom-0.5 -right-0.5 h-7 w-7 origin-bottom-right border-b-4 border-r-4 border-shu" />

    <span
      lang="ja"
      aria-hidden="true"
      class="hanko absolute right-4 top-4 grid h-11 w-11 -rotate-[5deg] place-items-center rounded bg-shu font-mincho text-2xl font-extrabold leading-none text-claro shadow-[inset_0_0_0_2px_rgba(255,248,232,0.4)] sm:right-5 sm:top-5 sm:h-12 sm:w-12 sm:text-3xl"
    >
      {{ kanji }}
    </span>

    <h2 class="pr-16 font-mincho text-2xl font-extrabold leading-tight text-texto sm:text-4xl">
      {{ titulo }}
      <span class="sec-linha mt-3 block h-1 w-14 bg-shu" />
    </h2>

    <div class="sec-conteudo mt-6">
      <slot />
    </div>
  </section>
</template>
