/**
 * Ritabrata Chakraborty — Portfolio Scripts
 * Handles: mobile nav, dropdown toggles (nav + hero), marquee pause, smooth scroll.
 *
 * Key fix vs old site:
 *   The nav "Download Resume" dropdown now works on mobile because:
 *   1. The .dropdown-menu is position:static inside the mobile overlay (CSS fix).
 *   2. JS toggles a .open class on the parent .dropdown which expands it via
 *      max-height transition — no absolute positioning needed on mobile.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ------------------------------------------------------------------
       DOM REFERENCES
    ------------------------------------------------------------------ */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu    = document.getElementById('menu');

    /*
        Collect every element with .dropdown-trigger so we can attach
        click listeners to all of them (nav button + hero button).
    */
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');

    /*
        Nav links that should close the mobile menu when tapped.
        Includes plain links AND items inside dropdown menus.
    */
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownLinks = document.querySelectorAll('.dropdown-menu a');


    /* ------------------------------------------------------------------
       MOBILE HAMBURGER MENU
       Toggles the full-screen overlay by adding/removing .active on
       the nav-menu and the toggle button.
    ------------------------------------------------------------------ */

    /**
     * Opens or closes the mobile nav overlay.
     * Also locks / unlocks body scroll so the page doesn't scroll
     * behind the overlay.
     */
    function toggleMobileMenu() {
        const isOpen = navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');

        /* ARIA: tell screen readers whether the menu is expanded */
        menuToggle.setAttribute('aria-expanded', String(isOpen));

        /* Prevent background scroll while menu is open */
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    /**
     * Closes the mobile nav overlay if it is currently open.
     * Called on nav-link clicks and outside-click events.
     */
    function closeMobileMenu() {
        if (!navMenu.classList.contains('active')) return; /* already closed */
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    /* Attach hamburger click listener */
    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); /* prevent bubbling to document click-away */
            toggleMobileMenu();
        });
    }


    /* ------------------------------------------------------------------
       DROPDOWN TOGGLE (ALL VIEWPORTS)

       On desktop (≥993px): dropdowns open on CSS :hover / :focus-within
       so JS does nothing — the hover rule in CSS handles it cleanly.

       On mobile  (≤992px): we suppress the CSS hover and instead use
       JS to toggle a .open class on the parent .dropdown element.
       The CSS then expands the menu via max-height transition.

       This fixes the original bug where the absolute-positioned dropdown
       was invisible / unclickable inside the mobile overlay.
    ------------------------------------------------------------------ */

    dropdownTriggers.forEach((trigger) => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation(); /* don't let click fall through to document */

            const parentDropdown = trigger.closest('.dropdown');
            if (!parentDropdown) return;

            const isMobile = window.innerWidth <= 992;

            if (isMobile) {
                /*
                    Mobile: toggle .open on this dropdown.
                    Also close any other open dropdowns first.
                */
                const isCurrentlyOpen = parentDropdown.classList.contains('open');

                /* Close all dropdowns */
                closeAllDropdowns();

                if (!isCurrentlyOpen) {
                    /* Re-open this one if it was closed */
                    parentDropdown.classList.add('open');
                    trigger.setAttribute('aria-expanded', 'true');
                }
            } else {
                /*
                    Desktop: CSS :hover handles it.
                    We still toggle .open so keyboard / click users work too.
                */
                const isCurrentlyOpen = parentDropdown.classList.contains('open');
                closeAllDropdowns();
                if (!isCurrentlyOpen) {
                    parentDropdown.classList.add('open');
                    trigger.setAttribute('aria-expanded', 'true');
                }
            }
        });
    });

    /**
     * Removes .open from every dropdown and resets ARIA attributes.
     */
    function closeAllDropdowns() {
        document.querySelectorAll('.dropdown.open').forEach((dd) => {
            dd.classList.remove('open');
            const t = dd.querySelector('.dropdown-trigger');
            if (t) t.setAttribute('aria-expanded', 'false');
        });
    }


    /* ------------------------------------------------------------------
       CLOSE MENU ON NAV-LINK CLICK
       When the user taps a section link inside the mobile overlay,
       we close the menu and also collapse any open dropdowns.
    ------------------------------------------------------------------ */
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            closeMobileMenu();
            closeAllDropdowns();
        });
    });

    /*
        Resume download links inside the dropdown menus:
        Close the mobile menu after tapping a download link.
    */
    dropdownLinks.forEach((link) => {
        link.addEventListener('click', () => {
            closeMobileMenu();
            closeAllDropdowns();
        });
    });


    /* ------------------------------------------------------------------
       CLICK-AWAY HANDLER
       Tapping anywhere outside the nav or menu closes everything.
    ------------------------------------------------------------------ */
    document.addEventListener('click', (e) => {
        /* If the click target is inside the nav or the toggle, do nothing */
        const insideNav    = navMenu    && navMenu.contains(e.target);
        const insideToggle = menuToggle && menuToggle.contains(e.target);

        /* Also allow clicks inside hero CTA dropdowns without closing them */
        const insideHeroCta = e.target.closest('.hero__cta');

        if (!insideNav && !insideToggle && !insideHeroCta) {
            closeMobileMenu();
            closeAllDropdowns();
        }
    });


    /* ------------------------------------------------------------------
       KEYBOARD ACCESSIBILITY — ESC KEY
       Pressing Escape closes the mobile menu and any open dropdowns.
    ------------------------------------------------------------------ */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
            closeAllDropdowns();
        }
    });


    /* ------------------------------------------------------------------
       MARQUEE PAUSE ON HOVER
       The CSS animation is paused when the mouse enters the track so
       users can read individual tech logos without them scrolling away.
    ------------------------------------------------------------------ */
    const marqueeTrack = document.querySelector('.marquee__track');
    if (marqueeTrack) {
        marqueeTrack.addEventListener('mouseenter', () => {
            marqueeTrack.style.animationPlayState = 'paused';
        });
        marqueeTrack.addEventListener('mouseleave', () => {
            marqueeTrack.style.animationPlayState = 'running';
        });
    }


    /* ------------------------------------------------------------------
       ACTIVE NAV LINK HIGHLIGHT
       Uses IntersectionObserver to highlight the nav link corresponding
       to the section currently in view.
    ------------------------------------------------------------------ */
    const sections = document.querySelectorAll('section[id]');
    const allNavLinks = document.querySelectorAll('.nav-link');

    if ('IntersectionObserver' in window && sections.length) {
        const observerOptions = {
            root: null,
            /* Trigger when section crosses the top 20% of the viewport */
            rootMargin: `-${getComputedStyle(document.documentElement)
                .getPropertyValue('--header-h').trim() || '72px'} 0px -70% 0px`,
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    /* Remove active class from all nav links */
                    allNavLinks.forEach((l) => l.classList.remove('nav-link--active'));

                    /* Add active class to the matching nav link */
                    const id = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    if (activeLink) activeLink.classList.add('nav-link--active');
                }
            });
        }, observerOptions);

        sections.forEach((section) => observer.observe(section));
    }

}); /* end DOMContentLoaded */
