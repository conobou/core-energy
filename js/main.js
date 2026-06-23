document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. ACTIVE NAV LINK DETECTION
    // ==========================================
    const currentPath = window.location.pathname;
    const pageName = currentPath.split("/").pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        // Handle home page matching (both empty path, / or index.html)
        if (href === pageName || 
            (pageName === '' && href === 'index.html') || 
            (pageName === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ==========================================
    // 2. HEADER SCROLL EFFECT
    // ==========================================
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 30) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ==========================================
    // 3. MOBILE MENU HAMBURGER TOGGLE
    // ==========================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('open') && 
                !navMenu.contains(e.target) && 
                !navToggle.contains(e.target)) {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
            }
        });
        
        // Close menu when clicking a link (optional, for same-page anchors if any)
        const links = navMenu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // ==========================================
    // 4. SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==========================================
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (reveals.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target); // Reveal only once
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        reveals.forEach(r => revealObserver.observe(r));
    }

    // ==========================================
    // 5. STATS ANIMATED COUNTERS
    // ==========================================
    const stats = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats-section');
    let countStarted = false;
    
    function startCounters() {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const suffix = stat.getAttribute('data-suffix') || '';
            const duration = 2000; // 2 seconds
            const stepTime = 30;
            const steps = duration / stepTime;
            const stepValue = target / steps;
            let current = 0;
            
            const timer = setInterval(() => {
                current += stepValue;
                if (current >= target) {
                    stat.innerText = target.toLocaleString() + suffix;
                    clearInterval(timer);
                } else {
                    stat.innerText = Math.ceil(current).toLocaleString() + suffix;
                }
            }, stepTime);
        });
    }
    
    if (statsSection && stats.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !countStarted) {
                countStarted = true;
                startCounters();
                statsObserver.unobserve(statsSection);
            }
        }, { threshold: 0.2 });
        statsObserver.observe(statsSection);
    }

    // ==========================================
    // 6. MEMBERSHIP PRICING BILLING TOGGLE
    // ==========================================
    const billingToggle = document.getElementById('billing-toggle');
    const monthlyElements = document.querySelectorAll('.price-monthly');
    const quarterlyElements = document.querySelectorAll('.price-quarterly');
    const annualElements = document.querySelectorAll('.price-annual');
    const toggleLabels = document.querySelectorAll('.membership-toggle-label');
    
    if (billingToggle) {
        billingToggle.addEventListener('change', () => {
            const isAnnual = billingToggle.checked;
            
            // Toggle active visual class on labels
            toggleLabels.forEach(label => label.classList.toggle('active'));
            
            if (isAnnual) {
                // Show annual plan price and hide quarterly/monthly values
                monthlyElements.forEach(el => el.style.display = 'none');
                quarterlyElements.forEach(el => el.style.display = 'none');
                annualElements.forEach(el => el.style.display = 'inline');
            } else {
                // Show quarterly / monthly
                monthlyElements.forEach(el => el.style.display = 'inline');
                quarterlyElements.forEach(el => el.style.display = 'none');
                annualElements.forEach(el => el.style.display = 'none');
            }
        });
    }

    // ==========================================
    // 7. TOAST NOTIFICATIONS
    // ==========================================
    function showToast(message) {
        let toast = document.getElementById('toast');
        if (!toast) {
            // Create toast element on the fly if it doesn't exist
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast';
            toast.innerHTML = `<i class="fas fa-check-circle"></i> <span id="toast-message"></span>`;
            document.body.appendChild(toast);
        }
        
        const toastMsg = document.getElementById('toast-message');
        toastMsg.innerText = message;
        toast.classList.add('active');
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, 4000);
    }

    // ==========================================
    // 8. FREE TRIAL MODAL CONTROLS
    // ==========================================
    const modal = document.getElementById('trial-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalOpenBtns = document.querySelectorAll('.open-trial-modal');
    const trialForm = document.getElementById('trial-form');
    
    if (modal && modalCloseBtn) {
        modalOpenBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        modalCloseBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
    
    // Trial Form Submit
    if (trialForm) {
        trialForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('trial-name').value;
            const phone = document.getElementById('trial-phone').value;
            const program = document.getElementById('trial-program').value;
            
            if (name && phone) {
                // Mock submission
                if (modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
                trialForm.reset();
                showToast(`Success! Free Trial pass booked for ${name}. We will contact you soon!`);
            }
        });
    }

    // ==========================================
    // 9. CONTACT FORM SUBMISSION
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('contact-name').value;
            const phone = document.getElementById('contact-phone').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;
            
            if (name && phone && email && message) {
                // Mock submission
                contactForm.reset();
                showToast(`Thank you, ${name}! Your inquiry was sent successfully. We will get back to you within 24 hours.`);
            }
        });
    }
    
});
