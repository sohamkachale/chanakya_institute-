/**
 * Chanakya Computer Institute - Premium Project Foundation
 * Creative Animation JS (animation.js)
 * Powered by GSAP, ScrollTrigger, and SplitType
 */

// Register ScrollTrigger plugin with GSAP if loaded
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

document.addEventListener('DOMContentLoaded', () => {
    // Check if gsap is loaded
    if (typeof gsap === 'undefined') {
        console.warn('GSAP is not loaded. Animations will not run.');
        return;
    }

    // 1. Initialize Premium Loader (runs on load)
    initPremiumLoader();

    // 2. Initialize Scroll Progress Indicator
    initScrollProgress();

    // 3. Text Reveal Animations via SplitType
    initTextReveals();

    // 4. Reveal Elements on Scroll
    initScrollFadeIns();

    // 5. About Section ScrollTrigger animations
    initAboutAnimations();

    // 6. Courses Section ScrollTrigger animations
    initCoursesAnimations();

    // 7. Why Choose Us Section ScrollTrigger animations
    initWhyAnimations();

    // 8. Contact & Footer Section ScrollTrigger animations
    initContactAnimations();
});

/**
 * Text Reveal Animations using SplitType
 * Target elements with class `.text-split-word` or `.text-split-char`
 */
function initTextReveals() {
    if (typeof SplitType === 'undefined') {
        console.warn('SplitType is not loaded. Text reveal animations skipped.');
        return;
    }

    // Word Split Reveal (Apple/Linear style)
    const wordElements = document.querySelectorAll('.text-split-word');
    wordElements.forEach(element => {
        const text = new SplitType(element, { types: 'words, lines' });
        
        // Wrap words in an overflow-hidden parent to prevent visual bugs during transition
        text.words.forEach(word => {
            const wrapper = document.createElement('span');
            wrapper.classList.add('word-reveal');
            word.parentNode.insertBefore(wrapper, word);
            wrapper.appendChild(word);
        });

        // GSAP animate words up
        gsap.from(text.words, {
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            y: '105%',
            duration: 1.2,
            stagger: 0.05,
            ease: 'power4.out',
        });
    });

    // Character Split Reveal (Stripe/Framer Style)
    const charElements = document.querySelectorAll('.text-split-char');
    charElements.forEach(element => {
        const text = new SplitType(element, { types: 'chars' });
        
        gsap.from(text.chars, {
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.02,
            ease: 'power4.out',
        });
    });
}

/**
 * Premium scroll fade-in animations
 * Target elements with `.reveal-fade` or `.reveal-stagger`
 */
function initScrollFadeIns() {
    // Single fade/slide up
    const fadeElements = document.querySelectorAll('.reveal-fade');
    fadeElements.forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 88%',
                toggleActions: 'play none none none',
            },
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Staggered children fade/slide up
    const staggerContainers = document.querySelectorAll('.reveal-stagger-container');
    staggerContainers.forEach(container => {
        const children = container.querySelectorAll('.reveal-stagger-item');
        if (children.length > 0) {
            gsap.from(children, {
                scrollTrigger: {
                    trigger: container,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out'
            });
        }
    });
}

/**
 * Scroll Progress Bar logic
 */
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    gsap.to(progressBar, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: true
        }
    });
}

/**
 * Premium Simulated Loader Timeline
 */
