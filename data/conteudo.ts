// ============================================================
//  TODO O TEXTO DO SITE FICA AQUI. Edite à vontade.
//  Itens marcados com "EDITAR" são exemplos para você trocar
//  pelos seus dados reais.
// ============================================================

// ------------------------------------------------------------
//  REGRAS PARA EDITAR SEM QUEBRAR (veja também COMO-EDITAR.md):
//   • Cada item é um bloco { ... } e blocos são separados por VÍRGULA.
//   • Textos ficam entre aspas simples '...'. Se o texto tiver apóstrofo
//     (d'água), use aspas duplas "..." ou escreva \' .
//   • Troque só o que está DENTRO das aspas; não mude os nomes antes dos ":".
//   • O título de cada projeto não pode se repetir.
// ------------------------------------------------------------
export interface Projeto { titulo: string; descricao: string; tags: string[]; kanji: string; link?: string; imagem?: string }
export interface Marco { titulo: string; subtitulo: string; periodo: string; detalhes: string; arquivo?: string }
export interface Certificado {
  titulo: string; emissor: string; periodo: string; detalhes: string
  tags: string[]
  arquivo: string      // PDF para baixar (em public/certificados/)
  miniatura: string    // imagem pequena de prévia (em public/certificados/miniaturas/)
  online?: string      // link de verificação online (deixe '' se não houver)
}
export interface Contato { rotulo: string; valor: string; href: string }

export const perfil = {
  nome: 'Tiago Hiroshi Abe Da Silva',
  nomeCurto: 'Tiago Hiroshi',
  saudacao: [
    { texto: 'olá, eu sou o', destaque: false },
    { texto: 'Tiago Hiroshi', destaque: true }
  ],
  role: 'estudante de desenvolvimento de sistemas front-end e back-end',
  // EDITAR: o estúdio LIG Inc. (Tóquio/Kawasaki) é a INSPIRAÇÃO visual do site.
  // Só escreva que você trabalha ou mora lá se isso for verdade.
  tagline:
    'Desenvolvedor Frontend em formação. Estudo desenvolvimento de sistemas no SENAI Morvan Figueiredo (Mooca), em São Paulo, e me inspiro nos estúdios japoneses para criar animações fluidas e experiências visuais imersivas.',
  foco: ['Animações de alta performance', 'Experiências visuais imersivas', 'Vue / Nuxt', 'GSAP', 'Three.js', 'MicroCMS']
}

export const navegacao = [
  { id: 'sobremim', rotulo: 'Sobre mim', jp: '自己紹介', kanji: '私' },
  { id: 'projetos', rotulo: 'Projetos', jp: '作品', kanji: '作' },
  { id: 'certificados', rotulo: 'Certificados', jp: '資格', kanji: '証' },
  { id: 'habilidades', rotulo: 'Soft Skills', jp: '強み', kanji: '強' }
]

export const sobre = {
  paragrafos: [
    'Meu nome é Tiago Hiroshi, sou estudante do SENAI Morvan Figueiredo, na Mooca. Atualmente estou fazendo o curso de desenvolvimento de sistemas e alguns outros cursos à parte do SENAI. Lá já aprendemos o básico para mexer em computadores e diversas outras coisas.',
    'Gosto de transformar interfaces em experiências: movimento com propósito, tipografia cuidadosa e a estética japonesa, tradicional e moderna, como fio condutor.'
  ],
  blocos: [
    { titulo: 'Formação', texto: 'Desenvolvimento de sistemas no SENAI Morvan Figueiredo (Mooca), além de outros cursos à parte.' },
    { titulo: 'Em foco', texto: 'Front-end com animações de alta performance e experiências visuais imersivas, sem deixar o back-end de lado.' },
    { titulo: 'Tecnologias', texto: 'Vue / Nuxt, TypeScript, GSAP, Three.js, Tailwind CSS, MicroCMS e noções de nuvem com AWS.' }
  ]
}

export interface SoftSkill { titulo: string; texto: string }

export const softSkills: SoftSkill[] = [
  { titulo: 'Aprendizado contínuo', texto: 'Aprendo rápido e mantenho o ritmo: vários cursos e certificados concluídos em 2026, além do curso técnico.' },
  { titulo: 'Autonomia nos estudos', texto: 'Busco documentação, testo e crio projetos próprios para fixar o que aprendo.' },
  { titulo: 'Atenção a detalhes', texto: 'Cuido de alinhamento, tipografia e movimento para a interface parecer feita com intenção.' },
  { titulo: 'Resolução de problemas', texto: 'Divido o erro em partes pequenas, investigo a causa e só então ajusto o código.' },
  { titulo: 'Organização e prazos', texto: 'Planejo as tarefas em etapas e entrego no tempo combinado.' },
  { titulo: 'Comunicação', texto: 'Explico o que fiz de forma clara e recebo feedback para melhorar.' }
]

