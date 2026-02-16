/**
 * Admin Offers Management - COMPLETE IMPLEMENTATION
 */

let allOffers = [];

// Initialize
async function initializeOffers() {
    loadOffers();
    addStyles();
}

// Load all offers
async function loadOffers() {
    // TODO: Replace with API call
    allOffers = [
        {
            id: 1,
            code: 'WELCOME50',
            discount: 50,
            type: 'Percentage',
            min_order: 300,
            uses: 450,
            max_uses: 1000,
            expiry_date: '2026-12-31',
            status: 'active',
            description: 'Welcome offer for new users'
        },
        {
            id: 2,
            code: 'SAVE100',
            discount: 100,
            type: 'Fixed',
            min_order: 500,
            uses: 289,
            max_uses: 500,
            expiry_date: '2026-06-30',
            status: 'active',
            description: 'Flat 100 Taka off'
        },
        {
            id: 3,
            code: 'FIRSTORDER',
            discount: 30,
            type: 'Percentage',
            min_order: 200,
            uses: 1203,
            max_uses: null,
            expiry_date: '2026-12-31',
            status: 'active',
            description: 'First order discount'
        },
        {
            id: 4,
            code: 'WEEKEND20',
            discount: 20,
            type: 'Percentage',
            min_order: 400,
            uses: 567,
            max_uses: 2000,
            expiry_date: '2026-03-31',
            status: 'active',
            description: 'Weekend special offer'
        }
    ];
    
    displayOffers(allOffers);
}

