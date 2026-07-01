/**
 * Cruise Itinerary Block
 * Renders the port-by-port itinerary timeline.
 *
 * Field [0]: pipe-delimited port entries separated by ||
 * Each entry: portName|portId|country|arrivalDate|departTime
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const row = block.querySelector(':scope > div > div');
  if (!row) return;

  const fields = [...row.querySelectorAll('p')];
  if (fields.length < 1) return;

  const rawData = fields[0].textContent.trim();
  const portEntries = rawData.split('||').map((entry) => {
    const parts = entry.split('|');
    return {
      name: parts[0] || '',
      id: parts[1] || '',
      country: parts[2] || '',
      arrivalDate: parts[3] || '',
      departTime: parts[4] || '',
    };
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  block.innerHTML = `
    <div class="cruise-itinerary-content">
      <h2>Itinerary</h2>
      <div class="cruise-itinerary-timeline">
        ${portEntries.map((port, index) => `
          <div class="cruise-itinerary-stop ${port.id === 'ATSEADAY' ? 'at-sea' : ''}">
            <div class="cruise-itinerary-day">Day ${index + 1}</div>
            <div class="cruise-itinerary-dot"></div>
            <div class="cruise-itinerary-info">
              <span class="cruise-itinerary-port-name">${port.name}</span>
              ${port.arrivalDate ? `<span class="cruise-itinerary-date">${formatDate(port.arrivalDate)}</span>` : ''}
              ${port.departTime ? `<span class="cruise-itinerary-time">Departs ${port.departTime}</span>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
