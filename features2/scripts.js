// === Scroll reveal ===
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => io.observe(el));

// === Composer chips ===
const chips = document.querySelectorAll('.chip');
const liveCopy = document.getElementById('liveCopy');

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.setAttribute('aria-pressed', 'false'));
    chip.setAttribute('aria-pressed', 'true');
    liveCopy.textContent = `Together, ${chip.dataset.text}`;
  });
});

// === Network slider ===
const nodesInput = document.getElementById('nodes');
const rangeVal = document.getElementById('rangeVal');
nodesInput?.addEventListener('input', (e) => {
  const val = e.target.value;
  rangeVal.textContent = val;
  drawConstellation(val);
});

// === Simple constellation visual ===
const canvas = document.getElementById('constellation');
const ctx = canvas?.getContext('2d');
function drawConstellation(nodes = 24) {
  if (!ctx) return;
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  const points = [];
  for (let i = 0; i < nodes; i++) {
    points.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    });
  }

  ctx.fillStyle = '#ff9a3c';
  points.forEach(p => ctx.beginPath() || ctx.arc(p.x, p.y, 4, 0, Math.PI*2) || ctx.fill());

  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  points.forEach((p, i) => {
    points.forEach((q, j) => {
      if (i !== j) {
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 160) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    });
  });

  document.getElementById('metrics').textContent =
    `Nodes: ${nodes} • Plays: ${Math.round(nodes*11.5)} • Lift: ${(nodes/24*3.3).toFixed(1)}×`;
}
drawConstellation();

// === Contact form simulation ===
const form = document.getElementById('contactForm');
const msg = document.getElementById('formMsg');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  msg.textContent = 'Sending...';
  setTimeout(() => {
    msg.textContent = 'Signal received — we’ll return with your first move.';
    form.reset();
  }, 1000);
});