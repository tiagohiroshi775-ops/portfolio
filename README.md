# Portfólio de Tiago Hiroshi Abe Da Silva

Nuxt 3 + Vue 3 + Tailwind CSS + GSAP (ScrollTrigger) + Lenis + Three.js.

## Como rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # gerar versão de produção
npm run generate   # site estático (para GitHub Pages, Netlify, etc.)
```

Precisa de Node 18.18+ (recomendado 20+).

## O que acontece ao rolar

1. **Cena 3D** (`composables/laptopScene.ts`): notebook sobre mesa de madeira escura, bambus
   dourados e luminárias. Tudo é gerado por código, sem arquivos de modelo 3D.
2. **Zoom no scroll** (`components/IntroLaptop.vue`): o GSAP ScrollTrigger fixa a seção (pin) e
   liga a rolagem ao progresso da câmera (`scrub`). A câmera sai do plano aberto e entra na tela.
3. **Entrada no portfólio**: a tela do notebook vira o portfólio real (`HeroPortfolio.vue`) com o
   título aparecendo letra por letra, e a barra do topo se revela da esquerda para a direita.
4. **Resto do site**: seções com entrada animada, selos (hanko) carimbados, cards expansíveis,
   projetos com inclinação 3D, pétalas de sakura reagindo à velocidade da rolagem e rodapé com torii.

Quem usa "reduzir movimento" no sistema, ou um navegador sem WebGL, vê o portfólio direto, sem a cena 3D.

## Onde editar

| O quê | Arquivo |
|---|---|
| Todos os textos, projetos, certificados, soft skills, tecnologias e contatos | `data/conteudo.ts` |
| Cores e fontes | `tailwind.config.ts` |
| Foto e assinatura | `public/imagens/fotominha.png` e `logotipo.png` |
| Vídeo do samurai (seção Sobre mim) | `public/media/samurai.mp4` |
| Duração do zoom (quantas rolagens) | `end` em `components/IntroLaptop.vue` (`innerHeight * 3.4`) |
| Intensidade das luzes e ângulo da câmera | `composables/laptopScene.ts` |

Itens marcados com **EDITAR** em `data/conteudo.ts` são exemplos: troque pelos seus dados reais.

## Sobre a descrição profissional

O texto inicial do briefing falava em "Desenvolvedor Frontend baseado em Tóquio e Kawasaki (LIG Inc.)".
Esse é o estúdio usado como **referência de estilo**. Para não afirmar algo que não é verdade no seu
portfólio, o texto padrão diz que você é desenvolvedor frontend em formação, estudante no SENAI
Morvan Figueiredo. Se um dia isso mudar, é só editar `perfil.tagline` em `data/conteudo.ts`.
