/**
 * Owner Orders Management
 */

let allOrders = [];
let currentFilter = 'all';
let currentRestaurantFilter = null;

// Initialize page
async function initializeOrders() {
    loadRestaurants();
    setupRestaurantFilter();
    loadOrders();
    
    // Auto-refresh every 30 seconds
    setInterval(() => {
        loadOrders();
    }, 30000);
}

// Load restaurants for filter
async function loadRestaurants() {
    const user = ownerPortal.checkOwnerAuth();
    if (!user) return;
    
    // Mock data
    const mockRestaurants = [
        { restaurant_id: 1, name: "Pizza Paradise" },
        { restaurant_id: 2, name: "Burger House" }
    ];
    
    const selector = document.getElementById('restaurantSelector');
    selector.innerHTML = '<option value="">All Restaurants</option>' +
        mockRestaurants.map(r => `<option value="${r.restaurant_id}">${r.name}</option>`).join('');
}

// Setup restaurant filter
function setupRestaurantFilter() {
    const selector = document.getElementById('restaurantSelector');
    selector.addEventListener('change', function() {
        currentRestaurantFilter = this.value ? parseInt(this.value) : null;
        filterOrders();
    });
}

// Load all orders
async function loadOrders() {
    const user = ownerPortal.checkOwnerAuth();
    if (!user) return;
    
    // TODO: Replace with API call
    // const result = await ownerPortal.apiRequest('/owner/orders');
    
    // Mock data
    allOrders = [
        {
            order_id: 'ORD-1001',
            customer_name: 'Ahmed Hassan',
            customer_phone: '01712345678',
            restaurant_id: 1,
            restaurant_name: 'Pizza Paradise',
            items: [
                { name: 'Margherita Pizza (12" - Large)', quantity: 2, price: 800 },
                { name: 'Caesar Salad', quantity: 1, price: 250 }
            ],
            subtotal: 1850,
            delivery_fee: 50,
            vat: 92.50,
            total: 1992.50,
            status: 'pending',
            address: '123 Main Street, Mirpur, Dhaka',
            order_time: new Date(Date.now() - 5 * 60000).toISOString()
        },
        {
            order_id: 'ORD-1002',
            customer_name: 'Fatima Rahman',
            customer_phone: '01798765432',
            restaurant_id: 1,
            restaurant_name: 'Pizza Paradise',
            items: [
                { name: 'Pepperoni Pizza (10" - Medium)', quantity: 1, price: 600 }
            ],
            subtotal: 600,
            delivery_fee: 50,
            vat: 30,
            total: 680,
            status: 'preparing',
            address: '456 Park Road, Dhanmondi, Dhaka',
            order_time: new Date(Date.now() - 20 * 60000).toISOString()
        },
        {
            order_id: 'ORD-1003',
            customer_name: 'Karim Ali',
            customer_phone: '01556789012',
            restaurant_id: 2,
            restaurant_name: 'Burger House',
            items: [
                { name: 'Chicken Burger', quantity: 3, price: 350 },
                { name: 'French Fries', quantity: 2, price: 150 }
            ],
            subtotal: 1350,
            delivery_fee: 50,
            vat: 67.50,
            total: 1467.50,
            status: 'ready',
            address: '789 Garden Lane, Gulshan, Dhaka',
            order_time: new Date(Date.now() - 45 * 60000).toISOString()
        },
        {
            order_id: 'ORD-1004',
            customer_name: 'Sara Khan',
            customer_phone: '01623456789',
            restaurant_id: 1,
            restaurant_name: 'Pizza Paradise',
            items: [
                { name: 'BBQ Pizza (12" - Large)', quantity: 1, price: 900 }
            ],
            subtotal: 900,
            delivery_fee: 50,
            vat: 45,
            total: 995,
            status: 'delivered',
            address: '321 Lake View, Banani, Dhaka',
            order_time: new Date(Date.now() - 2 * 60 * 60000).toISOString()
        }
    ];
    
    updateStatusCounts();
    filterOrders();
}

