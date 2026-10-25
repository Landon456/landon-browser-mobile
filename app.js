(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const STORE = {
    accent: 'llbm-accent-v1',
    engine: 'llbm-engine-v1',
    bookmarks: 'llbm-bookmarks-v1'
  };
  const defaultBookmarks = [];
  let toastTimer;

  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
  }

  function normalizeUrl(raw) {
    let value = String(raw || '').trim();
    if (!value) throw new Error('Enter a website address.');
    if (!/^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(value)) value = `https://${value}`;
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error('Only web links (http or https) are supported.');
    return url.href;
  }

  function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    const n = Number.parseInt(clean, 16);
    return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
  }

  function applyAccent(value, save = false) {
    if (!/^#[0-9a-fA-F]{6}$/.test(value)) return;
    document.documentElement.style.setProperty('--accent', value);
    document.documentElement.style.setProperty('--accent-rgb', hexToRgb(value));
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = value;
    $('#accentPicker').value = value;
    if (save) localStorage.setItem(STORE.accent, value);
  }

  function getBookmarks() {
    try {
      const value = JSON.parse(localStorage.getItem(STORE.bookmarks) || '[]');
      return Array.isArray(value) ? value.filter(item => item && typeof item.name === 'string' && typeof item.url === 'string') : defaultBookmarks;
    } catch { return defaultBookmarks; }
  }

  function renderBookmarks() {
    const list = $('#bookmarksList');
    const empty = $('#emptyBookmarks');
    list.replaceChildren();
    const bookmarks = getBookmarks();
    empty.classList.toggle('hidden', bookmarks.length > 0);
    bookmarks.forEach((bookmark, index) => {
      const link = document.createElement('a');
      link.className = 'bookmark-item';
      link.href = bookmark.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      const icon = document.createElement('span');
      icon.className = 'bookmark-icon';
      icon.textContent = bookmark.name.trim().charAt(0).toUpperCase() || '★';
      const text = document.createElement('span');
      text.className = 'bookmark-text';
      const name = document.createElement('strong');
      name.textContent = bookmark.name;
      const url = document.createElement('small');
      url.textContent = bookmark.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
      text.append(name, url);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'bookmark-delete';
      remove.setAttribute('aria-label', `Delete ${bookmark.name}`);
      remove.title = 'Delete bookmark';
      remove.textContent = '×';
      remove.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const next = getBookmarks();
        next.splice(index, 1);
        localStorage.setItem(STORE.bookmarks, JSON.stringify(next));
        renderBookmarks();
        showToast('Bookmark removed');
      });
      link.append(icon, text);
      // Keep the remove button outside the anchor so it is keyboard-accessible and works reliably on iOS.
      const row = document.createElement('div');
      row.className = 'bookmark-item';
      link.className = 'bookmark-item-link';
      link.style.cssText = 'display:flex;align-items:center;gap:11px;min-width:0;flex:1;color:inherit;text-decoration:none;';
      row.append(link, remove);
      list.append(row);
    });
  }

  function toggleBookmarkForm(open) {
    $('#bookmarkForm').classList.toggle('hidden', !open);
    if (open) $('#bookmarkName').focus();
  }

  function search(query) {
    const value = String(query || '').trim();
    if (!value) return;
    const engine = $('#enginePicker').value || localStorage.getItem(STORE.engine) || 'google';
    // Treat a value as a URL only when it looks like a hostname or includes a URL scheme.
    const looksLikeUrl = /^(https?:\/\/|[\w-]+\.[a-z]{2,}(\/|$|\?)) /i.test(value) || /^(https?:\/\/|[\w-]+\.[a-z]{2,}(\/|$|\?))/i.test(value);
    if (looksLikeUrl) {
      try {
        const target = normalizeUrl(value);
        window.open(target, '_blank', 'noopener,noreferrer');
        return;
      } catch { /* Fall through to a web search. */ }
    }
    const engines = {
      google: 'https://www.google.com/search?q=',
      bing: 'https://www.bing.com/search?q=',
      duckduckgo: 'https://duckduckgo.com/?q='
    };
    window.open((engines[engine] || engines.google) + encodeURIComponent(value), '_blank', 'noopener,noreferrer');
  }

  $('#searchForm').addEventListener('submit', (event) => {
    event.preventDefault();
    search($('#searchInput').value);
  });
  $('#addBookmarkToggle').addEventListener('click', () => toggleBookmarkForm($('#bookmarkForm').classList.contains('hidden')));
  $('#cancelBookmark').addEventListener('click', () => toggleBookmarkForm(false));
  $('#bookmarkForm').addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const name = $('#bookmarkName').value.trim();
      const url = normalizeUrl($('#bookmarkUrl').value);
      if (!name) throw new Error('Enter a name for this bookmark.');
      const bookmarks = getBookmarks();
      if (bookmarks.length >= 40) throw new Error('You can save up to 40 bookmarks.');
      bookmarks.push({ name, url });
      localStorage.setItem(STORE.bookmarks, JSON.stringify(bookmarks));
      $('#bookmarkName').value = '';
      $('#bookmarkUrl').value = '';
      toggleBookmarkForm(false);
      renderBookmarks();
      showToast('Bookmark saved on this device');
    } catch (error) {
      showToast(error.message || 'Could not save bookmark');
    }
  });

  function setSettingsVisible(visible) {
    $('#settingsPanel').classList.toggle('hidden', !visible);
    if (visible) $('#settingsPanel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  $('#settingsToggle').addEventListener('click', () => setSettingsVisible($('#settingsPanel').classList.contains('hidden')));
  $('#settingsClose').addEventListener('click', () => setSettingsVisible(false));
  $('#accentPicker').addEventListener('input', event => applyAccent(event.target.value, true));
  $('#enginePicker').addEventListener('change', event => {
    localStorage.setItem(STORE.engine, event.target.value);
    showToast(`${event.target.options[event.target.selectedIndex].text} selected`);
  });

  // A same-origin service worker lets the installed home-screen app load its start page offline.
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }
  const savedAccent = localStorage.getItem(STORE.accent);
  if (savedAccent) applyAccent(savedAccent);
  const savedEngine = localStorage.getItem(STORE.engine) || 'google';
  $('#enginePicker').value = ['google', 'bing', 'duckduckgo'].includes(savedEngine) ? savedEngine : 'google';
  renderBookmarks();
})();
