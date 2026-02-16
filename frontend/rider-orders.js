/**
 * Rider Available Orders - Full List
 */

let allOrders = [];
let filteredOrders = [];

// Initialize orders page
async function initializeOrders() {
    loadAvailableOrders();
    setupFilters();
    
    // Auto-refresh every 15 seconds if online
    setInterval(() => {
        if (riderPortal.getRiderOnlineStatus()) {
            loadAvailableOrders();
        }
    }, 15000);
}

// Load all available orders
async function loadAvailableOrders() {
    const user = riderPortal.checkRiderAuth();
    if (!user) return;
    
    // Only load if rider is online
    if (!riderPortal.getRiderOnlineStatus()) {
        displayNoOrders('Go online to see available orders');
        return;
    }
    
    // TODO: Replace with actual API call
    // const result = await riderPortal.apiRequest('/rider/available-orders');
    
    // Mock data - more comprehensive list
    allOrders = [
        {
            order_id: 'ORD-1234',
            restaurant_name: 'Pizza Paradise',
            restaurant_address: 'Mirpur 10, Dhaka',
            restaurant_phone: '01712345678',
            customer_name: 'Ahmed Hassan',
            customer_address: 'House 45, Road 12, Mirpur 12',
            customer_phone: '01798765432',
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
            restaurant_phone: '01756789012',
            customer_name: 'Fatima Rahman',
            customer_address: 'Flat 3B, Green View, Dhanmondi 32',
            customer_phone: '01823456789',
            items_count: 2,
            total_amount: 850,
            delivery_fee: 50,
            distance: 1.8,
            pickup_time: new Date(Date.now() + 20 * 60000).toISOString(),
            created_at: new Date(Date.now() - 3 * 60000).toISOString()
        },
        {
            order_id: 'ORD-1236',
            restaurant_name: 'Spice Garden',
            restaurant_address: 'Banani 11, Dhaka',
            restaurant_phone: '01634567890',
            customer_name: 'Karim Ali',
            customer_address: 'House 23, Road 5, Banani',
            customer_phone: '01712398745',
            items_count: 5,
            total_amount: 1850,
            delivery_fee: 70,
            distance: 4.2,
            pickup_time: new Date(Date.now() + 25 * 60000).toISOString(),
            created_at: new Date(Date.now() - 2 * 60000).toISOString()
        },
        {
            order_id: 'ORD-1237',
            restaurant_name: 'Sushi Central',
            restaurant_address: 'Gulshan 2, Dhaka',
            restaurant_phone: '01845678901',
            customer_name: 'Sara Khan',
            customer_address: 'Flat 5A, Maple Tower, Gulshan 1',
            customer_phone: '01956789012',
            items_count: 4,
            total_amount: 2150,
            delivery_fee: 80,
            distance: 3.5,
            pickup_time: new Date(Date.now() + 30 * 60000).toISOString(),
            created_at: new Date(Date.now() - 1 * 60000).toISOString()
        },
        {
            order_id: 'ORD-1238',
            restaurant_name: 'Thai Express',
            restaurant_address: 'Uttara Sector 7, Dhaka',
            restaurant_phone: '01723456789',
            customer_name: 'Hasan Ali',
            customer_address: 'House 12, Road 18, Uttara Sector 10',
            customer_phone: '01634567890',
            items_count: 3,
            total_amount: 1420,
            delivery_fee: 65,
            distance: 3.8,
            pickup_time: new Date(Date.now() + 18 * 60000).toISOString(),
            created_at: new Date(Date.now() - 7 * 60000).toISOString()
        },
        {
            order_id: 'ORD-1239',
            restaurant_name: 'BBQ Nation',
            restaurant_address: 'Mohammadpur, Dhaka',
            restaurant_phone: '01867890123',
            customer_name: 'Nadia Ahmed',
            customer_address: 'Flat 2C, PC Culture, Mohammadpur',
            customer_phone: '01745678901',
            items_count: 6,
            total_amount: 2850,
            delivery_fee: 75,
            distance: 5.2,
            pickup_time: new Date(Date.now() + 22 * 60000).toISOString(),
            created_at: new Date(Date.now() - 4 * 60000).toISOString()
        }
    ];
    
    filteredOrders = [...allOrders];
    applyFilters();
}

// Setup filter event listeners
function setupFilters() {
    const sortFilter = document.getElementById('sortFilter');
    const distanceFilter = document.getElementById('distanceFilter');
    
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }
    
    if (distanceFilter) {
        distanceFilter.addEventListener('change', applyFilters);
    }
}

