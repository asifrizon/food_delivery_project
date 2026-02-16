/**
 * Rider Active Deliveries
 */

let activeDeliveries = [];

// Initialize active deliveries page
async function initializeActiveDeliveries() {
    loadActiveDeliveries();
    
    // Auto-refresh every 10 seconds
    setInterval(() => {
        loadActiveDeliveries();
    }, 10000);
}

// Load active deliveries
async function loadActiveDeliveries() {
    const user = riderPortal.checkRiderAuth();
    if (!user) return;
    
    // TODO: Replace with actual API call
    // const result = await riderPortal.apiRequest('/rider/active-deliveries');
    
    // Mock data
    activeDeliveries = [
        {
            order_id: 'ORD-1230',
            restaurant_name: 'Spice Garden',
            restaurant_address: 'Banani 11, Dhaka',
            restaurant_phone: '01634567890',
            customer_name: 'Karim Ali',
            customer_address: 'House 23, Road 5, Banani',
            customer_phone: '01712398745',
            total_amount: 950,
            delivery_fee: 55,
            status: 'picked_up',
            accepted_time: new Date(Date.now() - 15 * 60000).toISOString(),
            pickup_time: new Date(Date.now() - 10 * 60000).toISOString()
        },
        {
            order_id: 'ORD-1231',
            restaurant_name: 'Thai Express',
            restaurant_address: 'Uttara Sector 7, Dhaka',
            restaurant_phone: '01723456789',
            customer_name: 'Hasan Ali',
            customer_address: 'House 12, Road 18, Uttara Sector 10',
            customer_phone: '01634567890',
            total_amount: 1420,
            delivery_fee: 65,
            status: 'in_transit',
            accepted_time: new Date(Date.now() - 25 * 60000).toISOString(),
            pickup_time: new Date(Date.now() - 15 * 60000).toISOString(),
            started_delivery_time: new Date(Date.now() - 5 * 60000).toISOString()
        },
        {
            order_id: 'ORD-1232',
            restaurant_name: 'Pizza Paradise',
            restaurant_address: 'Mirpur 10, Dhaka',
            restaurant_phone: '01712345678',
            customer_name: 'Nadia Ahmed',
            customer_address: 'Flat 2C, PC Culture, Mirpur 11',
            customer_phone: '01745678901',
            total_amount: 1250,
            delivery_fee: 60,
            status: 'accepted',
            accepted_time: new Date(Date.now() - 5 * 60000).toISOString()
        }
    ];
    
    displayActiveDeliveries(activeDeliveries);
}

