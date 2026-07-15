import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const imagesDir = path.join(root, 'images');
const galleryDir = path.join(imagesDir, 'gallery');
const heroDir = path.join(imagesDir, 'hero');
const foodDir = path.join(imagesDir, 'food');

const galleryFiles = [
  'noc_izvana',
  'img1',
  'img2',
  'img3',
  'uredjenje-stolova',
  'detalj-svadbenog-stola',
  'velika-kuca-napuhanac',
  'cp-napuhanac',
  'minions-napuhanac',
];

const foodFiles = [
  'food-1.jpeg',
  'food-2.jpeg',
  'food-3.jpeg',
  'food-4.jpeg',
  'food-5.jpeg',
  'food-6.webp',
];

async function exportWebpFromJpg(inputPath, outputPath) {
  if (!fs.existsSync(inputPath)) {
    console.log(`skipped (missing ${inputPath})`);
    return;
  }

  await sharp(inputPath)
    .rotate()
    .webp({ quality: 82 })
    .toFile(outputPath);

  const webpSize = fs.statSync(outputPath).size;
  console.log(`${path.basename(outputPath)}: ${Math.round(webpSize / 1024)}KB`);
}

async function exportGalleryWebp(base) {
  const input = path.join(galleryDir, `${base}.jpg`);
  await exportWebpFromJpg(input, path.join(galleryDir, `${base}.webp`));
}

async function exportHero() {
  const input = path.join(heroDir, 'naslovna.jpg');
  if (!fs.existsSync(input)) {
    console.log('hero: skipped (missing naslovna.jpg)');
    return;
  }

  const pipeline = sharp(input).rotate().resize({
    width: 1920,
    withoutEnlargement: true,
  });

  await pipeline
    .clone()
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(heroDir, 'naslovna-opt.jpg'));

  await pipeline
    .clone()
    .webp({ quality: 82 })
    .toFile(path.join(heroDir, 'naslovna-opt.webp'));

  const jpgSize = fs.statSync(path.join(heroDir, 'naslovna-opt.jpg')).size;
  const webpSize = fs.statSync(path.join(heroDir, 'naslovna-opt.webp')).size;
  console.log(`hero: jpg ${Math.round(jpgSize / 1024)}KB | webp ${Math.round(webpSize / 1024)}KB`);
}

async function exportFoodImages() {
  for (const file of foodFiles) {
    const input = path.join(foodDir, file);
    if (!fs.existsSync(input)) {
      console.log(`food ${file}: skipped`);
      continue;
    }

    const base = path.parse(file).name;
    const output = path.join(foodDir, `${base}.webp`);

    if (file.endsWith('.webp')) {
      console.log(`food ${base}: already webp`);
      continue;
    }

    await sharp(input)
      .rotate()
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(output);

    console.log(`food ${base}: webp ready`);
  }
}

for (const base of galleryFiles) {
  await exportGalleryWebp(base);
}
await exportHero();
await exportFoodImages();
