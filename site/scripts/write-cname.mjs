/**
 * After build: write CNAME into dist/ when customDomain is set.
 * GitHub Pages reads this file to bind the custom domain.
 */
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { customDomain } from '../domain.config.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, '..', 'dist');

if (!existsSync(dist)) {
  console.error('dist/ not found — run build first');
  process.exit(1);
}

const domain = (customDomain || '').replace(/^https?:\/\//, '').replace(/\/$/, '').trim();

if (!domain) {
  console.log('[cname] customDomain empty — skip CNAME (using github.io URL)');
  process.exit(0);
}

writeFileSync(join(dist, 'CNAME'), `${domain}\n`, 'utf8');
console.log(`[cname] wrote dist/CNAME → ${domain}`);
