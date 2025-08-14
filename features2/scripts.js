// Enrollment-focused interactivity: theme, reveal, possibility composer, network math
(function(){
  const root = document.documentElement;

  // Theme persistence
  const themeToggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('bi-theme') || 'light';
  root.setAttribute('data-theme', saved);
  if (themeToggle) {
    themeToggle.textContent = saved === 'dark' ? 'Light mode' : 'Dark mode';
    themeToggle.setAttribute('aria-pressed', String(saved === 'dark'));
    themeToggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('bi-theme', next);
      themeToggle.textContent = next === 'dark' ? 'Light mode' : 'Dark mode';
      themeToggle.setAttribute('aria-pressed', String(next === 'dark'));
    });
  }

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal, .section .card');
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

  // Smooth scroll anchors
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const el = document.querySelector(id);
        if (el) { e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); }
      }
    });
  });

  // Possibility Composer
  const seatChips = document.querySelectorAll('.composer .chip[data-seat]');
  const outcomeChips = document.querySelectorAll('.composer .chip[data-outcome]');
  const orgInput = document.getElementById('orgName');
  const poss = document.getElementById('possibility');
  const copyBtn = document.getElementById('copyPossibility');
  const tokens = {
    org: poss.querySelector('[data-token="org"]'),
    outcomes: poss.querySelector('[data-token="outcomes"]')
  };
  const state = { seat: 'CEO', outcomes: [] };

  const seatVoice = {
    CEO: ['system-level trade-offs', 'portfolio clarity', 'orchestration cadence'],
    CFO: ['variance control', 'capital efficiency', 'policy assurance'],
    COO: ['cycle-time compression', 'throughput stability', 'resilience under volatility'],
    CRO: ['NRR lift', 'pipeline quality', 'pricing experiments with guardrails'],
    CPO: ['strategic sourcing', 'supplier risk visibility', 'TCO optimization'],
    CHRO: ['hiring that sticks', 'skill-to-workload alignment', 'velocity without burnout']
  };

  function updatePossibility(){
    const org = orgInput.value.trim() || 'your organization';
    tokens.org.textContent = org;
    const outcomesText = state.outcomes.length
      ? state.outcomes.slice(0,4).join(', ').replace(/, ([^,]*)$/, ' and $1')
      : 'elevate its most vital outcomes';
    tokens.outcomes.textContent = outcomesText;

    // Gentle highlight effect
    poss.classList.remove('flash');
    void poss.offsetWidth; // reflow
    poss.classList.add('flash');
  }

  seatChips.forEach(ch=>{
    ch.addEventListener('click', ()=>{
      seatChips.forEach(c=>c.classList.remove('selected'));
      ch.classList.add('selected');
      state.seat = ch.getAttribute('data-seat') || 'CEO';
      updatePossibility();

      // Micro-proof tailoring
      const proof = document.getElementById('microProof');
      const v = seatVoice[state.seat] || [];
      if (proof) {
        proof.innerHTML = [
          `<li><strong>Seat focus:</strong> ${v[0] || 'high-value trade-offs'}</li>`,
          `<li><strong>Cadence:</strong> ${v[1] || 'continuous deliberation, faster approvals'}</li>`,
          `<li><strong>Assurance:</strong> ${v[2] || 'guardrails + ledger for audit'}</li>`
        ].join('');
      }
    });
  });

  outcomeChips.forEach(ch=>{
    ch.addEventListener('click', ()=>{
      const val = ch.getAttribute('data-outcome');
      if (ch.classList.contains('active')) {
        ch.classList.remove('active');
        state.outcomes = state.outcomes.filter(x => x !== val);
      } else {
        if (state.outcomes.length >= 4) return; // keep punchy
        ch.classList.add('active');
        state.outcomes.push(val);
      }
      updatePossibility();
    });
  });

  orgInput.addEventListener('input', updatePossibility);

  copyBtn?.addEventListener('click', async ()=>{
    try {
      await navigator.clipboard.writeText(poss.innerText.trim());
      copyBtn.textContent = 'Copied';
      setTimeout(()=> copyBtn.textContent = 'Copy statement', 1200);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(poss);
      const sel = window.getSelection();
      sel.removeAllRanges(); sel.addRange(range);
      document.execCommand('copy');
      sel.removeAllRanges();
      copyBtn.textContent = 'Copied';
      setTimeout(()=> copyBtn.textContent = 'Copy statement', 1200);
    }
  });

  updatePossibility();

  // Network combinatorics
  const nodesSlider = document.getElementById('nodesSlider');
  const nodesCount = document.getElementById('nodesCount');
  const pairPaths = document.getElementById('pairPaths');
  const triadPaths = document.getElementById('triadPaths');

  function comb(n,k){
    if (k > n) return 0;
    if (k === 2) return Math.round(n*(n-1)/2);
    if (k === 3) return Math.round(n*(n-1)*(n-2)/6);
    return 0;
  }
  function fmt(n){ return n.toLocaleString(); }

  function updateNetwork(){
    const n = Number(nodesSlider.value);
    nodesCount.textContent = n;
    pairPaths.textContent = fmt(comb(n,2));
    triadPaths.textContent = fmt(comb(n,3));
  }
  nodesSlider?.addEventListener('input', updateNetwork);
  updateNetwork();
})();