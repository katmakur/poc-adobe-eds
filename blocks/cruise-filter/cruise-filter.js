/**
 * Cruise Filter Block
 *
 * Renders a horizontal filter bar with dropdown filters and a CTA button.
 *
 * Authoring structure (table):
 * Row 1: filter1Label | filter1Options (comma-separated)
 * Row 2: filter2Label | filter2Options (comma-separated)
 * Row 3: filter3Label | filter3Options (comma-separated)
 * Row N (last): CTA button text | CTA link
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const filters = [];
  let ctaText = 'Find Your Cruise';
  let ctaLink = '/find-a-cruise';

  rows.forEach((row, index) => {
    const cols = [...row.children];
    const label = cols[0] ? cols[0].textContent.trim() : '';
    const value = cols[1] ? cols[1].textContent.trim() : '';

    // Last row is the CTA
    if (index === rows.length - 1 && cols[1]) {
      const link = cols[1].querySelector('a');
      ctaText = label;
      ctaLink = link ? link.href : value;
      return;
    }

    // Parse filter options
    const options = value.split(',').map((opt) => opt.trim()).filter(Boolean);
    if (label) {
      filters.push({ label, options });
    }
  });

  // Build filter bar
  const filterBar = document.createElement('div');
  filterBar.className = 'cruise-filter-bar';

  const filtersHtml = filters.map((filter) => {
    const optionsHtml = filter.options.length > 0
      ? filter.options.map((opt) => `<option value="${opt}">${opt}</option>`).join('')
      : '';

    return `
      <div class="cruise-filter-item">
        <select aria-label="${filter.label}">
          <option value="">${filter.label}</option>
          ${optionsHtml}
        </select>
        <span class="cruise-filter-chevron">&#8964;</span>
      </div>
    `;
  }).join('');

  filterBar.innerHTML = `
    <div class="cruise-filter-dropdowns">
      ${filtersHtml}
    </div>
    <a href="${ctaLink}" class="cruise-filter-cta">${ctaText}</a>
  `;

  block.textContent = '';
  block.append(filterBar);
}
