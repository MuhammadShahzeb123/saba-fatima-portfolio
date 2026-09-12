import * as THREE from 'three'

function makeCanvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  return { c, ctx }
}

function paperFill(ctx: CanvasRenderingContext2D, w: number, h: number, tint = '#f4f0e6') {
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
) {
  ctx.beginPath()
  ctx.lineWidth = width
  ctx.strokeStyle = '#1a1a1a'
  ctx.lineCap = 'round'
  const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * wobble * 4
  const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * wobble * 4
  ctx.moveTo(x1 + (Math.random() - 0.5) * wobble, y1 + (Math.random() - 0.5) * wobble)
  ctx.quadraticCurveTo(midX, midY, x2 + (Math.random() - 0.5) * wobble, y2 + (Math.random() - 0.5) * wobble)
  ctx.stroke()
}

/** Richer hand-drawn brick with mortar gaps + hatching */
export function brickTexture(w = 768, h = 768): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(w, h)
  paperFill(ctx, w, h, '#e8e2d4')
  // mortar base slightly darker
  ctx.fillStyle = '#d4cec0'
  ctx.globalAlpha = 0.35
  ctx.fillRect(0, 0, w, h)
  ctx.globalAlpha = 1

  const rows = 12
  const cols = 9
  const bh = h / rows
  const bw = w / cols
  for (let r = 0; r < rows; r++) {
    const offset = r % 2 === 0 ? 0 : bw / 2
    for (let col = -1; col <= cols; col++) {
      const x = col * bw + offset + (Math.random() - 0.5) * 2
      const y = r * bh + (Math.random() - 0.5) * 1.5
      const pad = 2 + Math.random()
      // brick face
      ctx.fillStyle = Math.random() > 0.5 ? '#efe9dc' : '#ebe4d6'
      ctx.fillRect(x + pad, y + pad, bw - pad * 2, bh - pad * 2)
      sketchStroke(ctx, x + pad, y + pad, x + bw - pad, y + pad, 1.2, 1.6)
      sketchStroke(ctx, x + pad, y + bh - pad, x + bw - pad, y + bh - pad, 1.2, 1.6)
      sketchStroke(ctx, x + pad, y + pad, x + pad, y + bh - pad, 1.2, 1.6)
      sketchStroke(ctx, x + bw - pad, y + pad, x + bw - pad, y + bh - pad, 1.2, 1.6)
      // internal hatch / wear
      if (Math.random() > 0.35) {
        ctx.globalAlpha = 0.28
        const n = 2 + Math.floor(Math.random() * 4)
        for (let i = 0; i < n; i++) {
          sketchStroke(
            ctx,
            x + 6, y + 5 + i * ((bh - 12) / n),
            x + bw - 6, y + 7 + i * ((bh - 12) / n),
            0.8, 0.8,
          )
        }
        ctx.globalAlpha = 1
      }
      // corner chip
      if (Math.random() > 0.82) {
        sketchStroke(ctx, x + pad, y + pad + 4, x + pad + 6, y + pad, 0.4, 1)
      }
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** High-contrast floor planks */
export function plankTexture(w = 512, h = 1024): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(w, h)
  paperFill(ctx, w, h, '#e4d9c6')
  const planks = 5
  const pw = w / planks
  for (let i = 0; i < planks; i++) {
    const x = i * pw
    // alternating plank tint for contrast
    if (i % 2 === 0) {
      ctx.fillStyle = '#ddd0b8'
      ctx.globalAlpha = 0.45
      ctx.fillRect(x, 0, pw, h)
      ctx.globalAlpha = 1
    } else {
      ctx.fillStyle = '#ebe2d0'
      ctx.globalAlpha = 0.35
      ctx.fillRect(x, 0, pw, h)
      ctx.globalAlpha = 1
    }
    sketchStroke(ctx, x, 0, x, h, 1.4, 2.8)
    // double seam
    sketchStroke(ctx, x + 1.5, 0, x + 1.5, h, 0.6, 1.2)
    for (let g = 0; g < 18; g++) {
      const gx = x + 10 + Math.random() * (pw - 20)
      ctx.globalAlpha = 0.45
      sketchStroke(ctx, gx, 8, gx + (Math.random() - 0.5) * 10, h - 8, 2.2, 1)
      ctx.globalAlpha = 1
    }
    // knots / cracks
    if (Math.random() > 0.35) {
      const kx = x + pw * (0.25 + Math.random() * 0.5)
      const ky = Math.random() * h
      ctx.beginPath()
      ctx.ellipse(kx, ky, 7, 4.5, Math.random(), 0, Math.PI * 2)
      ctx.stroke()
      sketchStroke(ctx, kx - 12, ky, kx + 12, ky + 2, 1, 1)
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(1, 5)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Paper wall with crosshatching + notebook cues */
export function paperWallTexture(w = 768, h = 768): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(w, h)
  paperFill(ctx, w, h, '#f5f1e8')
  // faint ruled lines
  ctx.globalAlpha = 0.1
  for (let y = 0; y < h; y += 22) {
    sketchStroke(ctx, 0, y, w, y, 0.35, 0.7)
  }
  ctx.globalAlpha = 1
  // crosshatch patches
  for (let p = 0; p < 14; p++) {
    const bx = Math.random() * w
    const by = Math.random() * h
    const bw = 40 + Math.random() * 90
    const bh = 30 + Math.random() * 70
    ctx.globalAlpha = 0.12 + Math.random() * 0.1
    for (let i = 0; i < 8; i++) {
      sketchStroke(ctx, bx, by + i * (bh / 8), bx + bw, by + 4 + i * (bh / 8), 0.6, 0.7)
    }
    for (let i = 0; i < 5; i++) {
      sketchStroke(ctx, bx + i * (bw / 5), by, bx + 6 + i * (bw / 5), by + bh, 0.6, 0.6)
    }
    ctx.globalAlpha = 1
  }
  // small doodle marks
  ctx.globalAlpha = 0.22
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    if (Math.random() > 0.5) {
      ctx.beginPath()
      ctx.arc(x, y, 3 + Math.random() * 5, 0, Math.PI * 2)
      ctx.stroke()
    } else {
      sketchStroke(ctx, x, y, x + 8 + Math.random() * 12, y + (Math.random() - 0.5) * 8, 0.5, 0.8)
    }
  }
  ctx.globalAlpha = 1
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function woodSignTexture(text: string, w = 640, h = 180): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(w, h)
  paperFill(ctx, w, h, '#c4a574')
  for (let i = 0; i < 24; i++) {
    ctx.globalAlpha = 0.22
    sketchStroke(ctx, 0, 8 + i * 7, w, 10 + i * 7, 1.6, 1.1)
    ctx.globalAlpha = 1
  }
  // thicker ink border
  sketchStroke(ctx, 6, 6, w - 6, 6, 1.2, 3.2)
  sketchStroke(ctx, 6, h - 6, w - 6, h - 6, 1.2, 3.2)
  sketchStroke(ctx, 6, 6, 6, h - 6, 1.2, 3.2)
  sketchStroke(ctx, w - 6, 6, w - 6, h - 6, 1.2, 3.2)
  // inner border
  sketchStroke(ctx, 14, 14, w - 14, 14, 0.8, 1.2)
  sketchStroke(ctx, 14, h - 14, w - 14, h - 14, 0.8, 1.2)
  sketchStroke(ctx, 14, 14, 14, h - 14, 0.8, 1.2)
  sketchStroke(ctx, w - 14, 14, w - 14, h - 14, 0.8, 1.2)

  const fontSize = Math.min(Math.floor(h * 0.48), Math.floor((w * 0.9) / Math.max(text.length * 0.55, 4)))
  ctx.fillStyle = '#1a1a1a'
  ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, w / 2, h / 2 + 2)
  ctx.strokeStyle = '#111'
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
) {
  ctx.fillStyle = bg
  ctx.globalAlpha = 0.92
  // slightly skewed sticker
  ctx.beginPath()
  ctx.moveTo(x + 2, y)
  ctx.lineTo(x + size, y + 3)
  ctx.lineTo(x + size - 2, y + size)
  ctx.lineTo(x, y + size - 2)
  ctx.closePath()
  ctx.fill()
  ctx.globalAlpha = 1
  sketchStroke(ctx, x + 2, y, x + size, y + 3, 0.5, 1.6)
  sketchStroke(ctx, x + size, y + 3, x + size - 2, y + size, 0.5, 1.6)
  sketchStroke(ctx, x + size - 2, y + size, x, y + size - 2, 0.5, 1.6)
  sketchStroke(ctx, x, y + size - 2, x + 2, y, 0.5, 1.6)
  ctx.fillStyle = fg
  ctx.font = `bold ${Math.floor(size * 0.28)}px "Space Grotesk", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, x + size / 2, y + size / 2 + 1)
}

export function doorTexture(w = 512, h = 768, logos = true): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(w, h)
  paperFill(ctx, w, h, '#eef4f8')
  // glass tint panes
  ctx.fillStyle = '#dce8f0'
  ctx.globalAlpha = 0.55
  ctx.fillRect(18, 18, w - 36, h - 36)
  ctx.globalAlpha = 1
  // frame
  sketchStroke(ctx, 10, 10, w - 10, 10, 1, 3.5)
  sketchStroke(ctx, 10, h - 10, w - 10, h - 10, 1, 3.5)
  sketchStroke(ctx, 10, 10, 10, h - 10, 1, 3.5)
  sketchStroke(ctx, w - 10, 10, w - 10, h - 10, 1, 3.5)
  sketchStroke(ctx, w / 2, 18, w / 2, h - 18, 1, 2.4)
  sketchStroke(ctx, 18, h * 0.33, w - 18, h * 0.33, 1, 2.2)
  sketchStroke(ctx, 18, h * 0.66, w - 18, h * 0.66, 1, 2.2)
  // handle
  ctx.beginPath()
  ctx.arc(w * 0.78, h * 0.5, 12, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(w * 0.78, h * 0.5, 5, 0, Math.PI * 2)
  ctx.fillStyle = '#333'
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
      drawLogoBadge(ctx, x, y, 48, badges[i][0], badges[i][1], badges[i][2] || '#fff')
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
): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(w, h)
  paperFill(ctx, w, h, '#faf6ec')
  sketchStroke(ctx, 10, 10, w - 10, 10, 1.2, 2.5)
  sketchStroke(ctx, 10, h - 10, w - 10, h - 10, 1.2, 2.5)
  sketchStroke(ctx, 10, 10, 10, h - 10, 1.2, 2.5)
  sketchStroke(ctx, w - 10, 10, w - 10, h - 10, 1.2, 2.5)
  // tape
  ctx.fillStyle = '#7dd3fc'
  ctx.globalAlpha = 0.75
  ctx.fillRect(w * 0.35, 4, 50, 18)
  ctx.globalAlpha = 1
  // doodle art
  ctx.strokeStyle = '#1a1a1a'
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
    sketchStroke(ctx, cx - 50, cy - 20, cx - 20, cy, 1, 2.5)
    sketchStroke(ctx, cx - 20, cy, cx - 50, cy + 20, 1, 2.5)
    sketchStroke(ctx, cx + 50, cy - 20, cx + 20, cy, 1, 2.5)
    sketchStroke(ctx, cx + 20, cy, cx + 50, cy + 20, 1, 2.5)
    sketchStroke(ctx, cx - 8, cy + 30, cx + 14, cy - 30, 1, 2.2)
  } else if (doodle === 'bot') {
    ctx.strokeRect(cx - 40, cy - 30, 80, 70)
    ctx.beginPath()
    ctx.arc(cx - 18, cy - 5, 8, 0, Math.PI * 2)
    ctx.arc(cx + 18, cy - 5, 8, 0, Math.PI * 2)
    ctx.stroke()
    sketchStroke(ctx, cx - 15, cy + 20, cx + 15, cy + 20, 0.5, 2)
    sketchStroke(ctx, cx, cy - 30, cx, cy - 48, 0.5, 2)
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
  // title
  ctx.fillStyle = '#111'
  ctx.font = 'bold 28px "Space Grotesk", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(title, w / 2, h * 0.78)
  // hatch shade
  ctx.globalAlpha = 0.15
  for (let i = 0; i < 6; i++) {
    sketchStroke(ctx, 20, h * 0.55 + i * 6, w - 20, h * 0.57 + i * 6, 0.5, 0.7)
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
): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(w, h)
  paperFill(ctx, w, h, colored ? '#fffef8' : '#f2efe6')
  sketchStroke(ctx, 16, 16, w - 16, 16, 1, 3)
  sketchStroke(ctx, 16, h - 56, w - 16, h - 56, 1, 3)
  sketchStroke(ctx, 16, 16, 16, h - 56, 1, 3)
  sketchStroke(ctx, w - 16, 16, w - 16, h - 56, 1, 3)
  if (colored) {
    ctx.fillStyle = color
    ctx.globalAlpha = 0.28
    ctx.fillRect(30, 30, w - 60, h - 100)
    ctx.globalAlpha = 1
  } else {
    ctx.fillStyle = '#ddd8cc'
    ctx.fillRect(30, 30, w - 60, h - 100)
  }
  sketchStroke(ctx, 30, 30, w - 30, 30, 0.5, 1.4)
  sketchStroke(ctx, 30, h - 70, w - 30, h - 70, 0.5, 1.4)
  ctx.globalAlpha = colored ? 0.7 : 0.45
  for (let i = 0; i < 5; i++) {
    const y = 70 + i * 32
    sketchStroke(ctx, 52, y, w - 52 - Math.random() * 90, y, 0.8, 1.6)
  }
  ctx.globalAlpha = 1
  sketchStroke(ctx, w / 2 - 36, h - 56, w / 2 + 36, h - 56, 0.5, 2.2)
  sketchStroke(ctx, w / 2, h - 56, w / 2, h - 24, 0.5, 2.2)
  sketchStroke(ctx, w / 2 - 58, h - 24, w / 2 + 58, h - 24, 0.5, 2.2)

  // Larger readable title
  ctx.fillStyle = '#111'
  const titleSize = title.length > 18 ? 28 : title.length > 12 ? 34 : 40
  ctx.font = `bold ${titleSize}px "Space Grotesk", sans-serif`
  ctx.textAlign = 'center'
  const short = title.length > 26 ? title.slice(0, 24) + '…' : title
  ctx.fillText(short, w / 2, h * 0.4)
  ctx.strokeStyle = '#111'
  ctx.lineWidth = 0.8
  ctx.strokeText(short, w / 2, h * 0.4)

  ctx.font = '18px "Space Grotesk", sans-serif'
  ctx.fillStyle = colored ? color : '#333'
  const sub = subtitle.length > 36 ? subtitle.slice(0, 34) + '…' : subtitle
  ctx.fillText(sub, w / 2, h * 0.52)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function wordmarkTexture(text: string, tagline: string, w = 1024, h = 512): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(w, h)
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#111'
  ctx.font = 'bold 160px "Caveat", cursive'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, w / 2, h / 2 - 40)
  ctx.strokeStyle = '#111'
  ctx.lineWidth = 4
  ctx.strokeText(text, w / 2, h / 2 - 40)
  // double outline for sketch feel
  ctx.lineWidth = 1.5
  ctx.strokeText(text, w / 2 + 2, h / 2 - 38)
  ctx.font = '40px "Space Grotesk", monospace'
  ctx.fillText(tagline, w / 2, h / 2 + 90)
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
): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(w, h)
  paperFill(ctx, w, h, '#faf7f0')
  sketchStroke(ctx, 10, 10, w - 10, 10, 1.2, 2.8)
  sketchStroke(ctx, 10, h - 10, w - 10, h - 10, 1.2, 2.8)
  sketchStroke(ctx, 10, 10, 10, h - 10, 1.2, 2.8)
  sketchStroke(ctx, w - 10, 10, w - 10, h - 10, 1.2, 2.8)
  ctx.fillStyle = '#7dd3fc'
  ctx.globalAlpha = 0.7
  ctx.fillRect(24, 14, 48, 18)
  ctx.fillRect(w - 72, 14, 48, 18)
  ctx.globalAlpha = 1
  let y = 58
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
      ctx.fillStyle = '#222'
      ctx.font = 'bold 22px "Space Grotesk", sans-serif'
      wrapText(ctx, line.slice(1), 32, y, w - 64, 26)
      y += 32
    } else {
      ctx.fillStyle = '#333'
      ctx.font = '18px "Space Grotesk", sans-serif'
      y = wrapText(ctx, line, 32, y, w - 64, 24) + 10
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Tree canopy / foliage blob texture */
export function foliageTexture(w = 512, h = 512): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(w, h)
  ctx.clearRect(0, 0, w, h)
  const blobs = [
    [256, 220, 140], [160, 260, 100], [350, 250, 110],
    [200, 160, 90], [310, 150, 95], [256, 300, 120],
  ]
  for (const [x, y, r] of blobs) {
    ctx.fillStyle = '#eef2e6'
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    // wobbly circle
    for (let a = 0; a <= Math.PI * 2; a += 0.15) {
      const rr = r + Math.sin(a * 5) * 6 + (Math.random() - 0.5) * 4
      const px = x + Math.cos(a) * rr
      const py = y + Math.sin(a) * rr
      if (a === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.stroke()
    // inner hatch
    ctx.globalAlpha = 0.25
    for (let i = 0; i < 5; i++) {
      sketchStroke(ctx, x - r * 0.5, y - r * 0.3 + i * 12, x + r * 0.5, y - r * 0.2 + i * 12, 1, 1)
    }
    ctx.globalAlpha = 1
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Cat silhouette sketch */
export function catTexture(w = 256, h = 256): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(w, h)
  ctx.clearRect(0, 0, w, h)
  ctx.strokeStyle = '#1a1a1a'
  ctx.fillStyle = '#f7f3ea'
  ctx.lineWidth = 2.5
  // body
  ctx.beginPath()
  ctx.ellipse(128, 160, 55, 40, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  // head
  ctx.beginPath()
  ctx.arc(128, 100, 32, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  // ears
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
  // eyes / nose
  ctx.fillStyle = '#111'
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
  // tail
  ctx.beginPath()
  ctx.moveTo(180, 150)
  ctx.quadraticCurveTo(220, 120, 210, 80)
  ctx.stroke()
  // whiskers
  sketchStroke(ctx, 100, 110, 70, 105, 0.3, 1)
  sketchStroke(ctx, 100, 115, 70, 118, 0.3, 1)
  sketchStroke(ctx, 156, 110, 186, 105, 0.3, 1)
  sketchStroke(ctx, 156, 115, 186, 118, 0.3, 1)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Planter box with plants + duck */
export function planterTexture(w = 512, h = 256): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(w, h)
  ctx.clearRect(0, 0, w, h)
  // box
  ctx.fillStyle = '#b8895a'
  ctx.fillRect(20, 140, 472, 90)
  sketchStroke(ctx, 20, 140, 492, 140, 1, 2.5)
  sketchStroke(ctx, 20, 230, 492, 230, 1, 2.5)
  sketchStroke(ctx, 20, 140, 20, 230, 1, 2.5)
  sketchStroke(ctx, 492, 140, 492, 230, 1, 2.5)
  for (let i = 0; i < 8; i++) {
    ctx.globalAlpha = 0.3
    sketchStroke(ctx, 30, 150 + i * 10, 480, 152 + i * 10, 1, 1)
    ctx.globalAlpha = 1
  }
  // plants
  const plants = [
    [80, 140, 'cactus'],
    [160, 140, 'succulent'],
    [250, 140, 'cactus'],
    [340, 140, 'leaf'],
    [420, 140, 'duck'],
  ] as const
  for (const [px, py, kind] of plants) {
    if (kind === 'cactus') {
      ctx.fillStyle = '#3d7a4a'
      ctx.fillRect(px - 12, py - 70, 24, 70)
      sketchStroke(ctx, px - 12, py - 70, px + 12, py - 70, 0.5, 1.5)
      sketchStroke(ctx, px - 12, py - 70, px - 12, py, 0.5, 1.5)
      sketchStroke(ctx, px + 12, py - 70, px + 12, py, 0.5, 1.5)
      // arm
      ctx.fillRect(px + 12, py - 45, 22, 12)
      sketchStroke(ctx, px + 12, py - 45, px + 34, py - 45, 0.4, 1.2)
    } else if (kind === 'succulent') {
      ctx.strokeStyle = '#2f6b3c'
      ctx.lineWidth = 2
      for (let a = 0; a < 6; a++) {
        const ang = (a / 6) * Math.PI * 2
        ctx.beginPath()
        ctx.ellipse(px + Math.cos(ang) * 8, py - 30 + Math.sin(ang) * 6, 10, 22, ang, 0, Math.PI * 2)
        ctx.stroke()
      }
    } else if (kind === 'leaf') {
      ctx.strokeStyle = '#2f6b3c'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.ellipse(px, py - 40, 18, 40, -0.2, 0, Math.PI * 2)
      ctx.stroke()
      sketchStroke(ctx, px, py, px, py - 70, 0.4, 1.5)
    } else {
      // rubber duck
      ctx.fillStyle = '#f5d76e'
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
export function cobbleTexture(w = 512, h = 512): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(w, h)
  paperFill(ctx, w, h, '#e6e0d4')
  for (let y = 0; y < h; y += 36) {
    const off = (Math.floor(y / 36) % 2) * 22
    for (let x = -20; x < w; x += 44) {
      const px = x + off + (Math.random() - 0.5) * 4
      const py = y + (Math.random() - 0.5) * 3
      ctx.beginPath()
      ctx.ellipse(px + 18, py + 16, 16 + Math.random() * 4, 12 + Math.random() * 3, 0, 0, Math.PI * 2)
      ctx.fillStyle = Math.random() > 0.5 ? '#ebe6da' : '#e0d9cb'
      ctx.fill()
      ctx.strokeStyle = '#222'
      ctx.lineWidth = 1.4
      ctx.stroke()
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
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
