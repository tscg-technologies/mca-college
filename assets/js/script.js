/**
 * MCA COLLEGE WEBSITE - PREMIUM DEMO WEBSITE
 * Strict Tech Stack: Vanilla JavaScript (ES6+)
 * Features:
 * 1. Mobile Navigation Menu (Open/Close, Close on Link Click, Escape key)
 * 2. Sticky Header & Back-to-Top Button
 * 3. Active Navigation Link Highlighting
 * 4. Scroll Reveal Animations (IntersectionObserver)
 * 5. Animated Statistics Counters
 * 6. Interactive FAQ Accordion
 * 7. Student Projects Category Filtering
 * 8. Campus Life Image Lightbox Modal
 * 9. Admission Enquiry & Contact Form Frontend Validation
 * 10. Premium SVG Image Fallback Handler (if any AI image is unavailable)
 * 11. Interactive Demo Modal (for Student Portal / View Project / Event Details)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initDropdownNav();
  initStickyHeaderAndBackToTop();
  initActiveNavHighlight();
  initScrollReveal();
  initStatCounters();
  initFaqAccordion();
  initProjectFilters();
  initGalleryLightbox();
  initFormsValidation();
  initImageFallbacks();
  initDemoModals();
});

/* ==========================================================================
   1. MOBILE NAVIGATION & DROPDOWNS
   ========================================================================== */
