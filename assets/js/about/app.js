// Theme toggle
const themeBtn = document.getElementById('themeBtn');
const root = document.body;

function setTheme(next) {
  root.setAttribute('data-theme', next);
  localStorage.setItem('bi-theme', next);
  themeBtn.textContent = next === 'dark' ? 'Light mode' : 'Dark mode';
}

// Init theme
setTheme(localStorage.getItem('bi-theme') || 'dark');

// Toggle on button click
themeBtn.addEventListener('click', () => {
  setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// Print button handler
const printBtn = document.getElementById('printBtn');
if (printBtn) {
  printBtn.addEventListener('click', () => {
    window.print();
  });
}

console.log('%cBusiness Infinity', 'color:#00e0ff; font-weight:700;', 'Persistent AI boardroom loaded.');