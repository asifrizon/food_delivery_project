/**
 * Rider Dashboard - Main Logic
 */

let availableOrders = [];
let activeDeliveries = [];
let stats = {};

// Initialize dashboard
async function initializeDashboard() {
    loadDashboardStats();
    loadAvailableOrders();
    loadActiveDeliveries();
    
    // Auto-refresh every 30 seconds if online
    setInterval(() => {
        if (riderPortal.getRiderOnlineStatus()) {
            loadAvailableOrders();
            loadActiveDeliveries();
            loadDashboardStats();
        }
    }, 30000);
}

// Load dashboard statistics
async function loadDashboardStats() {
    const user = riderPortal.checkRiderAuth();
    if (!user) return;
    
    // TODO: Replace with actual API calls
    // const stats = await riderPortal.apiRequest('/rider/stats');
    
    // Mock data
    stats = {
        todayEarnings: 850,
        todayDeliveries: 12,
        activeOrders: 2,
        rating: 4.8,
        weekDeliveries: 45,
        monthDeliveries: 180,
        weekEarnings: 3250,
        totalDeliveries: 856
    };
    
    // Update stat cards
    document.getElementById('todayEarnings').textContent = riderPortal.formatCurrency(stats.todayEarnings);
    document.getElementById('todayDeliveries').textContent = stats.todayDeliveries;
    document.getElementById('activeOrders').textContent = stats.activeOrders;
    document.getElementById('riderRating').textContent = stats.rating.toFixed(1);
    
    // Update quick stats
    document.getElementById('weekDeliveries').textContent = stats.weekDeliveries;
    document.getElementById('monthDeliveries').textContent = stats.monthDeliveries;
    document.getElementById('weekEarnings').textContent = riderPortal.formatCurrency(stats.weekEarnings);
    document.getElementById('totalDeliveries').textContent = stats.totalDeliveries;
}

// Load available orders
async function loadAvailableOrders() {
    const user = riderPortal.checkRiderAuth();
    if (!user) return;
    
    // Only load if rider is online
    if (!riderPortal.getRiderOnlineStatus()) {
        displayNoAvailableOrders();
        return;
    }
    
    // TODO: Replace with actual API call
    // const result = await riderPortal.apiRequest('/rider/available-orders');
    
    // Mock data
    availableOrders = [
        {
            order_id: 'ORD-1234',
            restaurant_name: 'Pizza Paradise',
            restaurant_address: 'Mirpur 10, Dhaka',
            customer_name: 'Ahmed Hassan',
            customer_address: 'House 45, Road 12, Mirpur 12',
            items_count: 3,
            total_amount: 1250,
            delivery_fee: 60,
            distance: 2.5,
            pickup_time: new Date(Date.now() + 15 * 60000).toISOString(),
            created_at: new Date(Date.now() - 5 * 60000).toISOString()
        },
        {
            order_id: 'ORD-1235',
            restaurant_name: 'Burger House',
            restaurant_address: 'Dhanmondi 27, Dhaka',
            customer_name: 'Fatima Rahman',
            customer_address: 'Flat 3B, Green View, Dhanmondi 32',
            items_count: 2,
            total_amount: 850,
            delivery_fee: 50,
            distance: 1.8,
            pickup_time: new Date(Date.now() + 20 * 60000).toISOString(),
            created_at: new Date(Date.now() - 3 * 60000).toISOString()
        }
    ];
    
    displayAvailableOrders(availableOrders.slice(0, 3)); // Show only first 3 on dashboard
    riderPortal.updateNotificationBadges(availableOrders.length, activeDeliveries.length);
}

