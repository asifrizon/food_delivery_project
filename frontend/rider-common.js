/**
 * Rider Portal - Common Utilities
 * Shared functions across all rider portal pages
 */

// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Check authentication and redirect if not rider
function checkRiderAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        alert('Please login to continue');
        window.location.href = 'home.html';
        return null;
    }
    
    if (currentUser.role !== 'rider') {
        alert('Access denied. Rider privileges required.');
        window.location.href = 'home.html';
        return null;
    }
    
    return currentUser;
}

// Display rider name in top bar
function displayRiderInfo() {
    const user = checkRiderAuth();
    if (!user) return;
    
    const riderNameEl = document.getElementById('riderName');
    if (riderNameEl) {
        riderNameEl.textContent = user.username || 'Rider';
    }
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Set rider as offline before logout
        setRiderOnlineStatus(false);
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

// Format time only
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-BD', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Calculate time ago
function timeAgo(dateString) {
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

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification styles
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

// Online/Offline Status Management
function initializeOnlineToggle() {
    const toggle = document.getElementById('onlineToggle');
    const statusText = document.getElementById('statusText');
    const onlineIndicator = document.getElementById('onlineIndicator');
    
    // Load saved status
    const savedStatus = localStorage.getItem('riderOnlineStatus') === 'true';
    if (toggle) {
        toggle.checked = savedStatus;
        updateOnlineStatus(savedStatus);
    }
    
    // Handle toggle change
    if (toggle) {
        toggle.addEventListener('change', function() {
            const isOnline = this.checked;
            setRiderOnlineStatus(isOnline);
            updateOnlineStatus(isOnline);
        });
    }
    
    function updateOnlineStatus(isOnline) {
        if (statusText) {
            statusText.textContent = isOnline ? 'Online' : 'Offline';
        }
        
        if (onlineIndicator) {
            const statusDot = onlineIndicator.querySelector('.status-dot');
            const statusTextSpan = onlineIndicator.querySelector('.status-text');
            
            if (statusDot) {
                statusDot.className = isOnline ? 'status-dot online' : 'status-dot offline';
            }
            if (statusTextSpan) {
                statusTextSpan.textContent = isOnline ? 'Online' : 'Offline';
            }
        }
    }
}

function setRiderOnlineStatus(isOnline) {
    localStorage.setItem('riderOnlineStatus', isOnline.toString());
    
    // TODO: Send status to backend
    // await apiRequest('/rider/status', 'PUT', { online: isOnline });
    
    if (isOnline) {
        showNotification('You are now online and can receive orders!', 'success');
    } else {
        showNotification('You are now offline', 'info');
    }
}

function getRiderOnlineStatus() {
    return localStorage.getItem('riderOnlineStatus') === 'true';
}

// API Helper functions
async function apiRequest(endpoint, method = 'GET', data = null) {
    const user = checkRiderAuth();
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

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance.toFixed(1);
}

// Update notification badges
function updateNotificationBadges(available = 0, active = 0) {
    const availableBadge = document.getElementById('availableOrdersBadge');
    const activeBadge = document.getElementById('activeOrdersBadge');
    
    if (availableBadge) {
        availableBadge.textContent = available;
        availableBadge.style.display = available > 0 ? 'block' : 'none';
    }
    
    if (activeBadge) {
        activeBadge.textContent = active;
        activeBadge.style.display = active > 0 ? 'block' : 'none';
    }
}

// Play notification sound
function playNotificationSound() {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS56+WiURALUKjo77Zk');
    audio.play().catch(() => {});
}

// Initialize common functionality
document.addEventListener('DOMContentLoaded', function() {
    checkRiderAuth();
    displayRiderInfo();
    initializeSidebar();
    initializeOnlineToggle();
});

// Export functions for use in other scripts
window.riderPortal = {
    checkRiderAuth,
    displayRiderInfo,
    handleLogout,
    formatCurrency,
    formatDateTime,
    formatDate,
    formatTime,
    timeAgo,
    showNotification,
    showLoading,
    hideLoading,
    apiRequest,
    setRiderOnlineStatus,
    getRiderOnlineStatus,
    calculateDistance,
    updateNotificationBadges,
    playNotificationSound,
    checkVehicleInfo,
    isProfileComplete
};

// Check if rider has completed vehicle information
function checkVehicleInfo() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return false;
    
    return !!(
        user.vehicleType &&
        user.vehicleNumber &&
        user.licenseNumber &&
        user.nidNumber
    );
}

// Check if profile is complete
function isProfileComplete() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return false;
    
    const basicInfo = user.username && user.email && user.phone && user.city && user.thana && user.addressDetails;
    const vehicleInfo = checkVehicleInfo();
    
    return basicInfo && vehicleInfo;
}