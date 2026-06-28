/**
 * MUSE 2.0 — shared standard footer
 * Injects footer HTML into <div id="site-footer"></div>.
 * Cream palette — mirrors the flagship-detail footer structure:
 * monogram → italic tagline → nav links → divider → copyright.
 */
(function () {
  var el = document.getElementById('site-footer');
  if (!el) return;

  el.innerHTML = [
    '<footer style="background:linear-gradient(180deg,#FBF6EE 0%,#DDE3E4 100%);padding:clamp(40px,5vw,62px) 48px clamp(30px,4vw,42px);font-family:neuehaasdisplaylight,neue-haas-grotesk-text,sans-serif;text-align:center;">',
    '  <img src="images/MUSE%20-%20Monogram%20(Solo%20GLD).png" alt="MUSE" style="height:108px;width:auto;margin:0 auto 14px;display:block;">',
    '  <div style="font-family:Ogg,serif;font-style:italic;font-size:21px;color:#0A0B0C;margin-bottom:26px;">Celebrate amongst the clouds.</div>',
    '  <div style="display:flex;gap:52px;justify-content:center;flex-wrap:wrap;margin-bottom:28px;">',
    '    <a href="about.html"   style="font-size:11px;letter-spacing:.18em;font-weight:500;color:#0A0B0C;text-decoration:none;">ABOUT</a>',
    '    <a href="gallery.html" style="font-size:11px;letter-spacing:.18em;font-weight:500;color:#0A0B0C;text-decoration:none;">GALLERY</a>',
    '    <a href="contact.html" style="font-size:11px;letter-spacing:.18em;font-weight:500;color:#0A0B0C;text-decoration:none;">CONTACT</a>',
    '    <a href="products.html" style="font-size:11px;letter-spacing:.18em;font-weight:500;color:#0A0B0C;text-decoration:none;">PRODUCTS</a>',
    '    <a href="legal.html"   style="font-size:11px;letter-spacing:.18em;font-weight:500;color:#0A0B0C;text-decoration:none;">LEGAL &amp; PRIVACY</a>',
    '  </div>',
    '  <div style="border-top:1px solid rgba(10,11,12,.14);padding-top:22px;font-size:10px;letter-spacing:.14em;color:#6B6156;">&copy; MMXXVI MUSE &middot; ENJOY RESPONSIBLY &middot; 21+</div>',
    '</footer>'
  ].join('\n');
})();
