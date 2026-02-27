(function () {
  const body = document.body;
  const focusableSel = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

  function lockScroll(lock) {
    body.style.overflow = lock ? 'hidden' : '';
  }

  function trapFocus(container, e) {
    if (e.key !== 'Tab') return;
    const items = [...container.querySelectorAll(focusableSel)].filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const langWraps = document.querySelectorAll('.lang-wrap');
  langWraps.forEach((wrap) => {
    const btn = wrap.querySelector('.lang-pill');
    btn && btn.addEventListener('click', () => {
      langWraps.forEach((w) => { if (w !== wrap) w.classList.remove('open'); });
      wrap.classList.toggle('open');
    });
  });
  document.addEventListener('click', (e) => {
    langWraps.forEach((wrap) => { if (!wrap.contains(e.target)) wrap.classList.remove('open'); });
  });

  const drawer = document.querySelector('.drawer');
  const drawerOpenBtn = document.querySelector('.burger');
  const drawerCloseBtn = document.querySelector('.drawer-close');
  const overlay = document.querySelector('.drawer-overlay');
  let drawerOpen = false;

  function openDrawer() {
    if (!drawer || !overlay) return;
    drawerOpen = true;
    drawer.classList.add('open');
    overlay.classList.add('open');
    lockScroll(true);
    (drawer.querySelector('a,button') || drawer).focus();
  }

  function closeDrawer() {
    if (!drawer || !overlay) return;
    drawerOpen = false;
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    lockScroll(false);
    drawerOpenBtn && drawerOpenBtn.focus();
  }

  drawerOpenBtn && drawerOpenBtn.addEventListener('click', openDrawer);
  drawerCloseBtn && drawerCloseBtn.addEventListener('click', closeDrawer);
  overlay && overlay.addEventListener('click', closeDrawer);

  const privacyModal = document.getElementById('privacy-modal');
  const modalOpeners = document.querySelectorAll('[data-open-privacy]');
  const modalCloseBtns = privacyModal ? privacyModal.querySelectorAll('[data-close-privacy]') : [];
  let modalOpen = false;

  function openModal() {
    if (!privacyModal) return;
    modalOpen = true;
    privacyModal.classList.add('open');
    lockScroll(true);
    (privacyModal.querySelector('button, a') || privacyModal).focus();
  }

  function closeModal() {
    if (!privacyModal) return;
    modalOpen = false;
    privacyModal.classList.remove('open');
    lockScroll(false);
  }

  modalOpeners.forEach((el) => el.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));
  modalCloseBtns.forEach((el) => el.addEventListener('click', closeModal));
  privacyModal && privacyModal.addEventListener('click', (e) => {
    if (e.target === privacyModal) closeModal();
  });

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const btn = item.querySelector('button');
    btn && btn.addEventListener('click', () => {
      faqItems.forEach((x) => x.classList.remove('open'));
      item.classList.add('open');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (drawerOpen) closeDrawer();
      if (modalOpen) closeModal();
      langWraps.forEach((w) => w.classList.remove('open'));
    }
    if (drawerOpen && drawer) trapFocus(drawer, e);
    if (modalOpen && privacyModal) trapFocus(privacyModal, e);
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.opacity = '1';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  document.querySelectorAll('.section .panel, .section .kpi-card, .section .review').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'transform .35s ease, opacity .35s ease';
    io.observe(el);
  });
})();
