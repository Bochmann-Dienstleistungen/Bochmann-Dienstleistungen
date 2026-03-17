/* =============================================
   FREIРАUM DIENSTLEISTUNGEN – script.js
   Funktionen:
   - Nav Scroll-Effekt
   - Mobile Menü
   - Scroll Reveal Animationen
   - Formular Feedback
   - Aktuelles Jahr im Footer
============================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ─── 1. AKTUELLES JAHR IM FOOTER ────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* ─── 2. NAVIGATION – SCROLL EFFEKT ─────── */
  const nav = document.getElementById('nav');

  function handleNavScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Einmal beim Laden prüfen


  /* ─── 3. MOBILE MENÜ ─────────────────────── */
  const burger    = document.getElementById('burger');
  const navLinks  = document.getElementById('navLinks');

  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      // Body-Scroll sperren wenn Menü offen
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Menü schließen wenn ein Link geklickt wird
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Menü schließen beim Klick außerhalb
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }


  /* ─── 4. SCROLL REVEAL ANIMATIONEN ─────── */
  // Alle Elemente mit data-reveal Attribut werden
  // beim Scrollen ins Sichtfeld animiert eingeblendet.

  const revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && revealEls.length > 0) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            // Leichte Verzögerung für gestaffelte Animation
            setTimeout(function () {
              entry.target.classList.add('revealed');
            }, i * 80); // 80ms Staffelung pro Element
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,  // 15% des Elements muss sichtbar sein
        rootMargin: '0px 0px -40px 0px' // etwas früher triggern
      }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });

  } else {
    // Fallback: alle sofort anzeigen (kein IntersectionObserver)
    revealEls.forEach(function (el) {
      el.classList.add('revealed');
    });
  }


  /* ─── 5. AKTIVER NAV-LINK BEIM SCROLLEN ─── */
  // Hebt den aktuell sichtbaren Abschnitt in der Nav hervor

  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav__links a[href^="#"]');

  function highlightActiveNav() {
    let currentId = '';
    sections.forEach(function (section) {
      const top    = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        currentId = section.getAttribute('id');
      }
    });

    navLinkEls.forEach(function (link) {
      link.style.color = '';
      const href = link.getAttribute('href').replace('#', '');
      if (href === currentId && !link.classList.contains('nav__cta')) {
        link.style.color = 'var(--gold)';
      }
    });
  }

  window.addEventListener('scroll', highlightActiveNav, { passive: true });


  /* ─── 6. KONTAKTFORMULAR – FORMSPREE ────────
  
     SETUP (einmalig, dauert 2 Minuten):
     1. Geh auf https://formspree.io
     2. Kostenlos registrieren (Free Plan reicht)
     3. "New Form" → freiraum-dienstleistungen@gmx.de eingeben
     4. Du bekommst eine ID wie "xpwzgkjb"
     5. Ersetze 'DEINE-FORMSPREE-ID' unten mit dieser ID
     6. Fertig – Anfragen landen direkt in deiner E-Mail!

  ─────────────────────────────────────────── */

  // ← HIER DEINE FORMSPREE-ID EINTRAGEN:
  var FORMSPREE_ID = 'mlgpooqw';

  const form       = document.getElementById('kontaktForm');
  const successMsg = document.getElementById('formSuccess');
  const errorMsg   = document.getElementById('formError');
  const submitBtn  = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validierung
      const name = document.getElementById('name').value.trim();
      const tel  = document.getElementById('telefon').value.trim();
      if (!name || !tel) {
        alert('Bitte füllen Sie mindestens Name und Telefon aus.');
        return;
      }

      // Button-Status
      submitBtn.textContent = 'Wird gesendet...';
      submitBtn.disabled = true;
      if (errorMsg) errorMsg.style.display = 'none';

      // Formspree AJAX
      var formData = new FormData(form);
      fetch('https://formspree.io/f/' + FORMSPREE_ID, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          if (successMsg) {
            successMsg.style.display = 'block';
            successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        } else {
          throw new Error('Fehler');
        }
      })
      .catch(function () {
        if (errorMsg) errorMsg.style.display = 'block';
      })
      .finally(function () {
        submitBtn.textContent = 'Kostenlos anfragen →';
        submitBtn.disabled = false;
      });
    });
  }


  /* ─── 7. SMOOTH SCROLL FÜR ANKER-LINKS ──── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId  = this.getAttribute('href').slice(1);
      const targetEl  = document.getElementById(targetId);

      if (targetEl) {
        e.preventDefault();
        const navH   = nav ? nav.offsetHeight : 80;
        const top    = targetEl.getBoundingClientRect().top + window.scrollY - navH - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ─── 8. PHONE CLICK TRACKING (OPTIONAL) ── */
  // Gibt eine Konsolenausgabe beim Klick auf die Telefonnummer.
  // Für Google Analytics / Tag Manager hier Events einbauen.
  document.querySelectorAll('a[href^="tel:"]').forEach(function (tel) {
    tel.addEventListener('click', function () {
      console.log('[FreiRaum] Telefon-Klick:', this.href);
      // gtag('event', 'click', { event_category: 'Contact', event_label: 'Phone' });
    });
  });

}); // Ende DOMContentLoaded
