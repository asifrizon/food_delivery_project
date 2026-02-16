/**
 * Admin Dashboard - Main Logic
 */

// Initialize dashboard
async function initializeDashboard() {
    loadRecentOrders();
    loadRecentActivity();
    loadPendingApprovals();
}

// Load recent orders
async function loadRecentOrders() {
    // TODO: Replace with API call
    const mockOrders = [
        {
            order_id: 'ORD-1240',
            customer_name: 'Ahmed Hassan',
            restaurant_name: 'Pizza Paradise',
            rider_name: 'Kamal Rider',
            total_amount: 1250,
            status: 'delivered',
            order_time: new Date(Date.now() - 30 * 60000).toISOString()
        },
        {
            order_id: 'ORD-1241',
            customer_name: 'Fatima Rahman',
            restaurant_name: 'Burger House',
            rider_name: 'Jamal Rider',
            total_amount: 850,
            status: 'preparing',
            order_time: new Date(Date.now() - 15 * 60000).toISOString()
        },
        {
            order_id: 'ORD-1242',
            customer_name: 'Sara Khan',
            restaurant_name: 'Thai Express',
            rider_name: 'Rahman Rider',
            total_amount: 1420,
            status: 'pending',
            order_time: new Date(Date.now() - 5 * 60000).toISOString()
        },
        {
            order_id: 'ORD-1243',
            customer_name: 'Karim Ali',
            restaurant_name: 'Spice Garden',
            rider_name: 'Hasan Rider',
            total_amount: 950,
            status: 'ready',
            order_time: new Date(Date.now() - 45 * 60000).toISOString()
        },
        {
            order_id: 'ORD-1244',
            customer_name: 'Nadia Ahmed',
            restaurant_name: 'Sushi Central',
            rider_name: 'Ali Rider',
            total_amount: 2150,
            status: 'delivered',
            order_time: new Date(Date.now() - 60 * 60000).toISOString()
        }
    ];
    
    displayRecentOrders(mockOrders);
}

// Display recent orders
function displayRecentOrders(orders) {
    const tableBody = document.getElementById('recentOrdersTable');
    
    if (!orders || orders.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px;">
                    <i class="fas fa-inbox" style="font-size: 3rem; color: #ddd;"></i>
                    <p style="color: #999; margin-top: 10px;">No orders yet</p>
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
            <td>${order.rider_name}</td>
            <td><strong>${adminPortal.formatCurrency(order.total_amount)}</strong></td>
            <td><span class="status-badge status-${order.status}">${capitalizeFirst(order.status)}</span></td>
            <td>${adminPortal.timeAgo(order.order_time)}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn btn-view" onclick="viewOrderDetails('${order.order_id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load recent activity
async function loadRecentActivity() {
    // TODO: Replace with API call
    const mockActivity = [
        {
            icon: 'fa-user-plus',
            title: 'New user registered',
            description: 'Tasnim Khan signed up as a customer',
            time: new Date(Date.now() - 10 * 60000).toISOString()
        },
        {
            icon: 'fa-store',
            title: 'New restaurant added',
            description: 'BBQ Nation added to platform',
            time: new Date(Date.now() - 25 * 60000).toISOString()
        },
        {
            icon: 'fa-motorcycle',
            title: 'Rider completed delivery',
            description: 'Kamal Rider delivered order ORD-1240',
            time: new Date(Date.now() - 30 * 60000).toISOString()
        },
        {
            icon: 'fa-star',
            title: 'New review posted',
            description: 'Pizza Paradise received 5-star review',
            time: new Date(Date.now() - 45 * 60000).toISOString()
        },
        {
            icon: 'fa-percent',
            title: 'Offer created',
            description: 'Burger House created 20% discount offer',
            time: new Date(Date.now() - 60 * 60000).toISOString()
        }
    ];
    
    displayRecentActivity(mockActivity);
}

// Display recent activity
function displayRecentActivity(activities) {
    const container = document.getElementById('activityList');
    
    if (!activities || activities.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">No recent activity</p>';
        return;
    }
    
    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
                <span class="activity-time">${adminPortal.timeAgo(activity.time)}</span>
            </div>
        </div>
    `).join('');
}

// Load pending approvals
async function loadPendingApprovals() {
    // TODO: Replace with API call
    const mockApprovals = [
        {
            type: 'restaurant',
            id: 1,
            name: 'Dragon Wok',
            description: 'Chinese restaurant pending approval',
            submittedBy: 'Owner: Li Wang'
        },
        {
            type: 'rider',
            id: 2,
            name: 'Shakib Rahman',
            description: 'Rider application pending review',
            submittedBy: 'New rider applicant'
        },
        {
            type: 'restaurant',
            id: 3,
            name: 'Taco Fiesta',
            description: 'Mexican restaurant pending approval',
            submittedBy: 'Owner: Carlos Rodriguez'
        }
    ];
    
    displayPendingApprovals(mockApprovals);
}

// Display pending approvals
function displayPendingApprovals(approvals) {
    const container = document.getElementById('approvalList');
    
    if (!approvals || approvals.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">No pending approvals</p>';
        return;
    }
    
    container.innerHTML = approvals.map(approval => `
        <div class="approval-item">
            <div class="approval-info">
                <h4><i class="fas fa-${approval.type === 'restaurant' ? 'store' : 'motorcycle'}"></i> ${approval.name}</h4>
                <p>${approval.description}</p>
                <small style="color: #9ca3af;">${approval.submittedBy}</small>
            </div>
            <div class="approval-actions">
                <button class="action-btn btn-approve" onclick="approveItem('${approval.type}', ${approval.id})">
                    <i class="fas fa-check"></i>
                </button>
                <button class="action-btn btn-delete" onclick="rejectItem('${approval.type}', ${approval.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// View order details
function viewOrderDetails(orderId) {
    adminPortal.showNotification('Opening order details...', 'info');
    // TODO: Implement order details modal or redirect
    // window.location.href = `admin-orders.html?order=${orderId}`;
}

// Approve item
async function approveItem(type, id) {
    if (!confirm(`Approve this ${type}?`)) return;
    
    adminPortal.showLoading();
    
    // TODO: API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    adminPortal.hideLoading();
    adminPortal.showNotification(`${capitalizeFirst(type)} approved successfully!`, 'success');
    
    loadPendingApprovals();
}

// Reject item
async function rejectItem(type, id) {
    if (!confirm(`Reject this ${type}?`)) return;
    
    adminPortal.showLoading();
    
    // TODO: API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    adminPortal.hideLoading();
    adminPortal.showNotification(`${capitalizeFirst(type)} rejected`, 'info');
    
    loadPendingApprovals();
}

// Helper function
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    
    // Refresh every 30 seconds
    setInterval(() => {
        loadRecentOrders();
        loadRecentActivity();
        loadPendingApprovals();
    }, 30000);
});
