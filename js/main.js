/* ==========================================================================
   SANGITAM TRAVELS - MODERN MINIMAL INTERACTIVITY SCRIPT
   Handles ticket modal, seat selection, route search, mobile drawer & tracking
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initBookingModal();
  initRouteSearch();
  initParcelTracking();
  initInteractiveTimeline();
  initContactForm();
});

/* --------------------------------------------------------------------------
   Contact Form Category Selector & Interactive Submission
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const pills = document.querySelectorAll('#contactCategoryPills .category-pill-option');
  const hiddenInput = document.getElementById('contactSubjectInput');
  const successBox = document.getElementById('contactFormSuccess');
  const refIdSpan = document.getElementById('contactRefId');

  // Category pill selector
  if (pills.length > 0) {
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const val = pill.getAttribute('data-val');
        if (hiddenInput) hiddenInput.value = val;
      });
    });
  }

  // Form submission feedback
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contactName')?.value;
      const phone = document.getElementById('contactPhone')?.value;
      
      if (!name || !phone) {
        alert('Please fill out all required fields.');
        return;
      }

      // Generate random reference ID
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      if (refIdSpan) refIdSpan.textContent = `SNG-INQ-${randomNum}`;

      if (successBox) {
        successBox.style.display = 'block';
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      contactForm.reset();
      
      // Reset category pills
      if (pills.length > 0) {
        pills.forEach(p => p.classList.remove('active'));
        pills[0].classList.add('active');
        if (hiddenInput) hiddenInput.value = 'Ticket Booking';
      }
    });
  }
}

/* --------------------------------------------------------------------------
   Interactive Heritage Timeline
   -------------------------------------------------------------------------- */
function initInteractiveTimeline() {
  const pills = document.querySelectorAll('.timeline-nav-pill');
  const items = document.querySelectorAll('.timeline-item');
  const cards = document.querySelectorAll('.timeline-card');

  if (pills.length > 0) {
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const year = pill.getAttribute('data-target');

        // Update active pill
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        // Scroll to timeline item and highlight
        const targetItem = document.getElementById(`timeline-${year}`);
        if (targetItem) {
          items.forEach(item => item.classList.remove('active-highlight'));
          targetItem.classList.add('active-highlight');
          
          targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });

          // Also auto-expand card drawer on click
          const card = targetItem.querySelector('.timeline-card');
          if (card) {
            cards.forEach(c => c.classList.remove('expanded'));
            card.classList.add('expanded');
          }
        }
      });
    });
  }

  // Card click to expand/collapse details
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Toggle expanded class
      const isExpanded = card.classList.contains('expanded');
      
      // Close other cards
      cards.forEach(c => c.classList.remove('expanded'));
      
      if (!isExpanded) {
        card.classList.add('expanded');
      }
      
      // Highlight parent item
      const parentItem = card.closest('.timeline-item');
      if (parentItem) {
        items.forEach(i => i.classList.remove('active-highlight'));
        parentItem.classList.add('active-highlight');
        
        // Update pill state to match
        const year = parentItem.getAttribute('data-year');
        pills.forEach(p => {
          if (p.getAttribute('data-target') === year) {
            p.classList.add('active');
          } else {
            p.classList.remove('active');
          }
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('mainNavMenu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('mobile-open');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('mobile-open')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });

    // Close menu when clicking any nav link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('mobile-open') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        navMenu.classList.remove('mobile-open');
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    });
  }
}

/* --------------------------------------------------------------------------
   Booking Modal & Interactive Seat Map
   -------------------------------------------------------------------------- */
let selectedSeats = [];
const TICKET_PRICE_PER_SEAT = 850;

