<script setup lang="ts">
import { certificados } from '~/data/conteudo'
</script>

<template>
  <SectionShell id="certificados" titulo="Certificados" kanji="証">
    <ul class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="c in certificados"
        :key="c.titulo"
        class="group flex flex-col border-2 border-borda bg-painel transition-shadow hover:shadow-[6px_6px_0_#d9002f]"
      >
        <!-- miniatura: abre o certificado online (ou o PDF, se não houver link online) -->
        <a
          :href="c.online || c.arquivo"
          target="_blank"
          rel="noopener noreferrer"
          class="block overflow-hidden border-b-2 border-borda bg-black/20"
          :aria-label="`Abrir certificado ${c.titulo}`"
        >
          <img
            :src="c.miniatura"
            :alt="`Prévia do certificado ${c.titulo}`"
            loading="lazy"
            class="aspect-[4/3] w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        </a>

        <div class="flex flex-1 flex-col p-4 sm:p-5">
          <span class="block text-xs font-bold uppercase tracking-widest text-shu">{{ c.periodo }}</span>
          <h3 class="mt-1 font-mincho text-lg font-bold text-texto sm:text-xl">{{ c.titulo }}</h3>
          <span class="block text-sm text-suave">{{ c.emissor }}</span>
          <p class="mt-3 flex-1 text-sm leading-relaxed">{{ c.detalhes }}</p>

          <ul class="mt-3 flex flex-wrap gap-2">
            <li
              v-for="t in c.tags"
              :key="t"
              class="border border-shu px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-widest text-shu"
            >{{ t }}</li>
          </ul>

          <div class="mt-4 flex flex-wrap gap-2">
            <a
              v-if="c.online"
              :href="c.online"
              target="_blank"
              rel="noopener noreferrer"
              class="bg-shu px-3 py-2 text-xs font-bold uppercase tracking-widest text-claro transition-colors hover:bg-shu-escuro"
            >Ver online</a>
            <a
              :href="c.arquivo"
              download
              class="border-2 border-shu px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-shu transition-colors hover:bg-shu hover:text-claro"
            >Baixar PDF</a>
          </div>
        </div>
      </li>
    </ul>
  </SectionShell>
</template>
