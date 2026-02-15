/**
 * Owner Offers Management
 */

let currentOfferId = null;
let currentRestaurantId = null;
let allOffers = [];

// Initialize page
async function initializeOffers() {
    loadRestaurants();
    setupRestaurantSelector();
    setupOfferTypeChange();
}

// Load restaurants
async function loadRestaurants() {
    const user = ownerPortal.checkOwnerAuth();
    if (!user) return;
    
    // Mock data
    const mockRestaurants = [
        { restaurant_id: 1, name: "Pizza Paradise" },
        { restaurant_id: 2, name: "Burger House" }
    ];
    
    const selector = document.getElementById('restaurantSelector');
    selector.innerHTML = '<option value="">Select Restaurant...</option>' +
        mockRestaurants.map(r => `<option value="${r.restaurant_id}">${r.name}</option>`).join('');
}

// Setup restaurant selector
function setupRestaurantSelector() {
    const selector = document.getElementById('restaurantSelector');
    selector.addEventListener('change', function() {
        currentRestaurantId = parseInt(this.value);
        if (currentRestaurantId) {
            loadOffers(currentRestaurantId);
        } else {
            displayEmptyState();
        }
    });
}

// Setup offer type change
function setupOfferTypeChange() {
    const offerType = document.getElementById('offerType');
    const offerValueHint = document.getElementById('offerValueHint');
    
    offerType.addEventListener('change', function() {
        if (this.value === 'percentage') {
            offerValueHint.textContent = 'Enter percentage (e.g., 20 for 20%)';
        } else if (this.value === 'flat') {
            offerValueHint.textContent = 'Enter amount in ৳ (e.g., 100 for ৳100 off)';
        }
    });
}

// Load offers
async function loadOffers(restaurantId) {
    ownerPortal.showLoading();
    
    // TODO: Replace with API call
    // const result = await ownerPortal.apiRequest(`/owner/restaurants/${restaurantId}/offers`);
    
    // Mock data
    allOffers = [
        {
            offer_id: 1,
            restaurant_id: restaurantId,
            offer_type: 'percentage',
            offer_value: 20,
            min_order_amount: 500,
            max_discount: 200,
            start_time: new Date().toISOString(),
            end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            usage_count: 45,
            status: 'active'
        },
        {
            offer_id: 2,
            restaurant_id: restaurantId,
            offer_type: 'flat',
            offer_value: 100,
            min_order_amount: 800,
            max_discount: null,
            start_time: new Date().toISOString(),
            end_time: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            usage_count: 28,
            status: 'active'
        },
        {
            offer_id: 3,
            restaurant_id: restaurantId,
            offer_type: 'percentage',
            offer_value: 15,
            min_order_amount: 300,
            max_discount: 150,
            start_time: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end_time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            usage_count: 112,
            status: 'expired'
        }
    ];
    
    ownerPortal.hideLoading();
    displayOffers(allOffers);
}

