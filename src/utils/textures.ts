import * as THREE from 'three'
import { THEME_COLORS, type Theme } from '../theme/ThemeContext'

function makeCanvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  return { c, ctx }
}

function paperFill(ctx: CanvasRenderingContext2D, w: number, h: number, tint: string) {
  ctx.fillStyle = tint
  ctx.fillRect(0, 0, w, h)
  const img = ctx.getImageData(0, 0, w, h)
  const d = img.data
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 18
    d[i] = Math.min(255, Math.max(0, d[i] + n))
    d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + n))
    d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + n))
  }
  ctx.putImageData(img, 0, 0)
}

function sketchStroke(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  wobble = 1.2, width = 1.4,
  ink = '#1a1a1a',
) {
  ctx.beginPath()
  ctx.lineWidth = width
  ctx.strokeStyle = ink
  ctx.lineCap = 'round'
  const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * wobble * 4
  const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * wobble * 4
  ctx.moveTo(x1 + (Math.random() - 0.5) * wobble, y1 + (Math.random() - 0.5) * wobble)
  ctx.quadraticCurveTo(midX, midY, x2 + (Math.random() - 0.5) * wobble, y2 + (Math.random() - 0.5) * wobble)
  ctx.stroke()
}

function P(theme: Theme) {
  return THEME_COLORS[theme]
}

