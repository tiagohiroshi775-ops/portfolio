<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Lista de cards expansíveis (acordeão) com altura animada pelo GSAP.
interface Item { titulo: string; subtitulo: string; periodo: string; detalhes: string; arquivo?: string }
defineProps<{ itens: Item[] }>()

const uid = useId()
const paineis = ref<HTMLElement[]>([])
const icones = ref<HTMLElement[]>([])
const abertos = reactive(new Set<number>())

function alternar(i: number) {
  const painel = paineis.value[i]
  const icone = icones.value[i]
  const abrir = !abertos.has(i)
  abrir ? abertos.add(i) : abertos.delete(i)
  gsap.to(painel, {
    height: abrir ? 'auto' : 0,
    duration: 0.5,
    ease: 'power3.inOut',
    onComplete: () => ScrollTrigger.refresh()
  })
  gsap.to(icone, { rotation: abrir ? 45 : 0, duration: 0.35, ease: 'power2.out' })
}
</script>

<template>
  <ul class="space-y-4">
    <li v-for="(item, i) in itens" :key="item.titulo" class="border-2 border-borda bg-painel transition-shadow hover:shadow-[6px_6px_0_#d9002f]">
      <button
        type="button"
        class="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5"
        :aria-expanded="abertos.has(i)"
        :aria-controls="`${uid}-${i}`"
        @click="alternar(i)"
      >
        <span>
          <span class="block text-xs font-bold uppercase tracking-widest text-shu">{{ item.periodo }}</span>
          <span class="block font-mincho text-lg font-bold text-texto sm:text-xl">{{ item.titulo }}</span>
          <span class="block text-sm text-suave">{{ item.subtitulo }}</span>
        </span>
        <span
          :ref="(el) => { if (el) icones[i] = el as HTMLElement }"
          class="grid h-9 w-9 shrink-0 place-items-center bg-shu font-mincho text-2xl leading-none text-claro"
          aria-hidden="true"
        >+</span>
      </button>
      <div
        :id="`${uid}-${i}`"
        :ref="(el) => { if (el) paineis[i] = el as HTMLElement }"
        class="h-0 overflow-hidden"
        role="region"
      >
        <div class="border-t-2 border-borda px-4 pb-5 pt-4 sm:px-5">
          <p>{{ item.detalhes }}</p>
          <a
            v-if="item.arquivo"
            :href="item.arquivo"
            download
            class="mt-4 inline-block bg-shu px-4 py-2 text-sm font-bold uppercase tracking-widest text-claro transition-colors hover:bg-shu-escuro"
          >Baixar certificado (PDF)</a>
        </div>
      </div>
    </li>
  </ul>
</template>
