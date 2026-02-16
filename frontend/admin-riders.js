/**
 * Admin Riders - COMPLETE
 */

let allRiders = [];

async function initializeRiders() {
    loadRiders();
    setupFilters();
}

async function loadRiders() {
    adminPortal.showLoading();
    allRiders = [
        {id: 1, name: 'Kamal Rider', phone: '01712345678', vehicle_type: 'Motorcycle', vehicle_number: 'DH-1234', total_deliveries: 856, rating: 4.8, total_earnings: 45250, status: 'active', online: true},
        {id: 2, name: 'Jamal Rider', phone: '01798765432', vehicle_type: 'Motorcycle', vehicle_number: 'DH-5678', total_deliveries: 654, rating: 4.7, total_earnings: 38900, status: 'active', online: true},
        {id: 3, name: 'Rahman Rider', phone: '01823456789', vehicle_type: 'Scooter', vehicle_number: 'DH-9012', total_deliveries: 523, rating: 4.6, total_earnings: 32100, status: 'active', online: false},
        {id: 4, name: 'Shakib Rahman', phone: '01712398745', vehicle_type: 'Motorcycle', vehicle_number: 'DH-3456', total_deliveries: 0, rating: 0, total_earnings: 0, status: 'pending', online: false}
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
    
    const filtered = allRiders.filter(rider => {
        const matchesStatus = statusFilter === 'All Riders' || 
            (statusFilter === 'Active' && rider.status === 'active') ||
            (statusFilter === 'Online' && rider.online) ||
            (statusFilter === 'Pending Approval' && rider.status === 'pending');
        const matchesSearch = !searchTerm || 
            rider.name.toLowerCase().includes(searchTerm) ||
            rider.phone.includes(searchTerm);
        return matchesStatus && matchesSearch;
    });
    
    displayRiders(filtered);
}

function updateStats() {
    const stats = {
        total: allRiders.length,
        online: allRiders.filter(r => r.online).length,
        pending: allRiders.filter(r => r.status === 'pending').length,
        avgRating: (allRiders.reduce((sum, r) => sum + r.rating, 0) / allRiders.length).toFixed(1)
    };
    
    const quickStats = document.querySelectorAll('.quick-stat-info p');
    if (quickStats.length >= 4) {
        quickStats[0].textContent = stats.total;
        quickStats[1].textContent = stats.online;
        quickStats[2].textContent = stats.pending;
        quickStats[3].textContent = stats.avgRating;
    }
}

function displayRiders(riders) {
    const tableBody = document.getElementById('ridersTableBody');
    
    if (!riders || riders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">No riders found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = riders.map(r => `
        <tr>
            <td><strong>${r.name}</strong> ${r.online ? '<span style="color: #10b981;">●</span>' : ''}</td>
            <td>${r.phone}</td>
            <td>${r.vehicle_type}</td>
            <td>${r.total_deliveries}</td>
            <td>${r.rating > 0 ? '⭐ ' + r.rating : 'N/A'}</td>
            <td><strong>৳${r.total_earnings.toLocaleString()}</strong></td>
            <td><span class="status-badge status-${r.status}">${r.status.toUpperCase()}</span></td>
            <td>
                <div class="table-actions">
                    <button class="action-btn btn-view" onclick="viewRider(${r.id})"><i class="fas fa-eye"></i></button>
                    ${r.status === 'pending' ? `<button class="action-btn btn-approve" onclick="approveRider(${r.id})"><i class="fas fa-check"></i></button>` : ''}
                    <button class="action-btn btn-edit" onclick="editRider(${r.id})"><i class="fas fa-edit"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function viewRider(id) {
    const rider = allRiders.find(r => r.id === id);
    if (!rider) return;
    alert(`Rider: ${rider.name}\nPhone: ${rider.phone}\nVehicle: ${rider.vehicle_type} (${rider.vehicle_number})\nDeliveries: ${rider.total_deliveries}\nRating: ${rider.rating}\nEarnings: ৳${rider.total_earnings}\nStatus: ${rider.status}`);
}

function editRider(id) {
    const rider = allRiders.find(r => r.id === id);
    if (!rider) return;
    
    const newName = prompt('Edit Name:', rider.name);
    const newPhone = prompt('Edit Phone:', rider.phone);
    
    if (newName) rider.name = newName;
    if (newPhone) rider.phone = newPhone;
    
    adminPortal.showNotification('Rider updated!', 'success');
    applyFilters();
}

async function approveRider(id) {
    if (!confirm('Approve this rider?')) return;
    
    adminPortal.showLoading();
    await new Promise(r => setTimeout(r, 500));
    
    const rider = allRiders.find(r => r.id === id);
    if (rider) rider.status = 'active';
    
    adminPortal.hideLoading();
    adminPortal.showNotification('Rider approved!', 'success');
    applyFilters();
    updateStats();
}

document.addEventListener('DOMContentLoaded', initializeRiders);
