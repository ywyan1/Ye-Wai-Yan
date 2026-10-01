/**
 * ============================================
 * DOBU MARTIAL ARTS - TIMETABLE
 * ============================================
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ==========================================
    // 1. FILTER FUNCTIONALITY
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const classCells = document.querySelectorAll('.class-cell');

    filterButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(function(b) {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');

            const filter = this.getAttribute('data-filter');

            // Show/hide cells
            classCells.forEach(function(cell) {
                if (filter === 'all') {
                    cell.style.display = 'table-cell';
                } else {
                    const classType = cell.getAttribute('data-class');
                    if (classType === filter) {
                        cell.style.display = 'table-cell';
                    } else {
                        cell.style.display = 'none';
                    }
                }
            });

            // Also handle empty cells (they should always be hidden if not all)
            if (filter !== 'all') {
                document.querySelectorAll('.class-cell:empty').forEach(function(empty) {
                    empty.style.display = 'none';
                });
            } else {
                document.querySelectorAll('.class-cell:empty').forEach(function(empty) {
                    empty.style.display = 'table-cell';
                });
            }
        });
    });

    // ==========================================
    // 2. BOOKING MODAL
    // ==========================================
    const modal = document.getElementById('bookingModal');
    const modalOverlay = modal ? modal.querySelector('.modal-overlay') : null;
    const modalClose = modal ? modal.querySelector('.modal-close') : null;
    const modalCancel = modal ? modal.querySelector('.modal-cancel') : null;
    const modalConfirm = modal ? modal.querySelector('.modal-confirm') : null;

    function openModal(classData, day, time) {
        if (!modal) return;

        document.getElementById('modalClass').textContent = classData;
        document.getElementById('modalDay').textContent = day;
        document.getElementById('modalTime').textContent = time;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus trap
        setTimeout(function() {
            modalConfirm.focus();
        }, 100);
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Book button click
    document.querySelectorAll('.book-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();

            // Check if user is logged in (simulated)
            const isLoggedIn = localStorage.getItem('dobu_logged_in') === 'true';

            if (!isLoggedIn) {
                // Redirect to login
                if (confirm('Please login to book a class. Would you like to login now?')) {
                    window.location.href = 'login.html';
                }
                return;
            }

            const classData = this.getAttribute('data-class');
            const day = this.getAttribute('data-day');
            const time = this.getAttribute('data-time');

            openModal(classData, day, time);
        });
    });

    // Close modal events
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalCancel) modalCancel.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Confirm booking
    if (modalConfirm) {
        modalConfirm.addEventListener('click', function() {
            const classData = document.getElementById('modalClass').textContent;
            const day = document.getElementById('modalDay').textContent;
            const time = document.getElementById('modalTime').textContent;

            // Simulate booking
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
            this.disabled = true;

            setTimeout(function() {
                modalConfirm.innerHTML = '✓ Booked!';
                modalConfirm.style.background = '#2ecc71';
                modalConfirm.style.borderColor = '#2ecc71';

                // Store booking in localStorage
                const bookings = JSON.parse(localStorage.getItem('dobu_bookings') || '[]');
                bookings.push({
                    class: classData,
                    day: day,
                    time: time,
                    bookedAt: new Date().toISOString()
                });
                localStorage.setItem('dobu_bookings', JSON.stringify(bookings));

                setTimeout(function() {
                    closeModal();
                    modalConfirm.innerHTML = 'Confirm Booking';
                    modalConfirm.style.background = '';
                    modalConfirm.style.borderColor = '';
                    modalConfirm.disabled = false;
                    alert(`✅ Successfully booked ${classData} on ${day} at ${time}!`);
                }, 1500);
            }, 1500);
        });
    }

    // ==========================================
    // 3. KEYBOARD NAVIGATION FOR TIMETABLE
    // ==========================================
    const table = document.querySelector('.timetable-table');
    if (table) {
        table.addEventListener('keydown', function(e) {
            // Allow arrow key navigation for accessibility
            // This is a basic implementation - can be expanded
            const cells = this.querySelectorAll('td:not(.time-slot)');
            const currentIndex = Array.from(cells).indexOf(document.activeElement);

            if (currentIndex === -1) return;

            let newIndex = currentIndex;

            switch (e.key) {
                case 'ArrowRight':
                    newIndex = Math.min(currentIndex + 1, cells.length - 1);
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                    newIndex = Math.max(currentIndex - 1, 0);
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    newIndex = Math.min(currentIndex + 7, cells.length - 1);
                    e.preventDefault();
                    break;
                case 'ArrowUp':
                    newIndex = Math.max(currentIndex - 7, 0);
                    e.preventDefault();
                    break;
                default:
                    return;
            }

            if (cells[newIndex]) {
                cells[newIndex].focus();
            }
        });
    }

    // ==========================================
    // 4. CHECK BOOKING STATUS (for logged-in users)
    // ==========================================
    function checkBookingStatus() {
        const isLoggedIn = localStorage.getItem('dobu_logged_in') === 'true';
        if (!isLoggedIn) return;

        const bookings = JSON.parse(localStorage.getItem('dobu_bookings') || '[]');

        if (bookings.length > 0) {
            // Check if any bookings are for today's classes
            // This is a placeholder - would require more complex date matching
            // Could show a notification badge
        }
    }

    checkBookingStatus();

    // ==========================================
    // 5. EXPORT BOOKINGS (utility)
    // ==========================================
    window.exportBookings = function() {
        const bookings = JSON.parse(localStorage.getItem('dobu_bookings') || '[]');
        if (bookings.length === 0) {
            alert('You have no bookings to export.');
            return;
        }

        let text = 'DoBu Martial Arts - My Bookings\n';
        text += '===============================\n\n';
        bookings.forEach(function(b, i) {
            text += `${i + 1}. ${b.class} - ${b.day} at ${b.time}\n`;
            text += `   Booked: ${new Date(b.bookedAt).toLocaleString()}\n\n`;
        });

        // Create download
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dobu-bookings.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    console.log('🥋 Timetable functionality loaded.');
});