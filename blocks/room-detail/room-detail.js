/**
 * Room Detail Block
 * Reads room category data embedded in the page by the feed pipeline.
 *
 * Field order:
 * [0] shipId, [1] shipName, [2] shipVersion, [3] roomTypeId, [4] roomTypeName,
 * [5] categoryId, [6] categoryName, [7] shortDescription, [8] longDescription,
 * [9] amenities (pipe-separated), [10] subCategories (double-pipe separated),
 * [11] area
 *
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const row = block.querySelector(':scope > div > div');
  if (!row) return;

  const fields = [...row.querySelectorAll('p')];
  if (fields.length < 10) {
    block.textContent = 'Room data incomplete.';
    return;
  }

  const data = {
    shipId: fields[0].textContent.trim(),
    shipName: fields[1].textContent.trim(),
    shipVersion: fields[2].textContent.trim(),
    roomTypeId: fields[3].textContent.trim(),
    roomTypeName: fields[4].textContent.trim(),
    categoryId: fields[5].textContent.trim(),
    categoryName: fields[6].textContent.trim(),
    shortDescription: fields[7].textContent.trim(),
    longDescription: fields[8].textContent.trim(),
    amenities: fields[9].textContent.trim(),
    subCategories: fields.length > 10 ? fields[10].textContent.trim() : '',
    area: fields.length > 11 ? fields[11].textContent.trim() : '',
  };

  const shipSlug = data.shipName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const amenitiesList = data.amenities
    ? data.amenities.split(' | ').filter(Boolean)
    : [];

  block.innerHTML = `
    <div class="room-detail-content">
      <nav class="room-detail-breadcrumb" aria-label="Breadcrumb">
        <a href="/cruise-ships">Ships</a> &rsaquo;
        <a href="/cruise-ships/${shipSlug}/${data.shipVersion}">${data.shipName}</a> &rsaquo;
        <span>${data.roomTypeName}</span> &rsaquo;
        <span>${data.categoryName}</span>
      </nav>
      <h1>${data.categoryName}</h1>
      <p class="room-detail-subtitle">${data.roomTypeName} &mdash; ${data.shipName}</p>
      <div class="room-detail-description">
        <p>${data.longDescription || data.shortDescription}</p>
      </div>
      ${amenitiesList.length > 0 ? `
      <div class="room-detail-amenities">
        <h2>Amenities</h2>
        <ul>
          ${amenitiesList.map((a) => `<li>${a}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
    </div>
  `;
}