/** Richer hand-drawn brick with mortar gaps + hatching */
export function brickTexture(w = 1024, h = 1024, theme: Theme = 'dark'): THREE.CanvasTexture {
  const p = P(theme)
  const { c, ctx } = makeCanvas(w, h)
  paperFill(ctx, w, h, p.brickPaper)
  ctx.fillStyle = p.brickMortar
  ctx.globalAlpha = 0.4
  ctx.fillRect(0, 0, w, h)
  ctx.globalAlpha = 1

  const rows = 14
  const cols = 10
  const bh = h / rows
  const bw = w / cols
  for (let r = 0; r < rows; r++) {
    const offset = r % 2 === 0 ? 0 : bw / 2
    for (let col = -1; col <= cols; col++) {
      const x = col * bw + offset + (Math.random() - 0.5) * 2
      const y = r * bh + (Math.random() - 0.5) * 1.5
      const pad = 2 + Math.random()
      ctx.fillStyle = Math.random() > 0.5 ? p.brickFaceA : p.brickFaceB
      ctx.fillRect(x + pad, y + pad, bw - pad * 2, bh - pad * 2)
      sketchStroke(ctx, x + pad, y + pad, x + bw - pad, y + pad, 1.2, 1.6, p.ink)
      sketchStroke(ctx, x + pad, y + bh - pad, x + bw - pad, y + bh - pad, 1.2, 1.6, p.ink)
      sketchStroke(ctx, x + pad, y + pad, x + pad, y + bh - pad, 1.2, 1.6, p.ink)
      sketchStroke(ctx, x + bw - pad, y + pad, x + bw - pad, y + bh - pad, 1.2, 1.6, p.ink)
      if (Math.random() > 0.2) {
        ctx.globalAlpha = 0.32
        const n = 3 + Math.floor(Math.random() * 5)
        for (let i = 0; i < n; i++) {
          sketchStroke(
            ctx,
            x + 6, y + 5 + i * ((bh - 12) / n),
            x + bw - 6, y + 7 + i * ((bh - 12) / n),
            0.8, 0.9, p.ink,
          )
        }
        if (Math.random() > 0.55) {
          for (let i = 0; i < 3; i++) {
            sketchStroke(
              ctx,
              x + 8 + i * 6, y + bh * 0.3,
              x + 18 + i * 6, y + bh * 0.7,
              0.5, 0.7, p.ink,
            )
          }
        }
        ctx.globalAlpha = 1
      }
      if (Math.random() > 0.82) {
        sketchStroke(ctx, x + pad, y + pad + 4, x + pad + 6, y + pad, 0.4, 1, p.ink)
      }
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** High-contrast floor planks */
export function plankTexture(w = 640, h = 1280, theme: Theme = 'dark'): THREE.CanvasTexture {
  const p = P(theme)
  const { c, ctx } = makeCanvas(w, h)
  paperFill(ctx, w, h, p.plank)
  const planks = 6
  const pw = w / planks
  for (let i = 0; i < planks; i++) {
    const x = i * pw
    if (i % 2 === 0) {
      ctx.fillStyle = p.plankA
      ctx.globalAlpha = 0.45
      ctx.fillRect(x, 0, pw, h)
      ctx.globalAlpha = 1
    } else {
      ctx.fillStyle = p.plankB
      ctx.globalAlpha = 0.35
      ctx.fillRect(x, 0, pw, h)
      ctx.globalAlpha = 1
    }
    sketchStroke(ctx, x, 0, x, h, 1.4, 2.8, p.ink)
    sketchStroke(ctx, x + 1.5, 0, x + 1.5, h, 0.6, 1.2, p.ink)
    for (let g = 0; g < 18; g++) {
      const gx = x + 10 + Math.random() * (pw - 20)
      ctx.globalAlpha = 0.45
      sketchStroke(ctx, gx, 8, gx + (Math.random() - 0.5) * 10, h - 8, 2.2, 1, p.ink)
      ctx.globalAlpha = 1
    }
    if (Math.random() > 0.35) {
      const kx = x + pw * (0.25 + Math.random() * 0.5)
      const ky = Math.random() * h
      ctx.strokeStyle = p.ink
      ctx.beginPath()
      ctx.ellipse(kx, ky, 7, 4.5, Math.random(), 0, Math.PI * 2)
      ctx.stroke()
      sketchStroke(ctx, kx - 12, ky, kx + 12, ky + 2, 1, 1, p.ink)
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(1, 5)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Paper wall with crosshatching + notebook cues */
export function paperWallTexture(w = 768, h = 768, theme: Theme = 'dark'): THREE.CanvasTexture {
  const p = P(theme)
  const { c, ctx } = makeCanvas(w, h)
  paperFill(ctx, w, h, p.wall)
  ctx.globalAlpha = 0.1
  for (let y = 0; y < h; y += 22) {
    sketchStroke(ctx, 0, y, w, y, 0.35, 0.7, p.ink)
  }
  ctx.globalAlpha = 1
  for (let patch = 0; patch < 14; patch++) {
    const bx = Math.random() * w
    const by = Math.random() * h
    const bw = 40 + Math.random() * 90
    const bh = 30 + Math.random() * 70
    ctx.globalAlpha = 0.12 + Math.random() * 0.1
    for (let i = 0; i < 8; i++) {
      sketchStroke(ctx, bx, by + i * (bh / 8), bx + bw, by + 4 + i * (bh / 8), 0.6, 0.7, p.ink)
    }
    for (let i = 0; i < 5; i++) {
      sketchStroke(ctx, bx + i * (bw / 5), by, bx + 6 + i * (bw / 5), by + bh, 0.6, 0.6, p.ink)
    }
    ctx.globalAlpha = 1
  }
  ctx.globalAlpha = 0.22
  ctx.strokeStyle = p.ink
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    if (Math.random() > 0.5) {
      ctx.beginPath()
      ctx.arc(x, y, 3 + Math.random() * 5, 0, Math.PI * 2)
      ctx.stroke()
    } else {
      sketchStroke(ctx, x, y, x + 8 + Math.random() * 12, y + (Math.random() - 0.5) * 8, 0.5, 0.8, p.ink)
    }
  }
  ctx.globalAlpha = 1
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function woodSignTexture(text: string, w = 768, h = 220, theme: Theme = 'dark'): THREE.CanvasTexture {
  const p = P(theme)
  const { c, ctx } = makeCanvas(w, h)
  paperFill(ctx, w, h, p.woodSign)
  for (let i = 0; i < 24; i++) {
    ctx.globalAlpha = 0.22
    sketchStroke(ctx, 0, 8 + i * 7, w, 10 + i * 7, 1.6, 1.1, p.ink)
    ctx.globalAlpha = 1
  }
  sketchStroke(ctx, 6, 6, w - 6, 6, 1.2, 3.2, p.ink)
  sketchStroke(ctx, 6, h - 6, w - 6, h - 6, 1.2, 3.2, p.ink)
  sketchStroke(ctx, 6, 6, 6, h - 6, 1.2, 3.2, p.ink)
  sketchStroke(ctx, w - 6, 6, w - 6, h - 6, 1.2, 3.2, p.ink)
  sketchStroke(ctx, 14, 14, w - 14, 14, 0.8, 1.2, p.ink)
  sketchStroke(ctx, 14, h - 14, w - 14, h - 14, 0.8, 1.2, p.ink)
  sketchStroke(ctx, 14, 14, 14, h - 14, 0.8, 1.2, p.ink)
  sketchStroke(ctx, w - 14, 14, w - 14, h - 14, 0.8, 1.2, p.ink)

  const fontSize = Math.min(Math.floor(h * 0.52), Math.floor((w * 0.92) / Math.max(text.length * 0.5, 4)))
  ctx.fillStyle = p.woodSignText
  ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, w / 2, h / 2 + 2)
  ctx.strokeStyle = p.ink
  ctx.lineWidth = 1.5
  ctx.strokeText(text, w / 2, h / 2 + 2)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function drawLogoBadge(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, size: number,
  bg: string, label: string, fg = '#111',
  ink = '#1a1a1a',
) {
  ctx.fillStyle = bg
  ctx.globalAlpha = 0.92
  ctx.beginPath()
  ctx.moveTo(x + 2, y)
  ctx.lineTo(x + size, y + 3)
  ctx.lineTo(x + size - 2, y + size)
  ctx.lineTo(x, y + size - 2)
  ctx.closePath()
  ctx.fill()
  ctx.globalAlpha = 1
  sketchStroke(ctx, x + 2, y, x + size, y + 3, 0.5, 1.6, ink)
  sketchStroke(ctx, x + size, y + 3, x + size - 2, y + size, 0.5, 1.6, ink)
  sketchStroke(ctx, x + size - 2, y + size, x, y + size - 2, 0.5, 1.6, ink)
  sketchStroke(ctx, x, y + size - 2, x + 2, y, 0.5, 1.6, ink)
  ctx.fillStyle = fg
  ctx.font = `bold ${Math.floor(size * 0.28)}px "Space Grotesk", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, x + size / 2, y + size / 2 + 1)
}

export function doorTexture(w = 512, h = 768, logos = true, theme: Theme = 'dark'): THREE.CanvasTexture {
  const p = P(theme)
  const { c, ctx } = makeCanvas(w, h)
  paperFill(ctx, w, h, p.doorGlass)
  ctx.fillStyle = p.doorPane
  ctx.globalAlpha = 0.55
  ctx.fillRect(18, 18, w - 36, h - 36)
  ctx.globalAlpha = 1
  sketchStroke(ctx, 10, 10, w - 10, 10, 1, 3.5, p.ink)
  sketchStroke(ctx, 10, h - 10, w - 10, h - 10, 1, 3.5, p.ink)
  sketchStroke(ctx, 10, 10, 10, h - 10, 1, 3.5, p.ink)
  sketchStroke(ctx, w - 10, 10, w - 10, h - 10, 1, 3.5, p.ink)
  sketchStroke(ctx, w / 2, 18, w / 2, h - 18, 1, 2.4, p.ink)
  sketchStroke(ctx, 18, h * 0.33, w - 18, h * 0.33, 1, 2.2, p.ink)
  sketchStroke(ctx, 18, h * 0.66, w - 18, h * 0.66, 1, 2.2, p.ink)
  ctx.strokeStyle = p.ink
  ctx.beginPath()
  ctx.arc(w * 0.78, h * 0.5, 12, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(w * 0.78, h * 0.5, 5, 0, Math.PI * 2)
  ctx.fillStyle = theme === 'dark' ? '#c8c4bc' : '#333'
  ctx.fill()
  if (logos) {
    const badges: Array<[string, string, string?]> = [
      ['#E34F26', 'HTML5'],
      ['#1572B6', 'CSS3'],
      ['#F7DF1E', 'JS', '#222'],
      ['#61DAFB', 'React', '#222'],
      ['#339933', 'Node'],
      ['#3178C6', 'TS'],
      ['#02569B', 'Flutter'],
      ['#3776AB', 'Python'],
    ]
    for (let i = 0; i < badges.length; i++) {
      const col = i % 4
      const row = Math.floor(i / 4)
      const x = 28 + col * 58 + (row % 2) * 12
      const y = 28 + row * 70
      drawLogoBadge(ctx, x, y, 48, badges[i][0], badges[i][1], badges[i][2] || '#fff', p.ink)
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Sketch poster for corridor walls */
export function posterTexture(
  title: string,
  doodle: 'star' | 'code' | 'bot' | 'heart' | 'grid' = 'star',
  w = 384,
  h = 512,
  theme: Theme = 'dark',
): THREE.CanvasTexture {
  const p = P(theme)
  const { c, ctx } = makeCanvas(w, h)
  paperFill(ctx, w, h, p.poster)
  sketchStroke(ctx, 10, 10, w - 10, 10, 1.2, 2.5, p.ink)
  sketchStroke(ctx, 10, h - 10, w - 10, h - 10, 1.2, 2.5, p.ink)
  sketchStroke(ctx, 10, 10, 10, h - 10, 1.2, 2.5, p.ink)
  sketchStroke(ctx, w - 10, 10, w - 10, h - 10, 1.2, 2.5, p.ink)
  ctx.fillStyle = p.tape
  ctx.globalAlpha = 0.75
  ctx.fillRect(w * 0.35, 4, 50, 18)
  ctx.globalAlpha = 1
  ctx.strokeStyle = p.ink
  ctx.lineWidth = 2
  const cx = w / 2
  const cy = h * 0.42
  if (doodle === 'star') {
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5
      const r = i % 2 === 0 ? 55 : 28
      const x = cx + Math.cos(a) * r
      const y = cy + Math.sin(a) * r
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.stroke()
  } else if (doodle === 'code') {
    sketchStroke(ctx, cx - 50, cy - 20, cx - 20, cy, 1, 2.5, p.ink)
    sketchStroke(ctx, cx - 20, cy, cx - 50, cy + 20, 1, 2.5, p.ink)
    sketchStroke(ctx, cx + 50, cy - 20, cx + 20, cy, 1, 2.5, p.ink)
    sketchStroke(ctx, cx + 20, cy, cx + 50, cy + 20, 1, 2.5, p.ink)
    sketchStroke(ctx, cx - 8, cy + 30, cx + 14, cy - 30, 1, 2.2, p.ink)
  } else if (doodle === 'bot') {
    ctx.strokeRect(cx - 40, cy - 30, 80, 70)
    ctx.beginPath()
    ctx.arc(cx - 18, cy - 5, 8, 0, Math.PI * 2)
    ctx.arc(cx + 18, cy - 5, 8, 0, Math.PI * 2)
    ctx.stroke()
    sketchStroke(ctx, cx - 15, cy + 20, cx + 15, cy + 20, 0.5, 2, p.ink)
    sketchStroke(ctx, cx, cy - 30, cx, cy - 48, 0.5, 2, p.ink)
  } else if (doodle === 'heart') {
    ctx.beginPath()
    ctx.moveTo(cx, cy + 30)
    ctx.bezierCurveTo(cx - 60, cy - 10, cx - 30, cy - 50, cx, cy - 20)
    ctx.bezierCurveTo(cx + 30, cy - 50, cx + 60, cy - 10, cx, cy + 30)
    ctx.stroke()
  } else {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        ctx.strokeRect(cx - 45 + i * 24, cy - 35 + j * 24, 20, 20)
      }
    }
  }
  ctx.fillStyle = p.ink
  ctx.font = 'bold 28px "Space Grotesk", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(title, w / 2, h * 0.78)
  ctx.globalAlpha = 0.15
  for (let i = 0; i < 6; i++) {
    sketchStroke(ctx, 20, h * 0.55 + i * 6, w - 20, h * 0.57 + i * 6, 0.5, 0.7, p.ink)
  }
  ctx.globalAlpha = 1
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function projectFrameTexture(
  title: string,
  subtitle: string,
  color: string,
  colored: boolean,
  w = 640,
  h = 480,
  theme: Theme = 'dark',
): THREE.CanvasTexture {
  const p = P(theme)
  const { c, ctx } = makeCanvas(w, h)
  paperFill(ctx, w, h, colored ? p.framePaper : p.frameMuted)
  sketchStroke(ctx, 16, 16, w - 16, 16, 1, 3, p.ink)
  sketchStroke(ctx, 16, h - 56, w - 16, h - 56, 1, 3, p.ink)
  sketchStroke(ctx, 16, 16, 16, h - 56, 1, 3, p.ink)
  sketchStroke(ctx, w - 16, 16, w - 16, h - 56, 1, 3, p.ink)
  if (colored) {
    ctx.fillStyle = color
    ctx.globalAlpha = 0.28
    ctx.fillRect(30, 30, w - 60, h - 100)
    ctx.globalAlpha = 1
  } else {
    ctx.fillStyle = p.frameGray
    ctx.fillRect(30, 30, w - 60, h - 100)
  }
  sketchStroke(ctx, 30, 30, w - 30, 30, 0.5, 1.4, p.ink)
  sketchStroke(ctx, 30, h - 70, w - 30, h - 70, 0.5, 1.4, p.ink)
  ctx.globalAlpha = colored ? 0.7 : 0.45
  for (let i = 0; i < 5; i++) {
    const y = 70 + i * 32
    sketchStroke(ctx, 52, y, w - 52 - Math.random() * 90, y, 0.8, 1.6, p.ink)
  }
  ctx.globalAlpha = 1
  sketchStroke(ctx, w / 2 - 36, h - 56, w / 2 + 36, h - 56, 0.5, 2.2, p.ink)
  sketchStroke(ctx, w / 2, h - 56, w / 2, h - 24, 0.5, 2.2, p.ink)
  sketchStroke(ctx, w / 2 - 58, h - 24, w / 2 + 58, h - 24, 0.5, 2.2, p.ink)

  ctx.fillStyle = p.ink
  const titleSize = title.length > 18 ? 48 : title.length > 12 ? 56 : 64
  ctx.font = `bold ${titleSize}px "Space Grotesk", sans-serif`
  ctx.textAlign = 'center'
  const short = title.length > 26 ? title.slice(0, 24) + '…' : title
  ctx.fillText(short, w / 2, h * 0.4)
  ctx.strokeStyle = p.ink
  ctx.lineWidth = 1.4
  ctx.strokeText(short, w / 2, h * 0.4)

  ctx.font = 'bold 26px "Space Grotesk", sans-serif'
  ctx.fillStyle = colored ? color : p.muted
  const sub = subtitle.length > 36 ? subtitle.slice(0, 34) + '…' : subtitle
  ctx.fillText(sub, w / 2, h * 0.55)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function wordmarkTexture(text: string, tagline: string, w = 1280, h = 640, theme: Theme = 'dark'): THREE.CanvasTexture {
  const p = P(theme)
  const { c, ctx } = makeCanvas(w, h)
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = p.wordmarkPlate
  ctx.beginPath()
  ctx.ellipse(w / 2, h / 2 - 10, 520, 210, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = p.wordmarkInk
  ctx.font = 'bold 180px "Caveat", cursive'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, w / 2, h / 2 - 48)
  ctx.strokeStyle = p.wordmarkInk
  ctx.lineWidth = 5
  ctx.strokeText(text, w / 2, h / 2 - 48)
  ctx.lineWidth = 1.8
  ctx.strokeText(text, w / 2 + 2.5, h / 2 - 45)
  ctx.globalAlpha = 0.35
  ctx.lineWidth = 1.2
  ctx.strokeText(text, w / 2 - 2, h / 2 - 50)
  ctx.globalAlpha = 1
  ctx.globalAlpha = 0.2
  for (let i = 0; i < 8; i++) {
    sketchStroke(ctx, w * 0.22, h / 2 + 20 + i * 5, w * 0.78, h / 2 + 24 + i * 5, 0.8, 1, p.ink)
  }
  ctx.globalAlpha = 1
  ctx.font = '44px "Space Grotesk", monospace'
  ctx.fillStyle = p.ink
  ctx.fillText(tagline, w / 2, h / 2 + 110)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.premultiplyAlpha = false
  return tex
}

export function infoCardTexture(
  lines: string[],
  w = 640,
  h = 800,
  accent = '#333',
  theme: Theme = 'dark',
): THREE.CanvasTexture {
  const p = P(theme)
  const { c, ctx } = makeCanvas(w, h)
  paperFill(ctx, w, h, p.infoCard)
  sketchStroke(ctx, 10, 10, w - 10, 10, 1.2, 2.8, p.ink)
  sketchStroke(ctx, 10, h - 10, w - 10, h - 10, 1.2, 2.8, p.ink)
  sketchStroke(ctx, 10, 10, 10, h - 10, 1.2, 2.8, p.ink)
  sketchStroke(ctx, w - 10, 10, w - 10, h - 10, 1.2, 2.8, p.ink)
  ctx.fillStyle = p.tape
  ctx.globalAlpha = 0.7
  ctx.fillRect(24, 14, 48, 18)
  ctx.fillRect(w - 72, 14, 48, 18)
  ctx.globalAlpha = 1
  let y = 58
  const body = theme === 'dark' ? '#c8c4bc' : '#333'
  const strong = theme === 'dark' ? '#e8e4dc' : '#222'
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) {
      y += 18
      continue
    }
    if (line.startsWith('#')) {
      ctx.fillStyle = accent
      ctx.font = 'bold 34px "Space Grotesk", sans-serif'
      ctx.fillText(line.slice(1), 32, y)
      y += 46
    } else if (line.startsWith('*')) {
      ctx.fillStyle = strong
      ctx.font = 'bold 22px "Space Grotesk", sans-serif'
      wrapText(ctx, line.slice(1), 32, y, w - 64, 26)
      y += 32
    } else {
      ctx.fillStyle = body
      ctx.font = '18px "Space Grotesk", sans-serif'
      y = wrapText(ctx, line, 32, y, w - 64, 24) + 10
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Tree canopy / foliage blob texture */
export function foliageTexture(w = 512, h = 512, theme: Theme = 'dark'): THREE.CanvasTexture {
  const p = P(theme)
  const { c, ctx } = makeCanvas(w, h)
  ctx.clearRect(0, 0, w, h)
  const blobs = [
    [256, 220, 140], [160, 260, 100], [350, 250, 110],
    [200, 160, 90], [310, 150, 95], [256, 300, 120],
  ]
  for (const [x, y, r] of blobs) {
    ctx.fillStyle = p.foliageFill
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = p.ink
    ctx.lineWidth = 2.5
    ctx.beginPath()
    for (let a = 0; a <= Math.PI * 2; a += 0.15) {
      const rr = r + Math.sin(a * 5) * 6 + (Math.random() - 0.5) * 4
      const px = x + Math.cos(a) * rr
      const py = y + Math.sin(a) * rr
      if (a === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.stroke()
    ctx.globalAlpha = 0.25
    for (let i = 0; i < 5; i++) {
      sketchStroke(ctx, x - r * 0.5, y - r * 0.3 + i * 12, x + r * 0.5, y - r * 0.2 + i * 12, 1, 1, p.ink)
    }
    ctx.globalAlpha = 1
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Cat silhouette sketch */
export function catTexture(w = 256, h = 256, theme: Theme = 'dark'): THREE.CanvasTexture {
  const p = P(theme)
  const { c, ctx } = makeCanvas(w, h)
  ctx.clearRect(0, 0, w, h)
  ctx.strokeStyle = p.ink
  ctx.fillStyle = p.catFill
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.ellipse(128, 160, 55, 40, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(128, 100, 32, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(105, 85)
  ctx.lineTo(100, 55)
  ctx.lineTo(120, 78)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(151, 85)
  ctx.lineTo(156, 55)
  ctx.lineTo(136, 78)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = p.ink
  ctx.beginPath()
  ctx.arc(118, 98, 3, 0, Math.PI * 2)
  ctx.arc(138, 98, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(128, 108)
  ctx.lineTo(124, 114)
  ctx.lineTo(132, 114)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(180, 150)
  ctx.quadraticCurveTo(220, 120, 210, 80)
  ctx.stroke()
  sketchStroke(ctx, 100, 110, 70, 105, 0.3, 1, p.ink)
  sketchStroke(ctx, 100, 115, 70, 118, 0.3, 1, p.ink)
  sketchStroke(ctx, 156, 110, 186, 105, 0.3, 1, p.ink)
  sketchStroke(ctx, 156, 115, 186, 118, 0.3, 1, p.ink)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Planter box with plants + duck */
export function planterTexture(w = 512, h = 256, theme: Theme = 'dark'): THREE.CanvasTexture {
  const p = P(theme)
  const { c, ctx } = makeCanvas(w, h)
  ctx.clearRect(0, 0, w, h)
  const wood = theme === 'dark' ? '#3d3428' : '#b8895a'
  ctx.fillStyle = wood
  ctx.fillRect(20, 140, 472, 90)
  sketchStroke(ctx, 20, 140, 492, 140, 1, 2.5, p.ink)
  sketchStroke(ctx, 20, 230, 492, 230, 1, 2.5, p.ink)
  sketchStroke(ctx, 20, 140, 20, 230, 1, 2.5, p.ink)
  sketchStroke(ctx, 492, 140, 492, 230, 1, 2.5, p.ink)
  for (let i = 0; i < 8; i++) {
    ctx.globalAlpha = 0.3
    sketchStroke(ctx, 30, 150 + i * 10, 480, 152 + i * 10, 1, 1, p.ink)
    ctx.globalAlpha = 1
  }
  const plants = [
    [80, 140, 'cactus'],
    [160, 140, 'succulent'],
    [250, 140, 'cactus'],
    [340, 140, 'leaf'],
    [420, 140, 'duck'],
  ] as const
  const plantGreen = theme === 'dark' ? '#4a7a55' : '#3d7a4a'
  const plantStroke = theme === 'dark' ? '#6a9a72' : '#2f6b3c'
  for (const [px, py, kind] of plants) {
    if (kind === 'cactus') {
      ctx.fillStyle = plantGreen
      ctx.fillRect(px - 12, py - 70, 24, 70)
      sketchStroke(ctx, px - 12, py - 70, px + 12, py - 70, 0.5, 1.5, p.ink)
      sketchStroke(ctx, px - 12, py - 70, px - 12, py, 0.5, 1.5, p.ink)
      sketchStroke(ctx, px + 12, py - 70, px + 12, py, 0.5, 1.5, p.ink)
      ctx.fillRect(px + 12, py - 45, 22, 12)
      sketchStroke(ctx, px + 12, py - 45, px + 34, py - 45, 0.4, 1.2, p.ink)
    } else if (kind === 'succulent') {
      ctx.strokeStyle = plantStroke
      ctx.lineWidth = 2
      for (let a = 0; a < 6; a++) {
        const ang = (a / 6) * Math.PI * 2
        ctx.beginPath()
        ctx.ellipse(px + Math.cos(ang) * 8, py - 30 + Math.sin(ang) * 6, 10, 22, ang, 0, Math.PI * 2)
        ctx.stroke()
      }
    } else if (kind === 'leaf') {
      ctx.strokeStyle = plantStroke
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.ellipse(px, py - 40, 18, 40, -0.2, 0, Math.PI * 2)
      ctx.stroke()
      sketchStroke(ctx, px, py, px, py - 70, 0.4, 1.5, p.ink)
    } else {
      ctx.fillStyle = theme === 'dark' ? '#c4a84a' : '#f5d76e'
      ctx.strokeStyle = p.ink
      ctx.beginPath()
      ctx.ellipse(px, py - 28, 22, 16, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(px + 16, py - 42, 12, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = '#e67e22'
      ctx.beginPath()
      ctx.moveTo(px + 26, py - 42)
      ctx.lineTo(px + 38, py - 40)
      ctx.lineTo(px + 26, py - 38)
      ctx.fill()
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Cobblestone path */
export function cobbleTexture(w = 512, h = 512, theme: Theme = 'dark'): THREE.CanvasTexture {
  const p = P(theme)
  const { c, ctx } = makeCanvas(w, h)
  paperFill(ctx, w, h, p.cobble)
  for (let y = 0; y < h; y += 36) {
    const off = (Math.floor(y / 36) % 2) * 22
    for (let x = -20; x < w; x += 44) {
      const px = x + off + (Math.random() - 0.5) * 4
      const py = y + (Math.random() - 0.5) * 3
      ctx.beginPath()
      ctx.ellipse(px + 18, py + 16, 16 + Math.random() * 4, 12 + Math.random() * 3, 0, 0, Math.PI * 2)
      ctx.fillStyle = Math.random() > 0.5 ? p.cobbleA : p.cobbleB
      ctx.fill()
      ctx.strokeStyle = p.ink
      ctx.lineWidth = 1.4
      ctx.stroke()
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Single entrance pane: sketch glass door with project name (clickable facade). */
export function projectDoorPaneTexture(
  title: string,
  accent: string,
  w = 512,
  h = 640,
  theme: Theme = 'dark',
): THREE.CanvasTexture {
  const p = P(theme)
  const { c, ctx } = makeCanvas(w, h)
  paperFill(ctx, w, h, p.projectDoor)
  ctx.fillStyle = accent
  ctx.globalAlpha = 0.14
  ctx.fillRect(14, 14, w - 28, h - 28)
  ctx.globalAlpha = 1
  ctx.fillStyle = p.projectDoorGlass
  ctx.globalAlpha = 0.4
  ctx.fillRect(18, 18, w - 36, h - 36)
  ctx.globalAlpha = 1
  sketchStroke(ctx, 8, 8, w - 8, 8, 1, 3.8, p.ink)
  sketchStroke(ctx, 8, h - 8, w - 8, h - 8, 1, 3.8, p.ink)
  sketchStroke(ctx, 8, 8, 8, h - 8, 1, 3.8, p.ink)
  sketchStroke(ctx, w - 8, 8, w - 8, h - 8, 1, 3.8, p.ink)
  sketchStroke(ctx, 16, 16, w - 16, 16, 0.7, 1.4, p.ink)
  sketchStroke(ctx, 16, h - 16, w - 16, h - 16, 0.7, 1.4, p.ink)
  sketchStroke(ctx, 16, 16, 16, h - 16, 0.7, 1.4, p.ink)
  sketchStroke(ctx, w - 16, 16, w - 16, h - 16, 0.7, 1.4, p.ink)
  sketchStroke(ctx, 22, h * 0.62, w - 22, h * 0.62, 1, 2.2, p.ink)
  ctx.beginPath()
  ctx.arc(w * 0.82, h * 0.48, 11, 0, Math.PI * 2)
  ctx.strokeStyle = p.ink
  ctx.lineWidth = 2.2
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(w * 0.82, h * 0.48, 4, 0, Math.PI * 2)
  ctx.fillStyle = theme === 'dark' ? '#c8c4bc' : '#222'
  ctx.fill()
  drawLogoBadge(ctx, 28, 28, 52, accent, (title.split(' ')[0] || '●').slice(0, 6), '#fff', p.ink)
  const short = title.length > 28 ? title.slice(0, 26) + '…' : title
  const words = short.split(' ')
  ctx.fillStyle = p.ink
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  // Large high-contrast labels (min ~48–64px on canvas)
  const fontSize = short.length > 18 ? 48 : 58
  ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`
  let line1 = short
  let line2 = ''
  if (words.length > 2) {
    const mid = Math.ceil(words.length / 2)
    line1 = words.slice(0, mid).join(' ')
    line2 = words.slice(mid).join(' ')
  }
  const ty = h * 0.78
  ctx.fillText(line1, w / 2, line2 ? ty - 28 : ty)
  ctx.strokeStyle = p.ink
  ctx.lineWidth = 1.2
  ctx.strokeText(line1, w / 2, line2 ? ty - 28 : ty)
  if (line2) {
    ctx.font = `bold ${Math.max(36, fontSize - 8)}px "Space Grotesk", sans-serif`
    ctx.fillText(line2, w / 2, ty + 24)
    ctx.strokeText(line2, w / 2, ty + 24)
  }
  ctx.font = 'bold 28px "Space Grotesk", sans-serif'
  ctx.fillStyle = p.muted
  ctx.fillText('GitHub ↗', w / 2, h - 40)
  ctx.globalAlpha = 0.12
  for (let i = 0; i < 5; i++) {
    sketchStroke(ctx, 28, h * 0.35 + i * 8, w - 40, h * 0.37 + i * 8, 0.5, 0.8, p.ink)
  }
  ctx.globalAlpha = 1
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lineH: number,
): number {
  const words = text.split(' ')
  let line = ''
  let cy = y
  for (const word of words) {
    const test = line + word + ' '
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, cy)
      line = word + ' '
      cy += lineH
    } else {
      line = test
    }
  }
  ctx.fillText(line, x, cy)
  return cy + lineH
}

const cache = new Map<string, THREE.Texture>()

export function cached(key: string, factory: () => THREE.Texture): THREE.Texture {
  let t = cache.get(key)
  if (!t) {
    t = factory()
    cache.set(key, t)
  }
  return t
}

/** Dispose and drop cached textures for a previous theme so memory stays bounded. */
export function clearTextureCache(exceptTheme?: Theme) {
  for (const [key, tex] of cache) {
    if (exceptTheme && key.includes(`@${exceptTheme}`)) continue
    tex.dispose()
    cache.delete(key)
  }
}
