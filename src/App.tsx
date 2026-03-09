import { useEffect } from 'react'
import './App.css'

function App() {
  useEffect(() => {
    'use strict'

    // =============================================
    // Utilities
    // =============================================
    const $ = (selector: string, ctx: Document | Element = document) =>
      ctx.querySelector(selector)
    const $$ = (selector: string, ctx: Document | Element = document) =>
      [...ctx.querySelectorAll(selector)]

    // =============================================
    // Navbar — scroll effect + active links
    // =============================================
    const navbar = $('#navbar') as HTMLElement | null
    const navToggle = $('#navToggle') as HTMLButtonElement | null
    const navLinks = $('#navLinks') as HTMLElement | null
    const links = $$('.nav-link') as HTMLAnchorElement[]

    function onScroll() {
      if (!navbar) return
      navbar.classList.toggle('scrolled', window.scrollY > 50)

      const sections = $$('section[id]') as HTMLElement[]
      let currentId = ''
      sections.forEach(section => {
        const top = section.getBoundingClientRect().top
        if (top <= 100) currentId = section.id
      })
      links.forEach(link => {
        const href = (link.getAttribute('href') || '').replace('#', '')
        link.classList.toggle('active', href === currentId)
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const handleNavToggle = () => {
      if (!navLinks || !navToggle) return
      const isOpen = navLinks.classList.toggle('open')
      navToggle.classList.toggle('open', isOpen)
      navToggle.setAttribute('aria-expanded', String(isOpen))
      document.body.style.overflow = isOpen ? 'hidden' : ''
    }

    navToggle?.addEventListener('click', handleNavToggle)

    const navLinkClickHandlers: Array<() => void> = []
    links.forEach(link => {
      const handler = () => {
        if (!navLinks || !navToggle) return
        navLinks.classList.remove('open')
        navToggle.classList.remove('open')
        navToggle.setAttribute('aria-expanded', 'false')
        document.body.style.overflow = ''
      }
      navLinkClickHandlers.push(handler)
      link.addEventListener('click', handler)
    })

    // =============================================
    // Scroll Reveal Animations
    // =============================================
    const animateElements = $$('[data-animate]') as HTMLElement[]

    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          const delay = parseInt(el.dataset.delay || '0', 10)
          setTimeout(() => el.classList.add('animated'), delay)
          revealObserver.unobserve(el)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    animateElements.forEach(el => revealObserver.observe(el))

    // =============================================
    // Particle System (Hero section)
    // =============================================
    const particleContainer = $('#particles') as HTMLElement | null
    const createdParticles: HTMLElement[] = []

    if (particleContainer) {
      const PARTICLE_COUNT = 28
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const el = document.createElement('div')
        el.className = 'particle'
        const x = Math.random() * 100
        const size = Math.random() * 2 + 1.5
        const duration = Math.random() * 14 + 10
        const delay = Math.random() * 10
        const tx = (Math.random() - 0.5) * 100
        const opacity = Math.random() * 0.4 + 0.15
        el.style.cssText = `
          left: ${x}%;
          bottom: -10px;
          width: ${size}px;
          height: ${size}px;
          opacity: ${opacity};
          animation-duration: ${duration}s;
          animation-delay: -${delay}s;
          --tx: ${tx}px;
        `
        particleContainer.appendChild(el)
        createdParticles.push(el)
      }
    }

    // =============================================
    // Role Typewriter Effect
    // =============================================
    const roleEl = $('#roleText') as HTMLElement | null
    let typingTimeout: ReturnType<typeof setTimeout> | null = null

    if (roleEl) {
      const roles = ['Frontend Developer', 'Web Developer']
      let roleIndex = 0
      let charIndex = 0
      let isDeleting = false

      function type() {
        const currentRole = roles[roleIndex]
        const display = isDeleting
          ? currentRole.slice(0, charIndex - 1)
          : currentRole.slice(0, charIndex + 1)

        if (roleEl) roleEl.textContent = display

        if (isDeleting) charIndex--
        else charIndex++

        let delay = isDeleting ? 60 : 110

        if (!isDeleting && charIndex === currentRole.length) {
          delay = 2200
          isDeleting = true
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false
          roleIndex = (roleIndex + 1) % roles.length
          delay = 400
        }

        typingTimeout = setTimeout(type, delay)
      }

      typingTimeout = setTimeout(type, 1500)
    }

    // =============================================
    // Footer Year
    // =============================================
    const yearEl = $('#footerYear') as HTMLElement | null
    if (yearEl) yearEl.textContent = String(new Date().getFullYear())

    // =============================================
    // Smooth Scroll for anchor links (fallback)
    // =============================================
    const anchorLinks = $$('a[href^="#"]') as HTMLAnchorElement[]
    const smoothScrollHandlers: Array<(e: Event) => void> = []

    anchorLinks.forEach(anchor => {
      const handler = (e: Event) => {
        const href = anchor.getAttribute('href')
        if (!href || href === '#') return
        const target = document.querySelector(href)
        if (!target) return
        e.preventDefault()
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      smoothScrollHandlers.push(handler)
      anchor.addEventListener('click', handler)
    })

    // =============================================
    // Subtle parallax on hero image (desktop only)
    // =============================================
    let mouseMoveHandler: ((e: MouseEvent) => void) | null = null

    if (
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      window.innerWidth >= 900
    ) {
      const heroImage = $('.hero-image') as HTMLElement | null
      if (heroImage) {
        mouseMoveHandler = (e: MouseEvent) => {
          const cx = window.innerWidth / 2
          const cy = window.innerHeight / 2
          const dx = (e.clientX - cx) / cx
          const dy = (e.clientY - cy) / cy
          heroImage.style.transform = `translate(${dx * -6}px, ${dy * -4}px)`
        }
        window.addEventListener('mousemove', mouseMoveHandler, { passive: true })
      }
    }

    // =============================================
    // Cleanup on unmount
    // =============================================
    return () => {
      window.removeEventListener('scroll', onScroll)
      navToggle?.removeEventListener('click', handleNavToggle)
      links.forEach((link, i) => {
        if (navLinkClickHandlers[i]) link.removeEventListener('click', navLinkClickHandlers[i])
      })
      revealObserver.disconnect()
      createdParticles.forEach(p => p.remove())
      if (typingTimeout) clearTimeout(typingTimeout)
      anchorLinks.forEach((anchor, i) => {
        if (smoothScrollHandlers[i]) anchor.removeEventListener('click', smoothScrollHandlers[i])
      })
      if (mouseMoveHandler) window.removeEventListener('mousemove', mouseMoveHandler)
    }
  }, [])

  return <></>
}

export default App
