// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const reveal = () => {
  const t = window.innerHeight * 0.85;
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < t) el.classList.add('visible');
  });
};
window.addEventListener('scroll', reveal);
window.addEventListener('load', reveal);

// Count-ups in hero
function countUp(el){
  const target = +el.getAttribute('data-count') || 0;
  let cur = 0;
  const inc = Math.max(1, Math.floor(target / 60));
  const tick = () => {
    cur += inc;
    if (cur >= target){ el.textContent = target; return; }
    el.textContent = cur;
    requestAnimationFrame(tick);
  };
  tick();
}
document.querySelectorAll('.hero-metrics .big[data-count]').forEach(countUp);

// ROI calculator
const fmt = v => v.toLocaleString(undefined,{style:'currency', currency:'USD', maximumFractionDigits:0});
function calcROI(){
  const rev = +document.getElementById('rev').value || 0;
  const gm = (+document.getElementById('gm').value || 0)/100;
  const latency = (+document.getElementById('latency').value || 0)/100;
  const adherence = (+document.getElementById('adherence').value || 0)/100;
  const wc = (+document.getElementById('wc').value || 0)/100;

  const tpLiftPct = Math.min(0.8, latency + 0.5*adherence);
  const throughputLift = rev * tpLiftPct;
  const grossProfitImpact = throughputLift * gm;
  const workingCapitalFreed = rev * 0.2 * wc;

  document.getElementById('throughput').textContent = fmt(throughputLift);
  document.getElementById('profit').textContent = fmt(grossProfitImpact);
  document.getElementById('working').textContent = fmt(workingCapitalFreed);
}
document.getElementById('calcBtn').addEventListener('click', calcROI);
document.getElementById('roiForm').addEventListener('keydown', (e)=>{
  if(e.key === 'Enter'){ e.preventDefault(); calcROI(); }
});