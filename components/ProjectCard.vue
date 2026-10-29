<script setup lang="ts">
import { gsap } from 'gsap'

// Card de projeto: inclinação 3D que segue o mouse, luz que acompanha o cursor e sol vermelho que cresce no hover.
interface Projeto { titulo: string; descricao: string; tags: string[]; kanji: string; link?: string; imagem?: string }
defineProps<{ projeto: Projeto }>()

const card = ref<HTMLElement | null>(null)

function mover(e: PointerEvent) {
  if (!card.value || e.pointerType === 'touch') return
  const r = card.value.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width
  const y = (e.clientY - r.top) / r.height
  gsap.to(card.value, { rotateY: (x - 0.5) * 12, rotateX: (0.5 - y) * 12, transformPerspective: 900, duration: 0.4, ease: 'power2.out' })
  card.value.style.setProperty('--mx', `${x * 100}%`)
  card.value.style.setProperty('--my', `${y * 100}%`)
}

function sair() {
  if (card.value) gsap.to(card.value, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'power3.out' })
}
</script>

<template>
  <article
    ref="card"
    class="group relative isolate overflow-hidden border-2 border-borda bg-painel p-6 [transform-style:preserve-3d]"
    style="border-radius: 0 1.25rem 0 1.25rem"
    @pointermove="mover"
    @pointerleave="sair"
  >
    <!-- foto de fundo escurecida (opcional): só os textos ficam em destaque -->
    <template v-if="projeto.imagem">
      <img :src="projeto.imagem" alt="" aria-hidden="true" loading="lazy" class="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
      <span class="absolute inset-0 -z-[15] bg-gradient-to-b from-[#0a0e1a]/70 via-[#0a0e1a]/80 to-[#0a0e1a]/90" />
    </template>
    <!-- sol que cresce -->
    <span class="absolute -right-10 -top-10 -z-10 h-28 w-28 rounded-full bg-shu/80 transition-transform duration-700 ease-out group-hover:scale-[3.2]" />
    <!-- luz que segue o cursor -->
    <span
      class="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style="background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(255, 248, 232, 0.55), transparent 70%)"
    />

    <span lang="ja" aria-hidden="true" class="absolute right-4 top-3 font-mincho text-4xl font-extrabold text-claro transition-colors duration-500 group-hover:text-ouro">
      {{ projeto.kanji }}
    </span>

    <h3 class="mt-10 pr-10 font-mincho text-xl font-bold text-texto transition-colors duration-500 group-hover:text-texto">{{ projeto.titulo }}</h3>
    <p class="mt-2 text-sm leading-relaxed [text-shadow:0_1px_6px_rgba(0,0,0,0.8)]">{{ projeto.descricao }}</p>

    <ul class="mt-4 flex flex-wrap gap-2">
      <li v-for="tag in projeto.tags" :key="tag" class="border border-borda px-2 py-0.5 text-xs font-bold text-texto">{{ tag }}</li>
    </ul>

    <a
      v-if="projeto.link"
      :href="projeto.link"
      target="_blank"
      rel="noopener"
      class="mt-5 inline-flex items-center gap-2 font-bold text-shu underline-offset-4 hover:underline"
    >
      Ver projeto <span aria-hidden="true" class="transition-transform duration-300 group-hover:translate-x-1">→</span>
    </a>
  </article>
</template>
