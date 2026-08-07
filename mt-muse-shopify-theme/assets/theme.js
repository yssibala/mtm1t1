/* MT-MUSE theme — AJAX cart drawer + add-to-cart */
(function () {
  var drawer = document.getElementById('cart-drawer');
  var currency = (drawer && drawer.getAttribute('data-currency')) || 'USD';

  function money(cents) {
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency }).format((cents || 0) / 100);
    } catch (e) {
      return '$' + ((cents || 0) / 100).toFixed(2);
    }
  }

  function updateBadges(count) {
    var badges = document.querySelectorAll('[data-cart-count]');
    for (var i = 0; i < badges.length; i++) {
      badges[i].textContent = count;
      badges[i].style.display = count > 0 ? 'flex' : 'none';
    }
  }

  function renderCart(cart) {
    updateBadges(cart.item_count);
    if (!drawer) return;
    var items = drawer.querySelector('[data-cart-items]');
    var subtotal = drawer.querySelector('[data-cart-subtotal]');
    var discEl = drawer.querySelector('[data-cart-discount]');
    if (subtotal) subtotal.textContent = money(cart.total_price);
    if (discEl) {
      if (cart.total_discount > 0) {
        discEl.hidden = false;
        discEl.textContent = (drawer.getAttribute('data-savings-label') || 'You save') + ' ' + money(cart.total_discount);
      } else { discEl.hidden = true; discEl.textContent = ''; }
    }
    if (!items) return;
    if (!cart.items.length) {
      items.innerHTML = '<p class="cart-drawer__empty">Your cart is empty.</p>';
      return;
    }
    var html = '';
    cart.items.forEach(function (it) {
      var img = it.image ? '<img src="' + it.image.replace(/(\.[a-z]+)(\?.*)?$/i, '_120x$1$2') + '" alt="" width="60">' : '';
      var variant = (it.variant_title && it.variant_title.indexOf('Default') === -1) ? '<div class="cart-line__variant">' + it.variant_title + '</div>' : '';
      var priceHtml = (it.original_line_price > it.final_line_price)
        ? '<s class="cart-line__was">' + money(it.original_line_price) + '</s> ' + money(it.final_line_price)
        : money(it.final_line_price);
      var discHtml = '';
      (it.line_level_discount_allocations || []).forEach(function (a) {
        var t = (a.discount_application && a.discount_application.title) ? a.discount_application.title : 'Discount';
        discHtml += '<div class="cart-line__disc">' + t + ' (&minus;' + money(a.amount) + ')</div>';
      });
      html += '<div class="cart-line" data-key="' + it.key + '">' +
        '<div class="cart-line__media">' + img + '</div>' +
        '<div class="cart-line__info">' +
          '<a href="' + it.url + '" class="cart-line__title">' + it.product_title + '</a>' + variant +
          '<div class="cart-line__qty">' +
            '<button type="button" data-line-down aria-label="Decrease">&minus;</button>' +
            '<span>' + it.quantity + '</span>' +
            '<button type="button" data-line-up aria-label="Increase">+</button>' +
            '<button type="button" class="cart-line__remove" data-line-remove aria-label="Remove">Remove</button>' +
          '</div>' +
        '</div>' +
        '<div class="cart-line__price">' + priceHtml + discHtml + '</div>' +
      '</div>';
    });
    items.innerHTML = html;
  }

  function fetchCart() {
    return fetch('/cart.js', { headers: { 'Accept': 'application/json' } }).then(function (r) { return r.json(); });
  }

  function openDrawer() { if (drawer) { drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; } }
  function closeDrawer() { if (drawer) { drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; } }

  function refresh(open) {
    fetchCart().then(function (cart) { renderCart(cart); if (open) openDrawer(); });
  }

  function changeLine(key, qty) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ id: key, quantity: qty })
    }).then(function (r) { return r.json(); }).then(renderCart);
  }

  function showFormError(form, msg) {
    var el = form.querySelector('[data-form-error]');
    if (!el) { el = document.createElement('p'); el.setAttribute('data-form-error', ''); el.className = 'product-form__error'; form.appendChild(el); }
    el.textContent = msg; el.hidden = false;
  }
  function clearFormError(form) {
    var el = form.querySelector('[data-form-error]'); if (el) { el.hidden = true; el.textContent = ''; }
  }

  // Intercept product add-to-cart forms
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form.classList || !form.classList.contains('product-form')) return;
    e.preventDefault();
    var btn = form.querySelector('[data-add-btn]');
    if (btn) btn.disabled = true;
    clearFormError(form);
    fetch('/cart/add.js', { method: 'POST', headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, body: new FormData(form) })
      .then(function (r) { return r.json().then(function (data) { return { ok: r.ok, data: data }; }); })
      .then(function (res) {
        if (!res.ok) { showFormError(form, (res.data && (res.data.description || res.data.message)) || 'Sorry — this item could not be added.'); return; }
        refresh(true);
      })
      .catch(function () { form.submit(); })
      .finally(function () { if (btn) btn.disabled = false; });
  });

  // Open drawer from any cart link/button; handle close + line changes
  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-cart-open]');
    if (opener) { e.preventDefault(); refresh(true); return; }
    if (e.target.closest('[data-cart-close]')) { closeDrawer(); return; }
    var line = e.target.closest('.cart-line');
    if (line) {
      var key = line.getAttribute('data-key');
      var qtyEl = line.querySelector('.cart-line__qty span');
      var q = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;
      if (e.target.closest('[data-line-up]')) changeLine(key, q + 1);
      else if (e.target.closest('[data-line-down]')) changeLine(key, Math.max(0, q - 1));
      else if (e.target.closest('[data-line-remove]')) changeLine(key, 0);
    }
  });

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });

  // Nav dropdowns: caret click toggles the submenu (hover still opens on desktop)
  function closeDropdowns(except) {
    var open = document.querySelectorAll('.muse-dropdown.is-open');
    for (var i = 0; i < open.length; i++) {
      if (open[i] === except) continue;
      open[i].classList.remove('is-open');
      var c = open[i].querySelector('.muse-caret');
      if (c) c.setAttribute('aria-expanded', 'false');
    }
  }
  document.addEventListener('click', function (e) {
    var caret = e.target.closest('.muse-caret');
    if (caret) {
      e.preventDefault();
      var dd = caret.closest('.muse-dropdown');
      if (!dd) return;
      var isOpen = dd.classList.toggle('is-open');
      caret.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      closeDropdowns(dd);
      return;
    }
    if (!e.target.closest('.muse-dropdown')) closeDropdowns(null);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDropdowns(null); });

  // Mobile menu: caret collapses/expands each submenu group
  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('[data-mob-toggle]');
    if (!toggle) return;
    var group = toggle.closest('.mob-group');
    if (!group) return;
    var open = group.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Product gallery: thumbnail -> main image
  document.addEventListener('click', function (e) {
    var thumb = e.target.closest('.pg-thumb');
    if (!thumb) return;
    var main = document.getElementById(thumb.getAttribute('data-pg-target'));
    if (main) main.src = thumb.getAttribute('data-pg-src');
    var siblings = thumb.parentNode.querySelectorAll('.pg-thumb');
    for (var i = 0; i < siblings.length; i++) siblings[i].classList.remove('is-active');
    thumb.classList.add('is-active');
  });
})();
