/* ==========================================================================
   Sangitam Travels (Established 1983)
   Interactive Scrollytelling & Visual Lounge Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollytellingEngine();
  initCabinExplorer();
  initInteractiveRouteMap();
  initVisualSeatMap();
  initMultitoolTabs();
  initModalControls();
  initFormSubmissions();
});

/* 1. CONTINUOUS SCROLLYTELLING MOTION ENGINE */
function initScrollytellingEngine() {
  const layerSky = document.querySelector('.layer-sky');
  const layerMountains = document.querySelector('.layer-mountains');
  const progressFill = document.querySelector('.journey-progress-fill');

  let ticking = false;

  function updateScrollytelling() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = maxScroll > 0 ? Math.min(Math.max(scrollTop / maxScroll, 0), 1) : 0;

    // Progress Bar
    if (progressFill) {
      progressFill.style.width = `${scrollFraction * 100}%`;
    }

    // Dynamic Parallax Motion
    if (layerSky) {
      layerSky.style.transform = `scale(${1 + scrollFraction * 0.15}) translateY(-${scrollFraction * 60}px)`;
    }
    if (layerMountains) {
      layerMountains.style.transform = `scale(${1.1 - scrollFraction * 0.08}) translateY(-${scrollFraction * 120}px)`;
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollytelling);
      ticking = true;
    }
  }, { passive: true });

  updateScrollytelling();
}

/* 2. CHAPTER II: INTERACTIVE CABIN EXPLORER */
function initCabinExplorer() {
  const cabinImg = document.getElementById('cabinStageImg');
  const cabinTitle = document.getElementById('cabinStageTitle');
  const cabinDesc = document.getElementById('cabinStageDesc');
  const viewTabs = document.querySelectorAll('.view-tab-btn');

  const cabinViews = {
    upper: {
      img: 'images/dest_swiss.png',
      title: 'Upper Sleeper Berth Suite',
      desc: 'Ergonomic plush sleeper berth equipped with personal reading light, dual USB charging ports, privacy curtains, and individual AC vents.'
    },
    lower: {
      img: 'images/dest_konkan.png',
      title: 'Lower Sleeper Suite',
      desc: 'Easy-access lower deck sleeper berth featuring air-suspension comfort, extra legroom, bottled water holder, and wide panoramic windows.'
    },
    cockpit: {
      img: 'images/dest_ajanta.png',
      title: 'Scania Multi-Axle Cockpit & Safety Desk',
      desc: 'State-of-the-art driver cockpit equipped with dual GPS live tracking radar, electronic speed governors, and emergency braking assistance.'
    }
  };

  viewTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      viewTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const viewKey = tab.getAttribute('data-view');
      const viewData = cabinViews[viewKey];

      if (viewData && cabinImg) {
        cabinImg.style.opacity = '0.3';
        setTimeout(() => {
          cabinImg.src = viewData.img;
          if (cabinTitle) cabinTitle.textContent = viewData.title;
          if (cabinDesc) cabinDesc.textContent = viewData.desc;
          cabinImg.style.opacity = '1';
        }, 200);
      }
    });
  });
}

/* 3. CHAPTER III: INTERACTIVE MAHARASHTRA TOPOLOGICAL MAP */
function initInteractiveRouteMap() {
  const cityBtns = document.querySelectorAll('.city-node-btn');
  const mapTitle = document.getElementById('mapRouteTitle');
  const mapMeta = document.getElementById('mapRouteMeta');
  const mapDesc = document.getElementById('mapRouteDesc');

  const routeDetails = {
    jalgaon: {
      title: 'Jalgaon (Sangitam Head Office)',
      meta: 'Origin Hub • 8 Daily Services to Pune & Mumbai',
      desc: 'Sangitam Travels was born in Jalgaon in 1983. Operating daily premium AC sleeper coaches from Lewa Boarding Complex to Pune, Mumbai, Nashik, and Surat.'
    },
    pune: {
      title: 'Pune (Corporate Office - Rahatani)',
      meta: 'Primary Destination • 12 Daily Services',
      desc: 'Connecting Pune Garden Plaza (Jagtap Dairy) directly to Jalgaon, Bhusawal, Sambhajinagar, and Nagpur with non-stop luxury sleeper coaches.'
    },
    nashik: {
      title: 'Nashik Hub',
      meta: 'Inter-City Connection • 6 Daily Services',
      desc: 'Connecting Nashik Dwarka Circle to Jalgaon and Marathwada routes with high-speed Multi-Axle sleeper coaches.'
    },
    sambhajinagar: {
      title: 'Aurangabad (Sambhajinagar)',
      meta: 'Marathwada Gateway • 10 Daily Services',
      desc: 'Connecting Sambhajinagar to Pune, Jalgaon, and Nagpur with daily AC sleeper sleeper coaches.'
    },
    mumbai: {
      title: 'Mumbai Region Hub',
      meta: 'Metropolitan Terminal • 5 Daily Services',
      desc: 'Daily premium overnight sleeper coaches connecting Mumbai Dadar and Thane to Jalgaon and North Maharashtra.'
    }
  };

  cityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cityBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cityKey = btn.getAttribute('data-city');
      const data = routeDetails[cityKey];

      if (data && mapTitle) {
        mapTitle.textContent = data.title;
        if (mapMeta) mapMeta.textContent = data.meta;
        if (mapDesc) mapDesc.textContent = data.desc;
      }
    });
  });
}

