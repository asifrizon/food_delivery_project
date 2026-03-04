const API_URL = "http://localhost:3000/api/restaurants";

const selectedRestaurant = JSON.parse(sessionStorage.getItem('selectedRestaurant'));

if (!selectedRestaurant || !selectedRestaurant.restaurant_id) {
    alert("No restaurant selected!");
    window.location.href = 'home.html';
}

const restaurantId = selectedRestaurant.restaurant_id;
let allFoodItems = [];
let currentFoodItem = null; // Store the currently selected food item for the modal

// Get current order for this restaurant from OrderManager
function getCurrentOrder() {
    return OrderManager.getOrderByRestaurant(restaurantId) || { items: [] };
}

// Update restaurant-specific cart badge
function updateRestaurantCartBadge() {
    const order = getCurrentOrder();
    const itemCount = order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
    
    const badge = document.querySelector('#cart-icon .cart-badge');
    if (badge) {
        if (itemCount > 0) {
            badge.textContent = itemCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

function closeMenu() {
    window.location.href = 'home.html';
}

// Fetch menu data
fetch(`${API_URL}/${restaurantId}/menu`)
    .then(res => res.json())
    .then(response => {
        if (response.success) {
            // Resolve is_primary image for every food item before use
            allFoodItems = ImageHelper.resolveAll(response.data.food_items, 'food');
            
            displayRestaurantInfo();
            displayOffers(response.data.offers);
            displayCategories(response.data.food_items);
            displayFoodItems(response.data.food_items);
        }
    })
    .catch(error => console.error("Error:", error));

function displayRestaurantInfo() {
    // Get the image element
    const restaurantImage = document.getElementById('restaurantImage');

    // Check if the image URL is valid
    restaurantImage.src = ImageHelper.getRestaurantImage(selectedRestaurant);

    // Add error handling to show a default image if the provided image doesn't load
    restaurantImage.onerror = function() {
        restaurantImage.src = 'image/food_22.png';  // Set the default image path here
    };

    // Set the restaurant name
    document.getElementById('restaurantNameHeader').textContent = selectedRestaurant.name;

    // Set the rating with the star icon
    document.getElementById('rating').innerHTML = `<i class="fas fa-star"></i> ${selectedRestaurant.rating}`;

    // Set the delivery time and add a location icon
    document.getElementById('delivery_time').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${selectedRestaurant.police_station}`;
}


function displayOffers(offers) {
    const dealsGrid = document.getElementById('deals_grid');
    
    dealsGrid.innerHTML = offers.map(offer => {
        let title, desc, min, max;
        
        if (offer.offer_type === 'flat') {
            title = `৳${parseFloat(offer.offer_value)} OFF`;
            desc = `Flat discount`;
        } else {
            title = `${parseFloat(offer.offer_value)}% OFF`;
            desc = `Percentage discount`;
        }
        
        min = `Min order: ৳${parseFloat(offer.min_order_amount)}`;
        max = offer.max_discount ? `Max: ৳${parseFloat(offer.max_discount)}` : '';

        return `
            <div class="deals-card">
                <h5>${title}</h5>
                <p>${desc}</p>
                <p>${min}</p>
                ${max ? `<span>${max}</span>` : ''}
            </div>
        `;
    }).join('');
}

function displayCategories(foodItems) {
    const categoryList = document.getElementById('categoryList');
    const categories = [...new Set(foodItems.map(item => item.category))];
    
    categoryList.innerHTML = categories.map(cat => 
        `<a href="#cat-${cat.replace(/\s+/g, '-')}" class="category-link" data-category="${cat.replace(/\s+/g, '-')}">${cat}</a>`
    ).join('');
    
    // Add smooth scroll with offset for category links
    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-category');
            const targetElement = document.getElementById('cat-' + targetId);
            
            if (targetElement) {
                const offset = 150; // Adjust this value to control how much space above the category
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function displayFoodItems(foodItems) {
    const foodGrid = document.getElementById('foodGrid');
    
    const grouped = {};
    foodItems.forEach(item => {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item);
    });

    let html = '';
    
    for (const category in grouped) {
        html += `<h2 class="category-title" id="cat-${category.replace(/\s+/g, '-')}" style="width: 100%;">${category}</h2>`;
        
        grouped[category].forEach(item => {
            const price = parseFloat(item.price).toFixed(2);
            // image_url already resolved by ImageHelper.resolveAll above
            const imageUrl = item.image_url || 'image/food_placeholder.png';
            
            html += `
            <div class="food-large-card">
                <div class="food-card">
                    <div class="image-wrapper">
                        <img src="${imageUrl}" alt="${item.name}" onerror="this.src='image/food_11.png'">
                    </div>
                    <div class="food-details">
                        <h4>${item.name}</h4>
                        <div class="rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="price_add">
                            <span>৳${price}</span>
                            <button class="add-to-cart-trigger" data-item-id="${item.food_id}">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>`;
        });
    }
    
    foodGrid.innerHTML = html;
    
    // Add event listeners to all Add to Cart buttons
    document.querySelectorAll('.add-to-cart-trigger').forEach(button => {
        button.addEventListener('click', function() {
            const foodId = this.getAttribute('data-item-id');
            const foodItem = allFoodItems.find(item => item.food_id == foodId);
            if (foodItem) {
                openAddToCartModal(foodItem);
            }
        });
    });
}

// Search
document.getElementById('searchBar').addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    const filtered = query === '' ? allFoodItems : 
        allFoodItems.filter(item => 
            item.name.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );
    displayFoodItems(filtered);
});

// Scroll
document.getElementById('scrollButton').addEventListener('click', () => {
    document.getElementById('categoryList').scrollBy({ left: 200, behavior: 'smooth' });
});

document.getElementById('scrollButtonleft').addEventListener('click', () => {
    document.getElementById('categoryList').scrollBy({ left: -200, behavior: 'smooth' });
});

// ===========================
// Cart Functions
// ===========================

function updateCartDisplay() {
    const cartEmpty = document.getElementById('cartEmpty');
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    
    const order = getCurrentOrder();
    const cart = order.items || [];
    
    if (cart.length === 0) {
        cartEmpty.style.display = 'flex';
        cartItems.style.display = 'none';
        cartSummary.style.display = 'none';
    } else {
        cartEmpty.style.display = 'none';
        cartItems.style.display = 'block';
        cartSummary.style.display = 'block';
        
        // Render cart items
        cartItems.innerHTML = cart.map((item, index) => {
            const itemTotal = (parseFloat(item.price) * item.quantity).toFixed(2);
            const imageUrl = item.image || 'image/food_placeholder.png';
            
            return `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${imageUrl}" alt="${item.name}" onerror="this.src='image/food_11.png'">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">৳${parseFloat(item.price).toFixed(2)} each</div>
                        <div class="cart-item-quantity">
                            <button class="qty-btn" onclick="decreaseCartQuantity(${item.foodId})">-</button>
                            <span class="qty-display">${item.quantity}</span>
                            <button class="qty-btn" onclick="increaseCartQuantity(${item.foodId})">+</button>
                            <span style="flex: 1; text-align: right; font-weight: 600; color: #1a1a2e;">৳${itemTotal}</span>
                        </div>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.foodId})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }).join('');
        
        // Calculate totals
        updateCartSummary(order);
    }
}