// Display available orders
function displayAvailableOrders(orders) {
    const container = document.getElementById('availableOrdersContainer');
    
    if (!orders || orders.length === 0) {
        displayNoAvailableOrders();
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span class="order-id">#${order.order_id}</span>
                <span class="order-status new">New</span>
            </div>
            
            <div class="order-info">
                <div class="info-row">
                    <i class="fas fa-store"></i>
                    <span><strong>${order.restaurant_name}</strong></span>
                </div>
                <div class="info-row">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${order.restaurant_address}</span>
                </div>
                <div class="info-row">
                    <i class="fas fa-user"></i>
                    <span>${order.customer_name}</span>
                </div>
                <div class="info-row">
                    <i class="fas fa-home"></i>
                    <span>${order.customer_address}</span>
                </div>
                <div class="info-row">
                    <i class="fas fa-route"></i>
                    <span>${order.distance} km away</span>
                </div>
                <div class="info-row">
                    <i class="fas fa-clock"></i>
                    <span>Ready in ${Math.ceil((new Date(order.pickup_time) - new Date()) / 60000)} min</span>
                </div>
            </div>
            
            <div class="order-amount">
                Delivery Fee: ${riderPortal.formatCurrency(order.delivery_fee)}
            </div>
            
            <div class="order-actions">
                <button class="btn btn-secondary" onclick="viewOrderDetails('${order.order_id}')">
                    <i class="fas fa-eye"></i> Details
                </button>
                <button class="btn btn-success" onclick="acceptOrder('${order.order_id}')">
                    <i class="fas fa-check"></i> Accept
                </button>
            </div>
        </div>
    `).join('');
}

function displayNoAvailableOrders() {
    const container = document.getElementById('availableOrdersContainer');
    container.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-inbox"></i>
            <h3>No Available Orders</h3>
            <p>${riderPortal.getRiderOnlineStatus() ? 
                'Waiting for new orders...' : 
                'Go online to receive delivery requests'}</p>
        </div>
    `;
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
            customer_name: 'Karim Ali',
            customer_address: 'House 23, Road 5, Banani',
            total_amount: 950,
            delivery_fee: 55,
            status: 'picked_up',
            pickup_time: new Date(Date.now() - 10 * 60000).toISOString()
        }
    ];
    
    displayActiveDeliveries(activeDeliveries.slice(0, 2)); // Show only first 2 on dashboard
    riderPortal.updateNotificationBadges(availableOrders.length, activeDeliveries.length);
}

