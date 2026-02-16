/**
 * Admin Order Management
 */

let allOrders = [];
let filteredOrders = [];

// Initialize
async function initializeOrders() {
    loadOrders();
    setupFilters();
}

// Load all orders
async function loadOrders() {
    adminPortal.showLoading();
    
    // TODO: Replace with API call
    allOrders = [
        {
            order_id: 'ORD-1240',
            customer_name: 'Ahmed Hassan',
            customer_phone: '01712345678',
            restaurant_name: 'Pizza Paradise',
            restaurant_id: 1,
            rider_name: 'Kamal Rider',
            rider_id: 1,
            items: [{name: 'Margherita Pizza', quantity: 2, price: 450}],
            subtotal: 900,
            delivery_fee: 60,
            vat: 48,
            total_amount: 1008,
            status: 'delivered',
            order_time: new Date(Date.now() - 120 * 60000).toISOString(),
            delivery_time: new Date(Date.now() - 30 * 60000).toISOString()
        },
        {
            order_id: 'ORD-1241',
            customer_name: 'Fatima Rahman',
            customer_phone: '01798765432',
            restaurant_name: 'Burger House',
            restaurant_id: 2,
            rider_name: 'Jamal Rider',
            rider_id: 2,
            items: [{name: 'Chicken Burger', quantity: 1, price: 350}],
            subtotal: 350,
            delivery_fee: 50,
            vat: 20,
            total_amount: 420,
            status: 'preparing',
            order_time: new Date(Date.now() - 15 * 60000).toISOString()
        },
        {
            order_id: 'ORD-1242',
            customer_name: 'Sara Khan',
            customer_phone: '01823456789',
            restaurant_name: 'Thai Express',
            restaurant_id: 3,
            rider_name: null,
            rider_id: null,
            items: [{name: 'Pad Thai', quantity: 2, price: 420}],
            subtotal: 840,
            delivery_fee: 65,
            vat: 45,
            total_amount: 950,
            status: 'pending',
            order_time: new Date(Date.now() - 5 * 60000).toISOString()
        },
        {
            order_id: 'ORD-1243',
            customer_name: 'Karim Ali',
            customer_phone: '01712398745',
            restaurant_name: 'Spice Garden',
            restaurant_id: 4,
            rider_name: 'Hasan Rider',
            rider_id: 3,
            items: [{name: 'Biryani', quantity: 1, price: 320}],
            subtotal: 320,
            delivery_fee: 55,
            vat: 19,
            total_amount: 394,
            status: 'ready',
            order_time: new Date(Date.now() - 45 * 60000).toISOString()
        },
        {
            order_id: 'ORD-1244',
            customer_name: 'Nadia Ahmed',
            customer_phone: '01745678901',
            restaurant_name: 'Sushi Central',
            restaurant_id: 5,
            rider_name: 'Ali Rider',
            rider_id: 4,
            items: [{name: 'California Roll', quantity: 3, price: 550}],
            subtotal: 1650,
            delivery_fee: 80,
            vat: 87,
            total_amount: 1817,
            status: 'in_transit',
            order_time: new Date(Date.now() - 60 * 60000).toISOString(),
            pickup_time: new Date(Date.now() - 30 * 60000).toISOString()
        }
    ];
    
    filteredOrders = [...allOrders];
    adminPortal.hideLoading();
    applyFilters();
    updateStatusCounts();
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
    
    filteredOrders = allOrders.filter(order => {
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesSearch = !searchTerm || 
            order.order_id.toLowerCase().includes(searchTerm) ||
            order.customer_name.toLowerCase().includes(searchTerm) ||
            order.restaurant_name.toLowerCase().includes(searchTerm);
        
        return matchesStatus && matchesSearch;
    });
    
    displayOrders(filteredOrders);
}

// Filter by status (tab click)
function filterByStatus(status) {
    document.querySelectorAll('.status-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.status === status);
    });
    
    document.getElementById('statusFilter').value = status;
    applyFilters();
}

// Update status counts
function updateStatusCounts() {
    const counts = {
        all: allOrders.length,
        pending: allOrders.filter(o => o.status === 'pending').length,
        preparing: allOrders.filter(o => o.status === 'preparing').length,
        delivered: allOrders.filter(o => o.status === 'delivered').length
    };
    
    Object.keys(counts).forEach(key => {
        const el = document.getElementById(`count${key.charAt(0).toUpperCase() + key.slice(1)}`);
        if (el) el.textContent = counts[key];
    });
}

