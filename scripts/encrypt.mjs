/**
 * Post-build script: encrypt all HTML files in .vitepress/dist with Staticrypt.
 * Usage: SITE_PASSWORD=xxx SITE_SALT=xxx node scripts/encrypt.mjs
 */
import { execSync } from 'child_process';
import { readdirSync, statSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import { join, dirname } from 'path';

const DIST_DIR = '.vitepress/dist';
const PASSWORD = process.env.SITE_PASSWORD;
const SALT = process.env.SITE_SALT;

if (!PASSWORD) {
  console.error('Error: SITE_PASSWORD environment variable is required.');
  process.exit(1);
}

if (!SALT) {
  console.error('Error: SITE_SALT environment variable is required.');
  process.exit(1);
}

function findHtmlFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      files.push(...findHtmlFiles(fullPath));
    } else if (entry.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

const htmlFiles = findHtmlFiles(DIST_DIR);
console.log(`Found ${htmlFiles.length} HTML files to encrypt.`);

for (const file of htmlFiles) {
  execSync(
    `npx staticrypt "${file}" -p "${PASSWORD}" --short --remember 30 --salt "${SALT}" -d "${dirname(file)}"`,
    { stdio: 'inherit' }
  );
}
console.log('All HTML files encrypted successfully.');

// Remove package.json from dist (MPA mode generates it, causes Zeabur to
// misdetect as Node.js app instead of static site → 502)
const pkgPath = join(DIST_DIR, 'package.json');
if (existsSync(pkgPath)) {
  unlinkSync(pkgPath);
  console.log('Removed package.json from dist.');
}

// Block crawlers
writeFileSync(join(DIST_DIR, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
console.log('Added robots.txt.');
