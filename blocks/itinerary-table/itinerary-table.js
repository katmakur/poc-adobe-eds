/**
 * Itinerary Table Block
 * Renders the day-by-day port itinerary as a styled timeline.
 * Each row has: [0] day number, [1] port details
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const rows = [...block.children];
  const timeline = document.createElement('div');
  timeline.className = 'itinerary-timeline';

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;

    const dayText = cols[0].textContent.trim();
    const portContent = cols[1].innerHTML;
    const isAtSea = portContent.toLowerCase().includes('at sea') || portContent.toLowerCase().includes('cruising');

    const stop = document.createElement('div');
    stop.className = `itinerary-stop${isAtSea ? ' at-sea' : ''}`;
    stop.innerHTML = `
      <div class="itinerary-day">${dayText}</div>
      <div class="itinerary-dot"></div>
      <div class="itinerary-info">${portContent}</div>
    `;
    timeline.append(stop);
  });

  block.replaceChildren(timeline);
}
