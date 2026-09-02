(function () {
    "use strict";

    // Scrolling
    const navLinks = document.querySelectorAll('.nav-menu a, .footer-col a, .back-to-top');
    const sections = document.querySelectorAll('main section');
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 0;

    const smoothScroll = (targetId) => {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - headerHeight;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                event.preventDefault();
                
                if (targetId === '#') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    smoothScroll(targetId);
                }

                if (document.body.classList.contains('mobile-nav-active')) {
                    toggleMobileNav();
                }
            }
        });
    });

    // Mobile Nav
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mobileNav = document.getElementById('nav-menu');
    
    const mobileOverlay = document.createElement('div');
    mobileOverlay.id = 'mobile-body-overly';
    document.body.appendChild(mobileOverlay);

    const toggleMobileNav = () => {
        document.body.classList.toggle('mobile-nav-active');
        const iconRef = mobileNavToggle.querySelector('use');
        const isOpen = document.body.classList.contains('mobile-nav-active');
        if (iconRef) {
            iconRef.setAttribute('href', isOpen ? '#i-times' : '#i-bars');
        }
        mobileOverlay.style.display = isOpen ? 'block' : 'none';
        mobileNavToggle.setAttribute('aria-expanded', String(isOpen));
    };

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', toggleMobileNav);
    }

    mobileOverlay.addEventListener('click', toggleMobileNav);

    // Escape closes the mobile nav and puts focus back on the toggle
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && document.body.classList.contains('mobile-nav-active')) {
            toggleMobileNav();
            mobileNavToggle.focus();
        }
    });

    // Back to Top
    const backToTop = document.querySelector('.back-to-top');

    const toggleBackToTop = () => {
        if (backToTop) {
            if (window.scrollY > 100) {
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
        }
    };

    window.addEventListener('scroll', toggleBackToTop);
    window.addEventListener('load', toggleBackToTop);

    // Active State
    const updateActiveMenu = () => {
        let current = '';
        const scrollPosition = window.scrollY + headerHeight + 1;

        sections.forEach(section => {
            if (section.offsetTop <= scrollPosition && section.offsetTop + section.offsetHeight > scrollPosition) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.classList.remove('menu-active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('menu-active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveMenu);
    window.addEventListener('load', updateActiveMenu);

    // Project Modals
    const projectModals = document.querySelectorAll('.project-modal');

    const openModal = (trigger) => {
        const modal = document.getElementById(trigger.getAttribute('data-modal'));
        if (!modal || modal.open) {
            return;
        }
        if (typeof modal.showModal === 'function') {
            modal.showModal();
            document.body.classList.add('modal-open');
        } else {
            modal.setAttribute('open', '');
        }
    };

    // The <button> is the real control, so Enter and Space are handled natively.
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', function () {
            openModal(this);
        });
    });

    // Clicking anywhere else on the card forwards to that card's button.
    document.querySelectorAll('.project-card.expandable').forEach(card => {
        const trigger = card.querySelector('[data-modal]');
        if (!trigger) {
            return;
        }
        card.addEventListener('click', event => {
            if (!trigger.contains(event.target) && window.getSelection().isCollapsed) {
                openModal(trigger);
            }
        });
    });

    projectModals.forEach(modal => {
        // Clicking the backdrop targets the dialog itself
        modal.addEventListener('click', function (event) {
            if (event.target === modal) {
                modal.close();
            }
        });

        // Also covers closing via Escape or the close button
        modal.addEventListener('close', function () {
            document.body.classList.remove('modal-open');
        });
    });

})();