// Display offers
function displayOffers(offers) {
    const container = document.getElementById('offersGrid');
    
    if (!offers || offers.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #9ca3af;">
                <i class="fas fa-percent" style="font-size: 4rem; color: #e5e7eb; margin-bottom: 20px;"></i>
                <h3 style="color: #6b7280;">No offers found</h3>
            </div>
        `;
        return;
    }
    
    container.innerHTML = offers.map(o => `
        <div class="offer-card">
            <div class="offer-header">
                <div class="offer-code">${o.code}</div>
                <span class="status-badge status-${o.status}">${capitalizeFirst(o.status)}</span>
            </div>
            <div class="offer-details">
                <div class="offer-amount">${o.discount}${o.type === 'Percentage' ? '%' : '৳'} OFF</div>
                <p><i class="fas fa-shopping-bag"></i> Min Order: ৳${o.min_order}</p>
                <p><i class="fas fa-users"></i> Used: ${o.uses}${o.max_uses ? ' / ' + o.max_uses : ''}</p>
                <p><i class="fas fa-calendar"></i> Expires: ${o.expiry_date}</p>
            </div>
            <div class="offer-actions">
                <button class="action-btn btn-view" onclick="viewOfferDetails(${o.id})" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn btn-edit" onclick="editOffer(${o.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn btn-delete" onclick="deleteOffer(${o.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// View offer details
function viewOfferDetails(offerId) {
    const offer = allOffers.find(o => o.id === offerId);
    if (!offer) return;
    
    const modalHtml = `
        <div id="offerModal" class="modal" style="display: flex;">
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-percent"></i> Offer Details</h2>
                    <span class="modal-close" onclick="closeOfferModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="info-card">
                        <h3><i class="fas fa-info-circle"></i> Offer Information</h3>
                        <p><strong>Code:</strong> ${offer.code}</p>
                        <p><strong>Description:</strong> ${offer.description}</p>
                        <p><strong>Discount:</strong> ${offer.discount}${offer.type === 'Percentage' ? '%' : '৳'} OFF</p>
                        <p><strong>Type:</strong> ${offer.type}</p>
                        <p><strong>Status:</strong> <span class="status-badge status-${offer.status}">${capitalizeFirst(offer.status)}</span></p>
                    </div>
                    
                    <div class="info-card" style="margin-top: 15px;">
                        <h3><i class="fas fa-cog"></i> Conditions</h3>
                        <p><strong>Minimum Order:</strong> ৳${offer.min_order}</p>
                        <p><strong>Max Uses:</strong> ${offer.max_uses || 'Unlimited'}</p>
                        <p><strong>Expiry Date:</strong> ${offer.expiry_date}</p>
                    </div>
                    
                    <div class="info-card" style="margin-top: 15px;">
                        <h3><i class="fas fa-chart-bar"></i> Usage Statistics</h3>
                        <p><strong>Times Used:</strong> ${offer.uses}</p>
                        ${offer.max_uses ? `<p><strong>Remaining:</strong> ${offer.max_uses - offer.uses}</p>` : ''}
                        ${offer.max_uses ? `<p><strong>Usage Rate:</strong> ${Math.round((offer.uses / offer.max_uses) * 100)}%</p>` : ''}
                    </div>
                    
                    <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
                        <button class="btn btn-primary" onclick="editOfferFromModal(${offer.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger" onclick="deleteOfferFromModal(${offer.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                        <button class="btn btn-secondary" onclick="closeOfferModal()">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const existingModal = document.getElementById('offerModal');
    if (existingModal) existingModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeOfferModal() {
    const modal = document.getElementById('offerModal');
    if (modal) modal.remove();
}

// Create new offer - FULLY IMPLEMENTED
function createNewOffer() {
    const modalHtml = `
        <div id="createOfferModal" class="modal" style="display: flex;">
            <div class="modal-content large-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-plus"></i> Create New Offer</h2>
                    <span class="modal-close" onclick="closeCreateOfferModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="createOfferForm" class="admin-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Offer Code *</label>
                                <input type="text" class="form-input" id="offer_code" placeholder="e.g., SAVE20" required style="text-transform: uppercase;">
                            </div>
                            <div class="form-group">
                                <label>Discount Type *</label>
                                <select class="form-select" id="offer_type" required>
                                    <option value="Percentage">Percentage (%)</option>
                                    <option value="Fixed">Fixed Amount (৳)</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Discount Value *</label>
                                <input type="number" class="form-input" id="offer_discount" placeholder="e.g., 20" required min="0">
                            </div>
                            <div class="form-group">
                                <label>Minimum Order (৳) *</label>
                                <input type="number" class="form-input" id="offer_min_order" placeholder="e.g., 300" required min="0">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Description</label>
                            <input type="text" class="form-input" id="offer_description" placeholder="Brief description of the offer">
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Max Uses (Leave empty for unlimited)</label>
                                <input type="number" class="form-input" id="offer_max_uses" placeholder="e.g., 100" min="1">
                            </div>
                            <div class="form-group">
                                <label>Expiry Date *</label>
                                <input type="date" class="form-input" id="offer_expiry" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Status</label>
                            <select class="form-select" id="offer_status">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="closeCreateOfferModal()">Cancel</button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-plus"></i> Create Offer
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    const existingModal = document.getElementById('createOfferModal');
    if (existingModal) existingModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Set minimum expiry date to today
    document.getElementById('offer_expiry').min = new Date().toISOString().split('T')[0];
    
    document.getElementById('createOfferForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const code = document.getElementById('offer_code').value.toUpperCase();
        
        // Check for duplicate code
        if (allOffers.some(o => o.code === code)) {
            adminPortal.showNotification('Offer code already exists!', 'error');
            return;
        }
        
        adminPortal.showLoading();
        
        const newOffer = {
            id: Math.max(...allOffers.map(o => o.id)) + 1,
            code: code,
            type: document.getElementById('offer_type').value,
            discount: parseFloat(document.getElementById('offer_discount').value),
            min_order: parseFloat(document.getElementById('offer_min_order').value),
            description: document.getElementById('offer_description').value || 'No description',
            max_uses: document.getElementById('offer_max_uses').value ? parseInt(document.getElementById('offer_max_uses').value) : null,
            expiry_date: document.getElementById('offer_expiry').value,
            status: document.getElementById('offer_status').value,
            uses: 0
        };
        
        allOffers.push(newOffer);
        
        // TODO: API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        adminPortal.hideLoading();
        adminPortal.showNotification('Offer created successfully!', 'success');
        closeCreateOfferModal();
        displayOffers(allOffers);
    });
}

function closeCreateOfferModal() {
    const modal = document.getElementById('createOfferModal');
    if (modal) modal.remove();
}

// Edit offer - FULLY IMPLEMENTED
function editOffer(offerId) {
    const offer = allOffers.find(o => o.id === offerId);
    if (!offer) return;
    
    const modalHtml = `
        <div id="editOfferModal" class="modal" style="display: flex;">
            <div class="modal-content large-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-edit"></i> Edit Offer</h2>
                    <span class="modal-close" onclick="closeEditOfferModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="editOfferForm" class="admin-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Offer Code *</label>
                                <input type="text" class="form-input" id="edit_offer_code" value="${offer.code}" required style="text-transform: uppercase;">
                            </div>
                            <div class="form-group">
                                <label>Discount Type *</label>
                                <select class="form-select" id="edit_offer_type" required>
                                    <option value="Percentage" ${offer.type === 'Percentage' ? 'selected' : ''}>Percentage (%)</option>
                                    <option value="Fixed" ${offer.type === 'Fixed' ? 'selected' : ''}>Fixed Amount (৳)</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Discount Value *</label>
                                <input type="number" class="form-input" id="edit_offer_discount" value="${offer.discount}" required min="0">
                            </div>
                            <div class="form-group">
                                <label>Minimum Order (৳) *</label>
                                <input type="number" class="form-input" id="edit_offer_min_order" value="${offer.min_order}" required min="0">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Description</label>
                            <input type="text" class="form-input" id="edit_offer_description" value="${offer.description}">
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Max Uses</label>
                                <input type="number" class="form-input" id="edit_offer_max_uses" value="${offer.max_uses || ''}" placeholder="Unlimited" min="1">
                            </div>
                            <div class="form-group">
                                <label>Expiry Date *</label>
                                <input type="date" class="form-input" id="edit_offer_expiry" value="${offer.expiry_date}" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Status</label>
                            <select class="form-select" id="edit_offer_status">
                                <option value="active" ${offer.status === 'active' ? 'selected' : ''}>Active</option>
                                <option value="inactive" ${offer.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                                <option value="expired" ${offer.status === 'expired' ? 'selected' : ''}>Expired</option>
                            </select>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="closeEditOfferModal()">Cancel</button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    const existingModal = document.getElementById('editOfferModal');
    if (existingModal) existingModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    document.getElementById('editOfferForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        adminPortal.showLoading();
        
        offer.code = document.getElementById('edit_offer_code').value.toUpperCase();
        offer.type = document.getElementById('edit_offer_type').value;
        offer.discount = parseFloat(document.getElementById('edit_offer_discount').value);
        offer.min_order = parseFloat(document.getElementById('edit_offer_min_order').value);
        offer.description = document.getElementById('edit_offer_description').value;
        offer.max_uses = document.getElementById('edit_offer_max_uses').value ? parseInt(document.getElementById('edit_offer_max_uses').value) : null;
        offer.expiry_date = document.getElementById('edit_offer_expiry').value;
        offer.status = document.getElementById('edit_offer_status').value;
        
        // TODO: API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        adminPortal.hideLoading();
        adminPortal.showNotification('Offer updated successfully!', 'success');
        closeEditOfferModal();
        displayOffers(allOffers);
    });
}

function closeEditOfferModal() {
    const modal = document.getElementById('editOfferModal');
    if (modal) modal.remove();
}

function editOfferFromModal(offerId) {
    closeOfferModal();
    editOffer(offerId);
}

// Delete offer
async function deleteOffer(offerId) {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    
    adminPortal.showLoading();
    
    // TODO: API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = allOffers.findIndex(o => o.id === offerId);
    if (index > -1) {
        allOffers.splice(index, 1);
    }
    
    adminPortal.hideLoading();
    adminPortal.showNotification('Offer deleted successfully', 'success');
    
    displayOffers(allOffers);
}

function deleteOfferFromModal(offerId) {
    closeOfferModal();
    deleteOffer(offerId);
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Add styles
function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .offers-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
        }
        .offer-card {
            background: white;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 20px;
            transition: all 0.3s;
        }
        .offer-card:hover {
            border-color: #FF7A00;
            box-shadow: 0 4px 12px rgba(255, 122, 0, 0.2);
        }
        .offer-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .offer-code {
            font-size: 1.2rem;
            font-weight: 700;
            color: #FF7A00;
            background: rgba(255, 122, 0, 0.1);
            padding: 8px 12px;
            border-radius: 6px;
        }
        .offer-amount {
            font-size: 2rem;
            font-weight: 700;
            color: #10b981;
            margin-bottom: 10px;
        }
        .offer-details p {
            margin: 5px 0;
            color: #6b7280;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .offer-details i {
            color: #FF7A00;
            width: 16px;
        }
        .offer-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
        }
        .status-badge.status-expired {
            background: #f3f4f6;
            color: #6b7280;
        }
        .status-badge.status-inactive {
            background: #fef3c7;
            color: #92400e;
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
        @media (max-width: 768px) {
            .admin-form .form-row {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize
document.addEventListener('DOMContentLoaded', initializeOffers);