function updateCartSummary(order) {
    document.getElementById('cartSubtotal').textContent = `৳${order.subtotal.toFixed(2)}`;
    document.getElementById('cartDeliveryFee').textContent = `৳${order.deliveryFee.toFixed(2)}`;
    document.getElementById('cartVAT').textContent = `৳${order.vat.toFixed(2)}`;
    document.getElementById('cartTotal').textContent = `৳${order.total.toFixed(2)}`;
}

function addToCart(foodItem, quantity) {
    const item = {
        foodId: foodItem.food_id,
        name: foodItem.name,
        price: parseFloat(foodItem.price),
        quantity: quantity,
        image: ImageHelper.getFoodImage(foodItem)
    };
    
    OrderManager.addToOrder({
        restaurantId: selectedRestaurant.restaurant_id,
        name: selectedRestaurant.name,
        image_url: ImageHelper.getRestaurantImage(selectedRestaurant),
        address: selectedRestaurant.address,
        police_station: selectedRestaurant.police_station
    }, [item]);
    
    updateCartDisplay();
    updateRestaurantCartBadge();
}

function increaseCartQuantity(foodId) {
    const order = getCurrentOrder();
    const item = order.items.find(i => i.foodId === foodId);
    if (item) {
        OrderManager.updateItemQuantity(restaurantId, foodId, item.quantity + 1);
        updateCartDisplay();
        updateRestaurantCartBadge();
    }
}

