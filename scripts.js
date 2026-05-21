/**
 * Ritabrata Chakraborty — Portfolio Core Interactions Architecture
 * Optimized for Desktop, Tablet, and Mobile Screen Environments
 * File: scripts.js
 */

document.addEventListener('DOMContentLoaded', () => {
    // ---- DOM Elements Initialization ----
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('menu');
    const dropdownTrigger = document.querySelector('.dropdown-trigger');
    const dropdownMenu = document.querySelector('.dropdown-menu');
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
        if (navMenu.classList.contains('active')) {
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
    if (dropdownTrigger && dropdownMenu) {
        dropdownTrigger.addEventListener('click', (e) => {
            // Check if window view is in a tablet or mobile responsive state
            if (window.innerWidth <= 992) {
                e.preventDefault(); // Stop instant scroll anchor jumps
                const isDropdownOpen = dropdownMenu.classList.toggle('show');
                dropdownTrigger.classList.toggle('open');
                dropdownTrigger.setAttribute('aria-expanded', isDropdownOpen);
            }
        });
    }

    // ---- Smooth Navigation & Event Cleanup Routines ----
    // Automatically close the navbar when clicking any navigational link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
            if (dropdownMenu) dropdownMenu.classList.remove('show');
            if (dropdownTrigger) dropdownTrigger.classList.remove('open');
        });
    });

    // Global Click-away: Close open responsive layers if you tap anywhere outside them
    document.addEventListener('click', (event) => {
        if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            closeMobileMenu();
        }
    });

    // Keyboard Accessibility Esc Shortcut: Close active layers smoothly on escape stroke
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMobileMenu();
            if (dropdownMenu) dropdownMenu.classList.remove('show');
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
