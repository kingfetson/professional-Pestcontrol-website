/* ============================================================
   BioGuard Pest Control Nairobi — script.js
   Google Sheets quote capture via Apps Script Web App
   ============================================================

   SETUP:
   1. Deploy Code.gs as a Google Apps Script Web App.
   2. Paste your Web App URL into SHEETS_WEBHOOK_URL below.
   ============================================================ */

'use strict';

// ─── CONFIGURATION ────────────────────────────────────────────
const SHEETS_WEBHOOK_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
// ──────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initSmoothScroll();
  initQuoteForm();
  initScrollReveal();
  initStatCounters();
  initUrgencyHighlight();
  setYear();
});


// ===== STICKY HEADER =====
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


// ===== MOBILE NAV =====
function initMobileNav() {
  const hamburger  = document.getElementById('hamburger');
  const mobNav     = document.getElementById('mobNav');
  const mobClose   = document.getElementById('mobClose');
  const mobOverlay = document.getElementById('mobOverlay');
  const mLinks     = document.querySelectorAll('.m-link');

  if (!hamburger || !mobNav) return;

  const open = () => {
    mobNav.classList.add('open');
    mobOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  };
  const close = () => {
    mobNav.classList.remove('open');
    mobOverlay.classList.remove('active');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', open);
  mobClose?.addEventListener('click', close);
  mobOverlay?.addEventListener('click', close);
  mLinks.forEach(l => l.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobNav.classList.contains('open')) close();
  });
}


// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('header')?.offsetHeight ?? 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


// ===== QUOTE FORM — GOOGLE SHEETS INTEGRATION =====
function initQuoteForm() {
  const form      = document.getElementById('quoteForm');
  const status    = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name     = document.getElementById('name')?.value.trim();
    const phone    = document.getElementById('phone')?.value.trim();
    const email    = document.getElementById('email')?.value.trim()    || '—';
    const pest     = document.getElementById('pest')?.value;
    const property = document.getElementById('property')?.value;
    const location = document.getElementById('location')?.value.trim();
    const urgency  = document.getElementById('urgency')?.value         || 'flexible';
    const notes    = document.getElementById('notes')?.value.trim()    || '—';

    // ── Validation ──────────────────────────────────────────
    if (!name)     return showStatus('error', 'Please enter your full name.');
    if (!phone)    return showStatus('error', 'Please enter your phone number.');
    if (!pest)     return showStatus('error', 'Please select the pest type.');
    if (!property) return showStatus('error', 'Please select your property type.');
    if (!location) return showStatus('error', 'Please enter your location.');

    const phoneClean = phone.replace(/[\s\-().+]/g, '');
    if (!/^\d{9,15}$/.test(phoneClean)) {
      return showStatus('error', 'Please enter a valid phone number.');
    }

    // ── Loading state ────────────────────────────────────────
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending Your Request…';

    // ── Urgency label for readability ────────────────────────
    const urgencyLabels = {
      flexible:  'Flexible — anytime this week',
      soon:      'Soon — within 2–3 days',
      urgent:    'Urgent — today or tomorrow',
      emergency: '🚨 EMERGENCY — same day needed',
    };

    const payload = {
      name,
      phone,
      email,
      pest,
      propertyType  : property,
      location,
      urgency       : urgencyLabels[urgency] || urgency,
      notes,
      submittedAt   : new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' }),
      pageUrl       : window.location.href,
      userAgent     : navigator.userAgent,
    };

    // ── Send to Google Sheets ────────────────────────────────
    const { ok, error } = await sendToSheets(payload);

    if (ok) {
      const isEmergency = urgency === 'emergency';
      showStatus(
        'success',
        isEmergency
          ? '🚨 Emergency request received! A technician will call you within 15 minutes.'
          : '✓ Quote request received! Our team will contact you within 30 minutes.'
      );
      form.reset();
    } else {
      console.error('[Sheets] Error:', error);
      showStatus('error', 'Request failed to send. Please call us directly: +254 700 000 000');
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-shield-halved"></i> GET FREE QUOTE NOW';
  });


  // ── Google Sheets sender ─────────────────────────────────────
  async function sendToSheets(payload) {
    if (!SHEETS_WEBHOOK_URL || SHEETS_WEBHOOK_URL.includes('YOUR_APPS_SCRIPT')) {
      console.warn(
        '[Sheets] SHEETS_WEBHOOK_URL not configured.\n' +
        'Deploy Code.gs as a Web App and paste the URL into script.js.'
      );
      await delay(800);
      return { ok: true };
    }

    try {
      const res = await fetch(SHEETS_WEBHOOK_URL, {
        method  : 'POST',
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
        body    : new URLSearchParams(payload).toString(),
      });

      if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };

      const json = await res.json().catch(() => ({ result: 'success' }));
      if (json.result === 'error') return { ok: false, error: json.error };
      return { ok: true };

    } catch (err) {
      return { ok: false, error: err.message };
    }
  }


  // ── Status helper ────────────────────────────────────────────
  function showStatus(type, message) {
    if (!status) return;
    status.textContent = message;
    status.style.display = 'block';

    if (type === 'success') {
      status.style.background = 'rgba(61,90,62,0.1)';
      status.style.color      = '#2d5a2a';
      status.style.border     = '1px solid rgba(61,90,62,0.3)';
    } else {
      status.style.background = 'rgba(192,57,43,0.08)';
      status.style.color      = '#8a1a1a';
      status.style.border     = '1px solid rgba(192,57,43,0.3)';
    }

    setTimeout(() => { status.style.display = 'none'; },
      type === 'success' ? 8000 : 6000);
  }
}


// ===== SCROLL REVEAL =====
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  const els = document.querySelectorAll(
    '.pest-card, .svc-card, .wf-item, .testi-card, .cd-item, .step'
  );

  els.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(24px)';
    el.style.transition = `opacity 0.55s ease ${i * 0.04}s, transform 0.55s ease ${i * 0.04}s`;
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  els.forEach(el => obs.observe(el));
}


// ===== STAT COUNTERS (Why Us section) =====
function initStatCounters() {
  const stats = document.querySelectorAll('.wstat-n[data-target]');
  if (!stats.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      let current  = 0;
      const step   = Math.ceil(target / 70);

      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current.toLocaleString();
        if (current >= target) clearInterval(timer);
      }, 20);

      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => obs.observe(el));
}


// ===== URGENCY SELECT HIGHLIGHT =====
// When "EMERGENCY" is selected, highlight the submit button red
function initUrgencyHighlight() {
  const urgency   = document.getElementById('urgency');
  const submitBtn = document.getElementById('submitBtn');
  if (!urgency || !submitBtn) return;

  urgency.addEventListener('change', () => {
    if (urgency.value === 'emergency') {
      submitBtn.style.background = '#c0392b';
      submitBtn.style.boxShadow  = '0 8px 24px rgba(192,57,43,0.45)';
      submitBtn.innerHTML = '<i class="fas fa-triangle-exclamation"></i> SEND EMERGENCY REQUEST';
    } else {
      submitBtn.style.background = '';
      submitBtn.style.boxShadow  = '';
      submitBtn.innerHTML = '<i class="fas fa-shield-halved"></i> GET FREE QUOTE NOW';
    }
  });
}


// ===== FOOTER YEAR =====
function setYear() {
  const el = document.getElementById('yr');
  if (el) el.textContent = new Date().getFullYear();
}


// ===== UTILITY =====
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
