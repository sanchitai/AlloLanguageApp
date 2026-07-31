const sharp = require('sharp')
const path = require('path')

const SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#1A2E3B"/>
  <rect x="46" y="62" width="240" height="174" rx="52" fill="#56CCF2"/>
  <polygon points="78,236 168,236 124,314" fill="#56CCF2"/>
  <rect x="174" y="190" width="292" height="174" rx="52" fill="#FF7043"/>
  <polygon points="326,364 416,364 372,440" fill="#FF7043"/>
</svg>`

const MASKABLE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#1A2E3B"/>
  <rect x="80" y="100" width="210" height="155" rx="45" fill="#56CCF2"/>
  <polygon points="110,255 190,255 150,325" fill="#56CCF2"/>
  <rect x="210" y="210" width="240" height="155" rx="45" fill="#FF7043"/>
  <polygon points="330,365 410,365 370,435" fill="#FF7043"/>
</svg>`

const FAVICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="#1A2E3B"/>
  <rect x="3" y="4" width="15" height="11" rx="3.5" fill="#56CCF2"/>
  <polygon points="4,15 10,15 7,20" fill="#56CCF2"/>
  <rect x="11" y="12" width="18" height="11" rx="3.5" fill="#FF7043"/>
  <polygon points="21,23 27,23 24,28" fill="#FF7043"/>
</svg>`

const icons = [
  { svg: SVG,           size: 512,  file: 'icon-512.png' },
  { svg: SVG,           size: 192,  file: 'icon-192.png' },
  { svg: SVG,           size: 180,  file: 'apple-touch-icon.png' },
  { svg: MASKABLE_SVG,  size: 512,  file: 'icon-maskable-512.png' },
  { svg: FAVICON_SVG,   size: 32,   file: 'favicon-32x32.png' },
  { svg: FAVICON_SVG,   size: 16,   file: 'favicon-16x16.png' },
  { svg: SVG,           size: 96,   file: 'shortcut-buddy.png' },
  { svg: SVG,           size: 96,   file: 'shortcut-cards.png' },
]

async function generate() {
  for (const { svg, size, file } of icons) {
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, '..', 'public/icons', file))
    console.log(`✓ ${file} (${size}px)`)
  }
  console.log('All icons generated!')
}

generate().catch(console.error)
