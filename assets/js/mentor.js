
import { authHeader } from './utils.js';
import { getApiPath } from './apiRoutes.js';

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
  const { path, method } = getApiPath('getAgents');
  const res = await fetch(path, { method, headers: authHeader() });
    const data = await res.json();
    data.forEach(a => {
      const o = new Option(a.domain, a.domain);
      this.domainSelect.add(o);
    });
  }

  async testQuestion() {
    const domain = this.domainSelect.value;
    const q = this.questionInp.value;
    const { path, method } = getApiPath('testMentorQuestion');
    const res = await fetch(path, {
      method,
      headers: { 'Content-Type':'application/json', ...authHeader() },
      body: JSON.stringify({ domain, question: q })
    });
    const body = await res.json();
    this.answerP.textContent = body.answer;
  }

  async loadQaPairs() {
    const domain = this.domainSelect.value;
  const { path, method } = getApiPath('getMentorQaPairs');
  const url = domain ? `${path}?domain=${encodeURIComponent(domain)}` : path;
  const res = await fetch(url, { method, headers: authHeader() });
    const list = await res.json();
    this.qaList.innerHTML = list.map(p => `<li><b>Q:</b>${p.question}<br/><b>A:</b>${p.answer}</li>`).join('');
  }

  async fineTune() {
    const domain = this.domainSelect.value;
    const { path, method } = getApiPath('triggerMentorFineTune');
    await fetch(path, {
      method,
      headers: { 'Content-Type':'application/json', ...authHeader() },
      body: JSON.stringify({ domain })
    });
    alert('Pipeline triggered');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MentorUI();
});