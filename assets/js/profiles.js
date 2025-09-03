import { authHeader } from './utils.js';
import { getApiPath } from './apiRoutes.js';

class ProfilesUI {
  constructor() {
    this.container = document.getElementById('profiles-container');
    this.loadProfiles();
  }

  async loadProfiles() {
  const { path, method } = getApiPath('getAgents');
  const res = await fetch(path, { method, headers: authHeader() });
    const arr = await res.json();
    this.container.innerHTML = arr.map(a => `
      <article class="card p-3 text-center">
        <img src="${a.photo}" alt="${a.name}" class="mb-2"/>
        <h5>${a.name}</h5>
        <p>${a.profile}</p>
      </article>`).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ProfilesUI();
});