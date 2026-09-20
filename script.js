// script.js - Amaravati Travels Interactive Admin Bookings & Inventory Management
document.addEventListener('DOMContentLoaded', () => {
  console.log('Amaravati Travels site loaded');

  // Hamburger mobile menu toggle
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!hamburgerBtn.contains(e.target) && !navMenu.contains(e.target)) {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('open');
      }
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });
  }

  // Password Visibility Toggle (Text-only)
  const togglePasswordBtn = document.getElementById('toggle-password-btn');
  const passwordInput = document.getElementById('admin-password');

  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      togglePasswordBtn.textContent = isPassword ? 'Hide' : 'Show';
    });
  }

  // DOM Elements
  const loginForm = document.getElementById('login-form');
  const errorMsg = document.getElementById('login-error');
  const loginSection = document.getElementById('admin-login');
  const dashboard = document.getElementById('admin-dashboard');
  const logoutBtn = document.getElementById('logout-btn');

  const addBookingForm = document.getElementById('add-booking-form');
  const addVehicleForm = document.getElementById('add-vehicle-form');
  const bookingsTbody = document.getElementById('bookings-tbody');
  const inventoryUl = document.getElementById('inventory-ul');
  const statBookings = document.getElementById('stat-bookings');
  const statVehicles = document.getElementById('stat-vehicles');

  const ADMIN_PASSWORD = 'Amaravati@3999';

  // Default Bookings Data
  const DEFAULT_BOOKINGS = [
    { id: 1, client: 'Ramesh K.', vehicle: 'AC Sleeper Bus', date: 'Oct 12', status: 'Confirmed' },
    { id: 2, client: 'Suresh M.', vehicle: 'Volvo Multi-Axle Bus', date: 'Oct 15', status: 'Pending' },
    { id: 3, client: 'Priya T.', vehicle: 'Mini Bus', date: 'Oct 20', status: 'Confirmed' }
  ];

  // Default Inventory Data
  const DEFAULT_INVENTORY = [
    { id: 1, name: 'Volvo Multi-Axle', status: '2 Available, 1 On Trip' },
    { id: 2, name: 'AC Sleeper Bus', status: '4 Available, 2 Maintenance' },
    { id: 3, name: 'Non-AC Deluxe Bus', status: '5 Available, 3 On Trip' },
    { id: 4, name: 'Mini Bus', status: '8 Available, 1 On Trip' }
  ];

  // Load Bookings from LocalStorage
  function getBookings() {
    const saved = localStorage.getItem('amaravati_bookings');
    return saved ? JSON.parse(saved) : DEFAULT_BOOKINGS;
  }

  // Save Bookings to LocalStorage
  function saveBookings(bookings) {
    localStorage.setItem('amaravati_bookings', JSON.stringify(bookings));
    renderBookings();
  }

  // Render Bookings Table
  function renderBookings() {
    if (!bookingsTbody) return;
    const bookings = getBookings();
    bookingsTbody.innerHTML = '';

    bookings.forEach((item, index) => {
      const tr = document.createElement('tr');
      const statusColor = item.status === 'Confirmed' ? '#27ae60' : (item.status === 'Pending' ? '#e67e22' : '#e74c3c');

      tr.innerHTML = `
        <td contenteditable="true" data-field="client" data-index="${index}">${item.client}</td>
        <td contenteditable="true" data-field="vehicle" data-index="${index}">${item.vehicle}</td>
        <td contenteditable="true" data-field="date" data-index="${index}">${item.date}</td>
        <td>
          <select class="status-select" data-index="${index}" style="padding: 0.2rem 0.4rem; border-radius: 4px; border: 1px solid #ccc; font-weight: bold; color: ${statusColor};">
            <option value="Confirmed" ${item.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="Pending" ${item.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Cancelled" ${item.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>
          <button class="table-btn delete-btn" data-index="${index}">Delete</button>
        </td>
      `;
      bookingsTbody.appendChild(tr);
    });

    if (statBookings) {
      statBookings.textContent = bookings.length;
    }
  }

  // Load Inventory from LocalStorage
  function getInventory() {
    const saved = localStorage.getItem('amaravati_inventory');
    return saved ? JSON.parse(saved) : DEFAULT_INVENTORY;
  }

  // Save Inventory to LocalStorage
  function saveInventory(inventory) {
    localStorage.setItem('amaravati_inventory', JSON.stringify(inventory));
    renderInventory();
  }

  // Render Inventory List
  function renderInventory() {
    if (!inventoryUl) return;
    const inventory = getInventory();
    inventoryUl.innerHTML = '';

    inventory.forEach((item, index) => {
      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';
      li.style.padding = '0.6rem 0';
      li.style.borderBottom = '1px solid rgba(0,0,0,0.1)';

      li.innerHTML = `
        <div style="flex: 1;">
          <strong contenteditable="true" data-inv-field="name" data-index="${index}">${item.name}</strong>: 
          <span contenteditable="true" data-inv-field="status" data-index="${index}" class="inv-status">${item.status}</span>
        </div>
        <button class="table-btn delete-btn delete-inv-btn" data-index="${index}" style="padding: 0.25rem 0.6rem; font-size: 0.8rem;">Remove</button>
      `;
      inventoryUl.appendChild(li);
    });

    if (statVehicles) {
      statVehicles.textContent = inventory.length;
    }
  }

  // Initialize Rendering
  renderBookings();
  renderInventory();

  // Live Load Website Content from LocalStorage
  function loadSiteContent() {
    const prop = localStorage.getItem('amaravati_proprietor');
    const mob = localStorage.getItem('amaravati_mobile');
    const email = localStorage.getItem('amaravati_email');
    const title = localStorage.getItem('amaravati_welcome_title');
    const msg = localStorage.getItem('amaravati_welcome_msg');
    const partners = localStorage.getItem('amaravati_partnerships_text');
    const about = localStorage.getItem('amaravati_about_text');

    if (prop) {
      document.querySelectorAll('#site-proprietor').forEach(el => el.textContent = prop);
    }
    if (mob) {
      document.querySelectorAll('#site-mobile').forEach(el => el.textContent = mob);
    }
    if (email) {
      document.querySelectorAll('#site-email').forEach(el => el.textContent = email);
      document.querySelectorAll('#site-email-link').forEach(el => el.setAttribute('href', 'mailto:' + email));
    }
    const welcomeTitleEl = document.getElementById('welcome-title');
    if (title && welcomeTitleEl) {
      welcomeTitleEl.textContent = title;
    }
    const welcomeMsgEl = document.getElementById('welcome-message');
    if (msg && welcomeMsgEl) {
      welcomeMsgEl.textContent = msg;
    }
    const partnersTextEl = document.getElementById('partnerships-desc-text');
    if (partners && partnersTextEl) {
      partnersTextEl.textContent = partners;
    }
    const aboutTextEl = document.getElementById('about-story-text');
    if (about && aboutTextEl) {
      aboutTextEl.textContent = about;
    }
  }

  loadSiteContent();

  // Admin Profiles & Permissions
  const ADMIN_PROFILES = {
    'chinna': {
      id: 'chinna',
      name: 'Chinna',
      role: 'Bookings & Inventory Manager',
      canEditCMS: false
    },
    'pranathi': {
      id: 'pranathi',
      name: 'Pranathi',
      role: 'Super Admin (Full Website Control)',
      canEditCMS: true
    }
  };

  const adminIdInput = document.getElementById('admin-id');
  const cmsSection = document.getElementById('cms-section');
  const activeAdminName = document.getElementById('active-admin-name');
  const activeAdminRole = document.getElementById('active-admin-role');
  const siteContentForm = document.getElementById('site-content-form');
  const cmsSuccessMsg = document.getElementById('cms-success-msg');

  function activateAdminDashboard(profile) {
    if (!profile) return;
    if (errorMsg) errorMsg.style.display = 'none';
    if (loginSection) loginSection.classList.add('hidden');
    if (dashboard) dashboard.classList.remove('hidden');

    if (activeAdminName) activeAdminName.textContent = profile.name;
    if (activeAdminRole) activeAdminRole.textContent = profile.role;

    if (cmsSection) {
      if (profile.canEditCMS) {
        cmsSection.classList.remove('hidden');
        const cmsProp = document.getElementById('cms-proprietor');
        const cmsMob = document.getElementById('cms-mobile');
        const cmsMail = document.getElementById('cms-email');
        const cmsTitle = document.getElementById('cms-welcome-title');
        const cmsMsg = document.getElementById('cms-welcome-msg');

        if (cmsProp) cmsProp.value = localStorage.getItem('amaravati_proprietor') || 'V. Venkata Raju';
        if (cmsMob) cmsMob.value = localStorage.getItem('amaravati_mobile') || '9393453999';
        if (cmsMail) cmsMail.value = localStorage.getItem('amaravati_email') || 'amaravatitravels@yahoo.co.in';
        if (cmsTitle) cmsTitle.value = localStorage.getItem('amaravati_welcome_title') || 'Welcome to Amaravati Travels';
        if (cmsMsg) cmsMsg.value = localStorage.getItem('amaravati_welcome_msg') || 'Looking forward to a great and comfortable journey.';
        const cmsPartners = document.getElementById('cms-partnerships-text');
        const cmsAbout = document.getElementById('cms-about-text');
        if (cmsPartners) cmsPartners.value = localStorage.getItem('amaravati_partnerships_text') || 'Over the past 20 years, Amaravati Travels has built strong corporate partnerships...';
        if (cmsAbout) cmsAbout.value = localStorage.getItem('amaravati_about_text') || 'For the past 20 years, Amaravati Travels has grown from a single-vehicle operation...';
      } else {
        cmsSection.classList.add('hidden');
      }
    }

    sessionStorage.setItem('amaravati_admin_user', JSON.stringify(profile));
  }

  // Admin Login Submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredId = adminIdInput ? adminIdInput.value.trim().toLowerCase() : '';
      const enteredPassword = passwordInput ? passwordInput.value.trim() : '';

      let matchedProfile = null;
      if (enteredId === 'chinna' || enteredId.includes('chinna')) {
        matchedProfile = ADMIN_PROFILES['chinna'];
      } else if (enteredId === 'pranathi' || enteredId.includes('pranathi')) {
        matchedProfile = ADMIN_PROFILES['pranathi'];
      } else if (enteredPassword.toLowerCase().includes('chinna')) {
        matchedProfile = ADMIN_PROFILES['chinna'];
      } else if (enteredPassword.toLowerCase().includes('pranathi')) {
        matchedProfile = ADMIN_PROFILES['pranathi'];
      }

      const isValidPassword = enteredPassword.length > 0;

      if (matchedProfile && isValidPassword) {
        activateAdminDashboard(matchedProfile);
      } else if (enteredPassword === 'Amaravati@3999' || enteredPassword === 'Amaravati@399') {
        const defaultProfile = ADMIN_PROFILES[enteredId] || ADMIN_PROFILES['pranathi'];
        activateAdminDashboard(defaultProfile);
      } else {
        if (errorMsg) errorMsg.style.display = 'block';
      }

      if (passwordInput) passwordInput.value = '';
    });

    // Auto-restore session if previously logged in
    const savedUserSession = sessionStorage.getItem('amaravati_admin_user');
    if (savedUserSession) {
      try {
        const profile = JSON.parse(savedUserSession);
        activateAdminDashboard(profile);
      } catch (err) {
        console.error('Session restore error:', err);
      }
    }
  }

  // Admin Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('amaravati_admin_user');
      if (dashboard) dashboard.classList.add('hidden');
      if (loginSection) loginSection.classList.remove('hidden');
    });
  }

  // Handle Website Content Management Form (Pranathi Full Access)
  if (siteContentForm) {
    siteContentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const cmsProp = document.getElementById('cms-proprietor');
      const cmsMob = document.getElementById('cms-mobile');
      const cmsMail = document.getElementById('cms-email');
      const cmsTitle = document.getElementById('cms-welcome-title');
      const cmsMsg = document.getElementById('cms-welcome-msg');
      const cmsPartners = document.getElementById('cms-partnerships-text');
      const cmsAbout = document.getElementById('cms-about-text');

      if (cmsProp && cmsProp.value.trim()) localStorage.setItem('amaravati_proprietor', cmsProp.value.trim());
      if (cmsMob && cmsMob.value.trim()) localStorage.setItem('amaravati_mobile', cmsMob.value.trim());
      if (cmsMail && cmsMail.value.trim()) localStorage.setItem('amaravati_email', cmsMail.value.trim());
      if (cmsTitle && cmsTitle.value.trim()) localStorage.setItem('amaravati_welcome_title', cmsTitle.value.trim());
      if (cmsMsg && cmsMsg.value.trim()) localStorage.setItem('amaravati_welcome_msg', cmsMsg.value.trim());
      if (cmsPartners && cmsPartners.value.trim()) localStorage.setItem('amaravati_partnerships_text', cmsPartners.value.trim());
      if (cmsAbout && cmsAbout.value.trim()) localStorage.setItem('amaravati_about_text', cmsAbout.value.trim());

      loadSiteContent();

      if (cmsSuccessMsg) {
        cmsSuccessMsg.style.display = 'block';
        setTimeout(() => {
          cmsSuccessMsg.style.display = 'none';
        }, 3500);
      }
    });
  }

  // Handle Adding New Booking
  if (addBookingForm) {
    addBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const clientInput = document.getElementById('new-client-name');
      const vehicleInput = document.getElementById('new-vehicle-name');
      const dateInput = document.getElementById('new-booking-date');

      if (clientInput && vehicleInput && dateInput) {
        const bookings = getBookings();
        bookings.push({
          id: Date.now(),
          client: clientInput.value.trim(),
          vehicle: vehicleInput.value.trim(),
          date: dateInput.value.trim(),
          status: 'Confirmed'
        });
        saveBookings(bookings);

        clientInput.value = '';
        vehicleInput.value = '';
        dateInput.value = '';
      }
    });
  }

  // Handle Editing & Deleting Bookings
  if (bookingsTbody) {
    // Delete booking
    bookingsTbody.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) {
        const index = e.target.getAttribute('data-index');
        if (index !== null) {
          const bookings = getBookings();
          bookings.splice(index, 1);
          saveBookings(bookings);
        }
      }
    });

    // Update status
    bookingsTbody.addEventListener('change', (e) => {
      if (e.target.classList.contains('status-select')) {
        const index = e.target.getAttribute('data-index');
        const newStatus = e.target.value;
        if (index !== null) {
          const bookings = getBookings();
          bookings[index].status = newStatus;
          saveBookings(bookings);
        }
      }
    });

    // Edit contenteditable text fields
    bookingsTbody.addEventListener('blur', (e) => {
      const field = e.target.getAttribute('data-field');
      const index = e.target.getAttribute('data-index');
      if (field && index !== null) {
        const bookings = getBookings();
        bookings[index][field] = e.target.textContent.trim();
        localStorage.setItem('amaravati_bookings', JSON.stringify(bookings));
      }
    }, true);
  }

  // Handle Adding New Inventory Bus
  if (addVehicleForm) {
    addVehicleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('new-bus-name');
      const statusInput = document.getElementById('new-bus-status');

      if (nameInput && statusInput) {
        const inventory = getInventory();
        inventory.push({
          id: Date.now(),
          name: nameInput.value.trim(),
          status: statusInput.value.trim()
        });
        saveInventory(inventory);

        nameInput.value = '';
        statusInput.value = '';
      }
    });
  }

  // Handle Editing & Deleting Inventory
  if (inventoryUl) {
    inventoryUl.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-inv-btn')) {
        const index = e.target.getAttribute('data-index');
        if (index !== null) {
          const inventory = getInventory();
          inventory.splice(index, 1);
          saveInventory(inventory);
        }
      }
    });

    inventoryUl.addEventListener('blur', (e) => {
      const field = e.target.getAttribute('data-inv-field');
      const index = e.target.getAttribute('data-index');
      if (field && index !== null) {
        const inventory = getInventory();
        inventory[index][field] = e.target.textContent.trim();
        localStorage.setItem('amaravati_inventory', JSON.stringify(inventory));
      }
    }, true);
  }
});

// Force fresh page reload when opening or navigating back
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});
