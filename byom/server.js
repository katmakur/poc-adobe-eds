/**
 * BYOM (Bring Your Own Markup) Service for HAL Cruise Pages
 *
 * This middleware generates fully rendered HTML for cruise detail pages
 * by resolving all feed references (ship, port, excursion) at request time.
 *
 * URL pattern: /find-a-cruise/:itineraryId/:cruiseId
 *
 * In production, this would be an Adobe App Builder action or serverless function.
 * For POC, it's a local Express server.
 */

import express from 'express';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const feedDir = join(__dirname, '..', 'feed', 'prod-feed');

// Load feed data
console.log('Loading feed data...');
const cruises = JSON.parse(readFileSync(join(feedDir, 'cruise-en.json'), 'utf-8'));
console.log(`  Cruises: ${cruises.length}`);
const ships = JSON.parse(readFileSync(join(feedDir, 'ship-en.json'), 'utf-8'));
console.log(`  Ships: ${ships.length}`);
const ports = JSON.parse(readFileSync(join(feedDir, 'port-en.json'), 'utf-8'));
console.log(`  Ports: ${ports.length}`);
const excursions = JSON.parse(readFileSync(join(feedDir, 'excursion-en.json'), 'utf-8'));
console.log(`  Excursions: ${excursions.length}`);

// Build lookup maps
const shipMap = new Map(ships.map((s) => [s.id, s]));
const portMap = new Map(ports.map((p) => [p.id, p]));
const excursionMap = new Map(excursions.map((e) => [e.id, e]));

const app = express();
const PORT = 3001;

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
 * Format date for display
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Format short date (no year)
 */
function formatShortDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

/**
 * Generate the cruise detail page HTML markup
 */
function generateCruiseMarkup(cruise) {
  const ship = shipMap.get(cruise.shipId);
  const shipName = ship ? ship.name : cruise.shipId;
  const shipGuests = ship ? ship.guests : '';
  const shipDescription = ship ? (ship.shortDescription || '') : '';

  // Resolve ports of call
  const resolvedPorts = cruise.portsOfCall.map((poc, index) => {
    const port = resolvePort(poc.portId);
    const portExcursions = (poc.excursions || [])
      .map((pe) => {
        const ex = excursionMap.get(pe.id);
        return ex || null;
      })
      .filter(Boolean);

    return {
      ...port,
      day: index + 1,
      arrivalDate: poc.arrivalDate,
      arrivalTime: poc.arrivalTime || '',
      departTime: poc.departTime || '',
      excursions: portExcursions,
      isAtSea: poc.portId === 'ATSEADAY',
    };
  });

  // Count total excursions
  const totalExcursions = resolvedPorts.reduce((sum, p) => sum + p.excursions.length, 0);

  // Build the page sections
  return `<!DOCTYPE html>
<html>
<head>
  <title>${cruise.nightName} aboard ${shipName} | Holland America Line</title>
  <meta name="description" content="${cruise.nightName} departing ${formatDate(cruise.departDate)} from ${resolvedPorts[0]?.name || cruise.departPortId}. ${cruise.duration} nights aboard ${shipName}.">
  <meta name="template" content="cruise-detail">
  <meta name="cruise-id" content="${cruise.id}">
  <meta name="itinerary-id" content="${cruise.itineraryId}">
  <meta name="ship-id" content="${cruise.shipId}">
  <meta name="nav" content="/nav">
  <meta name="footer" content="/footer">
</head>
<body>
  <header></header>
  <main>
    ${renderHeroSection(cruise, shipName)}
    ${renderSummarySection(cruise, shipName, resolvedPorts)}
    ${renderItinerarySection(resolvedPorts)}
    ${renderExcursionsSection(resolvedPorts, totalExcursions)}
    ${renderShipSection(ship, shipName, shipGuests, shipDescription)}
    ${renderCtaSection(cruise, shipName)}
  </main>
  <footer></footer>
</body>
</html>`;
}

function renderHeroSection(cruise, shipName) {
  return `
    <div>
      <div class="hero">
        <div>
          <div>
            <picture>
              <img src="https://placehold.co/1600x500/003366/ffffff?text=${encodeURIComponent(shipName)}" alt="${shipName} cruise ship">
            </picture>
            <h1>${cruise.nightName}</h1>
            <p>Aboard ${shipName} · ${formatDate(cruise.departDate)}</p>
          </div>
        </div>
      </div>
    </div>`;
}

function renderSummarySection(cruise, shipName, resolvedPorts) {
  const departPort = resolvedPorts[0]?.name || cruise.departPortId;
  const arrivalPort = resolvedPorts[resolvedPorts.length - 1]?.name || cruise.arrivalPortId;
  const portCount = resolvedPorts.filter((p) => !p.isAtSea).length;

  return `
    <div>
      <h2>Cruise Overview</h2>
      <div class="columns">
        <div>
          <div>
            <h4>Duration</h4>
            <p>${cruise.duration} Nights</p>
          </div>
          <div>
            <h4>Ship</h4>
            <p>${shipName}</p>
          </div>
        </div>
        <div>
          <div>
            <h4>Departure</h4>
            <p>${formatDate(cruise.departDate)}<br>${departPort}</p>
          </div>
          <div>
            <h4>Arrival</h4>
            <p>${formatDate(cruise.arrivalDate)}<br>${arrivalPort}</p>
          </div>
        </div>
        <div>
          <div>
            <h4>Ports of Call</h4>
            <p>${portCount} ports</p>
          </div>
          <div>
            <h4>Status</h4>
            <p>${cruise.soldOut ? 'Sold Out' : 'Available'}</p>
          </div>
        </div>
      </div>
    </div>`;
}

