/**
 * Ship Detail Block
 * Reads ship data embedded in the page by the feed pipeline.
 *
 * Field order:
 * [0] shipId, [1] name, [2] version, [3] guests, [4] length,
 * [5] width, [6] speed, [7] roomSummary, [8] shortDescription
 *
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const row = block.querySelector(':scope > div > div');
  if (!row) return;

  const fields = [...row.querySelectorAll('p')];
  if (fields.length < 9) {
    block.textContent = 'Ship data incomplete.';
    return;
  }

  const data = {
    shipId: fields[0].textContent.trim(),
    name: fields[1].textContent.trim(),
    version: fields[2].textContent.trim(),
    guests: fields[3].textContent.trim(),
    length: fields[4].textContent.trim(),
    width: fields[5].textContent.trim(),
    speed: fields[6].textContent.trim(),
    roomSummary: fields[7].textContent.trim(),
    description: fields[8].textContent.trim(),
  };

  block.innerHTML = `
    <div class="ship-detail-content">
      <nav class="ship-detail-breadcrumb" aria-label="Breadcrumb">
        <a href="/cruise-ships">Cruise Ships</a> &rsaquo;
        <span>${data.name}</span>
      </nav>
      <h1>${data.name}</h1>
      <div class="ship-detail-specs">
        <div class="ship-detail-spec-item">
          <strong>Guests</strong>
          <span>${data.guests}</span>
        </div>
        <div class="ship-detail-spec-item">
          <strong>Length</strong>
          <span>${data.length}</span>
        </div>
        <div class="ship-detail-spec-item">
          <strong>Beam</strong>
          <span>${data.width}</span>
        </div>
        <div class="ship-detail-spec-item">
          <strong>Speed</strong>
          <span>${data.speed}</span>
        </div>
      </div>
      <div class="ship-detail-description">
        <h2>About ${data.name}</h2>
        <p>${data.description}</p>
      </div>
      <div class="ship-detail-rooms">
        <h2>Staterooms & Suites</h2>
        <p>${data.roomSummary}</p>
      </div>
    </div>
  `;
}
