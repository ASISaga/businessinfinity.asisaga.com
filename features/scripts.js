// User-perspective features page interactivity
(function(){
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const toc = document.getElementById('toc');
  const tocLinks = toc ? Array.from(toc.querySelectorAll('a')) : [];
  const sections = tocLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  // Theme persistence
  const savedTheme = localStorage.getItem('bi-theme') || 'light';
  root.setAttribute('data-theme', savedTheme);
  if (themeToggle) themeToggle.textContent = savedTheme === 'dark' ? 'Light mode' : 'Dark mode';
  themeToggle?.setAttribute('aria-pressed', String(savedTheme === 'dark'));
  themeToggle?.addEventListener('click', ()=>{
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('bi-theme', next);
    themeToggle.textContent = next === 'dark' ? 'Light mode' : 'Dark mode';
    themeToggle.setAttribute('aria-pressed', String(next === 'dark'));
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal, .section .card');
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries=>{
        entries.forEach(e=>{
          if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
        });
      },{rootMargin:'0px 0px -10% 0px', threshold:0.1})
    : null;
  reveals.forEach(el => io ? io.observe(el) : el.classList.add('visible'));

  // Scrollspy
  if ('IntersectionObserver' in window && sections.length){
    const spy = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        const id = entry.target.getAttribute('id');
        const link = toc.querySelector(`a[href="#${id}"]`);
        if (entry.isIntersecting) {
          tocLinks.forEach(l=>l.classList.remove('active'));
          link?.classList.add('active');
        }
      });
    },{rootMargin:'-30% 0% -60% 0%'});
    sections.forEach(sec=>spy.observe(sec));
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const id = a.getAttribute('href');
      if (id.length > 1){
        const el = document.querySelector(id);
        if (el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); }
      }
    });
  });

  // Persona + objectives → dynamic benefits
  const personaData = {
    ceo: [
      'System-level clarity under uncertainty',
      'Faster alignment without meetings',
      'Capital allocation tied to live constraints'
    ],
    cfo: [
      'Tighter forecast bands and variance control',
      'Working-capital relief without starving service',
      'Policy gates for finance, privacy, compliance'
    ],
    coo: [
      'Always-on replanning across plants and lanes',
      'Throughput and SLA stability under volatility',
      'Traceable execution from decision to order/ticket'
    ],
    cro: [
      'Pipeline quality and prioritization lift',
      'Pricing experiments with guardrails',
      'NRR up via churn-risk cohort focus'
    ],
    cpo: [
      'Strategic sourcing with clear trade-offs',
      'Supplier risk visibility and mitigation',
      'Total cost optimization, not just price'
    ],
    chro: [
      'Hiring that sticks to outcomes',
      'Skill-to-workload alignment',
      'Org load monitoring to avoid burnout'
    ]
  };
  const objectiveAdds = {
    arr: 'Revenue mix and price-volume plays coordinated with supply',
    nrr: 'Retention flows integrated with service reliability',
    cycle: 'Lead-time compression prioritized by value at stake',
    adherence: 'Plan adherence uplift through shared ledger and telemetry',
    wc: 'Inventory and DSO optimization with CFO/COO quorum',
    cost: 'Expedite and overtime waste reduction via smoother plans',
    forecast: 'Forecast accuracy through live constraint sensing',
    talent: 'Role clarity and capability mapping to mission-critical work'
  };

  const tabs = document.querySelectorAll('.persona .tab');
  const chips = document.querySelectorAll('.chip');
  const summaryTitle = document.getElementById('summaryTitle');
  const summaryList = document.getElementById('summaryList');
  const selected = { persona: 'ceo', objectives: new Set() };

  function renderSummary(){
    summaryTitle.textContent = `For the ${selected.persona.toUpperCase()}: what changes`.replace('CFO','CFO').replace('COO','COO');
    const base = personaData[selected.persona] || [];
    const extras = Array.from(selected.objectives).map(k => objectiveAdds[k]).filter(Boolean);
    const bullets = [...base, ...extras].slice(0, 6);
    summaryList.innerHTML = bullets.map(b => `<li>${b}</li>`).join('');
  }

  tabs.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      tabs.forEach(t=>t.classList.remove('active'));
      btn.classList.add('active');
      selected.persona = btn.getAttribute('data-persona');
      renderSummary();
    });
  });

  chips.forEach(ch=>{
    ch.addEventListener('click', ()=>{
      const key = ch.getAttribute('data-obj');
      if (selected.objectives.has(key)) { selected.objectives.delete(key); ch.classList.remove('active'); }
      else { selected.objectives.add(key); ch.classList.add('active'); }
      renderSummary();
    });
  });

  renderSummary();

  // Network combinatorics slider
  const nodesSlider = document.getElementById('nodesSlider');
  const nodesCount = document.getElementById('nodesCount');
  const pairPaths = document.getElementById('pairPaths');
  const triadPaths = document.getElementById('triadPaths');

  function comb(n, k){
    if (k > n) return 0;
    if (k === 2) return Math.round(n*(n-1)/2);
    if (k === 3) return Math.round(n*(n-1)*(n-2)/6);
    return 0;
  }
  function format(n){ return n.toLocaleString(); }

  function updateNetwork(){
    const n = Number(nodesSlider.value);
    nodesCount.textContent = n;
    pairPaths.textContent = format(comb(n,2));
    triadPaths.textContent = format(comb(n,3));
  }
  nodesSlider?.addEventListener('input', updateNetwork);
  updateNetwork();

})();