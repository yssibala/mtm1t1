/**
 * MUSE 2.0 — shared nav scroll behaviour
 *
 * Per-page customisation (no JS config needed — use HTML/CSS):
 *   • Transition point  — controlled by WHERE you place <div data-nav-sentinel> in the page HTML.
 *                         Place it at the exact scroll position you want the nav to switch states.
 *   • Transition offset — add data-nav-threshold="-40" on the sentinel element to shift the
 *                         trigger point by N pixels (negative = triggers earlier / above element).
 *   • Scrolled-state bg — override the CSS custom property in a page <style> block:
 *                         :root { --nav-scrolled-bg: rgba(251,246,238,0.85); }
 *                         Default is rgba(251,246,238,0.92) (set in nav CSS).
 */
(function () {
  var nav      = document.getElementById('site-nav');
  var sentinel = document.querySelector('[data-nav-sentinel]');
  if (!nav) return;

  var threshold = sentinel ? parseInt(sentinel.getAttribute('data-nav-threshold') || '0', 10) : 0;

  function setScrolled(sc) {
    sc ? nav.classList.add('nav--scrolled') : nav.classList.remove('nav--scrolled');
  }

  function compute() {
    if (!sentinel) return;
    setScrolled(sentinel.getBoundingClientRect().top <= threshold);
  }

  if (sentinel && 'IntersectionObserver' in window) {
    var opts = { threshold: 0 };
    if (threshold !== 0) opts.rootMargin = threshold + 'px 0px 0px 0px';
    new IntersectionObserver(function (e) { setScrolled(!e[0].isIntersecting); }, opts).observe(sentinel);
  }

  window.addEventListener('scroll', compute, { passive: true });
  compute();
})();