function initPremiumLoader() {
    const loader = document.getElementById('loader');
    const counter = document.getElementById('loader-percentage');
    const bar = document.getElementById('loader-progress-bar');
    if (!loader || !counter || !bar) return;

    // Set initial opacity to hide flashes of content
    gsap.set('.header-glass', { yPercent: -100 });
    
    // Core loader timeline
    const count = { val: 0 };
    const tl = gsap.timeline({
        onComplete: () => {
            // Exit animation sequence
            const exitTl = gsap.timeline();
            
            // Fade out loader content
            exitTl.to('.loader-content', {
                opacity: 0,
                y: -20,
                duration: 0.6,
                ease: 'power3.in'
            });

            // Blind reveal background up
            exitTl.to(loader, {
                yPercent: -100,
                duration: 1.2,
                ease: 'power4.inOut'
            }, '-=0.2');

            // Bring header in from top
            exitTl.to('.header-glass', {
                yPercent: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.6');

            // Stagger nav links reveal
            exitTl.fromTo('.nav-link', 
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: 'power2.out' },
                '-=0.4'
            );

            // Stagger header logo/CTA entry
            exitTl.fromTo('.brand-logo',
                { opacity: 0, x: -15 },
                { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' },
                '-=0.5'
            );
            exitTl.fromTo('.btn-nav-cta',
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' },
                '-=0.4'
            );

            // Trigger premium hero section animation sequence
            exitTl.add(animateHeroElements, '-=0.3');
        }
    });

    // Animate loader elements in
    tl.to('.loader-logo', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    tl.to('.loader-percentage-container', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6');
    tl.to('.loader-progress-track', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6');

    // Simulate load percentage counting
    tl.to(count, {
        val: 100,
        duration: 2.5,
        ease: 'power2.out',
        onUpdate: () => {
            const current = Math.floor(count.val);
            counter.textContent = current.toString().padStart(2, '0');
            bar.style.width = `${current}%`;
        }
    }, '+=0.2');
}

/**
 * Premium Hero Entrance animation timeline
 */
function animateHeroElements() {
    const title = document.querySelector('.hero-title');
    const badge = document.querySelector('.hero-badge');
    const desc = document.querySelector('.hero-description');
    const actions = document.querySelector('.hero-actions');
    const computer = document.querySelector('.computer-illustration-container');
    const icons = document.querySelectorAll('.float-icon');
    const statCards = document.querySelectorAll('.stat-card');

    const heroTl = gsap.timeline();

    // Set initial custom visibility parameters
    gsap.set([badge, desc, actions, computer], { opacity: 0 });
    gsap.set(icons, { opacity: 0, scale: 0 });
    gsap.set(statCards, { opacity: 0 });

    // 1. Badge Reveal
    heroTl.fromTo(badge, 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );

    // 2. Heading SplitType Reveal
    if (typeof SplitType !== 'undefined' && title) {
        const split = new SplitType(title, { types: 'words' });
        split.words.forEach(word => {
            const wrapper = document.createElement('span');
            wrapper.className = 'word-reveal';
            word.parentNode.insertBefore(wrapper, word);
            wrapper.appendChild(word);
        });
        
        heroTl.fromTo(split.words, 
            { y: '105%' },
            { y: '0%', stagger: 0.04, duration: 1.1, ease: 'power4.out' },
            '-=0.45'
        );
    } else if (title) {
        heroTl.fromTo(title, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
            '-=0.45'
        );
    }

    // 3. Description & Actions Reveal
    heroTl.fromTo([desc, actions],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out' },
        '-=0.75'
    );

    // 4. Computer Illustration & floating icons reveal
    heroTl.fromTo(computer,
        { opacity: 0, scale: 0.94, y: 35 },
        { opacity: 1, scale: 1, y: 0, duration: 1.3, ease: 'power4.out' },
        '-=1.05'
    );
    
    if (icons.length > 0) {
        heroTl.fromTo(icons,
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, stagger: 0.08, duration: 0.7, ease: 'back.out(1.6)' },
            '-=0.85'
        );
    }

    // 5. Stat Cards reveal
    if (statCards.length > 0) {
        heroTl.fromTo(statCards,
            { opacity: 0, y: 25, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' },
            '-=0.8'
        );

        // 6. Number counting triggers
        heroTl.add(() => {
            const numbers = document.querySelectorAll('.stat-number');
            numbers.forEach(num => {
                const target = parseInt(num.getAttribute('data-target')) || 0;
                const valueObj = { val: 0 };
                gsap.to(valueObj, {
                    val: target,
                    duration: 2.2,
                    ease: 'power3.out',
                    onUpdate: () => {
                        num.textContent = Math.floor(valueObj.val).toString();
                    }
                });
            });
        }, '-=0.5');
    }
}

/**
 * About Section ScrollTrigger animations
 */
function initAboutAnimations() {
    const section = document.querySelector('.about-section');
    if (!section) return;

    const title = section.querySelector('.about-title');
    const badge = section.querySelector('.about-badge');
    const desc = section.querySelector('.about-description');
    const cards = section.querySelectorAll('.about-glass-card');
    const visual = section.querySelector('.about-dashboard-container');
    const floatCards = section.querySelectorAll('.about-floating-card');
    const highlightTitle = section.querySelector('.highlights-title');
    const highlights = section.querySelectorAll('.highlights-item');

    // Create dynamic ScrollTrigger timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none'
        }
    });

    // Set initial visibility values
    gsap.set([badge, desc, visual, highlightTitle], { opacity: 0 });
    gsap.set(floatCards, { opacity: 0, scale: 0.8 });
    gsap.set([cards, highlights], { opacity: 0 });

    // 1. Badge Reveal
    tl.fromTo(badge, 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );

    // 2. Title SplitType Reveal
    if (typeof SplitType !== 'undefined' && title) {
        const split = new SplitType(title, { types: 'words' });
        split.words.forEach(word => {
            const wrapper = document.createElement('span');
            wrapper.className = 'word-reveal';
            word.parentNode.insertBefore(wrapper, word);
            wrapper.appendChild(word);
        });
        
        tl.fromTo(split.words, 
            { y: '105%' },
            { y: '0%', stagger: 0.04, duration: 1, ease: 'power4.out' },
            '-=0.45'
        );
    } else if (title) {
        tl.fromTo(title, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
            '-=0.45'
        );
    }

    // 3. Description Fade Up
    tl.fromTo(desc,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.7'
    );

    // 4. Mission & Vision Cards reveal
    if (cards.length > 0) {
        tl.fromTo(cards,
            { opacity: 0, y: 25, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.8, ease: 'power3.out' },
            '-=0.65'
        );
    }

    // 5. Highlights Header & Items reveal
    tl.fromTo(highlightTitle,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.6'
    );
    if (highlights.length > 0) {
        tl.fromTo(highlights,
            { opacity: 0, x: -15 },
            { opacity: 1, x: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out' },
            '-=0.45'
        );
    }

    // 6. Left Visual Dashboard and Floating Cards reveal
    tl.fromTo(visual,
        { opacity: 0, scale: 0.94, y: 35 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power4.out' },
        '-=1.8'
    );
    if (floatCards.length > 0) {
        tl.fromTo(floatCards,
            { opacity: 0, scale: 0.8, y: 20 },
            { opacity: 1, scale: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'back.out(1.5)' },
            '-=0.85'
        );
    }
}

/**
 * Courses Section ScrollTrigger animations
 */
function initCoursesAnimations() {
    const section = document.querySelector('.courses-section');
    if (!section) return;

    const title = section.querySelector('.courses-title');
    const badge = section.querySelector('.courses-badge');
    const subtitle = section.querySelector('.courses-subtitle');
    const cards = section.querySelectorAll('.course-card');

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none'
        }
    });

    gsap.set([badge, subtitle], { opacity: 0 });
    gsap.set(cards, { opacity: 0 });

    // 1. Badge Reveal
    tl.fromTo(badge,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );

    // 2. Title SplitType Reveal
    if (typeof SplitType !== 'undefined' && title) {
        const split = new SplitType(title, { types: 'words' });
        split.words.forEach(word => {
            const wrapper = document.createElement('span');
            wrapper.className = 'word-reveal';
            word.parentNode.insertBefore(wrapper, word);
            wrapper.appendChild(word);
        });
        
        tl.fromTo(split.words,
            { y: '105%' },
            { y: '0%', stagger: 0.04, duration: 1, ease: 'power4.out' },
            '-=0.45'
        );
    } else if (title) {
        tl.fromTo(title,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
            '-=0.45'
        );
    }

    // 3. Subtitle Reveal
    tl.fromTo(subtitle,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.7'
    );

    // 4. Staggered Course Cards reveal
    if (cards.length > 0) {
        tl.fromTo(cards,
            { opacity: 0, y: 40, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.9, ease: 'power3.out' },
            '-=0.75'
        );
    }
}

/**
 * Why Choose Us Section ScrollTrigger animations
 */
function initWhyAnimations() {
    const section = document.querySelector('.why-choose-us-section');
    if (!section) return;

    const title = section.querySelector('.why-title');
    const badge = section.querySelector('.why-badge');
    const subtitle = section.querySelector('.why-subtitle');
    const cards = section.querySelectorAll('.why-card');

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none'
        }
    });

    gsap.set([badge, subtitle], { opacity: 0 });
    gsap.set(cards, { opacity: 0 });

    // 1. Badge Reveal
    tl.fromTo(badge,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );

    // 2. Title SplitType Reveal
    if (typeof SplitType !== 'undefined' && title) {
        const split = new SplitType(title, { types: 'words' });
        split.words.forEach(word => {
            const wrapper = document.createElement('span');
            wrapper.className = 'word-reveal';
            word.parentNode.insertBefore(wrapper, word);
            wrapper.appendChild(word);
        });
        
        tl.fromTo(split.words,
            { y: '105%' },
            { y: '0%', stagger: 0.04, duration: 1, ease: 'power4.out' },
            '-=0.45'
        );
    } else if (title) {
        tl.fromTo(title,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
            '-=0.45'
        );
    }

    // 3. Subtitle Reveal
    tl.fromTo(subtitle,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.7'
    );

    // 4. Staggered Feature Cards reveal
    if (cards.length > 0) {
        tl.fromTo(cards,
            { opacity: 0, y: 35, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.8, ease: 'power3.out' },
            '-=0.75'
        );

        // 5. Staggered micro-icon scale details
        tl.fromTo(section.querySelectorAll('.why-icon-container'),
            { scale: 0.7, opacity: 0 },
            { scale: 1, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'back.out(1.5)' },
            '-=0.6'
        );
    }
}

