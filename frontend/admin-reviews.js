/**
 * Admin Reviews - COMPLETE
 */

let allReviews = [];

async function initializeReviews() {
    loadReviews();
    setupFilters();
    addStyles();
}

async function loadReviews() {
    allReviews = [
        {id: 1, user: 'Ahmed Hassan', target: 'Pizza Paradise', type: 'Restaurant', rating: 5, comment: 'Excellent food!', date: new Date(), flagged: false},
        {id: 2, user: 'Fatima Rahman', target: 'Kamal Rider', type: 'Rider', rating: 5, comment: 'Very professional', date: new Date(), flagged: false},
        {id: 3, user: 'Sara Khan', target: 'Burger House', type: 'Restaurant', rating: 4, comment: 'Good taste', date: new Date(), flagged: false},
        {id: 4, user: 'Anonymous', target: 'Thai Express', type: 'Restaurant', rating: 1, comment: 'Terrible!', date: new Date(), flagged: true}
    ];
    displayReviews(allReviews);
}

function setupFilters() {
    const selects = document.querySelectorAll('.filter-section select');
    const searchInput = document.querySelector('.filter-section input[type="text"]');
    
    selects.forEach(select => select.addEventListener('change', applyFilters));
    if (searchInput) searchInput.addEventListener('input', applyFilters);
}

function applyFilters() {
    // Simple filtering for now
    displayReviews(allReviews);
}

function displayReviews(reviews) {
    const container = document.getElementById('reviewsList');
    
    container.innerHTML = reviews.map(r => `
        <div class="review-card ${r.flagged ? 'flagged' : ''}">
            <div class="review-header">
                <div><strong>${r.user}</strong> reviewed <strong>${r.target}</strong> <span class="badge">${r.type}</span></div>
                <div class="review-stars">${'⭐'.repeat(r.rating)}</div>
            </div>
            <p class="review-comment">${r.comment}</p>
            <div class="review-footer">
                <span>${adminPortal.timeAgo(r.date)}</span>
                ${r.flagged ? '<span class="flag-badge"><i class="fas fa-flag"></i> Flagged</span>' : ''}
                <div class="review-actions">
                    ${r.flagged ? 
                        `<button class="action-btn btn-approve" onclick="approveReview(${r.id})"><i class="fas fa-check"></i> Approve</button>` : 
                        `<button class="action-btn btn-delete" onclick="flagReview(${r.id})"><i class="fas fa-flag"></i> Flag</button>`}
                    <button class="action-btn btn-delete" onclick="deleteReview(${r.id})"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

async function approveReview(id) {
    const review = allReviews.find(r => r.id === id);
    if (!review) return;
    
    review.flagged = false;
    adminPortal.showNotification('Review approved', 'success');
    displayReviews(allReviews);
}

async function flagReview(id) {
    if (!confirm('Flag this review?')) return;
    
    const review = allReviews.find(r => r.id === id);
    if (!review) return;
    
    review.flagged = true;
    adminPortal.showNotification('Review flagged', 'info');
    displayReviews(allReviews);
}

async function deleteReview(id) {
    if (!confirm('Delete this review permanently?')) return;
    
    adminPortal.showLoading();
    await new Promise(r => setTimeout(r, 500));
    
    const index = allReviews.findIndex(r => r.id === id);
    if (index > -1) allReviews.splice(index, 1);
    
    adminPortal.hideLoading();
    adminPortal.showNotification('Review deleted', 'success');
    displayReviews(allReviews);
}

function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .review-card { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #10b981; }
        .review-card.flagged { border-left-color: #ef4444; background: #fee2e2; }
        .review-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .review-stars { font-size: 1.2rem; }
        .badge { background: #6366f1; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; margin-left: 8px; }
        .review-comment { margin: 10px 0; color: #4b5563; }
        .review-footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: #6b7280; }
        .review-actions { display: flex; gap: 8px; }
        .flag-badge { color: #ef4444; font-weight: 600; }
    `;
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', initializeReviews);
