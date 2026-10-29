import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {
      colors: {
        washi: '#f4e8cf',   // papel washi
        claro: '#fff8e8',   // papel claro (cards)
        shu: '#d9002f',     // vermelho do sol nascente
        'shu-escuro': '#a80022',
        ai: '#070b16',      // fundo de barras/rodapé (azul-noite)
        ouro: '#e0a419',    // dourado
        sumi: '#14110f',    // preto carvão
        madeira: '#7a4a24',
        linha: '#c9b48a',
        painel: '#0e1426',  // cards e seções (tema escuro)
        texto: '#e9eefc',   // texto principal
        suave: '#9fb0d6',   // texto secundário
        borda: '#2b3a66',   // bordas
        neon: '#22e4ff',    // ciano neon
        rosa: '#ff2bd6'     // magenta neon
      },
      boxShadow: {
        neon: '0 0 24px rgba(34,228,255,0.35)',
        'neon-shu': '0 0 28px rgba(255,31,75,0.45)'
      },
      fontFamily: {
        mincho: ['"Shippori Mincho"', '"Hiragino Mincho ProN"', '"Yu Mincho"', 'Georgia', 'serif'],
        kaku: ['"Zen Kaku Gothic New"', '"Hiragino Sans"', '"Yu Gothic"', 'system-ui', 'sans-serif'],
        cursiva: ['"Great Vibes"', '"Brush Script MT"', 'cursive']
      }
    }
  }
} satisfies Config
