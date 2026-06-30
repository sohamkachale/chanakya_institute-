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

    // 8. Dynamic syllabus drawer setup
    initSyllabusDrawer();

    // 9. Contact form validation and success notifications
    initContactForm();

    // 10. Floating Admissions widget & Quick Contact interactions
    initFloatingWidgets();

    // 11. Glassmorphic Enquiry Modal validation and triggers
    initEnquiryModal();

    // 12. Magnetic CTA Buttons
    initMagneticButtons();

    // 13. Initialize Contact Lottie Animation
    initContactLottie();

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
    const hoverables = document.querySelectorAll('a, button, input, select, textarea, [role="button"], .nav-link, .brand-logo, .about-glass-card, .about-dashboard-container, .course-card, .why-card, .contact-form-card, .contact-map-container, .social-btn');
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
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            if (lenisInstance) {
                lenisInstance.scrollTo(0, {
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // standard expo out
                });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
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
        if (backToTop) {
            const toggleBackToTop = (y) => {
                if (y > 400) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
            };
            if (lenisInstance) {
                lenisInstance.on('scroll', (e) => toggleBackToTop(e.scroll));
            } else {
                window.addEventListener('scroll', () => toggleBackToTop(window.scrollY));
            }
        }

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

// Syllabus Modules Mock Data for Course cards
const SYLLABUS_DATA = {
    "Full-Stack Web Engineering": [
        { module: "Module 1: Frontend Foundations", topics: ["Semantic HTML5 & CSS3 Architecture", "Modern CSS Layouts (Grid, Flexbox)", "Responsive & Fluid Design Systems"] },
        { module: "Module 2: Advanced JS & Compilers", topics: ["ES6+ Modern Javascript specifications", "Asynchronous Programming & Fetch APIs", "Toolchains (Vite, Webpack, npm)"] },
        { module: "Module 3: Server Engineering", topics: ["Node.js runtime & Express servers", "Restful API design guidelines", "Middleware, routing, and controllers"] },
        { module: "Module 4: Database Systems & Cloud", topics: ["SQL (PostgreSQL) & NoSQL (MongoDB)", "ORM & Query Performance optimization", "Deployment on Vercel, Netlify, Render"] }
    ],
    "Advanced UI/UX & Creative Design": [
        { module: "Module 1: UX Research & Scopes", topics: ["User personas & empathy mapping", "User flows & wireframing systems", "Information Architecture (IA) design"] },
        { module: "Module 2: UI Design Principles", topics: ["Visual hierarchy & typography guides", "Color theories & components library", "Design Systems in Figma"] },
        { module: "Module 3: Prototyping & Interactions", topics: ["High-fidelity micro-interactions", "Usability testing & product validation", "Developer handoff & documentation"] },
        { module: "Module 4: No-Code Development", topics: ["Framer layouts & responsive layouts", "Webflow client websites execution", "Portfolio project optimization"] }
    ],
    "Data Science & Neural Systems": [
        { module: "Module 1: Mathematical Foundations", topics: ["Linear algebra & vector calculus", "Probability & statistical modeling", "Data cleanup using Pandas/NumPy"] },
        { module: "Module 2: Machine Learning Paths", topics: ["Supervised vs Unsupervised modeling", "Regression, decision trees, clustering", "Scikit-Learn implementation steps"] },
        { module: "Module 3: Deep Learning & Neural", topics: ["Artificial Neural Networks (ANN)", "Convolutional Neural Networks (CNN)", "Introduction to TensorFlow/Keras"] },
        { module: "Module 4: Big Data Pipelines", topics: ["SQL querying & MongoDB pipelines", "Data visualization with Matplotlib", "Model deployment as REST APIs"] }
    ],
    "Cloud Computing & Cyber Defence": [
        { module: "Module 1: Computer Networks", topics: ["TCP/IP protocols, DNS, subnets", "Network packet analysis (Wireshark)", "Routing configurations"] },
        { module: "Module 2: Cybersecurity Core", topics: ["Cryptography (AES, RSA, hashing)", "OWASP Top 10 vulnerabilities", "Penetration testing & Kali Linux"] },
        { module: "Module 3: Cloud Architectures", topics: ["AWS/Azure cloud instances", "Serverless systems (Lambda, S3)", "Containerization using Docker"] },
        { module: "Module 4: DevSecOps & Audit", topics: ["CI/CD secure deployment pipelines", "Access control & Identity (IAM)", "Security compliance and audits"] }
    ]
};

/**
 * Handle dynamic syllabus drawer popup and dynamic timeline animations
 */
function initSyllabusDrawer() {
    const drawer = document.getElementById('syllabus-drawer');
    const overlay = document.getElementById('syllabus-drawer-overlay');
    const closeBtn = document.getElementById('syllabus-drawer-close');
    const drawerTitle = document.getElementById('drawer-course-title');
    const drawerBody = document.getElementById('syllabus-drawer-body');
    const buttons = document.querySelectorAll('.btn-course-cta');

    if (!drawer || !overlay || !closeBtn || !drawerTitle || !drawerBody || buttons.length === 0) return;

    // Helper to open drawer
    const openDrawer = (courseName) => {
        const syllabus = SYLLABUS_DATA[courseName] || [];
        
        // Update Title
        drawerTitle.textContent = courseName;
        
        // Populate Syllabus Cards
        drawerBody.innerHTML = '';
        syllabus.forEach((mod) => {
            const card = document.createElement('div');
            card.className = 'syllabus-module-card';
            
            // Build Topics HTML
            let topicsHTML = '<ul class="module-topics-list">';
            mod.topics.forEach(topic => {
                topicsHTML += `
                    <li class="module-topic-item">
                        <span class="topic-dot"></span>
                        <span>${topic}</span>
                    </li>
                `;
            });
            topicsHTML += '</ul>';

            card.innerHTML = `
                <h4 class="module-title">${mod.module}</h4>
                ${topicsHTML}
            `;
            drawerBody.appendChild(card);
        });

        // Trigger Lucide to render icon elements
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Open transition
        overlay.classList.add('active');
        drawer.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (window.lenisInstance) window.lenisInstance.stop();

        // GSAP animate modules entry
        gsap.fromTo('.syllabus-module-card',
            { opacity: 0, x: 30 },
            { opacity: 1, x: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out', delay: 0.15 }
        );
    };

    // Helper to close drawer
    const closeDrawer = () => {
        overlay.classList.remove('active');
        drawer.classList.remove('active');
        document.body.style.overflow = '';
        if (window.lenisInstance) window.lenisInstance.start();
    };

    // Attach click events to syllabus buttons
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Find parent course title
            const card = btn.closest('.course-card');
            if (card) {
                const titleElement = card.querySelector('.course-card-title');
                if (titleElement) {
                    const titleText = titleElement.textContent.trim();
                    openDrawer(titleText);
                }
            }
        });
    });

    // Close actions
    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);
}

