/**
 * Feed Pipeline: Generate Ship & Room Pages
 *
 * Reads the ship feed JSON and generates pages for:
 * - Ship version page: /cruise-ships/<shipName>/<version>
 * - Room type pages: /cruise-ships/<shipName>/<version>/rooms/<roomTypeId>/<categorySlug>
 *
 * In production:
 * - Feed data arrives as JSON from the ship service
 * - This pipeline creates/updates/deletes .docx files in SharePoint via API
 * - Authors may add static components to room pages after generation
 *
 * Usage: node feed/pipeline/generate-ship-pages.js
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..', '..');
const shipFeedPath = join(projectRoot, 'feed', 'analysis', 'ship-en-2.json');
const outputRoot = join(projectRoot, 'drafts', 'cruise-ships');

// Read feed data
const ships = JSON.parse(readFileSync(shipFeedPath, 'utf-8'));

/**
 * Generate slug from ship name
 */
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Generate ship version page HTML
 */
function generateShipPage(ship) {
  const roomSummary = ship.rooms
    .map((r) => `${r.name} (${r.categories.length} categories)`)
    .join(', ');

  return `<html>
<head>
  <title>${ship.name} | Cruise Ships | Holland America Line</title>
  <meta name="description" content="${ship.shortDescription ? ship.shortDescription.substring(0, 160) : `Explore ${ship.name} cruise ship`}">
  <meta name="template" content="ship-detail">
  <meta name="ship-id" content="${ship.id}">
  <meta name="ship-version" content="${ship.shipVersion}">
</head>
<body>
  <header></header>
  <main>
    <div>
      <div class="ship-detail">
        <div>
          <div>
            <p>${ship.id}</p>
            <p>${ship.name}</p>
            <p>${ship.shipVersion}</p>
            <p>${ship.guests || ''}</p>
            <p>${ship.length || ''}</p>
            <p>${ship.width || ''}</p>
            <p>${ship.speed || ''}</p>
            <p>${roomSummary}</p>
            <p>${ship.shortDescription || ''}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
  <footer></footer>
</body>
</html>`;
}

/**
 * Generate room category page HTML
 */
function generateRoomPage(ship, room, category) {
  const amenitiesList = category.amenities
    ? category.amenities.join(' | ')
    : '';

  const subCategoriesList = category.subCategories
    ? category.subCategories.map((sc) => `${sc.id}: ${sc.title}`).join(' || ')
    : '';

  return `<html>
<head>
  <title>${category.name} - ${ship.name} | Holland America Line</title>
  <meta name="description" content="${category.shortDescription ? category.shortDescription.substring(0, 160) : `${category.name} on ${ship.name}`}">
  <meta name="template" content="room-detail">
  <meta name="ship-id" content="${ship.id}">
  <meta name="ship-version" content="${ship.shipVersion}">
  <meta name="room-type-id" content="${room.id}">
  <meta name="category-id" content="${category.id}">
</head>
<body>
  <header></header>
  <main>
    <div>
      <div class="room-detail">
        <div>
          <div>
            <p>${ship.id}</p>
            <p>${ship.name}</p>
            <p>${ship.shipVersion}</p>
            <p>${room.id}</p>
            <p>${room.name}</p>
            <p>${category.id}</p>
            <p>${category.name}</p>
            <p>${category.shortDescription || ''}</p>
            <p>${category.longDescription || ''}</p>
            <p>${amenitiesList}</p>
            <p>${subCategoriesList}</p>
            <p>${category.area || ''}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
  <footer></footer>
</body>
</html>`;
}

// Process each ship
let shipPages = 0;
let roomPages = 0;

ships.forEach((ship) => {
  const shipSlug = slugify(ship.name);
  const version = ship.shipVersion;

  // Generate ship version page
  const shipPagePath = join(outputRoot, shipSlug, version, 'index.html');
  const shipDir = dirname(shipPagePath);
  if (!existsSync(shipDir)) {
    mkdirSync(shipDir, { recursive: true });
  }
  writeFileSync(shipPagePath, generateShipPage(ship), 'utf-8');
  shipPages += 1;

  // Generate room pages
  ship.rooms.forEach((room) => {
    const roomTypeSlug = slugify(room.id);

    room.categories.forEach((category) => {
      const categorySlug = slugify(category.name);
      const roomPagePath = join(
        outputRoot,
        shipSlug,
        version,
        'rooms',
        roomTypeSlug,
        `${categorySlug}.html`,
      );

      const roomDir = dirname(roomPagePath);
      if (!existsSync(roomDir)) {
        mkdirSync(roomDir, { recursive: true });
      }
      writeFileSync(roomPagePath, generateRoomPage(ship, room, category), 'utf-8');
      roomPages += 1;
    });
  });
});

console.log(`\nShip & Room Page Generation Complete`);
console.log(`  Ship pages: ${shipPages}`);
console.log(`  Room pages: ${roomPages}`);
console.log(`  Output: ${outputRoot}`);
