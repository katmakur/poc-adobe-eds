/**
 * Hero Block — supports both image and video backgrounds (full width).
 *
 * Authoring structure:
 * Row 1: image OR video link (e.g., .mp4 URL)
 * Row 2: heading text
 * Row 3: subtext (optional)
 * Row 4: CTA link (optional)
 *
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Check first row for video or image
  const firstRow = rows[0];
  const videoLink = firstRow.querySelector('a[href$=".mp4"], a[href*="youtube"], a[href*="vimeo"]');
  const picture = firstRow.querySelector('picture');

  let mediaEl;

  if (videoLink) {
    // Video hero
    const videoUrl = videoLink.href;
    if (videoUrl.endsWith('.mp4')) {
      mediaEl = document.createElement('video');
      mediaEl.setAttribute('autoplay', '');
      mediaEl.setAttribute('muted', '');
      mediaEl.setAttribute('loop', '');
      mediaEl.setAttribute('playsinline', '');
      mediaEl.innerHTML = `<source src="${videoUrl}" type="video/mp4">`;
    } else {
      // YouTube/Vimeo embed
      mediaEl = document.createElement('div');
      mediaEl.className = 'hero-video-embed';
      mediaEl.innerHTML = `<iframe src="${videoUrl}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    }
    mediaEl.className = `${mediaEl.className || ''} hero-media hero-video`.trim();
  } else if (picture) {
    mediaEl = picture.cloneNode(true);
    mediaEl.className = 'hero-media';
  }

  // Extract text content from remaining rows
  const contentRows = rows.slice(1);
  const contentEl = document.createElement('div');
  contentEl.className = 'hero-content';

  contentRows.forEach((row) => {
    const inner = row.querySelector('div');
    if (inner) {
      [...inner.children].forEach((child) => contentEl.append(child.cloneNode(true)));
    }
  });

  // Rebuild block
  block.textContent = '';
  if (mediaEl) block.append(mediaEl);
  block.append(contentEl);
}
