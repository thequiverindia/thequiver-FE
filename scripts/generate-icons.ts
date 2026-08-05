/** One-off: render the app icons (indigo tile, gold Q) into /public. */
import sharp from 'sharp';
import fs from 'fs';

const svg = (s: number) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">
  <rect width="${s}" height="${s}" rx="${s * 0.18}" fill="#1E1B4B"/>
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
    font-family="Georgia, serif" font-weight="bold" font-size="${s * 0.58}" fill="#FBBF24">Q</text>
  <rect x="${s * 0.3}" y="${s * 0.82}" width="${s * 0.4}" height="${s * 0.045}" fill="#FBBF24"/>
</svg>`);

async function main() {
  for (const [file, size] of [
    ['public/icon-192.png', 192],
    ['public/icon-512.png', 512],
    ['public/apple-icon.png', 180],
  ] as const) {
    await sharp(svg(size)).png().toFile(file);
    console.log('wrote', file, fs.statSync(file).size, 'bytes');
  }
}
main();
