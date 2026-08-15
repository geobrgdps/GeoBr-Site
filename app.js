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

function youtubeId(url) {
  if (!url) return '';
  const match = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/i);
  return match ? match[1] : '';
}

function thumbnailUrl(level) {
  if (level.thumbnail) return level.thumbnail;
  const id = youtubeId(level.video);
  return id ? 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg' : '';
}

function closeDetails() {
  const modal = document.querySelector('#level-modal');
  if (modal) modal.remove();
}

function showDetails(level) {
  closeDetails();
  const videoId = youtubeId(level.video);
  const video = videoId
    ? '<div class="video-wrap"><iframe src="https://www.youtube.com/embed/' + escapeHtml(videoId) + '" title="Showcase - ' + escapeHtml(level.name) + '" allowfullscreen loading="lazy"></iframe></div>'
    : '<div class="video-empty">Nenhum Showcase configurado.</div>';
  const showcase = level.video
    ? '<a class="showcase-link" href="' + escapeHtml(level.video) + '" target="_blank" rel="noopener">Abrir Showcase ↗</a>'
    : '<span class="showcase-disabled">Showcase não configurado</span>';

  const modal = document.createElement('div');
  modal.id = 'level-modal';
  modal.className = 'modal-backdrop';
  modal.innerHTML = '<div class="level-modal" role="dialog" aria-modal="true">' +
    '<button class="modal-close" aria-label="Fechar">×</button>' +
    '<div class="modal-rank">#' + escapeHtml(level.position) + '</div>' +
    '<h2>' + escapeHtml(level.name) + '</h2>' +
    '<p class="modal-creator">' + (level.creator ? 'por ' + escapeHtml(level.creator) : 'Creator não definido') + '</p>' +
    video +
    '<div class="details-grid">' +
      '<div><small>Dificuldade</small><strong>' + escapeHtml(level.difficulty || 'Demon') + '</strong></div>' +
      '<div><small>Verificador</small><strong>' + escapeHtml(level.verifier || 'Não definido') + '</strong></div>' +
      '<div><small>ID</small><strong>' + escapeHtml(level.id || 'Não definido') + '</strong></div>' +
      '<div><small>Status</small><strong>' + escapeHtml(level.status || 'Published') + '</strong></div>' +
    '</div>' +
    '<div class="showcase-area">' + showcase + '</div>' +
  '</div>';

  document.body.appendChild(modal);
  modal.querySelector('.modal-close').addEventListener('click', closeDetails);
  modal.addEventListener('click', function (event) {
    if (event.target === modal) closeDetails();
  });
}

function render() {
  const levels = Array.isArray(window.LEVELS)
    ? window.LEVELS
    : (typeof LEVELS !== 'undefined' && Array.isArray(LEVELS) ? LEVELS : []);
  const query = (search.value || '').trim().toLowerCase();
  const items = levels.filter(function (level) {
    if (!query) return true;
    return [level.name, level.creator, level.verifier, level.id].join(' ').toLowerCase().includes(query);
  }).sort(function (a, b) {
    return (Number(a.position) || 999999) - (Number(b.position) || 999999);
  });

  count.textContent = String(levels.length);
  empty.hidden = items.length !== 0;
  list.innerHTML = items.map(function (level) {
    const creator = level.creator ? 'by ' + escapeHtml(level.creator) : 'Creator not set';
    const difficulty = level.difficulty || 'Demon';
    const thumb = thumbnailUrl(level);
    const image = thumb
      ? '<img class="level-thumb" src="' + escapeHtml(thumb) + '" alt="Thumbnail de ' + escapeHtml(level.name) + '" loading="lazy">'
      : '<div class="level-thumb placeholder">GD</div>';
    return '<article class="level">' +
      image +
      '<div class="rank">#' + escapeHtml(level.position) + '</div>' +
      '<div class="level-info"><div class="name">' + escapeHtml(level.name) + '</div><div class="creator">' + creator + '</div></div>' +
      '<div class="meta"><span class="difficulty">' + escapeHtml(difficulty) + '</span><button class="view-btn" data-position="' + escapeHtml(level.position) + '">Ver 🔍</button></div>' +
    '</article>';
  }).join('');

  list.querySelectorAll('.view-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      const level = levels.find(function (item) { return String(item.position) === String(button.dataset.position); });
      if (level) showDetails(level);
    });
  });
}

search.addEventListener('input', render);
document.addEventListener('keydown', function (event) { if (event.key === 'Escape') closeDetails(); });
render();