<script setup lang="ts">
import { gsap } from 'gsap'
import { projetos } from '~/data/conteudo'

const grade = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !grade.value) return
  ctx = gsap.context(() => {
    gsap.from('.card-projeto', {
      y: 50,
      autoAlpha: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: { trigger: grade.value, start: 'top 85%', once: true }
    })
  }, grade.value)
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <SectionShell id="projetos" titulo="Projetos desenvolvidos" kanji="作">
    <p class="mb-6 max-w-[62ch]">Aqui estão alguns dos meus projetos antigos e atuais.</p>
    <div
      ref="grade"
      class="grid gap-6 [perspective:1000px] sm:grid-cols-2"
      :class="projetos.length % 3 === 1 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'"
    >
      <ProjectCard v-for="projeto in projetos" :key="projeto.titulo" :projeto="projeto" class="card-projeto" />
    </div>
  </SectionShell>
</template>
