// JavaScript for toggling the members sidebar in the boardroom UI
// Requires: #toggleMembersBtn, .boardroom-members-sidebar

document.addEventListener('DOMContentLoaded', function () {
  var toggleBtn = document.getElementById('toggleMembersBtn');
  var sidebar = document.querySelector('.boardroom-members-sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', function () {
      sidebar.classList.toggle('hidden');
    });
  }
});
