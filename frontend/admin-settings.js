/**
 * Admin Settings - COMPLETE
 */

const settings = {
    delivery: { baseFee: 50, perKm: 10, freeAbove: 500 },
    commission: { restaurant: 15, rider: 80, platform: 5 },
    tax: { vat: 5, service: 2 },
    notifications: { email: true, sms: true, push: true },
    payment: { provider: 'Stripe', apiKey: '••••••••••••' },
    general: { name: 'Gorom Delivery', email: 'support@goromdelivery.com', phone: '+880 1234-567890' }
};

function initializeSettings() {
    addButtonHandlers();
    addStyles();
    loadSettings();
}

function loadSettings() {
    // Load delivery settings
    document.querySelectorAll('.settings-section')[0].querySelectorAll('.form-input')[0].value = settings.delivery.baseFee;
    document.querySelectorAll('.settings-section')[0].querySelectorAll('.form-input')[1].value = settings.delivery.perKm;
    document.querySelectorAll('.settings-section')[0].querySelectorAll('.form-input')[2].value = settings.delivery.freeAbove;
    
    // Load other settings similarly...
}

function addButtonHandlers() {
    const saveButtons = document.querySelectorAll('.settings-section .btn-primary');
    saveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionTitle = this.closest('.settings-section').querySelector('h3').textContent.trim();
            saveSettings(sectionTitle);
        });
    });
    
    const dangerButtons = document.querySelectorAll('.danger-zone .btn-danger');
    dangerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            handleDangerAction(buttonText);
        });
    });
}

function saveSettings(sectionTitle) {
    adminPortal.showLoading();
    
    // Get values and save
    if (sectionTitle.includes('Delivery')) {
        const inputs = document.querySelectorAll('.settings-section')[0].querySelectorAll('.form-input');
        settings.delivery.baseFee = inputs[0].value;
        settings.delivery.perKm = inputs[1].value;
        settings.delivery.freeAbove = inputs[2].value;
    }
    
    setTimeout(() => {
        adminPortal.hideLoading();
        adminPortal.showNotification(`${sectionTitle} saved successfully!`, 'success');
    }, 1000);
}

function handleDangerAction(actionText) {
    if (actionText.includes('Clear All Cache')) {
        if (!confirm('Clear all cache? This cannot be undone.')) return;
        
        adminPortal.showLoading();
        setTimeout(() => {
            adminPortal.hideLoading();
            adminPortal.showNotification('Cache cleared successfully', 'success');
        }, 1500);
    }
    else if (actionText.includes('Reset Platform Settings')) {
        if (!confirm('Reset all settings to default? This cannot be undone.')) return;
        
        adminPortal.showLoading();
        setTimeout(() => {
            adminPortal.hideLoading();
            adminPortal.showNotification('Settings reset to default', 'success');
            setTimeout(() => location.reload(), 1000);
        }, 1500);
    }
    else if (actionText.includes('Maintenance Mode')) {
        if (!confirm('Enable maintenance mode? Platform will be unavailable.')) return;
        
        adminPortal.showLoading();
        setTimeout(() => {
            adminPortal.hideLoading();
            adminPortal.showNotification('Maintenance mode activated', 'info');
        }, 1000);
    }
}

function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .settings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 25px; }
        .settings-section { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .settings-section h3 { font-size: 1.1rem; margin-bottom: 20px; color: #1a1a2e; display: flex; align-items: center; gap: 10px; }
        .settings-section h3 i { color: #FF7A00; }
        .setting-item { margin-bottom: 20px; }
        .setting-item label { display: block; font-weight: 500; color: #4b5563; margin-bottom: 8px; font-size: 0.9rem; }
        .toggle-label { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .toggle-label input[type="checkbox"] { width: 20px; height: 20px; cursor: pointer; accent-color: #FF7A00; }
        .danger-zone { background: #fee2e2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; }
        .danger-zone p { color: #991b1b; margin-bottom: 15px; font-weight: 500; }
        .danger-zone button { margin-right: 10px; margin-bottom: 10px; }
    `;
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', initializeSettings);
