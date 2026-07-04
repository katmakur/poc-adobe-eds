import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Promo Cards Block — 3-card layout with 75% image / 25% text + CTA.
 *
 * Authoring structure (per row = one card):
 * Column 1: image
 * Column 2: title + description + CTA link
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cols = [...row.children];

    // Column 1: image
    if (cols[0]) {
      const imageDiv = document.createElement('div');
      imageDiv.className = 'promo-cards-image';
      imageDiv.innerHTML = cols[0].innerHTML;
      li.append(imageDiv);
    }

    // Column 2: text content
    if (cols[1]) {
      const bodyDiv = document.createElement('div');
      bodyDiv.className = 'promo-cards-body';
      bodyDiv.innerHTML = cols[1].innerHTML;
      li.append(bodyDiv);
    }

    ul.append(li);
  });

  // Optimize images
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimized);
  });

  block.replaceChildren(ul);
}
