<script setup lang="ts">
// Frase decorativa na vertical, uma letra sobre a outra.
defineProps<{ texto: string }>()
</script>

<template>
  <p
    lang="ja"
    aria-hidden="true"
    class="flex flex-col items-center gap-2 border-l-[3px] border-ouro pl-3 font-mincho text-2xl font-bold leading-none text-shu"
  >
    <span v-for="(letra, i) in texto.split('')" :key="i">{{ letra }}</span>
  </p>
</template>