function decreaseCartQuantity(foodId) {
    const order = getCurrentOrder();
    const item = order.items.find(i => i.foodId === foodId);
    if (item && item.quantity > 1) {
        OrderManager.updateItemQuantity(restaurantId, foodId, item.quantity - 1);
        updateCartDisplay();
        updateRestaurantCartBadge();
    }
}

function removeFromCart(foodId) {
    OrderManager.removeItem(restaurantId, foodId);
    updateCartDisplay();
    updateRestaurantCartBadge();
}

// ===========================
// Add to Cart Modal Functions
// ===========================

function openAddToCartModal(foodItem) {
    currentFoodItem = foodItem;
    const modal = document.getElementById('addToCartModal');
    
    // Set food item details in modal
    const imageUrl = ImageHelper.getFoodImage(foodItem);
    document.getElementById('modalFoodImage').src = imageUrl;
    document.getElementById('modalFoodImage').onerror = function() {
        this.src = 'image/food_11.png';
    };
    
    document.getElementById('modalFoodName').textContent = foodItem.name;
    
    // Check if item is pizza (check category or name)
    const isPizza = foodItem.category && foodItem.category.toLowerCase().includes('pizza');
    const sizeSelector = document.getElementById('sizeSelector');
    const basePriceNote = document.getElementById('basePriceNote');
    
    // Set description
    let description = foodItem.description || 'Delicious food item prepared with care and quality ingredients.';
    
    // If pizza, remove any size-related text from description
    if (isPizza) {
        // Remove common size patterns like "7 inch", "7inch", "7"", "small", "medium", "large"
        description = description.replace(/\b\d+\s*inch(es)?\b/gi, '');
        description = description.replace(/\b\d+\s*"/gi, '');
        description = description.replace(/\b(small|medium|large|regular)\s*(size)?\b/gi, '');
        description = description.trim();
        
        // If description becomes empty after cleanup, use default
        if (!description || description.length < 10) {
            description = 'Delicious pizza prepared with fresh ingredients and topped to perfection.';
        }
    }
    
    document.getElementById('modalFoodDescription').textContent = description;
    
    if (isPizza) {
        // Show size selector for pizza
        sizeSelector.style.display = 'block';
        basePriceNote.style.display = 'inline';
        
        // Reset to default size (12" - Large)
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.size === '12') {
                btn.classList.add('active');
            }
        });
        
        // Set initial price based on 12" (multiplier 2)
        const basePrice = parseFloat(foodItem.price);
        const displayPrice = (basePrice * 2).toFixed(2);
        document.getElementById('modalFoodPrice').textContent = `৳${displayPrice}`;
        basePriceNote.textContent = `(Base: ৳${basePrice.toFixed(2)})`;
    } else {
        // Hide size selector for non-pizza items
        sizeSelector.style.display = 'none';
        basePriceNote.style.display = 'none';
        
        const price = parseFloat(foodItem.price).toFixed(2);
        document.getElementById('modalFoodPrice').textContent = `৳${price}`;
    }
    
    // Reset quantity to 1
    document.getElementById('quantityInput').value = 1;
    updateTotalPrice();
    
    // Show modal
    modal.style.display = 'block';
}

function closeAddToCartModal() {
    const modal = document.getElementById('addToCartModal');
    modal.style.display = 'none';
    currentFoodItem = null;
}

function updateTotalPrice() {
    if (!currentFoodItem) return;
    
    const quantity = parseInt(document.getElementById('quantityInput').value);
    let price = parseFloat(currentFoodItem.price);
    
    // Check if pizza and get size multiplier
    const isPizza = currentFoodItem.category && currentFoodItem.category.toLowerCase().includes('pizza');
    if (isPizza) {
        const activeSize = document.querySelector('.size-btn.active');
        if (activeSize) {
            const multiplier = parseFloat(activeSize.dataset.multiplier);
            price = price * multiplier;
        }
    }
    
    const total = (price * quantity).toFixed(2);
    
    document.getElementById('modalTotalPrice').textContent = `৳${total}`;
}

// ===========================
// Restaurant Cart Modal Functions
// ===========================

