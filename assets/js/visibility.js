// MUSE visibility system — three states for any element:
//   data-muse-state="inactive"     → hidden, never rendered
//   data-muse-state="coming-soon"  → greyed overlay + COMING SOON pill; links redirect to coming-soon.html
//   data-muse-state="active"       → normal (default, no change needed)
(function () {
  // Inject baseline CSS
  var s = document.createElement('style');
  s.textContent = '[data-muse-state="inactive"]{display:none!important;}';
  document.head.appendChild(s);

  // Section / card overlays
  document.querySelectorAll('[data-muse-state="coming-soon"]:not(a):not(button)').forEach(function (el) {
    if (!el.style.position || el.style.position === 'static') el.style.position = 'relative';
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

  // Clickable coming-soon elements (links, buttons, or anything else)
  document.querySelectorAll('[data-muse-state="coming-soon"]').forEach(function (el) {
    el.style.cursor = 'pointer';
    el.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = 'coming-soon.html';
    });
  });
})();
