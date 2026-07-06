/**
 * Cruise Results Block
 * Fetches cruise data from Fusion search and renders result cards.
 *
 * Authoring structure:
 * Row 1: Title | Description
 * Row 2: CTA text | CTA link
 * Row 3 (optional): rows count (default 5)
 *
 * @param {Element} block The block element
 */

const FUSION_API = 'https://www.hollandamerica.com/search/halcruisesearch';
const PROXY_API = 'http://localhost:3001/api/cruise-search';

function getSearchUrl() {
  // Use proxy on localhost to avoid CORS; direct API in production
  if (window.location.hostname === 'localhost') return PROXY_API;
  return FUSION_API;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function parseShipName(raw) {
  if (!raw) return '';
  return raw.split('#@#')[0];
}

function buildMapUrl(itineraryId) {
  const itinUpper = (itineraryId || '').toUpperCase();
  return `https://www.hollandamerica.com/content/dam/hal/maps/${itinUpper}/${itinUpper}_tablet_2x.jpg.image.360.270.high.jpg`;
}

function buildCard(cruise) {
  const shipName = parseShipName(cruise.shipName);
  const price = cruise.price_USD_IN_BASEPRICE_d;
  const nightName = cruise.nightName || '';
  const departDate = formatDate(cruise.departDate);
  const contentPath = cruise.contentPath || '#';
  const mapUrl = buildMapUrl(cruise.itineraryId);

  return `
    <div class="cruise-results-card">
      <div class="cruise-results-card-map">
        <img src="${mapUrl}" alt="${nightName} route map" loading="lazy">
      </div>
      <div class="cruise-results-card-info">
        <h4>${nightName}</h4>
        <p class="cruise-results-card-ship">Ship <strong>${shipName}</strong> | ${departDate}</p>
        <div class="cruise-results-card-footer">
          <div class="cruise-results-card-price">
            <span class="cruise-results-card-price-label">from</span>
            <span class="cruise-results-card-price-value">$${Math.round(price)}*</span>
            <span class="cruise-results-card-price-unit">per person</span>
          </div>
          <a href="${contentPath}" class="cruise-results-card-cta">View Itinerary</a>
        </div>
      </div>
    </div>
  `;
}

export default async function decorate(block) {
  const rows = [...block.children];

  // Parse authored content
  let title = 'Featured Cruises';
  let description = '';
  let ctaText = 'View All Cruises';
  let ctaLink = '/find-a-cruise';
  let rowCount = 5;

  if (rows[0]) {
    const cols = [...rows[0].children];
    title = cols[0] ? cols[0].textContent.trim() : title;
    description = cols[1] ? cols[1].textContent.trim() : '';
  }
  if (rows[1]) {
    const cols = [...rows[1].children];
    ctaText = cols[0] ? cols[0].textContent.trim() : ctaText;
    const link = cols[1] ? cols[1].querySelector('a') : null;
    ctaLink = link ? link.href : ctaLink;
  }
  if (rows[2]) {
    const count = parseInt(rows[2].textContent.trim(), 10);
    if (count > 0) rowCount = count;
  }

  // Show loading state
  block.innerHTML = `
    <div class="cruise-results-header">
      <h2>${title}</h2>
      ${description ? `<p>${description}</p>` : ''}
      <a href="${ctaLink}" class="cruise-results-header-cta">${ctaText}</a>
    </div>
    <div class="cruise-results-cards">
      <p class="cruise-results-loading">Loading cruises...</p>
    </div>
    <div class="cruise-results-nav">
      <button class="cruise-results-prev" aria-label="Previous" type="button">&#8249;</button>
      <button class="cruise-results-next" aria-label="Next" type="button">&#8250;</button>
    </div>
  `;

  // Arrow navigation
  const cardsContainer = block.querySelector('.cruise-results-cards');
  const scrollAmount = 320;
  block.querySelector('.cruise-results-prev').addEventListener('click', () => {
    cardsContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
  block.querySelector('.cruise-results-next').addEventListener('click', () => {
    cardsContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  // Fetch from Fusion
  try {
    const params = new URLSearchParams({
      start: '0',
      rows: String(rowCount),
      country: 'us',
      language: 'en',
    });
    const resp = await fetch(`${getSearchUrl()}?${params}`);
    if (!resp.ok) throw new Error('Fusion search failed');

    const data = await resp.json();
    const docs = data.response?.docs || [];

    if (docs.length === 0) {
      block.querySelector('.cruise-results-cards').innerHTML = '<p>No cruises found.</p>';
      return;
    }

    const cardsHtml = docs.map((doc) => buildCard(doc)).join('');
    block.querySelector('.cruise-results-cards').innerHTML = cardsHtml;
  } catch (error) {
    block.querySelector('.cruise-results-cards').innerHTML = '<p>Unable to load cruises. Please try again later.</p>';
  }
}
