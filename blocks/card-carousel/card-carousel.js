import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Card Carousel Block
 *
 * Authoring structure:
 * Row 1 (optional): Component title + description (single column, no image)
 * Row 2+: Each row = one card with columns: [image] [title + description + CTA link]
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Detect if first row is a header (no image, just text)
  const firstRow = rows[0];
  const firstRowHasImage = firstRow.querySelector('picture');
  let headerEl = null;
  let cardRows = rows;

  if (!firstRowHasImage) {
    // First row is the component header
    headerEl = document.createElement('div');
    headerEl.className = 'card-carousel-header';
    headerEl.innerHTML = firstRow.querySelector('div').innerHTML;
    cardRows = rows.slice(1);
  }

  // Build carousel track
  const track = document.createElement('div');
  track.className = 'card-carousel-track';

  cardRows.forEach((row) => {
    const cols = [...row.children];
    const card = document.createElement('div');
    card.className = 'card-carousel-card';

    // Image (full background)
    const imgCol = cols[0];
    const picture = imgCol ? imgCol.querySelector('picture') : null;
    if (picture) {
      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'card-carousel-card-image';
      imgWrapper.append(picture.cloneNode(true));
      card.append(imgWrapper);
    }

    // Text overlay (title, description, CTA)
    const textCol = cols[1];
    if (textCol) {
      const overlay = document.createElement('div');
      overlay.className = 'card-carousel-card-overlay';
      overlay.innerHTML = textCol.innerHTML;
      card.append(overlay);
    }

    track.append(card);
  });

  // Optimize images
  track.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimized);
  });

  // Navigation arrows
  const nav = document.createElement('div');
  nav.className = 'card-carousel-nav';
  nav.innerHTML = `
    <button class="card-carousel-prev" aria-label="Previous" type="button">&#8249;</button>
    <button class="card-carousel-next" aria-label="Next" type="button">&#8250;</button>
  `;

  // Scroll logic
  const scrollAmount = 300;
  nav.querySelector('.card-carousel-prev').addEventListener('click', () => {
    track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
  nav.querySelector('.card-carousel-next').addEventListener('click', () => {
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  // Rebuild block
  block.textContent = '';
  if (headerEl) block.append(headerEl);
  block.append(track);
  block.append(nav);
}
