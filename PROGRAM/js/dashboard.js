/**
 * ============================================
 * DOBU MARTIAL ARTS - DASHBOARD
 * ============================================
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ==========================================
    // 1. CHECK LOGIN STATUS
    // ==========================================
    function checkAuth() {
        const isLoggedIn = localStorage.getItem('dobu_logged_in') === 'true';

        if (!isLoggedIn) {
            // Redirect to login if not authenticated
            window.location.href = 'login.html';
            return false;
        }

        // Load user data
        loadUserData();
        loadBookings();
        return true;
    }

    // ==========================================
    // 2. LOAD USER DATA
    // ==========================================
    function loadUserData() {
        const user = JSON.parse(localStorage.getItem('dobu_user') || 'null');

        if (user) {
            // Display user name
            const nameElements = document.querySelectorAll('.user-name');
            nameElements.forEach(function(el) {
                el.textContent = user.firstName || 'Member';
            });

            // Display membership plan
            const planElements = document.querySelectorAll('.user-plan');
            planElements.forEach(function(el) {
                const plan = user.plan || 'Basic';
                el.textContent = plan.charAt(0).toUpperCase() + plan.slice(1);
            });

            // Display email
            const emailElements = document.querySelectorAll('.user-email');
            emailElements.forEach(function(el) {
                el.textContent = user.email || 'member@dobu.com';
            });
        } else {
            // Fallback - create dummy user
            const dummyUser = {
                firstName: 'Alex',
                lastName: 'Johnson',
                email: 'alex@example.com',
                plan: 'Advanced',
                joined: '2024-09-01',
                nextPayment: '2026-09-01'
            };
            localStorage.setItem('dobu_user', JSON.stringify(dummyUser));
            loadUserData();
        }
    }

    // ==========================================
    // 3. LOAD BOOKINGS
    // ==========================================
    function loadBookings() {
        const bookings = JSON.parse(localStorage.getItem('dobu_bookings') || '[]');
        const container = document.getElementById('upcomingBookings');
        const emptyMsg = document.getElementById('noBookings');

        if (!container) return;

        // Clear existing (except empty message)
        const items = container.querySelectorAll('.booking-item');
        items.forEach(function(el) { el.remove(); });

        if (bookings.length === 0) {
            if (emptyMsg) emptyMsg.style.display = 'block';
            return;
        }

        if (emptyMsg) emptyMsg.style.display = 'none';

        // Show last 5 bookings
        const recent = bookings.slice(-5).reverse();

        recent.forEach(function(booking, index) {
            const item = document.createElement('div');
            item.className = 'booking-item';
            item.style.animationDelay = `${index * 0.1}s`;

            const date = new Date(booking.bookedAt);
            const dateStr = date.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });

            item.innerHTML = `
                <div class="booking-info">
                    <span class="booking-class">${booking.class}</span>
                    <span class="booking-day">${booking.day}</span>
                    <span class="booking-time">${booking.time}</span>
                </div>
                <div class="booking-status">
                    <span class="status-badge confirmed">Confirmed</span>
                    <span class="booking-date">${dateStr}</span>
                </div>
            `;

            container.appendChild(item);
        });
    }

    // ==========================================
    // 4. LOGOUT
    // ==========================================
    const logoutBtn = document.getElementById('logoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();

            if (confirm('Are you sure you want to logout?')) {
                localStorage.setItem('dobu_logged_in', 'false');
                window.location.href = 'login.html';
            }
        });
    }

    // ==========================================
    // 5. QUICK ACTIONS
    // ==========================================
    const quickActions = document.querySelectorAll('.quick-action');

    quickActions.forEach(function(action) {
        action.addEventListener('click', function(e) {
            const actionType = this.getAttribute('data-action');

            switch (actionType) {
                case 'book':
                    window.location.href = 'timetable.html';
                    break;
                case 'membership':
                    window.location.href = 'membership.html';
                    break;
                case 'profile':
                    alert('Profile settings would open here.');
                    break;
                case 'support':
                    window.location.href = 'contact.html';
                    break;
                default:
                    break;
            }
        });
    });

    // ==========================================
    // 6. STATS ANIMATION
    // ==========================================
    function animateStats() {
        const stats = document.querySelectorAll('.stat-number.dashboard');

        stats.forEach(function(stat) {
            const target = parseInt(stat.getAttribute('data-count'), 10);
            const duration = 1500;
            const startTime = performance.now();

            const updateCounter = function(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.round(easeOutQuart * target);

                stat.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            };

            requestAnimationFrame(updateCounter);
        });
    }

    // Use Intersection Observer for stats
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const statsContainer = document.querySelector('.dashboard-stats');
    if (statsContainer) {
        statsObserver.observe(statsContainer);
    }

    // ==========================================
    // 7. INIT
    // ==========================================
    if (checkAuth()) {
        console.log('🥋 Dashboard loaded for user:', JSON.parse(localStorage.getItem('dobu_user') || '{}').firstName);
    }
});