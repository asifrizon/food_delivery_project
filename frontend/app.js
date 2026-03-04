const API_URL = "http://localhost:3000/api/restaurants";

function renderRestaurants(restaurants) {
    const grid = document.getElementById("restaurantGrid");
    if (!grid) {
        console.error("restaurantGrid not found!");
        return;
    }

    grid.innerHTML = "";

    const uniqueRestaurants = [];
    const seenIds = new Set();

    restaurants.forEach(restaurant => {
        if (!seenIds.has(restaurant.restaurant_id)) {
            seenIds.add(restaurant.restaurant_id);
            uniqueRestaurants.push(restaurant);
        }
    });

    uniqueRestaurants.forEach((r) => {
        const card = document.createElement('div');
        card.className = 'restaurant-card';

        let discountBadge = "";
        if (r.offer_value && r.offer_type) {
            const offerVal = parseFloat(r.offer_value);
            if (r.offer_type === 'percentage') {
                discountBadge = `${offerVal}% OFF`;
            } else if (r.offer_type === 'flat') {
                discountBadge = `৳${offerVal} OFF`;
            }
        }

        card.innerHTML = `
    <div class="image-wrapper">
        ${discountBadge ? `<span class="discount-badge">${discountBadge}</span>` : ""}
        <img src="${ImageHelper.getRestaurantImage(r)}" 
             alt="${r.name}"
             onerror="this.onerror=null; this.src='image/food_2.png';">
    </div>
    <div class="card-body">
        <h3>${r.name}</h3>
        <p>📍 ${r.police_station}</p>
        <span>⭐ ${r.rating}</span>
    </div>
`;

        card.addEventListener('click', () => {
            sessionStorage.setItem('selectedRestaurant', JSON.stringify(r));
            window.location.href = 'menu.html';
        });

        grid.appendChild(card);
    });
}

