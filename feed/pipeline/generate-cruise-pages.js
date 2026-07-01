/**
 * Feed Pipeline: Generate Cruise Pages (with resolved references)
 *
 * Joins cruise feed with ship, port, and excursion feeds to produce
 * fully denormalized cruise detail pages.
 *
 * Data resolution:
 * - Ship: name, guests, version resolved from ship feed
 * - Ports: name, country resolved from port feed
 * - Excursions: name, duration, price resolved from excursion feed
 *
 * Usage: node feed/pipeline/generate-cruise-pages.js
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..', '..');
const feedDir = join(projectRoot, 'feed', 'analysis');
const outputRoot = join(projectRoot, 'drafts', 'find-a-cruise');

// Load all feeds
const cruises = JSON.parse(readFileSync(join(feedDir, 'cruise-en-2.json'), 'utf-8'));
const ships = JSON.parse(readFileSync(join(feedDir, 'ship-en-2.json'), 'utf-8'));
const ports = JSON.parse(readFileSync(join(feedDir, 'port-en-2.json'), 'utf-8'));
const excursions = JSON.parse(readFileSync(join(feedDir, 'excursion-en.json'), 'utf-8'));

// Build lookup maps
const shipMap = new Map();
ships.forEach((s) => { shipMap.set(s.id, s); });

const portMap = new Map();
ports.forEach((p) => { portMap.set(p.id, p); });

const excursionMap = new Map();
excursions.forEach((e) => { excursionMap.set(e.id, e); });

/**
 * Resolve port name from ID
 */
function resolvePort(portId) {
  const port = portMap.get(portId);
  if (port) return { id: portId, name: port.name, country: port.countryID };
  if (portId === 'ATSEADAY') return { id: portId, name: 'At Sea', country: '' };
  return { id: portId, name: portId, country: '' };
}

/**
 * Resolve excursions for a port stop
 */
function resolveExcursions(portExcursions) {
  return portExcursions
    .map((pe) => {
      const ex = excursionMap.get(pe.id);
      if (!ex) return null;
      return {
        id: ex.id,
        name: ex.name,
        duration: ex.duration,
        price: ex.priceLevel,
        currency: ex.currency || 'USD',
        activityLevel: ex.activityLevel,
      };
    })
    .filter(Boolean);
}

/**
 * Generate enriched cruise page HTML with all resolved references
 */
function generateCruisePage(cruise, ship, resolvedPorts, resolvedExcursions) {
  const shipName = ship ? ship.name : cruise.shipId;
  const shipGuests = ship ? ship.guests : '';
  const shipVersion = cruise.shipVersion || (ship ? ship.shipVersion : '');
  const shipSlug = shipName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Build port itinerary as structured data
  const portItinerary = resolvedPorts
    .map((p) => `${p.name}|${p.id}|${p.country}|${p.arrivalDate || ''}|${p.departTime || ''}`)
    .join('||');

  // Build excursion summary (top 10 for page size)
  const topExcursions = resolvedExcursions.slice(0, 10);
  const excursionData = topExcursions
    .map((e) => `${e.id}|${e.name}|${e.duration}|${e.price}|${e.currency}`)
    .join('||');

  return `<html>
<head>
  <title>${cruise.nightName} aboard ${shipName} | Holland America Line</title>
  <meta name="description" content="${cruise.nightName} - Departs ${cruise.departDate} from ${resolvedPorts[0] ? resolvedPorts[0].name : cruise.departPortId}. ${cruise.duration} nights aboard ${shipName}.">
  <meta name="template" content="cruise-detail">
  <meta name="cruise-id" content="${cruise.id}">
  <meta name="itinerary-id" content="${cruise.itineraryId}">
  <meta name="ship-id" content="${cruise.shipId}">
</head>
<body>
  <header></header>
  <main>
    <div>
      <div class="cruise-detail">
        <div>
          <div>
            <p>${cruise.id}</p>
            <p>${cruise.itineraryId}</p>
            <p>${cruise.name}</p>
            <p>${cruise.nightName}</p>
            <p>${shipName}</p>
            <p>${cruise.duration}</p>
            <p>${cruise.departDate}</p>
            <p>${cruise.arrivalDate}</p>
            <p>${resolvedPorts[0] ? resolvedPorts[0].name : cruise.departPortId}</p>
            <p>${resolvedPorts[resolvedPorts.length - 1] ? resolvedPorts[resolvedPorts.length - 1].name : cruise.arrivalPortId}</p>
            <p>${cruise.soldOut}</p>
            <p>${resolvedPorts.filter((p) => p.id !== 'ATSEADAY').map((p) => p.name).join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="cruise-ship-reference">
        <div>
          <div>
            <p>${shipName}</p>
            <p>${shipGuests}</p>
            <p>${shipVersion}</p>
            <p>/cruise-ships/${shipSlug}/${shipVersion}</p>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="cruise-itinerary">
        <div>
          <div>
            <p>${portItinerary}</p>
          </div>
        </div>
      </div>
    </div>
    ${excursionData ? `<div>
      <div class="cruise-excursions">
        <div>
          <div>
            <p>${excursionData}</p>
            <p>${resolvedExcursions.length}</p>
          </div>
        </div>
      </div>
    </div>` : ''}
  </main>
  <footer></footer>
</body>
</html>`;
}

// Process each cruise
let created = 0;

cruises.forEach((cruise) => {
  if (cruise.status !== 'active') return;

  // Resolve ship
  const ship = shipMap.get(cruise.shipId);

  // Resolve ports from portsOfCall
  const resolvedPorts = cruise.portsOfCall.map((poc) => {
    const port = resolvePort(poc.portId);
    return {
      ...port,
      arrivalDate: poc.arrivalDate,
      departTime: poc.departTime,
      dayIndicator: poc.dayIndicator,
    };
  });

  // Resolve all excursions across all ports
  const allExcursions = cruise.portsOfCall
    .flatMap((poc) => resolveExcursions(poc.excursions || []));

  // Generate page
  const itinId = cruise.itineraryId.toLowerCase();
  const cruiseId = cruise.id.toLowerCase();
  const pagePath = join(outputRoot, itinId, `${cruiseId}.html`);

  const pageDir = dirname(pagePath);
  if (!existsSync(pageDir)) {
    mkdirSync(pageDir, { recursive: true });
  }

  const html = generateCruisePage(cruise, ship, resolvedPorts, allExcursions);
  writeFileSync(pagePath, html, 'utf-8');
  created += 1;
});

console.log(`\nCruise Page Generation Complete (with resolved references)`);
console.log(`  Created: ${created}`);
console.log(`  Ships resolved: ${ships.length}`);
console.log(`  Ports available: ${ports.length}`);
console.log(`  Excursions available: ${excursions.length}`);
console.log(`  Output: ${outputRoot}`);
