/* ==========================================================================
   Sangitam Travels — Mobile-First Interactive Engine
   Handles Mobile Navigation Drawer, Scrollytelling, Seat Selector & Modals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. MOBILE DRAWER NAVIGATION MENU TOGGLE
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('modernNavMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('mobile-open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('mobile-open')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('mobile-open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    });
  }

  // 2. JOURNEY PROGRESS BAR SCROLL INDICATOR
  window.addEventListener('scroll', () => {
    const progressFill = document.querySelector('.journey-progress-fill');
    if (progressFill) {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const pct = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      progressFill.style.width = `${pct}%`;
    }
  }, { passive: true });

  // 3. MULTI-TOOL LOUNGE TAB SWITCHER
  const tabBtns = document.querySelectorAll('.multitool-tab-btn');
  const tabPanels = document.querySelectorAll('.multitool-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.style.display = 'none');

      btn.classList.add('active');
      const activePanel = document.getElementById(targetTab);
      if (activePanel) {
        activePanel.style.display = 'block';
      }
    });
  });

  // 4. TOPOLOGICAL ROUTE MAP CITY INSPECTOR
  const cityBtns = document.querySelectorAll('.city-node-btn');
  const mapRouteTitle = document.getElementById('mapRouteTitle');
  const mapRouteMeta = document.getElementById('mapRouteMeta');
  const mapRouteDesc = document.getElementById('mapRouteDesc');

  const cityData = {
    jalgaon: {
      title: 'Jalgaon (Sangitam Head Office)',
      meta: 'Origin Hub • 8 Daily Services to Pune & Mumbai',
      desc: 'Sangitam Travels was born in Jalgaon in 1983. Operating daily premium AC sleeper coaches from Lewa Boarding Complex to Pune, Mumbai, Nashik, and Surat.'
    },
    pune: {
      title: 'Pune (Corporate Office Hub)',
      meta: 'Major Regional Terminal • 12 Daily Services',
      desc: 'Connecting Pune Rahatani & Swargate hubs directly with Jalgaon, Bhusawal, Sambhajinagar, and Vidarbha regions with multi-axle luxury sleepers.'
    },
    nashik: {
      title: 'Nashik (Dwarka Circle Hub)',
      meta: 'Inter-City Terminal • 6 Daily Services',
      desc: 'Frequent daily sleeper departures connecting Nashik Dwarka Circle to Jalgaon, Dhule, and Pune.'
    },
    sambhajinagar: {
      title: 'Aurangabad / Sambhajinagar',
      meta: 'Heritage Terminal • 5 Daily Services',
      desc: 'Connecting the historic city of Sambhajinagar to North Maharashtra and Western Ghats routes.'
    },
    mumbai: {
      title: 'Mumbai Region (Borivali / Dadar)',
      meta: 'Express Terminal • 8 Daily Services',
      desc: 'Overnight luxury sleeper departures from Mumbai Suburban boarding points straight to Jalgaon and Khandesh.'
    }
  };

  cityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cityKey = btn.getAttribute('data-city');
      cityBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (cityData[cityKey] && mapRouteTitle) {
        mapRouteTitle.textContent = cityData[cityKey].title;
        mapRouteMeta.textContent = cityData[cityKey].meta;
        mapRouteDesc.textContent = cityData[cityKey].desc;
      }
    });
  });

  // 5. SEAT LOUNGE BERTH SELECTOR
  const berthCells = document.querySelectorAll('.berth-cell:not(.booked)');
  const selectedSeatSummary = document.getElementById('selectedSeatSummary');
  const btnBookSelectedSeat = document.getElementById('btnBookSelectedSeat');
  let selectedSeat = null;

  berthCells.forEach(cell => {
    cell.addEventListener('click', () => {
      berthCells.forEach(c => c.classList.remove('selected'));
      cell.classList.add('selected');

      selectedSeat = cell.getAttribute('data-seat');
      if (selectedSeatSummary) {
        selectedSeatSummary.innerHTML = `<i class="fas fa-check-circle"></i> Selected Berth: <strong>${selectedSeat}</strong> (AC Sleeper — ₹950)`;
      }
      if (btnBookSelectedSeat) {
        btnBookSelectedSeat.style.display = 'inline-flex';
      }
    });
  });

  if (btnBookSelectedSeat) {
    btnBookSelectedSeat.addEventListener('click', () => {
      if (selectedSeat) {
        openModal(`Book Berth ${selectedSeat}`, `Complete booking for AC Sleeper Berth ${selectedSeat} (₹950).`);
      }
    });
  }

  // 6. MODAL DIALOG ENGINE
  const modal = document.getElementById('sangitamModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalClose = document.querySelector('.modal-close-cross');
  const triggerBtns = document.querySelectorAll('.btn-trigger-modal');
  const modalForm = document.getElementById('modalContactForm');

  function openModal(title, subtitle) {
    if (modal) {
      if (modalTitle) modalTitle.textContent = title || 'Sangitam Support';
      if (modalSubtitle) modalSubtitle.textContent = subtitle || 'Enter your mobile number below.';
      modal.classList.add('active');
    }
  }

  function closeModal() {
    if (modal) modal.classList.remove('active');
  }

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title') || 'Book Ticket';
      openModal(title, 'Quick reservation assistance via Sangitam Travels.');
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! Your request has been received. Sangitam Travels representative will contact you shortly.');
      closeModal();
      modalForm.reset();
    });
  }

});
