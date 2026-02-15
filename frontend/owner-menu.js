/**
 * Owner Menu Management
 */

let currentItemId = null;
let currentRestaurantId = null;
let allMenuItems = [];

// Initialize page
async function initializeMenu() {
    loadRestaurants();
    setupImagePreview();
    setupRestaurantSelector();
}

// Load restaurants for selector
async function loadRestaurants() {
    const user = ownerPortal.checkOwnerAuth();
    if (!user) return;
    
    // TODO: Replace with API call
    // const result = await ownerPortal.apiRequest(`/owner/restaurants?owner_id=${user.userId}`);
    
    // Mock data
    const mockRestaurants = [
        { restaurant_id: 1, name: "Pizza Paradise" },
        { restaurant_id: 2, name: "Burger House" }
    ];
    
    const selector = document.getElementById('restaurantSelector');
    selector.innerHTML = '<option value="">Select Restaurant...</option>' +
        mockRestaurants.map(r => `<option value="${r.restaurant_id}">${r.name}</option>`).join('');
    
    // Check if coming from restaurants page
    const selectedId = sessionStorage.getItem('selectedRestaurantId');
    if (selectedId) {
        selector.value = selectedId;
        currentRestaurantId = parseInt(selectedId);
        loadMenuItems(currentRestaurantId);
    }
}

// Setup restaurant selector
function setupRestaurantSelector() {
    const selector = document.getElementById('restaurantSelector');
    selector.addEventListener('change', function() {
        currentRestaurantId = parseInt(this.value);
        if (currentRestaurantId) {
            sessionStorage.setItem('selectedRestaurantId', currentRestaurantId);
            loadMenuItems(currentRestaurantId);
        } else {
            displayEmptyState();
        }
    });
}

// Load menu items
async function loadMenuItems(restaurantId) {
    ownerPortal.showLoading();
    
    // TODO: Replace with API call
    // const result = await ownerPortal.apiRequest(`/owner/restaurants/${restaurantId}/menu`);
    
    // Mock data
    allMenuItems = [
        {
            food_id: 1,
            name: "Margherita Pizza",
            category: "Pizza",
            price: 450,
            description: "Classic pizza with tomato and mozzarella",
            availability: "Y",
            image_url: "https://via.placeholder.com/200x200/FF7A00/ffffff?text=Pizza"
        },
        {
            food_id: 2,
            name: "Pepperoni Pizza",
            category: "Pizza",
            price: 550,
            description: "Spicy pepperoni with cheese",
            availability: "Y",
            image_url: "https://via.placeholder.com/200x200/FF7A00/ffffff?text=Pizza"
        },
        {
            food_id: 3,
            name: "Caesar Salad",
            category: "Salads",
            price: 250,
            description: "Fresh romaine lettuce with Caesar dressing",
            availability: "Y",
            image_url: "https://via.placeholder.com/200x200/10b981/ffffff?text=Salad"
        },
        {
            food_id: 4,
            name: "Chicken Burger",
            category: "Burgers",
            price: 350,
            description: "Grilled chicken with fresh vegetables",
            availability: "N",
            image_url: "https://via.placeholder.com/200x200/FF7A00/ffffff?text=Burger"
        }
    ];
    
    ownerPortal.hideLoading();
    displayCategories();
    displayMenuItems(allMenuItems);
}

// Display categories
function displayCategories() {
    const categories = ['all', ...new Set(allMenuItems.map(item => item.category))];
    const tabsContainer = document.getElementById('categoryTabs');
    
    tabsContainer.innerHTML = categories.map(cat => `
        <button class="category-tab ${cat === 'all' ? 'active' : ''}" 
                data-category="${cat}" 
                onclick="filterByCategory('${cat}')">
            ${cat === 'all' ? 'All Items' : cat}
        </button>
    `).join('');
    
    // Update datalist for form
    document.getElementById('categories').innerHTML = 
        [...new Set(allMenuItems.map(item => item.category))]
            .map(cat => `<option value="${cat}">`)
            .join('');
}

// Filter by category
function filterByCategory(category) {
    // Update active tab
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === category);
    });
    
    // Filter items
    const filtered = category === 'all' ? allMenuItems : 
        allMenuItems.filter(item => item.category === category);
    displayMenuItems(filtered);
}

