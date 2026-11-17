import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const inputImagePath = process.argv[2];

if (!inputImagePath) {
  console.error('Usage: node scripts/add-artwork.mjs <path-to-image>');
  process.exit(1);
}

const resolvedImagePath = path.resolve(process.cwd(), inputImagePath);

if (!fs.existsSync(resolvedImagePath)) {
  console.error(`Image not found at path: ${resolvedImagePath}`);
  process.exit(1);
}

function prompt(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    })
  );
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'artwork';
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function main() {
  const title = (await prompt('Title: ')) || 'Untitled';
  const medium = await prompt('Medium (e.g. Oil on Canvas): ');
  const size = await prompt('Size (e.g. 24" x 36"): ');
  const category = await prompt('Category: ');
  const description = await prompt('Description: ');
  const soldInput = (await prompt('Sold? (y/N): ')).toLowerCase();
  const isSold = soldInput === 'y' || soldInput === 'yes';

  const artworksFilePath = path.join(rootDir, 'src', 'data', 'artworks.ts');
  const artworksContent = fs.readFileSync(artworksFilePath, 'utf8');

  const match = artworksContent.match(/export const ARTWORKS: Artwork\[\] = (\[[\s\S]*\]);/);
  if (!match) {
    console.error('Could not parse ARTWORKS array from src/data/artworks.ts');
    process.exit(1);
  }

  const artworks = JSON.parse(match[1]);

  let baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;

  const existingSlugs = new Set(
    artworks.map((a) => {
      const parts = (a.imageUrl || '').split('/');
      return parts[parts.length - 1]?.replace(/\.webp$/, '');
    })
  );

  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${counter++}`;
  }

  const artDir = path.join(rootDir, 'public', 'art');
  const thumbsDir = path.join(artDir, 'thumbs');
  ensureDir(artDir);
  ensureDir(thumbsDir);

  const fullDest = path.join(artDir, `${slug}.webp`);
  const thumbDest = path.join(thumbsDir, `${slug}.webp`);

  console.log(`Processing image ${resolvedImagePath}...`);
  const meta = await sharp(resolvedImagePath).metadata();
  const width = meta.width || 1;
  const height = meta.height || 1;
  const aspectRatio = Number((width / height).toFixed(4));

  await sharp(resolvedImagePath)
    .resize({ width: 2000, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(fullDest);

  await sharp(resolvedImagePath)
    .resize({ width: 600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(thumbDest);

  const nextOrder = artworks.reduce((max, a) => Math.max(max, a.display_order ?? 0), -1) + 1;

  const newEntry = {
    id: String(Date.now()),
    title,
    medium,
    size,
    category,
    aspectRatio,
    imageUrl: `/art/${slug}.webp`,
    thumbnailUrl: `/art/thumbs/${slug}.webp`,
    description,
    isSold,
    display_order: nextOrder,
    is_visible: true,
  };

  artworks.push(newEntry);

  const updatedFile = `// Auto-generated static artworks data
export interface Artwork {
  id: number | string;
  title: string;
  medium: string;
  size: string;
  category: string;
  aspectRatio: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  description?: string;
  isSold?: boolean;
  display_order?: number;
  is_visible?: boolean;
}

export const ARTWORKS: Artwork[] = ${JSON.stringify(artworks, null, 2)};
`;

  fs.writeFileSync(artworksFilePath, updatedFile, 'utf8');
  console.log(`\nSuccessfully added artwork "${title}"!`);
  console.log(`Image saved: ${fullDest}`);
  console.log(`Thumbnail saved: ${thumbDest}`);
}

main().catch((err) => {
  console.error('Error adding artwork:', err);
  process.exit(1);
});
