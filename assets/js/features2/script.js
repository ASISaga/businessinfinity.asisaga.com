/* Small, defensive JS. Page works without JS. */

(function () {
  const doc = document;
  const root = doc.documentElement;

  // Current year in footer
  const yearEl = doc.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Mobile nav toggle
  const toggle = doc.querySelector(".nav-toggle");
  const nav = doc.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) {
        // Move focus to first link for accessibility
        const first = nav.querySelector("a");
        if (first) first.focus();
      } else {
        toggle.focus();
      }
    });

    // Close on ESC
    doc.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  // Reveal on scroll (respects reduced motion)
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealItems = Array.from(doc.querySelectorAll(".reveal"));

  if (prefersReduced || !("IntersectionObserver" in window)) {
    // No animation; just show
    revealItems.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((el) => observer.observe(el));
})();
```[43dcd9a7-70db-4a1f-b0ae-981daa162054](https://github.com/surajpaul/testGlamyo/tree/f2a4b1204fbd789dccb3fbb4a648267620600ca8/resources%2Fviews%2Fauth%2Fregister.blade.php?citationMarker=43dcd9a7-70db-4a1f-b0ae-981daa162054 "1")[43dcd9a7-70db-4a1f-b0ae-981daa162054](https://github.com/digitalcrm/bigindia-backend/tree/e6fb2d79c882a955f0183dfb51ffb614fda7842e/resources%2Fviews%2Ffrontend.blade.php?citationMarker=43dcd9a7-70db-4a1f-b0ae-981daa162054 "2")[43dcd9a7-70db-4a1f-b0ae-981daa162054](https://github.com/citadelio/MyTwit/tree/184efa63751dd83b987aa5158b474fc91edd7203/client%2Fsrc%2Fcomponents%2FNavbar%2FNavbar.js?citationMarker=43dcd9a7-70db-4a1f-b0ae-981daa162054 "3")