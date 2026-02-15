/**
 * Owner Portal - Common Utilities
 * Shared functions across all owner portal pages
 */

// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Check authentication and redirect if not owner
function checkOwnerAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        alert('Please login to continue');
        window.location.href = 'home.html';
        return null;
    }
    
    if (currentUser.role !== 'owner') {
        alert('Access denied. Owner privileges required.');
        window.location.href = 'home.html';
        return null;
    }
    
    return currentUser;
}

// Display owner name in top bar
function displayOwnerInfo() {
    const user = checkOwnerAuth();
    if (!user) return;
    
    const ownerNameEl = document.getElementById('ownerName');
    if (ownerNameEl) {
        ownerNameEl.textContent = user.username || 'Owner';
    }
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'home.html';
    }
}

// Toggle sidebar on mobile
function initializeSidebar() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('visible');
            mainContent.classList.toggle('expanded');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                    sidebar.classList.remove('visible');
                }
            }
        });
    }
}

// Format currency
function formatCurrency(amount) {
    return `৳${parseFloat(amount).toFixed(2)}`;
}

// Format date and time
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format date only
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification styles dynamically
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 80px;
        right: -400px;
        background: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        transition: right 0.3s ease;
        min-width: 300px;
    }
    
    .notification.show {
        right: 20px;
    }
    
    .notification i {
        font-size: 1.5rem;
    }
    
    .notification-success i {
        color: #10b981;
    }
    
    .notification-error i {
        color: #ef4444;
    }
    
    .notification-info i {
        color: #6366f1;
    }
    
    .notification span {
        font-size: 0.95rem;
        color: #1a1a2e;
    }
`;
document.head.appendChild(notificationStyles);

// Loading overlay
function showLoading() {
    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading...</p>
        </div>
    `;
    document.body.appendChild(overlay);
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.remove();
    }
}

// Add loading overlay styles
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
    #loadingOverlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
    }
    
    .loading-spinner {
        background: white;
        padding: 30px 50px;
        border-radius: 12px;
        text-align: center;
    }
    
    .loading-spinner i {
        font-size: 3rem;
        color: #FF7A00;
        margin-bottom: 15px;
    }
    
    .loading-spinner p {
        font-size: 1rem;
        color: #1a1a2e;
        margin: 0;
    }
`;
document.head.appendChild(loadingStyles);

// Initialize common functionality
document.addEventListener('DOMContentLoaded', function() {
    checkOwnerAuth();
    displayOwnerInfo();
    initializeSidebar();
});

// API Helper functions
async function apiRequest(endpoint, method = 'GET', data = null) {
    const user = checkOwnerAuth();
    if (!user) return null;
    
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            // Add authorization header when you implement backend auth
            // 'Authorization': `Bearer ${user.token}`
        }
    };
    
    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Request failed');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        showNotification(error.message, 'error');
        return null;
    }
}

// Export functions for use in other scripts
window.ownerPortal = {
    checkOwnerAuth,
    displayOwnerInfo,
    handleLogout,
    formatCurrency,
    formatDateTime,
    formatDate,
    showNotification,
    showLoading,
    hideLoading,
    apiRequest
};