// Display menu items
function displayMenuItems(items) {
    const grid = document.getElementById('menuItemsGrid');
    
    if (!items || items.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-utensils"></i>
                <h3>No Menu Items</h3>
                <p>Add your first menu item to get started</p>
                <button class="btn btn-primary" onclick="openAddItemModal()">
                    <i class="fas fa-plus"></i> Add Item
                </button>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = items.map(item => `
        <div class="menu-item-card">
            <div class="menu-item-image">
                <img src="${item.image_url}" alt="${item.name}" onerror="this.src='image/food_11.png'">
                <span class="availability-badge ${item.availability === 'Y' ? 'badge-available' : 'badge-unavailable'}">
                    ${item.availability === 'Y' ? 'Available' : 'Not Available'}
                </span>
            </div>
            
            <div class="menu-item-info">
                <div class="item-header">
                    <h4>${item.name}</h4>
                    <span class="item-category">${item.category}</span>
                </div>
                
                <p class="item-description">${item.description || 'No description'}</p>
                
                <div class="item-footer">
                    <span class="item-price">৳${parseFloat(item.price).toFixed(2)}</span>
                    <div class="item-actions">
                        <button class="btn-icon" onclick="editMenuItem(${item.food_id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="toggleAvailability(${item.food_id})" title="Toggle Availability">
                            <i class="fas fa-toggle-${item.availability === 'Y' ? 'on' : 'off'}"></i>
                        </button>
                        <button class="btn-icon danger" onclick="deleteMenuItem(${item.food_id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Open add item modal
function openAddItemModal() {
    if (!currentRestaurantId) {
        ownerPortal.showNotification('Please select a restaurant first', 'error');
        return;
    }
    
    currentItemId = null;
    document.getElementById('modalTitle').textContent = 'Add Menu Item';
    document.getElementById('menuItemForm').reset();
    document.getElementById('itemImagePreview').innerHTML = `
        <i class="fas fa-image"></i>
        <p>No image selected</p>
    `;
    document.getElementById('menuItemModal').style.display = 'block';
}

// Edit menu item
function editMenuItem(itemId) {
    currentItemId = itemId;
    const item = allMenuItems.find(i => i.food_id === itemId);
    
    if (!item) return;
    
    document.getElementById('modalTitle').textContent = 'Edit Menu Item';
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemCategory').value = item.category;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemAvailability').value = item.availability;
    document.getElementById('itemDescription').value = item.description || '';
    document.getElementById('itemImage').value = item.image_url || '';
    
    if (item.image_url) {
        document.getElementById('itemImagePreview').innerHTML = `
            <img src="${item.image_url}" alt="Preview">
        `;
    }
    
    document.getElementById('menuItemModal').style.display = 'block';
}

// Toggle availability
async function toggleAvailability(itemId) {
    const item = allMenuItems.find(i => i.food_id === itemId);
    if (!item) return;
    
    const newStatus = item.availability === 'Y' ? 'N' : 'Y';
    
    // TODO: API call
    // await ownerPortal.apiRequest(`/owner/menu/${itemId}/availability`, 'PUT', { availability: newStatus });
    
    item.availability = newStatus;
    ownerPortal.showNotification('Availability updated!', 'success');
    
    // Refresh display
    const activeCategory = document.querySelector('.category-tab.active').dataset.category;
    filterByCategory(activeCategory);
}

// Delete menu item
async function deleteMenuItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    ownerPortal.showLoading();
    
    // TODO: API call
    // await ownerPortal.apiRequest(`/owner/menu/${itemId}`, 'DELETE');
    
    allMenuItems = allMenuItems.filter(i => i.food_id !== itemId);
    
    ownerPortal.hideLoading();
    ownerPortal.showNotification('Item deleted successfully!', 'success');
    
    displayCategories();
    const activeCategory = document.querySelector('.category-tab.active').dataset.category;
    filterByCategory(activeCategory);
}

// Close modal
function closeMenuItemModal() {
    document.getElementById('menuItemModal').style.display = 'none';
    currentItemId = null;
}

// Setup image preview
function setupImagePreview() {
    const imageUrlInput = document.getElementById('itemImage');
    const imageFileInput = document.getElementById('itemImageFile');
    const preview = document.getElementById('itemImagePreview');
    
    imageUrlInput.addEventListener('input', function() {
        if (this.value) {
            preview.innerHTML = `<img src="${this.value}" alt="Preview" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-exclamation-triangle\\'></i><p>Invalid image URL</p>'">`;
        }
    });
    
    imageFileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                imageUrlInput.value = '';
            };
            reader.readAsDataURL(this.files[0]);
        }
    });
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    initializeMenu();
    
    const form = document.getElementById('menuItemForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                restaurant_id: currentRestaurantId,
                name: document.getElementById('itemName').value,
                category: document.getElementById('itemCategory').value,
                price: parseFloat(document.getElementById('itemPrice').value),
                availability: document.getElementById('itemAvailability').value,
                description: document.getElementById('itemDescription').value,
                image_url: document.getElementById('itemImage').value
            };
            
            // Handle file upload if present
            const imageFile = document.getElementById('itemImageFile').files[0];
            if (imageFile) {
                // TODO: Upload image
                ownerPortal.showNotification('Image upload will be implemented with backend', 'info');
            }
            
            ownerPortal.showLoading();
            
            if (currentItemId) {
                // Update existing
                // await ownerPortal.apiRequest(`/owner/menu/${currentItemId}`, 'PUT', formData);
                const itemIndex = allMenuItems.findIndex(i => i.food_id === currentItemId);
                if (itemIndex !== -1) {
                    allMenuItems[itemIndex] = { ...allMenuItems[itemIndex], ...formData };
                }
                ownerPortal.showNotification('Item updated successfully!', 'success');
            } else {
                // Create new
                // await ownerPortal.apiRequest('/owner/menu', 'POST', formData);
                allMenuItems.push({ ...formData, food_id: Date.now() });
                ownerPortal.showNotification('Item added successfully!', 'success');
            }
            
            ownerPortal.hideLoading();
            closeMenuItemModal();
            
            displayCategories();
            const activeCategory = document.querySelector('.category-tab.active').dataset.category;
            filterByCategory(activeCategory);
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('menuItemModal');
        if (e.target === modal) {
            closeMenuItemModal();
        }
    });
});

function displayEmptyState() {
    document.getElementById('categoryTabs').innerHTML = '<button class="category-tab active">All Items</button>';
    document.getElementById('menuItemsGrid').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-utensils"></i>
            <h3>Select a Restaurant</h3>
            <p>Choose a restaurant from the dropdown to manage its menu</p>
        </div>
    `;
}
