// Canvas + modal elements
const canvas = document.getElementById('flywheel');
const ctx = canvas.getContext('2d');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDetail = document.getElementById('modal-detail');
const gaugeArea = document.getElementById('gaugeArea');
const closeBtn = document.getElementById('closeBtn');

// Animation state
let angle = 0;
let pulseAngle = 0;

// Stage definitions (colors are also orbit colors)
const stages = [
  {
    key: 'asi',
    label: 'ASI Saga Deployment',
    color: '#00e0ff',
    detail:
      'Proves concept inside our own startup, generating real decision logs, KPI gains, and refined agent charters.',
    kpis: [
      { label: 'Decision Speed %↑', value: 15, unit: '%' },
      { label: 'OTIF %↑', value: 8, unit: '%' },
      { label: 'Audit Trail %', value: 100, unit: '%' }
    ]
  },
  {
    key: 'network',
    label: 'Startup Network Growth',
    color: '#ff6ec7',
    detail:
      'Rapid adoption by global startups; each adds unique domain knowledge and market signals.',
    kpis: [
      { label: 'Startups Onboarded', value: 50, unit: '' },
      { label: 'Sectors Covered', value: 12, unit: '' },
      { label: 'Downtime Hours', value: 0, unit: 'h' }
    ]
  },
  {
    key: 'vault',
    label: 'Shared Learning Vault',
    color: '#ffd166',
    detail:
      'Anonymised best practices and negotiation heuristics enrich all connected boardrooms.',
    kpis: [
      { label: 'Playbooks', value: 200, unit: '' },
      { label: 'Negotiation Patterns', value: 35, unit: '' },
      { label: 'Model Updates', value: 24, unit: '' }
    ]
  },
  {
    key: 'propagation',
    label: 'Propagation',
    color: '#06d6a0',
    detail:
      'Upgrades and insights flow back to every boardroom, including ASI Saga, raising the baseline.',
    kpis: [
      { label: 'Updates/Month', value: 2, unit: '' },
      { label: 'KPI Lift %', value: 15, unit: '%' },
      { label: 'Manual Patches', value: 0, unit: '' }
    ]
  },
  {
    key: 'acceleration',
    label: 'Acceleration',
    color: '#ef476f',
    detail:
      'Loop spins faster with each cycle — capability density compounds across the network.',
    kpis: [
      { label: 'ROI %↑', value: 120, unit: '%' },
      { label: 'Time-to-Impact %↓', value: 40, unit: '%' },
      { label: 'Emergent Strategies', value: 7, unit: '' }
    ]
  }
];

// Radii as fractions of max usable radius (from center to canvas edge minus margin)
const radiiFractions = [0.3, 0.5, 0.68, 0.84, 1.0];

