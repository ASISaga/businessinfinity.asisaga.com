/**
 * Business Infinity - The Invitation Website JavaScript
 * Scroll-triggered animations, parallax effects, and interactive features
 */

class BusinessInfinityWebsite {
    constructor() {
        this.init();
    }

    init() {
        // Initialize on DOM loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onReady());
        } else {
            this.onReady();
        }
    }

    onReady() {
        this.setupScrollAnimations();
        this.setupParallaxEffects();
        this.setupNavigationInteractions();
        this.setupAccessibility();
        this.setupLazyLoading();
        
        this.observer = this.createIntersectionObserver();
        this.observeElements();
        this.setupMobileNavigation();
    }

    setupScrollAnimations() {
        // Placeholder for scroll animations setup
    }

    // Intersection Observer for scroll-triggered animations
    createIntersectionObserver() {
        return new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    
                    // Trigger specific animations based on section
                    const section = entry.target.closest('.bi-section');
                    if (section) {
                        this.triggerSectionAnimation(section);
                    }
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -10% 0px'
        });
    }

    observeElements() {
        // Observe all section content for fade-in animations
        const elements = document.querySelectorAll(`
            .section-content,
            .pain-item,
            .agent-seat,
            .panel-item,
            .highlight-dot
        `);
        
        elements.forEach(el => this.observer.observe(el));
    }

    triggerSectionAnimation(section) {
        const sectionId = section.id;
        
        switch(sectionId) {
            case 'pain-points':
                this.animatePainPoints();
                break;
            case 'boardroom':
                this.animateBoardroom();
                break;
            case 'day-one':
                this.animateActionPanels();
                break;
            case 'six-months':
                this.animateGrowthMap();
                break;
        }
    }

    animatePainPoints() {
        const painItems = document.querySelectorAll('.pain-item');
        painItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-50px)';
                item.style.transition = 'all 0.6s ease-out';
                
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, 100);
            }, index * 200);
        });

        // Animate diagram arrows
        const arrows = document.querySelectorAll('.arrow-item');
        arrows.forEach((arrow, index) => {
            setTimeout(() => {
                arrow.style.opacity = '0';
                arrow.style.transform += ' scale(0)';
                arrow.style.transition = 'all 0.5s ease-out';
                
                setTimeout(() => {
                    arrow.style.opacity = '1';
                    arrow.style.transform = arrow.style.transform.replace('scale(0)', 'scale(1)');
                }, 100);
            }, (index + 3) * 300);
        });
    }

    animateBoardroom() {
        const agentSeats = document.querySelectorAll('.agent-seat');
        agentSeats.forEach((seat, index) => {
            setTimeout(() => {
                seat.style.opacity = '0';
                seat.style.transform += ' scale(0)';
                seat.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                
                setTimeout(() => {
                    seat.style.opacity = '1';
                    seat.style.transform = seat.style.transform.replace('scale(0)', 'scale(1)');
                }, 100);
            }, index * 150);
        });
    }

    animateActionPanels() {
        const panels = document.querySelectorAll('.panel-item');
        panels.forEach((panel, index) => {
            setTimeout(() => {
                panel.style.opacity = '0';
                panel.style.transform = 'translateY(50px) scale(0.8)';
                panel.style.transition = 'all 0.6s ease-out';
                
                setTimeout(() => {
                    panel.style.opacity = '1';
                    panel.style.transform = 'translateY(0) scale(1)';
                }, 100);
            }, index * 200);
        });
    }

    animateGrowthMap() {
        const highlights = document.querySelectorAll('.highlight-dot');
        highlights.forEach((dot, index) => {
            setTimeout(() => {
                dot.style.opacity = '0';
                dot.style.transform = 'scale(0)';
                dot.style.transition = 'all 0.4s ease-out';
                
                setTimeout(() => {
                    dot.style.opacity = '1';
                    dot.style.transform = 'scale(1)';
                }, 100);
            }, index * 400);
        });
    }

    // Parallax effects for hero and doorway sections
    setupParallaxEffects() {
        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            // Hero section parallax
            const heroBackground = document.querySelector('.hero-background');
            if (heroBackground) {
                heroBackground.style.transform = `translate3d(0, ${rate}px, 0)`;
            }

            // Doorway section parallax
            const doorwayBackground = document.querySelector('.doorway-background');
            if (doorwayBackground) {
                const doorwaySection = document.querySelector('.doorway-section');
                if (this.isElementInViewport(doorwaySection)) {
                    const doorwayRate = scrolled * -0.3;
                    doorwayBackground.style.transform = `translate3d(0, ${doorwayRate}px, 0)`;
                }
            }

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        // Throttled scroll listener
        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // Smooth scrolling navigation
    setupNavigationInteractions() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = 70;
                    const elementPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: elementPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Update active nav link on scroll
        window.addEventListener('scroll', this.updateActiveNavLink.bind(this), { passive: true });
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('.bi-section');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        const scrollPos = window.scrollY + 100;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    // Mobile navigation toggle
    setupMobileNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (navToggle && navLinks) {
            navToggle.addEventListener('click', () => {
                const expanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !expanded);
                navToggle.classList.toggle('active');
                navLinks.classList.toggle('active');
                
                // Animate toggle lines
                const lines = navToggle.querySelectorAll('.toggle-line');
                lines.forEach((line, index) => {
                    line.style.transform = navToggle.classList.contains('active') 
                        ? this.getToggleLineTransform(index) 
                        : 'none';
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    
                    const lines = navToggle.querySelectorAll('.toggle-line');
                    lines.forEach(line => line.style.transform = 'none');
                }
            });
        }
    }

    getToggleLineTransform(index) {
        const transforms = [
            'rotate(45deg) translateY(6px)',
            'opacity: 0',
            'rotate(-45deg) translateY(-6px)'
        ];
        return transforms[index] || 'none';
    }

    // Accessibility enhancements
    setupAccessibility() {
        // Keyboard navigation for interactive elements
        this.addKeyboardSupport('.cta-button', this.handleButtonKeydown);
        this.addKeyboardSupport('.agent-seat', this.handleAgentSeatKeydown);
        this.addKeyboardSupport('.panel-item', this.handlePanelKeydown);

        // Focus management
        this.setupFocusManagement();

        // Reduced motion support
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.disableAnimations();
        }
    }

    addKeyboardSupport(selector, handler) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.setAttribute('tabindex', '0');
            el.addEventListener('keydown', handler.bind(this));
        });
    }

    handleButtonKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.target.click();
        }
    }

    handleAgentSeatKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.highlightAgent(e.target);
        }
    }

    handlePanelKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.highlightPanel(e.target);
        }
    }

    highlightAgent(agentSeat) {
        // Remove previous highlights
        document.querySelectorAll('.agent-seat.highlighted').forEach(el => {
            el.classList.remove('highlighted');
        });
        
        // Highlight selected agent
        agentSeat.classList.add('highlighted');
        
        // Announce to screen readers
        const agentType = agentSeat.getAttribute('data-agent');
        const announcement = `${agentType} agent selected`;
        this.announceToScreenReader(announcement);
    }

    highlightPanel(panel) {
        // Add temporary highlight
        panel.classList.add('highlighted');
        setTimeout(() => panel.classList.remove('highlighted'), 2000);
        
        // Announce to screen readers
        const title = panel.querySelector('.panel-title').textContent;
        this.announceToScreenReader(`${title} details displayed`);
    }

    setupFocusManagement() {
        // Focus trapping for modal
        const modal = document.getElementById('contact-modal');
        if (modal) {
            modal.addEventListener('keydown', this.trapFocus.bind(this));
        }
    }

    trapFocus(e) {
        if (e.key !== 'Tab') return;

        const modal = e.currentTarget;
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        setTimeout(() => document.body.removeChild(announcement), 1000);
    }

    disableAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Lazy loading for below-fold content
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            // Observe lazy images
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // Utility function to check if element is in viewport
    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// Global functions for button interactions
function scrollToNext() {
    const nextSection = document.getElementById('pain-points');
    if (nextSection) {
        const headerHeight = 70;
        const elementPosition = nextSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

function openContactForm() {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.style.display = 'flex';
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
}

function closeContactForm() {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function submitContact(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    console.log('Contact form submitted:', data);
    
    // Show success message
    alert('Thank you for your interest! We\'ll be in touch soon to discuss your journey into Business Infinity.');
    
    // Close modal and reset form
    closeContactForm();
    event.target.reset();
}

// Handle escape key for modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeContactForm();
    }
});

// Initialize the website
const businessInfinityWebsite = new BusinessInfinityWebsite();