const cards = document.querySelectorAll('.card');

function isFrontFacing(card) {
  const transform = getComputedStyle(card).transform;
  if (!transform || transform === 'none') return false;

  const matrix = transform.match(/matrix3d\((.+)\)/);
  if (!matrix) return false;

  const values = matrix[1].split(',').map(Number);
  const zNormal = values[10]; // cosine of Y rotation
  return zNormal > 0.9; // front-facing threshold
}

cards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    const rect = card.getBoundingClientRect();
    const glass = card.querySelector('.glass');

    if (!glass) return;

    // front-facing check
    if (!isFrontFacing(card)) return;

    card.classList.add('is-front');

    // edge detection
    const glassWidth = glass.offsetWidth;
    if (rect.right + glassWidth > window.innerWidth) {
      card.classList.add('glass-left');
    } else {
      card.classList.remove('glass-left');
    }
  });

  card.addEventListener('mouseleave', () => {
    card.classList.remove('glass-left', 'is-front');
  });

  // Mobile tap support
  card.addEventListener('click', () => {
    if (window.innerWidth > 768) return;
    card.classList.toggle('is-active');
  });
});