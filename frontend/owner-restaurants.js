/**
 * Owner Restaurants Management
 */

let currentRestaurantId = null;

// Initialize page
async function initializeRestaurants() {
    loadRestaurants();
    setupImagePreview();
}

// Load all restaurants
async function loadRestaurants() {
    const user = ownerPortal.checkOwnerAuth();
    if (!user) return;
    
    ownerPortal.showLoading();
    
    // TODO: Replace with API call
    // const result = await ownerPortal.apiRequest(`/owner/restaurants?owner_id=${user.userId}`);
    
    // Mock data
    const mockRestaurants = [
        {
            restaurant_id: 1,
            name: "Pizza Paradise",
            description: "Best pizzas in town with authentic Italian recipes",
            address: "123 Main Street, Mirpur, Dhaka",
            phone: "01712345678",
            rating: 4.5,
            image_url: "https://via.placeholder.com/400x300/FF7A00/ffffff?text=Pizza+Paradise",
            active_items: 25,
            total_orders: 150,
            status: "active"
        },
        {
            restaurant_id: 2,
            name: "Burger House",
            description: "Delicious burgers made with premium ingredients",
            address: "456 Food Street, Dhanmondi, Dhaka",
            phone: "01798765432",
            rating: 4.2,
            image_url: "https://via.placeholder.com/400x300/FF7A00/ffffff?text=Burger+House",
            active_items: 18,
            total_orders: 89,
            status: "active"
        }
    ];
    
    ownerPortal.hideLoading();
    displayRestaurants(mockRestaurants);
}

