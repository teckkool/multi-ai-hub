import sharp from 'sharp'
import { mkdirSync } from 'fs'

mkdirSync('./public/icons', { recursive: true })

// SVG icon: dark background, central hub node, three AI nodes connected by lines
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#0f0f1a"/>
    </radialGradient>
    <radialGradient id="hub" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#4f46e5"/>
    </radialGradient>
    <radialGradient id="node1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#059669"/>
    </radialGradient>
    <radialGradient id="node2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </radialGradient>
    <radialGradient id="node3" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </radialGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="96" fill="url(#bg)"/>

  <!-- Connection lines -->
  <line x1="256" y1="256" x2="256" y2="110" stroke="#4f46e5" stroke-width="3" stroke-opacity="0.6"/>
  <line x1="256" y1="256" x2="390" y2="360" stroke="#4f46e5" stroke-width="3" stroke-opacity="0.6"/>
  <line x1="256" y1="256" x2="122" y2="360" stroke="#4f46e5" stroke-width="3" stroke-opacity="0.6"/>

  <!-- Node glows -->
  <circle cx="256" cy="110" r="38" fill="#059669" opacity="0.25"/>
  <circle cx="390" cy="360" r="38" fill="#7c3aed" opacity="0.25"/>
  <circle cx="122" cy="360" r="38" fill="#2563eb" opacity="0.25"/>
  <circle cx="256" cy="256" r="52" fill="#4f46e5" opacity="0.2"/>

  <!-- Top node — ChatGPT green -->
  <circle cx="256" cy="110" r="28" fill="url(#node1)" filter="url(#glow)"/>
  <text x="256" y="116" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="18" fill="white">G</text>

  <!-- Bottom-right node — Claude violet -->
  <circle cx="390" cy="360" r="28" fill="url(#node2)" filter="url(#glow)"/>
  <text x="390" y="366" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="18" fill="white">C</text>

  <!-- Bottom-left node — Grok blue -->
  <circle cx="122" cy="360" r="28" fill="url(#node3)" filter="url(#glow)"/>
  <text x="122" y="366" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="18" fill="white">X</text>

  <!-- Center hub -->
  <circle cx="256" cy="256" r="42" fill="url(#hub)" filter="url(#glow)"/>
  <text x="256" y="264" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="22" fill="white">AI</text>
</svg>
`

const svgBuffer = Buffer.from(svg)

const sizes = [
  { name: 'icon-192.png',  size: 192 },
  { name: 'icon-512.png',  size: 512 },
  { name: 'icon-180.png',  size: 180 },  // Apple touch icon
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-16.png', size: 16 },
]

for (const { name, size } of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(`./public/icons/${name}`)
  console.log(`✓ Generated public/icons/${name}`)
}

// Also copy 512 to public/icon.png for Next.js
await sharp(svgBuffer).resize(512, 512).png().toFile('./public/icon.png')
console.log('✓ Generated public/icon.png')

// favicon.ico (32x32)
await sharp(svgBuffer).resize(32, 32).png().toFile('./public/favicon.png')
console.log('✓ Generated public/favicon.png')
