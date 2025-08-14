// Theme, TOC toggle, scrollspy, smooth scroll, reveal, copy buttons, accordion a11y

(function () {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const toc = document.getElementById('toc');
  const tocToggle = document.getElementById('tocToggle');
  const links = toc ? Array.from(toc.querySelectorAll('a')) : [];
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  // Persisted theme
  const saved = localStorage.getItem('bi-theme') || 'light';
  root.setAttribute('data-theme', saved);
  if (themeToggle) themeToggle.textContent = saved === 'dark' ? 'Light mode' : 'Dark mode';

  // Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const cur = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', cur);
      localStorage.setItem('bi-theme', cur);
      themeToggle.textContent = cur === 'dark' ? 'Light mode' : 'Dark mode';
      themeToggle.setAttribute('aria-pressed', String(cur === 'dark'));
    });
  }

  // TOC toggle (mobile)
  if (tocToggle && toc) {
    tocToggle.addEventListener('click', () => {
      const open = toc.classList.toggle('open');
      tocToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, '', id);
        }
      }
    });
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal, .section .card, .section h2');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // Scrollspy (highlight active section in TOC)
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const link = toc.querySelector(`a[href="#${id}"]`);
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0% -60% 0%', threshold: 0.0 });
    sections.forEach(sec => spy.observe(sec));
  }

  // Copy to clipboard for code blocks
  document.querySelectorAll('.codeblock .copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pre = btn.nextElementSibling;
      const code = pre ? pre.innerText : '';
      try {
        await navigator.clipboard.writeText(code);
        const original = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(() => (btn.textContent = original), 1200);
      } catch {
        // Fallback select
        const range = document.createRange();
        range.selectNodeContents(pre);
        const sel = window.getSelection();
        sel.removeAllRanges(); sel.addRange(range);
        document.execCommand('copy');
        sel.removeAllRanges();
        btn.textContent = 'Copied';
        setTimeout(() => (btn.textContent = 'Copy'), 1200);
      }
    });
  });

  // Accordion aria-expanded sync
  document.querySelectorAll('details.accordion').forEach(d => {
    const summary = d.querySelector('summary.acc-head');
    if (summary) {
      summary.addEventListener('click', () => {
        const expanded = d.hasAttribute('open');
        // click fires before state flips; timeout to sync
        setTimeout(() => summary.setAttribute('aria-expanded', String(d.hasAttribute('open'))), 0);
      });
    }
  });
})();