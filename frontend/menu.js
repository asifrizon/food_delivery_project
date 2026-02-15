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
            allFoodItems = response.data.food_items;
            
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
    restaurantImage.src = selectedRestaurant.image_url;

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
            // Use default image if image_url is missing or empty
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
        image: foodItem.image_url
    };
    
    OrderManager.addToOrder({
        restaurantId: selectedRestaurant.restaurant_id,
        name: selectedRestaurant.name,
        image_url: selectedRestaurant.image_url,
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
    const imageUrl = foodItem.image_url || 'image/food_placeholder.png';
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
        
        const imageUrl = selectedRestaurant.image_url || 'image/food_2.png';
        
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

function handleCheckout() {
    const order = getCurrentOrder();
    
    if (!order || order.items.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Create order summary
    let orderSummary = `Order from ${selectedRestaurant.name}\n\n`;
    orderSummary += 'Items:\n';
    order.items.forEach(item => {
        orderSummary += `- ${item.name} x${item.quantity} = ৳${(parseFloat(item.price) * item.quantity).toFixed(2)}\n`;
    });
    orderSummary += `\nSubtotal: ৳${order.subtotal.toFixed(2)}\n`;
    orderSummary += `Delivery Fee: ৳${order.deliveryFee.toFixed(2)}\n`;
    orderSummary += `VAT (${OrderManager.VAT_PERCENTAGE}%): ৳${order.vat.toFixed(2)}\n`;
    orderSummary += `\nTotal: ৳${order.total.toFixed(2)}`;
    
    // Close the restaurant cart modal
    closeRestaurantCartModal();
    
    alert(orderSummary + '\n\nProceeding to checkout...');
    
    // Here you would typically redirect to a checkout page
    // For API integration, use:
    // const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // if (currentUser && currentUser.addressId) {
    //     OrderManager.submitOrder(restaurantId, currentUser.addressId, currentUser.userId)
    //         .then(result => {
    //             alert('Order placed successfully!');
    //             window.location.href = 'order-confirmation.html';
    //         })
    //         .catch(error => {
    //             alert('Failed to place order. Please try again.');
    //         });
    // }
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