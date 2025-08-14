(function(){
  const doc = document;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Smooth anchor scrolling enhancement (respects reduced motion)
  if (!prefersReduced) {
    doc.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href').slice(1);
        if (!id) return;
        const el = doc.getElementById(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Move focus for accessibility
          el.setAttribute('tabindex', '-1');
          el.focus({ preventScroll: true });
        }
      });
    });
  }

  // Reveal on scroll with IntersectionObserver
  const revealEls = Array.from(doc.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
          if (delay && !prefersReduced) {
            setTimeout(() => el.classList.add('visible'), delay);
          } else {
            el.classList.add('visible');
          }
          io.unobserve(el);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    // Fallback: show everything
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // Scroll progress bar
  const progress = doc.getElementById('progress');
  const setProgress = () => {
    const h = doc.documentElement;
    const scrolled = (h.scrollTop || doc.body.scrollTop);
    const height = (h.scrollHeight - h.clientHeight);
    const pct = height ? (scrolled / height) * 100 : 0;
    progress.style.width = pct + '%';
  };
  if (progress) {
    document.addEventListener('scroll', setProgress, { passive: true });
    window.addEventListener('load', setProgress);
  }

  // Subtle parallax for decorative orbs (CSS variables)
  const orbs = doc.querySelector('.orbs');
  const onParallax = () => {
    if (!orbs || prefersReduced) return;
    const y = window.scrollY || 0;
    // Map scroll to small translations
    doc.documentElement.style.setProperty('--parallax-y', String(y));
    const k1 = y * 0.04, k2 = y * -0.03, k3 = y * 0.02;
    const o1 = doc.querySelector('.orb-1');
    const o2 = doc.querySelector('.orb-2');
    const o3 = doc.querySelector('.orb-3');
    if (o1) o1.style.transform = `translate3d(${k1}px, ${k1}px, 0)`;
    if (o2) o2.style.transform = `translate3d(${k2}px, ${-k2}px, 0)`;
    if (o3) o3.style.transform = `translate3d(${k3}px, ${-k3}px, 0)`;
  };
  document.addEventListener('scroll', onParallax, { passive: true });
  window.addEventListener('load', onParallax);
})();