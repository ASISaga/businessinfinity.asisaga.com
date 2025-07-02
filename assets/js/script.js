// Central script loader for Boardroom | Business Infinity
import './common.js';
import Boardroom from './boardroom/boardroom.js';

// Initialize the Boardroom application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  const app = new Boardroom();
  app.init();
});
