/**
 * ============================================
 * DOBU MARTIAL ARTS - MAIN JAVASCRIPT
 * ============================================
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ==========================================
    // 1. MOBILE NAVIGATION
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            const isOpen = nav.classList.toggle('open');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close nav when clicking a link
        nav.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                nav.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ==========================================
    // 2. HEADER SCROLL EFFECT
    // ==========================================
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // ==========================================
    // 3. HERO COUNTER ANIMATION
    // ==========================================
    const statNumbers = document.querySelectorAll('.stat-number');

    if (statNumbers.length > 0) {
        const animateCounters = function() {
            statNumbers.forEach(function(el) {
                const target = parseInt(el.getAttribute('data-count'), 10);
                const duration = 2000;
                const startTime = performance.now();

                const updateCounter = function(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    const current = Math.round(easeOutQuart * target);

                    el.textContent = current + (target > 1 ? '+' : '');

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = target + (target > 1 ? '+' : '');
                    }
                };

                requestAnimationFrame(updateCounter);
            });
        };

        // Use Intersection Observer to trigger counter
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });

        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) {
            observer.observe(heroStats);
        }
    }

    // ==========================================
    // 4. FAQ ACCORDION
    // ==========================================
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(function(question) {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Close all other FAQs
            faqQuestions.forEach(function(q) {
                if (q !== question) {
                    q.setAttribute('aria-expanded', 'false');
                }
            });

            this.setAttribute('aria-expanded', !isExpanded);
        });
    });

    // ==========================================
    // 5. PASSWORD TOGGLE (Login/Register)
    // ==========================================
    const passwordToggles = document.querySelectorAll('.password-toggle');

    passwordToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            const input = this.closest('.password-wrapper').querySelector('input');
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                this.setAttribute('aria-label', 'Hide password');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                this.setAttribute('aria-label', 'Show password');
            }
        });
    });

    // ==========================================
    // 6. CONTACT FORM VALIDATION
    // ==========================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;

            // Validate Name
            const name = document.getElementById('contactName');
            const nameError = name.closest('.form-group').querySelector('[data-error="name"]');
            if (!name.value.trim()) {
                name.classList.add('error');
                nameError.classList.add('visible');
                isValid = false;
            } else {
                name.classList.remove('error');
                nameError.classList.remove('visible');
            }

            // Validate Email
            const email = document.getElementById('contactEmail');
            const emailError = email.closest('.form-group').querySelector('[data-error="email"]');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email.value.trim())) {
                email.classList.add('error');
                emailError.classList.add('visible');
                isValid = false;
            } else {
                email.classList.remove('error');
                emailError.classList.remove('visible');
            }

            // Validate Subject
            const subject = document.getElementById('contactSubject');
            const subjectError = subject.closest('.form-group').querySelector('[data-error="subject"]');
            if (!subject.value) {
                subject.classList.add('error');
                subjectError.classList.add('visible');
                isValid = false;
            } else {
                subject.classList.remove('error');
                subjectError.classList.remove('visible');
            }

            // Validate Message
            const message = document.getElementById('contactMessage');
            const messageError = message.closest('.form-group').querySelector('[data-error="message"]');
            if (message.value.trim().length < 10) {
                message.classList.add('error');
                messageError.classList.add('visible');
                isValid = false;
            } else {
                message.classList.remove('error');
                messageError.classList.remove('visible');
            }

            // Validate Consent
            const consent = document.getElementById('contactConsent');
            const consentError = consent.closest('.form-group').querySelector('[data-error="consent"]');
            if (!consent.checked) {
                consent.classList.add('error');
                consentError.classList.add('visible');
                isValid = false;
            } else {
                consent.classList.remove('error');
                consentError.classList.remove('visible');
            }

            if (isValid) {
                // Simulate form submission
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                setTimeout(function() {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    contactForm.querySelector('.form-success').style.display = 'flex';
                    contactForm.querySelectorAll('input, textarea, select').forEach(function(el) {
                        if (el.type !== 'checkbox' && el.type !== 'radio') {
                            el.value = '';
                        }
                        if (el.type === 'checkbox') {
                            el.checked = false;
                        }
                    });
                    contactForm.querySelectorAll('.form-error.visible').forEach(function(el) {
                        el.classList.remove('visible');
                    });
                    contactForm.querySelectorAll('.error').forEach(function(el) {
                        el.classList.remove('error');
                    });
                }, 2000);
            }
        });

        // Real-time validation cleanup
        contactForm.querySelectorAll('input, textarea, select').forEach(function(el) {
            el.addEventListener('input', function() {
                this.classList.remove('error');
                const error = this.closest('.form-group').querySelector('.form-error.visible');
                if (error) {
                    error.classList.remove('visible');
                }
            });
            el.addEventListener('change', function() {
                this.classList.remove('error');
                const error = this.closest('.form-group').querySelector('.form-error.visible');
                if (error) {
                    error.classList.remove('visible');
                }
            });
        });
    }

    // ==========================================
    // 7. LOGIN FORM
    // ==========================================
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;

            const email = document.getElementById('loginEmail');
            const password = document.getElementById('loginPassword');
            const globalError = this.querySelector('.form-error-global');

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Validate Email
            if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
                email.classList.add('error');
                isValid = false;
            } else {
                email.classList.remove('error');
            }

            // Validate Password
            if (!password.value.trim() || password.value.trim().length < 6) {
                password.classList.add('error');
                isValid = false;
            } else {
                password.classList.remove('error');
            }

            if (!isValid) {
                globalError.style.display = 'block';
                return;
            }

            globalError.style.display = 'none';

            // Simulate login
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            submitBtn.disabled = true;

            setTimeout(function() {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            }, 1500);
        });

        // Clear errors on input
        loginForm.querySelectorAll('input').forEach(function(el) {
            el.addEventListener('input', function() {
                this.classList.remove('error');
                const globalError = this.closest('form').querySelector('.form-error-global');
                if (globalError) {
                    globalError.style.display = 'none';
                }
            });
        });
    }

    // ==========================================
    // 8. REGISTRATION FORM (Multi-step)
    // ==========================================
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        let currentStep = 1;
        const totalSteps = 5;
        const steps = registerForm.querySelectorAll('.register-step');

        // Show/hide steps
        function showStep(step) {
            steps.forEach(function(s, index) {
                s.style.display = (index === step - 1) ? 'block' : 'none';
            });

            // Update step indicators
            const stepIndicators = document.querySelectorAll('.registration-steps .step');
            stepIndicators.forEach(function(ind, index) {
                ind.classList.toggle('active', index === step - 1);
            });

            // Scroll to top of form
            registerForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Next button
        registerForm.querySelectorAll('.btn-next').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const currentStepEl = registerForm.querySelector(`.register-step[data-step="${currentStep}"]`);

                // Validate current step
                let isValid = true;

                if (currentStep === 1) {
                    // Validate plan selection
                    const selectedPlan = currentStepEl.querySelector('input[name="plan"]:checked');
                    const error = currentStepEl.querySelector('[data-error="plan"]');
                    if (!selectedPlan) {
                        error.classList.add('visible');
                        isValid = false;
                    } else {
                        error.classList.remove('visible');
                    }
                } else if (currentStep === 2) {
                    // Validate martial arts selection
                    const selectedArts = currentStepEl.querySelectorAll('input[name="arts"]:checked');
                    const error = currentStepEl.querySelector('[data-error="arts"]');
                    if (selectedArts.length === 0) {
                        error.classList.add('visible');
                        isValid = false;
                    } else {
                        error.classList.remove('visible');
                    }
                } else if (currentStep === 3) {
                    // Validate personal details
                    const fields = currentStepEl.querySelectorAll('input[required]');
                    fields.forEach(function(field) {
                        const errorKey = field.id.replace('reg', '').toLowerCase();
                        const error = currentStepEl.querySelector(`[data-error="${errorKey}"]`);
                        if (!field.value.trim()) {
                            field.classList.add('error');
                            if (error) error.classList.add('visible');
                            isValid = false;
                        } else {
                            field.classList.remove('error');
                            if (error) error.classList.remove('visible');
                        }
                    });

                    // Validate email
                    const email = document.getElementById('regEmail');
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (email.value.trim() && !emailPattern.test(email.value.trim())) {
                        email.classList.add('error');
                        const error = currentStepEl.querySelector('[data-error="email"]');
                        if (error) error.classList.add('visible');
                        isValid = false;
                    }

                    // Validate password
                    const password = document.getElementById('regPassword');
                    if (password.value.trim() && password.value.trim().length < 8) {
                        password.classList.add('error');
                        const error = currentStepEl.querySelector('[data-error="password"]');
                        if (error) error.classList.add('visible');
                        isValid = false;
                    }
                }

                if (!isValid) return;

                // If step 4, populate review
                if (currentStep === 3) {
                    const plan = document.querySelector('input[name="plan"]:checked');
                    const arts = document.querySelectorAll('input[name="arts"]:checked');
                    const firstName = document.getElementById('regFirstName').value;
                    const lastName = document.getElementById('regLastName').value;
                    const email = document.getElementById('regEmail').value;
                    const dob = document.getElementById('regDob').value;

                    document.getElementById('reviewPlan').textContent =
                        plan ? plan.value.charAt(0).toUpperCase() + plan.value.slice(1) : '-';
                    document.getElementById('reviewArts').textContent =
                        arts.length ? Array.from(arts).map(a => a.value).join(', ') : '-';
                    document.getElementById('reviewName').textContent = `${firstName} ${lastName}`;
                    document.getElementById('reviewEmail').textContent = email;
                    document.getElementById('reviewDob').textContent = dob ? new Date(dob).toLocaleDateString() : '-';
                }

                if (currentStep < totalSteps) {
                    currentStep++;
                    showStep(currentStep);
                }
            });
        });

        // Previous button
        registerForm.querySelectorAll('.btn-prev').forEach(function(btn) {
            btn.addEventListener('click', function() {
                if (currentStep > 1) {
                    currentStep--;
                    showStep(currentStep);
                }
            });
        });

        // Form submit (Step 4 -> Step 5)
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate Step 4 (should already be valid)
            const submitBtn = this.querySelector('.btn-gold');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;

            setTimeout(function() {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                currentStep = 5;
                showStep(5);
            }, 2000);
        });

        // Show initial step
        showStep(1);

        // Real-time validation cleanup for registration
        registerForm.querySelectorAll('input, select').forEach(function(el) {
            el.addEventListener('input', function() {
                this.classList.remove('error');
                const error = this.closest('.register-step').querySelector(`[data-error="${this.id.replace('reg', '').toLowerCase()}"]`);
                if (error) {
                    error.classList.remove('visible');
                }
            });
            el.addEventListener('change', function() {
                this.classList.remove('error');
                const error = this.closest('.register-step').querySelector(`[data-error="${this.id.replace('reg', '').toLowerCase()}"]`);
                if (error) {
                    error.classList.remove('visible');
                }
                // Plan selection
                if (this.name === 'plan') {
                    const parentError = this.closest('.register-step').querySelector('[data-error="plan"]');
                    if (parentError) parentError.classList.remove('visible');
                }
                if (this.name === 'arts') {
                    const parentError = this.closest('.register-step').querySelector('[data-error="arts"]');
                    if (parentError) parentError.classList.remove('visible');
                }
            });
        });
    }

    // ==========================================
    // 9. SEARCH TOGGLE
    // ==========================================
    const searchToggle = document.querySelector('.search-toggle');

    if (searchToggle) {
        searchToggle.addEventListener('click', function() {
            // Simple search toggle - could be expanded
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            // For now, just focus on the search input if it exists
            // In a full implementation, this would show a search bar
        });
    }

    // ==========================================
    // 10. SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 11. KEYBOARD ACCESSIBILITY
    // ==========================================
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal.active');
            modals.forEach(function(modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });

    console.log('🥋 DoBu Martial Arts - Website loaded successfully!');
});