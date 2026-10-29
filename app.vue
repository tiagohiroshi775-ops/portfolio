<template>
  <div>
    <SakuraPetals />
    <LanternCorner lado="esq" />
    <LanternCorner lado="dir" kanji="光" />
    <TopBar />

    <!-- Cena 3D do notebook + zoom na tela (seção fixa durante a rolagem) -->
    <IntroLaptop />

    <main class="fundo-ondas relative z-10 pb-6 pt-16">
      <div class="mx-auto w-[min(1120px,calc(100%-2rem))]">
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <CertificatesSection />
        <ContactSection />
      </div>
    </main>

    <SiteFooter />
  </div>
</template>
