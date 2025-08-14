// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const revealOnScroll = () => {
  const trigger = window.innerHeight * 0.85;
  reveals.forEach(el => {
    const boxTop = el.getBoundingClientRect().top;
    if (boxTop < trigger) {
      el.classList.add('visible');
    }
  });
};
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Count-up animation for table numbers
const counters = document.querySelectorAll('[data-count]');
const speed = 500; // lower = faster
const animateCount = (counter) => {
  const update = () => {
    const target = +counter.getAttribute('data-count');
    const count = +counter.innerText;
    const increment = target / speed;
    if (count < target) {
      counter.innerText = Math.ceil(count + increment);
      requestAnimationFrame(update);
    } else {
      counter.innerText = target.toLocaleString();
    }
  };
  update();
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

counters.forEach(c => observer.observe(c));