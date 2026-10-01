/**
 * ============================================
 * DOBU MARTIAL ARTS - MEMBERSHIP
 * ============================================
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ==========================================
    // 1. PLAN SELECTION (Registration redirect)
    // ==========================================
    const planCTAs = document.querySelectorAll('.plan-cta');

    planCTAs.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.includes('register.html')) {
                // The plan is already in the URL via query param
                // Let the page handle it
                return;
            }

            // For "Join Now" buttons without a plan param
            const planCard = this.closest('.plan-card');
            if (planCard) {
                const planName = planCard.querySelector('h3')?.textContent?.toLowerCase() || 'basic';
                e.preventDefault();
                window.location.href = `register.html?plan=${planName}`;
            }
        });
    });

    // ==========================================
    // 2. PLAN COMPARISON TOGGLE
    // ==========================================
    const planCards = document.querySelectorAll('.plan-card');

    planCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            // Highlight the card
            planCards.forEach(function(c) {
                c.style.transform = 'scale(0.97)';
                c.style.opacity = '0.7';
            });
            this.style.transform = 'scale(1.02)';
            this.style.opacity = '1';
        });

        card.addEventListener('mouseleave', function() {
            planCards.forEach(function(c) {
                c.style.transform = '';
                c.style.opacity = '';
            });
        });
    });

    // ==========================================
    // 3. PRICE CALCULATOR (Interactive)
    // ==========================================
    const priceCalculator = document.getElementById('priceCalculator');

    if (priceCalculator) {
        const planSelect = priceCalculator.querySelector('#calcPlan');
        const addons = priceCalculator.querySelectorAll('.calc-addon');
        const totalDisplay = priceCalculator.querySelector('#calcTotal');

        function calculateTotal() {
            const prices = {
                basic: 25,
                intermediate: 35,
                advanced: 45,
                elite: 60,
                junior: 25
            };

            let total = prices[planSelect.value] || 0;

            addons.forEach(function(addon) {
                if (addon.checked) {
                    total += parseInt(addon.getAttribute('data-price'), 10);
                }
            });

            if (totalDisplay) {
                totalDisplay.textContent = `£${total}/month`;
            }
        }

        planSelect.addEventListener('change', calculateTotal);
        addons.forEach(function(addon) {
            addon.addEventListener('change', calculateTotal);
        });

        // Initial calculation
        calculateTotal();
    }

    // ==========================================
    // 4. SAVE PLAN SELECTION (for registration)
    // ==========================================
    // Check if coming from registration with a plan param
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan');

    if (planParam) {
        // Find and highlight the matching plan card
        const planCardsAll = document.querySelectorAll('.plan-card');
        const planMap = {
            basic: 'Basic',
            intermediate: 'Intermediate',
            advanced: 'Advanced',
            elite: 'Elite',
            junior: 'Junior'
        };

        const targetPlan = planMap[planParam.toLowerCase()];
        if (targetPlan) {
            planCardsAll.forEach(function(card) {
                const title = card.querySelector('h3')?.textContent;
                if (title === targetPlan) {
                    card.classList.add('featured');
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Highlight effect
                    card.style.boxShadow = '0 0 0 4px #c9a84c, 0 8px 32px rgba(0,0,0,0.2)';
                    setTimeout(function() {
                        card.style.boxShadow = '';
                    }, 3000);
                }
            });
        }
    }

    // ==========================================
    // 5. MEMBERSHIP UPGRADE/DOWNGRADE (Dashboard)
    // ==========================================
    const upgradeBtns = document.querySelectorAll('.upgrade-plan');

    upgradeBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPlan = this.getAttribute('data-plan');

            if (confirm(`Are you sure you want to upgrade to the ${targetPlan} plan?`)) {
                // Simulate upgrade
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                this.disabled = true;

                setTimeout(function() {
                    alert(`✅ Successfully upgraded to ${targetPlan} plan!`);
                    window.location.reload();
                }, 1500);
            }
        });
    });

    // ==========================================
    // 6. CANCEL MEMBERSHIP
    // ==========================================
    const cancelBtn = document.getElementById('cancelMembership');

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
            e.preventDefault();

            if (confirm('Are you sure you want to cancel your membership? This action cannot be undone.')) {
                if (confirm('Please confirm: Do you really want to cancel your DoBu membership?')) {
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                    this.disabled = true;

                    setTimeout(function() {
                        alert('Your membership has been cancelled. We\'re sorry to see you go!');
                        window.location.href = 'index.html';
                    }, 1500);
                }
            }
        });
    }

    // ==========================================
    // 7. MEMBERSHIP CARD ANIMATION
    // ==========================================
    const membershipCards = document.querySelectorAll('.membership-card');

    membershipCards.forEach(function(card, index) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';

        setTimeout(function() {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 150 + (index * 100));
    });

    console.log('🥋 Membership functionality loaded.');
});