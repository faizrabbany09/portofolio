/* ===============================================
   Muhammad Faiz Rabbany — Portfolio Script
   =============================================== */

'use strict';

// =============================================
// Utilities
// =============================================
const $ = (selector, ctx = document) => ctx.querySelector(selector);
const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];

// =============================================
// Navbar — scroll effect + active links
// =============================================
(function initNavbar() {
    const navbar = $('#navbar');
    const navToggle = $('#navToggle');
    const navLinks = $('#navLinks');
    const links = $$('.nav-link');

    // Scroll → add 'scrolled' class
    function onScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        // Highlight active section link
        const sections = $$('section[id]');
        let currentId = '';
        sections.forEach(section => {
            const top = section.getBoundingClientRect().top;
            if (top <= 100) currentId = section.id;
        });
        links.forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            link.classList.toggle('active', href === currentId);
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial call

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on nav-link click (mobile)
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
})();

// =============================================
// Scroll Reveal Animations
// =============================================
(function initScrollReveal() {
    const elements = $$('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const delay = parseInt(el.dataset.delay || '0', 10);
            setTimeout(() => el.classList.add('animated'), delay);
            observer.unobserve(el);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
})();

// =============================================
// Particle System (Hero section)
// =============================================
(function initParticles() {
    const container = $('#particles');
    if (!container) return;

    const PARTICLE_COUNT = 28;

    function createParticle() {
        const el = document.createElement('div');
        el.className = 'particle';

        // Random position, size, duration, horizontal drift
        const x = Math.random() * 100;
        const size = Math.random() * 2 + 1.5;
        const duration = Math.random() * 14 + 10;
        const delay = Math.random() * 10;
        const tx = (Math.random() - 0.5) * 100;
        const opacity = Math.random() * 0.4 + 0.15;

        el.style.cssText = `
      left: ${x}%;
      bottom: -10px;
      width: ${size}px;
      height: ${size}px;
      opacity: ${opacity};
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      --tx: ${tx}px;
    `;

        container.appendChild(el);
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        createParticle();
    }
})();

// =============================================
// Role Typewriter Effect
// =============================================
(function initTypewriter() {
    const roleEl = $('#roleText');
    if (!roleEl) return;

    const roles = [
        'Frontend Developer',
        'UI Enthusiast',
        'React Developer',
        'Web Creator',
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimeout;

    function type() {
        const currentRole = roles[roleIndex];
        const display = isDeleting
            ? currentRole.slice(0, charIndex - 1)
            : currentRole.slice(0, charIndex + 1);

        roleEl.textContent = display;

        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        let delay = isDeleting ? 60 : 110;

        if (!isDeleting && charIndex === currentRole.length) {
            delay = 2200; // pause at full word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 400;
        }

        typingTimeout = setTimeout(type, delay);
    }

    // Start after a brief pause
    setTimeout(type, 1500);
})();

// =============================================
// Footer Year
// =============================================
(function initFooterYear() {
    const yearEl = $('#footerYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

// =============================================
// Smooth Scroll for anchor links (fallback)
// =============================================
(function initSmoothScroll() {
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = $(href);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
})();

// =============================================
// Subtle parallax on hero image (desktop only)
// =============================================
(function initHeroParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 900) return;

    const heroImage = $('.hero-image');
    if (!heroImage) return;

    window.addEventListener('mousemove', (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;
        heroImage.style.transform = `translate(${dx * -6}px, ${dy * -4}px)`;
    }, { passive: true });
})();

// =============================================
// Stack card number counter animation
// =============================================
(function initStatCounters() {
    const stats = $$('.stat-number');
    if (!stats.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const raw = el.textContent.trim();
            const suffix = raw.replace(/[\d.]/g, '');
            const target = parseFloat(raw);
            if (isNaN(target)) return;

            let current = 0;
            const step = target / 40;
            const interval = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(interval);
                }
                el.textContent = (Number.isInteger(target) ? Math.round(current) : current.toFixed(0)) + suffix;
            }, 35);

            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    stats.forEach(el => observer.observe(el));
})();
