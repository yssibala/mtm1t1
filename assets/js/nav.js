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