// Display active deliveries
function displayActiveDeliveries(deliveries) {
    const container = document.getElementById('activeDeliveriesContainer');
    
    if (!deliveries || deliveries.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-motorcycle"></i>
                <h3>No Active Deliveries</h3>
                <p>Accept orders to start delivering</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = deliveries.map(delivery => `
        <div class="delivery-card">
            <div class="order-header">
                <span class="order-id">#${delivery.order_id}</span>
                <span class="order-status ${delivery.status}">${formatStatus(delivery.status)}</span>
            </div>
            
            <div class="order-info">
                <div class="info-row">
                    <i class="fas fa-store"></i>
                    <span><strong>${delivery.restaurant_name}</strong></span>
                </div>
                <div class="info-row">
                    <i class="fas fa-user"></i>
                    <span>${delivery.customer_name}</span>
                </div>
                <div class="info-row">
                    <i class="fas fa-home"></i>
                    <span>${delivery.customer_address}</span>
                </div>
            </div>
            
            <div class="delivery-progress">
                <div class="progress-steps">
                    <div class="step ${getStepClass(delivery.status, 'accepted')}">
                        <div class="step-icon"><i class="fas fa-check"></i></div>
                        <span class="step-label">Accepted</span>
                    </div>
                    <div class="step ${getStepClass(delivery.status, 'picked_up')}">
                        <div class="step-icon"><i class="fas fa-box"></i></div>
                        <span class="step-label">Picked Up</span>
                    </div>
                    <div class="step ${getStepClass(delivery.status, 'in_transit')}">
                        <div class="step-icon"><i class="fas fa-motorcycle"></i></div>
                        <span class="step-label">On the way</span>
                    </div>
                    <div class="step ${getStepClass(delivery.status, 'delivered')}">
                        <div class="step-icon"><i class="fas fa-home"></i></div>
                        <span class="step-label">Delivered</span>
                    </div>
                </div>
            </div>
            
            <div class="order-actions" style="margin-top: 15px;">
                <button class="btn btn-primary" onclick="updateDeliveryStatus('${delivery.order_id}', '${getNextStatus(delivery.status)}')">
                    <i class="fas fa-arrow-right"></i> ${getNextStatusLabel(delivery.status)}
                </button>
                <button class="btn btn-secondary" onclick="viewOrderDetails('${delivery.order_id}')">
                    <i class="fas fa-eye"></i> Details
                </button>
            </div>
        </div>
    `).join('');
}

// Helper functions
function formatStatus(status) {
    const statusMap = {
        'pending': 'Pending',
        'accepted': 'Accepted',
        'picked_up': 'Picked Up',
        'in_transit': 'In Transit',
        'delivered': 'Delivered'
    };
    return statusMap[status] || status;
}

function getStepClass(currentStatus, stepStatus) {
    const statusOrder = ['accepted', 'picked_up', 'in_transit', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return '';
}

function getNextStatus(currentStatus) {
    const statusFlow = {
        'accepted': 'picked_up',
        'picked_up': 'in_transit',
        'in_transit': 'delivered'
    };
    return statusFlow[currentStatus] || currentStatus;
}

function getNextStatusLabel(currentStatus) {
    const labels = {
        'accepted': 'Mark as Picked Up',
        'picked_up': 'Start Delivery',
        'in_transit': 'Mark as Delivered'
    };
    return labels[currentStatus] || 'Update Status';
}

// View order details
function viewOrderDetails(orderId) {
    const order = [...availableOrders, ...activeDeliveries].find(o => o.order_id === orderId);
    if (!order) return;
    
    const modalContent = document.getElementById('orderModalContent');
    modalContent.innerHTML = `
        <div class="order-details">
            <div class="detail-section">
                <h3><i class="fas fa-store"></i> Restaurant</h3>
                <p><strong>${order.restaurant_name}</strong></p>
                <p>${order.restaurant_address}</p>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-user"></i> Customer</h3>
                <p><strong>${order.customer_name}</strong></p>
                <p>${order.customer_address}</p>
                ${order.customer_phone ? `<p><i class="fas fa-phone"></i> ${order.customer_phone}</p>` : ''}
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-shopping-bag"></i> Order Details</h3>
                <p>Items: <strong>${order.items_count || 'Multiple'} items</strong></p>
                <p>Total Amount: <strong>${riderPortal.formatCurrency(order.total_amount)}</strong></p>
                <p>Delivery Fee: <strong>${riderPortal.formatCurrency(order.delivery_fee)}</strong></p>
                ${order.distance ? `<p>Distance: <strong>${order.distance} km</strong></p>` : ''}
            </div>
            
            ${order.status ? `
                <div class="detail-section">
                    <h3><i class="fas fa-info-circle"></i> Status</h3>
                    <p><strong>${formatStatus(order.status)}</strong></p>
                </div>
            ` : ''}
        </div>
        
        <div style="margin-top: 20px; display: flex; gap: 10px;">
            ${!order.status ? `
                <button class="btn btn-success" onclick="acceptOrder('${order.order_id}'); closeOrderModal();">
                    <i class="fas fa-check"></i> Accept Order
                </button>
            ` : ''}
            <button class="btn btn-secondary" onclick="closeOrderModal()">Close</button>
        </div>
    `;
    
    document.getElementById('orderModal').style.display = 'flex';
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
}

// Accept order
async function acceptOrder(orderId) {
    if (!riderPortal.getRiderOnlineStatus()) {
        riderPortal.showNotification('Please go online to accept orders', 'error');
        return;
    }
    
    // Check if vehicle information is complete
    if (!riderPortal.checkVehicleInfo()) {
        riderPortal.showNotification('Please complete your vehicle information before accepting orders', 'error');
        setTimeout(() => {
            if (confirm('Would you like to update your profile now?')) {
                window.location.href = 'rider-profile.html';
            }
        }, 500);
        return;
    }
    
    if (!confirm('Accept this delivery order?')) return;
    
    riderPortal.showLoading();
    
    // TODO: API call to accept order
    // await riderPortal.apiRequest(`/rider/orders/${orderId}/accept`, 'POST');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Move order from available to active
    const orderIndex = availableOrders.findIndex(o => o.order_id === orderId);
    if (orderIndex !== -1) {
        const order = availableOrders[orderIndex];
        order.status = 'accepted';
        activeDeliveries.push(order);
        availableOrders.splice(orderIndex, 1);
    }
    
    riderPortal.hideLoading();
    riderPortal.showNotification('Order accepted! Head to the restaurant.', 'success');
    riderPortal.playNotificationSound();
    
    // Refresh displays
    loadAvailableOrders();
    loadActiveDeliveries();
    loadDashboardStats();
}

// Update delivery status
async function updateDeliveryStatus(orderId, newStatus) {
    if (!confirm(`Update status to ${formatStatus(newStatus)}?`)) return;
    
    riderPortal.showLoading();
    
    // TODO: API call to update status
    // await riderPortal.apiRequest(`/rider/orders/${orderId}/status`, 'PUT', { status: newStatus });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update order status
    const delivery = activeDeliveries.find(d => d.order_id === orderId);
    if (delivery) {
        delivery.status = newStatus;
        
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
    
    // Refresh displays
    loadActiveDeliveries();
    loadDashboardStats();
}

// Add styles for order details
const detailStyles = document.createElement('style');
detailStyles.textContent = `
    .order-details {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    .detail-section {
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
    }
    
    .detail-section h3 {
        font-size: 1rem;
        margin-bottom: 10px;
        color: #1a1a2e;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .detail-section h3 i {
        color: #FF7A00;
    }
    
    .detail-section p {
        margin: 5px 0;
        color: #6b7280;
    }
`;
document.head.appendChild(detailStyles);

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('orderModal');
    if (e.target === modal) {
        closeOrderModal();
    }
});