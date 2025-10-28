// Site-wide enhancements: theme toggle, nav active link, PWA registration
(function () {
  'use strict';

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem('mastermind_theme', theme);
    } catch (_) {}
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
      toggleBtn.textContent = theme === 'light' ? '☀️ Light' : '🌙 Dark';
      toggleBtn.setAttribute('aria-pressed', theme !== 'light');
    }
  }

  function initTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem('mastermind_theme');
    } catch (_) {}
    if (!saved) {
      const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
      saved = prefersLight ? 'light' : 'dark';
    }
    applyTheme(saved);
  }

  function toggleTheme() {
    const currentIsLight = document.documentElement.getAttribute('data-theme') === 'light';
    applyTheme(currentIsLight ? 'dark' : 'light');
  }

  function initNav() {
    const links = document.querySelectorAll('.nav-links a');
    const path = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach((a) => {
      const href = a.getAttribute('href');
      if ((path === '' && href === 'index.html') || href === path) {
        a.classList.add('active');
      }
    });
  }

  function initThemeToggleButton() {
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', toggleTheme);
    }
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').catch(function (err) {
          console.log('SW registration failed:', err);
        });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initNav();
    initThemeToggleButton();
    registerServiceWorker();
  });
})();
