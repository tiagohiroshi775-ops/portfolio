// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  build: { transpile: ['three'] },
  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      title: 'Tiago Hiroshi Abe Da Silva | Portfólio',
      meta: [
        { name: 'description', content: 'Portfólio de Tiago Hiroshi Abe Da Silva, desenvolvedor frontend em formação: animações, experiências visuais imersivas, Vue/Nuxt, GSAP e Three.js.' },
        { name: 'theme-color', content: '#14213d' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;700;800&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=Great+Vibes&display=swap'
        }
      ],
      noscript: [
        // sem JavaScript, o portfólio aparece direto (sem a cena do notebook)
        { innerHTML: '.portal{opacity:1!important;visibility:visible!important}.intro-cena,.intro-dica{display:none!important}header[style]{clip-path:none!important}' }
      ]
    }
  }
})
