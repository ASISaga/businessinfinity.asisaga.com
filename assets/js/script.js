// Central script loader for Boardroom | Business Infinity
import './common.js';
import './boardroom/boardroom.js';

document.addEventListener('DOMContentLoaded', function () {
  const app = new Boardroom();
  app.init();
});
