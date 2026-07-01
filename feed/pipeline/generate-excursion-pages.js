/**
 * Feed Pipeline: Generate Excursion Pages
 *
 * This script reads the excursion feed JSON and generates individual HTML pages
 * in the drafts/ folder, simulating what a production pipeline would do against
 * SharePoint/Google Drive via their APIs.
 *
 * In production:
 * - Feed data arrives as JSON from the excursion feed service
 * - This pipeline creates/updates/deletes .docx files in SharePoint
 * - Each excursion gets its own document at the correct path
 * - The AEM Sidekick bulk-publishes them
 *
 * For local dev, we generate .html files in drafts/ to simulate this.
 *
 * Usage: node feed/pipeline/generate-excursion-pages.js
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..', '..');
const feedPath = join(projectRoot, 'feed', 'analysis', 'excursion-en.json');
const outputRoot = join(projectRoot, 'drafts', 'cruise-destinations');

// Read feed data
const feedData = JSON.parse(readFileSync(feedPath, 'utf-8'));

// Port mapping (in production, this comes from port feed)
const portMap = {
  PSD: { name: 'Port Said', destination: 'mediterranean', destinationName: 'Mediterranean' },
  JNU: { name: 'Juneau', destination: 'alaska-cruises', destinationName: 'Alaska' },
  KTN: { name: 'Ketchikan', destination: 'alaska-cruises', destinationName: 'Alaska' },
};

/**
 * Generate HTML page for a single excursion.
 * This mirrors what would be a .docx in SharePoint with EDS block tables.
 */
function generateExcursionPage(excursion, port) {
  const slug = excursion.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `<html>
<head>
  <title>${excursion.name} | Holland America Line</title>
  <meta name="description" content="${excursion.shortDescription || excursion.name}">
  <meta name="template" content="excursion-detail">
  <meta name="excursion-id" content="${excursion.id}">
  <meta name="port-id" content="${excursion.portID}">
  <meta name="parent-id" content="${excursion.parentId}">
</head>
<body>
  <header></header>
  <main>
    <div>
      <div class="excursion-detail">
        <div>
          <div>
            <p>${excursion.id}</p>
            <p>${excursion.name}</p>
            <p>${port.name}</p>
            <p>${port.destinationName}</p>
            <p>${excursion.activityLevel}</p>
            <p>${excursion.collectionType}</p>
            <p>${excursion.duration}</p>
            <p>${excursion.priceLevel}</p>
            <p>${excursion.currency}</p>
            <p>${excursion.wheelChairAccessible}</p>
            <p>${excursion.longDescription.replace(/<[^>]+>/g, '')}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
  <footer></footer>
</body>
</html>`;
}

// Process each excursion
let created = 0;
let skipped = 0;

feedData.forEach((excursion) => {
  const port = portMap[excursion.portID];
  if (!port) {
    skipped += 1;
    return;
  }

  // URL path: /cruise-destinations/<destination>/<port-slug>/ports/<portID>/<parentId>/<excursionId>
  const pagePath = join(
    outputRoot,
    port.destination,
    `${port.name.toLowerCase().replace(/\s+/g, '-')}-ports`,
    excursion.portID.toLowerCase(),
    excursion.parentId,
    `${excursion.id}.html`,
  );

  const pageDir = dirname(pagePath);
  if (!existsSync(pageDir)) {
    mkdirSync(pageDir, { recursive: true });
  }

  const html = generateExcursionPage(excursion, port);
  writeFileSync(pagePath, html, 'utf-8');
  created += 1;
});

console.log(`\nExcursion Page Generation Complete`);
console.log(`  Created: ${created}`);
console.log(`  Skipped (no port mapping): ${skipped}`);
console.log(`  Output: ${outputRoot}`);
