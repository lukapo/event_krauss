import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const imagesDir = path.join(root, 'images');
const galleryDir = path.join(imagesDir, 'gallery');

const galleryFiles = [
  'noc_izvana',
  'dan_izvana',
  'img1',
  'img2',
  'img3',
  'img4',
  'img5',
  'img6',
];

fs.mkdirSync(galleryDir, { recursive: true });

async function exportGalleryWebp(base) {
  const input = path.join(galleryDir, `${base}.jpg`);
  if (!fs.existsSync(input)) {
    console.log(`${base}: skipped (missing ${base}.jpg)`);
    return;
  }

  await sharp(input)
    .webp({ quality: 82 })
    .toFile(path.join(galleryDir, `${base}.webp`));

  const webpSize = fs.statSync(path.join(galleryDir, `${base}.webp`)).size;
  console.log(`${base}: webp ${Math.round(webpSize / 1024)}KB`);
}

async function exportHero() {
  const input = path.join(imagesDir, 'header.jpg');
  if (!fs.existsSync(input)) {
    console.log('header: skipped (missing header.jpg source)');
    return;
  }

  const pipeline = sharp(input).rotate().resize({
    width: 1920,
    withoutEnlargement: true,
  });

  await pipeline
    .clone()
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(imagesDir, 'header-opt.jpg'));

  await pipeline
    .clone()
    .webp({ quality: 80 })
    .toFile(path.join(imagesDir, 'header-opt.webp'));

  const jpgSize = fs.statSync(path.join(imagesDir, 'header-opt.jpg')).size;
  const webpSize = fs.statSync(path.join(imagesDir, 'header-opt.webp')).size;
  console.log(`header: jpg ${Math.round(jpgSize / 1024)}KB | webp ${Math.round(webpSize / 1024)}KB`);
}

for (const base of galleryFiles) {
  await exportGalleryWebp(base);
}
await exportHero();
