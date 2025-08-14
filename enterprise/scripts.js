// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
function revealOnScroll() {
  const trigger = window.innerHeight * 0.85;
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < trigger) {
      el.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Count-up animation for numbers
function animateCount(el) {
  const target = +el.getAttribute('data-count');
  let count = 0;
  const speed = target / 100;
  const update = () => {
    count += speed;
    if (count < target) {
      el.innerText = Math.floor(count);
      requestAnimationFrame(update);
    } else {
      el.innerText = target.toLocaleString();
    }
  };
  update();
}

const counters = document.querySelectorAll('[data-count]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

counters.forEach(c => observer.observe(c));