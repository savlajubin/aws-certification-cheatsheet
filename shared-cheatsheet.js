/* ============================================================
   AWS Cheat Sheet — Shared JavaScript
   Theme toggle, search, progress bar, active nav
   ============================================================ */

// ---------- THEME ----------
(function initTheme() {
  const saved = localStorage.getItem('aws-cheatsheet-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }
  // If no saved preference, don't set data-theme at all.
  // CSS @media (prefers-color-scheme: dark) handles the system default.

  // Listen for OS theme changes (only matters when no explicit choice saved)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!localStorage.getItem('aws-cheatsheet-theme')) {
      updateToggleLabel();
    }
  });
})();

function getEffectiveTheme() {
  const explicit = document.documentElement.getAttribute('data-theme');
  if (explicit) return explicit;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function toggleTheme() {
  const current = getEffectiveTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('aws-cheatsheet-theme', next);
  updateToggleLabel();
}

function updateToggleLabel() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const isDark = getEffectiveTheme() === 'dark';
  btn.textContent = isDark ? '☀️ Light' : '🌙 Dark';
}

document.addEventListener('DOMContentLoaded', updateToggleLabel);

// ---------- SEARCH ----------
function searchContent(query) {
  // Remove previous highlights
  document.querySelectorAll('.highlight').forEach(el => {
    el.outerHTML = el.textContent;
  });
  if (!query || query.length < 2) return;

  const content = document.querySelector('.content');
  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null, false);
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const nodes = [];

  while (walker.nextNode()) {
    if (regex.test(walker.currentNode.textContent)) {
      nodes.push(walker.currentNode);
    }
  }

  nodes.forEach(node => {
    const span = document.createElement('span');
    span.innerHTML = node.textContent.replace(regex, '<span class="highlight">$1</span>');
    node.parentNode.replaceChild(span, node);
  });

  const first = document.querySelector('.highlight');
  if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ---------- PROGRESS BAR ----------
window.addEventListener('scroll', () => {
  const winScroll = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const bar = document.getElementById('progressBar');
  if (bar && height > 0) {
    bar.style.width = (winScroll / height) * 100 + '%';
  }
});

// ---------- ACTIVE NAV LINK ----------
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.sidebar a');
  let current = '';
  sections.forEach(section => {
    if (scrollY >= section.offsetTop - 80) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});
