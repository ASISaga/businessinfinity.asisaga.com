class SidebarToggle {
  constructor(toggleBtnId, sidebarContainerId, sidebarToggleIconId) {
    this.toggleBtn = document.getElementById(toggleBtnId);
    this.sidebarContainer = document.getElementById(sidebarContainerId);
    this.sidebarToggleIcon = document.getElementById(sidebarToggleIconId);
    this.init();
  }

  init() {
    if (this.toggleBtn && this.sidebarContainer) {
      this.toggleBtn.addEventListener('click', () => {
        this.sidebarContainer.classList.toggle('collapsed');
        if (this.sidebarToggleIcon) {
          const isCollapsed = this.sidebarContainer.classList.contains('collapsed');
          this.sidebarToggleIcon.src = isCollapsed
            ? 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/chevron-double-right.svg'
            : 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/chevron-double-left.svg';
          this.sidebarToggleIcon.alt = isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar';
        }
      });
    }
  }
}

export default SidebarToggle;
