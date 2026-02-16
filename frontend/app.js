const API_URL = "http://localhost:3000/api/restaurants";

// Render function
function renderRestaurants(restaurants) {
    const grid = document.getElementById("restaurantGrid");
    if (!grid) {
        console.error("restaurantGrid not found!");
        return;
    }

    grid.innerHTML = "";

    // Remove duplicates based on restaurant_id
    const uniqueRestaurants = [];
    const seenIds = new Set();

    restaurants.forEach(restaurant => {
        if (!seenIds.has(restaurant.restaurant_id)) {
            seenIds.add(restaurant.restaurant_id);
            uniqueRestaurants.push(restaurant);
        }
    });

    console.log("Rendering", uniqueRestaurants.length, "unique restaurants");

    uniqueRestaurants.forEach((r) => {
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        
        // Create discount badge
        let discountBadge = "";
        if (r.offer_value && r.offer_type) {
            const offerVal = parseFloat(r.offer_value);
            if (r.offer_type === 'percentage') {
                discountBadge = `${offerVal}% OFF`;
            } else if (r.offer_type === 'flat') {
                discountBadge = `৳${offerVal} OFF`;
            }
        }
        
        // Use image_url or fallback to placeholder
        const imageUrl = r.image_url || 'https://via.placeholder.com/300x220/ff7a00/ffffff?text=No+Image';
        
     card.innerHTML = `
    <div class="image-wrapper">
        ${discountBadge ? `<span class="discount-badge">${discountBadge}</span>` : ""}
        <img src="${r.image_url}" 
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

// Initialize modals
function initializeModals() {
    const profileIcon = document.getElementById('profile-icon');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');

    if (!profileIcon || !loginModal || !signupModal) return;

    profileIcon.addEventListener('click', function () {
        loginModal.style.display = 'block';
    });

    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function () {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
        });
    });

    const switchToSignup = document.getElementById('switchToSignup');
    if (switchToSignup) {
        switchToSignup.addEventListener('click', function () {
            loginModal.style.display = 'none';
            signupModal.style.display = 'block';
        });
    }

    const switchToLogin = document.getElementById('switchToLogin');
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function () {
            signupModal.style.display = 'none';
            loginModal.style.display = 'block';
        });
    }

    window.onclick = function (event) {
        if (event.target === loginModal || event.target === signupModal) {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
        }
    };

    // Handle signup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        // Add role change listener to show/hide rider fields
        const roleSelect = document.getElementById('role');
        const riderFields = document.getElementById('riderFields');
        
        if (roleSelect && riderFields) {
            roleSelect.addEventListener('change', function() {
                if (this.value === 'rider') {
                    riderFields.style.display = 'block';
                    // Make rider fields required
                    document.getElementById('vehicleType').required = true;
                    document.getElementById('vehicleNumber').required = true;
                    document.getElementById('licenseNumber').required = true;
                    document.getElementById('nidNumber').required = true;
                } else {
                    riderFields.style.display = 'none';
                    // Make rider fields optional
                    document.getElementById('vehicleType').required = false;
                    document.getElementById('vehicleNumber').required = false;
                    document.getElementById('licenseNumber').required = false;
                    document.getElementById('nidNumber').required = false;
                }
            });
        }
        
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const username = document.getElementById('newUsername').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const role = document.getElementById('role').value;
            const city = document.getElementById('city').value;
            const thana = document.getElementById('thana').value;
            const addressDetails = document.getElementById('addressDetails').value;
            
            // Create user object
            const userData = {
                username: username,
                email: email,
                phone: phone,
                role: role,
                city: city,
                thana: thana,
                addressDetails: addressDetails
            };
            
            // Add rider-specific data if role is rider
            if (role === 'rider') {
                userData.vehicleType = document.getElementById('vehicleType').value;
                userData.vehicleNumber = document.getElementById('vehicleNumber').value;
                userData.licenseNumber = document.getElementById('licenseNumber').value;
                userData.nidNumber = document.getElementById('nidNumber').value;
                userData.emergencyContact = document.getElementById('emergencyContact').value;
                userData.riderRating = 5.0; // Default rating
                userData.totalDeliveries = 0;
            }
            
            // Store in localStorage
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            // Close signup modal
            signupModal.style.display = 'none';
            
            // Redirect based on role
            if (role === 'owner') {
                alert('Account created successfully! Redirecting to Owner Dashboard...');
                window.location.href = 'owner-dashboard.html';
            } else if (role === 'rider') {
                alert('Account created successfully! Redirecting to Rider Dashboard...');
                window.location.href = 'rider-dashboard.html';
            } else {
                // Display user profile for customers
                displayUserProfile(userData);
                alert('Account created successfully!');
            }
        });
    }

    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('loginRole').value;
            
            // For demo purposes, create a mock user
            const mockUser = {
                username: username,
                role: role,
                city: 'Dhaka',
                thana: 'Mirpur'
            };
            
            localStorage.setItem('currentUser', JSON.stringify(mockUser));
            
            loginModal.style.display = 'none';
            
            // Redirect based on role
            if (role === 'owner') {
                alert('Logged in successfully! Redirecting to Owner Dashboard...');
                window.location.href = 'owner-dashboard.html';
            } else if (role === 'rider') {
                alert('Logged in successfully! Redirecting to Rider Dashboard...');
                window.location.href = 'rider-dashboard.html';
            } else {
                displayUserProfile(mockUser);
                alert('Logged in successfully!');
            }
            
            // TODO: Replace with actual API call
            // fetch('/api/auth/login', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ username, password, role })
            // })
            // .then(res => res.json())
            // .then(data => {
            //     if (data.success) {
            //         localStorage.setItem('currentUser', JSON.stringify(data.user));
            //         if (data.user.role === 'owner') {
            //             window.location.href = 'owner-dashboard.html';
            //         } else {
            //             displayUserProfile(data.user);
            //         }
            //     }
            // });
        });
    }

    // Check if user is already logged in
    checkUserLogin();
}

// Function to display user profile
function displayUserProfile(userData) {
    const navLinks = document.getElementById('navLinks');
    const userProfileDisplay = document.getElementById('userProfileDisplay');
    const displayUserName = document.getElementById('displayUserName');
    const displayUserAddress = document.getElementById('displayUserAddress');
    
    if (navLinks && userProfileDisplay && displayUserName && displayUserAddress) {
        // Hide nav links
        navLinks.style.display = 'none';
        
        // Show user profile
        userProfileDisplay.style.display = 'flex';
        
        // Set user info
        displayUserName.textContent = userData.username;
        displayUserAddress.textContent = `${userData.city}, ${userData.thana}`;
    }
    
    // Add logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Clear user data from localStorage
            localStorage.removeItem('currentUser');
            
            // Hide user profile
            userProfileDisplay.style.display = 'none';
            
            // Show nav links again
            navLinks.style.display = 'flex';
            
            // Optional: show message
            alert('Logged out successfully!');
        });
    }
}

// Function to check if user is logged in
function checkUserLogin() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        const userData = JSON.parse(currentUser);
        displayUserProfile(userData);
    }
}

// Search functionality
function initializeSearch() {
    const searchIcon = document.getElementById("search-icon");
    const searchBarContainer = document.getElementById("search-bar-container");
    const searchBar = document.getElementById("search-bar");

    if (!searchIcon || !searchBarContainer || !searchBar) {
        console.warn("Search elements not found!");
        return;
    }

    searchIcon.addEventListener("click", function (event) {
        event.stopPropagation();
        searchBarContainer.classList.toggle('active');

        if (searchBarContainer.classList.contains('active')) {
            searchBar.focus();
        }
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
            const filteredRestaurants = allRestaurants.filter(restaurant => {
                return restaurant.name.toLowerCase().includes(searchQuery) ||
                    (restaurant.police_station && restaurant.police_station.toLowerCase().includes(searchQuery));
            });

            if (filteredRestaurants.length === 0) {
                const grid = document.getElementById("restaurantGrid");
                grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem;"><p style="font-size: 1.2rem; color: #666;">No restaurants found matching "' + searchQuery + '"</p></div>';
            } else {
                renderRestaurants(filteredRestaurants);
            }
        }
    });
}

// Orders Modal functionality
function initializeOrdersModal() {
    const cartIcon = document.getElementById('cart-icon');
    const ordersModal = document.getElementById('ordersModal');
    const ordersClose = document.querySelector('.orders-close');
    
    if (!cartIcon || !ordersModal) return;
    
    // Open orders modal when cart icon is clicked
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        displayOrders();
        ordersModal.style.display = 'block';
    });
    
    // Close modal
    if (ordersClose) {
        ordersClose.addEventListener('click', function() {
            ordersModal.style.display = 'none';
        });
    }
    
    // Close when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === ordersModal) {
            ordersModal.style.display = 'none';
        }
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
                                <i class="fas fa-map-marker-alt"></i>
                                ${order.restaurantAddress}
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
                        <div class="order-summary-row">
                            <span>Subtotal</span>
                            <span>৳${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div class="order-summary-row">
                            <span>Delivery Fee</span>
                            <span>৳${order.deliveryFee.toFixed(2)}</span>
                        </div>
                        <div class="order-summary-row">
                            <span>VAT (${OrderManager.VAT_PERCENTAGE}%)</span>
                            <span>৳${order.vat.toFixed(2)}</span>
                        </div>
                        <div class="order-summary-row total">
                            <span>Total</span>
                            <span>৳${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function viewRestaurantOrder(restaurantId) {
    // Store the restaurant ID and redirect to menu page
    const orders = OrderManager.getOrders();
    const order = orders.find(o => o.restaurantId === restaurantId);
    
    if (order) {
        // Create a minimal restaurant object for the menu page
        const restaurantData = {
            restaurant_id: order.restaurantId,
            name: order.restaurantName,
            image_url: order.restaurantImage,
            police_station: order.restaurantAddress
        };
        
        sessionStorage.setItem('selectedRestaurant', JSON.stringify(restaurantData));
        window.location.href = 'menu.html';
    }
}

function removeOrder(restaurantId) {
    if (confirm('Are you sure you want to remove this order?')) {
        OrderManager.removeOrder(restaurantId);
        displayOrders();
    }
}

// Main initialization
function init() {
    console.log("Initializing app...");

    initializeModals();
    initializeSearch();
    initializeOrdersModal();

    const cachedRestaurants = sessionStorage.getItem('restaurants');

    if (cachedRestaurants) {
        console.log("Using cached data");
        renderRestaurants(JSON.parse(cachedRestaurants));
    } else {
        console.log("Fetching from API:", API_URL);

        fetch(API_URL)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(response => {
                console.log("API Response:", response);

                if (response.success && response.data) {
                    const restaurants = response.data;
                    console.log("Got", restaurants.length, "restaurant entries");

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
                            <p style="color: #666;">Error: ${error.message}</p>
                            <p style="color: #666;">Make sure the backend server is running at ${API_URL}</p>
                        </div>
                    `;
                }
            });
    }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}