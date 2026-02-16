/**
 * Admin User Management - COMPLETE
 */

let allUsers = [];

async function initializeUsers() {
    loadUsers();
    setupFilters();
}

async function loadUsers() {
    adminPortal.showLoading();
    allUsers = [
        {id: 1, name: 'Ahmed Hassan', email: 'ahmed@email.com', phone: '01712345678', total_orders: 45, total_spent: 12500, joined_date: '2024-01-15', status: 'active', address: 'Gulshan, Dhaka'},
        {id: 2, name: 'Fatima Rahman', email: 'fatima@email.com', phone: '01798765432', total_orders: 32, total_spent: 8900, joined_date: '2024-02-20', status: 'active', address: 'Banani, Dhaka'},
        {id: 3, name: 'Sara Khan', email: 'sara@email.com', phone: '01823456789', total_orders: 28, total_spent: 7200, joined_date: '2024-03-10', status: 'active', address: 'Dhanmondi, Dhaka'},
        {id: 4, name: 'Karim Ali', email: 'karim@email.com', phone: '01712398745', total_orders: 15, total_spent: 4100, joined_date: '2024-05-05', status: 'suspended', address: 'Mirpur, Dhaka'}
    ];
    
    adminPortal.hideLoading();
    applyFilters();
    updateStats();
}

function setupFilters() {
    const statusFilter = document.querySelector('.filter-section select');
    const searchInput = document.querySelector('.filter-section input[type="text"]');
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (searchInput) searchInput.addEventListener('input', applyFilters);
}

function applyFilters() {
    const statusFilter = document.querySelector('.filter-section select').value;
    const searchTerm = document.querySelector('.filter-section input[type="text"]').value.toLowerCase();
    
    const filtered = allUsers.filter(user => {
        const matchesStatus = statusFilter === 'All Users' || 
            (statusFilter === 'Active' && user.status === 'active') ||
            (statusFilter === 'Suspended' && user.status === 'suspended');
        const matchesSearch = !searchTerm || 
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.phone.includes(searchTerm);
        return matchesStatus && matchesSearch;
    });
    
    displayUsers(filtered);
}

function updateStats() {
    const stats = {
        total: allUsers.length,
        active: allUsers.filter(u => u.status === 'active').length,
        newMonth: 0,
        suspended: allUsers.filter(u => u.status === 'suspended').length
    };
    
    const quickStats = document.querySelectorAll('.quick-stat-info p');
    if (quickStats.length >= 4) {
        quickStats[0].textContent = stats.total;
        quickStats[1].textContent = stats.active;
        quickStats[2].textContent = stats.newMonth;
        quickStats[3].textContent = stats.suspended;
    }
}

function displayUsers(users) {
    const tableBody = document.getElementById('usersTableBody');
    
    if (!users || users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;"><i class="fas fa-inbox" style="font-size: 3rem; color: #ddd;"></i><p style="color: #999; margin-top: 10px;">No users found</p></td></tr>';
        return;
    }
    
    tableBody.innerHTML = users.map(u => `
        <tr>
            <td><strong>${u.name}</strong></td>
            <td>${u.email}</td>
            <td>${u.phone}</td>
            <td>${u.total_orders}</td>
            <td><strong>৳${u.total_spent.toLocaleString()}</strong></td>
            <td>${adminPortal.formatDate(u.joined_date)}</td>
            <td><span class="status-badge status-${u.status}">${u.status.toUpperCase()}</span></td>
            <td>
                <div class="table-actions">
                    <button class="action-btn btn-view" onclick="viewUser(${u.id})"><i class="fas fa-eye"></i></button>
                    <button class="action-btn btn-edit" onclick="editUser(${u.id})"><i class="fas fa-edit"></i></button>
                    ${u.status === 'active' ? 
                        `<button class="action-btn btn-delete" onclick="suspendUser(${u.id})"><i class="fas fa-ban"></i></button>` : 
                        `<button class="action-btn btn-approve" onclick="activateUser(${u.id})"><i class="fas fa-check"></i></button>`}
                </div>
            </td>
        </tr>
    `).join('');
}

function viewUser(id) {
    const user = allUsers.find(u => u.id === id);
    if (!user) return;
    
    alert(`User Details:\nName: ${user.name}\nEmail: ${user.email}\nPhone: ${user.phone}\nOrders: ${user.total_orders}\nSpent: ৳${user.total_spent}\nStatus: ${user.status}`);
}

function editUser(id) {
    const user = allUsers.find(u => u.id === id);
    if (!user) return;
    
    const newName = prompt('Edit Name:', user.name);
    const newEmail = prompt('Edit Email:', user.email);
    const newPhone = prompt('Edit Phone:', user.phone);
    
    if (newName) user.name = newName;
    if (newEmail) user.email = newEmail;
    if (newPhone) user.phone = newPhone;
    
    adminPortal.showNotification('User updated successfully!', 'success');
    applyFilters();
}

async function suspendUser(id) {
    if (!confirm('Suspend this user?')) return;
    
    adminPortal.showLoading();
    await new Promise(r => setTimeout(r, 500));
    
    const user = allUsers.find(u => u.id === id);
    if (user) user.status = 'suspended';
    
    adminPortal.hideLoading();
    adminPortal.showNotification('User suspended', 'success');
    applyFilters();
    updateStats();
}

async function activateUser(id) {
    if (!confirm('Activate this user?')) return;
    
    adminPortal.showLoading();
    await new Promise(r => setTimeout(r, 500));
    
    const user = allUsers.find(u => u.id === id);
    if (user) user.status = 'active';
    
    adminPortal.hideLoading();
    adminPortal.showNotification('User activated!', 'success');
    applyFilters();
    updateStats();
}

document.addEventListener('DOMContentLoaded', initializeUsers);