function openRestaurantCartModal() {
    const modal = document.getElementById('restaurantCartModal');
    displayRestaurantCart();
    modal.style.display = 'block';
}

function closeRestaurantCartModal() {
    const modal = document.getElementById('restaurantCartModal');
    modal.style.display = 'none';
}

function displayRestaurantCart() {
    const order = getCurrentOrder();
    const cartEmpty = document.getElementById('restaurantCartEmpty');
    const cartContent = document.getElementById('restaurantCartContent');
    const orderCard = document.getElementById('restaurantOrderCard');
    
    if (!order || order.items.length === 0) {
        cartEmpty.style.display = 'flex';
        cartContent.style.display = 'none';
    } else {
        cartEmpty.style.display = 'none';
        cartContent.style.display = 'block';
        
        const imageUrl = ImageHelper.getRestaurantImage(selectedRestaurant);
        
        orderCard.innerHTML = `
            <div class="order-header">
                <div class="order-restaurant-image">
                    <img src="${imageUrl}" alt="${selectedRestaurant.name}" onerror="this.src='image/food_2.png'">
                </div>
                <div class="order-restaurant-info">
                    <div class="order-restaurant-name">${selectedRestaurant.name}</div>
                    <div class="order-restaurant-address">
                        <i class="fas fa-map-marker-alt"></i>
                        ${selectedRestaurant.police_station || selectedRestaurant.address || ''}
                    </div>
                    <div class="order-id">Order ID: ${order.orderId}</div>
                </div>
            </div>
            
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <div>
                            <span class="order-item-name">${item.name}</span>
                            <span class="order-item-qty">x${item.quantity}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <button class="qty-btn-small" onclick="decreaseFromModal(${item.foodId})" style="width: 24px; height: 24px; font-size: 0.9rem;">-</button>
                            <span style="min-width: 20px; text-align: center; font-weight: 600;">${item.quantity}</span>
                            <button class="qty-btn-small" onclick="increaseFromModal(${item.foodId})" style="width: 24px; height: 24px; font-size: 0.9rem;">+</button>
                            <span class="order-item-price" style="margin-left: 10px;">৳${(item.price * item.quantity).toFixed(2)}</span>
                            <button onclick="removeFromModal(${item.foodId})" style="background: none; border: none; color: #ef4444; cursor: pointer; margin-left: 5px;">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-summary">
                <div class="order-summary-row">
                    <span>Subtotal</span>
                    <span>৳${order.subtotal.toFixed(2)}</span>
                </div>
                <div class="order-summary-row">
                    <span>Delivery Fee</span>
                    <span>৳${order.deliveryFee.toFixed(2)}</span>
                </div>
                <div class="order-summary-row">
                    <span>VAT (${OrderManager.VAT_PERCENTAGE}%)</span>
                    <span>৳${order.vat.toFixed(2)}</span>
                </div>
                <div class="order-summary-row total">
                    <span>Total</span>
                    <span>৳${order.total.toFixed(2)}</span>
                </div>
            </div>
            
            <button class="checkout-btn" onclick="handleCheckout()" style="width: 100%; margin-top: 20px;">
                <i class="fas fa-check-circle"></i> Proceed to Checkout
            </button>
        `;
    }
}

function increaseFromModal(foodId) {
    const order = getCurrentOrder();
    const item = order.items.find(i => i.foodId === foodId);
    if (item) {
        OrderManager.updateItemQuantity(restaurantId, foodId, item.quantity + 1);
        displayRestaurantCart();
        updateCartDisplay();
        updateRestaurantCartBadge();
    }
}

function decreaseFromModal(foodId) {
    const order = getCurrentOrder();
    const item = order.items.find(i => i.foodId === foodId);
    if (item && item.quantity > 1) {
        OrderManager.updateItemQuantity(restaurantId, foodId, item.quantity - 1);
        displayRestaurantCart();
        updateCartDisplay();
        updateRestaurantCartBadge();
    }
}

function removeFromModal(foodId) {
    OrderManager.removeItem(restaurantId, foodId);
    displayRestaurantCart();
    updateCartDisplay();
    updateRestaurantCartBadge();
}

// ===========================
// Checkout Function
// ===========================

// ===========================
// Checkout with Address Selection
// ===========================