function renderItinerarySection(resolvedPorts) {
  const rows = resolvedPorts.map((port) => {
    const timeInfo = [];
    if (port.arrivalTime) timeInfo.push(`Arrive: ${port.arrivalTime}`);
    if (port.departTime) timeInfo.push(`Depart: ${port.departTime}`);
    const times = timeInfo.join(' · ') || (port.isAtSea ? 'Cruising' : '');

    return `
        <div>
          <div>
            <p><strong>Day ${port.day}</strong></p>
          </div>
          <div>
            <p><strong>${port.name}</strong>${port.country ? ` (${port.country})` : ''}</p>
            <p>${times}</p>
            ${port.excursions.length > 0 ? `<p>${port.excursions.length} excursion${port.excursions.length > 1 ? 's' : ''} available</p>` : ''}
          </div>
        </div>`;
  }).join('');

  return `
    <div>
      <h2>Day-by-Day Itinerary</h2>
      <div class="itinerary-table">
        ${rows}
      </div>
    </div>`;
}

function renderExcursionsSection(resolvedPorts, totalExcursions) {
  if (totalExcursions === 0) return '';

  const portSections = resolvedPorts
    .filter((p) => p.excursions.length > 0)
    .map((port) => {
      const excursionCards = port.excursions.slice(0, 5).map((ex) => `
          <div>
            <div>
              <h4>${ex.name}</h4>
              <p>${ex.duration || ''}</p>
              <p>${ex.activityLevel ? ex.activityLevel.replace(/_/g, ' ') : ''} · ${ex.collectionType ? ex.collectionType.replace(/_/g, ' ') : ''}</p>
              ${ex.priceLevel ? `<p>From $${ex.priceLevel} ${ex.currency || 'USD'}</p>` : ''}
            </div>
          </div>`).join('');

      return `
      <h3>Day ${port.day} · ${port.name}</h3>
      <div class="cards">
        ${excursionCards}
      </div>
      ${port.excursions.length > 5 ? `<p>+ ${port.excursions.length - 5} more excursions at ${port.name}</p>` : ''}`;
    }).join('');

  return `
    <div>
      <h2>Shore Excursions (${totalExcursions} available)</h2>
      ${portSections}
    </div>`;
}

function renderShipSection(ship, shipName, shipGuests, shipDescription) {
  const roomList = ship && ship.rooms
    ? ship.rooms.map((r) => `<li><strong>${r.name}</strong> — ${r.shortDescription ? r.shortDescription.substring(0, 100) + '...' : ''}</li>`).join('')
    : '';

  return `
    <div>
      <h2>Your Ship: ${shipName}</h2>
      <div class="columns">
        <div>
          <div>
            <picture>
              <img src="https://placehold.co/600x400/1a2b49/ffffff?text=${encodeURIComponent(shipName)}" alt="${shipName}">
            </picture>
          </div>
          <div>
            <p>${shipDescription ? shipDescription.substring(0, 300) + '...' : `Sail aboard the ${shipName}.`}</p>
            ${shipGuests ? `<p><strong>Guests:</strong> ${shipGuests}</p>` : ''}
            ${ship && ship.length ? `<p><strong>Length:</strong> ${ship.length}</p>` : ''}
            ${roomList ? `<h4>Stateroom Categories</h4><ul>${roomList}</ul>` : ''}
          </div>
        </div>
      </div>
    </div>`;
}

function renderCtaSection(cruise, shipName) {
  return `
    <div>
      <h2>Ready to Book?</h2>
      <p>${cruise.nightName} aboard ${shipName} departing ${formatDate(cruise.departDate)}.</p>
      ${cruise.soldOut
    ? '<p><strong>This sailing is currently sold out.</strong> Check similar itineraries.</p>'
    : '<p><strong><a href="/find-a-cruise">Book This Cruise</a></strong></p>'}
    </div>`;
}

// Route: /find-a-cruise/:itineraryId/:cruiseId
app.get('/find-a-cruise/:itineraryId/:cruiseId', (req, res) => {
  const { itineraryId, cruiseId } = req.params;

  // Find cruise by ID (case-insensitive match)
  const cruise = cruises.find(
    (c) => c.id.toLowerCase() === cruiseId.toLowerCase()
      && c.itineraryId.toLowerCase() === itineraryId.toLowerCase(),
  );

  if (!cruise) {
    res.status(404).send(`<html><body><h1>Cruise Not Found</h1><p>No cruise found for itinerary ${itineraryId} / cruise ${cruiseId}</p></body></html>`);
    return;
  }

  const html = generateCruiseMarkup(cruise);
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    feeds: {
      cruises: cruises.length,
      ships: ships.length,
      ports: ports.length,
      excursions: excursions.length,
    },
  });
});

// List available cruises
app.get('/find-a-cruise', (req, res) => {
  const list = cruises.map((c) => ({
    id: c.id,
    itineraryId: c.itineraryId,
    name: c.nightName,
    url: `/find-a-cruise/${c.itineraryId.toLowerCase()}/${c.id.toLowerCase()}`,
  }));
  res.json(list);
});

app.listen(PORT, () => {
  console.log(`BYOM Service running at http://localhost:${PORT}`);
  console.log(`Loaded: ${cruises.length} cruises, ${ships.length} ships, ${ports.length} ports, ${excursions.length} excursions`);
  console.log(`\nTry: http://localhost:${PORT}/find-a-cruise/${cruises[0].itineraryId.toLowerCase()}/${cruises[0].id.toLowerCase()}`);
});