/**
 * Contact & Footer Section ScrollTrigger animations
 */
function initContactAnimations() {
    const section = document.querySelector('.contact-section');
    if (!section) return;

    const title = section.querySelector('.contact-title');
    const badge = section.querySelector('.contact-badge');
    const subtitle = section.querySelector('.contact-subtitle');
    const items = section.querySelectorAll('.contact-item');
    const map = section.querySelector('.contact-map-container');
    const socials = section.querySelectorAll('.social-btn');
    const formCard = section.querySelector('.contact-form-card');

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none'
        }
    });

    gsap.set([badge, subtitle, map, formCard], { opacity: 0 });
    gsap.set(items, { opacity: 0 });
    gsap.set(socials, { opacity: 0 });

    // 1. Badge Reveal
    tl.fromTo(badge,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );

    // 2. Title SplitType Reveal
    if (typeof SplitType !== 'undefined' && title) {
        const split = new SplitType(title, { types: 'words' });
        split.words.forEach(word => {
            const wrapper = document.createElement('span');
            wrapper.className = 'word-reveal';
            word.parentNode.insertBefore(wrapper, word);
            wrapper.appendChild(word);
        });
        
        tl.fromTo(split.words,
            { y: '105%' },
            { y: '0%', stagger: 0.04, duration: 1, ease: 'power4.out' },
            '-=0.45'
        );
    } else if (title) {
        tl.fromTo(title,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
            '-=0.45'
        );
    }

    // 3. Subtitle Reveal
    tl.fromTo(subtitle,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.7'
    );

    // 4. Staggered contact items fade in
    if (items.length > 0) {
        tl.fromTo(items,
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, stagger: 0.1, duration: 0.7, ease: 'power2.out' },
            '-=0.6'
        );
    }

    // 5. Map container scale in
    if (map) {
        tl.fromTo(map,
            { opacity: 0, scale: 0.95, y: 15 },
            { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'power3.out' },
            '-=0.55'
        );
    }

    // 6. Social buttons entry
    if (socials.length > 0) {
        tl.fromTo(socials,
            { opacity: 0, scale: 0.7 },
            { opacity: 1, scale: 1, stagger: 0.08, duration: 0.5, ease: 'back.out(1.5)' },
            '-=0.4'
        );
    }

    // 7. Right form card slide in
    if (formCard) {
        tl.fromTo(formCard,
            { opacity: 0, x: 50, scale: 0.98 },
            { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: 'power3.out' },
            '-=1.2'
        );
    }

    // 8. Footer Columns stagger reveal
    const footer = document.querySelector('.footer-section');
    if (footer) {
        gsap.fromTo(footer.querySelectorAll('.footer-col'),
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: footer,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
}