/**
 * Handle contact form client-side validation and premium success notification toasts
 */
function initContactForm() {
    const form = document.getElementById('institute-contact-form');
    if (!form) return;

    const fields = form.querySelectorAll('input, select, textarea');

    // Create success toast structure dynamically to keep HTML clean
    let toast = document.getElementById('success-toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'success-toast-notification';
        toast.className = 'success-toast';
        toast.innerHTML = `
            <span class="toast-icon">
                <i data-lucide="check-circle-2" style="width: 20px; height: 20px; color: #10b981;"></i>
            </span>
            <span>Thank you! Inquiry submitted successfully.</span>
        `;
        document.body.appendChild(toast);
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Helper to validate email addresses
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    // Helper to show/hide errors
    const toggleFieldError = (field, isError) => {
        const group = field.closest('.form-group');
        if (group) {
            if (isError) {
                group.classList.add('error');
            } else {
                group.classList.remove('error');
            }
        }
    };

    // Input/change listeners to clear errors on the fly
    fields.forEach(field => {
        ['input', 'change', 'blur'].forEach(eventType => {
            field.addEventListener(eventType, () => {
                if (field.value.trim() !== '') {
                    if (field.type === 'email') {
                        if (validateEmail(field.value.trim())) {
                            toggleFieldError(field, false);
                        }
                    } else {
                        toggleFieldError(field, false);
                    }
                }
            });
        });
    });

    // Handle Form Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let hasErrors = false;

        fields.forEach(field => {
            const val = field.value.trim();
            if (val === '') {
                toggleFieldError(field, true);
                hasErrors = true;
            } else if (field.type === 'email' && !validateEmail(val)) {
                toggleFieldError(field, true);
                hasErrors = true;
            } else {
                toggleFieldError(field, false);
            }
        });

        if (!hasErrors) {
            // Success! Trigger submit loading state or directly dynamic toast notification
            const submitBtn = form.querySelector('.form-submit-btn');
            const originalHTML = submitBtn.innerHTML;

            // Submit Button Staged Animation
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending Inquiries...';

            setTimeout(() => {
                // Reset form values
                form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;

                // Open Success Toast
                toast.classList.add('active');

                // Animate toast entry/exit
                setTimeout(() => {
                    toast.classList.remove('active');
                }, 4000);
            }, 1200);
        }
    });
}