/* 4. CHAPTER IV: LIVE SEAT MAP SELECTOR */
function initVisualSeatMap() {
  const berths = document.querySelectorAll('.berth-cell:not(.booked)');
  const seatSummary = document.getElementById('selectedSeatSummary');
  const bookSeatBtn = document.getElementById('btnBookSelectedSeat');

  let selectedSeats = [];

  berths.forEach(berth => {
    berth.addEventListener('click', () => {
      const seatNo = berth.getAttribute('data-seat');

      if (berth.classList.contains('selected')) {
        berth.classList.remove('selected');
        selectedSeats = selectedSeats.filter(s => s !== seatNo);
      } else {
        berth.classList.add('selected');
        selectedSeats.push(seatNo);
      }

      if (seatSummary) {
        if (selectedSeats.length > 0) {
          const totalFare = selectedSeats.length * 950;
          seatSummary.textContent = `Selected Seats: ${selectedSeats.join(', ')} (Total: ₹${totalFare})`;
          if (bookSeatBtn) bookSeatBtn.style.display = 'inline-flex';
        } else {
          seatSummary.textContent = 'Click on any available berth to select your seat.';
          if (bookSeatBtn) bookSeatBtn.style.display = 'none';
        }
      }
    });
  });

  if (bookSeatBtn) {
    bookSeatBtn.addEventListener('click', () => {
      if (selectedSeats.length === 0) return;
      openSangitamModal(`Confirm Booking for Seats: ${selectedSeats.join(', ')}`, `Total Amount: ₹${selectedSeats.length * 950}. Enter passenger details below to reserve.`);
    });
  }
}

/* 5. MULTI-TOOL TABS */
function initMultitoolTabs() {
  const tabBtns = document.querySelectorAll('.multitool-tab-btn');
  const panels = document.querySelectorAll('.multitool-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');

      panels.forEach(panel => {
        if (panel.id === targetTab) {
          panel.style.display = 'block';
        } else {
          panel.style.display = 'none';
        }
      });
    });
  });
}

/* 6. FORM SUBMISSIONS */
function initFormSubmissions() {
  const bookingForm = document.getElementById('sangitamBookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const from = document.getElementById('bookFrom').value;
      const to = document.getElementById('bookTo').value;
      const date = document.getElementById('bookDate').value;

      if (!from || !to) {
        showSangitamToast('Please select both Origin and Destination cities.', 'warning');
        return;
      }

      openSangitamModal(`Sangitam Service Search: ${from} to ${to}`, `Daily AC Sleeper Coaches for ${date || 'Today'}. Select seats below.`);
    });
  }

  const busTrackForm = document.getElementById('busTrackForm');
  if (busTrackForm) {
    busTrackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pnr = document.getElementById('trackPnrInput').value;
      if (!pnr) return;
      openSangitamModal(`Live GPS Status: PNR ${pnr}`, `Status: Coach MH-19-BJ-1983 is En Route. Passed Ahmednagar at 22:40. ETA Pune: 05:30 AM.`);
    });
  }

  const parcelTrackForm = document.getElementById('parcelTrackForm');
  if (parcelTrackForm) {
    parcelTrackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const lrNo = document.getElementById('trackLrInput').value;
      if (!lrNo) return;
      openSangitamModal(`Parcel Status: Waybill ${lrNo}`, `Status: Arrived at Sangitam Pune Corporate Warehouse (Rahatani). Ready for dispatch.`);
    });
  }
}

/* 7. MODAL CONTROLS */
function initModalControls() {
  const modalOverlay = document.getElementById('sangitamModal');
  const closeBtn = document.querySelector('.modal-close-cross');
  const modalForm = document.getElementById('modalContactForm');

  document.querySelectorAll('.btn-trigger-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-title') || 'Sangitam Customer Support';
      openSangitamModal(title, 'Enter your details below and our Jalgaon & Pune support desk will assist you immediately.');
    });
  });

  if (closeBtn && modalOverlay) {
    closeBtn.addEventListener('click', closeSangitamModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeSangitamModal();
    });
  }

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeSangitamModal();
      showSangitamToast('Thank you! Your Sangitam Travels booking request has been submitted.', 'success');
      modalForm.reset();
    });
  }
}

function openSangitamModal(title, subtitle) {
  const modalOverlay = document.getElementById('sangitamModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');

  if (modalTitle) modalTitle.textContent = title;
  if (modalSubtitle) modalSubtitle.textContent = subtitle;
  if (modalOverlay) modalOverlay.classList.add('active');
}

function closeSangitamModal() {
  const modalOverlay = document.getElementById('sangitamModal');
  if (modalOverlay) modalOverlay.classList.remove('active');
}

/* 8. TOAST NOTIFICATION */
function showSangitamToast(message, type = 'info') {
  let toast = document.getElementById('sangitamToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'sangitamToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: #FFFFFF;
      color: var(--clr-ink-dark);
      border: 1.5px solid var(--clr-wax-red);
      padding: 18px 28px;
      border-radius: 6px;
      box-shadow: 0 15px 40px rgba(0,0,0,0.2);
      z-index: 3000;
      display: flex;
      align-items: center;
      gap: 14px;
      font-family: var(--font-sub-serif);
      font-size: 0.92rem;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    document.body.appendChild(toast);
  }

  const badgeIcon = type === 'success' ? '★' : '✦';
  toast.innerHTML = `<span style="background: var(--clr-wax-red); color: #FFFFFF; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">${badgeIcon}</span> <span>${message}</span>`;

  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
  }, 4500);
}
