/**
 * Rider Delivery History
 */

let deliveryHistory = [];
let filteredHistory = [];

// Initialize history page
async function initializeHistory() {
    loadDeliveryHistory();
    setupFilters();
}

// Load delivery history
async function loadDeliveryHistory() {
    const user = riderPortal.checkRiderAuth();
    if (!user) return;
    
    // TODO: Replace with actual API call
    // const result = await riderPortal.apiRequest('/rider/history');
    
    // Mock data - comprehensive history
    deliveryHistory = [
        {
            delivery_id: 1,
            order_id: 'ORD-1220',
            restaurant_name: 'Pizza Paradise',
            customer_name: 'Ahmed Hassan',
            delivery_fee: 60,
            distance: 2.5,
            rating: 5,
            delivered_time: new Date(Date.now() - 2 * 60 * 60000).toISOString()
        },
        {
            delivery_id: 2,
            order_id: 'ORD-1221',
            restaurant_name: 'Burger House',
            customer_name: 'Fatima Rahman',
            delivery_fee: 50,
            distance: 1.8,
            rating: 5,
            delivered_time: new Date(Date.now() - 4 * 60 * 60000).toISOString()
        },
        {
            delivery_id: 3,
            order_id: 'ORD-1222',
            restaurant_name: 'Spice Garden',
            customer_name: 'Karim Ali',
            delivery_fee: 70,
            distance: 4.2,
            rating: 4,
            delivered_time: new Date(Date.now() - 6 * 60 * 60000).toISOString()
        },
        {
            delivery_id: 4,
            order_id: 'ORD-1223',
            restaurant_name: 'Thai Express',
            customer_name: 'Hasan Ali',
            delivery_fee: 65,
            distance: 3.8,
            rating: 5,
            delivered_time: new Date(Date.now() - 24 * 60 * 60000).toISOString()
        },
        {
            delivery_id: 5,
            order_id: 'ORD-1224',
            restaurant_name: 'Sushi Central',
            customer_name: 'Sara Khan',
            delivery_fee: 80,
            distance: 3.5,
            rating: 5,
            delivered_time: new Date(Date.now() - 24 * 60 * 60000).toISOString()
        },
        {
            delivery_id: 6,
            order_id: 'ORD-1225',
            restaurant_name: 'BBQ Nation',
            customer_name: 'Nadia Ahmed',
            delivery_fee: 75,
            distance: 5.2,
            rating: 4,
            delivered_time: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString()
        },
        {
            delivery_id: 7,
            order_id: 'ORD-1226',
            restaurant_name: 'Pizza Paradise',
            customer_name: 'Rahman Ali',
            delivery_fee: 55,
            distance: 2.1,
            rating: 5,
            delivered_time: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString()
        },
        {
            delivery_id: 8,
            order_id: 'ORD-1227',
            restaurant_name: 'Burger House',
            customer_name: 'Tasnim Khan',
            delivery_fee: 60,
            distance: 3.0,
            rating: 5,
            delivered_time: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString()
        },
        {
            delivery_id: 9,
            order_id: 'ORD-1228',
            restaurant_name: 'Thai Express',
            customer_name: 'Shakib Hassan',
            delivery_fee: 70,
            distance: 4.5,
            rating: 4,
            delivered_time: new Date(Date.now() - 7 * 24 * 60 * 60000).toISOString()
        },
        {
            delivery_id: 10,
            order_id: 'ORD-1229',
            restaurant_name: 'Spice Garden',
            customer_name: 'Riya Ahmed',
            delivery_fee: 65,
            distance: 3.2,
            rating: 5,
            delivered_time: new Date(Date.now() - 7 * 24 * 60 * 60000).toISOString()
        }
    ];
    
    filteredHistory = [...deliveryHistory];
    applyFilters();
}

