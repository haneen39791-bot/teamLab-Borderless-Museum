/* =========================================================
   teamLab Borderless Jeddah — Interactions
   الأسعار والمواعيد أدناه أمثلة قابلة للتعديل بسهولة.
   Prices and times below are editable examples.
   ========================================================= */

(function () {
  'use strict';

  const LANG = document.documentElement.lang === 'en' ? 'en' : 'ar';

  const I18N = {
    ar: {
      currency: 'ر.س',
      menuOpen: 'فتح القائمة',
      menuClose: 'إغلاق القائمة',
      tickets: {
        general: 'تذكرة عامة', child: 'تذكرة طفل',
        family: 'تذكرة العائلة', vip: 'تجربة كبار الزوار'
      },
      holidays: {
        '02-22': 'يوم التأسيس — قد تختلف ساعات العمل اليوم.',
        '09-23': 'اليوم الوطني — قد تختلف ساعات العمل اليوم.'
      },
      dateHintClosed: 'الإثنين يوم إغلاق أسبوعي — اختر يوماً آخر.',
      bookingMonday: 'لا يمكن الحجز يوم الإثنين.',
      noDate: 'اختر تاريخ زيارة غير يوم الإثنين.',
      pastDate: 'لا يمكن الحجز لتاريخ ماضٍ.',
      noTime: 'اختر وقت الدخول.',
      needName: 'اكتب اسمك الكامل.',
      needPhone: 'أدخل رقم جوال سعودي صحيح.',
      toastTicket: 'تم اختيار: ',
      toastBooking: 'تم إنشاء الحجز ',
      toastCancel: 'تم إلغاء الحجز',
      labelName: 'الاسم', labelTicket: 'التذكرة', labelDate: 'التاريخ',
      labelTime: 'الوقت', labelQty: 'عدد التذاكر', labelTotal: 'الإجمالي',
      emptyBookings: 'لا توجد حجوزات محفوظة على هذا الجهاز بعد.',
      ticketUnit: 'تذكرة', cancel: 'إلغاء',
      readMore: 'اقرأ المزيد ', readLess: 'اقرأ أقل ',
      inqName: 'يرجى كتابة اسمك.',
      inqEmail: 'يرجى إدخال بريد إلكتروني صحيح.',
      inqMessage: 'يرجى كتابة رسالة أوضح (10 أحرف على الأقل).',
      inqSaved: 'تم استلام استفسارك وحفظه على هذا الجهاز. شكراً لك!',
      inqSavedNoLs: 'تم استلام استفسارك. شكراً لك!',
      toastInq: 'تم إرسال الاستفسار بنجاح',
      newsInvalid: 'بريد غير صحيح',
      newsInvalidToast: 'أدخل بريداً إلكترونياً صحيحاً',
      newsOk: 'تم الاشتراك ✓',
      newsOkToast: 'شكراً لاشتراكك في النشرة',
      am: ' ص', pm: ' م', locale: 'ar-SA-u-ca-gregory'
    },
    en: {
      currency: 'SAR',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
      tickets: {
        general: 'General Admission', child: 'Child Ticket',
        family: 'Family Ticket', vip: 'VIP Experience'
      },
      holidays: {
        '02-22': 'Founding Day — opening hours may vary today.',
        '09-23': 'National Day — opening hours may vary today.'
      },
      dateHintClosed: 'Monday is our weekly closing day — please choose another day.',
      bookingMonday: 'Booking is not available on Mondays.',
      noDate: 'Choose a visit date other than Monday.',
      pastDate: 'Cannot book a date in the past.',
      noTime: 'Choose an entry time.',
      needName: 'Please enter your full name.',
      needPhone: 'Enter a valid Saudi mobile number.',
      toastTicket: 'Selected: ',
      toastBooking: 'Booking created: ',
      toastCancel: 'Booking cancelled',
      labelName: 'Name', labelTicket: 'Ticket', labelDate: 'Date',
      labelTime: 'Time', labelQty: 'Tickets', labelTotal: 'Total',
      emptyBookings: 'No bookings saved on this device yet.',
      ticketUnit: 'ticket(s)', cancel: 'Cancel',
      readMore: 'Read more ', readLess: 'Read less ',
      inqName: 'Please enter your name.',
      inqEmail: 'Please enter a valid email address.',
      inqMessage: 'Please write a clearer message (at least 10 characters).',
      inqSaved: 'Your inquiry was received and saved on this device. Thank you!',
      inqSavedNoLs: 'Your inquiry was received. Thank you!',
      toastInq: 'Inquiry sent successfully',
      newsInvalid: 'Invalid email',
      newsInvalidToast: 'Enter a valid email address',
      newsOk: 'Subscribed ✓',
      newsOkToast: 'Thank you for subscribing',
      am: ' AM', pm: ' PM', locale: 'en-GB'
    }
  };

  const dict = I18N[LANG];
  const t = (key) => dict[key];

  const TICKETS = {
    general: { name: dict.tickets.general, price: 120 },
    child:   { name: dict.tickets.child,   price: 80 },
    family:  { name: dict.tickets.family,  price: 350 },
    vip:     { name: dict.tickets.vip,     price: 250 }
  };
  const HOLIDAYS = dict.holidays;
  const LS_BOOKINGS = 'teamlab_bookings';
  const LS_INQUIRIES = 'teamlab_inquiries';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const money = (n) => n.toLocaleString('en-US') + ' ' + dict.currency;

  function timeLabel(h, m) {
    if (LANG === 'ar') return h + ':' + m + (+h >= 12 ? ' م' : ' ص');
    let hour = +h;
    const suffix = hour >= 12 ? ' PM' : ' AM';
    hour = hour % 12 || 12;
    return String(hour).padStart(2, '0') + ':' + m + suffix;
  }

  /* ---------------- Toast ---------------- */
  function toast(message, type) {
    const wrap = $('#toast-wrap');
    if (!wrap) return;
    const el = document.createElement('div');
    el.className = 'toast' + (type === 'error' ? ' is-error' : '');
    el.textContent = message;
    wrap.appendChild(el);
    setTimeout(() => el.remove(), 3800);
  }

  /* ---------------- Media placeholders ---------------- */
  function applyMedia(el, src) {
    if (!el) return;
    el.classList.remove('has-image');
    el.style.removeProperty('--img');
    if (!src) {
      if (el.dataset.img) delete el.dataset.img;
      return;
    }
    el.dataset.img = src;
    const test = new Image();
    test.onload = function () {
      // absolute URL so it is not resolved relative to the CSS file
      const absolute = new URL(src, document.baseURI).href;
      el.style.setProperty('--img', 'url("' + absolute + '")');
      el.classList.add('has-image');
    };
    test.onerror = function () {
      el.style.removeProperty('--img');
      el.classList.remove('has-image');
    };
    test.src = src;
  }

  $$('[data-img]').forEach((el) => applyMedia(el, el.dataset.img));

  /* ---------------- Reveal on scroll ---------------- */
  const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    : null;
  $$('.reveal').forEach((el) => revealObserver ? revealObserver.observe(el) : el.classList.add('in-view'));

  /* ---------------- Header, menu, active nav ---------------- */
  const header = $('#site-header');
  const menuToggle = $('#menu-toggle');
  const nav = $('#primary-nav');
  const toTop = $('#to-top');

  function closeMenu() {
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', dict.menuOpen);
    document.body.classList.remove('menu-open');
  }
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? dict.menuClose : dict.menuOpen);
    document.body.classList.toggle('menu-open', open);
  });
  $$('.nav a').forEach((a) => a.addEventListener('click', closeMenu));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  const navLinks = $$('.nav a');
  const navSections = navLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && navSections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    navSections.forEach((s) => navObserver.observe(s));
  }

  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle('scrolled', y > 20);
    toTop.classList.toggle('is-visible', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  $$('[data-book-scroll]').forEach((btn) => btn.addEventListener('click', () => {
    $('#tickets').scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { try { $('#book-date').focus({ preventScroll: true }); } catch (e) { $('#book-date').focus(); } }, 650);
  }));

  /* ---------------- Dialog helpers ---------------- */
  function closeAllDialogsExcept(keep) {
    $$('dialog[open]').forEach((d) => { if (d !== keep) d.close(); });
  }
  $$('[data-close-dialog]').forEach((btn) => btn.addEventListener('click', () => btn.closest('dialog').close()));
  $$('dialog').forEach((dialog) => dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  }));

  /* ---------------- Detail dialog (worlds & artworks) ---------------- */
  const detailDialog = $('#detail-dialog');
  const detailOverview = $('#detail-overview');
  $$('[data-detail]').forEach((button) => button.addEventListener('click', () => {
    const card = button.closest('[data-title]');
    if (!card) return;
    // The overview belongs to the Worlds section, so show it there only
    if (detailOverview) detailOverview.hidden = !card.closest('#worlds');
    $('#detail-title').textContent = card.dataset.title || '';
    $('#detail-en').textContent = card.dataset.en || '';
    $('#detail-desc').textContent = card.dataset.desc || '';
    $('#detail-extra').textContent = card.dataset.extra || '';
    $('#detail-duration').textContent = card.dataset.duration || '—';
    const thumb = $('.media', card);
    applyMedia($('#detail-media'), thumb ? thumb.dataset.img : null);
    closeAllDialogsExcept(detailDialog);
    detailDialog.showModal();
  }));
  $('#detail-book').addEventListener('click', () => {
    detailDialog.close();
    $('#tickets').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------------- Booking ---------------- */
  const bookingForm = $('#booking-form');
  const ticketSelect = $('#book-ticket');
  const dateInput = $('#book-date');
  const timeSelect = $('#book-time');
  const qtyInput = $('#book-qty');
  const dateHint = $('#date-hint');
  const bookingMessage = $('#booking-message');
  const bookingDialog = $('#booking-dialog');
  const bookingsDialog = $('#bookings-dialog');

  function isoDate(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function parseDate(value) {
    const parts = String(value || '').split('-');
    if (parts.length !== 3) return null;
    const d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    return isNaN(d.getTime()) ? null : d;
  }
  function readableDate(value) {
    const d = parseDate(value);
    if (!d) return value;
    try {
      return new Intl.DateTimeFormat(dict.locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d);
    } catch (e) {
      return d.toLocaleDateString();
    }
  }
  function isMonday(value) {
    const d = parseDate(value);
    return !!d && d.getDay() === 1;
  }
  function buildSlots(value) {
    const d = parseDate(value);
    timeSelect.innerHTML = '';
    if (!d || d.getDay() === 1) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = '—';
      timeSelect.appendChild(opt);
      return;
    }
    // last entry one hour before closing: 21:00 regular, 22:00 Thu/Fri
    const lastHour = (d.getDay() === 4 || d.getDay() === 5) ? 22 : 21;
    for (let minutes = 10 * 60; minutes <= lastHour * 60; minutes += 30) {
      const h = String(Math.floor(minutes / 60)).padStart(2, '0');
      const m = String(minutes % 60).padStart(2, '0');
      const opt = document.createElement('option');
      opt.value = h + ':' + m;
      opt.textContent = timeLabel(h, m);
      timeSelect.appendChild(opt);
    }
  }
  function updateTotal() {
    const ticket = TICKETS[ticketSelect.value] || TICKETS.general;
    $('#booking-total').textContent = money(ticket.price * (parseInt(qtyInput.value, 10) || 1));
    $$('.ticket-card').forEach((card) => card.classList.toggle('is-selected', card.dataset.ticket === ticketSelect.value));
  }
  function setTicket(id, scroll) {
    if (!TICKETS[id]) return;
    ticketSelect.value = id;
    updateTotal();
    if (scroll !== false) {
      $('#booking-panel').scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast(t('toastTicket') + TICKETS[id].name);
    }
  }
  $$('[data-select-ticket]').forEach((btn) => btn.addEventListener('click', () => setTicket(btn.dataset.selectTicket, true)));
  ticketSelect.addEventListener('change', updateTotal);
  $$('.stepper button').forEach((btn) => btn.addEventListener('click', () => {
    const next = (parseInt(qtyInput.value, 10) || 1) + Number(btn.dataset.step);
    qtyInput.value = Math.min(10, Math.max(1, next));
    updateTotal();
  }));

  dateInput.min = isoDate(new Date());
  function initDate() {
    if (!dateInput.value) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.value = isMonday(isoDate(tomorrow)) ? isoDate(new Date(tomorrow.getTime() + 86400000)) : isoDate(tomorrow);
    }
    handleDateChange();
  }
  function handleDateChange() {
    const value = dateInput.value;
    if (isMonday(value)) {
      dateHint.textContent = t('dateHintClosed');
      dateHint.classList.add('is-warning');
      bookingMessage.textContent = t('bookingMonday');
      dateInput.value = '';
      buildSlots('');
      updateTotal();
      return;
    }
    const md = value ? value.slice(5) : '';
    if (HOLIDAYS[md]) {
      dateHint.textContent = HOLIDAYS[md];
      dateHint.classList.add('is-warning');
    } else {
      dateHint.textContent = t('dateHintClosed');
      dateHint.classList.remove('is-warning');
    }
    bookingMessage.textContent = '';
    buildSlots(value);
    updateTotal();
  }
  dateInput.addEventListener('change', handleDateChange);
  initDate();
  updateTotal();

  function readBookings() {
    try { return JSON.parse(localStorage.getItem(LS_BOOKINGS) || '[]'); }
    catch (e) { return []; }
  }
  function writeBookings(list) {
    try { localStorage.setItem(LS_BOOKINGS, JSON.stringify(list)); return true; }
    catch (e) { return false; }
  }

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#book-name').value.trim();
    const phone = $('#book-phone').value.replace(/[\s()-]/g, '');
    const ticket = TICKETS[ticketSelect.value] || TICKETS.general;
    const qty = parseInt(qtyInput.value, 10) || 1;

    if (!dateInput.value) { bookingMessage.textContent = t('noDate'); dateInput.focus(); return; }
    if (dateInput.value < isoDate(new Date())) { bookingMessage.textContent = t('pastDate'); dateInput.focus(); return; }
    if (!timeSelect.value) { bookingMessage.textContent = t('noTime'); timeSelect.focus(); return; }
    if (name.length < 2) { bookingMessage.textContent = t('needName'); $('#book-name').focus(); return; }
    if (!/^(?:\+966|0)?5\d{8}$/.test(phone)) { bookingMessage.textContent = t('needPhone'); $('#book-phone').focus(); return; }

    const booking = {
      ref: 'TLB-' + new Date().getFullYear() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
      ticket: ticketSelect.value,
      ticketName: ticket.name,
      date: dateInput.value,
      time: timeSelect.value,
      qty: qty,
      name: name,
      phone: phone,
      total: ticket.price * qty,
      created: new Date().toISOString()
    };
    const list = readBookings();
    list.unshift(booking);
    writeBookings(list);

    $('#booking-ref').textContent = booking.ref;
    $('#booking-details').innerHTML = [
      [t('labelName'), booking.name],
      [t('labelTicket'), booking.ticketName],
      [t('labelDate'), readableDate(booking.date)],
      [t('labelTime'), booking.time],
      [t('labelQty'), String(booking.qty)],
      [t('labelTotal'), money(booking.total)]
    ].map((row) => '<div><span>' + row[0] + '</span><strong>' + row[1] + '</strong></div>').join('');
    bookingMessage.textContent = '';
    closeAllDialogsExcept(bookingDialog);
    bookingDialog.showModal();
    toast(t('toastBooking') + booking.ref);
    $('#book-name').value = '';
    $('#book-phone').value = '';
    qtyInput.value = 1;
    updateTotal();
  });

  function renderBookings() {
    const list = readBookings();
    const container = $('#bookings-list');
    if (!list.length) {
      container.innerHTML = '<p class="empty-state">' + t('emptyBookings') + '</p>';
      return;
    }
    container.innerHTML = list.map((b, i) =>
      '<div class="booking-row">' +
        '<div><strong>' + b.ref + '</strong><p>' + (b.ticketName || TICKETS[b.ticket].name) + ' · ' + b.qty + ' ' + t('ticketUnit') + ' · ' + money(b.total || 0) + '</p>' +
        '<p>' + readableDate(b.date) + ' — ' + b.time + '</p></div>' +
        '<button type="button" data-cancel-booking="' + i + '">' + t('cancel') + '</button>' +
      '</div>'
    ).join('');
    $$('[data-cancel-booking]', container).forEach((btn) => btn.addEventListener('click', () => {
      const current = readBookings();
      current.splice(Number(btn.dataset.cancelBooking), 1);
      writeBookings(current);
      renderBookings();
      toast(t('toastCancel'));
    }));
  }
  function openBookings() {
    renderBookings();
    closeAllDialogsExcept(bookingsDialog);
    bookingsDialog.showModal();
  }
  $('#show-bookings').addEventListener('click', openBookings);
  $('#show-bookings-after').addEventListener('click', openBookings);

  /* ---------------- News ---------------- */
  $$('[data-news-toggle]').forEach((button) => button.addEventListener('click', () => {
    const card = button.closest('.news-card');
    const full = $('.news-full', card);
    if (!full) {
      const el = document.createElement('div');
      el.className = 'news-full';
      el.textContent = card.dataset.full || '';
      card.insertBefore(el, button);
    }
    const expanded = card.classList.toggle('is-expanded');
    button.innerHTML = (expanded ? t('readLess') : t('readMore')) + '<span aria-hidden="true">' + (expanded ? '↑' : '←') + '</span>';
  }));
  $$('[data-news-filter]').forEach((button) => button.addEventListener('click', () => {
    $$('[data-news-filter]').forEach((b) => {
      b.classList.toggle('is-active', b === button);
      b.setAttribute('aria-pressed', String(b === button));
    });
    const filter = button.dataset.newsFilter;
    $$('.news-card').forEach((card) => card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.cat !== filter));
  }));

  /* ---------------- Gallery lightbox ---------------- */
  const galleryDialog = $('#gallery-dialog');
  const galleryItems = $$('.gallery-item');
  let galleryIndex = 0;
  function renderGallery() {
    const item = galleryItems[galleryIndex];
    if (!item) return;
    applyMedia($('#gallery-modal-media'), item.dataset.img);
    $('#gallery-caption').textContent = item.dataset.caption || '';
    $('#gallery-count').textContent = (galleryIndex + 1) + ' / ' + galleryItems.length;
  }
  galleryItems.forEach((item, i) => item.addEventListener('click', () => {
    galleryIndex = i;
    renderGallery();
    closeAllDialogsExcept(galleryDialog);
    galleryDialog.showModal();
  }));
  function moveGallery(step) {
    galleryIndex = (galleryIndex + step + galleryItems.length) % galleryItems.length;
    renderGallery();
  }
  $('#gallery-prev').addEventListener('click', () => moveGallery(-1));
  $('#gallery-next').addEventListener('click', () => moveGallery(1));
  document.addEventListener('keydown', (e) => {
    if (!galleryDialog.open) return;
    if (e.key === 'ArrowRight') moveGallery(1);
    if (e.key === 'ArrowLeft') moveGallery(-1);
  });

  /* ---------------- Inquiry form ---------------- */
  const inquiryForm = $('#contact-form');
  const inquiryStatus = $('#inq-status');
  inquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    inquiryStatus.classList.remove('is-error');
    const name = $('#inq-name').value.trim();
    const email = $('#inq-email').value.trim();
    const message = $('#inq-message').value.trim();
    if (name.length < 2) { inquiryStatus.textContent = t('inqName'); inquiryStatus.classList.add('is-error'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { inquiryStatus.textContent = t('inqEmail'); inquiryStatus.classList.add('is-error'); return; }
    if (message.length < 10) { inquiryStatus.textContent = t('inqMessage'); inquiryStatus.classList.add('is-error'); return; }
    let saved = false;
    try {
      const list = JSON.parse(localStorage.getItem(LS_INQUIRIES) || '[]');
      list.unshift({ name, email, phone: $('#inq-phone').value.trim(), subject: $('#inq-subject').value, message, created: new Date().toISOString() });
      localStorage.setItem(LS_INQUIRIES, JSON.stringify(list));
      saved = true;
    } catch (err) { /* storage not available */ }
    inquiryStatus.textContent = saved ? t('inqSaved') : t('inqSavedNoLs');
    toast(t('toastInq'));
    inquiryForm.reset();
  });

  /* ---------------- Newsletter ---------------- */
  $('#newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('input', e.currentTarget);
    const status = $('#newsletter-status');
    const email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = t('newsInvalid');
      toast(t('newsInvalidToast'), 'error');
      return;
    }
    status.textContent = t('newsOk');
    input.value = '';
    toast(t('newsOkToast'));
  });

  /* ---------------- Hero light canvas ---------------- */
  (function initCanvas() {
    const canvas = $('#hero-canvas');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0, height = 0, particles = [], raf = null;
    // Navy / teal / gold particle palette matching the site theme
    const colors = ['45,212,191', '20,184,166', '251,191,36', '94,234,212'];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(58, Math.max(22, Math.floor(width / 22)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1 + Math.random() * 2.4,
        vx: (Math.random() - .5) * .32,
        vy: (Math.random() - .5) * .32,
        c: colors[Math.floor(Math.random() * colors.length)],
        a: .35 + Math.random() * .5
      }));
      if (reduced) draw(false);
    }
    function draw(move) {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (move) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;
        }
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 7);
        glow.addColorStop(0, 'rgba(' + p.c + ',' + p.a + ')');
        glow.addColorStop(1, 'rgba(' + p.c + ',0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(94,234,212,.07)';
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = dx * dx + dy * dy;
          if (dist < 15000) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      if (move) raf = requestAnimationFrame(() => draw(true));
    }
    resize();
    if (!reduced) {
      raf = requestAnimationFrame(() => draw(true));
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = null; }
        else if (!raf) raf = requestAnimationFrame(() => draw(true));
      });
    }
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        if (!reduced && !raf) raf = requestAnimationFrame(() => draw(true));
      }, 180);
    });
  })();

  /* ---------------- Misc ---------------- */
  $('#year').textContent = String(new Date().getFullYear());
})();