// Canvas sizing and DPI handling
function resizeCanvas() {
  const containerW = canvas.clientWidth;
  const containerH = canvas.clientHeight;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.floor(containerW * dpr);
  canvas.height = Math.floor(containerH * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function getCenter() {
  return { cx: canvas.clientWidth / 2, cy: canvas.clientHeight / 2 };
}

function draw() {
  // Clear
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  const { cx, cy } = getCenter();
  const minDim = Math.min(canvas.clientWidth, canvas.clientHeight);
  const margin = 60; // keep labels inside
  const maxRad = Math.max(40, minDim / 2 - margin);

  // Thickness of orbit and dot size scales with viewport
  const orbitWidth = Math.max(1.2, minDim / 900);
  const dotRadius = Math.max(8, Math.floor(minDim / 100));
  const fontSize = Math.max(12, Math.floor(minDim / 60));
  ctx.font = `${fontSize}px Segoe UI, system-ui, Arial`;

  // Compute radii for stages dynamically
  const radii = radiiFractions.map(f => f * maxRad);

  // Draw orbits
  stages.forEach((stage, i) => {
    ctx.beginPath();
    ctx.arc(cx, cy, radii[i], 0, Math.PI * 2);
    ctx.strokeStyle = stage.color;
    ctx.lineWidth = orbitWidth;
    ctx.stroke();
  });

  // Data pulses: shimmering radial beams + traveling dots between consecutive orbits
  for (let i = 0; i < stages.length - 1; i++) {
    const angleBase = pulseAngle + i * 0.9;
    const innerR = radii[i];
    const outerR = radii[i + 1];

    // Draw several beams around the base angle for shimmer
    for (let s = -2; s <= 2; s++) {
      const a = angleBase + s * 0.06;
      const ix = cx + innerR * Math.cos(a);
      const iy = cy + innerR * Math.sin(a);
      const ox = cx + outerR * Math.cos(a);
      const oy = cy + outerR * Math.sin(a);
      const grad = ctx.createLinearGradient(ix, iy, ox, oy);
      grad.addColorStop(0, `${stages[i].color}`);
      grad.addColorStop(1, `${stages[i + 1].color}`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ix, iy);
      ctx.lineTo(ox, oy);
      ctx.stroke();

      // Moving pulse dots along the line
      const pulses = 3;
      for (let p = 0; p < pulses; p++) {
        const t = ((pulseAngle * 0.15 + p * 0.25) % 1 + 1) % 1; // 0..1
        const px = ix + (ox - ix) * t;
        const py = iy + (oy - iy) * t;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = p === 0 ? stages[i + 1].color : stages[i].color;
        ctx.globalAlpha = 0.8 - 0.25 * p;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
  }

  // Rotating nodes + labels
  stages.forEach((stage, idx) => {
    const a = angle + idx;
    const x = cx + radii[idx] * Math.cos(a);
    const y = cy + radii[idx] * Math.sin(a);

    // Dot
    ctx.beginPath();
    ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = stage.color;
    ctx.fill();

    // Label
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(stage.label, x, y - (dotRadius + 10));

    // Cache current hit area
    stage._x = x;
    stage._y = y;
    stage._hitR = dotRadius + 4;
  });

  // Advance animation
  angle += 0.003;
  pulseAngle += 0.02;

  requestAnimationFrame(draw);
}
draw();

// Hit testing
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  for (const stage of stages) {
    const dx = mx - stage._x;
    const dy = my - stage._y;
    if (Math.hypot(dx, dy) <= stage._hitR) {
      openStageModal(stage);
      break;
    }
  }
});

// Modal logic
function openStageModal(stage) {
  modalTitle.textContent = stage.label;
  modalDetail.textContent = stage.detail;
  gaugeArea.innerHTML = '';

  // Build gauges for KPIs
  stage.kpis.forEach(kpi => {
    const container = document.createElement('div');
    container.className = 'gauge-container';

    const gaugeCanvas = document.createElement('canvas');
    gaugeCanvas.className = 'gauge-canvas';
    // Set canvas pixel size (CSS handles display size)
    gaugeCanvas.width = 160;
    gaugeCanvas.height = 160;

    const valueEl = document.createElement('div');
    valueEl.className = 'gauge-value';
    valueEl.textContent = '—';

    const label = document.createElement('div');
    label.className = 'gauge-label';
    label.textContent = kpi.label;

    container.appendChild(gaugeCanvas);
    container.appendChild(valueEl);
    container.appendChild(label);
    gaugeArea.appendChild(container);

    // Configure Gauge.js
    const opts = {
      angle: 0,
      lineWidth: 0.22,
      radiusScale: 1,
      pointer: {
        length: 0.6,
        strokeWidth: 0.04,
        color: '#ffffff'
      },
      limitMax: false,
      limitMin: false,
      colorStart: stage.color,
      colorStop: stage.color,
      strokeColor: '#222',
      highDpiSupport: true,
      generateGradient: true
    };
    const gauge = new Gauge(gaugeCanvas).setOptions(opts);

    // Nice max scaling so dials look good for small/large values
    const maxValue = niceMax(kpi.value);
    gauge.maxValue = maxValue;
    gauge.setMinValue(0);
    gauge.animationSpeed = 32; // higher is slower
    gauge.setTextField(valueEl);
    gauge.set(kpi.value);

    // Show formatted value with unit
    valueEl.textContent = `${kpi.value}${kpi.unit}`;
  });

  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');
}

function niceMax(v) {
  if (v <= 10) return 10;
  if (v <= 20) return 20;
  if (v <= 50) return 50;
  if (v <= 100) return 100;
  if (v <= 200) return 200;
  if (v <= 500) return 500;
  return Math.ceil(v / 100) * 100;
}

function closeModal() {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
}
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});