// Cena 3D: mesa de trabalho num café/izakaya (monitor em braço articulado, teclado 60%, mouse,
// planta e xícara), parede de ripas, janela com a rua desfocada e lanternas de papel em tons quentes.
// Tudo é gerado por código (sem arquivos de modelo). A câmera percorre um caminho
// controlado por `setProgress(0..1)`, que o GSAP/ScrollTrigger atualiza a cada rolagem.
import { perfil, navegacao } from '~/data/conteudo'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

export interface LaptopScene {
  setProgress: (p: number) => void
  setPointer: (x: number, y: number) => void
  setActive: (ativo: boolean) => void
  resize: () => void
  dispose: () => void
}

const FOV = 40
const LARGURA_TELA = 3.2
const ALTURA_TELA = 2.0
// iPhone da variante de celular: 70% do tamanho original
const ESCALA_CELULAR = 0.7
const ABERTURA_TAMPA = THREE.MathUtils.degToRad(105)

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// gerador pseudoaleatório estável (a cena fica igual a cada visita)
function aleatorio(semente: number) {
  let s = semente
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/* ---------------------------------------------------------------- texturas */

/* ------------------------------------------------- texturas do ambiente */

// Mesa de madeira acinzentada, com veios finos na horizontal (laminado de escritório).
function texturaMesa(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 2048
  c.height = 1024
  const ctx = c.getContext('2d')!
  const rnd = aleatorio(7)
  ctx.fillStyle = '#5b4b47'
  ctx.fillRect(0, 0, 2048, 1024)
  // faixas largas de tom, para quebrar a uniformidade
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = rnd() > 0.5 ? `rgba(120,100,94,${0.04 + rnd() * 0.06})` : `rgba(30,20,20,${0.05 + rnd() * 0.08})`
    ctx.fillRect(0, rnd() * 1024, 2048, 6 + rnd() * 26)
  }
  // veios finos
  for (let i = 0; i < 1100; i++) {
    const claro = rnd() > 0.5
    ctx.strokeStyle = claro ? `rgba(160,138,130,${0.05 + rnd() * 0.13})` : `rgba(28,18,18,${0.08 + rnd() * 0.2})`
    ctx.lineWidth = 0.6 + rnd() * 1.6
    const y = rnd() * 1024
    const x0 = rnd() * 2048
    ctx.beginPath()
    ctx.moveTo(x0, y)
    ctx.lineTo(x0 + 250 + rnd() * 1600, y + (rnd() - 0.5) * 3)
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(2, 1)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// Parede de café/izakaya: reboco quente em cima, ripas de madeira escura embaixo.
function texturaParede(): THREE.CanvasTexture {
  const W = 2048
  const H = 1024
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')!
  const rnd = aleatorio(11)
  const gesso = Math.round(H * 0.7)
  const g = ctx.createLinearGradient(0, 0, 0, gesso)
  g.addColorStop(0, '#a89477')
  g.addColorStop(1, '#c4b190')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, gesso)
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = rnd() > 0.5 ? `rgba(255,243,220,${0.02 + rnd() * 0.04})` : `rgba(90,65,40,${0.02 + rnd() * 0.04})`
    const r = 2 + rnd() * 10
    ctx.fillRect(rnd() * W, rnd() * gesso, r, r)
  }
  const ripa = 34
  for (let x = 0; x < W; x += ripa) {
    const tom = 40 + Math.floor(rnd() * 22)
    ctx.fillStyle = `rgb(${tom + 24},${tom + 2},${tom - 14})`
    ctx.fillRect(x, gesso, ripa - 3, H - gesso)
    ctx.fillStyle = '#120b07'
    ctx.fillRect(x + ripa - 3, gesso, 3, H - gesso)
    for (let j = 0; j < 4; j++) {
      ctx.strokeStyle = `rgba(0,0,0,${0.08 + rnd() * 0.12})`
      ctx.lineWidth = 1
      const vx = x + 3 + rnd() * (ripa - 9)
      ctx.beginPath()
      ctx.moveTo(vx, gesso)
      ctx.lineTo(vx + (rnd() - 0.5) * 3, H)
      ctx.stroke()
    }
  }
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ctx.fillRect(0, gesso, W, 6)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// Rua à noite, desfocada, vista pela janela (só luzes quentes, sem letreiros).
function texturaJanela(): THREE.CanvasTexture {
  const S = 1024
  const c = document.createElement('canvas')
  c.width = c.height = S
  const ctx = c.getContext('2d')!
  const rnd = aleatorio(23)
  const g = ctx.createLinearGradient(0, 0, 0, S)
  g.addColorStop(0, '#1d1a26')
  g.addColorStop(0.55, '#33242a')
  g.addColorStop(1, '#4a2d22')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, S, S)
  // silhuetas de prédios
  for (let i = 0; i < 9; i++) {
    const w = 80 + rnd() * 140
    const h = 260 + rnd() * 420
    ctx.fillStyle = `rgba(14,10,12,${0.55 + rnd() * 0.3})`
    ctx.fillRect(i * 120 - 20 + rnd() * 30, S - h, w, h)
  }
  // bokeh quente
  ctx.globalCompositeOperation = 'lighter'
  const cores = ['255,176,96', '255,128,76', '255,214,160', '214,96,64', '255,190,120', '150,172,210']
  for (let i = 0; i < 110; i++) {
    const x = rnd() * S
    const y = 280 + rnd() * 720
    const r = 14 + rnd() * 52
    const cor = cores[Math.floor(rnd() * (rnd() > 0.88 ? 6 : 5))]
    const a = 0.16 + rnd() * 0.32
    const rg = ctx.createRadialGradient(x, y, 0, x, y, r)
    rg.addColorStop(0, `rgba(${cor},${a})`)
    rg.addColorStop(0.75, `rgba(${cor},${a * 0.7})`)
    rg.addColorStop(1, `rgba(${cor},0)`)
    ctx.fillStyle = rg
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalCompositeOperation = 'source-over'
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// cilindro fino ligando dois pontos (braço do monitor)
function cilindroEntre(a: THREE.Vector3, b: THREE.Vector3, raio: number, mat: THREE.Material) {
  const dir = b.clone().sub(a)
  const comprimento = dir.length()
  const m = new THREE.Mesh(new THREE.CylinderGeometry(raio, raio, comprimento, 14), mat)
  m.position.copy(a).add(b).multiplyScalar(0.5)
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
  return m
}

function carregarImagem(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

async function carregarFontes() {
  try {
    await Promise.all([
      document.fonts.load('800 80px "Shippori Mincho"'),
      document.fonts.load('80px "Great Vibes"'),
      document.fonts.load('700 40px "Zen Kaku Gothic New"')
    ])
  } catch {
    /* segue com as fontes de reserva */
  }
}

// Desenha, no canvas, uma versão da tela inicial do portfólio (é o que aparece no notebook).
function pintarTela(c: HTMLCanvasElement, foto: HTMLImageElement | null) {
  const ctx = c.getContext('2d')!
  const W = c.width
  const H = c.height

  ctx.fillStyle = '#0a0e1a'
  ctx.fillRect(0, 0, W, H)
  // scanlines + grade neon
  ctx.fillStyle = 'rgba(34,228,255,0.035)'
  for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1)
  const brilho = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, H * 0.9)
  brilho.addColorStop(0, 'rgba(34,228,255,0.10)')
  brilho.addColorStop(1, 'rgba(34,228,255,0)')
  ctx.fillStyle = brilho
  ctx.fillRect(0, 0, W, H)

  // ondas suaves
  ctx.strokeStyle = 'rgba(34,228,255,0.09)'
  ctx.lineWidth = 2
  for (let y = 190; y < H + 60; y += 40) {
    const desloc = (y / 40) % 2 === 0 ? 0 : 40
    for (let x = desloc; x < W + 80; x += 80) {
      for (const r of [38, 26, 14]) {
        ctx.beginPath()
        ctx.arc(x, y, r, Math.PI, 0)
        ctx.stroke()
      }
    }
  }

  // barra superior
  ctx.fillStyle = '#070b16'
  ctx.fillRect(0, 0, W, 150)
  ctx.fillStyle = '#22e4ff'
  ctx.fillRect(0, 150, W, 4)
  ctx.fillStyle = '#d9002f'
  ctx.fillRect(0, 154, W, 6)
  ctx.fillStyle = '#e9eefc'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '88px "Great Vibes", cursive'
  ctx.fillText(perfil.nome, W / 2, 80)

  // sol + foto
  const px = 560
  const py = 640
  const pr = 235
  const g = ctx.createRadialGradient(px + 60, py - 150, 20, px + 150, py - 100, 260)
  g.addColorStop(0, 'rgba(240,20,60,0.9)')
  g.addColorStop(1, 'rgba(217,0,47,0.5)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(px + 150, py - 100, 250, 0, Math.PI * 2)
  ctx.fill()

  ctx.save()
  ctx.beginPath()
  ctx.arc(px, py, pr, 0, Math.PI * 2)
  ctx.clip()
  if (foto) {
    const s = Math.min(foto.width, foto.height)
    const sx = (foto.width - s) / 2
    const sy = 0.15 * (foto.height - s)
    ctx.drawImage(foto, sx, sy, s, s, px - pr, py - pr, pr * 2, pr * 2)
  } else {
    ctx.fillStyle = '#1c2a4a'
    ctx.fillRect(px - pr, py - pr, pr * 2, pr * 2)
  }
  ctx.restore()
  ctx.strokeStyle = '#22e4ff'
  ctx.shadowColor = 'rgba(34,228,255,0.9)'
  ctx.shadowBlur = 30
  ctx.lineWidth = 10
  ctx.beginPath()
  ctx.arc(px, py, pr + 12, 0, Math.PI * 2)
  ctx.stroke()
  ctx.shadowBlur = 0

  // título
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  // o título é reduzido até terminar antes da coluna do menu (x = 1230), para as linhas do menu não cruzarem o nome
  const t1 = `${perfil.saudacao[0].texto} `
  const t2 = perfil.saudacao[1].texto
  const larguraMax = 1230 - 170 - 50
  let tam = 96
  ctx.font = `800 ${tam}px "Shippori Mincho", Georgia, serif`
  while (tam > 40 && ctx.measureText(t1 + t2).width > larguraMax) {
    tam -= 2
    ctx.font = `800 ${tam}px "Shippori Mincho", Georgia, serif`
  }
  ctx.fillStyle = '#e9eefc'
  ctx.fillText(t1, 170, 1050)
  const w1 = ctx.measureText(t1).width
  ctx.fillStyle = '#d9002f'
  ctx.fillText(t2, 170 + w1, 1050)
  ctx.fillStyle = '#9fb0d6'
  ctx.font = '500 44px "Zen Kaku Gothic New", system-ui, sans-serif'
  ctx.fillText(perfil.role, 170, 1125)

  // menu
  const itens: [string, string][] = navegacao.map((n) => [n.rotulo, n.jp])
  const x0 = 1230
  const x1 = 1930
  ctx.strokeStyle = 'rgba(34,228,255,0.55)'
  ctx.lineWidth = 4
  itens.forEach(([nome, jp], i) => {
    const y = 380 + i * 150
    ctx.beginPath()
    ctx.moveTo(x0, y)
    ctx.lineTo(x1, y)
    ctx.stroke()
    ctx.fillStyle = '#e9eefc'
    ctx.font = '700 60px "Shippori Mincho", Georgia, serif'
    ctx.textAlign = 'left'
    ctx.fillText(nome, x0 + 20, y + 92)
    ctx.fillStyle = '#d9002f'
    ctx.font = '700 36px "Zen Kaku Gothic New", sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(jp, x1 - 20, y + 88)
  })
  ctx.beginPath()
  ctx.moveTo(x0, 380 + itens.length * 150)
  ctx.lineTo(x1, 380 + itens.length * 150)
  ctx.stroke()
}


// Versão vertical da tela inicial, para o iPhone (variante de celular). Mesmo conteúdo do Hero.
function quebrarLinhas(ctx: CanvasRenderingContext2D, texto: string, largura: number) {
  const linhas: string[] = []
  let atual = ''
  for (const palavra of texto.split(' ')) {
    const teste = atual ? `${atual} ${palavra}` : palavra
    if (ctx.measureText(teste).width > largura && atual) {
      linhas.push(atual)
      atual = palavra
    } else atual = teste
  }
  if (atual) linhas.push(atual)
  return linhas
}

function retanguloArredondado(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function pintarTelaCelular(c: HTMLCanvasElement, foto: HTMLImageElement | null) {
  const ctx = c.getContext('2d')!
  const W = c.width
  const H = c.height
  ctx.clearRect(0, 0, W, H)
  ctx.save()
  // cantos arredondados da tela do iPhone (fora disso fica transparente)
  retanguloArredondado(ctx, 0, 0, W, H, 118)
  ctx.clip()

  ctx.fillStyle = '#0a0e1a'
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = 'rgba(34,228,255,0.035)'
  for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1)
  const brilho = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, H * 0.7)
  brilho.addColorStop(0, 'rgba(34,228,255,0.10)')
  brilho.addColorStop(1, 'rgba(34,228,255,0)')
  ctx.fillStyle = brilho
  ctx.fillRect(0, 0, W, H)

  // ondas suaves
  ctx.strokeStyle = 'rgba(34,228,255,0.09)'
  ctx.lineWidth = 2
  for (let y = 300; y < H + 60; y += 40) {
    const desloc = (y / 40) % 2 === 0 ? 0 : 40
    for (let x = desloc; x < W + 80; x += 80) {
      for (const r of [38, 26, 14]) {
        ctx.beginPath()
        ctx.arc(x, y, r, Math.PI, 0)
        ctx.stroke()
      }
    }
  }

  // barra superior (com a ilha dinâmica)
  ctx.fillStyle = '#070b16'
  ctx.fillRect(0, 0, W, 250)
  ctx.fillStyle = '#22e4ff'
  ctx.fillRect(0, 250, W, 4)
  ctx.fillStyle = '#d9002f'
  ctx.fillRect(0, 254, W, 6)
  ctx.fillStyle = '#000'
  retanguloArredondado(ctx, W / 2 - 150, 38, 300, 84, 42)
  ctx.fill()
  ctx.fillStyle = '#e9eefc'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '66px "Great Vibes", cursive'
  ctx.fillText(perfil.nome, W / 2, 190)

  // sol + foto
  const px = W / 2
  const py = 640
  const pr = 210
  const g = ctx.createRadialGradient(px + 60, py - 130, 20, px + 130, py - 90, 240)
  g.addColorStop(0, 'rgba(240,20,60,0.9)')
  g.addColorStop(1, 'rgba(217,0,47,0.5)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(px + 130, py - 90, 220, 0, Math.PI * 2)
  ctx.fill()
  ctx.save()
  ctx.beginPath()
  ctx.arc(px, py, pr, 0, Math.PI * 2)
  ctx.clip()
  if (foto) {
    const s = Math.min(foto.width, foto.height)
    const sx = (foto.width - s) / 2
    const sy = 0.15 * (foto.height - s)
    ctx.drawImage(foto, sx, sy, s, s, px - pr, py - pr, pr * 2, pr * 2)
  } else {
    ctx.fillStyle = '#1c2a4a'
    ctx.fillRect(px - pr, py - pr, pr * 2, pr * 2)
  }
  ctx.restore()
  ctx.strokeStyle = '#22e4ff'
  ctx.shadowColor = 'rgba(34,228,255,0.9)'
  ctx.shadowBlur = 30
  ctx.lineWidth = 9
  ctx.beginPath()
  ctx.arc(px, py, pr + 11, 0, Math.PI * 2)
  ctx.stroke()
  ctx.shadowBlur = 0

  // título em duas linhas, centralizado
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.font = '800 104px "Shippori Mincho", Georgia, serif'
  ctx.fillStyle = '#e9eefc'
  ctx.fillText(perfil.saudacao[0].texto, W / 2, 1010)
  ctx.fillStyle = '#d9002f'
  ctx.fillText(perfil.saudacao[1].texto, W / 2, 1125)
  ctx.fillRect(W / 2 - 300, 1160, 600, 8)

  // cargo
  ctx.fillStyle = '#9fb0d6'
  ctx.font = '500 46px "Zen Kaku Gothic New", system-ui, sans-serif'
  const linhasRole = quebrarLinhas(ctx, perfil.role, 820)
  linhasRole.forEach((l, i) => ctx.fillText(l, W / 2, 1250 + i * 62))

  // menu
  const itens: [string, string][] = navegacao.map((n) => [n.rotulo, n.jp])
  const x0 = 90
  const x1 = W - 90
  const yMenu = 1500
  ctx.strokeStyle = 'rgba(34,228,255,0.55)'
  ctx.lineWidth = 4
  itens.forEach(([nome, jp], i) => {
    const y = yMenu + i * 135
    ctx.beginPath()
    ctx.moveTo(x0, y)
    ctx.lineTo(x1, y)
    ctx.stroke()
    ctx.fillStyle = '#e9eefc'
    ctx.font = '700 58px "Shippori Mincho", Georgia, serif'
    ctx.textAlign = 'left'
    ctx.fillText(nome, x0 + 16, y + 88)
    ctx.fillStyle = '#d9002f'
    ctx.font = '700 36px "Zen Kaku Gothic New", sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(jp, x1 - 16, y + 84)
  })
  ctx.beginPath()
  ctx.moveTo(x0, yMenu + itens.length * 135)
  ctx.lineTo(x1, yMenu + itens.length * 135)
  ctx.stroke()

  // barra de gestos do iOS
  ctx.fillStyle = 'rgba(233,238,252,0.75)'
  retanguloArredondado(ctx, W / 2 - 170, H - 46, 340, 14, 7)
  ctx.fill()
  ctx.restore()
}


/* ------------------------------------------------------------------- cena */

export type VarianteCena = 'monitor' | 'celular'

export async function createLaptopScene(
  canvas: HTMLCanvasElement,
  container: HTMLElement,
  variante: VarianteCena = 'monitor'
): Promise<LaptopScene> {
  const celular = variante === 'celular'
  // tamanho da tela: monitor na horizontal ou iPhone na vertical (proporção 19,5:9)
  const larguraTela = celular ? 1.58 : LARGURA_TELA
  const alturaTela = celular ? 3.42 : ALTURA_TELA
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const COR_FUNDO = 0x140d09
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(COR_FUNDO)
  scene.fog = new THREE.FogExp2(COR_FUNDO, 0.022)

  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 80)
  const rnd = aleatorio(42)
  const dummy = new THREE.Object3D()
  const aniso = renderer.capabilities.getMaxAnisotropy()

  const madeira = texturaMesa()
  madeira.anisotropy = aniso
  const paredeTex = texturaParede()
  paredeTex.anisotropy = aniso
  const janelaTex = texturaJanela()

  const madeiraEscura = new THREE.MeshStandardMaterial({ color: 0x2a1a10, roughness: 0.7 })
  const preto = new THREE.MeshStandardMaterial({ color: 0x111214, roughness: 0.5, metalness: 0.2 })
  const grafite = new THREE.MeshStandardMaterial({ color: 0x1d1e22, roughness: 0.4, metalness: 0.65 })

  /* ambiente: parede, piso, friso, janela */
  const parede = new THREE.Mesh(new THREE.PlaneGeometry(26, 14), new THREE.MeshStandardMaterial({ map: paredeTex, roughness: 0.95 }))
  parede.position.set(0, 6.4, -3.4)
  parede.receiveShadow = true
  scene.add(parede)

  const piso = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ color: 0x1c140f, roughness: 0.9 }))
  piso.rotation.x = -Math.PI / 2
  piso.position.y = -3.3
  piso.receiveShadow = false // sem silhuetas dos objetos da mesa no chão
  scene.add(piso)

  const friso = new THREE.Mesh(new THREE.BoxGeometry(26, 0.14, 0.12), madeiraEscura)
  friso.position.set(0, 3.6, -3.34)
  scene.add(friso)

  const janela = new THREE.Group()
  janela.position.set(5.4, 3.9, -3.38)
  const vidro = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.0), new THREE.MeshBasicMaterial({ map: janelaTex, color: 0xd8cdc0 }))
  vidro.position.z = 0.01
  janela.add(vidro)
  const pecas: [number, number, number, number, number][] = [
    [3.7, 0.15, 0, 1.575, 0.18], [3.7, 0.15, 0, -1.575, 0.18],
    [0.15, 3.15, -1.775, 0, 0.18], [0.15, 3.15, 1.775, 0, 0.18],
    [0.07, 3.0, 0, 0, 0.12], [3.4, 0.07, 0, 0.2, 0.12]
  ]
  pecas.forEach(([w, h, x, y, d]) => {
    const p = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), madeiraEscura)
    p.position.set(x, y, 0.05)
    janela.add(p)
  })
  const peitoril = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.12, 0.35), madeiraEscura)
  peitoril.position.set(0, -1.65, 0.12)
  janela.add(peitoril)
  scene.add(janela)

  /* lanternas de papel (chōchin), luz quente e discreta */
  const papel = new THREE.MeshStandardMaterial({ color: 0xf1d9b0, emissive: 0xff9a4d, emissiveIntensity: 1.0, roughness: 0.9 })
  const lanternas: [number, number, number, number][] = [
    [-5.0, 3.9, -2.7, 1],
    [-6.8, 4.6, -3.0, 0.85]
  ]
  lanternas.forEach(([x, y, z, s]) => {
    const g = new THREE.Group()
    g.position.set(x, y, z)
    g.scale.setScalar(s)
    const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 18), papel)
    corpo.scale.set(1, 1.25, 1)
    const topo = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.07, 16), madeiraEscura)
    topo.position.y = 0.54
    const base = topo.clone()
    base.position.y = -0.54
    const corda = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 4, 6), madeiraEscura)
    corda.position.y = 2.58
    const foco = new THREE.PointLight(0xffa458, 26 * s, 13, 2)
    foco.position.set(0, 0, 0.5)
    g.add(corpo, topo, base, corda, foco)
    scene.add(g)
  })

  /* mesa */
  const mesa = new THREE.Mesh(
    new THREE.BoxGeometry(15, 0.3, 7),
    new THREE.MeshStandardMaterial({ map: madeira, roughness: 0.55, metalness: 0.02 })
  )
  mesa.position.set(0, -0.15, 0.3)
  mesa.receiveShadow = true
  scene.add(mesa)
  for (const [x, z] of [[-6.9, 3.5], [6.9, 3.5], [-6.9, -2.9], [6.9, -2.9]]) {
    const perna = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.0, 0.3), new THREE.MeshStandardMaterial({ color: 0x2b2220, roughness: 0.7 }))
    perna.position.set(x, -1.8, z)
    scene.add(perna)
  }

  /* objetos sobre a mesa (todos projetam sombra) */
  const props = new THREE.Group()
  scene.add(props)

  // iPhone + suporte ficam num grupo reduzido a 70%; a origem do grupo é o ponto de apoio na mesa
  const grupoCelular = new THREE.Group()
  grupoCelular.position.set(0, 0, -0.6)
  grupoCelular.scale.setScalar(ESCALA_CELULAR)
  props.add(grupoCelular)

  // monitor em braço articulado (PC) ou iPhone num suporte (celular)
  const monitor = new THREE.Group()
  if (celular) {
    monitor.position.set(0, 1.96, -0.35)
    monitor.rotation.x = -0.22
  } else {
    monitor.position.set(0, 2.15, -1.25)
    monitor.rotation.x = -0.04
  }
  ;(celular ? grupoCelular : props).add(monitor)

  if (celular) {
    const titanio = new THREE.MeshStandardMaterial({ color: 0x2b2c31, roughness: 0.32, metalness: 0.85 })
    const corpo = new THREE.Mesh(new RoundedBoxGeometry(larguraTela + 0.14, alturaTela + 0.14, 0.14, 5, 0.24), titanio)
    monitor.add(corpo)
    // botões laterais: ação e volume à esquerda, power à direita
    const botoes: [number, number, number][] = [[-1, 1.0, 0.22], [-1, 0.55, 0.4], [-1, 0.05, 0.4], [1, 0.45, 0.62]]
    botoes.forEach(([lado, y, h]) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.035, h, 0.07), titanio)
      b.position.set(lado * (larguraTela / 2 + 0.085), y, 0)
      monitor.add(b)
    })
  } else {
    const carcaca = new THREE.Mesh(new RoundedBoxGeometry(LARGURA_TELA + 0.22, ALTURA_TELA + 0.22, 0.1, 3, 0.03), preto)
    monitor.add(carcaca)
    const cabeca = new THREE.Mesh(new RoundedBoxGeometry(0.55, 0.55, 0.1, 2, 0.02), grafite)
    cabeca.position.z = -0.1
    monitor.add(cabeca)
  }

  const telaCanvas = document.createElement('canvas')
  telaCanvas.width = celular ? 1024 : 2048
  telaCanvas.height = celular ? 2216 : 1280
  const pintar = celular ? pintarTelaCelular : pintarTela
  pintar(telaCanvas, null)
  const telaTex = new THREE.CanvasTexture(telaCanvas)
  telaTex.colorSpace = THREE.SRGBColorSpace
  telaTex.anisotropy = aniso
  const tela = new THREE.Mesh(
    new THREE.PlaneGeometry(larguraTela, alturaTela),
    new THREE.MeshBasicMaterial({ map: telaTex, toneMapped: false, transparent: celular })
  )
  tela.position.z = celular ? 0.072 : 0.052
  monitor.add(tela)

  // quando as fontes e a foto carregarem, redesenha a tela com o visual final
  Promise.all([carregarFontes(), carregarImagem('/imagens/fotominha.png')]).then(([, foto]) => {
    pintar(telaCanvas, foto)
    telaTex.needsUpdate = true
  })

  if (celular) {
    // suporte: base na mesa, apoio frontal para o iPhone e haste inclinada atrás
    const base = new THREE.Mesh(new RoundedBoxGeometry(2.0, 0.1, 1.3, 3, 0.04), grafite)
    base.position.set(0, 0.05, -0.35)
    const apoio = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.26, 0.16, 3, 0.05), grafite)
    apoio.position.set(0, 0.23, 0.13)
    grupoCelular.add(base, apoio, cilindroEntre(new THREE.Vector3(0, 0.1, -0.9), new THREE.Vector3(0, 2.2, -0.54), 0.07, grafite))
  } else {
    // braço: base na mesa, coluna e dois segmentos até a parte de trás do monitor
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 0.1, 24), grafite)
    base.position.set(2.9, 0.05, -2.85)
    const P0 = new THREE.Vector3(2.9, 2.9, -2.85)
    const P1 = new THREE.Vector3(1.6, 2.7, -2.1)
    const P2 = new THREE.Vector3(0, 2.15, -1.43)
    props.add(base, cilindroEntre(new THREE.Vector3(2.9, 0.1, -2.85), P0, 0.09, grafite))
    props.add(cilindroEntre(P0, P1, 0.075, grafite), cilindroEntre(P1, P2, 0.075, grafite))
    for (const p of [P0, P1]) {
      const junta = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), grafite)
      junta.position.copy(p)
      props.add(junta)
    }
  }

  // teclado 60% preto
  const teclado = new THREE.Group()
  teclado.position.set(-0.1, 0, 1.15)
  teclado.rotation.x = 0.06
  teclado.rotation.y = 0.05
  if (!celular) props.add(teclado)
  const caixa = new THREE.Mesh(new RoundedBoxGeometry(2.18, 0.12, 0.8, 3, 0.03), preto)
  caixa.position.y = 0.06
  teclado.add(caixa)
  const teclas = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.125, 0.07, 0.125),
    new THREE.MeshStandardMaterial({ color: 0x1b1c1f, roughness: 0.6 }),
    64
  )
  const passo = 0.148
  let iTecla = 0
  const colocar = (x: number, z: number, escalaX = 1) => {
    dummy.position.set(x, 0.15, z)
    dummy.rotation.set(0, 0, 0)
    dummy.scale.set(escalaX, 1, 1)
    dummy.updateMatrix()
    teclas.setMatrixAt(iTecla++, dummy.matrix)
  }
  for (let r = 0; r < 4; r++) {
    for (let col = 0; col < 14; col++) colocar(-0.96 + col * passo + r * 0.012, -0.3 + r * passo)
  }
  for (let col = 0; col < 3; col++) colocar(-0.96 + col * passo + 0.05, -0.3 + 4 * passo)
  colocar(-0.96 + 6 * passo + 0.05, -0.3 + 4 * passo, 8.1)
  for (let col = 10; col < 14; col++) colocar(-0.96 + col * passo + 0.05, -0.3 + 4 * passo)
  teclado.add(teclas)

  // mouse
  const mouse = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), new THREE.MeshStandardMaterial({ color: 0x101113, roughness: 0.45 }))
  mouse.scale.set(0.2, 0.11, 0.33)
  mouse.position.set(2.5, 0.1, 1.3)
  mouse.rotation.y = 0.15
  if (!celular) props.add(mouse)

  // vasinho com planta
  const planta = new THREE.Group()
  planta.position.set(celular ? -1.65 : -3.4, 0, celular ? -1.1 : -1.7)
  const vaso = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.28, 0.6, 6), new THREE.MeshStandardMaterial({ color: 0x0e0e10, roughness: 0.55 }))
  vaso.position.y = 0.3
  planta.add(vaso)
  const forma = new THREE.Shape()
  forma.moveTo(0, 0)
  forma.quadraticCurveTo(0.26, 0.4, 0, 0.95)
  forma.quadraticCurveTo(-0.26, 0.4, 0, 0)
  const folhas = new THREE.InstancedMesh(
    new THREE.ShapeGeometry(forma),
    new THREE.MeshStandardMaterial({ color: 0x3f6c3a, roughness: 0.7, side: THREE.DoubleSide }),
    46
  )
  dummy.rotation.order = 'YZX'
  for (let i = 0; i < 46; i++) {
    dummy.position.set((rnd() - 0.5) * 0.25, 0.58, (rnd() - 0.5) * 0.25)
    dummy.rotation.set(0, rnd() * Math.PI * 2, 0.15 + rnd() * 1.0)
    const s = 0.7 + rnd() * 0.5
    dummy.scale.set(s, s, s)
    dummy.updateMatrix()
    folhas.setMatrixAt(i, dummy.matrix)
  }
  dummy.rotation.order = 'XYZ'
  planta.add(folhas)
  props.add(planta)

  // xícara de café com pires
  const ceramica = new THREE.MeshStandardMaterial({ color: 0xe9e2d4, roughness: 0.35 })
  const xicara = new THREE.Group()
  xicara.position.set(-2.25, 0, 0.55)
  const pires = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.3, 0.04, 28), ceramica)
  pires.position.y = 0.02
  const copo = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.24, 28, 1, true), ceramica)
  copo.material = ceramica.clone()
  ;(copo.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide
  copo.position.y = 0.16
  const fundoCopo = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.02, 28), ceramica)
  fundoCopo.position.y = 0.06
  const cafe = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.185, 0.01, 28), new THREE.MeshStandardMaterial({ color: 0x3a2415, roughness: 0.2 }))
  cafe.position.y = 0.26
  const alca = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.02, 8, 16, Math.PI), ceramica)
  alca.position.set(0.2, 0.17, 0)
  alca.rotation.z = -Math.PI / 2
  xicara.add(pires, copo, fundoCopo, cafe, alca)
  if (!celular) props.add(xicara)


  /* ---------- objetos extras da mesa (só na variante de celular: chá com vapor) ---------- */
  const vapor: THREE.Sprite[] = []
  const vaporBase = new THREE.Vector3(1.2, 0.42, 0.85)
  if (celular) {
    const cerAmbar = new THREE.MeshStandardMaterial({ color: 0xe9e2d4, roughness: 0.35 })

    // 1) xícara de chá (yunomi) com pires e vapor
    const cha = new THREE.Group()
    cha.position.set(vaporBase.x, 0, vaporBase.z)
    const piresCha = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.32, 0.04, 28), cerAmbar)
    piresCha.position.y = 0.02
    const copoCha = new THREE.Mesh(
      new THREE.CylinderGeometry(0.21, 0.16, 0.34, 28, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xe9e2d4, roughness: 0.35, side: THREE.DoubleSide })
    )
    copoCha.position.y = 0.21
    const fundoCha = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.02, 28), cerAmbar)
    fundoCha.position.y = 0.05
    const faixaCha = new THREE.Mesh(new THREE.CylinderGeometry(0.195, 0.19, 0.05, 28, 1, true), new THREE.MeshStandardMaterial({ color: 0x2f5d8a, roughness: 0.4, side: THREE.DoubleSide }))
    faixaCha.position.y = 0.3
    const liquido = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.01, 28), new THREE.MeshStandardMaterial({ color: 0x8fae5a, roughness: 0.15 }))
    liquido.position.y = 0.34
    cha.add(piresCha, copoCha, fundoCha, faixaCha, liquido)
    props.add(cha)

    // vapor: sprites macios que sobem, crescem e somem (animados no laço)
    const cv = document.createElement('canvas')
    cv.width = cv.height = 64
    const cx = cv.getContext('2d')!
    const gr = cx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gr.addColorStop(0, 'rgba(255,255,255,0.9)')
    gr.addColorStop(1, 'rgba(255,255,255,0)')
    cx.fillStyle = gr
    cx.fillRect(0, 0, 64, 64)
    const vaporTex = new THREE.CanvasTexture(cv)
    for (let i = 0; i < 7; i++) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: vaporTex, transparent: true, opacity: 0, depthWrite: false, fog: false }))
      sp.position.copy(vaporBase)
      vapor.push(sp)
      props.add(sp)
    }
  }

  props.traverse((o) => {
    const m = o as THREE.Mesh
    if (m.isMesh) {
      m.castShadow = true
      m.receiveShadow = true
    }
  })
  tela.castShadow = false

  /* luzes: tudo quente e natural, com um toque frio vindo da janela */
  scene.add(new THREE.HemisphereLight(0xffe6c8, 0x2a1b12, 0.9))

  const principal = new THREE.SpotLight(0xffddb0, 700, 34, 0.5, 0.9, 2)
  principal.position.set(1.5, 9, 6.5)
  principal.target.position.set(0, 0.4, -0.8)
  principal.castShadow = true
  principal.shadow.mapSize.set(2048, 2048)
  principal.shadow.bias = -0.0004
  scene.add(principal, principal.target)

  const luzJanela = new THREE.PointLight(0x9db4d8, 16, 12, 2)
  luzJanela.position.set(5.4, 3.9, -2.2)
  scene.add(luzJanela)

  const brilhoTela = new THREE.PointLight(0xe4ecff, 8, 6, 2)
  brilhoTela.position.set(0, 1.7, 0.3)
  scene.add(brilhoTela)

  /* câmera: do plano aberto até preencher a tela */
  const alvoInicio = new THREE.Vector3(0, 1.5, 0)
  const posInicio = new THREE.Vector3()
  const posFim = new THREE.Vector3()
  const alvoFim = new THREE.Vector3()
  const posAtual = new THREE.Vector3()
  const alvoAtual = new THREE.Vector3()
  const ponteiro = { x: 0, y: 0, sx: 0, sy: 0 }
  let progresso = 0
  let ativo = true
  let raf = 0

  function calcularCaminho() {
    const aspecto = camera.aspect
    const tan = Math.tan(THREE.MathUtils.degToRad(FOV / 2))

    // início: afasta mais em telas estreitas (celular em pé) para monitor e teclado caberem
    const fator = Math.max(1, (celular ? 4.4 : 4.8) / (2 * tan * 7.6 * aspecto))
    posInicio.set(0, 3.1, 7.6).sub(alvoInicio).multiplyScalar(fator).add(alvoInicio)

    // fim: a tela preenche toda a janela (modo "cover")
    tela.updateWorldMatrix(true, false)
    const centro = tela.getWorldPosition(new THREE.Vector3())
    const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(tela.getWorldQuaternion(new THREE.Quaternion())).normalize()
    const k = celular ? ESCALA_CELULAR : 1
    const cobrir = Math.min(alturaTela * k, (larguraTela * k) / aspecto)
    const dist = (cobrir / (2 * tan)) * 0.97
    posFim.copy(centro).addScaledVector(normal, dist)
    alvoFim.copy(centro)
  }

  function aplicarCamera() {
    const t = easeInOutCubic(progresso)
    posAtual.lerpVectors(posInicio, posFim, t)
    alvoAtual.lerpVectors(alvoInicio, alvoFim, t)
    const peso = 1 - Math.min(1, progresso * 4) // paralaxe do mouse só no começo
    camera.position.set(posAtual.x + ponteiro.sx * 0.55 * peso, posAtual.y + ponteiro.sy * -0.25 * peso, posAtual.z)
    camera.lookAt(alvoAtual)
    monitor.rotation.y = (1 - t) * -0.08
    brilhoTela.intensity = 8 + t * 14
  }

  function resize() {
    const w = Math.max(1, container.clientWidth)
    const h = Math.max(1, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    monitor.rotation.y = 0
    scene.updateMatrixWorld(true)
    calcularCaminho()
    aplicarCamera()
  }

  const observador = new ResizeObserver(resize)
  observador.observe(container)
  resize()

  function laco() {
    raf = requestAnimationFrame(laco)
    if (!ativo) return
    ponteiro.sx += (ponteiro.x - ponteiro.sx) * 0.06
    ponteiro.sy += (ponteiro.y - ponteiro.sy) * 0.06
    aplicarCamera()
    if (vapor.length) {
      const t = performance.now() / 1000
      vapor.forEach((sp, i) => {
        const ciclo = (t * 0.22 + i / vapor.length) % 1
        sp.position.set(vaporBase.x + Math.sin(t * 1.3 + i * 2.1) * 0.07 * (0.3 + ciclo), vaporBase.y + ciclo * 0.95, vaporBase.z)
        sp.scale.setScalar(0.2 + ciclo * 0.5)
        ;(sp.material as THREE.SpriteMaterial).opacity = Math.sin(Math.PI * ciclo) * 0.3
      })
    }
    renderer.render(scene, camera)
  }
  laco()

  return {
    setProgress(p: number) {
      progresso = Math.min(1, Math.max(0, p))
    },
    setPointer(x: number, y: number) {
      ponteiro.x = x
      ponteiro.y = y
    },
    setActive(v: boolean) {
      ativo = v
    },
    resize,
    dispose() {
      cancelAnimationFrame(raf)
      observador.disconnect()
      scene.traverse((obj) => {
        const m = obj as THREE.Mesh
        if (m.geometry) m.geometry.dispose()
        const mat = m.material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
        else mat?.dispose()
      })
      madeira.dispose()
      paredeTex.dispose()
      janelaTex.dispose()
      telaTex.dispose()
      renderer.dispose()
    }
  }
}