// Cada tecnologia vira um quadradinho com ícone. Ordem dos ícones tentados:
//  1) `dev`: Devicon (colorido), pasta/arquivo, ex.: 'html5/html5-original'
//  2) `icone`: Simple Icons (uma cor, a da marca), tentados em ordem
//  3) sem ícone: mostra o nome escrito
export interface Tecnologia { nome: string; area: string; forte: string; cor: string; dev?: string; icone: string[] }

// EDITAR: ajuste o texto de cada tecnologia para o seu nível real.
export const tecnologias: Tecnologia[] = [
  { nome: 'HTML', area: 'Base', forte: 'Estruturação semântica das páginas: a base de todos os meus projetos.', cor: '#E34F26', dev: 'html5/html5-original', icone: ['html5'] },
  { nome: 'CSS', area: 'Base', forte: 'Estilização, layouts responsivos e animações em CSS puro.', cor: '#1572B6', dev: 'css3/css3-original', icone: ['css3', 'css'] },
  { nome: 'JavaScript', area: 'Base', forte: 'Interatividade e lógica no navegador, a linguagem por trás dos meus projetos.', cor: '#F7DF1E', dev: 'javascript/javascript-original', icone: ['javascript'] },
  { nome: 'Vue / Nuxt', area: 'Front-end', forte: 'Interfaces em componentes reutilizáveis e rotas simples; usado neste portfólio.', cor: '#4FC08D', dev: 'vuejs/vuejs-original', icone: ['vuedotjs', 'vuejs'] },
  { nome: 'React', area: 'Front-end', forte: 'Componentes e estado para telas dinâmicas e fáceis de manter.', cor: '#61DAFB', dev: 'react/react-original', icone: ['react'] },
  { nome: 'GSAP', area: 'Animação', forte: 'Animações em sequência e acionadas pela rolagem, com ótimo desempenho.', cor: '#88CE02', icone: ['gsap', 'greensock'] },
  { nome: 'Three.js', area: '3D', forte: 'Cenas 3D no navegador, como o notebook interativo da abertura.', cor: '#E9EEFC', icone: ['threedotjs', 'threejs'] },
  { nome: 'Tailwind CSS', area: 'Estilo', forte: 'Layouts responsivos e consistentes, escritos direto no HTML.', cor: '#06B6D4', dev: 'tailwindcss/tailwindcss-original', icone: ['tailwindcss'] },
  { nome: 'Bootstrap', area: 'Estilo', forte: 'Grid e componentes prontos para montar páginas responsivas com rapidez.', cor: '#7952B3', dev: 'bootstrap/bootstrap-original', icone: ['bootstrap'] },
  { nome: 'Animate.css', area: 'Animação', forte: 'Animações de entrada e destaque aplicadas só com uma classe CSS.', cor: '#FF4D6D', icone: ['animatedotcss', 'animatecss'] },
  { nome: 'jQuery', area: 'JavaScript', forte: 'Manipulação do DOM, eventos e efeitos com pouco código.', cor: '#0769AD', dev: 'jquery/jquery-original', icone: ['jquery'] },
  { nome: 'Wix + Velo', area: 'Sites', forte: 'Sites publicados rápido, com código Velo (JavaScript) para animações e lógica.', cor: '#4C8DFF', icone: ['wix'] },
  { nome: 'Figma', area: 'Design', forte: 'Protótipos e layout das telas antes de programar, alinhando visual e código.', cor: '#F24E1E', dev: 'figma/figma-original', icone: ['figma'] },
  { nome: 'TypeScript', area: 'JavaScript', forte: 'JavaScript com tipos, que evita erros e deixa o código deste portfólio mais seguro de editar.', cor: '#3178C6', dev: 'typescript/typescript-original', icone: ['typescript'] },
  { nome: 'AWS', area: 'Nuvem', forte: 'Conceitos de computação em nuvem e dos principais serviços da AWS (certificação Cloud Practitioner Essentials).', cor: '#FF9900', icone: ['amazonwebservices', 'amazonaws'] },
  { nome: 'Git', area: 'Versionamento', forte: 'Histórico do código em commits, para testar mudanças sem medo de quebrar o projeto.', cor: '#F05032', dev: 'git/git-original', icone: ['git'] },
  { nome: 'GitHub', area: 'Versionamento', forte: 'Repositórios online para guardar projetos e compartilhar o código.', cor: '#E9EEFC', icone: ['github'] },
  { nome: 'Vercel', area: 'Deploy', forte: 'Publicação de sites com link público, como o OmniEsports.', cor: '#E9EEFC', icone: ['vercel'] },
  { nome: 'Expo Go', area: 'Mobile', forte: 'Teste de apps React Native direto no celular, em tempo real.', cor: '#E9EEFC', icone: ['expo'] }
]

