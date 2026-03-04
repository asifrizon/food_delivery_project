/**
 * AddressManager Module
 * Handles one-to-many address operations for users
 * Addresses are stored per user_id via the backend API
 */

const AddressManager = {
    API_BASE: 'http://localhost:3000/api',
    CACHE_KEY: 'gorom_user_addresses',

    /**
     * Fetch all addresses for a user from the API
     */
    async fetchAddresses(userId) {
        try {
            const response = await fetch(`${this.API_BASE}/addresses?user_id=${userId}`);
            if (!response.ok) throw new Error('Failed to fetch addresses');
            const result = await response.json();
            const addresses = result.data || result || [];
            // Cache locally
            localStorage.setItem(this.CACHE_KEY, JSON.stringify(addresses));
            return addresses;
        } catch (error) {
            console.error('AddressManager.fetchAddresses error:', error);
            // Fall back to cache
            return this.getCachedAddresses();
        }
    },

    /**
     * Get addresses from local cache
     */
    getCachedAddresses() {
        try {
            const cached = localStorage.getItem(this.CACHE_KEY);
            return cached ? JSON.parse(cached) : [];
        } catch {
            return [];
        }
    },

    /**
     * Add a new address for a user via API
     */
    async addAddress(userId, addressData) {
        try {
            const response = await fetch(`${this.API_BASE}/addresses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, ...addressData })
            });
            if (!response.ok) throw new Error('Failed to add address');
            const result = await response.json();
            // Refresh cache
            await this.fetchAddresses(userId);
            return result.data || result;
        } catch (error) {
            console.error('AddressManager.addAddress error:', error);
            throw error;
        }
    },

    /**
     * Update an existing address
     */
    async updateAddress(addressId, addressData) {
        try {
            const response = await fetch(`${this.API_BASE}/addresses/${addressId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addressData)
            });
            if (!response.ok) throw new Error('Failed to update address');
            const result = await response.json();
            return result.data || result;
        } catch (error) {
            console.error('AddressManager.updateAddress error:', error);
            throw error;
        }
    },

    /**
     * Delete an address
     */
    async deleteAddress(addressId, userId) {
        try {
            const response = await fetch(`${this.API_BASE}/addresses/${addressId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete address');
            // Refresh cache
            await this.fetchAddresses(userId);
            return true;
        } catch (error) {
            console.error('AddressManager.deleteAddress error:', error);
            throw error;
        }
    },

    /**
     * Get the currently selected delivery address from sessionStorage
     */
    getSelectedAddress() {
        try {
            const addr = sessionStorage.getItem('selectedDeliveryAddress');
            return addr ? JSON.parse(addr) : null;
        } catch {
            return null;
        }
    },

    /**
     * Set the selected delivery address in sessionStorage
     */
    setSelectedAddress(address) {
        sessionStorage.setItem('selectedDeliveryAddress', JSON.stringify(address));
    },

    /**
     * Format an address object into a readable string
     */
    formatAddress(address) {
        if (!address) return '';
        const parts = [
            address.address_details || address.addressDetails,
            address.thana,
            address.city
        ].filter(Boolean);
        return parts.join(', ');
    },

    /**
     * Clear cached addresses (on logout)
     */
    clearCache() {
        localStorage.removeItem(this.CACHE_KEY);
        sessionStorage.removeItem('selectedDeliveryAddress');
    }
};