/**
 * Initialize Admissions & Quick Contact floating widgets
 */
function initFloatingWidgets() {
    const admissionsWidget = document.getElementById('admissions-widget');
    if (!admissionsWidget) return;

    // Hover interactions for desktop expansion
    admissionsWidget.addEventListener('mouseenter', () => {
        admissionsWidget.classList.remove('collapsed');
    });

    admissionsWidget.addEventListener('mouseleave', () => {
        admissionsWidget.classList.add('collapsed');
    });

    // Mobile click behavior (chevron click to expand/collapse)
    const header = admissionsWidget.querySelector('.widget-header');
    if (header) {
        header.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 || admissionsWidget.classList.contains('collapsed')) {
                admissionsWidget.classList.toggle('collapsed');
            }
        });
    }
}

/**
 * Initialize Glassmorphic Enquiry Modal overlay & popup triggers
 */
function initEnquiryModal() {
    const modal = document.getElementById('enquiry-modal-overlay');
    if (!modal) return;

    const closeBtn = document.getElementById('enquiry-modal-close');
    const cancelBtn = document.getElementById('enquiry-modal-cancel');
    const form = document.getElementById('modal-enquiry-form');
    const successToast = document.getElementById('success-toast');

    // Find all Enquiry trigger buttons
    const triggerButtons = document.querySelectorAll('.trigger-enquiry, .btn-hero-primary, .btn-nav-cta, .mobile-drawer-cta button');

    function openModal() {
        modal.classList.add('show');
        if (window.lenisInstance) {
            window.lenisInstance.stop(); // Lock scroll
        }
        
        // GSAP animate card entrance
        gsap.fromTo('.enquiry-modal-card', 
            { y: 30, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
        );
    }

    function closeModal() {
        gsap.to('.enquiry-modal-card', {
            y: 20,
            opacity: 0,
            scale: 0.95,
            duration: 0.3,
            ease: 'power3.in',
            onComplete: () => {
                modal.classList.remove('show');
                if (window.lenisInstance) {
                    window.lenisInstance.start(); // Unlock scroll
                }
            }
        });
    }

    triggerButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    
    // Close on overlay backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // 15-second delayed popup trigger (only once per session)
    if (!sessionStorage.getItem('enquiry_popup_seen')) {
        setTimeout(() => {
            if (!modal.classList.contains('show')) {
                openModal();
                sessionStorage.setItem('enquiry_popup_seen', 'true');
            }
        }, 15000);
    }

    // Modal Form Validation & Submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('modal-name');
            const email = document.getElementById('modal-email');
            const phone = document.getElementById('modal-phone');
            const course = document.getElementById('modal-course');
            const message = document.getElementById('modal-message');

            let hasErrors = false;

            function validateEmail(val) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(String(val).toLowerCase());
            }

            function toggleFieldError(field, hasError) {
                const group = field.closest('.form-group');
                if (group) {
                    if (hasError) {
                        group.classList.add('error');
                    } else {
                        group.classList.remove('error');
                    }
                }
            }

            const fields = [name, email, phone, course, message];
            fields.forEach(field => {
                if (!field) return;
                const val = field.value.trim();
                if (val === '') {
                    toggleFieldError(field, true);
                    hasErrors = true;
                } else if (field.id === 'modal-email' && !validateEmail(val)) {
                    toggleFieldError(field, true);
                    hasErrors = true;
                } else {
                    toggleFieldError(field, false);
                }
            });

            if (!hasErrors) {
                const submitBtn = form.querySelector('.modal-submit-btn');
                const originalHTML = submitBtn.innerHTML;

                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Sending Inquiries...';

                setTimeout(() => {
                    form.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;

                    closeModal();

                    if (successToast) {
                        successToast.classList.add('active');
                        setTimeout(() => {
                            successToast.classList.remove('active');
                        }, 4000);
                    }
                }, 1200);
            }
        });
    }
}

/**
 * Initialize Magnetic Buttons with GSAP physics
 */
function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .contact-bar-btn, .social-btn, .mobile-sticky-item');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width/2;
            const y = e.clientY - rect.top - rect.height/2;
            
            gsap.to(btn, {
                x: x * 0.35,
                y: y * 0.35,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

/**
 * Initialize Lottie Map routing animation in contact details column
 */
function initContactLottie() {
    const container = document.getElementById('lottie-contact-map');
    if (!container || typeof lottie === 'undefined') return;

    lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/lottie/Map Routing.json'
    });
}




