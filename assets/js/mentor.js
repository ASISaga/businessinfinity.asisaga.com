
import { API, authHeader } from './utils.js';

class MentorUI {
  constructor() {
    this.domainSelect = document.getElementById('mentor-domain');
    this.questionInp = document.getElementById('mentor-question');
    this.answerP = document.getElementById('mentor-answer');
    this.testBtn = document.getElementById('mentor-test-btn');
    this.qaList = document.getElementById('mentor-qa-list');
    this.loadQaBtn = document.getElementById('mentor-load-btn');
    this.fineTuneBtn = document.getElementById('mentor-finetune-btn');
    this.init();
  }

  async init() {
    await this.loadDomains();
    this.testBtn.addEventListener('click', () => this.testQuestion());
    this.loadQaBtn.addEventListener('click', () => this.loadQaPairs());
    this.fineTuneBtn.addEventListener('click', () => this.fineTune());
  }

  async loadDomains() {
    const res = await fetch(`${API}/agents`, { headers: authHeader() });
    const data = await res.json();
    data.forEach(a => {
      const o = new Option(a.domain, a.domain);
      this.domainSelect.add(o);
    });
  }

  async testQuestion() {
    const domain = this.domainSelect.value;
    const q = this.questionInp.value;
    const res = await fetch(`${API}/mentor/test`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', ...authHeader() },
      body: JSON.stringify({ domain, question: q })
    });
    const body = await res.json();
    this.answerP.textContent = body.answer;
  }

  async loadQaPairs() {
    const domain = this.domainSelect.value;
    const res = await fetch(`${API}/mentor/qapairs?domain=${domain}`, { headers: authHeader() });
    const list = await res.json();
    this.qaList.innerHTML = list.map(p => `<li><b>Q:</b>${p.question}<br/><b>A:</b>${p.answer}</li>`).join('');
  }

  async fineTune() {
    const domain = this.domainSelect.value;
    await fetch(`${API}/mentor/fine-tune`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', ...authHeader() },
      body: JSON.stringify({ domain })
    });
    alert('Pipeline triggered');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MentorUI();
});