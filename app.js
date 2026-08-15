const list = document.querySelector('#list');
const search = document.querySelector('#search');
const count = document.querySelector('#count');
const empty = document.querySelector('#empty');

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, function (char) {
    const map = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'};
    return map[char];
  });
}

function render() {
  // levels.js declares `const LEVELS`, which is not a window property.
  // Support both that form and a future window.LEVELS data source.
  const levels = Array.isArray(window.LEVELS)
    ? window.LEVELS
    : (typeof LEVELS !== 'undefined' && Array.isArray(LEVELS) ? LEVELS : []);

  const query = (search.value || '').trim().toLowerCase();
  const items = levels
    .filter(function (level) {
      if (!query) return true;
      return [level.name, level.creator, level.verifier, level.id]
        .join(' ')
        .toLowerCase()
        .includes(query);
    })
    .sort(function (a, b) {
      return (Number(a.position) || 999999) - (Number(b.position) || 999999);
    });

  count.textContent = String(levels.length);
  empty.hidden = items.length !== 0;

  list.innerHTML = items.map(function (level) {
    const creator = level.creator ? 'by ' + escapeHtml(level.creator) : 'Creator not set';
    const difficulty = level.difficulty || 'Demon';

    return '<article class="level">' +
      '<div class="rank">#' + escapeHtml(level.position) + '</div>' +
      '<div>' +
        '<div class="name">' + escapeHtml(level.name) + '</div>' +
        '<div class="creator">' + creator + '</div>' +
      '</div>' +
      '<div class="meta"><span class="difficulty">' + escapeHtml(difficulty) + '</span></div>' +
    '</article>';
  }).join('');
}

search.addEventListener('input', render);
render();
