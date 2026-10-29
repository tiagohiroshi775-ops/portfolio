# Como editar o portfólio sem quebrar nada

## 0. Antes de mexer
- Faça uma cópia da pasta (ou use `git init && git add . && git commit -m "ok"`). Se algo quebrar, é só voltar.
- Deixe o site rodando com `npm run dev` e abra http://localhost:3000. Ao salvar um arquivo, a página atualiza sozinha.
  Se der erro, ele aparece **no terminal** e na própria página, com o nome do arquivo e a linha.

## 1. Onde fica cada coisa
| O que você quer mudar | Arquivo |
|---|---|
| Nome, saudação, cargo, tagline, "Sobre mim", soft skills e tecnologias, certificados, **projetos**, contatos | `data/conteudo.ts` |
| Foto de perfil | substitua `public/imagens/fotominha.png` (mesmo nome) |
| Assinatura da barra | `public/imagens/logotipo.png` |
| Samurai do "Sobre mim" | `public/media/samurai-escuro.mp4` |
| Cores do tema (neon, painéis, textos) | `tailwind.config.ts` (seção `colors`) |
| Duração/visual da intro (bandeira) | `components/SamuraiSplash.vue` |
| Cena 3D do notebook (luzes, neon, mesa) | `composables/laptopScene.ts` |

**Tudo que é texto fica em `data/conteudo.ts`.** A tela do notebook 3D, o Hero e a barra do topo leem esse mesmo arquivo,
então você troca o texto uma vez só.

## 2. Trocar uma descrição
Abra `data/conteudo.ts`, ache o texto e mude **apenas o que está entre as aspas**:

```ts
descricao: 'Este site: cena 3D de um notebook ...',   // ← mude só o miolo
```

Regras de ouro:
1. Não apague as aspas `' '`, nem a vírgula no final da linha.
2. Texto com apóstrofo (`d'água`)? Use aspas duplas: `"copo d'água"`.
3. Não mude o nome antes dos dois-pontos (`titulo:`, `descricao:`, `tags:` ...).

## 3. Adicionar um projeto
Em `data/conteudo.ts`, dentro de `export const projetos: Projeto[] = [ ... ]`, copie um bloco inteiro e cole logo depois
dele (lembre da **vírgula** entre os blocos):

```ts
  {
    titulo: 'Nome do projeto',          // único: não repita o título de outro projeto
    descricao: 'O que ele faz, em 1 ou 2 frases.',
    tags: ['Vue', 'Tailwind'],          // quantas quiser, cada uma entre aspas
    kanji: '新',                         // um caractere decorativo do card
    link: 'https://github.com/voce/projeto'   // opcional: pode apagar a linha ou deixar ''
  },
```
O card novo aparece sozinho na seção Projetos. O mesmo vale para `certificados` (campos: `titulo`, `emissor`, `periodo`, `detalhes`, `tags`, `arquivo` = PDF em `public/certificados/`, `miniatura` = imagem em `public/certificados/miniaturas/`, `online` = link de verificação),
`softSkills` (`titulo`, `texto`) e `tecnologias` (`nome`, `area`, `forte`).

## 4. Trocar a foto
Salve a nova imagem como `public/imagens/fotominha.png` (quadrada ou quase, ~800 px). Atualize a página com Ctrl+F5.

## 5. Erros comuns e o que fazer
| Sintoma | Causa provável |
|---|---|
| Página branca / erro "Unexpected token" | faltou uma **vírgula** entre blocos, ou uma aspa sem fechar |
| Card de projeto sumiu ou repetiu | dois projetos com o **mesmo `titulo`** |
| Texto cortado/estranho | apóstrofo dentro de aspas simples (use aspas duplas) |
| Imagem não aparece | o caminho começa com `/imagens/...` e o arquivo está em `public/imagens/` |
| A tela do notebook 3D mostra o texto antigo | atualize a página (Ctrl+F5): ela é desenhada ao carregar |

## 6. Publicar
`npm run build` gera a versão final; se o build passar sem erro, está seguro para publicar.
