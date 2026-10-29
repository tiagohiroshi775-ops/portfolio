<script setup lang="ts">
import { gsap } from 'gsap'
import { sobre } from '~/data/conteudo'

// Blocos que flutuam devagar + o samurai em versão escura (creme sobre preto; o preto some com screen).
const blocos = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !blocos.value) return
  ctx = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>('.bloco-flutuante').forEach((el, i) => {
      gsap.to(el, { y: i % 2 ? 10 : -10, duration: 2.6 + i * 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    })
  }, blocos.value)
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <SectionShell id="sobremim" titulo="Sobre mim" kanji="私">
    <div class="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
      <div>
        <p v-for="(texto, i) in sobre.paragrafos" :key="i" class="mb-4 max-w-[62ch] text-lg last:mb-0">{{ texto }}</p>

        <div ref="blocos" class="mt-8 grid gap-4 sm:grid-cols-3">
          <article
            v-for="bloco in sobre.blocos"
            :key="bloco.titulo"
            class="bloco-flutuante border-2 border-borda bg-painel p-4 shadow-[5px_5px_0_rgba(217,0,47,0.85)]"
          >
            <h3 class="mb-1 font-mincho text-lg font-bold text-texto">{{ bloco.titulo }}</h3>
            <p class="text-sm leading-relaxed">{{ bloco.texto }}</p>
          </article>
        </div>
      </div>

      <div class="mx-auto w-full max-w-sm overflow-hidden">
        <video
          src="/media/samurai-escuro.mp4"
          class="w-full mix-blend-screen"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
          aria-label="Animação de um samurai em estilo minimalista"
        />
      </div>
    </div>
  </SectionShell>
</template>
