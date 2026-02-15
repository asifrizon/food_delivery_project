/**
 * Order Manager Module
 * Handles all order-related operations across the application
 */

const OrderManager = {
    // Constants
    STORAGE_KEY: 'gorom_orders',
    VAT_PERCENTAGE: 5,
    DELIVERY_FEE: 50.00,

    /**
     * Get all pending orders from localStorage
     */
    getOrders() {
        try {
            const orders = localStorage.getItem(this.STORAGE_KEY);
            return orders ? JSON.parse(orders) : [];
        } catch (error) {
            console.error('Error getting orders:', error);
            return [];
        }
    },

    /**
     * Save orders to localStorage
     */
    saveOrders(orders) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
            this.updateCartBadge();
        } catch (error) {
            console.error('Error saving orders:', error);
        }
    },

    /**
     * Get order by restaurant ID
     */
    getOrderByRestaurant(restaurantId) {
        const orders = this.getOrders();
        return orders.find(order => order.restaurantId === restaurantId);
    },

    /**
     * Add items to order for a specific restaurant
     */
    addToOrder(restaurantData, items) {
        const orders = this.getOrders();
        let order = orders.find(o => o.restaurantId === restaurantData.restaurantId);

        if (order) {
            // Order exists, add/update items
            items.forEach(newItem => {
                const existingItem = order.items.find(i => i.foodId === newItem.foodId);
                if (existingItem) {
                    existingItem.quantity += newItem.quantity;
                } else {
                    order.items.push(newItem);
                }
            });
        } else {
            // Create new order
            order = {
                orderId: this.generateOrderId(),
                restaurantId: restaurantData.restaurantId,
                restaurantName: restaurantData.name,
                restaurantImage: restaurantData.image_url,
                restaurantAddress: restaurantData.address || restaurantData.police_station,
                items: items,
                status: 'pending',
                createdAt: new Date().toISOString()
            };
            orders.push(order);
        }

        // Calculate totals
        this.calculateOrderTotals(order);
        this.saveOrders(orders);
        
        return order;
    },

    /**
     * Update item quantity in an order
     */
    updateItemQuantity(restaurantId, foodId, newQuantity) {
        const orders = this.getOrders();
        const order = orders.find(o => o.restaurantId === restaurantId);

        if (order) {
            const item = order.items.find(i => i.foodId === foodId);
            if (item) {
                if (newQuantity <= 0) {
                    // Remove item
                    order.items = order.items.filter(i => i.foodId !== foodId);
                    
                    // If no items left, remove order
                    if (order.items.length === 0) {
                        const orderIndex = orders.findIndex(o => o.restaurantId === restaurantId);
                        orders.splice(orderIndex, 1);
                    } else {
                        this.calculateOrderTotals(order);
                    }
                } else {
                    item.quantity = newQuantity;
                    this.calculateOrderTotals(order);
                }
            }
            this.saveOrders(orders);
        }
    },

    /**
     * Remove item from order
     */
    removeItem(restaurantId, foodId) {
        this.updateItemQuantity(restaurantId, foodId, 0);
    },

    /**
     * Remove entire order
     */
    removeOrder(restaurantId) {
        let orders = this.getOrders();
        orders = orders.filter(o => o.restaurantId !== restaurantId);
        this.saveOrders(orders);
    },

    /**
     * Calculate order totals
     */
    calculateOrderTotals(order) {
        const subtotal = order.items.reduce((sum, item) => {
            return sum + (parseFloat(item.price) * item.quantity);
        }, 0);

        const vat = (subtotal * this.VAT_PERCENTAGE) / 100;
        const total = subtotal + this.DELIVERY_FEE + vat;

        order.subtotal = parseFloat(subtotal.toFixed(2));
        order.vat = parseFloat(vat.toFixed(2));
        order.deliveryFee = this.DELIVERY_FEE;
        order.total = parseFloat(total.toFixed(2));

        return order;
    },

    /**
     * Get total number of orders (distinct restaurants)
     */
    getOrderCount() {
        return this.getOrders().length;
    },

    /**
     * Get total number of items across all orders
     */
    getTotalItemCount() {
        const orders = this.getOrders();
        return orders.reduce((total, order) => {
            return total + order.items.reduce((sum, item) => sum + item.quantity, 0);
        }, 0);
    },

    /**
     * Update cart badge on all pages
     */
    updateCartBadge() {
        const count = this.getOrderCount();
        const badges = document.querySelectorAll('.cart-badge');
        
        badges.forEach(badge => {
            if (count > 0) {
                badge.textContent = count;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        });
    },

    /**
     * Generate unique order ID (for frontend tracking)
     */
    generateOrderId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `ORD_${timestamp}_${random}`;
    },

    /**
     * Clear all orders
     */
    clearAllOrders() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.updateCartBadge();
    },

    /**
     * Prepare order data for API submission
     */
    prepareOrderForAPI(restaurantId, addressId, userId) {
        const order = this.getOrderByRestaurant(restaurantId);
        if (!order) return null;

        return {
            customer_id: userId,
            restaurant_id: restaurantId,
            address_id: addressId,
            status: 'pending',
            subtotal_amount: order.subtotal,
            vat_amount: order.vat,
            delivery_fee: order.deliveryFee,
            platform_fee: 0, // Set if applicable
            total_amount: order.total,
            platform_offer_id: null, // Set if applicable
            items: order.items.map(item => ({
                food_id: item.foodId,
                quantity: item.quantity,
                price: item.price
            }))
        };
    },

    /**
     * Submit order to backend API
     */
    async submitOrder(restaurantId, addressId, userId) {
        const orderData = this.prepareOrderForAPI(restaurantId, addressId, userId);
        if (!orderData) {
            throw new Error('No order found for this restaurant');
        }

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error('Failed to submit order');
            }

            const result = await response.json();
            
            // If successful, remove from localStorage
            if (result.success) {
                this.removeOrder(restaurantId);
            }

            return result;
        } catch (error) {
            console.error('Error submitting order:', error);
            throw error;
        }
    },

    /**
     * Fetch order history from API
     */
    async fetchOrderHistory(userId) {
        try {
            const response = await fetch(`/api/orders/user/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch order history');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching order history:', error);
            throw error;
        }
    },

    /**
     * Initialize cart badges on page load
     */
    init() {
        this.updateCartBadge();
        
        // Listen for storage changes (for multi-tab sync)
        window.addEventListener('storage', (e) => {
            if (e.key === this.STORAGE_KEY) {
                this.updateCartBadge();
            }
        });
    }
};

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => OrderManager.init());
} else {
    OrderManager.init();
}
