/* ===== CSS variables ===== */
:root {
  --bg: #f9fafb;
  --panel: #ffffff;
  --ink: #111827;
  --ink-2: #1f2937;
  --muted: #6b7280;
  --line: #e5e7eb;
  --brand: #ea580c;
  --brand-2: #f97316;
  --accent: #0ea5e9;

  --radius: 10px;
  --radius-sm: 8px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05), 0 4px 6px rgba(0,0,0,0.07);
  --shadow-md: 0 6px 18px rgba(0,0,0,0.08);
  --grid: 8px;

  --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Inter, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji";
}

/* Dark theme */
:root[data-theme="dark"] {
  --bg: #0b0f14;
  --panel: #11161d;
  --ink: #e5e7eb;
  --ink-2: #f3f4f6;
  --muted: #9aa3ae;
  --line: #202834;
  --brand: #f97316;
  --brand-2: #fb923c;
  --accent: #38bdf8;
}

/* ===== Base ===== */
* { box-sizing: border-box; }
html, body { height: 100%; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--ink-2);
  font-family: var(--font-sans);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

img, svg { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
a:hover { text-decoration: underline; text-decoration-thickness: 2px; }
small, .small { font-size: 0.875rem; color: var(--muted); }

.container {
  max-width: 1180px;
  padding: calc(var(--grid)*6) calc(var(--grid)*3);
  margin: 0 auto;
}

/* Typography */
.h1 { font-size: clamp(2rem, 2.2rem + 2vw, 3.25rem); letter-spacing: -0.015em; line-height: 1.15; margin: 0 0 0.75rem; color: var(--ink); }
.h2 { font-size: clamp(1.5rem, 1.2rem + 1.2vw, 2.25rem); letter-spacing: -0.01em; margin: 0 0 0.5rem; color: var(--ink); }
.h3 { font-size: clamp(1.25rem, 1rem + 0.6vw, 1.6rem); margin: 0 0 0.25rem; color: var(--ink); }
.h4 { font-size: 1.25rem; margin: 0; color: var(--ink); }
.h5 { font-size: 1.125rem; margin: 0; color: var(--ink); }

.lede { font-size: clamp(1.05rem, 0.95rem + 0.4vw, 1.25rem); color: var(--muted); max-width: 60ch; }
.muted { color: var(--muted); }

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: calc(var(--grid)*1);
  padding: calc(var(--grid)*1.5) calc(var(--grid)*2.5);
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease, background-color .15s ease;
  text-decoration: none;
  will-change: transform;
}
.btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.btn-primary {
  background: linear-gradient(180deg, var(--brand), var(--brand-2));
  color: #fff;
  box-shadow: var(--shadow-sm);
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: var(--shadow-md); text-decoration: none; }
.btn-primary:active { transform: translateY(0); }

.btn-ghost {
  background: transparent;
  border-color: var(--line);
  color: var(--ink);
}
.btn-ghost:hover { border-color: var(--brand); color: var(--ink); text-decoration: none; }

/* Header */
.site-header {
  position: sticky;
  top: 0; z-index: 50;
  backdrop-filter: blur(8px);
  background: color-mix(in oklab, var(--bg) 92%, transparent);
  border-bottom: 1px solid var(--line);
}
.header-inner {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: calc(var(--grid)*2);
  align-items: center;
  padding-top: calc(var(--grid)*2);
  padding-bottom: calc(var(--grid)*2);
}
.brand { display: inline-flex; align-items: baseline; gap: calc(var(--grid)*1); font-weight: 700; letter-spacing: -0.01em; }
.brand-mark { color: var(--brand); font-size: 1.4rem; line-height: 1; }
.brand-name { color: var(--ink); font-size: 1.05rem; }

.site-nav { display: grid; grid-auto-flow: column; gap: calc(var(--grid)*2); align-items: center; }
.menu { display: grid; grid-auto-flow: column; gap: calc(var(--grid)*2); list-style: none; padding: 0; margin: 0; }
.menu a { color: var(--muted); padding: calc(var(--grid)*1) calc(var(--grid)*1.5); border-radius: 6px; }
.menu a[aria-current="page"] { color: var(--ink); font-weight: 600; }
.menu a:hover { color: var(--ink); background: color-mix(in oklab, var(--brand) 6%, transparent); text-decoration: none; }

/* Nav toggles */
.nav-toggle { display: none; align-items: center; gap: 8px; background: transparent; border: 1px solid var(--line); color: var(--ink); padding: 8px 10px; border-radius: 8px; }
.nav-toggle-box { width: 18px; height: 2px; background: currentColor; box-shadow: 0 6px 0 currentColor, 0 -6px 0 currentColor; }
.nav-toggle:focus-visible, .theme-toggle:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.theme-toggle { background: transparent; border: 1px solid var(--line); color: var(--ink); padding: 8px; border-radius: 8px; }

/* Sections */
.section { padding: calc(var(--grid)*10) 0; }

