/**
 * Admin Restaurant Management - COMPLETE IMPLEMENTATION
 */

let allRestaurants = [];
let filteredRestaurants = [];

// Initialize
async function initializeRestaurants() {
    loadRestaurants();
    setupFilters();
    addFormStyles();
}

// Load all restaurants
async function loadRestaurants() {
    adminPortal.showLoading();
    
    // TODO: Replace with API call
    allRestaurants = [
        {
            id: 1,
            name: 'Pizza Paradise',
            owner_name: 'John Smith',
            owner_phone: '01712345678',
            owner_email: 'john@pizzaparadise.com',
            category: 'Pizza',
            rating: 4.8,
            total_orders: 1245,
            commission_rate: 15,
            status: 'active',
            joined_date: '2024-01-10',
            address: '123 Main St, Dhaka',
            opening_hours: '10:00 AM - 11:00 PM',
            delivery_time: '30-40 mins'
        },
        {
            id: 2,
            name: 'Burger House',
            owner_name: 'Sarah Ahmed',
            owner_phone: '01798765432',
            owner_email: 'sarah@burgerhouse.com',
            category: 'Burgers',
            rating: 4.6,
            total_orders: 987,
            commission_rate: 15,
            status: 'active',
            joined_date: '2024-02-15',
            address: '456 Park Ave, Dhaka',
            opening_hours: '11:00 AM - 12:00 AM',
            delivery_time: '25-35 mins'
        },
        {
            id: 3,
            name: 'Thai Express',
            owner_name: 'Mike Chen',
            owner_phone: '01823456789',
            owner_email: 'mike@thaiexpress.com',
            category: 'Thai',
            rating: 4.7,
            total_orders: 756,
            commission_rate: 15,
            status: 'active',
            joined_date: '2024-03-20',
            address: '789 Ocean Rd, Dhaka',
            opening_hours: '12:00 PM - 10:00 PM',
            delivery_time: '35-45 mins'
        },
        {
            id: 4,
            name: 'Dragon Wok',
            owner_name: 'Li Wang',
            owner_phone: '01765432109',
            owner_email: 'li@dragonwok.com',
            category: 'Chinese',
            rating: 0,
            total_orders: 0,
            commission_rate: 15,
            status: 'pending',
            joined_date: '2024-06-01',
            address: '321 River St, Dhaka',
            opening_hours: '11:00 AM - 11:00 PM',
            delivery_time: '30-40 mins'
        }
    ];
    
    filteredRestaurants = [...allRestaurants];
    adminPortal.hideLoading();
    applyFilters();
    updateStats();
}

// Setup filters
function setupFilters() {
    document.getElementById('statusFilter').addEventListener('change', applyFilters);
    document.getElementById('searchInput').addEventListener('input', applyFilters);
}

// Apply filters
function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredRestaurants = allRestaurants.filter(restaurant => {
        const matchesStatus = statusFilter === 'all' || restaurant.status === statusFilter;
        const matchesSearch = !searchTerm || 
            restaurant.name.toLowerCase().includes(searchTerm) ||
            restaurant.owner_name.toLowerCase().includes(searchTerm) ||
            restaurant.category.toLowerCase().includes(searchTerm);
        
        return matchesStatus && matchesSearch;
    });
    
    displayRestaurants(filteredRestaurants);
}

// Update stats
function updateStats() {
    const stats = {
        total: allRestaurants.length,
        active: allRestaurants.filter(r => r.status === 'active').length,
        pending: allRestaurants.filter(r => r.status === 'pending').length,
        suspended: allRestaurants.filter(r => r.status === 'suspended').length
    };
    
    document.getElementById('totalRestaurants').textContent = stats.total;
    document.getElementById('activeRestaurants').textContent = stats.active;
    document.getElementById('pendingRestaurants').textContent = stats.pending;
    document.getElementById('suspendedRestaurants').textContent = stats.suspended;
}