// Display offers
function displayOffers(offers) {
    const grid = document.getElementById('offersGrid');
    
    if (!offers || offers.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-percent"></i>
                <h3>No Offers Yet</h3>
                <p>Create your first offer to attract more customers</p>
                <button class="btn btn-primary" onclick="openAddOfferModal()">
                    <i class="fas fa-plus"></i> Create Offer
                </button>
            </div>
        `;
        return;
    }
    
    // Separate active and expired
    const activeOffers = offers.filter(o => o.status === 'active');
    const expiredOffers = offers.filter(o => o.status === 'expired');
    
    let html = '';
    
    if (activeOffers.length > 0) {
        html += '<h3 class="section-title"><i class="fas fa-check-circle"></i> Active Offers</h3>';
        html += '<div class="offers-list">' + activeOffers.map(offer => renderOfferCard(offer)).join('') + '</div>';
    }
    
    if (expiredOffers.length > 0) {
        html += '<h3 class="section-title" style="margin-top: 30px;"><i class="fas fa-clock"></i> Expired Offers</h3>';
        html += '<div class="offers-list">' + expiredOffers.map(offer => renderOfferCard(offer)).join('') + '</div>';
    }
    
    grid.innerHTML = html;
}

// Render offer card
function renderOfferCard(offer) {
    const isActive = offer.status === 'active';
    const discountText = offer.offer_type === 'percentage' 
        ? `${offer.offer_value}% OFF` 
        : `৳${offer.offer_value} OFF`;
    
    const endDate = new Date(offer.end_time);
    const daysLeft = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));
    
    return `
        <div class="offer-card ${!isActive ? 'expired' : ''}">
            <div class="offer-badge ${isActive ? 'badge-active' : 'badge-expired'}">
                ${isActive ? 'ACTIVE' : 'EXPIRED'}
            </div>
            
            <div class="offer-header">
                <div class="discount-display">
                    <i class="fas fa-tag"></i>
                    <h2>${discountText}</h2>
                </div>
                <span class="offer-type-label">${offer.offer_type === 'percentage' ? 'Percentage' : 'Flat'} Discount</span>
            </div>
            
            <div class="offer-details">
                <div class="detail-row">
                    <i class="fas fa-shopping-cart"></i>
                    <span>Min Order: <strong>৳${offer.min_order_amount.toFixed(2)}</strong></span>
                </div>
                ${offer.max_discount ? `
                    <div class="detail-row">
                        <i class="fas fa-coins"></i>
                        <span>Max Discount: <strong>৳${offer.max_discount.toFixed(2)}</strong></span>
                    </div>
                ` : ''}
                <div class="detail-row">
                    <i class="fas fa-calendar"></i>
                    <span>Valid till: <strong>${ownerPortal.formatDate(offer.end_time)}</strong></span>
                </div>
                ${isActive && daysLeft <= 7 ? `
                    <div class="detail-row warning">
                        <i class="fas fa-clock"></i>
                        <span>Expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}</span>
                    </div>
                ` : ''}
                <div class="detail-row">
                    <i class="fas fa-users"></i>
                    <span>Used <strong>${offer.usage_count}</strong> times</span>
                </div>
            </div>
            
            <div class="offer-actions">
                ${isActive ? `
                    <button class="btn btn-secondary btn-sm" onclick="editOffer(${offer.offer_id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="toggleOfferStatus(${offer.offer_id})">
                        <i class="fas fa-pause"></i> Deactivate
                    </button>
                ` : `
                    <button class="btn btn-danger btn-sm" onclick="deleteOffer(${offer.offer_id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                `}
            </div>
        </div>
    `;
}

// Open add offer modal
function openAddOfferModal() {
    if (!currentRestaurantId) {
        ownerPortal.showNotification('Please select a restaurant first', 'error');
        return;
    }
    
    currentOfferId = null;
    document.getElementById('modalTitle').textContent = 'Create New Offer';
    document.getElementById('offerForm').reset();
    
    // Set default dates
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    document.getElementById('startDate').value = tomorrow.toISOString().slice(0, 16);
    document.getElementById('endDate').value = nextWeek.toISOString().slice(0, 16);
    
    document.getElementById('offerModal').style.display = 'block';
}

// Edit offer
function editOffer(offerId) {
    currentOfferId = offerId;
    const offer = allOffers.find(o => o.offer_id === offerId);
    
    if (!offer) return;
    
    document.getElementById('modalTitle').textContent = 'Edit Offer';
    document.getElementById('offerType').value = offer.offer_type;
    document.getElementById('offerValue').value = offer.offer_value;
    document.getElementById('minOrderAmount').value = offer.min_order_amount;
    document.getElementById('maxDiscount').value = offer.max_discount || '';
    document.getElementById('startDate').value = new Date(offer.start_time).toISOString().slice(0, 16);
    document.getElementById('endDate').value = new Date(offer.end_time).toISOString().slice(0, 16);
    
    // Trigger hint update
    document.getElementById('offerType').dispatchEvent(new Event('change'));
    
    document.getElementById('offerModal').style.display = 'block';
}

// Toggle offer status
async function toggleOfferStatus(offerId) {
    if (!confirm('Are you sure you want to deactivate this offer?')) return;
    
    const offer = allOffers.find(o => o.offer_id === offerId);
    if (!offer) return;
    
    ownerPortal.showLoading();
    
    // TODO: API call
    // await ownerPortal.apiRequest(`/owner/offers/${offerId}/status`, 'PUT', { status: 'inactive' });
    
    offer.status = 'expired';
    
    ownerPortal.hideLoading();
    ownerPortal.showNotification('Offer deactivated successfully!', 'success');
    
    displayOffers(allOffers);
}

// Delete offer
async function deleteOffer(offerId) {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    
    ownerPortal.showLoading();
    
    // TODO: API call
    // await ownerPortal.apiRequest(`/owner/offers/${offerId}`, 'DELETE');
    
    allOffers = allOffers.filter(o => o.offer_id !== offerId);
    
    ownerPortal.hideLoading();
    ownerPortal.showNotification('Offer deleted successfully!', 'success');
    
    displayOffers(allOffers);
}

// Close modal
function closeOfferModal() {
    document.getElementById('offerModal').style.display = 'none';
    currentOfferId = null;
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    initializeOffers();
    
    const form = document.getElementById('offerForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                restaurant_id: currentRestaurantId,
                offer_type: document.getElementById('offerType').value,
                offer_value: parseFloat(document.getElementById('offerValue').value),
                min_order_amount: parseFloat(document.getElementById('minOrderAmount').value) || 0,
                max_discount: document.getElementById('maxDiscount').value ? parseFloat(document.getElementById('maxDiscount').value) : null,
                start_time: new Date(document.getElementById('startDate').value).toISOString(),
                end_time: new Date(document.getElementById('endDate').value).toISOString()
            };
            
            // Validate dates
            if (new Date(formData.start_time) >= new Date(formData.end_time)) {
                ownerPortal.showNotification('End date must be after start date', 'error');
                return;
            }
            
            ownerPortal.showLoading();
            
            if (currentOfferId) {
                // Update
                // await ownerPortal.apiRequest(`/owner/offers/${currentOfferId}`, 'PUT', formData);
                const offerIndex = allOffers.findIndex(o => o.offer_id === currentOfferId);
                if (offerIndex !== -1) {
                    allOffers[offerIndex] = { ...allOffers[offerIndex], ...formData };
                }
                ownerPortal.showNotification('Offer updated successfully!', 'success');
            } else {
                // Create
                // await ownerPortal.apiRequest('/owner/offers', 'POST', formData);
                allOffers.push({
                    ...formData,
                    offer_id: Date.now(),
                    usage_count: 0,
                    status: 'active'
                });
                ownerPortal.showNotification('Offer created successfully!', 'success');
            }
            
            ownerPortal.hideLoading();
            closeOfferModal();
            
            displayOffers(allOffers);
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('offerModal');
        if (e.target === modal) {
            closeOfferModal();
        }
    });
});

function displayEmptyState() {
    document.getElementById('offersGrid').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-percent"></i>
            <h3>Select a Restaurant</h3>
            <p>Choose a restaurant to view and manage its offers</p>
        </div>
    `;
}
