// Simple client for textcloud
const $ = id => document.getElementById(id);

function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  $(`view-${name}`).classList.remove('hidden');
  $(`tab-${name}`).classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
  // map ids used: tab-recent, tab-search, tab-submit, view-recent, view-search, view-submit
  $('tab-recent').addEventListener('click', () => { showView('recent'); loadRecent(); });
  $('tab-search').addEventListener('click', () => showView('search'));
  $('tab-submit').addEventListener('click', () => showView('submit'));

  // initial load
  loadRecent();

  // submit form
  $('submit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = $('username').value.trim();
    const text = $('text').value.trim();
    if (!username || !text) return alert('username and text required');
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, text })
      });
      if (!res.ok) throw new Error(await res.text());
      const post = await res.json();
      $('submit-result').innerText = `Posted: ${post.username}: ${post.text}`;
      $('username').value = '';
      $('text').value = '';
      loadRecent();
      showView('recent');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });

  // search
  $('search-btn').addEventListener('click', async () => {
    const q = $('search-input').value.trim();
    const url = '/api/posts?q=' + encodeURIComponent(q) + '&limit=200';
    const res = await fetch(url);
    const posts = await res.json();
    renderList($('search-list'), posts);
  });
});

async function loadRecent() {
  const res = await fetch('/api/recent?limit=200');
  const posts = await res.json();
  renderList($('recent-list'), posts);
}

function renderList(container, posts) {
  if (!posts || posts.length === 0) {
    container.innerHTML = '<p class="empty">No posts</p>';
    return;
  }
  container.innerHTML = '';
  posts.forEach(p => {
    const node = document.createElement('div');
    node.className = 'post';
    const time = new Date(p.created_at).toLocaleString();
    node.innerHTML = `<div class="meta"><strong>${escapeHtml(p.username)}</strong> <span class="time">${time}</span></div>
      <div class="body">${escapeHtml(p.text)}</div>`;
    container.appendChild(node);
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
