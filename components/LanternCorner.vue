<script setup lang="ts">
// Lanterna de papel (chōchin) pendurada no canto, com brilho quente e balanço suave.
// Fica fixa na janela, pendurada logo abaixo da barra, acima do conteúdo (e sem capturar cliques),
// então aparece igual em todas as seções.
const props = withDefaults(defineProps<{ lado?: 'esq' | 'dir'; kanji?: string }>(), { lado: 'esq', kanji: '火' })
const acesa = useState('lanternas', () => false)
const delay = props.lado === 'esq' ? '0s' : '-2.6s'
</script>

<template>
  <Transition name="acender">
  <div
    v-if="acesa"
    class="pointer-events-none fixed top-[4.1rem] z-[45] hidden origin-top scale-[0.7] md:top-[4.9rem] md:block lg:scale-[0.85] xl:scale-100"
    :class="lado === 'esq' ? 'left-2 xl:left-8' : 'right-2 xl:right-8'"
    aria-hidden="true"
  >
    <div class="lanterna-balanco flex flex-col items-center" :style="{ animationDelay: delay }">
      <span class="block h-6 w-px bg-neon/60 md:h-10" />
      <span class="block h-2 w-9 rounded-sm bg-[#1b1410]" />
      <div class="relative">
        <!-- halo -->
        <span class="lanterna-brilho absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(255,60,40,0.38),transparent_68%)]" />
        <!-- corpo -->
        <div
          class="relative flex h-24 w-[4.4rem] items-center justify-center rounded-[48%/38%] border-y-[5px] border-[#1b1410] bg-[radial-gradient(ellipse_at_50%_45%,#ffb27a,#ff3b2a_55%,#a80022)] shadow-[0_0_46px_8px_rgba(255,59,42,0.4)] md:h-32 md:w-24"
        >
          <span class="absolute inset-x-0 top-[28%] h-px bg-[#5a0a10]/50" />
          <span class="absolute inset-x-0 top-[50%] h-px bg-[#5a0a10]/50" />
          <span class="absolute inset-x-0 top-[72%] h-px bg-[#5a0a10]/50" />
          <span lang="ja" class="font-mincho text-2xl font-extrabold text-[#2a0508]/80 md:text-4xl">{{ kanji }}</span>
        </div>
      </div>
      <span class="block h-2 w-9 rounded-sm bg-[#1b1410]" />
      <span class="block h-8 w-px bg-ouro/70" />
      <span class="block h-3 w-3 rounded-full bg-ouro/80" />
    </div>
  </div>
  </Transition>
</template>

<style scoped>
.acender-enter-active { transition: opacity 1.2s ease, transform 1.2s cubic-bezier(.2,.8,.2,1); }
.acender-enter-from { opacity: 0; transform: translateY(-40px); }
.acender-leave-active { transition: opacity 0.4s ease; }
.acender-leave-to { opacity: 0; }
</style>