// Display orders
function displayOrders(orders) {
    const tableBody = document.getElementById('ordersTableBody');
    
    if (!orders || orders.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px;">
                    <i class="fas fa-inbox" style="font-size: 3rem; color: #ddd;"></i>
                    <p style="color: #999; margin-top: 10px;">No orders found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = orders.map(order => `
        <tr>
            <td><strong>${order.order_id}</strong></td>
            <td>${order.customer_name}</td>
            <td>${order.restaurant_name}</td>
            <td>${order.rider_name || '<span style="color: #999;">Not assigned</span>'}</td>
            <td><strong>${adminPortal.formatCurrency(order.total_amount)}</strong></td>
            <td><span class="status-badge status-${order.status}">${capitalizeFirst(order.status)}</span></td>
            <td>${adminPortal.timeAgo(order.order_time)}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn btn-view" onclick="viewOrderDetails('${order.order_id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${order.status !== 'delivered' && order.status !== 'cancelled' ? `
                        <button class="action-btn btn-delete" onclick="cancelOrder('${order.order_id}')">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

// View order details
function viewOrderDetails(orderId) {
    const order = allOrders.find(o => o.order_id === orderId);
    if (!order) return;
    
    const modalContent = document.getElementById('orderModalContent');
    modalContent.innerHTML = `
        <div class="order-details">
            <div class="order-info-grid">
                <div class="info-card">
                    <h3><i class="fas fa-receipt"></i> Order Information</h3>
                    <p><strong>Order ID:</strong> ${order.order_id}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${order.status}">${capitalizeFirst(order.status)}</span></p>
                    <p><strong>Placed:</strong> ${adminPortal.formatDateTime(order.order_time)}</p>
                    ${order.delivery_time ? `<p><strong>Delivered:</strong> ${adminPortal.formatDateTime(order.delivery_time)}</p>` : ''}
                </div>
                
                <div class="info-card">
                    <h3><i class="fas fa-user"></i> Customer</h3>
                    <p><strong>${order.customer_name}</strong></p>
                    <p><i class="fas fa-phone"></i> ${order.customer_phone}</p>
                </div>
                
                <div class="info-card">
                    <h3><i class="fas fa-store"></i> Restaurant</h3>
                    <p><strong>${order.restaurant_name}</strong></p>
                </div>
                
                <div class="info-card">
                    <h3><i class="fas fa-motorcycle"></i> Rider</h3>
                    <p>${order.rider_name ? `<strong>${order.rider_name}</strong>` : '<span style="color: #999;">Not assigned yet</span>'}</p>
                    ${!order.rider_name && order.status === 'pending' ? `
                        <button class="btn btn-primary btn-sm" style="margin-top: 10px;">
                            <i class="fas fa-user-plus"></i> Assign Rider
                        </button>
                    ` : ''}
                </div>
            </div>
            
            <div class="info-card" style="margin-top: 20px;">
                <h3><i class="fas fa-shopping-bag"></i> Order Items</h3>
                <table style="width: 100%; margin-top: 10px;">
                    ${order.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>x${item.quantity}</td>
                            <td style="text-align: right;">${adminPortal.formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                    `).join('')}
                    <tr style="border-top: 2px solid #e5e7eb; font-weight: 600;">
                        <td colspan="2">Subtotal</td>
                        <td style="text-align: right;">${adminPortal.formatCurrency(order.subtotal)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Delivery Fee</td>
                        <td style="text-align: right;">${adminPortal.formatCurrency(order.delivery_fee)}</td>
                    </tr>
                    <tr>
                        <td colspan="2">VAT</td>
                        <td style="text-align: right;">${adminPortal.formatCurrency(order.vat)}</td>
                    </tr>
                    <tr style="border-top: 2px solid #e5e7eb; font-weight: 700; font-size: 1.1rem;">
                        <td colspan="2">Total</td>
                        <td style="text-align: right; color: #10b981;">${adminPortal.formatCurrency(order.total_amount)}</td>
                    </tr>
                </table>
            </div>
        </div>
        
        <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
            ${order.status !== 'delivered' && order.status !== 'cancelled' ? `
                <button class="btn btn-danger" onclick="cancelOrderConfirm('${order.order_id}')">
                    <i class="fas fa-times"></i> Cancel Order
                </button>
            ` : ''}
            <button class="btn btn-secondary" onclick="closeOrderModal()">
                Close
            </button>
        </div>
    `;
    
    document.getElementById('orderModal').style.display = 'flex';
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
}

// Cancel order
async function cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    adminPortal.showLoading();
    
    // TODO: API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const order = allOrders.find(o => o.order_id === orderId);
    if (order) {
        order.status = 'cancelled';
    }
    
    adminPortal.hideLoading();
    adminPortal.showNotification('Order cancelled successfully', 'success');
    
    applyFilters();
    updateStatusCounts();
}

function cancelOrderConfirm(orderId) {
    closeOrderModal();
    cancelOrder(orderId);
}

// Refresh orders
function refreshOrders() {
    adminPortal.showNotification('Refreshing orders...', 'info');
    loadOrders();
}

// Helper
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).replace('_', ' ');
}

// Add styles
const orderStyles = document.createElement('style');
orderStyles.textContent = `
    .order-info-grid {
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
`;
document.head.appendChild(orderStyles);

// Initialize
document.addEventListener('DOMContentLoaded', initializeOrders);

// Close modal on outside click
window.addEventListener('click', function(e) {
    const modal = document.getElementById('orderModal');
    if (e.target === modal) {
        closeOrderModal();
    }
});
