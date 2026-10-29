<script setup lang="ts">
import { softSkills, tecnologias } from '~/data/conteudo'

// Ícones carregados pela internet (CDN): Devicon (colorido) e, se faltar, Simple Icons (cor da marca).
// Sem nenhum dos dois, o quadradinho mostra o nome escrito.
const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/'
const SIMPLE = 'https://cdn.jsdelivr.net/npm/simple-icons@13.0.0/icons/'

interface Icone { url: string; mascara: boolean }
const icones = reactive<Record<string, Icone>>({})
const ativo = ref(0)

onMounted(() => {
  tecnologias.forEach((t) => {
    const candidatos: Icone[] = []
    if (t.dev) candidatos.push({ url: `${DEVICON}${t.dev}.svg`, mascara: false })
    t.icone.forEach((slug) => candidatos.push({ url: `${SIMPLE}${slug}.svg`, mascara: true }))
    const tentar = (i: number) => {
      if (i >= candidatos.length) return
      const img = new Image()
      img.onload = () => { icones[t.nome] = candidatos[i] }
      img.onerror = () => tentar(i + 1)
      img.src = candidatos[i].url
    }
    tentar(0)
  })
})
</script>

<template>
  <SectionShell id="habilidades" titulo="Soft Skills" kanji="強">
    <h3 class="mb-4 font-mincho text-xl font-bold text-texto">Soft skills</h3>
    <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="s in softSkills"
        :key="s.titulo"
        tabindex="0"
        class="card-soft border-2 border-borda bg-painel p-4 shadow-[5px_5px_0_rgba(217,0,47,0.85)]"
      >
        <h4 class="mb-1 font-mincho text-lg font-bold text-texto">{{ s.titulo }}</h4>
        <p class="text-sm leading-relaxed">{{ s.texto }}</p>
      </li>
    </ul>

    <h3 class="mb-1 mt-10 font-mincho text-xl font-bold text-texto">Tecnologias e pontos fortes</h3>
    <p class="mb-5 text-sm text-suave">Passe o mouse (ou toque) em um ícone para ver o ponto forte.</p>

    <ul class="grid grid-cols-4 gap-2.5 sm:grid-cols-[repeat(auto-fill,minmax(4.75rem,1fr))] sm:gap-4">
      <li v-for="(t, i) in tecnologias" :key="t.nome">
        <button
          type="button"
          class="tile-tec"
          :class="{ 'tile-ativo': ativo === i }"
          :style="{ '--cor': t.cor }"
          :aria-label="t.nome"
          :aria-pressed="ativo === i"
          @mouseenter="ativo = i"
          @focus="ativo = i"
          @click="ativo = i"
        >
          <span class="icone-tec" :style="{ animationDelay: `${(i % 6) * -0.5}s` }">
            <img v-if="icones[t.nome] && !icones[t.nome].mascara" :src="icones[t.nome].url" alt="" class="icone-img-cor" />
            <span v-else-if="icones[t.nome]" class="icone-mascara" :style="{ '--url': `url(${icones[t.nome].url})` }" />
            <span v-else class="icone-nome">{{ t.nome }}</span>
          </span>
        </button>
      </li>
    </ul>

    <div class="mt-5 border-2 border-borda bg-painel p-4" aria-live="polite">
      <div class="flex flex-wrap items-center gap-3">
        <h4 class="font-mincho text-lg font-bold text-texto">{{ tecnologias[ativo].nome }}</h4>
        <span class="border border-shu px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-widest text-shu">{{ tecnologias[ativo].area }}</span>
      </div>
      <p class="mt-2 text-sm leading-relaxed">{{ tecnologias[ativo].forte }}</p>
    </div>
  </SectionShell>
</template>

<style scoped>
/* cards de soft skills reagem ao mouse, ao toque e ao teclado */
.card-soft {
  cursor: default;
  outline-offset: 3px;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}
.card-soft:hover,
.card-soft:focus-visible,
.card-soft:active {
  transform: translateY(-4px);
  border-color: #22e4ff;
  box-shadow: 5px 5px 0 #d9002f, 0 0 18px -4px #22e4ff;
}
@media (prefers-reduced-motion: reduce) {
  .card-soft { transition: none; }
  .card-soft:hover, .card-soft:focus-visible, .card-soft:active { transform: none; }
}

/* quadradinho de tecnologia (como no modelo): ícone colorido, borda que acende no hover */
.tile-tec {
  display: grid;
  aspect-ratio: 1;
  width: 100%;
  place-items: center;
  border: 1px solid #2b3a66;
  border-radius: 0.75rem;
  background: #0e1426;
  padding: clamp(0.5rem, 2.4vw, 0.7rem);
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}
.tile-tec:hover,
.tile-tec:focus-visible,
.tile-ativo {
  border-color: var(--cor);
  box-shadow: 0 0 0 1px var(--cor), 0 0 18px -2px var(--cor);
  transform: translateY(-2px);
}
/* ícone flutuando levemente; no hover ganha brilho na cor da tecnologia */
.icone-tec {
  display: grid;
  height: 100%;
  width: 100%;
  place-items: center;
  color: var(--cor);
  transition: filter 0.3s ease;
  animation: flutua 3.2s ease-in-out infinite;
}
.tile-tec:hover .icone-tec,
.tile-tec:focus-visible .icone-tec,
.tile-ativo .icone-tec {
  filter: drop-shadow(0 0 6px var(--cor)) drop-shadow(0 0 14px var(--cor));
}
.icone-img-cor {
  display: block;
  height: 100%;
  width: 100%;
  object-fit: contain;
}
.icone-mascara {
  display: block;
  height: 100%;
  width: 100%;
  background-color: currentColor;
  -webkit-mask: var(--url) center / contain no-repeat;
  mask: var(--url) center / contain no-repeat;
}
.icone-nome {
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1.1;
  text-align: center;
  word-break: break-word;
}
@keyframes flutua {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
@media (prefers-reduced-motion: reduce) {
  .icone-tec { animation: none; }
  .tile-tec { transition: none; }
}
</style>
