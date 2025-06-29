// Central script loader for Boardroom | Business Infinity
import 'https://kit.fontawesome.com/a076d05399.js';
import 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js';
import './boardroom/boardroom.js';

document.addEventListener('DOMContentLoaded', function () {
  const app = new Boardroom();
  app.init();
});
