<script setup lang="ts">
import { gsap } from 'gsap'
import { perfil } from '~/data/conteudo'
import { scrollToTarget } from '~/utils/scroll'

// A barra só aparece depois que a câmera "entra" na tela do notebook.
const entrou = useState('entrou', () => false)
const barra = ref<HTMLElement | null>(null)
const linhaOuro = ref<HTMLElement | null>(null)

watch(entrou, (visivel) => {
  if (!barra.value) return
  if (visivel) {
    gsap.to(barra.value, { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power3.inOut' })
    // linha dourada que atravessa a barra e sai pela direita
    gsap.timeline()
      .set(linhaOuro.value, { scaleX: 0, transformOrigin: 'left center' })
      .to(linhaOuro.value, { scaleX: 1, duration: 0.7, ease: 'power3.inOut' })
      .set(linhaOuro.value, { transformOrigin: 'right center' })
      .to(linhaOuro.value, { scaleX: 0, duration: 0.7, ease: 'power3.inOut' })
  } else {
    gsap.to(barra.value, { clipPath: 'inset(0 100% 0 0)', duration: 0.5, ease: 'power2.in' })
  }
})

const irAoTopo = () => scrollToTarget(0, 0)
</script>

<template>
  <header
    ref="barra"
    class="fixed inset-x-0 top-0 z-50 grid min-h-[4.25rem] grid-cols-[1fr_auto_1fr] items-center border-b-[3px] border-shu bg-ai/95 px-3 backdrop-blur md:min-h-20 md:pr-12"
    style="clip-path: inset(0 100% 0 0)"
  >
    <a href="#inicio" class="justify-self-start leading-none" aria-label="Voltar ao início" @click.prevent="irAoTopo">
      <img src="/imagens/logotipo.png" alt="Assinatura de Tiago Hiroshi" class="h-10 w-auto mix-blend-screen invert md:h-[4.5rem]" />
    </a>
    <a
      href="#inicio"
      class="col-start-2 self-center justify-self-center whitespace-nowrap font-cursiva text-[1.15rem] leading-none text-claro md:text-4xl md:leading-tight"
      @click.prevent="irAoTopo"
    >
      {{ perfil.nome }}
    </a>
    <span ref="linhaOuro" class="pointer-events-none absolute -bottom-[3px] left-0 h-[3px] w-full origin-left scale-x-0 bg-ouro" />
  </header>
</template>
