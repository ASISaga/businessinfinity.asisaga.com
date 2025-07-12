import { API, authHeader } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('profiles-container');
  fetch(`${API}/agents`, { headers: authHeader() })
    .then(r=>r.json())
    .then(arr => {
      container.innerHTML = arr.map(a=>`
        <article class="card p-3 text-center">
          <img src="${a.photo}" alt="${a.name}" class="mb-2"/>
          <h5>${a.name}</h5>
          <p>${a.profile}</p>
        </article>`).join('');
    });
});