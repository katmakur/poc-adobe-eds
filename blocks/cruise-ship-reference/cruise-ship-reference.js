/**
 * Cruise Ship Reference Block
 * Renders a linked ship card on the cruise page.
 *
 * Fields: [0] shipName, [1] guests, [2] version, [3] shipPageUrl
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const row = block.querySelector(':scope > div > div');
  if (!row) return;

  const fields = [...row.querySelectorAll('p')];
  if (fields.length < 4) return;

  const data = {
    name: fields[0].textContent.trim(),
    guests: fields[1].textContent.trim(),
    version: fields[2].textContent.trim(),
    url: fields[3].textContent.trim(),
  };

  block.innerHTML = `
    <div class="cruise-ship-reference-card">
      <h3>Your Ship</h3>
      <a href="${data.url}" class="cruise-ship-reference-link">
        <span class="cruise-ship-reference-name">${data.name}</span>
        ${data.guests ? `<span class="cruise-ship-reference-meta">${data.guests} guests</span>` : ''}
        <span class="cruise-ship-reference-cta">View Ship Details &rarr;</span>
      </a>
    </div>
  `;
}
