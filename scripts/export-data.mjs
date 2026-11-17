import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read .env manually to avoid dotenv dependency
function loadEnv() {
  const envPath = path.join(rootDir, '.env');
  if (!fs.existsSync(envPath)) return {};
  const envText = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of envText.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
  return env;
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function downloadBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  const arrayBuf = await res.arrayBuffer();
  return Buffer.from(arrayBuf);
}

async function processImage(buffer, fullPath, thumbPath = null) {
  const meta = await sharp(buffer).metadata();
  const width = meta.width || 1;
  const height = meta.height || 1;
  const aspectRatio = Number((width / height).toFixed(4));

  ensureDir(path.dirname(fullPath));
  await sharp(buffer)
    .resize({ width: 2000, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(fullPath);

  if (thumbPath) {
    ensureDir(path.dirname(thumbPath));
    await sharp(buffer)
      .resize({ width: 600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(thumbPath);
  }

  return { width, height, aspectRatio };
}

async function exportArtworks() {
  console.log('Fetching artworks from Supabase...');
  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Failed to fetch artworks:', error);
    return [];
  }

  const artDir = path.join(rootDir, 'public', 'art');
  const thumbsDir = path.join(artDir, 'thumbs');
  ensureDir(artDir);
  ensureDir(thumbsDir);

  const processed = [];
  const usedSlugs = new Set();

  for (const row of data || []) {
    let baseSlug = slugify(row.title || `artwork-${row.id}`);
    let slug = baseSlug;
    let counter = 1;
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${counter++}`;
    }
    usedSlugs.add(slug);

    const rawUrl = row.image_url || row.imageUrl;
    let aspectRatio = 1;

    if (rawUrl) {
      try {
        console.log(`Downloading artwork [${row.title || row.id}]...`);
        const buf = await downloadBuffer(rawUrl);
        const fullPath = path.join(artDir, `${slug}.webp`);
        const thumbPath = path.join(thumbsDir, `${slug}.webp`);
        const res = await processImage(buf, fullPath, thumbPath);
        aspectRatio = res.aspectRatio;
      } catch (e) {
        console.error(`Error processing image for artwork ${row.id}:`, e.message);
      }
    }

    processed.push({
      id: row.id,
      title: row.title || '',
      medium: row.medium || '',
      size: row.size_cm || row.size || '',
      category: row.category || '',
      aspectRatio,
      imageUrl: `/art/${slug}.webp`,
      thumbnailUrl: `/art/thumbs/${slug}.webp`,
      description: row.description || '',
      isSold: Boolean(row.is_sold ?? row.isSold ?? false),
      display_order: Number(row.display_order ?? 0),
      is_visible: row.is_visible !== undefined ? Boolean(row.is_visible) : true
    });
  }

  ensureDir(path.join(rootDir, 'src', 'data'));
  const fileContent = `// Auto-generated static artworks data
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

export const ARTWORKS: Artwork[] = ${JSON.stringify(processed, null, 2)};
`;

  fs.writeFileSync(path.join(rootDir, 'src', 'data', 'artworks.ts'), fileContent, 'utf8');
  console.log(`Wrote ${processed.length} artworks to src/data/artworks.ts`);
}

async function exportMoments() {
  console.log('Fetching moments from Supabase...');
  let { data, error } = await supabase
    .from('artist_moments')
    .select('*')
    .order('display_order', { ascending: true });

  if (error && error.code === '42P01') {
    // fallback if table named 'moments'
    const res = await supabase.from('moments').select('*').order('display_order', { ascending: true });
    data = res.data;
    error = res.error;
  }

  if (error) {
    console.error('Failed to fetch moments:', error);
    return [];
  }

  const momentsDir = path.join(rootDir, 'public', 'moments');
  ensureDir(momentsDir);

  const processed = [];
  const usedSlugs = new Set();

  for (const row of data || []) {
    let baseSlug = slugify(row.title || `moment-${row.id}`);
    let slug = baseSlug;
    let counter = 1;
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${counter++}`;
    }
    usedSlugs.add(slug);

    const rawUrl = row.image_url || row.imageUrl;
    let aspectRatio = 1;

    if (rawUrl) {
      try {
        console.log(`Downloading moment [${row.title || row.id}]...`);
        const buf = await downloadBuffer(rawUrl);
        const fullPath = path.join(momentsDir, `${slug}.webp`);
        const res = await processImage(buf, fullPath, null);
        aspectRatio = res.aspectRatio;
      } catch (e) {
        console.error(`Error processing image for moment ${row.id}:`, e.message);
      }
    }

    processed.push({
      id: row.id,
      title: row.title || '',
      description: row.description || '',
      year: Number(row.year || new Date().getFullYear()),
      image_url: `/moments/${slug}.webp`,
      aspectRatio,
      display_order: Number(row.display_order ?? 0)
    });
  }

  ensureDir(path.join(rootDir, 'src', 'data'));
  const fileContent = `// Auto-generated static moments data
export interface Moment {
  id: string;
  image_url: string;
  title: string;
  description: string;
  year: number;
  aspectRatio?: number;
  display_order?: number;
}

export const MOMENTS: Moment[] = ${JSON.stringify(processed, null, 2)};
`;

  fs.writeFileSync(path.join(rootDir, 'src', 'data', 'moments.ts'), fileContent, 'utf8');
  console.log(`Wrote ${processed.length} moments to src/data/moments.ts`);
}

async function main() {
  await exportArtworks();
  await exportMoments();
  console.log('Export complete.');
}

main().catch(err => {
  console.error('Fatal export error:', err);
  process.exit(1);
});