// ===========================
// Modal Initialization
// ===========================
function initializeModals() {
    const profileIcon = document.getElementById('profile-icon');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');

    if (!profileIcon || !loginModal || !signupModal) return;

    profileIcon.addEventListener('click', function () {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.role === 'customer') {
            // Already logged in — open address manager instead
            openAddressManagerModal();
        } else {
            loginModal.style.display = 'block';
        }
    });

    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function () {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
        });
    });

    document.getElementById('switchToSignup')?.addEventListener('click', function () {
        loginModal.style.display = 'none';
        signupModal.style.display = 'block';
    });

    document.getElementById('switchToLogin')?.addEventListener('click', function () {
        signupModal.style.display = 'none';
        loginModal.style.display = 'block';
    });

    window.onclick = function (event) {
        if (event.target === loginModal) loginModal.style.display = 'none';
        if (event.target === signupModal) signupModal.style.display = 'none';
    };

    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        const roleSelect = document.getElementById('role');
        const riderFields = document.getElementById('riderFields');

        roleSelect?.addEventListener('change', function () {
            if (this.value === 'rider') {
                riderFields.style.display = 'block';
                ['vehicleType', 'vehicleNumber', 'licenseNumber', 'nidNumber'].forEach(id => {
                    document.getElementById(id).required = true;
                });
            } else {
                riderFields.style.display = 'none';
                ['vehicleType', 'vehicleNumber', 'licenseNumber', 'nidNumber'].forEach(id => {
                    document.getElementById(id).required = false;
                });
            }
        });

        signupForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const username = document.getElementById('newUsername').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('newPassword').value;
            const role = document.getElementById('role').value;
            const city = document.getElementById('city').value;
            const thana = document.getElementById('thana').value;
            const addressDetails = document.getElementById('addressDetails').value;

            // Build user payload for API
            const userPayload = { username, email, phone, password, role };

            if (role === 'rider') {
                userPayload.vehicleType = document.getElementById('vehicleType').value;
                userPayload.vehicleNumber = document.getElementById('vehicleNumber').value;
                userPayload.licenseNumber = document.getElementById('licenseNumber').value;
                userPayload.nidNumber = document.getElementById('nidNumber').value;
                userPayload.emergencyContact = document.getElementById('emergencyContact').value;
            }

            try {
                // Step 1: Register user
                const userRes = await fetch('http://localhost:3000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userPayload)
                });
                const userResult = await userRes.json();

                if (!userRes.ok) throw new Error(userResult.message || 'Registration failed');

                const userData = userResult.data || userResult.user || userResult;
                const userId = userData.user_id || userData.id;

                // Step 2: Save the address separately (one-to-many)
                if (role === 'customer' || role === 'rider') {
                    const addressPayload = {
                        user_id: userId,
                        city,
                        thana,
                        address_details: addressDetails,
                        is_default: true
                    };

                    const addrRes = await fetch('http://localhost:3000/api/addresses', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(addressPayload)
                    });
                    const addrResult = await addrRes.json();
                    const savedAddress = addrResult.data || addrResult;

                    // Store address in cache
                    localStorage.setItem('gorom_user_addresses', JSON.stringify([savedAddress]));

                    // Set as the selected delivery address
                    AddressManager.setSelectedAddress(savedAddress);
                }

                // Step 3: Store user session (without embedding address — it lives in the DB)
                const sessionUser = {
                    user_id: userId,
                    username,
                    email,
                    phone,
                    role,
                    // Keep city/thana just for display in header
                    city,
                    thana
                };
                if (role === 'rider') {
                    Object.assign(sessionUser, {
                        vehicleType: userPayload.vehicleType,
                        vehicleNumber: userPayload.vehicleNumber,
                        licenseNumber: userPayload.licenseNumber,
                        nidNumber: userPayload.nidNumber,
                        emergencyContact: userPayload.emergencyContact,
                        riderRating: 5.0,
                        totalDeliveries: 0
                    });
                }

                localStorage.setItem('currentUser', JSON.stringify(sessionUser));
                signupModal.style.display = 'none';

                if (role === 'owner') {
                    alert('Account created! Redirecting to Owner Dashboard...');
                    window.location.href = 'owner-dashboard.html';
                } else if (role === 'rider') {
                    alert('Account created! Redirecting to Rider Dashboard...');
                    window.location.href = 'rider-dashboard.html';
                } else {
                    displayUserProfile(sessionUser);
                    alert('Account created successfully!');
                }

            } catch (error) {
                console.error('Signup error:', error);
                // Fallback: store locally without API
                const fallbackUser = {
                    username, email, phone, role, city, thana,
                    user_id: Date.now()
                };
                localStorage.setItem('currentUser', JSON.stringify(fallbackUser));
                const fallbackAddr = { city, thana, address_details: addressDetails, is_default: true, address_id: Date.now() };
                localStorage.setItem('gorom_user_addresses', JSON.stringify([fallbackAddr]));
                AddressManager.setSelectedAddress(fallbackAddr);

                signupModal.style.display = 'none';
                if (role === 'owner') {
                    window.location.href = 'owner-dashboard.html';
                } else if (role === 'rider') {
                    window.location.href = 'rider-dashboard.html';
                } else {
                    displayUserProfile(fallbackUser);
                }
            }
        });
    }

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('loginRole').value;

            try {
                const res = await fetch('http://localhost:3000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, role })
                });
                const result = await res.json();

                if (!res.ok) throw new Error(result.message || 'Login failed');

                const userData = result.data || result.user || result;
                localStorage.setItem('currentUser', JSON.stringify(userData));

                // Fetch and cache this user's addresses
                if (userData.user_id) {
                    const addresses = await AddressManager.fetchAddresses(userData.user_id);
                    // Auto-select the default address if available
                    const defaultAddr = addresses.find(a => a.is_default) || addresses[0];
                    if (defaultAddr) AddressManager.setSelectedAddress(defaultAddr);

                    // Update header display city/thana from their default address
                    if (defaultAddr) {
                        userData.city = defaultAddr.city;
                        userData.thana = defaultAddr.thana;
                        localStorage.setItem('currentUser', JSON.stringify(userData));
                    }
                }

                loginModal.style.display = 'none';

                if (userData.role === 'owner') {
                    alert('Logged in! Redirecting to Owner Dashboard...');
                    window.location.href = 'owner-dashboard.html';
                } else if (userData.role === 'rider') {
                    alert('Logged in! Redirecting to Rider Dashboard...');
                    window.location.href = 'rider-dashboard.html';
                } else {
                    displayUserProfile(userData);
                    alert('Logged in successfully!');
                }

            } catch (error) {
                console.error('Login error:', error);
                // Fallback mock login
                const mockUser = { username, role, city: 'Dhaka', thana: 'Mirpur', user_id: null };
                localStorage.setItem('currentUser', JSON.stringify(mockUser));
                loginModal.style.display = 'none';

                if (role === 'owner') {
                    window.location.href = 'owner-dashboard.html';
                } else if (role === 'rider') {
                    window.location.href = 'rider-dashboard.html';
                } else {
                    displayUserProfile(mockUser);
                }
            }
        });
    }

    checkUserLogin();
}

