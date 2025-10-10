// scripts.js

// Smooth reveal on scroll
const reveals = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
  const trigger = window.innerHeight * 0.85;
  reveals.forEach((el) => {
    const top = el.getBoundingClientRect().top;
    if (top < trigger) {
      el.classList.add('visible');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  });
});

// Hero headline type‑in effect (threshold hook)
const headline = document.querySelector('.headline');
if (headline) {
  const text = headline.textContent;
  headline.textContent = '';
  let i = 0;
  const type = () => {
    if (i < text.length) {
      headline.textContent += text.charAt(i);
      i++;
      setTimeout(type, 40);
    }
  };
  type();
}

// Intersection observer for number/index animation
const tenetIndexEls = document.querySelectorAll('.tenet-index');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('pop');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

tenetIndexEls.forEach(el => observer.observe(el));

// Button hover pulse
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    btn.classList.add('pulse');
  });
  btn.addEventListener('animationend', () => {
    btn.classList.remove('pulse');
  });
});