export const certificados: Certificado[] = [
  {
    titulo: 'HTML Essentials',
    emissor: 'Cisco Networking Academy · JS Institute',
    periodo: 'Concluído em 07/05/2026',
    detalhes: 'Fundamentos de HTML: estrutura semântica de páginas, textos, links, imagens, listas, tabelas e formulários.',
    tags: ['HTML', 'Front-end'],
    arquivo: '/certificados/html-essentials.pdf',
    miniatura: '/certificados/miniaturas/html-essentials.jpg',
    online: 'https://www.netacad.com/recognitions/verify/1a46ac0c-f881-4f0e-9f7d-958df6af3948'
  },
  {
    titulo: 'AWS Cloud Practitioner Essentials (Português)',
    emissor: 'AWS Training & Certification',
    periodo: 'Concluído em 14/05/2026',
    detalhes: 'Conceitos essenciais de computação em nuvem e da plataforma AWS: serviços principais, segurança, arquitetura, preços e suporte.',
    tags: ['AWS', 'Cloud'],
    arquivo: '/certificados/aws-cloud-practitioner-essentials.pdf',
    miniatura: '/certificados/miniaturas/aws-cloud-practitioner-essentials.jpg',
    // EDITAR: se tiver o link do certificado no AWS Skill Builder ou no Credly, cole aqui.
    online: ''
  },
  {
    titulo: 'JavaScript Essentials 1',
    emissor: 'Cisco Networking Academy · JS Institute',
    periodo: 'Concluído em 19/08/2026',
    detalhes: 'Fundamentos da linguagem JavaScript: variáveis, tipos de dados, operadores, estruturas de decisão e repetição, funções e arrays.',
    tags: ['JavaScript', 'Front-end'],
    arquivo: '/certificados/javascript-essentials-1.pdf',
    miniatura: '/certificados/miniaturas/javascript-essentials-1.jpg',
    online: 'https://www.netacad.com/recognitions/verify/51a91762-3e0b-45b8-ab4f-85babb587f5b'
  }
]

// Foto de fundo do card: salve a imagem em public/imagens/projetos/ e preencha `imagem`
// (ex.: '/imagens/projetos/omni-esports.png'). Deixe '' para não usar foto.
export const projetos: Projeto[] = [
  {
    titulo: 'Portfólio Imersivo',
    descricao: 'Este site: cena 3D interativa, com monitor no computador e iPhone no celular. A rolagem dá zoom na mesa até entrar na tela do portfólio.',
    tags: ['Nuxt', 'GSAP', 'Three.js', 'Tailwind'],
    kanji: '作',
    link: 'https://portfolio-six-vert-ukpcph6w5k.vercel.app',
    imagem: '/imagens/projetos/portfolio-imersivo.jpg'
  },
  {
    titulo: 'OmniEsports',
    descricao: 'Central de e-sports com notícias, lançamentos, campeonatos por gênero (FPS, MOBA, Battle Royale e luta) e partidas ao vivo.',
    tags: ['HTML', 'CSS', 'Bootstrap', 'Vercel'],
    kanji: '競',
    link: 'https://omni-esports-games.vercel.app',
    imagem: '/imagens/projetos/omni-esports.png'
  },
  {
    titulo: 'Hybrid Tech',
    descricao: 'Projeto semestral no Figma: vitrine de hardware que explica termos técnicos, compara produtos e checa a compatibilidade de componentes.',
    tags: ['Figma', 'UI/UX', 'E-commerce'],
    kanji: '技',
    link: 'https://www.figma.com/design/MptNRFhaNt2JipyPjc1bgB/Vitrine-Hardwares-Projeto-Semestral?node-id=0-1&t=MjIuemxRrpQKDRgQ-1',
    imagem: '/imagens/projetos/hybrid-tech.png'
  },
  {
    titulo: 'Minha Postura Profissional',
    descricao: 'Landing page do Manual de Boas Práticas Profissionais da escola: orienta os alunos sobre postura profissional dentro e fora da sala de aula, mostrando como atitudes do dia a dia refletem a preparação para o mercado de trabalho.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    kanji: '学',
    link: 'https://posturaprofissional-54ascf2q0-tiago-801f.vercel.app',
    imagem: '/imagens/projetos/postura-profissional.jpg'
  }
]

export const contatos: Contato[] = [
  { rotulo: 'E-mail', valor: 'tiagohiroshi775@hotmail.com', href: 'mailto:tiagohiroshi775@hotmail.com' },
  { rotulo: 'GitHub', valor: 'github.com/tiagohiroshi775-ops', href: 'https://github.com/tiagohiroshi775-ops' },
  { rotulo: 'LinkedIn', valor: 'in/tiago-hiroshi-801b303b1', href: 'https://www.linkedin.com/in/tiago-hiroshi-801b303b1/' }
]
