<script setup lang="ts">
import { contatos } from '~/data/conteudo'
</script>

<template>
  <SectionShell id="contato" titulo="Contato" kanji="連">
    <p class="mb-6 max-w-[62ch]">Vamos conversar? Escolha o canal que preferir.</p>
    <ul class="grid gap-4 lg:grid-cols-3">
      <li v-for="c in contatos" :key="c.rotulo">
        <a
          :href="c.href"
          target="_blank"
          rel="noopener"
          class="block border-2 border-borda bg-painel p-4 transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_#d9002f]"
        >
          <span class="block text-xs font-bold uppercase tracking-widest text-shu">{{ c.rotulo }}</span>
          <span class="mt-1 block whitespace-nowrap font-mincho font-bold text-texto">{{ c.valor }}</span>
        </a>
      </li>
    </ul>
  </SectionShell>
</template>
