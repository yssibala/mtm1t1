/**
 * MUSE 2.0 — shared cart system
 * Exposes window.MuseCart. Uses localStorage for persistence.
 * Dispatches 'muse-cart-change' on window after every mutation.
 */
window.MuseCart = (function () {
  var KEY = 'muse-cart-v1';

  var PRICES = {
    thalia: 24, clio: 24, ourania: 24,
    trio: 65, giftbox: 85, tasting: 45,
    thaliaTote: 28, clioTote: 28, ouraniaTote: 28, houseTote: 28,
    coasters: 32, glassware: 38, bartools: 55, napkins: 24,
    pins: 14, cards: 18,
  };

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  }

  function save(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
    window.dispatchEvent(new CustomEvent('muse-cart-change'));
  }

  function lineKey(id, variant) { return id + '|' + (variant || ''); }

  return {
    items:     function () { return load(); },
    count:     function () { return load().reduce(function (s, i) { return s + i.qty; }, 0); },
    subtotal:  function () { return load().reduce(function (s, i) { return s + (PRICES[i.id] || 0) * i.qty; }, 0); },
    priceFor:  function (id) { return PRICES[id] || 0; },
    format:    function (n) { return '$' + (Math.round(n * 100) / 100).toFixed(2); },

    add: function (item, qty) {
      var items = load();
      var k = lineKey(item.id, item.variant);
      var found = false;
      items.forEach(function (i) { if (lineKey(i.id, i.variant) === k) { i.qty += qty; found = true; } });
      if (!found) items.push({ id: item.id, name: item.name, variant: item.variant || '', img: item.img || '', accent: item.accent || '#EFA527', qty: qty });
      save(items);
    },

    changeQty: function (id, variant, delta) {
      var items = load().map(function (i) {
        if (lineKey(i.id, i.variant) === lineKey(id, variant)) i.qty = Math.max(0, i.qty + delta);
        return i;
      }).filter(function (i) { return i.qty > 0; });
      save(items);
    },

    removeLine: function (id, variant) {
      save(load().filter(function (i) { return lineKey(i.id, i.variant) !== lineKey(id, variant); }));
    },

    clear: function () { save([]); },
  };
})();