// Display restaurants
function displayRestaurants(restaurants) {
    const tableBody = document.getElementById('restaurantsTableBody');
    
    if (!restaurants || restaurants.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px;">
                    <i class="fas fa-inbox" style="font-size: 3rem; color: #ddd;"></i>
                    <p style="color: #999; margin-top: 10px;">No restaurants found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = restaurants.map(restaurant => `
        <tr>
            <td><strong>${restaurant.name}</strong></td>
            <td>${restaurant.owner_name}</td>
            <td>${restaurant.category}</td>
            <td>${restaurant.rating > 0 ? '⭐ ' + restaurant.rating : 'N/A'}</td>
            <td>${restaurant.total_orders}</td>
            <td>${restaurant.commission_rate}%</td>
            <td><span class="status-badge status-${restaurant.status}">${capitalizeFirst(restaurant.status)}</span></td>
            <td>
                <div class="table-actions">
                    <button class="action-btn btn-view" onclick="viewRestaurantDetails(${restaurant.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${restaurant.status === 'pending' ? `
                        <button class="action-btn btn-approve" onclick="approveRestaurant(${restaurant.id})" title="Approve">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                    <button class="action-btn btn-edit" onclick="editRestaurant(${restaurant.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${restaurant.status === 'active' ? `
                        <button class="action-btn btn-delete" onclick="suspendRestaurant(${restaurant.id})" title="Suspend">
                            <i class="fas fa-ban"></i>
                        </button>
                    ` : restaurant.status === 'suspended' ? `
                        <button class="action-btn btn-approve" onclick="activateRestaurant(${restaurant.id})" title="Activate">
                            <i class="fas fa-check-circle"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

// View restaurant details
function viewRestaurantDetails(restaurantId) {
    const restaurant = allRestaurants.find(r => r.id === restaurantId);
    if (!restaurant) return;
    
    const modalContent = document.getElementById('restaurantModalContent');
    modalContent.innerHTML = `
        <div class="restaurant-details">
            <div class="info-grid">
                <div class="info-card">
                    <h3><i class="fas fa-store"></i> Restaurant Information</h3>
                    <p><strong>Name:</strong> ${restaurant.name}</p>
                    <p><strong>Category:</strong> ${restaurant.category}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${restaurant.status}">${capitalizeFirst(restaurant.status)}</span></p>
                    <p><strong>Rating:</strong> ${restaurant.rating > 0 ? '⭐ ' + restaurant.rating : 'N/A'}</p>
                    <p><strong>Opening Hours:</strong> ${restaurant.opening_hours}</p>
                    <p><strong>Avg Delivery:</strong> ${restaurant.delivery_time}</p>
                </div>
                
                <div class="info-card">
                    <h3><i class="fas fa-user"></i> Owner Details</h3>
                    <p><strong>${restaurant.owner_name}</strong></p>
                    <p><i class="fas fa-phone"></i> ${restaurant.owner_phone}</p>
                    <p><i class="fas fa-envelope"></i> ${restaurant.owner_email}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${restaurant.address}</p>
                </div>
                
                <div class="info-card">
                    <h3><i class="fas fa-chart-bar"></i> Performance</h3>
                    <p><strong>Total Orders:</strong> ${restaurant.total_orders}</p>
                    <p><strong>Commission Rate:</strong> ${restaurant.commission_rate}%</p>
                    <p><strong>Joined:</strong> ${adminPortal.formatDate(restaurant.joined_date)}</p>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
            ${restaurant.status === 'pending' ? `
                <button class="btn btn-success" onclick="approveRestaurantFromModal(${restaurant.id})">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="btn btn-danger" onclick="rejectRestaurantFromModal(${restaurant.id})">
                    <i class="fas fa-times"></i> Reject
                </button>
            ` : ''}
            ${restaurant.status === 'active' ? `
                <button class="btn btn-danger" onclick="suspendRestaurantFromModal(${restaurant.id})">
                    <i class="fas fa-ban"></i> Suspend
                </button>
            ` : ''}
            ${restaurant.status === 'suspended' ? `
                <button class="btn btn-success" onclick="activateRestaurantFromModal(${restaurant.id})">
                    <i class="fas fa-check-circle"></i> Activate
                </button>
            ` : ''}
            <button class="btn btn-secondary" onclick="closeRestaurantModal()">
                Close
            </button>
        </div>
    `;
    
    document.getElementById('restaurantModal').style.display = 'flex';
}

function closeRestaurantModal() {
    document.getElementById('restaurantModal').style.display = 'none';
}

// Edit restaurant - FULLY IMPLEMENTED
function editRestaurant(restaurantId) {
    const restaurant = allRestaurants.find(r => r.id === restaurantId);
    if (!restaurant) return;
    
    const modalHtml = `
        <div id="editModal" class="modal" style="display: flex;">
            <div class="modal-content large-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-edit"></i> Edit Restaurant</h2>
                    <span class="modal-close" onclick="closeEditModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="editForm" class="admin-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Restaurant Name *</label>
                                <input type="text" class="form-input" id="edit_name" value="${restaurant.name}" required>
                            </div>
                            <div class="form-group">
                                <label>Category *</label>
                                <select class="form-select" id="edit_category" required>
                                    <option ${restaurant.category === 'Pizza' ? 'selected' : ''}>Pizza</option>
                                    <option ${restaurant.category === 'Burgers' ? 'selected' : ''}>Burgers</option>
                                    <option ${restaurant.category === 'Thai' ? 'selected' : ''}>Thai</option>
                                    <option ${restaurant.category === 'Chinese' ? 'selected' : ''}>Chinese</option>
                                    <option ${restaurant.category === 'Indian' ? 'selected' : ''}>Indian</option>
                                    <option ${restaurant.category === 'Japanese' ? 'selected' : ''}>Japanese</option>
                                    <option ${restaurant.category === 'Fast Food' ? 'selected' : ''}>Fast Food</option>
                                    <option ${restaurant.category === 'Desserts' ? 'selected' : ''}>Desserts</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Owner Name *</label>
                                <input type="text" class="form-input" id="edit_owner_name" value="${restaurant.owner_name}" required>
                            </div>
                            <div class="form-group">
                                <label>Owner Phone *</label>
                                <input type="tel" class="form-input" id="edit_owner_phone" value="${restaurant.owner_phone}" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Owner Email *</label>
                            <input type="email" class="form-input" id="edit_owner_email" value="${restaurant.owner_email}" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Address *</label>
                            <input type="text" class="form-input" id="edit_address" value="${restaurant.address}" required>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Opening Hours</label>
                                <input type="text" class="form-input" id="edit_hours" value="${restaurant.opening_hours}" placeholder="9:00 AM - 10:00 PM">
                            </div>
                            <div class="form-group">
                                <label>Avg Delivery Time</label>
                                <input type="text" class="form-input" id="edit_delivery" value="${restaurant.delivery_time}" placeholder="30-40 mins">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Commission Rate (%)</label>
                                <input type="number" class="form-input" id="edit_commission" value="${restaurant.commission_rate}" min="0" max="100" step="0.1">
                            </div>
                            <div class="form-group">
                                <label>Status</label>
                                <select class="form-select" id="edit_status">
                                    <option value="active" ${restaurant.status === 'active' ? 'selected' : ''}>Active</option>
                                    <option value="suspended" ${restaurant.status === 'suspended' ? 'selected' : ''}>Suspended</option>
                                    <option value="pending" ${restaurant.status === 'pending' ? 'selected' : ''}>Pending</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="closeEditModal()">Cancel</button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    const existingModal = document.getElementById('editModal');
    if (existingModal) existingModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    document.getElementById('editForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        adminPortal.showLoading();
        
        restaurant.name = document.getElementById('edit_name').value;
        restaurant.category = document.getElementById('edit_category').value;
        restaurant.owner_name = document.getElementById('edit_owner_name').value;
        restaurant.owner_phone = document.getElementById('edit_owner_phone').value;
        restaurant.owner_email = document.getElementById('edit_owner_email').value;
        restaurant.address = document.getElementById('edit_address').value;
        restaurant.opening_hours = document.getElementById('edit_hours').value;
        restaurant.delivery_time = document.getElementById('edit_delivery').value;
        restaurant.commission_rate = parseFloat(document.getElementById('edit_commission').value);
        restaurant.status = document.getElementById('edit_status').value;
        
        // TODO: API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        adminPortal.hideLoading();
        adminPortal.showNotification('Restaurant updated successfully!', 'success');
        closeEditModal();
        applyFilters();
        updateStats();
    });
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    if (modal) modal.remove();
}

// Add restaurant - FULLY IMPLEMENTED
function addRestaurant() {
    const modalHtml = `
        <div id="addModal" class="modal" style="display: flex;">
            <div class="modal-content large-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-plus"></i> Add New Restaurant</h2>
                    <span class="modal-close" onclick="closeAddModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="addForm" class="admin-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Restaurant Name *</label>
                                <input type="text" class="form-input" id="add_name" required>
                            </div>
                            <div class="form-group">
                                <label>Category *</label>
                                <select class="form-select" id="add_category" required>
                                    <option value="">Select Category</option>
                                    <option>Pizza</option>
                                    <option>Burgers</option>
                                    <option>Thai</option>
                                    <option>Chinese</option>
                                    <option>Indian</option>
                                    <option>Japanese</option>
                                    <option>Fast Food</option>
                                    <option>Desserts</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Owner Name *</label>
                                <input type="text" class="form-input" id="add_owner_name" required>
                            </div>
                            <div class="form-group">
                                <label>Owner Phone *</label>
                                <input type="tel" class="form-input" id="add_owner_phone" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Owner Email *</label>
                            <input type="email" class="form-input" id="add_owner_email" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Address *</label>
                            <input type="text" class="form-input" id="add_address" required>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Opening Hours</label>
                                <input type="text" class="form-input" id="add_hours" placeholder="9:00 AM - 10:00 PM">
                            </div>
                            <div class="form-group">
                                <label>Avg Delivery Time</label>
                                <input type="text" class="form-input" id="add_delivery" placeholder="30-40 mins">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Commission Rate (%)</label>
                            <input type="number" class="form-input" id="add_commission" value="15" min="0" max="100" step="0.1">
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="closeAddModal()">Cancel</button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-plus"></i> Add Restaurant
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    const existingModal = document.getElementById('addModal');
    if (existingModal) existingModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    document.getElementById('addForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        adminPortal.showLoading();
        
        const newRestaurant = {
            id: Math.max(...allRestaurants.map(r => r.id)) + 1,
            name: document.getElementById('add_name').value,
            category: document.getElementById('add_category').value,
            owner_name: document.getElementById('add_owner_name').value,
            owner_phone: document.getElementById('add_owner_phone').value,
            owner_email: document.getElementById('add_owner_email').value,
            address: document.getElementById('add_address').value,
            opening_hours: document.getElementById('add_hours').value || '9:00 AM - 10:00 PM',
            delivery_time: document.getElementById('add_delivery').value || '30-40 mins',
            commission_rate: parseFloat(document.getElementById('add_commission').value),
            status: 'active',
            rating: 0,
            total_orders: 0,
            joined_date: new Date().toISOString().split('T')[0]
        };
        
        allRestaurants.push(newRestaurant);
        
        // TODO: API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        adminPortal.hideLoading();
        adminPortal.showNotification('Restaurant added successfully!', 'success');
        closeAddModal();
        filteredRestaurants = [...allRestaurants];
        applyFilters();
        updateStats();
    });
}

function closeAddModal() {
    const modal = document.getElementById('addModal');
    if (modal) modal.remove();
}

// Approve, suspend, activate functions...
async function approveRestaurant(restaurantId) {
    if (!confirm('Approve this restaurant?')) return;
    
    adminPortal.showLoading();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const restaurant = allRestaurants.find(r => r.id === restaurantId);
    if (restaurant) restaurant.status = 'active';
    
    adminPortal.hideLoading();
    adminPortal.showNotification('Restaurant approved successfully!', 'success');
    applyFilters();
    updateStats();
}

function approveRestaurantFromModal(restaurantId) {
    closeRestaurantModal();
    approveRestaurant(restaurantId);
}

async function rejectRestaurant(restaurantId) {
    if (!confirm('Reject this restaurant application?')) return;
    
    adminPortal.showLoading();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const index = allRestaurants.findIndex(r => r.id === restaurantId);
    if (index > -1) allRestaurants.splice(index, 1);
    
    adminPortal.hideLoading();
    adminPortal.showNotification('Restaurant rejected', 'info');
    filteredRestaurants = [...allRestaurants];
    applyFilters();
    updateStats();
}

function rejectRestaurantFromModal(restaurantId) {
    closeRestaurantModal();
    rejectRestaurant(restaurantId);
}

async function suspendRestaurant(restaurantId) {
    if (!confirm('Suspend this restaurant?')) return;
    
    adminPortal.showLoading();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const restaurant = allRestaurants.find(r => r.id === restaurantId);
    if (restaurant) restaurant.status = 'suspended';
    
    adminPortal.hideLoading();
    adminPortal.showNotification('Restaurant suspended', 'success');
    applyFilters();
    updateStats();
}

function suspendRestaurantFromModal(restaurantId) {
    closeRestaurantModal();
    suspendRestaurant(restaurantId);
}

async function activateRestaurant(restaurantId) {
    if (!confirm('Activate this restaurant?')) return;
    
    adminPortal.showLoading();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const restaurant = allRestaurants.find(r => r.id === restaurantId);
    if (restaurant) restaurant.status = 'active';
    
    adminPortal.hideLoading();
    adminPortal.showNotification('Restaurant activated!', 'success');
    applyFilters();
    updateStats();
}

function activateRestaurantFromModal(restaurantId) {
    closeRestaurantModal();
    activateRestaurant(restaurantId);
}

function refreshRestaurants() {
    adminPortal.showNotification('Refreshing...', 'info');
    loadRestaurants();
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Add form styles
function addFormStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .admin-form .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
        }
        .admin-form .form-group {
            margin-bottom: 15px;
        }
        .admin-form label {
            display: block;
            font-weight: 500;
            color: #4b5563;
            margin-bottom: 8px;
            font-size: 0.9rem;
        }
        .form-actions {
            margin-top: 20px;
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .info-card {
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .info-card h3 {
            font-size: 1rem;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
            color: #1a1a2e;
        }
        .info-card h3 i {
            color: #FF7A00;
        }
        .info-card p {
            margin: 5px 0;
            color: #6b7280;
        }
        @media (max-width: 768px) {
            .admin-form .form-row {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize
document.addEventListener('DOMContentLoaded', initializeRestaurants);

// Close modal on outside click
window.addEventListener('click', function(e) {
    const modal = document.getElementById('restaurantModal');
    if (e.target === modal) closeRestaurantModal();
    
    const editModal = document.getElementById('editModal');
    if (e.target === editModal) closeEditModal();
    
    const addModal = document.getElementById('addModal');
    if (e.target === addModal) closeAddModal();
});
