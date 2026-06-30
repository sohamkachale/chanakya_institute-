/**
 * Chanakya Computer Institute - Premium Project Foundation
 * Main Application JS (main.js)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Initialize Lenis Smooth Scroll
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard expo out easing
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        // Integrate Lenis scroll updates with GSAP ScrollTrigger
        lenis.on('scroll', (e) => {
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.update();
            }
        });

        // Use GSAP's ticker to drive Lenis updates
        if (typeof gsap !== 'undefined') {
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        } else {
            // Fallback requestAnimationFrame loop if GSAP isn't loaded
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }
    }

    // 3. Initialize Vanilla Tilt.js
    if (typeof VanillaTilt !== 'undefined') {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        if (tiltElements.length > 0) {
            VanillaTilt.init(tiltElements, {
                max: 15,
                speed: 400,
                glare: true,
                'max-glare': 0.2,
                perspective: 1000,
                scale: 1.02
            });
        }
    }

    // 4. Custom Cursor Tracking (low-latency using gsap.quickTo)
    initCustomCursor();

    // 5. Sticky Navbar & Back to Top interactions
    initScrollInteractions(lenis);

    // 6. Mobile Menu Drawer Toggle
    initMobileMenu();

    // 7. Hero Visual mouse parallax
    initHeroParallax();

    // Export lenis instance globally for use in other scripts
    window.lenisInstance = lenis;
    
    console.log('Chanakya Computer Institute: Core Foundation Loaded Successfully.');
});

/**
 * Custom Cursor with GSAP quickTo tracking
 */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    const dot = cursor.querySelector('.cursor-dot');
    const ring = cursor.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    // Use gsap.quickTo for high performance mouse tracking
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    
    const xToDot = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
    const yToDot = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
    const xToRing = gsap.quickTo(ring, "x", { duration: 0.3, ease: "power3.out" });
    const yToRing = gsap.quickTo(ring, "y", { duration: 0.3, ease: "power3.out" });

    // Set initial position
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    window.addEventListener('mousemove', (e) => {
        xToDot(e.clientX);
        yToDot(e.clientY);
        xToRing(e.clientX);
        yToRing(e.clientY);
    });

    // Handle Hover states
    const hoverables = document.querySelectorAll('a, button, input, select, textarea, [role="button"], .nav-link, .brand-logo, .about-glass-card, .about-dashboard-container, .course-card');
    hoverables.forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
        });
        elem.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        gsap.to(cursor, { opacity: 0, duration: 0.2 });
    });
    document.addEventListener('mouseenter', () => {
        gsap.to(cursor, { opacity: 1, duration: 0.2 });
    });
}

/**
 * Handle scroll interactions: Sticky Navbar shrink & back-to-top button show/hide
 */
function initScrollInteractions(lenisInstance) {
    const header = document.getElementById('main-nav-header');
    const backToTop = document.getElementById('back-to-top');

    // Back to top click handler
    if (backToTop && lenisInstance) {
        backToTop.addEventListener('click', () => {
            lenisInstance.scrollTo(0, {
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // standard expo out
            });
        });
    }

    // Scroll listener using GSAP ScrollTrigger to coordinate events efficiently
    if (typeof ScrollTrigger !== 'undefined') {
        // Sticky Navbar Shrink
        ScrollTrigger.create({
            start: 'top -50px',
            onEnter: () => header.classList.add('shrink'),
            onLeaveBack: () => header.classList.remove('shrink')
        });

        // Back to top button visibility threshold
        ScrollTrigger.create({
            start: 'top -400px',
            onEnter: () => backToTop.classList.add('show'),
            onLeaveBack: () => backToTop.classList.remove('show')
        });

        // Scrollspy active state on navigation links
        const sections = document.querySelectorAll('main > section');
        const navLinks = document.querySelectorAll('.nav-link');

        sections.forEach(section => {
            const id = section.getAttribute('id');
            if (!id) return;

            ScrollTrigger.create({
                trigger: section,
                start: 'top 40%',
                end: 'bottom 40%',
                onEnter: () => activateNavLink(id),
                onEnterBack: () => activateNavLink(id)
            });
        });

        function activateNavLink(id) {
            navLinks.forEach(link => {
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    } else {
        // Fallback standard scroll event if ScrollTrigger isn't loaded
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            if (scrollY > 50) {
                header.classList.add('shrink');
            } else {
                header.classList.remove('shrink');
            }

            if (scrollY > 400) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
    }
}

/**
 * Mobile Hamburger Menu and Drawer handling
 */
function initMobileMenu() {
    const toggle = document.getElementById('hamburger-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const isActive = toggle.classList.toggle('active');
        menu.classList.toggle('active', isActive);

        // Prevent body scroll when menu is active
        if (isActive) {
            document.body.style.overflow = 'hidden';
            if (window.lenisInstance) window.lenisInstance.stop();
            
            // GSAP stagger transition mobile links in
            gsap.fromTo('.mobile-nav-link', 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, ease: "power2.out", delay: 0.2 }
            );
        } else {
            document.body.style.overflow = '';
            if (window.lenisInstance) window.lenisInstance.start();
        }
    });

    // Close menu when clicking mobile links
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
            if (window.lenisInstance) window.lenisInstance.start();
        });
    });
}

/**
 * Mouse parallax effect on hero floating illustration elements
 */
function initHeroParallax() {
    const hero = document.querySelector('.hero-section');
    const elements = document.querySelectorAll('.parallax-element');
    if (!hero || elements.length === 0) return;

    window.addEventListener('mousemove', (e) => {
        // Only run parallax calculations if mouse is roughly in the top viewport segment
        if (e.clientY > window.innerHeight * 1.5) return;

        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;

        elements.forEach(elem => {
            const depth = parseFloat(elem.getAttribute('data-depth')) || 0.1;
            const x = dx * depth;
            const y = dy * depth;

            gsap.to(elem, {
                x: x,
                y: y,
                duration: 0.8,
                ease: 'power3.out',
                overwrite: 'auto'
            });
        });
    });
}