function handleCheckout() {
    const order = getCurrentOrder();

    if (!order || order.items.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'customer') {
        alert('Please log in to place an order.');
        window.location.href = 'home.html';
        return;
    }

    closeRestaurantCartModal();
    openCheckoutModal(order, currentUser);
}

function openCheckoutModal(order, currentUser) {
    const existing = document.getElementById('checkoutModal');
    if (existing) existing.remove();

    const addresses = AddressManager.getCachedAddresses();
    const selectedAddr = AddressManager.getSelectedAddress();

    const modal = document.createElement('div');
    modal.id = 'checkoutModal';
    modal.className = 'orders-modal';
    modal.style.display = 'block';

    modal.innerHTML = `
        <div class="orders-modal-content" style="max-width: 540px; max-height: 85vh; overflow-y: auto;">
            <div class="orders-modal-header">
                <h2><i class="fas fa-check-circle"></i> Checkout</h2>
                <span class="orders-close" id="closeCheckoutModal">&times;</span>
            </div>

            <!-- Order Summary -->
            <div style="padding: 20px;">
                <h3 style="font-size: 1rem; color: #1a1a2e; margin-bottom: 12px;">
                    <i class="fas fa-receipt" style="color: #FF7A00;"></i> Order Summary
                </h3>
                <div style="background: #f8f9fa; border-radius: 8px; padding: 14px; margin-bottom: 20px;">
                    ${order.items.map(item => `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem; color: #4b5563;">
                            <span>${item.name} <span style="color: #9ca3af;">×${item.quantity}</span></span>
                            <span style="font-weight: 600; color: #1a1a2e;">৳${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 10px 0;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #6b7280; margin-bottom: 4px;">
                        <span>Subtotal</span><span>৳${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #6b7280; margin-bottom: 4px;">
                        <span>Delivery Fee</span><span>৳${order.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #6b7280; margin-bottom: 8px;">
                        <span>VAT (${OrderManager.VAT_PERCENTAGE}%)</span><span>৳${order.vat.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 1.05rem; font-weight: 700; color: #1a1a2e;">
                        <span>Total</span><span style="color: #FF7A00;">৳${order.total.toFixed(2)}</span>
                    </div>
                </div>

                <!-- Delivery Address Section -->
                <h3 style="font-size: 1rem; color: #1a1a2e; margin-bottom: 12px;">
                    <i class="fas fa-map-marker-alt" style="color: #FF7A00;"></i> Delivery Address
                </h3>

                ${addresses.length === 0 ? `
                    <div style="background: #fff7f0; border: 1.5px solid #FF7A00; border-radius: 8px; padding: 14px; margin-bottom: 16px; color: #92400e; font-size: 0.9rem;">
                        <i class="fas fa-exclamation-triangle"></i> No saved addresses found. Please add one below.
                    </div>
                ` : `
                    <div id="checkoutAddressList" style="margin-bottom: 16px;">
                        ${renderCheckoutAddressList(addresses, selectedAddr)}
                    </div>
                `}

                <!-- Add New Address inline -->
                <details id="addAddressSection" style="margin-bottom: 20px;">
                    <summary style="cursor: pointer; font-size: 0.9rem; color: #FF7A00; font-weight: 600; padding: 8px 0; list-style: none;">
                        <i class="fas fa-plus-circle"></i> Add a new address
                    </summary>
                    <div style="padding: 14px; background: #f9fafb; border-radius: 8px; margin-top: 10px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div>
                                <label style="font-size: 0.82rem; font-weight: 500; color: #4b5563; display: block; margin-bottom: 4px;">City *</label>
                                <select id="co_newCity" style="width:100%; padding: 7px 10px; border: 1.5px solid #e5e7eb; border-radius: 6px; font-family: inherit; font-size: 0.88rem;">
                                    <option value="">Select City</option>
                                    ${['Dhaka','Chittagong','Sylhet','Rajshahi','Khulna','Barisal','Rangpur','Mymensingh'].map(c => `<option>${c}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 0.82rem; font-weight: 500; color: #4b5563; display: block; margin-bottom: 4px;">Thana *</label>
                                <input type="text" id="co_newThana" placeholder="e.g. Mirpur" style="width:100%; padding: 7px 10px; border: 1.5px solid #e5e7eb; border-radius: 6px; font-family: inherit; font-size: 0.88rem;">
                            </div>
                        </div>
                        <div style="margin-top: 10px;">
                            <label style="font-size: 0.82rem; font-weight: 500; color: #4b5563; display: block; margin-bottom: 4px;">Address Details *</label>
                            <textarea id="co_newDetails" placeholder="House/Flat No, Road, Area" rows="2" style="width:100%; padding: 7px 10px; border: 1.5px solid #e5e7eb; border-radius: 6px; font-family: inherit; font-size: 0.88rem; resize: vertical;"></textarea>
                        </div>
                        <button id="co_saveAddrBtn" type="button" style="margin-top: 10px; padding: 8px 18px; background: #FF7A00; color: white; border: none; border-radius: 6px; font-size: 0.88rem; font-weight: 600; cursor: pointer; font-family: inherit;">
                            <i class="fas fa-save"></i> Save & Use This Address
                        </button>
                    </div>
                </details>

                <!-- Place Order Button -->
                <button id="placeOrderBtn" style="
                    width: 100%; padding: 14px; background: linear-gradient(135deg, #FF7A00, #e66d00);
                    color: white; border: none; border-radius: 10px; font-size: 1rem; font-weight: 700;
                    cursor: pointer; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 10px;
                ">
                    <i class="fas fa-check-circle"></i> Place Order · ৳${order.total.toFixed(2)}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close
    document.getElementById('closeCheckoutModal').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    // Select address
    modal.addEventListener('click', function (e) {
        const btn = e.target.closest('.co-select-addr-btn');
        if (btn) {
            const id = btn.dataset.id;
            const addresses = AddressManager.getCachedAddresses();
            const addr = addresses.find(a => String(a.address_id) === String(id));
            if (addr) {
                AddressManager.setSelectedAddress(addr);
                const listEl = document.getElementById('checkoutAddressList');
                if (listEl) listEl.innerHTML = renderCheckoutAddressList(addresses, addr);
            }
        }
    });

    // Save new address from checkout
    document.getElementById('co_saveAddrBtn').addEventListener('click', async function () {
        const city = document.getElementById('co_newCity').value;
        const thana = document.getElementById('co_newThana').value;
        const details = document.getElementById('co_newDetails').value;

        if (!city || !thana || !details) {
            alert('Please fill in all address fields.');
            return;
        }

        const newAddr = { city, thana, address_details: details, is_default: false, address_id: Date.now() };

        try {
            const saved = await AddressManager.addAddress(currentUser.user_id, { city, thana, address_details: details, is_default: false });
            AddressManager.setSelectedAddress(saved);
        } catch {
            const addresses = AddressManager.getCachedAddresses();
            addresses.push(newAddr);
            localStorage.setItem('gorom_user_addresses', JSON.stringify(addresses));
            AddressManager.setSelectedAddress(newAddr);
        }

        // Refresh address list
        const allAddresses = AddressManager.getCachedAddresses();
        const selected = AddressManager.getSelectedAddress();
        const listEl = document.getElementById('checkoutAddressList');
        if (listEl) {
            listEl.innerHTML = renderCheckoutAddressList(allAddresses, selected);
        } else {
            // Was showing "no addresses" — replace that section
            const noAddrMsg = modal.querySelector('[data-no-addr]');
            if (noAddrMsg) {
                const div = document.createElement('div');
                div.id = 'checkoutAddressList';
                div.innerHTML = renderCheckoutAddressList(allAddresses, selected);
                noAddrMsg.replaceWith(div);
            }
        }

        // Close the details element
        document.getElementById('addAddressSection').removeAttribute('open');
    });

    // Place order
    document.getElementById('placeOrderBtn').addEventListener('click', async function () {
        const deliveryAddress = AddressManager.getSelectedAddress();

        if (!deliveryAddress) {
            alert('Please select or add a delivery address before placing the order.');
            return;
        }

        const btn = this;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Placing Order...';

        try {
            if (currentUser.user_id && deliveryAddress.address_id) {
                // Real API submit
                const result = await OrderManager.submitOrder(
                    restaurantId,
                    deliveryAddress.address_id,
                    currentUser.user_id
                );
                modal.remove();
                showOrderSuccessModal(result, deliveryAddress);
            } else {
                // Fallback: mock success
                await new Promise(r => setTimeout(r, 1000));
                OrderManager.removeOrder(restaurantId);
                modal.remove();
                showOrderSuccessModal(null, deliveryAddress);
            }
        } catch (error) {
            console.error('Order submit error:', error);
            btn.disabled = false;
            btn.innerHTML = `<i class="fas fa-check-circle"></i> Place Order · ৳${order.total.toFixed(2)}`;
            alert('Failed to place order. Please try again.');
        }
    });
}

function renderCheckoutAddressList(addresses, selectedAddr) {
    if (!addresses || addresses.length === 0) return '';
    return addresses.map(addr => {
        const isSelected = selectedAddr && String(selectedAddr.address_id) === String(addr.address_id);
        return `
            <div style="
                border: 2px solid ${isSelected ? '#FF7A00' : '#e5e7eb'};
                border-radius: 10px; padding: 12px 14px; margin-bottom: 10px;
                background: ${isSelected ? '#fff7f0' : '#f9fafb'};
                display: flex; justify-content: space-between; align-items: center;
            ">
                <div>
                    ${addr.is_default ? `<span style="font-size:0.7rem; background:#FF7A00; color:white; padding: 1px 7px; border-radius: 8px; font-weight:600; margin-right: 6px;">DEFAULT</span>` : ''}
                    <span style="font-weight: 600; color: #1a1a2e; font-size: 0.9rem;">${addr.address_details || addr.addressDetails || ''}</span>
                    <div style="color: #6b7280; font-size: 0.85rem; margin-top: 3px;">${addr.thana}, ${addr.city}</div>
                </div>
                <button class="co-select-addr-btn" data-id="${addr.address_id}" style="
                    padding: 6px 14px; font-size: 0.85rem; border-radius: 6px; cursor: pointer; font-family: inherit; font-weight: 600; white-space: nowrap;
                    background: ${isSelected ? '#10b981' : '#FF7A00'}; color: white; border: none; margin-left: 12px;
                ">
                    ${isSelected ? '<i class="fas fa-check"></i> Selected' : 'Deliver Here'}
                </button>
            </div>
        `;
    }).join('');
}

function showOrderSuccessModal(result, deliveryAddress) {
    const existing = document.getElementById('orderSuccessModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'orderSuccessModal';
    modal.className = 'orders-modal';
    modal.style.display = 'block';

    const orderId = result?.order_id || result?.data?.order_id || `ORD_${Date.now()}`;

    modal.innerHTML = `
        <div class="orders-modal-content" style="max-width: 420px; text-align: center; padding: 40px 30px;">
            <div style="width: 80px; height: 80px; background: #d1fae5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                <i class="fas fa-check" style="font-size: 2.5rem; color: #10b981;"></i>
            </div>
            <h2 style="color: #1a1a2e; margin-bottom: 10px;">Order Placed!</h2>
            <p style="color: #6b7280; margin-bottom: 6px;">Your order has been sent to the restaurant.</p>
            <p style="font-size: 0.85rem; color: #9ca3af; margin-bottom: 20px;">Order ID: <strong>${orderId}</strong></p>
            <div style="background: #f8f9fa; border-radius: 8px; padding: 12px; text-align: left; margin-bottom: 24px;">
                <p style="font-size: 0.85rem; color: #4b5563; margin: 0;">
                    <i class="fas fa-map-marker-alt" style="color: #FF7A00; margin-right: 6px;"></i>
                    Delivering to: <strong>${AddressManager.formatAddress(deliveryAddress)}</strong>
                </p>
            </div>
            <button onclick="document.getElementById('orderSuccessModal').remove(); window.location.href='home.html';" style="
                width: 100%; padding: 12px; background: linear-gradient(135deg, #FF7A00, #e66d00);
                color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 700;
                cursor: pointer; font-family: inherit;
            ">Back to Home</button>
        </div>
    `;

    document.body.appendChild(modal);
    modal.onclick = (e) => { if (e.target === modal) { modal.remove(); window.location.href = 'home.html'; } };
}

// Modal Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Close button for add to cart modal
    document.querySelector('.cart-close').addEventListener('click', closeAddToCartModal);
    
    // Restaurant cart modal - cart icon click
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            openRestaurantCartModal();
        });
    }
    
    // Close button for restaurant cart modal
    const restaurantCartClose = document.querySelector('.restaurant-cart-close');
    if (restaurantCartClose) {
        restaurantCartClose.addEventListener('click', closeRestaurantCartModal);
    }
    
    // Click outside modal to close
    window.addEventListener('click', function(event) {
        const addToCartModal = document.getElementById('addToCartModal');
        const restaurantCartModal = document.getElementById('restaurantCartModal');
        
        if (event.target === addToCartModal) {
            closeAddToCartModal();
        }
        
        if (event.target === restaurantCartModal) {
            closeRestaurantCartModal();
        }
    });
    
    // Size button click handlers
    document.addEventListener('click', function(e) {
        if (e.target.closest('.size-btn')) {
            const button = e.target.closest('.size-btn');
            
            // Remove active class from all size buttons
            document.querySelectorAll('.size-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update price display
            if (currentFoodItem) {
                const basePrice = parseFloat(currentFoodItem.price);
                const multiplier = parseFloat(button.dataset.multiplier);
                const newPrice = (basePrice * multiplier).toFixed(2);
                document.getElementById('modalFoodPrice').textContent = `৳${newPrice}`;
            }
            
            // Update total
            updateTotalPrice();
        }
    });
    
    // Quantity controls
    document.getElementById('increaseQty').addEventListener('click', function() {
        const input = document.getElementById('quantityInput');
        input.value = parseInt(input.value) + 1;
        updateTotalPrice();
    });
    
    document.getElementById('decreaseQty').addEventListener('click', function() {
        const input = document.getElementById('quantityInput');
        if (parseInt(input.value) > 1) {
            input.value = parseInt(input.value) - 1;
            updateTotalPrice();
        }
    });
    
    // Manual quantity input change
    document.getElementById('quantityInput').addEventListener('input', function() {
        let value = parseInt(this.value);
        
        // Validate input
        if (isNaN(value) || value < 1) {
            this.value = 1;
        } else {
            this.value = value;
        }
        
        updateTotalPrice();
    });
    
    // Prevent invalid characters in quantity input
    document.getElementById('quantityInput').addEventListener('keypress', function(e) {
        // Only allow numbers
        if (e.key && !/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });
    
    // Confirm Add to Cart button
    document.getElementById('confirmAddToCart').addEventListener('click', function() {
        if (!currentFoodItem) return;
        
        const quantity = parseInt(document.getElementById('quantityInput').value);
        let price = parseFloat(currentFoodItem.price);
        let itemName = currentFoodItem.name;
        let itemDescription = currentFoodItem.description || '';
        
        // Check if pizza and get size information
        const isPizza = currentFoodItem.category && currentFoodItem.category.toLowerCase().includes('pizza');
        if (isPizza) {
            const activeSize = document.querySelector('.size-btn.active');
            if (activeSize) {
                const sizeInch = activeSize.dataset.size;
                const multiplier = parseFloat(activeSize.dataset.multiplier);
                const sizeDesc = activeSize.querySelector('.size-desc').textContent;
                
                // Adjust price based on size
                price = price * multiplier;
                
                // Add size to item name
                itemName = `${currentFoodItem.name} (${sizeInch}" - ${sizeDesc})`;
                
                // Clean description - remove any size references
                itemDescription = itemDescription.replace(/\b\d+\s*inch(es)?\b/gi, '');
                itemDescription = itemDescription.replace(/\b\d+\s*"/gi, '');
                itemDescription = itemDescription.replace(/\b(small|medium|large|regular)\s*(size)?\b/gi, '');
                itemDescription = itemDescription.trim();
                
                // If description is too short or empty after cleanup, use a generic one
                if (!itemDescription || itemDescription.length < 10) {
                    itemDescription = `Delicious ${sizeDesc.toLowerCase()} pizza prepared with fresh ingredients.`;
                }
            }
        }
        
        // Create modified food item with adjusted price, name, and description
        const modifiedFoodItem = {
            ...currentFoodItem,
            name: itemName,
            price: price,
            description: itemDescription
        };
        
        // Add to cart
        addToCart(modifiedFoodItem, quantity);
        
        // Show success message
        alert(`Added ${quantity} × ${itemName} to cart!`);
        
        closeAddToCartModal();
    });
    
    // Checkout button
    document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);
    
    // Initialize cart display and badge
    updateCartDisplay();
    updateRestaurantCartBadge();
});