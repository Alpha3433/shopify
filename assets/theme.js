/* =========================================================
   OLD GLORY — theme.js
   Scroll reveals, count-ups, header, mobile menu, marquee,
   product gallery, variant picker, AJAX cart + drawer,
   sticky ATC, dispatch countdown, announcement rotator.
   ========================================================= */
(function () {
  'use strict';

  var theme = window.theme || {};
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Money formatting ---------- */
  function formatMoney(cents, format) {
    if (typeof cents === 'string') cents = cents.replace('.', '');
    format = format || theme.moneyFormat || '${{amount}}';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;

    function withDelimiters(number, precision, thousands, decimal) {
      precision = precision == null ? 2 : precision;
      thousands = thousands || ',';
      decimal = decimal || '.';
      if (isNaN(number) || number == null) return '0';
      number = (number / 100.0).toFixed(precision);
      var parts = number.split('.');
      var dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var centsPart = parts[1] ? decimal + parts[1] : '';
      return dollars + centsPart;
    }

    var value = '';
    switch (format.match(placeholderRegex) ? format.match(placeholderRegex)[1] : 'amount') {
      case 'amount': value = withDelimiters(cents, 2); break;
      case 'amount_no_decimals': value = withDelimiters(cents, 0); break;
      case 'amount_with_comma_separator': value = withDelimiters(cents, 2, '.', ','); break;
      case 'amount_no_decimals_with_comma_separator': value = withDelimiters(cents, 0, '.', ','); break;
      default: value = withDelimiters(cents, 2);
    }
    return format.replace(placeholderRegex, value);
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Count-up stats ---------- */
  function initCountUp() {
    var els = document.querySelectorAll('[data-countup]');
    if (!els.length) return;

    function animate(el) {
      var target = parseFloat(el.getAttribute('data-countup'));
      var decimals = (String(el.getAttribute('data-countup')).split('.')[1] || '').length;
      if (isNaN(target)) return;
      if (reducedMotion) { el.textContent = target.toLocaleString('en-US', { minimumFractionDigits: decimals }); return; }
      var duration = 1600;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = target * eased;
        el.textContent = val.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) { els.forEach(animate); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animate(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Header scroll state ---------- */
  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile menu ---------- */
  function initMobileMenu() {
    var menu = document.getElementById('MobileMenu');
    if (!menu) return;
    var openBtns = document.querySelectorAll('[data-menu-open]');
    var closeEls = menu.querySelectorAll('[data-menu-close]');
    function open() { menu.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
    function close() { menu.classList.remove('is-open'); document.body.style.overflow = ''; }
    openBtns.forEach(function (b) { b.addEventListener('click', open); });
    closeEls.forEach(function (b) { b.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ---------- Announcement rotator ---------- */
  function initAnnouncement() {
    var msgs = document.querySelectorAll('.announcement__msg');
    if (msgs.length < 2) return;
    var i = 0;
    setInterval(function () {
      // Fade the current message fully out before fading the next in,
      // so two messages never overlap in the same spot.
      msgs[i].classList.remove('is-active');
      setTimeout(function () {
        i = (i + 1) % msgs.length;
        msgs[i].classList.add('is-active');
      }, 520);
    }, 4500);
  }

  /* ---------- Product gallery ---------- */
  function initGalleries() {
    document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
      var main = gallery.querySelector('[data-gallery-main]');
      var thumbs = gallery.querySelectorAll('[data-gallery-thumb]');
      if (!main || !thumbs.length) return;
      thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          var src = thumb.getAttribute('data-full');
          var srcset = thumb.getAttribute('data-full-srcset');
          if (!src) return;
          main.style.opacity = '0';
          setTimeout(function () {
            main.src = src;
            if (srcset) main.srcset = srcset;
            main.alt = thumb.querySelector('img') ? thumb.querySelector('img').alt : main.alt;
            main.style.opacity = '1';
          }, 180);
          thumbs.forEach(function (t) { t.classList.remove('is-active'); });
          thumb.classList.add('is-active');
        });
      });
    });
  }

  /* ---------- Variant picker (pill radios or selects) ---------- */
  function initVariantPickers() {
    document.querySelectorAll('[data-product-form]').forEach(function (wrapper) {
      var jsonEl = wrapper.querySelector('[data-product-json]');
      var groups = wrapper.querySelectorAll('[data-option-group]');
      var selects = wrapper.querySelectorAll('[data-option-select]');
      if (!jsonEl || (!groups.length && !selects.length)) return;
      var product;
      try { product = JSON.parse(jsonEl.textContent); } catch (e) { return; }

      function chosenOptions() {
        if (groups.length) {
          return Array.prototype.map.call(groups, function (g) {
            var checked = g.querySelector('input:checked');
            return checked ? checked.value : null;
          });
        }
        return Array.prototype.map.call(selects, function (s) { return s.value; });
      }

      function currentVariant() {
        var chosen = chosenOptions();
        return product.variants.find(function (v) {
          return v.options.every(function (opt, idx) { return opt === chosen[idx]; });
        });
      }

      function update() {
        var variant = currentVariant();
        var idInput = wrapper.querySelector('input[name="id"]');
        var btn = wrapper.querySelector('[data-atc-button]');
        var priceEl = wrapper.querySelector('[data-price-current]');
        var compareEl = wrapper.querySelector('[data-price-compare]');
        var saveEl = wrapper.querySelector('[data-price-save]');
        var stickyPrice = document.querySelector('[data-sticky-atc] [data-price-current]');
        var stickyBtn = document.querySelector('[data-sticky-atc] [data-sticky-submit]');

        // Selected bundle: a quantity multiplier plus an optional extra discount %
        // (the discount % must match the real Shopify automatic discount).
        var bundleInput = wrapper.querySelector('input[data-bundle-qty]:checked');
        var qty = bundleInput ? (parseInt(bundleInput.getAttribute('data-bundle-qty'), 10) || 1) : 1;
        var disc = bundleInput ? (parseFloat(bundleInput.getAttribute('data-bundle-discount')) || 0) : 0;
        var qtyInput = wrapper.querySelector('input[name="quantity"]');
        if (qtyInput) qtyInput.value = qty;

        if (variant) {
          if (idInput) idInput.value = variant.id;

          var unit = variant.price;
          var unitCompare = (variant.compare_at_price && variant.compare_at_price > variant.price) ? variant.compare_at_price : 0;
          var current = Math.round(unit * qty * (1 - disc / 100));
          var compareBase = (unitCompare || unit) * qty;
          var showCompare = compareBase > current;

          if (priceEl) priceEl.textContent = formatMoney(current);
          if (stickyPrice) stickyPrice.textContent = formatMoney(current);
          if (compareEl) {
            if (showCompare) { compareEl.textContent = formatMoney(compareBase); compareEl.hidden = false; }
            else { compareEl.hidden = true; }
          }
          if (saveEl) {
            if (showCompare) {
              saveEl.textContent = 'Save ' + Math.round((compareBase - current) / compareBase * 100) + '%';
              saveEl.hidden = false;
            } else { saveEl.hidden = true; }
          }
          if (stickyBtn) stickyBtn.disabled = !variant.available;
          if (btn) {
            btn.disabled = !variant.available;
            var label = btn.querySelector('[data-atc-label]');
            if (label) label.textContent = variant.available ? btn.getAttribute('data-text-add') : btn.getAttribute('data-text-soldout');
          }
        } else {
          if (btn) {
            btn.disabled = true;
            var lbl = btn.querySelector('[data-atc-label]');
            if (lbl) lbl.textContent = btn.getAttribute('data-text-unavailable') || 'Unavailable';
          }
          if (stickyBtn) stickyBtn.disabled = true;
        }
      }

      var bundleGroup = wrapper.querySelector('[data-bundle-group]');
      selects.forEach(function (s) { s.addEventListener('change', update); });
      groups.forEach(function (g) {
        g.addEventListener('change', function (e) {
          if (e.target.matches('input')) update();
        });
      });
      if (bundleGroup) bundleGroup.addEventListener('change', update);
      update();
    });
  }

  /* ---------- Bundle offer cards (sync quantity) ---------- */
  function initBundles() {
    document.querySelectorAll('[data-bundle-group]').forEach(function (group) {
      var form = group.closest('form');
      if (!form) return;
      function sync() {
        var checked = group.querySelector('input[data-bundle-qty]:checked');
        var qtyInput = form.querySelector('input[name="quantity"]');
        if (checked && qtyInput) qtyInput.value = parseInt(checked.getAttribute('data-bundle-qty'), 10) || 1;
      }
      group.addEventListener('change', sync);
      sync();
    });
  }

  /* ---------- Promo countdown (deadline chips) ---------- */
  function initPromoCountdown() {
    document.querySelectorAll('[data-deadline]').forEach(function (el) {
      var raw = (el.getAttribute('data-deadline') || '').trim().replace(' ', 'T');
      var deadline = new Date(raw);
      if (!raw || isNaN(deadline.getTime())) { el.hidden = true; return; }
      var nums = {
        d: el.querySelector('[data-count-d]'),
        h: el.querySelector('[data-count-h]'),
        m: el.querySelector('[data-count-m]'),
        s: el.querySelector('[data-count-s]')
      };
      var timer;
      function tick() {
        var diff = deadline - new Date();
        if (diff <= 0) {
          el.hidden = true;
          if (timer) clearInterval(timer);
          return;
        }
        var d = Math.floor(diff / 86400000);
        var h = Math.floor((diff % 86400000) / 3600000);
        var m = Math.floor((diff % 3600000) / 60000);
        var s = Math.floor((diff % 60000) / 1000);
        if (nums.d) nums.d.textContent = String(d).padStart(2, '0');
        if (nums.h) nums.h.textContent = String(h).padStart(2, '0');
        if (nums.m) nums.m.textContent = String(m).padStart(2, '0');
        if (nums.s) nums.s.textContent = String(s).padStart(2, '0');
      }
      tick();
      timer = setInterval(tick, 1000);
    });
  }

  /* ---------- Quantity steppers ---------- */
  function initQty() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-qty-change]');
      if (!btn) return;
      var input = btn.parentElement.querySelector('input');
      if (!input) return;
      var step = parseInt(btn.getAttribute('data-qty-change'), 10);
      var val = Math.max(1, (parseInt(input.value, 10) || 1) + step);
      input.value = val;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  /* ---------- Cart drawer ---------- */
  var drawer = {
    el: null,
    init: function () {
      this.el = document.getElementById('CartDrawer');
      if (!this.el) return;
      var self = this;
      this.el.querySelectorAll('[data-cart-close]').forEach(function (btn) {
        btn.addEventListener('click', function () { self.close(); });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') self.close();
      });
      document.querySelectorAll('[data-cart-open]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          self.refresh().then(function () { self.open(); });
        });
      });
      this.el.addEventListener('click', function (e) {
        var changeBtn = e.target.closest('[data-line-change]');
        if (changeBtn) {
          var line = parseInt(changeBtn.getAttribute('data-line'), 10);
          var qty = parseInt(changeBtn.getAttribute('data-line-change'), 10);
          self.changeLine(line, qty);
        }
      });
    },
    open: function () {
      if (!this.el) return;
      this.el.classList.add('is-open');
      this.el.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    },
    close: function () {
      if (!this.el) return;
      this.el.classList.remove('is-open');
      this.el.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    },
    refresh: function () {
      var self = this;
      return fetch('/cart.js')
        .then(function (r) { return r.json(); })
        .then(function (cart) { self.render(cart); return cart; })
        .catch(function () {});
    },
    changeLine: function (line, qty) {
      var self = this;
      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line: line, quantity: qty })
      })
        .then(function (r) { return r.json(); })
        .then(function (cart) { self.render(cart); })
        .catch(function () {});
    },
    render: function (cart) {
      if (!this.el) return;
      var itemsEl = this.el.querySelector('[data-cart-items]');
      var footEl = this.el.querySelector('[data-cart-foot]');
      var subtotalEl = this.el.querySelector('[data-cart-subtotal]');
      var countEls = document.querySelectorAll('[data-cart-count]');

      countEls.forEach(function (el) {
        el.textContent = cart.item_count;
        el.setAttribute('data-count', cart.item_count);
      });

      if (!itemsEl) return;

      if (!cart.items.length) {
        itemsEl.innerHTML =
          '<div class="cart-drawer__empty">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.5a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6"/></svg>' +
          '<p><strong>Your cart is empty.</strong><br>Bring home a piece of America.</p>' +
          '<a class="btn btn--primary" href="' + (theme.allProductsUrl || '/collections/all') + '">Shop the Collection</a>' +
          '</div>';
        if (footEl) footEl.hidden = true;
      } else {
        var html = cart.items.map(function (item, idx) {
          var line = idx + 1;
          var img = item.image
            ? '<img class="cart-line__img" src="' + item.image.replace(/(\.[^.]+)$/, '_160x$1') + '" alt="" loading="lazy">'
            : '<div class="cart-line__img"></div>';
          var variantTitle = (item.variant_title && item.variant_title !== 'Default Title')
            ? '<div class="cart-line__variant">' + item.variant_title + '</div>' : '';
          return (
            '<div class="cart-line">' + img +
            '<div>' +
            '<div class="cart-line__title">' + item.product_title + '</div>' + variantTitle +
            '<div class="cart-line__row">' +
            '<span class="cart-line__qty">' +
            '<button type="button" aria-label="Decrease quantity" data-line-change="' + (item.quantity - 1) + '" data-line="' + line + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/></svg></button>' +
            '<span>' + item.quantity + '</span>' +
            '<button type="button" aria-label="Increase quantity" data-line-change="' + (item.quantity + 1) + '" data-line="' + line + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg></button>' +
            '</span>' +
            '<span class="cart-line__price">' + formatMoney(item.final_line_price) + '</span>' +
            '</div>' +
            '<button type="button" class="cart-line__remove" data-line-change="0" data-line="' + line + '">Remove</button>' +
            '</div></div>'
          );
        }).join('');
        itemsEl.innerHTML = html;
        if (footEl) footEl.hidden = false;
        if (subtotalEl) subtotalEl.textContent = formatMoney(cart.total_price);
      }

      // Free shipping progress
      var shipEl = this.el.querySelector('[data-ship-bar]');
      if (shipEl) {
        var threshold = parseInt(theme.freeShippingThreshold, 10) || 0;
        var label = shipEl.querySelector('.ship-bar__label');
        var fill = shipEl.querySelector('.ship-bar__fill');
        if (threshold <= 0 || !cart.items.length) {
          shipEl.hidden = !cart.items.length || threshold <= 0;
          if (threshold <= 0) shipEl.hidden = true;
        }
        if (threshold > 0 && cart.items.length) {
          shipEl.hidden = false;
          var remaining = threshold - cart.total_price;
          var pct = Math.min(100, (cart.total_price / threshold) * 100);
          if (fill) fill.style.width = pct + '%';
          if (label) {
            label.innerHTML = remaining > 0
              ? 'You’re <strong>' + formatMoney(remaining) + '</strong> away from FREE shipping'
              : '🎉 You’ve unlocked <strong>FREE shipping!</strong>';
          }
        }
      }
    }
  };

  /* ---------- AJAX add to cart ---------- */
  function initAddToCart() {
    document.querySelectorAll('form[data-ajax-cart]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = form.querySelector('[data-atc-button]');
        var label = btn ? btn.querySelector('[data-atc-label]') : null;
        var original = label ? label.textContent : '';
        if (btn) { btn.disabled = true; if (label) label.textContent = 'Adding…'; }

        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            items: [{
              id: parseInt(form.querySelector('input[name="id"]').value, 10),
              quantity: parseInt((form.querySelector('input[name="quantity"]') || { value: 1 }).value, 10) || 1
            }]
          })
        })
          .then(function (r) {
            if (!r.ok) return r.json().then(function (err) { throw err; });
            return r.json();
          })
          .then(function () { return drawer.refresh(); })
          .then(function () {
            drawer.open();
            if (btn) { btn.disabled = false; if (label) label.textContent = original; }
          })
          .catch(function (err) {
            if (btn) { btn.disabled = false; if (label) label.textContent = original; }
            alert((err && err.description) || 'Sorry, something went wrong. Please try again.');
          });
      });
    });
  }

  /* ---------- Sticky mobile ATC ---------- */
  function initStickyAtc() {
    var bar = document.querySelector('[data-sticky-atc]');
    var anchor = document.querySelector('[data-atc-anchor]');
    if (!bar || !anchor || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        bar.classList.toggle('is-visible', !entry.isIntersecting && entry.boundingClientRect.top < 0);
      });
    }, { threshold: 0 });
    io.observe(anchor);

    var stickyBtn = bar.querySelector('[data-sticky-submit]');
    if (stickyBtn) {
      stickyBtn.addEventListener('click', function () {
        var form = document.querySelector('form[data-ajax-cart]');
        if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
      });
    }
  }

  /* ---------- Dispatch countdown ---------- */
  function initCountdown() {
    document.querySelectorAll('[data-countdown-cutoff]').forEach(function (el) {
      var cutoffHour = parseInt(el.getAttribute('data-countdown-cutoff'), 10);
      if (isNaN(cutoffHour)) return;
      var target = el.querySelector('[data-countdown-time]');
      if (!target) return;

      function tick() {
        var now = new Date();
        var cutoff = new Date(now);
        cutoff.setHours(cutoffHour, 0, 0, 0);
        if (now >= cutoff) cutoff.setDate(cutoff.getDate() + 1);
        var diff = cutoff - now;
        var h = Math.floor(diff / 3600000);
        var m = Math.floor((diff % 3600000) / 60000);
        var s = Math.floor((diff % 60000) / 1000);
        target.textContent = h + 'h ' + String(m).padStart(2, '0') + 'm ' + String(s).padStart(2, '0') + 's';
      }
      tick();
      setInterval(tick, 1000);
    });
  }

  /* ---------- Marquee: duplicate content for seamless loop ---------- */
  function initMarquee() {
    document.querySelectorAll('.marquee__track, .big-marquee__track').forEach(function (track) {
      var content = track.innerHTML;
      // Track halves must be identical and wider than any viewport for a
      // seamless translateX(-50%) loop, so render the items four times.
      track.innerHTML = content + content + content + content;
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initCountUp();
    initHeader();
    initMobileMenu();
    initAnnouncement();
    initGalleries();
    initVariantPickers();
    initBundles();
    initQty();
    drawer.init();
    initAddToCart();
    initStickyAtc();
    initCountdown();
    initPromoCountdown();
    initMarquee();
  });
})();