// Setup filter event listeners
function setupFilters() {
    const periodFilter = document.getElementById('periodFilter');
    const searchInput = document.getElementById('searchInput');
    
    if (periodFilter) {
        periodFilter.addEventListener('change', applyFilters);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
}

// Apply filters
function applyFilters() {
    const period = document.getElementById('periodFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    // Filter by period
    let filtered = [...deliveryHistory];
    const now = new Date();
    
    switch(period) {
        case 'today':
            filtered = filtered.filter(d => {
                const deliveryDate = new Date(d.delivered_time);
                return deliveryDate.toDateString() === now.toDateString();
            });
            break;
        case 'week':
            const weekAgo = new Date(now - 7 * 24 * 60 * 60000);
            filtered = filtered.filter(d => new Date(d.delivered_time) > weekAgo);
            break;
        case 'month':
            const monthAgo = new Date(now - 30 * 24 * 60 * 60000);
            filtered = filtered.filter(d => new Date(d.delivered_time) > monthAgo);
            break;
    }
    
    // Filter by search term
    if (searchTerm) {
        filtered = filtered.filter(d => 
            d.order_id.toLowerCase().includes(searchTerm) ||
            d.restaurant_name.toLowerCase().includes(searchTerm) ||
            d.customer_name.toLowerCase().includes(searchTerm)
        );
    }
    
    filteredHistory = filtered;
    displayHistory(filteredHistory);
    updateStats(filteredHistory);
}

// Update stats summary
function updateStats(history) {
    const totalDeliveries = history.length;
    const totalEarned = history.reduce((sum, d) => sum + d.delivery_fee, 0);
    const avgFee = totalDeliveries > 0 ? totalEarned / totalDeliveries : 0;
    
    document.getElementById('totalDeliveries').textContent = totalDeliveries;
    document.getElementById('totalEarned').textContent = riderPortal.formatCurrency(totalEarned);
    document.getElementById('avgDeliveryFee').textContent = riderPortal.formatCurrency(avgFee);
}

// Display history
function displayHistory(history) {
    const tableBody = document.getElementById('historyTableBody');
    
    if (!history || history.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px;">
                    <i class="fas fa-inbox" style="font-size: 3rem; color: #ddd; margin-bottom: 10px;"></i>
                    <p style="color: #999;">No delivery history found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = history.map(delivery => `
        <tr>
            <td>
                <div class="date-time">
                    <span class="date">${riderPortal.formatDate(delivery.delivered_time)}</span>
                    <span class="time">${riderPortal.formatTime(delivery.delivered_time)}</span>
                </div>
            </td>
            <td>
                <strong>${delivery.order_id}</strong>
            </td>
            <td>${delivery.restaurant_name}</td>
            <td>${delivery.customer_name}</td>
            <td>${delivery.distance} km</td>
            <td><strong style="color: #10b981;">${riderPortal.formatCurrency(delivery.delivery_fee)}</strong></td>
            <td>
                <div class="rating-display">
                    ${renderStars(delivery.rating)}
                    <span>${delivery.rating}.0</span>
                </div>
            </td>
        </tr>
    `).join('');
}

// Render star rating
function renderStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Add styles for history page
const historyStyles = document.createElement('style');
historyStyles.textContent = `
    .stats-summary {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    }
    
    .summary-card {
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .summary-card i {
        font-size: 2.5rem;
        color: #FF7A00;
    }
    
    .summary-card h3 {
        font-size: 1.8rem;
        font-weight: 700;
        color: #1a1a2e;
        margin-bottom: 5px;
    }
    
    .summary-card p {
        font-size: 0.9rem;
        color: #6b7280;
    }
    
    .table-container {
        overflow-x: auto;
    }
    
    .history-table {
        width: 100%;
        border-collapse: collapse;
        background: white;
    }
    
    .history-table thead {
        background: #f8f9fa;
    }
    
    .history-table th {
        padding: 15px;
        text-align: left;
        font-weight: 600;
        color: #1a1a2e;
        border-bottom: 2px solid #e5e7eb;
    }
    
    .history-table td {
        padding: 15px;
        border-bottom: 1px solid #f3f4f6;
        color: #6b7280;
    }
    
    .history-table tbody tr:hover {
        background: #f8f9fa;
    }
    
    .date-time {
        display: flex;
        flex-direction: column;
        gap: 3px;
    }
    
    .date-time .date {
        font-weight: 500;
        color: #1a1a2e;
    }
    
    .date-time .time {
        font-size: 0.85rem;
        color: #9ca3af;
    }
    
    .rating-display {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .rating-display i {
        color: #f59e0b;
        font-size: 0.9rem;
    }
    
    .rating-display span {
        font-weight: 600;
        color: #1a1a2e;
    }
    
    @media (max-width: 768px) {
        .table-container {
            overflow-x: scroll;
        }
        
        .history-table {
            min-width: 800px;
        }
    }
`;
document.head.appendChild(historyStyles);

// Initialize page when loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeHistory();
});
