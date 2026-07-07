/**
 * Cruise Info Block
 *
 * Two-tile comparison layout (e.g., Alaska Cruises vs Alaska Cruisetours).
 *
 * Authoring structure:
 * Row 1: Block title (col1) | Block description (col2)
 * Row 2+: Each row = one tile (2 rows = 2 tiles side by side):
 *   Col 1: Image
 *   Col 2: All text content:
 *     - H3/H4: Tile title
 *     - First <p> with "Duration:" prefix → duration line
 *     - <p> with "Departs:" prefix → departs line
 *     - <p> with "+" characters → icon badges row
 *     - Remaining <p> (bold) → section description
 *     - <ul> → bullet highlights
 *     - Last <a> → CTA link
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  // Row 1: Header
  const headerRow = rows[0];
  const headerCols = [...headerRow.children];
  const blockTitle = headerCols[0] ? headerCols[0].innerHTML : '';
  const blockDesc = headerCols[1] ? headerCols[1].innerHTML : '';

  // Remaining rows: tiles
  const tileRows = rows.slice(1);
  const tiles = tileRows.map((row) => {
    const cols = [...row.children];
    const imageCol = cols[0];
    const contentCol = cols[1];

    const image = imageCol ? imageCol.querySelector('picture') : null;
    const content = contentCol ? contentCol.innerHTML : '';

    return { image: image ? image.outerHTML : '', content };
  });

  // Build output
  const tilesHtml = tiles.map((tile) => `
    <div class="cruise-info-tile">
      <div class="cruise-info-tile-image">
        ${tile.image}
      </div>
      <div class="cruise-info-tile-content">
        ${tile.content}
      </div>
    </div>
  `).join('');

  block.innerHTML = `
    <div class="cruise-info-header">
      ${blockTitle}
      ${blockDesc}
    </div>
    <div class="cruise-info-tiles">
      ${tilesHtml}
    </div>
  `;
}