// Display active deliveries
function displayActiveDeliveries(deliveries) {
    const container = document.getElementById('deliveriesContainer');
    const countEl = document.getElementById('deliveriesCount');
    
    if (countEl) {
        countEl.textContent = deliveries.length;
    }
    
    riderPortal.updateNotificationBadges(0, deliveries.length);
    
    if (!deliveries || deliveries.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-motorcycle"></i>
                <h3>No Active Deliveries</h3>
                <p>Accept orders from the available orders page to start delivering</p>
                <a href="rider-orders.html" class="btn btn-primary" style="margin-top: 20px;">
                    <i class="fas fa-shopping-bag"></i> View Available Orders
                </a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = deliveries.map(delivery => `
        <div class="delivery-card ${getDeliveryCardClass(delivery.status)}">
            <div class="order-header">
                <div>
                    <span class="order-id">#${delivery.order_id}</span>
                    <span class="status-badge status-${delivery.status}">${formatStatus(delivery.status)}</span>
                </div>
                <span class="delivery-timer" id="timer-${delivery.order_id}">${getTimeSinceAccepted(delivery.accepted_time)}</span>
            </div>
            
            <div class="delivery-route">
                <div class="route-point">
                    <div class="route-marker pickup ${delivery.status !== 'accepted' ? 'completed' : ''}">
                        <i class="fas fa-store"></i>
                    </div>
                    <div class="route-info">
                        <h4>${delivery.restaurant_name}</h4>
                        <p>${delivery.restaurant_address}</p>
                        <p class="phone-number"><i class="fas fa-phone"></i> ${delivery.restaurant_phone}</p>
                    </div>
                </div>
                
                <div class="route-connector"></div>
                
                <div class="route-point">
                    <div class="route-marker delivery ${delivery.status === 'delivered' ? 'completed' : ''}">
                        <i class="fas fa-home"></i>
                    </div>
                    <div class="route-info">
                        <h4>${delivery.customer_name}</h4>
                        <p>${delivery.customer_address}</p>
                        <p class="phone-number"><i class="fas fa-phone"></i> ${delivery.customer_phone}</p>
                    </div>
                </div>
            </div>
            
            <div class="delivery-progress">
                <div class="progress-steps">
                    <div class="step ${getStepClass(delivery.status, 'accepted')}">
                        <div class="step-icon"><i class="fas fa-check"></i></div>
                        <span class="step-label">Accepted</span>
                        ${delivery.accepted_time ? `<span class="step-time">${riderPortal.formatTime(delivery.accepted_time)}</span>` : ''}
                    </div>
                    <div class="step ${getStepClass(delivery.status, 'picked_up')}">
                        <div class="step-icon"><i class="fas fa-box"></i></div>
                        <span class="step-label">Picked Up</span>
                        ${delivery.pickup_time ? `<span class="step-time">${riderPortal.formatTime(delivery.pickup_time)}</span>` : ''}
                    </div>
                    <div class="step ${getStepClass(delivery.status, 'in_transit')}">
                        <div class="step-icon"><i class="fas fa-motorcycle"></i></div>
                        <span class="step-label">On the way</span>
                        ${delivery.started_delivery_time ? `<span class="step-time">${riderPortal.formatTime(delivery.started_delivery_time)}</span>` : ''}
                    </div>
                    <div class="step ${getStepClass(delivery.status, 'delivered')}">
                        <div class="step-icon"><i class="fas fa-home"></i></div>
                        <span class="step-label">Delivered</span>
                    </div>
                </div>
            </div>
            
            <div class="delivery-footer">
                <div class="delivery-amount">
                    <span>Your Earning:</span>
                    <strong>${riderPortal.formatCurrency(delivery.delivery_fee)}</strong>
                </div>
                <div class="delivery-actions">
                    ${getActionButtons(delivery)}
                </div>
            </div>
        </div>
    `).join('');
    
    // Update timers every second
    updateTimers();
}

// Helper functions
function formatStatus(status) {
    const statusMap = {
        'accepted': 'Accepted',
        'picked_up': 'Picked Up',
        'in_transit': 'In Transit',
        'delivered': 'Delivered'
    };
    return statusMap[status] || status;
}

function getDeliveryCardClass(status) {
    if (status === 'in_transit') return 'urgent';
    return '';
}

function getStepClass(currentStatus, stepStatus) {
    const statusOrder = ['accepted', 'picked_up', 'in_transit', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return '';
}

function getActionButtons(delivery) {
    switch(delivery.status) {
        case 'accepted':
            return `
                <button class="btn btn-primary" onclick="updateStatus('${delivery.order_id}', 'picked_up')">
                    <i class="fas fa-box"></i> Mark as Picked Up
                </button>
                <button class="btn btn-secondary" onclick="callRestaurant('${delivery.restaurant_phone}')">
                    <i class="fas fa-phone"></i> Call Restaurant
                </button>
            `;
        case 'picked_up':
            return `
                <button class="btn btn-success" onclick="updateStatus('${delivery.order_id}', 'in_transit')">
                    <i class="fas fa-motorcycle"></i> Start Delivery
                </button>
                <button class="btn btn-secondary" onclick="callCustomer('${delivery.customer_phone}')">
                    <i class="fas fa-phone"></i> Call Customer
                </button>
            `;
        case 'in_transit':
            return `
                <button class="btn btn-success btn-lg" onclick="updateStatus('${delivery.order_id}', 'delivered')">
                    <i class="fas fa-check-circle"></i> Mark as Delivered
                </button>
                <button class="btn btn-secondary" onclick="callCustomer('${delivery.customer_phone}')">
                    <i class="fas fa-phone"></i> Call Customer
                </button>
            `;
        default:
            return '';
    }
}

function getTimeSinceAccepted(acceptedTime) {
    const diff = Date.now() - new Date(acceptedTime);
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updateTimers() {
    activeDeliveries.forEach(delivery => {
        const timerEl = document.getElementById(`timer-${delivery.order_id}`);
        if (timerEl) {
            timerEl.textContent = getTimeSinceAccepted(delivery.accepted_time);
        }
    });
}

// Update delivery status
async function updateStatus(orderId, newStatus) {
    const delivery = activeDeliveries.find(d => d.order_id === orderId);
    if (!delivery) return;
    
    // Show confirmation modal
    const modalContent = document.getElementById('actionModalContent');
    const statusLabel = formatStatus(newStatus);
    
    modalContent.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <i class="fas fa-${newStatus === 'picked_up' ? 'box' : newStatus === 'in_transit' ? 'motorcycle' : 'check-circle'}" style="font-size: 4rem; color: #FF7A00; margin-bottom: 20px;"></i>
            <h3 style="margin-bottom: 10px;">Confirm ${statusLabel}?</h3>
            <p style="color: #6b7280; margin-bottom: 20px;">
                ${getStatusConfirmationMessage(newStatus)}
            </p>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-secondary" onclick="closeActionModal()" style="flex: 1;">
                    Cancel
                </button>
                <button class="btn btn-success" onclick="confirmStatusUpdate('${orderId}', '${newStatus}')" style="flex: 1;">
                    <i class="fas fa-check"></i> Confirm
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('actionModalTitle').innerHTML = `<i class="fas fa-check"></i> Confirm ${statusLabel}`;
    document.getElementById('actionModal').style.display = 'flex';
}

function getStatusConfirmationMessage(status) {
    switch(status) {
        case 'picked_up':
            return 'Have you collected the order from the restaurant? Make sure all items are included.';
        case 'in_transit':
            return 'Are you starting the delivery now? The customer will be notified.';
        case 'delivered':
            return 'Have you successfully delivered the order to the customer? This cannot be undone.';
        default:
            return 'Are you sure you want to update the status?';
    }
}

async function confirmStatusUpdate(orderId, newStatus) {
    closeActionModal();
    riderPortal.showLoading();
    
    // TODO: API call to update status
    // await riderPortal.apiRequest(`/rider/orders/${orderId}/status`, 'PUT', { status: newStatus });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update delivery status
    const delivery = activeDeliveries.find(d => d.order_id === orderId);
    if (delivery) {
        delivery.status = newStatus;
        
        // Set timestamp for the status
        if (newStatus === 'picked_up') {
            delivery.pickup_time = new Date().toISOString();
        } else if (newStatus === 'in_transit') {
            delivery.started_delivery_time = new Date().toISOString();
        }
        
        // If delivered, remove from active
        if (newStatus === 'delivered') {
            const index = activeDeliveries.findIndex(d => d.order_id === orderId);
            if (index !== -1) {
                activeDeliveries.splice(index, 1);
            }
        }
    }
    
    riderPortal.hideLoading();
    riderPortal.showNotification(`Order ${formatStatus(newStatus)}!`, 'success');
    
    // Refresh display
    displayActiveDeliveries(activeDeliveries);
}

function closeActionModal() {
    document.getElementById('actionModal').style.display = 'none';
}

// Call functions
function callRestaurant(phone) {
    window.location.href = `tel:${phone}`;
}

function callCustomer(phone) {
    window.location.href = `tel:${phone}`;
}

// Add styles for delivery cards
const deliveryStyles = document.createElement('style');
deliveryStyles.textContent = `
    .delivery-card.urgent {
        border-left: 4px solid #f59e0b;
        animation: pulse-border 2s infinite;
    }
    
    @keyframes pulse-border {
        0%, 100% { border-left-color: #f59e0b; }
        50% { border-left-color: #FF7A00; }
    }
    
    .delivery-timer {
        font-family: 'Courier New', monospace;
        font-size: 1.1rem;
        font-weight: 700;
        color: #FF7A00;
        padding: 4px 12px;
        background: rgba(255, 122, 0, 0.1);
        border-radius: 6px;
    }
    
    .delivery-route {
        margin: 20px 0;
        position: relative;
    }
    
    .route-point {
        display: flex;
        gap: 15px;
        margin-bottom: 20px;
    }
    
    .route-marker {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        flex-shrink: 0;
        border: 3px solid #e5e7eb;
        background: white;
        color: #9ca3af;
    }
    
    .route-marker.pickup {
        border-color: #FF7A00;
        background: #FF7A00;
        color: white;
    }
    
    .route-marker.delivery {
        border-color: #6366f1;
        background: #6366f1;
        color: white;
    }
    
    .route-marker.completed {
        border-color: #10b981;
        background: #10b981;
        color: white;
    }
    
    .route-connector {
        height: 40px;
        width: 3px;
        background: #e5e7eb;
        margin-left: 22px;
        margin-top: -10px;
        margin-bottom: -10px;
    }
    
    .route-info h4 {
        font-size: 1rem;
        font-weight: 600;
        color: #1a1a2e;
        margin-bottom: 5px;
    }
    
    .route-info p {
        font-size: 0.9rem;
        color: #6b7280;
        margin: 3px 0;
    }
    
    .phone-number {
        color: #FF7A00 !important;
        font-weight: 500;
    }
    
    .phone-number i {
        margin-right: 5px;
    }
    
    .delivery-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 2px solid #f3f4f6;
    }
    
    .delivery-amount {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    
    .delivery-amount span {
        font-size: 0.85rem;
        color: #6b7280;
    }
    
    .delivery-amount strong {
        font-size: 1.5rem;
        color: #10b981;
    }
    
    .delivery-actions {
        display: flex;
        gap: 10px;
    }
    
    .btn-lg {
        padding: 12px 24px;
        font-size: 1rem;
    }
    
    .step-time {
        font-size: 0.7rem;
        color: #6b7280;
        display: block;
        margin-top: 2px;
    }
    
    @media (max-width: 768px) {
        .delivery-footer {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
        }
        
        .delivery-actions {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(deliveryStyles);

// Initialize page when loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeActiveDeliveries();
    
    // Update timers every second
    setInterval(updateTimers, 1000);
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('actionModal');
    if (e.target === modal) {
        closeActionModal();
    }
});