// ===========================
// Address Manager Modal (for logged-in customers)
// ===========================
function openAddressManagerModal() {
    // Remove existing if any
    const existing = document.getElementById('addressManagerModal');
    if (existing) existing.remove();

    const user = JSON.parse(localStorage.getItem('currentUser'));
    const addresses = AddressManager.getCachedAddresses();
    const selectedAddr = AddressManager.getSelectedAddress();

    const modal = document.createElement('div');
    modal.id = 'addressManagerModal';
    modal.className = 'modal';
    modal.style.display = 'block';

    modal.innerHTML = `
        <div class="modal-content" style="max-width: 520px; max-height: 80vh; overflow-y: auto;">
            <span class="close" id="closeAddrModal">&times;</span>
            <h2 style="margin-bottom: 20px;"><i class="fas fa-map-marker-alt" style="color: #FF7A00;"></i> My Delivery Addresses</h2>

            <div id="addressList" style="margin-bottom: 20px;">
                ${renderAddressList(addresses, selectedAddr)}
            </div>

            <hr style="margin: 20px 0; border-color: #e5e7eb;">
            <h3 style="margin-bottom: 15px; font-size: 1rem; color: #1a1a2e;">
                <i class="fas fa-plus-circle" style="color: #FF7A00;"></i> Add New Address
            </h3>

            <form id="newAddressForm">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div>
                        <label style="font-size: 0.85rem; font-weight: 500; color: #4b5563; display: block; margin-bottom: 4px;">City *</label>
                        <select id="newCity" required style="width:100%; padding: 8px 10px; border: 1.5px solid #e5e7eb; border-radius: 6px; font-family: inherit; font-size: 0.9rem;">
                            <option value="">Select City</option>
                            ${['Dhaka','Chittagong','Sylhet','Rajshahi','Khulna','Barisal','Rangpur','Mymensingh'].map(c => `<option>${c}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label style="font-size: 0.85rem; font-weight: 500; color: #4b5563; display: block; margin-bottom: 4px;">Thana *</label>
                        <input type="text" id="newThana" required placeholder="e.g. Mirpur" style="width:100%; padding: 8px 10px; border: 1.5px solid #e5e7eb; border-radius: 6px; font-family: inherit; font-size: 0.9rem;">
                    </div>
                </div>
                <div style="margin-top: 12px;">
                    <label style="font-size: 0.85rem; font-weight: 500; color: #4b5563; display: block; margin-bottom: 4px;">Address Details *</label>
                    <textarea id="newAddressDetails" required placeholder="House/Flat No, Road, Area" rows="2" style="width:100%; padding: 8px 10px; border: 1.5px solid #e5e7eb; border-radius: 6px; font-family: inherit; font-size: 0.9rem; resize: vertical;"></textarea>
                </div>
                <div style="margin-top: 10px; display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="newIsDefault" style="accent-color: #FF7A00; width: 16px; height: 16px;">
                    <label for="newIsDefault" style="font-size: 0.9rem; color: #4b5563; cursor: pointer;">Set as default address</label>
                </div>
                <button type="submit" style="margin-top: 15px; width: 100%; padding: 10px; background: linear-gradient(135deg, #FF7A00, #e66d00); color: white; border: none; border-radius: 8px; font-size: 0.95rem; font-weight: 600; cursor: pointer; font-family: inherit;">
                    <i class="fas fa-save"></i> Save Address
                </button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Close handlers
    document.getElementById('closeAddrModal').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    // Add address form submit
    document.getElementById('newAddressForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const addressData = {
            city: document.getElementById('newCity').value,
            thana: document.getElementById('newThana').value,
            address_details: document.getElementById('newAddressDetails').value,
            is_default: document.getElementById('newIsDefault').checked
        };

        try {
            const saved = await AddressManager.addAddress(user.user_id, addressData);
            const addresses = AddressManager.getCachedAddresses();
            if (addressData.is_default) {
                AddressManager.setSelectedAddress(saved);
                updateHeaderAddress(saved);
            }
            document.getElementById('addressList').innerHTML = renderAddressList(addresses, AddressManager.getSelectedAddress());
            document.getElementById('newAddressForm').reset();
            showToast('Address saved!', 'success');
        } catch {
            // Fallback: save locally
            const addresses = AddressManager.getCachedAddresses();
            const newAddr = { ...addressData, address_id: Date.now() };
            addresses.push(newAddr);
            localStorage.setItem('gorom_user_addresses', JSON.stringify(addresses));
            if (addressData.is_default) {
                AddressManager.setSelectedAddress(newAddr);
                updateHeaderAddress(newAddr);
            }
            document.getElementById('addressList').innerHTML = renderAddressList(addresses, AddressManager.getSelectedAddress());
            document.getElementById('newAddressForm').reset();
            showToast('Address saved!', 'success');
        }
    });

    // Bind select/delete buttons inside modal
    bindAddressModalActions(modal, user);
}