// Apply filters and sorting
function applyFilters() {
    const sortBy = document.getElementById('sortFilter').value;
    const maxDistance = document.getElementById('distanceFilter').value;
    
    // Filter by distance
    if (maxDistance !== 'all') {
        filteredOrders = allOrders.filter(order => order.distance <= parseFloat(maxDistance));
    } else {
        filteredOrders = [...allOrders];
    }
    
    // Sort orders
    switch(sortBy) {
        case 'time':
            filteredOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        case 'distance':
            filteredOrders.sort((a, b) => a.distance - b.distance);
            break;
        case 'fee':
            filteredOrders.sort((a, b) => b.delivery_fee - a.delivery_fee);
            break;
        case 'amount':
            filteredOrders.sort((a, b) => b.total_amount - a.total_amount);
            break;
    }
    
    displayOrders(filteredOrders);
}

// Display orders
function displayOrders(orders) {
    const container = document.getElementById('ordersContainer');
    const countEl = document.getElementById('ordersCount');
    
    if (countEl) {
        countEl.textContent = orders.length;
    }
    
    riderPortal.updateNotificationBadges(orders.length, 0);
    
    if (!orders || orders.length === 0) {
        displayNoOrders('No orders available at the moment');
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span class="order-id">#${order.order_id}</span>
                <span class="order-time">${riderPortal.timeAgo(order.created_at)}</span>
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
                    <i class="fas fa-arrow-right" style="color: #6b7280;"></i>
                    <span style="color: #6b7280;">To</span>
                </div>
                <div class="info-row">
                    <i class="fas fa-user"></i>
                    <span><strong>${order.customer_name}</strong></span>
                </div>
                <div class="info-row">
                    <i class="fas fa-home"></i>
                    <span>${order.customer_address}</span>
                </div>
            </div>
            
            <div class="order-details-grid">
                <div class="detail-box">
                    <i class="fas fa-route"></i>
                    <div>
                        <span class="detail-label">Distance</span>
                        <span class="detail-value">${order.distance} km</span>
                    </div>
                </div>
                <div class="detail-box">
                    <i class="fas fa-clock"></i>
                    <div>
                        <span class="detail-label">Ready in</span>
                        <span class="detail-value">${Math.ceil((new Date(order.pickup_time) - new Date()) / 60000)} min</span>
                    </div>
                </div>
                <div class="detail-box">
                    <i class="fas fa-shopping-bag"></i>
                    <div>
                        <span class="detail-label">Items</span>
                        <span class="detail-value">${order.items_count}</span>
                    </div>
                </div>
                <div class="detail-box highlight">
                    <i class="fas fa-dollar-sign"></i>
                    <div>
                        <span class="detail-label">You Earn</span>
                        <span class="detail-value">${riderPortal.formatCurrency(order.delivery_fee)}</span>
                    </div>
                </div>
            </div>
            
            <div class="order-actions">
                <button class="btn btn-secondary" onclick="viewOrderDetails('${order.order_id}')">
                    <i class="fas fa-eye"></i> Details
                </button>
                <button class="btn btn-success" onclick="acceptOrder('${order.order_id}')">
                    <i class="fas fa-check"></i> Accept Order
                </button>
            </div>
        </div>
    `).join('');
}

function displayNoOrders(message) {
    const container = document.getElementById('ordersContainer');
    const countEl = document.getElementById('ordersCount');
    
    if (countEl) {
        countEl.textContent = '0';
    }
    
    container.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-inbox"></i>
            <h3>No Available Orders</h3>
            <p>${message}</p>
        </div>
    `;
}

// View order details
function viewOrderDetails(orderId) {
    const order = allOrders.find(o => o.order_id === orderId);
    if (!order) return;
    
    const modalContent = document.getElementById('orderModalContent');
    modalContent.innerHTML = `
        <div class="order-details">
            <div class="detail-section">
                <h3><i class="fas fa-store"></i> Restaurant Details</h3>
                <p><strong>${order.restaurant_name}</strong></p>
                <p><i class="fas fa-map-marker-alt"></i> ${order.restaurant_address}</p>
                <p><i class="fas fa-phone"></i> ${order.restaurant_phone}</p>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-user"></i> Customer Details</h3>
                <p><strong>${order.customer_name}</strong></p>
                <p><i class="fas fa-home"></i> ${order.customer_address}</p>
                <p><i class="fas fa-phone"></i> ${order.customer_phone}</p>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-shopping-bag"></i> Order Information</h3>
                <p>Order ID: <strong>#${order.order_id}</strong></p>
                <p>Items: <strong>${order.items_count} items</strong></p>
                <p>Total Amount: <strong>${riderPortal.formatCurrency(order.total_amount)}</strong></p>
                <p>Your Delivery Fee: <strong>${riderPortal.formatCurrency(order.delivery_fee)}</strong></p>
                <p>Distance: <strong>${order.distance} km</strong></p>
                <p>Ready for pickup: <strong>${riderPortal.formatTime(order.pickup_time)}</strong></p>
            </div>
            
            <div class="detail-section" style="background: #fef3c7; border-left: 4px solid #f59e0b;">
                <h3><i class="fas fa-info-circle"></i> Delivery Instructions</h3>
                <p>1. Head to the restaurant and collect the order</p>
                <p>2. Verify order items before leaving</p>
                <p>3. Handle food with care during delivery</p>
                <p>4. Call customer if you need help finding the address</p>
                <p>5. Confirm delivery with customer signature/photo</p>
            </div>
        </div>
        
        <div style="margin-top: 20px; display: flex; gap: 10px;">
            <button class="btn btn-success" onclick="acceptOrder('${order.order_id}'); closeOrderModal();" style="flex: 1;">
                <i class="fas fa-check"></i> Accept This Order
            </button>
            <button class="btn btn-secondary" onclick="closeOrderModal()">
                <i class="fas fa-times"></i> Close
            </button>
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
    
    if (!confirm('Accept this delivery order? You will need to pick it up from the restaurant.')) return;
    
    riderPortal.showLoading();
    
    // TODO: API call to accept order
    // await riderPortal.apiRequest(`/rider/orders/${orderId}/accept`, 'POST');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Remove order from available list
    const orderIndex = allOrders.findIndex(o => o.order_id === orderId);
    if (orderIndex !== -1) {
        allOrders.splice(orderIndex, 1);
    }
    
    riderPortal.hideLoading();
    riderPortal.showNotification('Order accepted! Head to the restaurant to pick it up.', 'success');
    riderPortal.playNotificationSound();
    
    // Refresh display
    applyFilters();
    
    // Redirect to active deliveries after 2 seconds
    setTimeout(() => {
        window.location.href = 'rider-active.html';
    }, 2000);
}

// Refresh orders
function refreshOrders() {
    riderPortal.showNotification('Refreshing orders...', 'info');
    loadAvailableOrders();
}

// Add styles for order details grid
const detailStyles = document.createElement('style');
detailStyles.textContent = `
    .filter-section {
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
        display: flex;
        gap: 20px;
        align-items: center;
        flex-wrap: wrap;
    }
    
    .filter-group {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .filter-group label {
        font-weight: 500;
        color: #1a1a2e;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .filter-group i {
        color: #FF7A00;
    }
    
    .form-select {
        padding: 8px 12px;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: border-color 0.3s;
    }
    
    .form-select:focus {
        outline: none;
        border-color: #FF7A00;
    }
    
    .order-time {
        font-size: 0.85rem;
        color: #6b7280;
    }
    
    .order-details-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        margin: 15px 0;
    }
    
    .detail-box {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 12px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .detail-box.highlight {
        background: linear-gradient(135deg, #10b981, #059669);
        border: none;
        color: white;
    }
    
    .detail-box i {
        font-size: 1.3rem;
        color: #FF7A00;
    }
    
    .detail-box.highlight i {
        color: white;
    }
    
    .detail-label {
        display: block;
        font-size: 0.75rem;
        color: #6b7280;
    }
    
    .detail-box.highlight .detail-label {
        color: rgba(255, 255, 255, 0.9);
    }
    
    .detail-value {
        display: block;
        font-size: 1rem;
        font-weight: 600;
        color: #1a1a2e;
    }
    
    .detail-box.highlight .detail-value {
        color: white;
        font-size: 1.1rem;
    }
    
    @media (max-width: 768px) {
        .filter-section {
            flex-direction: column;
            align-items: stretch;
        }
        
        .filter-group {
            flex-direction: column;
            align-items: stretch;
        }
        
        .order-details-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(detailStyles);

// Initialize page when loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeOrders();
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('orderModal');
    if (e.target === modal) {
        closeOrderModal();
    }
});