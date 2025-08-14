// IntersectionObserver for reveal animations
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

// Features strip: staggered reveal and hover micro-interaction already handled by CSS
const featuresStrip = document.querySelector('.features-strip');
if (featuresStrip) {
  featuresStrip.classList.add('staggered');
  featuresStrip.querySelectorAll('.feature-card').forEach(card => io.observe(card));
}

// Composer chips
const chips = document.querySelectorAll('.chip');
const liveCopy = document.getElementById('liveCopy');

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.setAttribute('aria-pressed', 'false'));
    chip.setAttribute('aria-pressed', 'true');
    liveCopy.textContent = `Together, ${chip.dataset.text}`;
  });
});

// Network slider + constellation
const nodesInput = document.getElementById('nodes');
const rangeVal = document.getElementById('rangeVal');
const metricsEl = document.getElementById('metrics');
const canvas = document.getElementById('constellation');
const ctx = canvas ? canvas.getContext('2d') : null;

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width);
  canvas.height = Math.floor(rect.height);
}

function drawConstellation(nodes = 24) {
  if (!ctx || !canvas) return;
  resizeCanvas();
  ctx.clearRect(0,0,canvas.width,canvas.height);

  const points = [];
  for (let i = 0; i < nodes; i++) {
    points.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    });
  }

  // Nodes
  ctx.fillStyle = '#ff9a3c';
  points.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3.5, 0, Math.PI*2);
    ctx.fill();
  });

  // Connections
  ctx.strokeStyle = 'rgba(255,255,255,0.14)';
  ctx.lineWidth = 1;
  const maxDist = Math.min(canvas.width, canvas.height) * 0.22;
  points.forEach((p, i) => {
    for (let j = i + 1; j < points.length; j++) {
      const q = points[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const dist = Math.hypot(dx, dy);
      if (dist < maxDist) {
        ctx.globalAlpha = 1 - (dist / maxDist);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  });
  ctx.globalAlpha = 1;

  // Metrics
  const plays = Math.round(nodes * 11.5);
  const lift = (nodes / 24 * 3.3).toFixed(1);
  if (metricsEl) metricsEl.textContent = `Nodes: ${nodes} • Plays: ${plays} • Lift: ${lift}×`;
}

nodesInput?.addEventListener('input', (e) => {
  const val = Number(e.target.value);
  if (rangeVal) rangeVal.textContent = String(val);
  drawConstellation(val);
});

window.addEventListener('resize', () => {
  const val = Number(nodesInput?.value || 24);
  drawConstellation(val);
});

// Initial draw
drawConstellation(Number(nodesInput?.value || 24));

// Contact form simulation
const form = document.getElementById('contactForm');
const msg = document.getElementById('formMsg');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (msg) msg.textContent = 'Sending...';
  setTimeout(() => {
    if (msg) msg.textContent = 'Signal received — we’ll return with your first move.';
    form.reset();
  }, 900);
});
```[43dcd9a7-70db-4a1f-b0ae-981daa162054](https://github.com/surajpaul/testGlamyo/tree/f2a4b1204fbd789dccb3fbb4a648267620600ca8/resources%2Fviews%2Fauth%2Fregister.blade.php?citationMarker=43dcd9a7-70db-4a1f-b0ae-981daa162054 "1")