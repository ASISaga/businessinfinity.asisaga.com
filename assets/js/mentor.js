import { API, authHeader } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const domainSelect = document.getElementById('mentor-domain');
  const questionInp = document.getElementById('mentor-question');
  const answerP = document.getElementById('mentor-answer');
  const testBtn = document.getElementById('mentor-test-btn');
  const qaList = document.getElementById('mentor-qa-list');
  const loadQaBtn = document.getElementById('mentor-load-btn');
  const fineTuneBtn = document.getElementById('mentor-finetune-btn');

  // Load domains
  fetch(`${API}/agents`, { headers: authHeader() })
    .then(r => r.json())
    .then(data => {
      data.forEach(a => {
        const o = new Option(a.domain, a.domain);
        domainSelect.add(o);
      });
    });

  testBtn.addEventListener('click', async () => {
    const domain = domainSelect.value;
    const q = questionInp.value;
    const res = await fetch(`${API}/mentor/test`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', ...authHeader() },
      body: JSON.stringify({ domain, question: q })
    });
    const body = await res.json();
    answerP.textContent = body.answer;
  });

  loadQaBtn.addEventListener('click', () => {
    const domain = domainSelect.value;
    fetch(`${API}/mentor/qapairs?domain=${domain}`, { headers: authHeader() })
      .then(r => r.json())
      .then(list => {
        qaList.innerHTML = list.map(p=><li><b>Q:</b>${p.question}<br/><b>A:</b>${p.answer}</li>).join('');
      });
  });

  fineTuneBtn.addEventListener('click', async () => {
    const domain = domainSelect.value;
    await fetch(`${API}/mentor/fine-tune`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', ...authHeader() },
      body: JSON.stringify({ domain })
    });
    alert('Pipeline triggered');
  });
});