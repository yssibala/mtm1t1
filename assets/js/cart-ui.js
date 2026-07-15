/**
 * MUSE cart UI — updates badges and dropdowns on every page.
 * Reads directly from localStorage so it works without MuseCart being
 * loaded first (useful on pages that don't have cart.js).
 * Listens to both 'muse-cart-change' (same tab) and 'storage' (other tabs).
 */
(function () {
  var KEY = 'muse-cart-v1';
  var PRICES = {
    thalia:24, clio:24, ourania:24,
    trio:65, giftbox:85, tasting:45,
    thaliaTote:28, clioTote:28, ouraniaTote:28, houseTote:28,
    coasters:32, glassware:38, bartools:55, napkins:24,
    pins:14, cards:18,
  };

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  }

  function fmt(n) { return '$' + (Math.round(n * 100) / 100).toFixed(2); }

  function renderBody(el) {
    var items = load();
    var sub = items.reduce(function (s, i) { return s + (PRICES[i.id] || 0) * i.qty; }, 0);
    if (!items.length) {
      el.innerHTML = '<p style="font-size:12px;color:#8A8378;text-align:center;margin:0 0 14px;">Your cart is empty.</p>';
      return;
    }
    var h = '<div style="max-height:200px;overflow-y:auto;margin-bottom:12px;">';
    items.forEach(function (i) {
      var p = PRICES[i.id] || 0;
      h += '<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid #F0E8D8;">';
      h += i.img
        ? '<img src="' + i.img + '" style="width:40px;height:40px;object-fit:cover;flex:none;border:1px solid #E7DAC4;">'
        : '<div style="width:40px;height:40px;background:#F4ECDD;flex:none;border:1px solid #E7DAC4;"></div>';
      h += '<div style="flex:1;min-width:0;">';
      h += '<div style="font-size:10px;letter-spacing:.12em;font-weight:600;color:#0A0B0C;">' + i.name + '</div>';
      if (i.variant) h += '<div style="font-size:9px;color:#8A8378;">' + i.variant + '</div>';
      h += '</div><div style="font-size:10px;font-weight:600;color:#0A0B0C;flex:none;">' + fmt(p * i.qty) + '</div>';
      h += '</div>';
    });
    h += '</div>';
    h += '<div style="display:flex;justify-content:space-between;font-size:10px;letter-spacing:.12em;font-weight:600;color:#0A0B0C;padding-bottom:12px;">';
    h += '<span>SUBTOTAL</span><span>' + fmt(sub) + '</span></div>';
    el.innerHTML = h;
  }

  function updateAll() {
    var count = load().reduce(function (s, i) { return s + i.qty; }, 0);
    // Update every badge — handles class="cart-badge" and id="cart-badge*"
    document.querySelectorAll('.cart-badge, [id^="cart-badge"]').forEach(function (el) {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
    // Render line items inside every cart dropdown body
    document.querySelectorAll('[data-cart-body]').forEach(function (el) {
      renderBody(el);
    });
  }

  function init() {
    updateAll();
    window.addEventListener('muse-cart-change', updateAll);
    // Cross-page sync: when another tab modifies the cart, update this page
    window.addEventListener('storage', function (e) {
      if (e.key === KEY) updateAll();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
