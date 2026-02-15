/**
 * Owner Dashboard - Main Logic
 */

// Initialize dashboard
async function initializeDashboard() {
    loadDashboardStats();
    loadRecentOrders();
}

// Load dashboard statistics
async function loadDashboardStats() {
    const user = ownerPortal.checkOwnerAuth();
    if (!user) return;
    
    // TODO: Replace with actual API calls
    // For now, using mock data
    
    // Mock data - replace with: const stats = await ownerPortal.apiRequest('/owner/dashboard/stats');
    const mockStats = {
        todayOrders: 24,
        todayRevenue: 15800,
        pendingOrders: 5,
        activeItems: 42
    };
    
    // Update stat cards
    document.getElementById('todayOrders').textContent = mockStats.todayOrders;
    document.getElementById('todayRevenue').textContent = ownerPortal.formatCurrency(mockStats.todayRevenue);
    document.getElementById('pendingOrders').textContent = mockStats.pendingOrders;
    document.getElementById('activeItems').textContent = mockStats.activeItems;
}

// Load recent orders
async function loadRecentOrders() {
    const user = ownerPortal.checkOwnerAuth();
    if (!user) return;
    
    // TODO: Replace with actual API call
    // const orders = await ownerPortal.apiRequest('/owner/orders/recent');
    
    // Mock data for demonstration
    const mockOrders = [
        {
            order_id: 'ORD-001',
            customer_name: 'Ahmed Hassan',
            items_count: 3,
            total_amount: 850,
            status: 'pending',
            order_time: new Date().toISOString()
        },
        {
            order_id: 'ORD-002',
            customer_name: 'Fatima Rahman',
            items_count: 2,
            total_amount: 650,
            status: 'preparing',
            order_time: new Date(Date.now() - 30 * 60000).toISOString()
        },
        {
            order_id: 'ORD-003',
            customer_name: 'Karim Ali',
            items_count: 4,
            total_amount: 1200,
            status: 'ready',
            order_time: new Date(Date.now() - 60 * 60000).toISOString()
        }
    ];
    
    displayRecentOrders(mockOrders);
}

// Display recent orders in table
function displayRecentOrders(orders) {
    const tableBody = document.getElementById('recentOrdersTable');
    
    if (!orders || orders.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px;">
                    <i class="fas fa-inbox" style="font-size: 3rem; color: #ddd; margin-bottom: 10px;"></i>
                    <p style="color: #999;">No orders yet</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = orders.map(order => `
        <tr>
            <td><strong>${order.order_id}</strong></td>
            <td>${order.customer_name}</td>
            <td>${order.items_count} items</td>
            <td><strong>${ownerPortal.formatCurrency(order.total_amount)}</strong></td>
            <td><span class="status-badge status-${order.status}">${capitalizeFirst(order.status)}</span></td>
            <td>${formatTimeAgo(order.order_time)}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn btn-view" onclick="viewOrder('${order.order_id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${order.status === 'pending' ? `
                        <button class="action-btn btn-accept" onclick="acceptOrder('${order.order_id}')">
                            <i class="fas fa-check"></i> Accept
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

// Helper function to capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Format time ago
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

// View order details
function viewOrder(orderId) {
    // TODO: Implement order details modal or redirect to order page
    ownerPortal.showNotification(`Viewing order ${orderId}`, 'info');
    // window.location.href = `owner-orders.html?order=${orderId}`;
}

// Accept order
async function acceptOrder(orderId) {
    if (confirm('Accept this order and start preparing?')) {
        // TODO: API call to update order status
        // await ownerPortal.apiRequest(`/owner/orders/${orderId}/accept`, 'PUT');
        
        ownerPortal.showNotification('Order accepted successfully!', 'success');
        
        // Reload orders
        setTimeout(() => {
            loadRecentOrders();
            loadDashboardStats();
        }, 500);
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    
    // Refresh dashboard every 30 seconds
    setInterval(() => {
        loadDashboardStats();
        loadRecentOrders();
    }, 30000);
});