// Display restaurants
function displayRestaurants(restaurants) {
    const grid = document.getElementById('restaurantsGrid');
    
    if (!restaurants || restaurants.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-store"></i>
                <h3>No Restaurants Yet</h3>
                <p>Add your first restaurant to get started</p>
                <button class="btn btn-primary" onclick="openAddRestaurantModal()">
                    <i class="fas fa-plus"></i> Add Restaurant
                </button>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = restaurants.map(restaurant => `
        <div class="restaurant-card">
            <div class="restaurant-image">
                <img src="${restaurant.image_url}" alt="${restaurant.name}" onerror="this.src='image/food_2.png'">
                <span class="status-badge ${restaurant.status === 'active' ? 'status-active' : 'status-inactive'}">
                    ${restaurant.status === 'active' ? 'Active' : 'Inactive'}
                </span>
            </div>
            
            <div class="restaurant-info">
                <div class="restaurant-header">
                    <h3>${restaurant.name}</h3>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <span>${restaurant.rating}</span>
                    </div>
                </div>
                
                <p class="restaurant-description">${restaurant.description || 'No description'}</p>
                
                <div class="restaurant-details">
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${restaurant.address}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-phone"></i>
                        <span>${restaurant.phone}</span>
                    </div>
                </div>
                
                <div class="restaurant-stats">
                    <div class="stat">
                        <i class="fas fa-utensils"></i>
                        <span>${restaurant.active_items} Items</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-shopping-bag"></i>
                        <span>${restaurant.total_orders} Orders</span>
                    </div>
                </div>
                
                <div class="restaurant-actions">
                    <button class="btn btn-secondary" onclick="editRestaurant(${restaurant.restaurant_id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-primary" onclick="manageMenu(${restaurant.restaurant_id})">
                        <i class="fas fa-list"></i> Menu
                    </button>
                    <button class="btn btn-success" onclick="viewOrders(${restaurant.restaurant_id})">
                        <i class="fas fa-eye"></i> Orders
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Open add restaurant modal
function openAddRestaurantModal() {
    currentRestaurantId = null;
    document.getElementById('modalTitle').textContent = 'Add New Restaurant';
    document.getElementById('restaurantForm').reset();
    document.getElementById('imagePreview').innerHTML = `
        <i class="fas fa-image"></i>
        <p>No image selected</p>
    `;
    document.getElementById('restaurantModal').style.display = 'block';
}

// Edit restaurant
async function editRestaurant(restaurantId) {
    currentRestaurantId = restaurantId;
    
    // TODO: Fetch restaurant data from API
    // const result = await ownerPortal.apiRequest(`/owner/restaurants/${restaurantId}`);
    
    // Mock data
    const mockData = {
        name: "Pizza Paradise",
        description: "Best pizzas in town",
        address: "123 Main Street, Mirpur, Dhaka",
        phone: "01712345678",
        image_url: "https://via.placeholder.com/400x300"
    };
    
    // Fill form
    document.getElementById('modalTitle').textContent = 'Edit Restaurant';
    document.getElementById('restaurantName').value = mockData.name;
    document.getElementById('restaurantPhone').value = mockData.phone;
    document.getElementById('restaurantAddress').value = mockData.address;
    document.getElementById('restaurantDescription').value = mockData.description || '';
    document.getElementById('restaurantImage').value = mockData.image_url || '';
    
    // Show preview
    if (mockData.image_url) {
        document.getElementById('imagePreview').innerHTML = `
            <img src="${mockData.image_url}" alt="Preview">
        `;
    }
    
    document.getElementById('restaurantModal').style.display = 'block';
}

// Close modal
function closeRestaurantModal() {
    document.getElementById('restaurantModal').style.display = 'none';
    currentRestaurantId = null;
}

// Setup image preview
function setupImagePreview() {
    const imageUrlInput = document.getElementById('restaurantImage');
    const imageFileInput = document.getElementById('restaurantImageFile');
    const preview = document.getElementById('imagePreview');
    
    // Preview from URL
    imageUrlInput.addEventListener('input', function() {
        if (this.value) {
            preview.innerHTML = `<img src="${this.value}" alt="Preview" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-exclamation-triangle\\'></i><p>Invalid image URL</p>'">`;
        }
    });
    
    // Preview from file
    imageFileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                imageUrlInput.value = ''; // Clear URL input
            };
            reader.readAsDataURL(this.files[0]);
        }
    });
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    initializeRestaurants();
    
    const form = document.getElementById('restaurantForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('restaurantName').value,
                phone: document.getElementById('restaurantPhone').value,
                address: document.getElementById('restaurantAddress').value,
                description: document.getElementById('restaurantDescription').value,
                image_url: document.getElementById('restaurantImage').value
            };
            
            // Handle file upload if present
            const imageFile = document.getElementById('restaurantImageFile').files[0];
            if (imageFile) {
                // TODO: Upload image to server/cloud storage
                // formData.image_url = await uploadImage(imageFile);
                ownerPortal.showNotification('Image upload will be implemented with backend', 'info');
            }
            
            ownerPortal.showLoading();
            
            // TODO: API call
            if (currentRestaurantId) {
                // Update existing
                // await ownerPortal.apiRequest(`/owner/restaurants/${currentRestaurantId}`, 'PUT', formData);
                ownerPortal.showNotification('Restaurant updated successfully!', 'success');
            } else {
                // Create new
                // await ownerPortal.apiRequest('/owner/restaurants', 'POST', formData);
                ownerPortal.showNotification('Restaurant added successfully!', 'success');
            }
            
            ownerPortal.hideLoading();
            closeRestaurantModal();
            
            // Reload restaurants
            setTimeout(() => loadRestaurants(), 500);
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('restaurantModal');
        if (e.target === modal) {
            closeRestaurantModal();
        }
    });
});

// Navigate to menu management
function manageMenu(restaurantId) {
    sessionStorage.setItem('selectedRestaurantId', restaurantId);
    window.location.href = 'owner-menu.html';
}

// Navigate to orders
function viewOrders(restaurantId) {
    sessionStorage.setItem('selectedRestaurantId', restaurantId);
    window.location.href = 'owner-orders.html';
}