function renderAddressList(addresses, selectedAddr) {
    if (!addresses || addresses.length === 0) {
        return '<p style="color: #9ca3af; text-align: center; padding: 20px 0;">No saved addresses yet.</p>';
    }

    return addresses.map(addr => {
        const isSelected = selectedAddr && (selectedAddr.address_id === addr.address_id);
        return `
            <div class="addr-card" data-id="${addr.address_id}" style="
                border: 2px solid ${isSelected ? '#FF7A00' : '#e5e7eb'};
                border-radius: 10px;
                padding: 14px 16px;
                margin-bottom: 10px;
                background: ${isSelected ? '#fff7f0' : '#f9fafb'};
                position: relative;
                transition: border-color 0.2s;
            ">
                ${addr.is_default ? `<span style="position:absolute; top:10px; right:10px; background:#FF7A00; color:white; font-size:0.7rem; padding: 2px 8px; border-radius: 10px; font-weight: 600;">DEFAULT</span>` : ''}
                <div style="font-weight: 600; color: #1a1a2e; margin-bottom: 4px; padding-right: 60px;">
                    <i class="fas fa-map-marker-alt" style="color: #FF7A00; margin-right: 6px;"></i>
                    ${addr.address_details || addr.addressDetails || ''}
                </div>
                <div style="color: #6b7280; font-size: 0.9rem;">${addr.thana}, ${addr.city}</div>
                <div style="display: flex; gap: 8px; margin-top: 10px;">
                    <button class="select-addr-btn" data-id="${addr.address_id}" style="
                        padding: 6px 14px; font-size: 0.85rem; border-radius: 6px; cursor: pointer; font-family: inherit; font-weight: 500;
                        background: ${isSelected ? '#10b981' : '#FF7A00'}; color: white; border: none;
                    ">
                        <i class="fas fa-${isSelected ? 'check' : 'crosshairs'}"></i>
                        ${isSelected ? 'Selected' : 'Deliver Here'}
                    </button>
                    <button class="delete-addr-btn" data-id="${addr.address_id}" style="
                        padding: 6px 12px; font-size: 0.85rem; border-radius: 6px; cursor: pointer; font-family: inherit; font-weight: 500;
                        background: transparent; color: #ef4444; border: 1.5px solid #ef4444;
                    ">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function bindAddressModalActions(modal, user) {
    modal.addEventListener('click', async function (e) {
        // Select address
        const selectBtn = e.target.closest('.select-addr-btn');
        if (selectBtn) {
            const id = selectBtn.dataset.id;
            const addresses = AddressManager.getCachedAddresses();
            const addr = addresses.find(a => String(a.address_id) === String(id));
            if (addr) {
                AddressManager.setSelectedAddress(addr);
                updateHeaderAddress(addr);
                // Re-render list
                document.getElementById('addressList').innerHTML = renderAddressList(addresses, addr);
                bindAddressModalActions(modal, user);
                showToast('Delivery address updated!', 'success');
            }
        }

        // Delete address
        const deleteBtn = e.target.closest('.delete-addr-btn');
        if (deleteBtn) {
            if (!confirm('Delete this address?')) return;
            const id = deleteBtn.dataset.id;
            try {
                if (user.user_id) await AddressManager.deleteAddress(id, user.user_id);
                else {
                    const addresses = AddressManager.getCachedAddresses().filter(a => String(a.address_id) !== String(id));
                    localStorage.setItem('gorom_user_addresses', JSON.stringify(addresses));
                }
            } catch { /* already handled in deleteAddress */ }
            const addresses = AddressManager.getCachedAddresses();
            const selected = AddressManager.getSelectedAddress();
            document.getElementById('addressList').innerHTML = renderAddressList(addresses, selected);
            bindAddressModalActions(modal, user);
            showToast('Address removed', 'info');
        }
    });
}

function updateHeaderAddress(address) {
    const displayUserAddress = document.getElementById('displayUserAddress');
    if (displayUserAddress && address) {
        displayUserAddress.textContent = AddressManager.formatAddress(address);
    }
    // Also update currentUser display city/thana
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        user.city = address.city;
        user.thana = address.thana;
        localStorage.setItem('currentUser', JSON.stringify(user));
    }
}

// ===========================
// Display User Profile (header)
// ===========================
function displayUserProfile(userData) {
    const navLinks = document.getElementById('navLinks');
    const userProfileDisplay = document.getElementById('userProfileDisplay');
    const displayUserName = document.getElementById('displayUserName');
    const displayUserAddress = document.getElementById('displayUserAddress');

    if (navLinks && userProfileDisplay && displayUserName && displayUserAddress) {
        navLinks.style.display = 'none';
        userProfileDisplay.style.display = 'flex';
        displayUserName.textContent = userData.username;

        // Show selected address if available, else fall back to city/thana
        const selectedAddr = AddressManager.getSelectedAddress();
        if (selectedAddr) {
            displayUserAddress.textContent = AddressManager.formatAddress(selectedAddr);
        } else {
            displayUserAddress.textContent = `${userData.city || ''}, ${userData.thana || ''}`;
        }
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        // Remove old listeners by replacing the element
        const newLogoutBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
        newLogoutBtn.addEventListener('click', function () {
            localStorage.removeItem('currentUser');
            AddressManager.clearCache();
            OrderManager.clearAllOrders();
            userProfileDisplay.style.display = 'none';
            navLinks.style.display = 'flex';
            alert('Logged out successfully!');
        });
    }
}

function checkUserLogin() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const userData = JSON.parse(currentUser);
        if (userData.role === 'customer') {
            displayUserProfile(userData);
        }
    }
}

// ===========================
// Simple toast notification
// ===========================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    const colors = { success: '#10b981', error: '#ef4444', info: '#6366f1' };
    toast.style.cssText = `
        position: fixed; top: 80px; right: -400px; background: white;
        padding: 12px 18px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex; align-items: center; gap: 10px; z-index: 10000;
        transition: right 0.3s ease; min-width: 260px;
        border-left: 4px solid ${colors[type] || colors.success};
    `;
    toast.innerHTML = `<span style="font-size: 0.95rem; color: #1a1a2e;">${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.style.right = '20px', 10);
    setTimeout(() => {
        toast.style.right = '-400px';
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}

// ===========================
// Search
// ===========================
function initializeSearch() {
    const searchIcon = document.getElementById("search-icon");
    const searchBarContainer = document.getElementById("search-bar-container");
    const searchBar = document.getElementById("search-bar");

    if (!searchIcon || !searchBarContainer || !searchBar) return;

    searchIcon.addEventListener("click", function (event) {
        event.stopPropagation();
        searchBarContainer.classList.toggle('active');
        if (searchBarContainer.classList.contains('active')) searchBar.focus();
    });

    document.addEventListener("click", function (event) {
        if (!searchBarContainer.contains(event.target) && !searchIcon.contains(event.target)) {
            searchBarContainer.classList.remove('active');
        }
    });

    searchBar.addEventListener("input", function (event) {
        const searchQuery = event.target.value.toLowerCase().trim();
        const cachedRestaurants = sessionStorage.getItem('restaurants');
        if (!cachedRestaurants) return;

        let allRestaurants = JSON.parse(cachedRestaurants);

        if (searchQuery === "") {
            renderRestaurants(allRestaurants);
        } else {
            const filtered = allRestaurants.filter(r =>
                r.name.toLowerCase().includes(searchQuery) ||
                (r.police_station && r.police_station.toLowerCase().includes(searchQuery))
            );

            if (filtered.length === 0) {
                document.getElementById("restaurantGrid").innerHTML =
                    `<div style="grid-column: 1/-1; text-align: center; padding: 3rem;"><p style="font-size: 1.2rem; color: #666;">No restaurants found matching "${searchQuery}"</p></div>`;
            } else {
                renderRestaurants(filtered);
            }
        }
    });
}

// ===========================
// Orders Modal (cart icon on home)
// ===========================
function initializeOrdersModal() {
    const cartIcon = document.getElementById('cart-icon');
    const ordersModal = document.getElementById('ordersModal');
    const ordersClose = document.querySelector('.orders-close');

    if (!cartIcon || !ordersModal) return;

    cartIcon.addEventListener('click', function (e) {
        e.preventDefault();
        displayOrders();
        ordersModal.style.display = 'block';
    });

    ordersClose?.addEventListener('click', () => ordersModal.style.display = 'none');

    window.addEventListener('click', function (event) {
        if (event.target === ordersModal) ordersModal.style.display = 'none';
    });
}

function displayOrders() {
    const orders = OrderManager.getOrders();
    const ordersEmpty = document.getElementById('ordersEmpty');
    const ordersList = document.getElementById('ordersList');

    if (!ordersList || !ordersEmpty) return;

    if (orders.length === 0) {
        ordersEmpty.style.display = 'flex';
        ordersList.style.display = 'none';
    } else {
        ordersEmpty.style.display = 'none';
        ordersList.style.display = 'block';

        ordersList.innerHTML = orders.map(order => {
            const imageUrl = order.restaurantImage || 'https://via.placeholder.com/80x80/ff7a00/ffffff?text=Restaurant';
            return `
                <div class="order-card">
                    <div class="order-header">
                        <div class="order-restaurant-image">
                            <img src="${imageUrl}" alt="${order.restaurantName}" onerror="this.src='image/food_2.png'">
                        </div>
                        <div class="order-restaurant-info">
                            <div class="order-restaurant-name">${order.restaurantName}</div>
                            <div class="order-restaurant-address">
                                <i class="fas fa-map-marker-alt"></i> ${order.restaurantAddress}
                            </div>
                            <div class="order-id">Order ID: ${order.orderId}</div>
                        </div>
                        <div class="order-actions">
                            <button class="order-view-btn" onclick="viewRestaurantOrder(${order.restaurantId})">
                                <i class="fas fa-eye"></i> View
                            </button>
                            <button class="order-remove-btn" onclick="removeOrder(${order.restaurantId})">
                                <i class="fas fa-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item">
                                <div>
                                    <span class="order-item-name">${item.name}</span>
                                    <span class="order-item-qty">x${item.quantity}</span>
                                </div>
                                <span class="order-item-price">৳${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-summary">
                        <div class="order-summary-row"><span>Subtotal</span><span>৳${order.subtotal.toFixed(2)}</span></div>
                        <div class="order-summary-row"><span>Delivery Fee</span><span>৳${order.deliveryFee.toFixed(2)}</span></div>
                        <div class="order-summary-row"><span>VAT (${OrderManager.VAT_PERCENTAGE}%)</span><span>৳${order.vat.toFixed(2)}</span></div>
                        <div class="order-summary-row total"><span>Total</span><span>৳${order.total.toFixed(2)}</span></div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function viewRestaurantOrder(restaurantId) {
    const orders = OrderManager.getOrders();
    const order = orders.find(o => o.restaurantId === restaurantId);
    if (order) {
        sessionStorage.setItem('selectedRestaurant', JSON.stringify({
            restaurant_id: order.restaurantId,
            name: order.restaurantName,
            image_url: order.restaurantImage,
            police_station: order.restaurantAddress
        }));
        window.location.href = 'menu.html';
    }
}

function removeOrder(restaurantId) {
    if (confirm('Remove this order?')) {
        OrderManager.removeOrder(restaurantId);
        displayOrders();
    }
}

// ===========================
// Init
// ===========================
function init() {
    initializeModals();
    initializeSearch();
    initializeOrdersModal();

    const cachedRestaurants = sessionStorage.getItem('restaurants');

    if (cachedRestaurants) {
        renderRestaurants(JSON.parse(cachedRestaurants));
    } else {
        fetch(API_URL)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(response => {
                if (response.success && response.data) {
                    // Resolve is_primary image for every restaurant before caching
                    const restaurants = ImageHelper.resolveAll(response.data, 'restaurant');
                    sessionStorage.setItem('restaurants', JSON.stringify(restaurants));
                    renderRestaurants(restaurants);
                } else {
                    throw new Error("Invalid response format");
                }
            })
            .catch(error => {
                console.error("Failed to fetch restaurants:", error);
                const grid = document.getElementById("restaurantGrid");
                if (grid) {
                    grid.innerHTML = `
                        <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                            <p style="font-size: 1.2rem; color: #ff0000;">Failed to load restaurants</p>
                            <p style="color: #666;">Make sure the backend is running at ${API_URL}</p>
                        </div>
                    `;
                }
            });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
