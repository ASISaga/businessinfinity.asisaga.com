// Theme and UI interactions (accessible, minimal, robust)
(function () {
  const docEl = document.documentElement;
  const storageKey = "bi-theme";
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
  const themeToggle = document.querySelector(".theme-toggle");
  const navToggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("primary-menu");
  const yearEl = document.getElementById("year");

  // Year in footer
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme init
  function setTheme(mode, persist = true) {
    docEl.setAttribute("data-theme", mode);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute("content", mode === "dark" ? "#0b0f14" : "#f9fafb");
    if (persist) try { localStorage.setItem(storageKey, mode); } catch {}
  }
  function getStoredTheme() {
    try { return localStorage.getItem(storageKey); } catch { return null; }
  }
  const stored = getStoredTheme();
  const initial = stored || (prefersDark.matches ? "dark" : "light");
  setTheme(initial, false);

  // Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = docEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
      setTheme(next);
    });
  }
  // Sync with OS changes
  if (prefersDark && prefersDark.addEventListener) {
    prefersDark.addEventListener("change", (e) => {
      const storedNow = getStoredTheme();
      if (!storedNow) setTheme(e.matches ? "dark" : "light", false);
    });
  }

  // Mobile nav
  if (navToggle && menu) {
    navToggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      if (open) {
        // Move focus to first link for accessibility
        const firstLink = menu.querySelector("a");
        firstLink && firstLink.focus();
      } else {
        navToggle.focus();
      }
    });
    // Close on outside click (mobile)
    document.addEventListener("click", (e) => {
      if (!menu.classList.contains("open")) return;
      const within = menu.contains(e.target) || navToggle.contains(e.target);
      if (!within) {
        menu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
    // Close on escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("open")) {
        menu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
  }

  // Reveal on scroll (respect reduced motion)
  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  } else {
    // Fall back to instant visibility
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }
})();