// MUSE visibility system — three states for any element:
//   data-muse-state="inactive"     → hidden normally; visible in ?monocle mode (greyscale + INACTIVE label)
//   data-muse-state="coming-soon"  → greyed overlay + COMING SOON pill; links redirect to coming-soon.html
//   data-muse-state="active"       → normal (default, no attribute needed)
//
// Preview mode: append ?monocle to any URL to reveal inactive elements with a grey overlay
// e.g.  https://mt-muse.com/about.html?monocle
(function () {
  var monocle = location.search.indexOf('monocle') !== -1;

  // Inject baseline CSS
  var s = document.createElement('style');
  s.textContent = [
    monocle ? '' : '[data-muse-state="inactive"]{display:none!important;}',
  ].join('');
  document.head.appendChild(s);

  // ── INACTIVE elements ─────────────────────────────────────────────────────
  document.querySelectorAll('[data-muse-state="inactive"]').forEach(function (el) {
    if (!monocle) return; // CSS already hides; no JS needed in normal mode

    // Monocle mode: show greyed out with INACTIVE label
    var pos = window.getComputedStyle(el).position;
    if (pos === 'static') el.style.position = 'relative';
    el.style.filter = 'grayscale(1) opacity(.45)';
    el.style.pointerEvents = 'none';
    el.style.userSelect = 'none';

    var ov = document.createElement('div');
    ov.setAttribute('aria-hidden', 'true');
    ov.style.cssText = [
      'position:absolute;inset:0;z-index:20;',
      'display:flex;align-items:center;justify-content:center;',
    ].join('');
    var pill = document.createElement('div');
    pill.textContent = 'INACTIVE';
    pill.style.cssText = [
      'font-size:9px;letter-spacing:.18em;font-weight:600;',
      'color:#6B6156;border:1px solid #B0A892;border-radius:30px;',
      'padding:5px 14px;background:rgba(253,252,250,.88);white-space:nowrap;',
    ].join('');
    ov.appendChild(pill);
    el.appendChild(ov);
  });

  // ── COMING SOON sections / cards (non-link elements) ──────────────────────
  document.querySelectorAll('[data-muse-state="coming-soon"]:not(a):not(button)').forEach(function (el) {
    var pos = window.getComputedStyle(el).position;
    if (pos === 'static') el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.style.userSelect = 'none';

    var ov = document.createElement('div');
    ov.setAttribute('aria-hidden', 'true');
    ov.style.cssText = [
      'position:absolute;inset:0;z-index:20;',
      'background:rgba(251,246,238,.68);',
      'backdrop-filter:grayscale(.85) brightness(1.04);',
      '-webkit-backdrop-filter:grayscale(.85) brightness(1.04);',
      'display:flex;align-items:center;justify-content:center;',
    ].join('');
    var pill = document.createElement('div');
    pill.textContent = 'COMING SOON';
    pill.style.cssText = [
      'font-size:9px;letter-spacing:.18em;font-weight:600;',
      'color:#C9851A;border:1px solid #E7C98A;border-radius:30px;',
      'padding:6px 16px;background:rgba(253,252,250,.92);white-space:nowrap;',
    ].join('');
    ov.appendChild(pill);
    el.appendChild(ov);
  });

  // ── COMING SOON clickable elements (links, buttons) ───────────────────────
  document.querySelectorAll('a[data-muse-state="coming-soon"],button[data-muse-state="coming-soon"]').forEach(function (el) {
    el.style.cursor = 'pointer';
    el.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = 'coming-soon.html';
    });
  });
})();
