// Timestamp injection
(function () {
  console.log("Business Infinity Canvas loaded.");
})();

// Toggle sample content on/off
function toggleSample() {
  const fields = document.querySelectorAll('[data-field]');
  const hasContent = Array.from(fields).some(f => f.querySelector('li'));
  if (hasContent) {
    fields.forEach(f => f.setAttribute('data-cache', f.innerHTML));
    fields.forEach(f => f.innerHTML = '<li style="color:#9aa3ad">Add items here…</li>');
  } else {
    fields.forEach(f => f.innerHTML = f.getAttribute('data-cache') || '');
  }
}