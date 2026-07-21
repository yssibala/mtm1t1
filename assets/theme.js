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
    if (subtotal) subtotal.textContent = money(cart.total_price);
    if (!items) return;
    if (!cart.items.length) {
      items.innerHTML = '<p class="cart-drawer__empty">Your cart is empty.</p>';
      return;
    }
    var html = '';
    cart.items.forEach(function (it) {
      var img = it.image ? '<img src="' + it.image.replace(/(\.[a-z]+)(\?.*)?$/i, '_120x$1$2') + '" alt="" width="60">' : '';
      var variant = (it.variant_title && it.variant_title.indexOf('Default') === -1) ? '<div class="cart-line__variant">' + it.variant_title + '</div>' : '';
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
        '<div class="cart-line__price">' + money(it.final_line_price) + '</div>' +
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

  // Intercept product add-to-cart forms
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form.classList || !form.classList.contains('product-form')) return;
    e.preventDefault();
    var btn = form.querySelector('[data-add-btn]');
    if (btn) btn.disabled = true;
    fetch('/cart/add.js', { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) })
      .then(function (r) { return r.json(); })
      .then(function () { refresh(true); })
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
