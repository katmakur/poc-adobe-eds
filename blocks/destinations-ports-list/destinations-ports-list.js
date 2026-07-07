/**
 * Destinations Ports List Block
 *
 * Tabbed port showcase with title, description, highlights, RTE, CTA, map image, and gallery.
 *
 * Authoring structure:
 * Row 1: Block title (col1) | Block description (col2)
 * Row 2+: Each row = one tab/port:
 *   Col 1: Port title (h3/h4) + bullet highlights + RTE description + CTA link
 *   Col 2: Map/main image + gallery images (multiple pictures)
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  // Row 1: Block header
  const headerRow = rows[0];
  const headerCols = [...headerRow.children];
  const blockTitle = headerCols[0] ? headerCols[0].innerHTML : '';
  const blockDescription = headerCols[1] ? headerCols[1].innerHTML : '';

  // Remaining rows: tabs
  const tabRows = rows.slice(1);
  const tabs = tabRows.map((row) => {
    const cols = [...row.children];
    const contentCol = cols[0];
    const imageCol = cols[1];

    // Extract port title from first heading
    const heading = contentCol ? contentCol.querySelector('h3, h4, h2') : null;
    const title = heading ? heading.textContent.trim() : 'Port';

    // Content (everything in col1)
    const content = contentCol ? contentCol.innerHTML : '';

    // Images from col2 (map + gallery)
    const pictures = imageCol ? [...imageCol.querySelectorAll('picture')] : [];
    const mapImage = pictures[0] ? pictures[0].outerHTML : '';
    const galleryImages = pictures.slice(1).map((p) => p.outerHTML);

    return {
      title, content, mapImage, galleryImages,
    };
  });

  // Build tabs UI
  const tabNav = tabs.map((tab, i) => `<button class="dpl-tab-btn${i === 0 ? ' active' : ''}" data-index="${i}" type="button">${tab.title}</button>`).join('');

  const tabPanels = tabs.map((tab, i) => `
    <div class="dpl-panel${i === 0 ? ' active' : ''}" data-index="${i}">
      <div class="dpl-panel-layout">
        <div class="dpl-panel-content">
          ${tab.content}
        </div>
        <div class="dpl-panel-map">
          ${tab.mapImage}
        </div>
      </div>
      ${tab.galleryImages.length > 0 ? `
      <div class="dpl-panel-gallery">
        ${tab.galleryImages.map((img) => `<div class="dpl-gallery-item">${img}</div>`).join('')}
      </div>
      ` : ''}
    </div>
  `).join('');

  block.innerHTML = `
    <div class="dpl-header">
      ${blockTitle}
      ${blockDescription}
    </div>
    <div class="dpl-tabs">
      ${tabNav}
    </div>
    <div class="dpl-panels">
      ${tabPanels}
    </div>
  `;

  // Tab click handler
  block.querySelectorAll('.dpl-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const { index } = btn.dataset;
      // Update active tab
      block.querySelectorAll('.dpl-tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      // Update active panel
      block.querySelectorAll('.dpl-panel').forEach((p) => p.classList.remove('active'));
      block.querySelector(`.dpl-panel[data-index="${index}"]`).classList.add('active');
    });
  });
}