function initMobileNav() {
  const menuToggle = document.getElementById('mobileMenuToggle');
  const mainNav = document.getElementById('mainNav');

  if (!menuToggle || !mainNav) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu after selecting an actual page link (not dropdown toggle)
  const navLinks = mainNav.querySelectorAll('a:not(.dropdown-toggle)');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (
      mainNav.classList.contains('open') &&
      !mainNav.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      mainNav.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function initDropdownNav() {
  const dropdownItems = document.querySelectorAll('.nav-item.dropdown');

  dropdownItems.forEach((item) => {
    const toggleBtn = item.querySelector('.dropdown-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', (e) => {
      // Toggle for mobile or click navigation
      const isMobile = window.innerWidth <= 1024;
      if (isMobile) {
        e.preventDefault();
        const isOpen = item.classList.toggle('open');
        toggleBtn.setAttribute('aria-expanded', String(isOpen));
      }
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    dropdownItems.forEach((item) => {
      if (!item.contains(e.target)) {
        item.classList.remove('open');
        const toggleBtn = item.querySelector('.dropdown-toggle');
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* ==========================================================================
   2. STICKY HEADER & BACK-TO-TOP BUTTON
   ========================================================================== */
function initStickyHeaderAndBackToTop() {
  const header = document.querySelector('.site-header');
  const backToTopBtn = document.getElementById('backToTop');

  const handleScroll = () => {
    const scrollY = window.scrollY;
    if (header) {
      header.classList.toggle('scrolled', scrollY > 30);
    }
    if (backToTopBtn) {
      backToTopBtn.classList.toggle('visible', scrollY > 400);
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   3. ACTIVE NAVIGATION HIGHLIGHTING
   ========================================================================== */
function initActiveNavHighlight() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-link');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      // If inside dropdown, highlight parent dropdown toggle too
      const parentDropdown = link.closest('.nav-item.dropdown');
      if (parentDropdown) {
        const parentToggle = parentDropdown.querySelector('.dropdown-toggle');
        if (parentToggle) parentToggle.classList.add('active');
      }
    }
  });
}

/* ==========================================================================
   4. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   5. ANIMATED STATISTICS COUNTERS
   ========================================================================== */
function initStatCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-counter'));
    const isDecimal = String(target).includes('.');
    const duration = 1800;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentVal = target * eased;

      el.textContent = isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = isDecimal ? target.toFixed(1) : target;
      }
    };

    requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

/* ==========================================================================
   6. INTERACTIVE FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    const answerEl = item.querySelector('.faq-answer');

    if (!questionBtn || !answerEl) return;

    // Initialize default open item if it has active class
    if (item.classList.contains('active')) {
      answerEl.style.maxHeight = answerEl.scrollHeight + 'px';
    }

    questionBtn.addEventListener('click', () => {
      const isCurrentlyActive = item.classList.contains('active');

      // Close all other FAQ items in the same container
      const parentContainer = item.closest('.faq-container') || document;
      parentContainer.querySelectorAll('.faq-item').forEach((otherItem) => {
        otherItem.classList.remove('active');
        const otherBtn = otherItem.querySelector('.faq-question');
        const otherAns = otherItem.querySelector('.faq-answer');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        if (otherAns) otherAns.style.maxHeight = null;
      });

      // Toggle clicked item
      if (!isCurrentlyActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answerEl.style.maxHeight = answerEl.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   7. STUDENT PROJECTS CATEGORY FILTERING
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedCategory = btn.getAttribute('data-filter');

      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach((card) => {
        const cardCat = card.getAttribute('data-category');
        if (selectedCategory === 'all' || cardCat === selectedCategory) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   8. CAMPUS IMAGE LIGHTBOX MODAL
   ========================================================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  if (!galleryItems.length || !lightboxModal) return;

  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const imgEl = item.querySelector('img');
      const titleEl = item.querySelector('.gallery-caption-title');
      const subEl = item.querySelector('.gallery-caption-sub');

      if (imgEl && lightboxImg) {
        lightboxImg.src = imgEl.src;
        lightboxImg.alt = imgEl.alt || 'Campus Gallery Visual';
      }
      if (titleEl && lightboxTitle) {
        lightboxTitle.textContent = titleEl.textContent;
      }
      if (subEl && lightboxDesc) {
        lightboxDesc.textContent = subEl.textContent;
      }

      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
    });
  });

  const closeLightbox = () => {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   9. ADMISSION ENQUIRY & CONTACT FORM FRONTEND VALIDATION
   ========================================================================== */
function initFormsValidation() {
  const enquiryForm = document.getElementById('admissionEnquiryForm');
  const contactForm = document.getElementById('generalContactForm');

  if (enquiryForm) {
    setupAdmissionForm(enquiryForm);
  }
  if (contactForm) {
    setupGeneralContactForm(contactForm);
  }
}

function setFieldError(inputEl, message) {
  const group = inputEl.closest('.form-group');
  inputEl.classList.add('is-invalid');
  if (group) {
    group.classList.add('has-error');
    const errEl = group.querySelector('.error-msg');
    if (errEl && message) {
      errEl.textContent = message;
    }
  }
}

function clearFieldError(inputEl) {
  const group = inputEl.closest('.form-group');
  inputEl.classList.remove('is-invalid');
  if (group) {
    group.classList.remove('has-error');
  }
}

function isValidIndianMobile(phone) {
  const cleaned = phone.replace(/[\s\-+]/g, '');
  // Accepts 10-digit Indian mobile numbers starting with 6-9 or demo 10-digit numbers
  return /^[6-9]\d{9}$/.test(cleaned) || /^\d{10}$/.test(cleaned);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function setupAdmissionForm(form) {
  const inputs = form.querySelectorAll('.form-control');
  const successAlert = document.getElementById('admissionFormSuccess');

  inputs.forEach((input) => {
    input.addEventListener('input', () => clearFieldError(input));
    input.addEventListener('change', () => clearFieldError(input));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const fullName = form.querySelector('[name="fullName"]');
    const mobile = form.querySelector('[name="mobileNumber"]');
    const email = form.querySelector('[name="emailAddress"]');
    const city = form.querySelector('[name="city"]');
    const qualification = form.querySelector('[name="qualification"]');
    const specialization = form.querySelector('[name="specialization"]');
    const percentage = form.querySelector('[name="percentage"]');
    const domain = form.querySelector('[name="learningDomain"]');

    if (fullName && fullName.value.trim().length < 2) {
      setFieldError(fullName, 'Please enter your full name (minimum 2 characters).');
      isValid = false;
    }

    if (mobile && !isValidIndianMobile(mobile.value)) {
      setFieldError(mobile, 'Please enter a valid 10-digit Indian mobile number.');
      isValid = false;
    }

    if (email && !isValidEmail(email.value)) {
      setFieldError(email, 'Please enter a valid email address (e.g., student@example.com).');
      isValid = false;
    }

    if (city && city.value.trim().length < 2) {
      setFieldError(city, 'Please enter your city name.');
      isValid = false;
    }

    if (qualification && !qualification.value.trim()) {
      setFieldError(qualification, 'Please select or enter your graduation qualification.');
      isValid = false;
    }

    if (specialization && !specialization.value.trim()) {
      setFieldError(specialization, 'Please enter your graduation stream/specialization.');
      isValid = false;
    }

    if (percentage) {
      const pctVal = parseFloat(percentage.value);
      if (isNaN(pctVal) || pctVal < 35 || pctVal > 100) {
        setFieldError(percentage, 'Please enter a valid graduation percentage between 35 and 100.');
        isValid = false;
      }
    }

    if (domain && !domain.value) {
      setFieldError(domain, 'Please select a preferred learning domain.');
      isValid = false;
    }

    if (!isValid) {
      if (successAlert) successAlert.classList.remove('show');
      return;
    }

    // Successful frontend-only demonstration submission
    form.reset();
    if (successAlert) {
      successAlert.classList.add('show');
      setTimeout(() => {
        successAlert.classList.remove('show');
      }, 8000);
    }
  });
}

function setupGeneralContactForm(form) {
  const inputs = form.querySelectorAll('.form-control');
  const successAlert = document.getElementById('contactFormSuccess');

  inputs.forEach((input) => {
    input.addEventListener('input', () => clearFieldError(input));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const name = form.querySelector('[name="contactName"]');
    const phone = form.querySelector('[name="contactPhone"]');
    const email = form.querySelector('[name="contactEmail"]');
    const subject = form.querySelector('[name="contactSubject"]');
    const message = form.querySelector('[name="contactMessage"]');

    if (name && name.value.trim().length < 2) {
      setFieldError(name, 'Please enter your full name.');
      isValid = false;
    }

    if (phone && !isValidIndianMobile(phone.value)) {
      setFieldError(phone, 'Please enter a valid 10-digit mobile number.');
      isValid = false;
    }

    if (email && !isValidEmail(email.value)) {
      setFieldError(email, 'Please enter a valid email address.');
      isValid = false;
    }

    if (subject && !subject.value.trim()) {
      setFieldError(subject, 'Please select an enquiry subject.');
      isValid = false;
    }

    if (message && message.value.trim().length < 10) {
      setFieldError(message, 'Please enter a message (minimum 10 characters).');
      isValid = false;
    }

    if (!isValid) {
      if (successAlert) successAlert.classList.remove('show');
      return;
    }

    form.reset();
    if (successAlert) {
      successAlert.classList.add('show');
      setTimeout(() => {
        successAlert.classList.remove('show');
      }, 8000);
    }
  });
}

/* ==========================================================================
   10. PREMIUM SVG PLACEHOLDER FALLBACK FOR IMAGES
   ========================================================================== */
function initImageFallbacks() {
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    const handleFallback = () => {
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = 'true';
      img.classList.add('img-fallback-active');

      const label = img.getAttribute('alt') || 'MCA Technology Campus Visual';
      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="550" viewBox="0 0 800 550">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#101D36"/>
            <stop offset="60%" stop-color="#2454A6"/>
            <stop offset="100%" stop-color="#3478F6"/>
          </linearGradient>
        </defs>
        <rect width="800" height="550" fill="url(#bg)"/>
        <g stroke="rgba(221,244,255,0.12)" stroke-width="1">
          <line x1="0" y1="110" x2="800" y2="110"/>
          <line x1="0" y1="220" x2="800" y2="220"/>
          <line x1="0" y1="330" x2="800" y2="330"/>
          <line x1="0" y1="440" x2="800" y2="440"/>
          <line x1="160" y1="0" x2="160" y2="550"/>
          <line x1="320" y1="0" x2="320" y2="550"/>
          <line x1="480" y1="0" x2="480" y2="550"/>
          <line x1="640" y1="0" x2="640" y2="550"/>
        </g>
        <circle cx="400" cy="240" r="52" fill="rgba(221,244,255,0.12)" stroke="#DDF4FF" stroke-width="2"/>
        <path d="M400 212 L432 228 L400 244 L368 228 Z M378 236 L378 254 C378 260 388 266 400 266 C412 266 422 260 422 254 L422 236" fill="none" stroke="#DDF4FF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="400" y="330" text-anchor="middle" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="20" font-weight="700">${label.replace(/[<>&"']/g, '')}</text>
        <text x="400" y="360" text-anchor="middle" fill="#DDF4FF" font-family="monospace" font-size="14">MCA COLLEGE WEBSITE - ILLUSTRATIVE DEMO VISUAL</text>
      </svg>`;

      img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString);
    };

    img.addEventListener('error', handleFallback);
    if (img.complete && img.naturalWidth === 0) {
      handleFallback();
    }
  });
}

/* ==========================================================================
   11. INTERACTIVE DEMO INFO MODAL (STUDENT PORTAL / PROJECTS / EVENTS)
   ========================================================================== */
function initDemoModals() {
  const modal = document.getElementById('demoInfoModal');
  if (!modal) return;

  const modalTitle = document.getElementById('demoModalTitle');
  const modalBody = document.getElementById('demoModalBody');
  const modalCloseBtn = document.getElementById('demoModalClose');

  document.querySelectorAll('[data-demo-modal]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const title = trigger.getAttribute('data-demo-title') || 'Demonstration Feature';
      const desc =
        trigger.getAttribute('data-demo-desc') ||
        'This interactive feature is part of the MCA College Website demonstration template. In a live institutional deployment, this connects to the respective academic module.';

      if (modalTitle) modalTitle.textContent = title;
      if (modalBody) modalBody.textContent = desc;

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}