// Update status counts
function updateStatusCounts() {
    document.getElementById('countAll').textContent = allOrders.length;
    document.getElementById('countPending').textContent = allOrders.filter(o => o.status === 'pending').length;
    document.getElementById('countPreparing').textContent = allOrders.filter(o => o.status === 'preparing').length;
    document.getElementById('countReady').textContent = allOrders.filter(o => o.status === 'ready').length;
    document.getElementById('countDelivered').textContent = allOrders.filter(o => o.status === 'delivered').length;
}

// Filter orders
function filterOrders() {
    let filtered = allOrders;
    
    // Filter by status
    if (currentFilter !== 'all') {
        filtered = filtered.filter(o => o.status === currentFilter);
    }
    
    // Filter by restaurant
    if (currentRestaurantFilter) {
        filtered = filtered.filter(o => o.restaurant_id === currentRestaurantFilter);
    }
    
    displayOrders(filtered);
}

// Filter by status
function filterByStatus(status) {
    currentFilter = status;
    
    // Update active tab
    document.querySelectorAll('.status-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.status === status);
    });
    
    filterOrders();
}

// Display orders
function displayOrders(orders) {
    const tbody = document.getElementById('ordersTableBody');
    
    if (!orders || orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px;">
                    <i class="fas fa-inbox" style="font-size: 3rem; color: #ddd; margin-bottom: 10px;"></i>
                    <p style="color: #999;">No orders found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td><strong>${order.order_id}</strong></td>
            <td>
                <div>${order.customer_name}</div>
                <small style="color: #999;">${order.customer_phone}</small>
            </td>
            <td>${order.restaurant_name}</td>
            <td>${order.items.length} items</td>
            <td><strong>${ownerPortal.formatCurrency(order.total)}</strong></td>
            <td>
                <span class="status-badge status-${order.status}">
                    ${capitalizeFirst(order.status)}
                </span>
            </td>
            <td>${formatTimeAgo(order.order_time)}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn btn-view" onclick="viewOrderDetails('${order.order_id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${getStatusActions(order)}
                </div>
            </td>
        </tr>
    `).join('');
}

// Get status-specific actions
function getStatusActions(order) {
    switch(order.status) {
        case 'pending':
            return `
                <button class="action-btn btn-accept" onclick="updateOrderStatus('${order.order_id}', 'preparing')" title="Accept Order">
                    <i class="fas fa-check"></i>
                </button>
            `;
        case 'preparing':
            return `
                <button class="action-btn btn-success" onclick="updateOrderStatus('${order.order_id}', 'ready')" title="Mark as Ready">
                    <i class="fas fa-box"></i>
                </button>
            `;
        case 'ready':
            return `
                <button class="action-btn btn-success" onclick="updateOrderStatus('${order.order_id}', 'delivered')" title="Mark as Delivered">
                    <i class="fas fa-truck"></i>
                </button>
            `;
        default:
            return '';
    }
}

// View order details
function viewOrderDetails(orderId) {
    const order = allOrders.find(o => o.order_id === orderId);
    if (!order) return;
    
    const content = document.getElementById('orderDetailsContent');
    content.innerHTML = `
        <div class="order-details">
            <div class="order-info-grid">
                <div class="info-section">
                    <h3><i class="fas fa-receipt"></i> Order Information</h3>
                    <div class="info-item">
                        <label>Order ID:</label>
                        <span><strong>${order.order_id}</strong></span>
                    </div>
                    <div class="info-item">
                        <label>Restaurant:</label>
                        <span>${order.restaurant_name}</span>
                    </div>
                    <div class="info-item">
                        <label>Status:</label>
                        <span class="status-badge status-${order.status}">${capitalizeFirst(order.status)}</span>
                    </div>
                    <div class="info-item">
                        <label>Order Time:</label>
                        <span>${ownerPortal.formatDateTime(order.order_time)}</span>
                    </div>
                </div>
                
                <div class="info-section">
                    <h3><i class="fas fa-user"></i> Customer Information</h3>
                    <div class="info-item">
                        <label>Name:</label>
                        <span>${order.customer_name}</span>
                    </div>
                    <div class="info-item">
                        <label>Phone:</label>
                        <span>${order.customer_phone}</span>
                    </div>
                    <div class="info-item">
                        <label>Address:</label>
                        <span>${order.address}</span>
                    </div>
                </div>
            </div>
            
            <div class="order-items-section">
                <h3><i class="fas fa-utensils"></i> Order Items</h3>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>${ownerPortal.formatCurrency(item.price)}</td>
                                <td>${ownerPortal.formatCurrency(item.price * item.quantity)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="order-summary-section">
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>${ownerPortal.formatCurrency(order.subtotal)}</span>
                </div>
                <div class="summary-row">
                    <span>Delivery Fee:</span>
                    <span>${ownerPortal.formatCurrency(order.delivery_fee)}</span>
                </div>
                <div class="summary-row">
                    <span>VAT (5%):</span>
                    <span>${ownerPortal.formatCurrency(order.vat)}</span>
                </div>
                <div class="summary-row total">
                    <span>Total:</span>
                    <span>${ownerPortal.formatCurrency(order.total)}</span>
                </div>
            </div>
            
            <div class="order-actions-section">
                ${order.status === 'pending' ? `
                    <button class="btn btn-success" onclick="updateOrderStatus('${order.order_id}', 'preparing'); closeOrderModal();">
                        <i class="fas fa-check"></i> Accept Order
                    </button>
                ` : ''}
                ${order.status === 'preparing' ? `
                    <button class="btn btn-success" onclick="updateOrderStatus('${order.order_id}', 'ready'); closeOrderModal();">
                        <i class="fas fa-box"></i> Mark as Ready
                    </button>
                ` : ''}
                ${order.status === 'ready' ? `
                    <button class="btn btn-success" onclick="updateOrderStatus('${order.order_id}', 'delivered'); closeOrderModal();">
                        <i class="fas fa-truck"></i> Mark as Delivered
                    </button>
                ` : ''}
                <button class="btn btn-secondary" onclick="printOrder('${order.order_id}')">
                    <i class="fas fa-print"></i> Print Receipt
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('orderDetailsModal').style.display = 'block';
}

// Update order status
async function updateOrderStatus(orderId, newStatus) {
    const order = allOrders.find(o => o.order_id === orderId);
    if (!order) return;
    
    const statusMessages = {
        'preparing': 'Order accepted and preparing',
        'ready': 'Order marked as ready',
        'delivered': 'Order marked as delivered'
    };
    
    ownerPortal.showLoading();
    
    // TODO: API call
    // await ownerPortal.apiRequest(`/owner/orders/${orderId}/status`, 'PUT', { status: newStatus });
    
    order.status = newStatus;
    
    ownerPortal.hideLoading();
    ownerPortal.showNotification(statusMessages[newStatus], 'success');
    
    updateStatusCounts();
    filterOrders();
}

// Print order
function printOrder(orderId) {
    const order = allOrders.find(o => o.order_id === orderId);
    if (!order) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Order Receipt - ${order.order_id}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { text-align: center; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                .total { font-weight: bold; font-size: 1.2em; }
            </style>
        </head>
        <body>
            <h1>${order.restaurant_name}</h1>
            <h2>Order Receipt</h2>
            <p><strong>Order ID:</strong> ${order.order_id}</p>
            <p><strong>Customer:</strong> ${order.customer_name}</p>
            <p><strong>Phone:</strong> ${order.customer_phone}</p>
            <p><strong>Address:</strong> ${order.address}</p>
            <p><strong>Time:</strong> ${ownerPortal.formatDateTime(order.order_time)}</p>
            
            <h3>Items:</h3>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>৳${item.price.toFixed(2)}</td>
                            <td>৳${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                    <tr class="total">
                        <td colspan="3">Subtotal</td>
                        <td>৳${order.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="3">Delivery Fee</td>
                        <td>৳${order.delivery_fee.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="3">VAT (5%)</td>
                        <td>৳${order.vat.toFixed(2)}</td>
                    </tr>
                    <tr class="total">
                        <td colspan="3">Total</td>
                        <td>৳${order.total.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
            
            <p style="text-align: center; margin-top: 30px;">Thank you for your order!</p>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

// Close modal
function closeOrderModal() {
    document.getElementById('orderDetailsModal').style.display = 'none';
}

// Helper functions
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeOrders();
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('orderDetailsModal');
        if (e.target === modal) {
            closeOrderModal();
        }
    });
});
