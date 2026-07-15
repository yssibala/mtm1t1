/**
 * MUSE 2.0 — universal nav injector + scroll behaviour
 *
 * Usage — replace the entire <nav id="site-nav">…</nav> block with:
 *
 *   Standard pages:
 *     <div id="site-nav-host"
 *          data-nav-active="about|gallery|contact|products|login|shop">
 *     </div>
 *
 *   SKU pages (flagship-detail, nutrition-facts):
 *     <div id="site-nav-host" data-nav-variant="sku" data-nav-active="products">
 *       <!-- paste ONLY the page-specific #nav-state2 block here -->
 *     </div>
 *
 * Then keep <script src="assets/js/nav.js"></script> before </body>.
 *
 * Active-state values: "about" "gallery" "contact" "products" "login" "shop"
 * Leave data-nav-active blank (or omit) for pages with no highlighted link.
 */
(function () {

  var host = document.getElementById('site-nav-host');
  if (!host) return;

  var variant = host.getAttribute('data-nav-variant') || 'standard';
  var active  = (host.getAttribute('data-nav-active') || '').toLowerCase();
  var slot    = host.innerHTML.trim(); // SKU pages: contains the custom #nav-state2 HTML

  // ─── 1. Inject shared CSS ──────────────────────────────────────────────────
  if (!document.getElementById('muse-nav-css')) {
    var style = document.createElement('style');
    style.id = 'muse-nav-css';
    style.textContent = [
      /* nav state switching */
      '#nav-state1{display:flex;}',
      '#nav-state2{display:none;}',
      '#site-nav.nav--scrolled #nav-state1{display:none!important;}',
      '#site-nav.nav--scrolled #nav-state2{display:flex!important;}',
      /* SKU State-2 grid override (nav-variant=sku) */
      '#site-nav.nav--scrolled [data-sku-state2]{display:grid!important;grid-template-columns:1fr auto 1fr;}',
      /* dropdowns */
      '.muse-dropdown-menu{display:none;}',
      '.muse-dropdown:hover .muse-dropdown-menu{display:block;}',
      '.muse-sub{display:block;padding:11px 13px;font-size:11px;letter-spacing:.14em;font-weight:500;color:#0A0B0C;text-decoration:none;transition:background .25s ease;}',
      '.muse-sub:hover{background:#F4ECDD;color:#C9851A;}',
      /* mobile nav */
      '#nav-mobile{display:none;position:relative;align-items:center;justify-content:space-between;padding:10px 20px;background:#FBF6EE;border-bottom:1px solid #E7DAC4;}',
      '#mob-hamburger{background:none;border:none;cursor:pointer;padding:4px;display:flex;flex-direction:column;justify-content:center;gap:5.5px;flex:none;}',
      '#mob-hamburger span{display:block;width:22px;height:2.5px;background:#0A0B0C;border-radius:2px;}',
      '#nav-mobile-menu{display:none;background:#FBF6EE;border-bottom:1px solid #E7DAC4;}',
      '.mob-item{display:block;padding:15px 24px;font-size:11px;letter-spacing:.2em;font-weight:500;color:#0A0B0C;text-decoration:none;border-bottom:1px solid rgba(231,218,196,.5);}',
      '.mob-sub{display:block;padding:11px 38px;font-size:10px;letter-spacing:.14em;font-weight:500;color:#5A5040;text-decoration:none;background:rgba(247,241,232,.6);border-bottom:1px solid rgba(231,218,196,.3);}',
      '@media(max-width:960px){',
        '#nav-state1,#nav-state2,#site-nav.nav--scrolled #nav-state2{display:none!important;}',
        '#nav-mobile{display:flex!important;}',
        '#fd-tabs,#sku-tabs{display:none!important;}',
      '}'
    ].join('');
    document.head.appendChild(style);
  }

  // ─── 2. Shared HTML fragments ──────────────────────────────────────────────

  var MONOGRAM = '<img src="images/MUSE%20-%20Monogram%20(Solo%20GLD).png" alt="MUSE" style="height:38px;width:auto;">';
  var MONOGRAM_SM = '<img src="images/MUSE%20-%20Monogram%20(Solo%20GLD).png" alt="MUSE" style="height:28px;width:auto;">';

  var CART_SVG_LG = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0A0B0C" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" fill="#EFA527"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';
  var CART_SVG_MD = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';
  var CART_SVG_SM = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';
  var SEARCH_SVG_LG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>';
  var SEARCH_SVG_SM = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>';

  var CART_BADGE = '<span class="cart-badge" style="position:absolute;top:-7px;right:-8px;min-width:15px;height:15px;padding:0 3px;border-radius:9px;background:#FF3B30;color:#FDFCFA;font-size:9px;font-weight:700;display:none;align-items:center;justify-content:center;line-height:1;">0</span>';
  var CART_BADGE_S1 = '<span class="cart-badge" style="position:absolute;top:-5px;right:-7px;min-width:15px;height:15px;padding:0 3px;border-radius:9px;background:#FF3B30;color:#FDFCFA;font-size:9px;font-weight:700;display:none;align-items:center;justify-content:center;line-height:1;">0</span>';

  var CART_DROPDOWN_BODY = '<div class="muse-dropdown-menu" style="position:absolute;top:100%;right:0;width:312px;background:#FDFCFA;border:1px solid #E7DAC4;box-shadow:0 18px 44px -20px rgba(10,11,12,.5);padding:18px;text-align:left;z-index:200;"><div data-cart-body></div><div style="display:flex;gap:10px;margin-top:14px;"><a href="cart.html" style="flex:1;text-align:center;border:1.5px solid #0A0B0C;color:#0A0B0C;border-radius:30px;padding:9px;font-size:10px;letter-spacing:.16em;font-weight:600;text-decoration:none;display:block;">VIEW CART</a><a href="checkout.html" style="flex:1;text-align:center;background:#EFA527;color:#0A0B0C;border-radius:30px;padding:9px;font-size:10px;letter-spacing:.16em;font-weight:600;text-decoration:none;display:block;">CHECKOUT</a></div></div>';

  var SHOP_PILL_S2 = '<div class="muse-dropdown" style="position:relative;padding-bottom:14px;margin-bottom:-14px;flex:none;"><div style="display:flex;align-items:center;gap:10px;background:#EFA527;color:#0A0B0C;border-radius:30px;padding:9px 20px;font-size:11px;letter-spacing:.16em;font-weight:600;cursor:pointer;"><a href="shop.html" style="color:inherit;text-decoration:none;letter-spacing:inherit;font-size:inherit;font-weight:inherit;">SHOP</a><span style="width:1px;height:15px;background:rgba(10,11,12,.3);flex:none;"></span><a href="cart.html" style="position:relative;display:flex;align-items:center;text-decoration:none;color:inherit;">'
    + CART_SVG_MD + CART_BADGE + '</a></div>' + CART_DROPDOWN_BODY + '</div>';

  var SHOP_PILL_MOB = '<div style="display:flex;align-items:center;gap:10px;background:#EFA527;color:#0A0B0C;border-radius:30px;padding:8px 18px;font-size:11px;letter-spacing:.16em;font-weight:600;flex:none;"><a href="shop.html" style="color:inherit;text-decoration:none;letter-spacing:inherit;font-size:inherit;font-weight:inherit;">SHOP</a><span style="width:1px;height:14px;background:rgba(10,11,12,.3);flex:none;"></span><a href="cart.html" style="position:relative;display:flex;align-items:center;text-decoration:none;color:inherit;">'
    + CART_SVG_SM + CART_BADGE + '</a></div>';

  var ABOUT_DD_MENU = '<div class="muse-dropdown-menu" style="position:absolute;top:100%;left:0;width:240px;background:#FDFCFA;border:1px solid #E7DAC4;box-shadow:0 18px 44px -20px rgba(10,11,12,.5);padding:7px;z-index:60;"><a href="about.html" class="muse-sub">OUR STORY</a><a href="flagship-detail.html" class="muse-sub">THE FLAGSHIP MUSES</a><div style="display:flex;align-items:center;justify-content:space-between;padding:11px 13px;font-size:11px;letter-spacing:.14em;font-weight:500;color:#B0A892;cursor:default;">LORE<span style="font-size:8px;letter-spacing:.1em;font-weight:600;color:#C9851A;border:1px solid #E7C98A;border-radius:30px;padding:2px 7px;white-space:nowrap;">COMING SOON</span></div></div>';

  var CONTACT_DD_MENU = '<div class="muse-dropdown-menu" style="position:absolute;top:100%;left:0;width:220px;background:#FDFCFA;border:1px solid #E7DAC4;box-shadow:0 18px 44px -20px rgba(10,11,12,.5);padding:7px;z-index:60;"><a href="contact.html" class="muse-sub">CONTACT US</a><a href="share-a-muse.html" class="muse-sub">SHARE YOUR MUSE</a></div>';

  var MOBILE_DROPDOWN = '<div id="nav-mobile-menu">'
    + '<a href="about.html" class="mob-item">ABOUT</a>'
    + '<a href="about.html" class="mob-sub">OUR STORY</a>'
    + '<a href="flagship-detail.html" class="mob-sub">THE FLAGSHIP MUSES</a>'
    + '<div class="mob-sub" style="display:flex;align-items:center;justify-content:space-between;cursor:default;color:#B0A892;">LORE<span style="font-size:8px;letter-spacing:.1em;font-weight:600;color:#C9851A;border:1px solid #E7C98A;border-radius:30px;padding:2px 7px;white-space:nowrap;">COMING SOON</span></div>'
    + '<a href="gallery.html" class="mob-item">GALLERY</a>'
    + '<a href="contact.html" class="mob-item">CONTACT</a>'
    + '<a href="contact.html" class="mob-sub">CONTACT US</a>'
    + '<a href="share-a-muse.html" class="mob-sub" style="border-bottom:1px solid rgba(231,218,196,.5);">SHARE YOUR MUSE</a>'
    + '<a href="login.html" class="mob-item">LOG IN</a>'
    + '<a href="products.html" class="mob-item">PRODUCTS</a>'
    + '<div class="mob-item" onclick="openMuseSearch()" style="display:flex;align-items:center;gap:12px;cursor:pointer;">'
    +   SEARCH_SVG_SM + ' SEARCH'
    + '</div>'
    + '</div>';

  // ─── 3. Active-link helper ─────────────────────────────────────────────────

  function linkStyle(key, size) {
    // size: 's1' = State 1 (12px), 's2' = State 2 (11px)
    var fs   = size === 's1' ? '12px' : '11px';
    var lsp  = size === 's1' ? '.18em' : '.2em';
    var base = 'font-size:' + fs + ';letter-spacing:' + lsp + ';font-weight:500;color:#0A0B0C;text-decoration:none;';
    if (active === key) return base + 'font-weight:600;border-bottom:2px solid #EFA527;padding-bottom:4px;display:inline-block;';
    return base;
  }

  var CHEVRON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="opacity:.5;flex:none;"><path d="m6 9 6 6 6-6"/></svg>';

  // ─── 4. STATE 1 HTML ───────────────────────────────────────────────────────

  var S1 = '<div id="nav-state1" style="display:flex;align-items:center;justify-content:space-between;padding:11px 48px;background:#FBF6EE;border-bottom:1px solid #E7DAC4;">'
    // Left: ABOUT GALLERY CONTACT
    + '<div style="display:flex;flex:1;align-items:center;justify-content:space-evenly;padding-left:104px;">'
      + '<div class="muse-dropdown" style="position:relative;align-self:center;padding-bottom:16px;margin-bottom:-16px;display:flex;align-items:center;">'
        + '<a href="about.html" style="' + linkStyle('about','s1') + 'display:inline-flex;align-items:center;gap:5px;">ABOUT' + CHEVRON + '</a>'
        + ABOUT_DD_MENU
      + '</div>'
      + '<a href="gallery.html" style="' + linkStyle('gallery','s1') + '">GALLERY</a>'
      + '<div class="muse-dropdown" style="position:relative;align-self:center;padding-bottom:16px;margin-bottom:-16px;display:flex;align-items:center;">'
        + '<a href="contact.html" style="' + linkStyle('contact','s1') + 'display:inline-flex;align-items:center;gap:5px;">CONTACT' + CHEVRON + '</a>'
        + CONTACT_DD_MENU
      + '</div>'
    + '</div>'
    // Center: monogram
    + '<a href="index.html" aria-label="MUSE home" style="display:inline-flex;align-items:center;flex:none;">' + MONOGRAM + '</a>'
    // Right: LOG IN · PRODUCTS · SHOP
    + '<div style="display:flex;flex:1;align-items:center;justify-content:space-evenly;padding-right:104px;">'
      + '<a href="login.html"    style="' + linkStyle('login',   's1') + '">LOG IN</a>'
      + '<a href="products.html" style="' + linkStyle('products','s1') + '">PRODUCTS</a>'
      + '<a href="shop.html"     style="' + linkStyle('shop',    's1') + '">SHOP</a>'
    + '</div>'
    // Absolute right: cart + search
    + '<div style="position:absolute;right:48px;top:50%;transform:translateY(-50%);display:flex;align-items:center;gap:66px;">'
      + '<div class="muse-dropdown" style="position:relative;padding-bottom:14px;margin-bottom:-14px;display:flex;align-items:center;">'
        + '<a href="cart.html" aria-label="Cart" style="cursor:pointer;display:inline-flex;align-items:center;position:relative;text-decoration:none;color:inherit;">'
          + CART_SVG_LG + CART_BADGE_S1
        + '</a>'
        + CART_DROPDOWN_BODY
      + '</div>'
      + '<span onclick="openMuseSearch()" style="cursor:pointer;display:inline-flex;align-items:center;color:#0A0B0C;">' + SEARCH_SVG_LG + '</span>'
    + '</div>'
  + '</div>';

  // ─── 5a. STATE 2 · Standard ───────────────────────────────────────────────

  var S2_STANDARD = '<div id="nav-state2" style="display:none;position:relative;align-items:center;justify-content:space-between;padding:11px 48px;background:rgba(253,252,250,.8);backdrop-filter:blur(12px) saturate(1.1);-webkit-backdrop-filter:blur(12px) saturate(1.1);border-bottom:1px solid rgba(231,218,196,.7);">'
    + '<a href="index.html" aria-label="MUSE home" style="display:inline-flex;align-items:center;flex:none;">' + MONOGRAM + '</a>'
    + '<div style="position:absolute;left:50%;transform:translateX(-50%);display:flex;gap:72px;align-items:center;">'
      + '<div class="muse-dropdown" style="position:relative;align-self:center;padding-bottom:16px;margin-bottom:-16px;display:flex;align-items:center;">'
        + '<a href="about.html" style="' + linkStyle('about','s2') + 'display:inline-flex;align-items:center;gap:5px;">ABOUT' + CHEVRON + '</a>'
        + ABOUT_DD_MENU
      + '</div>'
      + '<a href="gallery.html"  style="' + linkStyle('gallery', 's2') + '">GALLERY</a>'
      + '<div class="muse-dropdown" style="position:relative;align-self:center;padding-bottom:16px;margin-bottom:-16px;display:flex;align-items:center;">'
        + '<a href="contact.html" style="' + linkStyle('contact','s2') + 'display:inline-flex;align-items:center;gap:5px;">CONTACT' + CHEVRON + '</a>'
        + CONTACT_DD_MENU
      + '</div>'
      + '<a href="products.html" style="' + linkStyle('products','s2') + '">PRODUCTS</a>'
      + '<a href="login.html"    style="' + linkStyle('login',   's2') + '">LOG IN</a>'
    + '</div>'
    + '<div style="display:flex;align-items:center;gap:18px;flex:none;">'
      + SHOP_PILL_S2
      + '<span onclick="openMuseSearch()" style="cursor:pointer;display:inline-flex;align-items:center;color:#0A0B0C;">' + SEARCH_SVG_LG + '</span>'
    + '</div>'
  + '</div>';

  // ─── 5b. STATE 2 · SKU (slot provided by page) ────────────────────────────
  // For sku variant the slot HTML (custom #nav-state2) is injected verbatim.

  // ─── 6a. MOBILE NAV · Standard ────────────────────────────────────────────

  var MOB_STANDARD = '<div id="nav-mobile">'
    + '<button id="mob-hamburger" onclick="mobToggleMenu()" aria-label="Open menu"><span></span><span></span><span></span></button>'
    + '<a href="index.html" aria-label="MUSE home" style="position:absolute;left:50%;transform:translateX(-50%);display:inline-flex;align-items:center;">' + MONOGRAM_SM + '</a>'
    + SHOP_PILL_MOB
  + '</div>'
  + MOBILE_DROPDOWN
  + '<script>window.mobToggleMenu=function(){var m=document.getElementById(\'nav-mobile-menu\');m.style.display=m.style.display===\'block\'?\'none\':\'block\';};<\/script>';

  // ─── 6b. MOBILE NAV · SKU (logo · carousel · logo center) ────────────────

  var MOB_SKU = '<div id="nav-mobile">'
    + '<button id="mob-hamburger" onclick="mobToggleMenu()" aria-label="Open menu"><span></span><span></span><span></span></button>'
    + '<div style="position:absolute;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:10px;">'
      + '<a href="index.html" aria-label="MUSE home" style="display:inline-flex;align-items:center;flex:none;">' + MONOGRAM_SM + '</a>'
      + '<div style="display:flex;align-items:center;gap:8px;">'
        + '<button id="mob-sku-prev" style="width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid rgba(10,11,12,.22);background:none;cursor:pointer;flex:none;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m15 18-6-6 6-6"/></svg></button>'
        + '<span id="mob-sku-name" style="font-family:\'Ogg\',\'Cormorant Garamond\',Georgia,serif;font-size:15px;letter-spacing:.14em;font-weight:500;min-width:72px;text-align:center;">THALIA</span>'
        + '<button id="mob-sku-next" style="width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid rgba(10,11,12,.22);background:none;cursor:pointer;flex:none;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m9 18 6-6-6-6"/></svg></button>'
      + '</div>'
      + '<a href="index.html" aria-label="MUSE home" style="display:inline-flex;align-items:center;flex:none;">' + MONOGRAM_SM + '</a>'
    + '</div>'
    + SHOP_PILL_MOB
  + '</div>'
  + MOBILE_DROPDOWN
  + '<script>window.mobToggleMenu=function(){var m=document.getElementById(\'nav-mobile-menu\');m.style.display=m.style.display===\'block\'?\'none\':\'block\';};<\/script>';

  // ─── 7. Assemble & inject ─────────────────────────────────────────────────

  var state2 = (variant === 'sku' && slot) ? slot : S2_STANDARD;
  var mobile  = variant === 'sku' ? MOB_SKU : MOB_STANDARD;

  host.innerHTML = '<nav id="site-nav" style="position:fixed;top:0;left:0;right:0;z-index:50;">'
    + S1
    + state2
    + mobile
  + '</nav>';

  // ─── 8. Scroll behaviour ──────────────────────────────────────────────────

  var nav      = document.getElementById('site-nav');
  var sentinel = document.querySelector('[data-nav-sentinel]');
  if (!nav || !sentinel) return;

  var threshold = parseInt(sentinel.getAttribute('data-nav-threshold') || '0', 10);

  function setScrolled(sc) {
    sc ? nav.classList.add('nav--scrolled') : nav.classList.remove('nav--scrolled');
  }

  function compute() {
    setScrolled(sentinel.getBoundingClientRect().top <= threshold);
  }

  if ('IntersectionObserver' in window) {
    var opts = { threshold: 0 };
    if (threshold !== 0) opts.rootMargin = threshold + 'px 0px 0px 0px';
    new IntersectionObserver(function (e) { setScrolled(!e[0].isIntersecting); }, opts).observe(sentinel);
  }

  window.addEventListener('scroll', compute, { passive: true });
  compute();

})();