function initBookingModal() {
  const modalOverlay = document.getElementById('bookingModal');
  const openButtons = document.querySelectorAll('.btn-trigger-modal');
  const closeButtons = document.querySelectorAll('.modal-close, .btn-close-modal');
  
  const selectedSeatsDisplay = document.getElementById('selectedSeatsDisplay');
  const totalPriceDisplay = document.getElementById('totalPriceDisplay');
  const seatGridItems = document.querySelectorAll('.seat-item:not(.booked)');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const routeInfo = btn.getAttribute('data-route') || 'Jalgaon → Pune';
      const routeTitle = document.getElementById('modalRouteTitle');
      if (routeTitle) routeTitle.textContent = routeInfo;
      
      if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal();
    });
  });

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Seat toggle selection
  seatGridItems.forEach(seat => {
    seat.addEventListener('click', () => {
      const seatNo = seat.getAttribute('data-seat');
      if (seat.classList.contains('selected')) {
        seat.classList.remove('selected');
        selectedSeats = selectedSeats.filter(s => s !== seatNo);
      } else {
        seat.classList.add('selected');
        selectedSeats.push(seatNo);
      }
      updateSeatSummary();
    });
  });

  function updateSeatSummary() {
    if (selectedSeatsDisplay) {
      selectedSeatsDisplay.textContent = selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None';
    }
    if (totalPriceDisplay) {
      const total = selectedSeats.length * TICKET_PRICE_PER_SEAT;
      totalPriceDisplay.textContent = `₹${total}`;
    }
  }

  // Confirm booking button action
  const confirmBtn = document.getElementById('btnConfirmBooking');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (selectedSeats.length === 0) {
        alert('Please select at least one seat/berth before confirming your booking.');
        return;
      }
      alert(`🎉 Ticket Booking Confirmed!\n\nSeats: ${selectedSeats.join(', ')}\nTotal Amount: ₹${selectedSeats.length * TICKET_PRICE_PER_SEAT}\nSMS confirmation sent to your mobile number.`);
      selectedSeats = [];
      seatGridItems.forEach(s => s.classList.remove('selected'));
      updateSeatSummary();
      closeModal();
    });
  }
}

/* --------------------------------------------------------------------------
   Route Search Filter & Quick Ticket Lookup
   -------------------------------------------------------------------------- */
function initRouteSearch() {
  const searchForm = document.getElementById('ticketSearchForm');
  const routeInput = document.getElementById('routeSearchInput');
  const routeCards = document.querySelectorAll('.route-card');
  const routeRows = document.querySelectorAll('.route-table-row');

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fromVal = document.getElementById('fromCity')?.value;
      const toVal = document.getElementById('toCity')?.value;
      
      const modalTrigger = document.querySelector('.btn-trigger-modal');
      if (modalTrigger) {
        modalTrigger.setAttribute('data-route', `${fromVal || 'Jalgaon'} → ${toVal || 'Pune'}`);
        modalTrigger.click();
      }
    });
  }

  if (routeInput) {
    routeInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();

      routeCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(term)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });

      routeRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(term)) {
          row.style.display = 'table-row';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }
}

/* --------------------------------------------------------------------------
   Express Parcel Logistics Live Tracking Simulator
   -------------------------------------------------------------------------- */
function initParcelTracking() {
  const trackingForm = document.getElementById('parcelTrackingForm');
  const trackingResult = document.getElementById('trackingResultBox');

  if (trackingForm && trackingResult) {
    trackingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('trackingWaybillInput')?.value;
      if (!input || input.trim() === '') {
        alert('Please enter a valid Waybill / LR tracking number.');
        return;
      }

      trackingResult.style.display = 'block';
      trackingResult.innerHTML = `
        <div style="background: var(--bg-surface); border: 1.5px solid var(--clr-primary); border-radius: var(--radius-md); padding: 20px; margin-top: 16px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <span style="font-weight: 800; color: var(--clr-dark);">WAYBILL: #${input.toUpperCase()}</span>
            <span style="background: #E6F4EA; color: #137333; font-weight: 700; font-size: 0.8rem; padding: 4px 10px; border-radius: 99px;">IN TRANSIT</span>
          </div>
          <p style="font-size: 0.9rem; color: var(--clr-text); margin-bottom: 6px;"><strong>Origin:</strong> Jalgaon HQ Main Hub → <strong>Destination:</strong> Pune Swargate Branch</p>
          <p style="font-size: 0.85rem; color: var(--clr-muted);"><strong>Status:</strong> Express Parcel loaded on Volvo AC Sleeper #MH-19-BJ-1983. Estimated Arrival today at 07:30 AM.</p>
        </div>
      `;
    });
  }
}
