/**
 * Ritabrata Chakraborty — Portfolio Core Interactions Architecture
 * Optimized for Desktop, Tablet, and Mobile Screen Environments
 * File: scripts.js
 */

document.addEventListener('DOMContentLoaded', () => {
    // ---- DOM Elements Initialization ----
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('menu');
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-menu a, .nav-btn');

    // ---- Mobile Hamburger Menu Mechanics ----
    /**
     * Toggles the mobile navigation overlay state securely with ARIA accessibility.
     */
    function toggleMobileMenu() {
        const isOpen = navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Update accessibility attributes for screen readers
        menuToggle.setAttribute('aria-expanded', isOpen);
        
        // Prevent background scrolling on mobile screens when menu is active
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    /**
     * Explicitly forces the navigation drawer to shut down clean.
     */
    function closeMobileMenu() {
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }

    // Attach event interaction triggers safely via listeners
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid event bubbling issues
            toggleMobileMenu();
        });
    }

    // ---- Mobile Touch-Support for Nested Project Dropdown ----
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            // Check if window view is in a tablet or mobile responsive state
            if (window.innerWidth <= 992) {
                e.preventDefault(); // Stop instant scroll anchor jumps
                e.stopPropagation(); // Prevent global document click handler from firing
                
                const parentDropdown = trigger.closest('.dropdown');
                if (parentDropdown) {
                    const isDropdownOpen = parentDropdown.classList.toggle('active');
                    trigger.setAttribute('aria-expanded', isDropdownOpen);
                }
            }
        });
    });

    // ---- Smooth Navigation & Event Cleanup Routines ----
    // Automatically close the navbar when clicking any navigational link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
                const trigger = dropdown.querySelector('.dropdown-trigger');
                if (trigger) trigger.setAttribute('aria-expanded', 'false');
            });
        });
    });

    // Global Click-away: Close open responsive layers if you tap anywhere outside them
    document.addEventListener('click', (event) => {
        if (navMenu && !navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            closeMobileMenu();
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
                const trigger = dropdown.querySelector('.dropdown-trigger');
                if (trigger) trigger.setAttribute('aria-expanded', 'false');
            });
        }
    });

    // Keyboard Accessibility Esc Shortcut: Close active layers smoothly on escape stroke
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMobileMenu();
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
                const trigger = dropdown.querySelector('.dropdown-trigger');
                if (trigger) trigger.setAttribute('aria-expanded', 'false');
            });
        }
    });

    // ---- Dynamic Infinite Carousel Speed Optimization ----
    const marqueeTrack = document.querySelector('.marquee .track');
    if (marqueeTrack) {
        // Pauses tech marquee scroll animation gracefully on mouse hover for visibility
        marqueeTrack.addEventListener('mouseenter', () => {
            marqueeTrack.style.animationPlayState = 'paused';
        });
        marqueeTrack.addEventListener('mouseleave', () => {
            marqueeTrack.style.animationPlayState = 'running';
        });
    }
});
