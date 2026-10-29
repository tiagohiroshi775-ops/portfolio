<script setup lang="ts">
import { gsap } from 'gsap'
import { perfil } from '~/data/conteudo'
import { scrollToTarget } from '~/utils/scroll'

// Rodapé índigo com um torii minimalista que é "erguido" ao aparecer.
const raiz = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !raiz.value) return
  ctx = gsap.context(() => {
    gsap.fromTo(
      '.torii',
      { clipPath: 'inset(100% 0 0 0)' },
      {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.3,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: raiz.value, start: 'top 95%', once: true }
      }
    )
  }, raiz.value)
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <footer ref="raiz" class="border-t-4 border-shu bg-ai text-washi">
    <div class="mx-auto flex w-[min(1120px,calc(100%-2rem))] items-center justify-start gap-4 py-8 text-sm md:flex-wrap md:justify-between">
      <svg class="torii shrink-0 fill-shu" viewBox="0 0 120 100" width="72" height="60" aria-hidden="true" focusable="false">
        <rect x="28" y="30" width="10" height="68" />
        <rect x="82" y="30" width="10" height="68" />
        <rect x="16" y="36" width="88" height="8" />
        <path d="M2 20 Q60 4 118 20 L114 32 Q60 18 6 32 Z" />
      </svg>
      <p>© 2026 {{ perfil.nome }}</p>
      <a href="#inicio" class="hidden font-bold text-ouro underline-offset-4 hover:text-claro hover:underline md:inline" @click.prevent="scrollToTarget(0, 0)">
        Voltar ao início
      </a>
    </div>
  </footer>
</template>
