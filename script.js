// script.js - Amaravati Travels CMS & Admin Management System
document.addEventListener('DOMContentLoaded', () => {
  console.log('Amaravati Travels site loaded');

  // DOM Elements
  const loginForm = document.getElementById('login-form');
  const passwordInput = document.getElementById('admin-password');
  const errorMsg = document.getElementById('login-error');
  const loginSection = document.getElementById('admin-login');
  const dashboard = document.getElementById('admin-dashboard');
  const logoutBtn = document.getElementById('logout-btn');

  const cmsForm = document.getElementById('cms-settings-form');
  const cmsWelcomeTitle = document.getElementById('cms-welcome-title');
  const cmsWelcomeMsg = document.getElementById('cms-welcome-message');
  const cmsProprietor = document.getElementById('cms-proprietor');
  const cmsMobile = document.getElementById('cms-mobile');
  const cmsEmail = document.getElementById('cms-email');
  const cmsStatusMsg = document.getElementById('cms-status-msg');

  const addBookingForm = document.getElementById('add-booking-form');
  const addVehicleForm = document.getElementById('add-vehicle-form');
  const bookingsTbody = document.getElementById('bookings-tbody');
  const inventoryUl = document.getElementById('inventory-ul');

  const ADMIN_PASSWORD = 'Amaravati@3999';

  // Default Website Settings
  const DEFAULT_SETTINGS = {
    welcomeTitle: 'Welcome to Amaravati Travels',
    welcomeMessage: 'Looking forward to a great and comfortable journey.',
    proprietor: 'V. Venkata Raju',
    mobile: '9393453999',
    email: 'amaravatitravels@yahoo.co.in'
  };

  // Load Settings from LocalStorage & Apply to DOM
  function applyWebsiteSettings() {
    const savedSettings = JSON.parse(localStorage.getItem('amaravati_settings')) || DEFAULT_SETTINGS;

    // Update Top Info Header Elements across pages
    const elProprietor = document.getElementById('site-proprietor');
    const elMobile = document.getElementById('site-mobile');
    const elEmail = document.getElementById('site-email');
    const elEmailLink = document.getElementById('site-email-link');

    if (elProprietor) elProprietor.textContent = savedSettings.proprietor;
    if (elMobile) elMobile.textContent = savedSettings.mobile;
    if (elEmail) elEmail.textContent = savedSettings.email;
    if (elEmailLink) elEmailLink.href = 'mailto:' + savedSettings.email;

    // Update Welcome Banner in index.html
    const elWelcomeTitle = document.getElementById('welcome-title');
    const elWelcomeMessage = document.getElementById('welcome-message');

    if (elWelcomeTitle) elWelcomeTitle.textContent = savedSettings.welcomeTitle;
    if (elWelcomeMessage) elWelcomeMessage.textContent = savedSettings.welcomeMessage;

    // Populate CMS Admin Form inputs if present
    if (cmsWelcomeTitle) cmsWelcomeTitle.value = savedSettings.welcomeTitle;
    if (cmsWelcomeMsg) cmsWelcomeMsg.value = savedSettings.welcomeMessage;
    if (cmsProprietor) cmsProprietor.value = savedSettings.proprietor;
    if (cmsMobile) cmsMobile.value = savedSettings.mobile;
    if (cmsEmail) cmsEmail.value = savedSettings.email;
  }

  // Initialize Website Settings on Page Load
  applyWebsiteSettings();

  // Admin Login Submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = passwordInput.value.trim();
      if (entered === ADMIN_PASSWORD) {
        if (errorMsg) errorMsg.style.display = 'none';
        if (loginSection) loginSection.classList.add('hidden');
        if (dashboard) dashboard.classList.remove('hidden');
        sessionStorage.setItem('amaravati_admin_logged', 'true');
      } else {
        if (errorMsg) errorMsg.style.display = 'block';
      }
      passwordInput.value = '';
    });

    // Auto-restore session if previously logged in
    if (sessionStorage.getItem('amaravati_admin_logged') === 'true') {
      if (loginSection) loginSection.classList.add('hidden');
      if (dashboard) dashboard.classList.remove('hidden');
    }
  }

  // Admin Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('amaravati_admin_logged');
      if (dashboard) dashboard.classList.add('hidden');
      if (loginSection) loginSection.classList.remove('hidden');
    });
  }

  // Handle CMS Form Save (Live Website Edits)
  if (cmsForm) {
    cmsForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const newSettings = {
        welcomeTitle: cmsWelcomeTitle.value.trim(),
        welcomeMessage: cmsWelcomeMsg.value.trim(),
        proprietor: cmsProprietor.value.trim(),
        mobile: cmsMobile.value.trim(),
        email: cmsEmail.value.trim()
      };

      localStorage.setItem('amaravati_settings', JSON.stringify(newSettings));
      applyWebsiteSettings();

      if (cmsStatusMsg) {
        cmsStatusMsg.style.display = 'block';
        setTimeout(() => {
          cmsStatusMsg.style.display = 'none';
        }, 4000);
      }
    });
  }

  // Handle Add New Booking Entry
  if (addBookingForm && bookingsTbody) {
    addBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const clientName = document.getElementById('new-client-name').value.trim();
      const vehicleName = document.getElementById('new-vehicle-name').value.trim();
      const dateVal = document.getElementById('new-booking-date').value.trim();

      if (clientName && vehicleName && dateVal) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${clientName}</td><td>${vehicleName}</td><td>${dateVal}</td><td><span style="color:green;">Confirmed</span></td><td><button class="table-btn delete-btn">Cancel</button></td>`;
        bookingsTbody.appendChild(tr);

        document.getElementById('new-client-name').value = '';
        document.getElementById('new-vehicle-name').value = '';
        document.getElementById('new-booking-date').value = '';

        // Update booking stat badge count
        const statBookings = document.getElementById('stat-bookings');
        if (statBookings) {
          const currentCount = parseInt(statBookings.textContent) || 24;
          statBookings.textContent = currentCount + 1;
        }
      }
    });

    // Handle Approve / Cancel Buttons on Bookings Table
    bookingsTbody.addEventListener('click', (e) => {
      if (e.target.classList.contains('approve-btn')) {
        const tdStatus = e.target.parentElement.previousElementSibling;
        if (tdStatus) {
          tdStatus.innerHTML = '<span style="color:green;">Confirmed</span>';
        }
        e.target.remove();
      } else if (e.target.classList.contains('delete-btn')) {
        const tr = e.target.closest('tr');
        if (tr) tr.remove();
      }
    });
  }

  // Handle Add New Fleet Bus Entry
  if (addVehicleForm && inventoryUl) {
    addVehicleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const busName = document.getElementById('new-bus-name').value.trim();
      const busStatus = document.getElementById('new-bus-status').value.trim();

      if (busName && busStatus) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${busName}:</strong> <span class="inv-status">${busStatus}</span>`;
        inventoryUl.appendChild(li);

        document.getElementById('new-bus-name').value = '';
        document.getElementById('new-bus-status').value = '';

        // Update vehicle stat badge count
        const statVehicles = document.getElementById('stat-vehicles');
        if (statVehicles) {
          const currentCount = parseInt(statVehicles.textContent) || 12;
          statVehicles.textContent = currentCount + 1;
        }
      }
    });
  }
});
