/**
 * Owner Reviews Management
 */

let currentRestaurantId = null;
let allReviews = [];
let currentFilter = 'all';

// Initialize page
async function initializeReviews() {
    loadRestaurants();
    setupRestaurantSelector();
}

// Load restaurants
async function loadRestaurants() {
    const user = ownerPortal.checkOwnerAuth();
    if (!user) return;
    
    // Mock data
    const mockRestaurants = [
        { restaurant_id: 1, name: "Pizza Paradise" },
        { restaurant_id: 2, name: "Burger House" }
    ];
    
    const selector = document.getElementById('restaurantSelector');
    selector.innerHTML = '<option value="">Select Restaurant...</option>' +
        mockRestaurants.map(r => `<option value="${r.restaurant_id}">${r.name}</option>`).join('');
}

// Setup restaurant selector
function setupRestaurantSelector() {
    const selector = document.getElementById('restaurantSelector');
    selector.addEventListener('change', function() {
        currentRestaurantId = parseInt(this.value);
        if (currentRestaurantId) {
            loadReviews(currentRestaurantId);
        } else {
            displayEmptyState();
        }
    });
}

// Load reviews
async function loadReviews(restaurantId) {
    ownerPortal.showLoading();
    
    // TODO: Replace with API call
    // const result = await ownerPortal.apiRequest(`/owner/restaurants/${restaurantId}/reviews`);
    
    // Mock data
    allReviews = [
        {
            review_id: 1,
            user_name: 'Ahmed Hassan',
            rating: 5,
            comment: 'Excellent food! The pizza was amazing and arrived hot. Will definitely order again.',
            food_name: 'Margherita Pizza',
            order_id: 'ORD-1001',
            review_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            review_id: 2,
            user_name: 'Fatima Rahman',
            rating: 4,
            comment: 'Good quality food. The delivery was quick. Could use a bit more seasoning though.',
            food_name: null,
            order_id: 'ORD-1002',
            review_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            review_id: 3,
            user_name: 'Karim Ali',
            rating: 5,
            comment: 'Best pizza in town! Fresh ingredients and perfect crust. Highly recommended!',
            food_name: 'Pepperoni Pizza',
            order_id: 'ORD-1003',
            review_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            review_id: 4,
            user_name: 'Sara Khan',
            rating: 3,
            comment: 'It was okay. Nothing special but not bad either. Expected better for the price.',
            food_name: 'Caesar Salad',
            order_id: 'ORD-1004',
            review_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            review_id: 5,
            user_name: 'Hasan Ali',
            rating: 5,
            comment: 'Outstanding service and delicious food. The packaging was also very good.',
            food_name: null,
            order_id: 'ORD-1005',
            review_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            review_id: 6,
            user_name: 'Nadia Ahmed',
            rating: 2,
            comment: 'Food arrived cold and took longer than expected. Not satisfied with this order.',
            food_name: 'BBQ Pizza',
            order_id: 'ORD-1006',
            review_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
    
    ownerPortal.hideLoading();
    
    displayRatingSummary();
    displayReviews(allReviews);
}

// Display rating summary
function displayRatingSummary() {
    const summary = document.getElementById('ratingSummary');
    summary.style.display = 'flex';
    
    // Calculate statistics
    const totalReviews = allReviews.length;
    const avgRating = (allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1);
    
    const ratingCounts = {
        5: allReviews.filter(r => r.rating === 5).length,
        4: allReviews.filter(r => r.rating === 4).length,
        3: allReviews.filter(r => r.rating === 3).length,
        2: allReviews.filter(r => r.rating === 2).length,
        1: allReviews.filter(r => r.rating === 1).length
    };
    
    // Update overall rating
    document.getElementById('avgRating').textContent = avgRating;
    document.getElementById('totalReviews').textContent = `${totalReviews} review${totalReviews > 1 ? 's' : ''}`;
    document.getElementById('avgStars').innerHTML = renderStars(parseFloat(avgRating));
    
    // Update breakdown
    for (let i = 1; i <= 5; i++) {
        const count = ratingCounts[i];
        const percentage = (count / totalReviews) * 100;
        document.getElementById(`progress${i}`).style.width = `${percentage}%`;
        document.getElementById(`count${i}`).textContent = count;
    }
}

// Filter by rating
function filterByRating(rating) {
    currentFilter = rating;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.rating === rating);
    });
    
    // Filter reviews
    const filtered = rating === 'all' 
        ? allReviews 
        : allReviews.filter(r => r.rating === parseInt(rating));
    
    displayReviews(filtered);
}

// Display reviews
function displayReviews(reviews) {
    const container = document.getElementById('reviewsList');
    
    if (!reviews || reviews.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-star"></i>
                <h3>No Reviews</h3>
                <p>No reviews found for the selected filter</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <h4>${review.user_name}</h4>
                        <div class="review-meta">
                            <span class="review-date">${ownerPortal.formatDate(review.review_date)}</span>
                            ${review.food_name ? `<span class="separator">•</span><span class="food-name">${review.food_name}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="review-rating">
                    ${renderStars(review.rating)}
                    <span class="rating-number">${review.rating}.0</span>
                </div>
            </div>
            
            <div class="review-content">
                <p>${review.comment}</p>
            </div>
            
            <div class="review-footer">
                <span class="order-id">Order: ${review.order_id}</span>
            </div>
        </div>
    `).join('');
}

// Render stars
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeReviews();
});

function displayEmptyState() {
    document.getElementById('ratingSummary').style.display = 'none';
    document.getElementById('reviewsList').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-star"></i>
            <h3>Select a Restaurant</h3>
            <p>Choose a restaurant to view customer reviews</p>
        </div>
    `;
}