/* Hero */
.grid-2 { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: calc(var(--grid)*6); align-items: center; }
.hero .cta-row { display: flex; gap: calc(var(--grid)*2); margin-top: calc(var(--grid)*3); }
.hero-art .canvas {
  position: relative; height: 360px; background:
    linear-gradient(180deg, color-mix(in oklab, var(--panel) 86%, var(--bg) 14%), var(--panel));
  border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow-sm);
  overflow: hidden;
}
.hero-art .links { position: absolute; inset: 0; stroke: color-mix(in oklab, var(--brand) 35%, var(--ink) 65%); stroke-width: 1.5; fill: none; opacity: 0.35; }
.hero-art .node {
  position: absolute; width: 12px; height: 12px; border-radius: 999px; background: var(--brand); box-shadow: 0 0 0 6px color-mix(in oklab, var(--brand) 20%, transparent);
}
.node.n1 { left: 48px; bottom: 42px; }
.node.n2 { left: 96px; top: 96px; }
.node.n3 { left: 210px; top: 60px; }
.node.n4 { right: 36px; bottom: 50px; }
.node.n5 { left: 260px; top: 130px; }

/* Value band */
.value-band { background: linear-gradient(180deg, color-mix(in oklab, var(--bg) 92%, transparent), transparent); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.value-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: calc(var(--grid)*3); }
.value-item { background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius); padding: calc(var(--grid)*3); box-shadow: var(--shadow-sm); }
.value-item .icon { font-size: 1.25rem; color: var(--brand); margin-bottom: calc(var(--grid)*1.5); }

/* Features */
.section-header { text-align: center; margin-bottom: calc(var(--grid)*5); }
.feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--grid)*3); }
.feature-card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  padding: calc(var(--grid)*3);
  transition: transform .2s ease-out, box-shadow .2s ease-out, border-color .2s ease-out, background-color .2s ease-out;
}
.feature-card:hover { transform: translateY(-3px); border-color: var(--brand); box-shadow: var(--shadow-md); }
.fc-head { display: flex; align-items: center; gap: calc(var(--grid)*1.5); margin-bottom: calc(var(--grid)*1.5); }
.fc-icon { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 10px; background: color-mix(in oklab, var(--brand) 12%, transparent); color: var(--brand); }

/* Bullets */
.bullets { margin: calc(var(--grid)*2) 0 0; padding: 0 0 0 calc(var(--grid)*2.5); }
.bullets li { margin: 0 0 calc(var(--grid)*1.25); }

/* How it works */
.how-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--grid)*3); }
.how-step { background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius); padding: calc(var(--grid)*3); box-shadow: var(--shadow-sm); }
.step-num { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; color: var(--brand); font-weight: 700; margin-bottom: calc(var(--grid)*1); }

/* Quote */
.quote-card { margin: 0; background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius); padding: calc(var(--grid)*4); box-shadow: var(--shadow-sm); }
.quote-card blockquote { margin: 0 0 calc(var(--grid)*2); font-size: 1.25rem; color: var(--ink); }
.quote-card figcaption { color: var(--muted); }

/* CTA */
.cta { border-top: 1px solid var(--line); }
.cta-inner { display: grid; grid-template-columns: 1fr auto; gap: calc(var(--grid)*3); align-items: center; background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow-sm); padding: calc(var(--grid)*4); }

/* Footer */
.site-footer { border-top: 1px solid var(--line); }
.footer-inner { display: grid; grid-template-columns: 1fr auto 1fr; gap: calc(var(--grid)*2); align-items: center; }
.footer-brand { display: inline-flex; align-items: baseline; gap: 8px; font-weight: 700; color: var(--ink); }
.footer-menu { list-style: none; display: flex; gap: calc(var(--grid)*2); padding: 0; margin: 0; justify-content: center; }
.footer-inner p { justify-self: end; }

/* Reveal animations (respect reduced motion) */
.reveal { opacity: 0; transform: translateY(12px); transition: opacity .5s ease-out, transform .5s ease-out; }
.reveal.is-visible { opacity: 1; transform: translateY(0); }

@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
  .btn { transition: none !important; }
}

/* Accessibility focus */
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

/* Skip link */
.skip-link {
  position: absolute; left: -999px; top: -999px;
  background: var(--ink); color: #fff; padding: 8px 12px; border-radius: 6px;
}
.skip-link:focus { left: 12px; top: 12px; z-index: 999; }

/* Responsive */
@media (max-width: 1024px) {
  .grid-2 { grid-template-columns: 1fr; }
  .feature-grid { grid-template-columns: repeat(2, 1fr); }
  .value-grid { grid-template-columns: repeat(2, 1fr); }
  .footer-inner { grid-template-columns: 1fr; text-align: center; gap: 8px; }
  .footer-inner p { justify-self: center; }
}

@media (max-width: 720px) {
  .container { padding-left: calc(var(--grid)*2); padding-right: calc(var(--grid)*2); }
  .section { padding: calc(var(--grid)*8) 0; }
  .feature-grid, .how-grid, .value-grid { grid-template-columns: 1fr; }
  .site-nav { grid-auto-flow: row; justify-items: end; }
  .nav-toggle { display: inline-flex; }
  .menu {
    position: absolute; top: 64px; right: 16px; min-width: 220px;
    background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius);
    box-shadow: var(--shadow-md); padding: 8px; display: none;
  }
  .menu.open { display: grid; grid-auto-flow: row; gap: 4px; }
  .theme-toggle { justify-self: end; }
}