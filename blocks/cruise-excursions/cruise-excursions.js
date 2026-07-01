/**
 * Cruise Excursions Block
 * Renders a list of available shore excursions for this cruise.
 *
 * Field [0]: double-pipe separated excursion entries
 * Each entry: id|name|duration|price|currency
 * Field [1]: total excursion count
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const row = block.querySelector(':scope > div > div');
  if (!row) return;

  const fields = [...row.querySelectorAll('p')];
  if (fields.length < 2) return;

  const rawData = fields[0].textContent.trim();
  const totalCount = parseInt(fields[1].textContent.trim(), 10) || 0;

  const excursionEntries = rawData.split('||').map((entry) => {
    const parts = entry.split('|');
    return {
      id: parts[0] || '',
      name: parts[1] || '',
      duration: parts[2] || '',
      price: parts[3] || '',
      currency: parts[4] || 'USD',
    };
  }).filter((e) => e.id);

  block.innerHTML = `
    <div class="cruise-excursions-content">
      <h2>Shore Excursions</h2>
      <p class="cruise-excursions-count">${totalCount} excursions available</p>
      <div class="cruise-excursions-list">
        ${excursionEntries.map((ex) => `
          <div class="cruise-excursions-item">
            <div class="cruise-excursions-item-info">
              <span class="cruise-excursions-item-name">${ex.name}</span>
              <span class="cruise-excursions-item-duration">${ex.duration}</span>
            </div>
            <div class="cruise-excursions-item-price">
              ${ex.price ? `From $${ex.price}` : 'Price TBD'}
            </div>
          </div>
        `).join('')}
      </div>
      ${totalCount > excursionEntries.length ? `<p class="cruise-excursions-more">+ ${totalCount - excursionEntries.length} more excursions</p>` : ''}
    </div>
  `;
}
