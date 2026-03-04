/**
 * ImageHelper
 * Resolves the correct display image from a list of image objects
 * using the is_primary flag (Y = show, N = skip).
 *
 * The backend may return images in two shapes:
 *   A) Embedded array on the object:
 *      restaurant.images = [ { image_url, is_primary }, ... ]
 *      food_item.images  = [ { image_url, is_primary }, ... ]
 *
 *   B) Flat string (legacy / already-resolved):
 *      restaurant.image_url = "https://..."
 *
 * getPrimary() handles both transparently, so all existing
 * callers only need to change:
 *      item.image_url
 *  →   ImageHelper.getPrimary(item)
 */

const ImageHelper = {

    FALLBACK_RESTAURANT: 'image/food_2.png',
    FALLBACK_FOOD:       'image/food_11.png',

    /**
     * Returns the URL of the primary image for any object that
     * may have an `images` array with `is_primary` flags.
     *
     * @param {object} entity      - restaurant or food item object
     * @param {string} fallback    - URL to use when nothing resolves
     * @returns {string}           - image URL ready to drop into src=""
     */
    getPrimary(entity, fallback = this.FALLBACK_RESTAURANT) {
        if (!entity) return fallback;

        // Case A: images array present on the object
        if (Array.isArray(entity.images) && entity.images.length > 0) {
            // Find first entry with is_primary === 'Y'
            const primary = entity.images.find(img => img.is_primary === 'Y');
            if (primary && primary.image_url) return primary.image_url;

            // No primary flagged — fall back to first available image
            const first = entity.images.find(img => img.image_url);
            if (first) return first.image_url;
        }

        // Case B: flat image_url already on the object (legacy / pre-resolved)
        if (entity.image_url) return entity.image_url;

        return fallback;
    },

    /**
     * Convenience wrapper with the food-item fallback.
     */
    getFoodImage(foodItem) {
        return this.getPrimary(foodItem, this.FALLBACK_FOOD);
    },

    /**
     * Convenience wrapper with the restaurant fallback.
     */
    getRestaurantImage(restaurant) {
        return this.getPrimary(restaurant, this.FALLBACK_RESTAURANT);
    },

    /**
     * Normalise an API response so every entity has a resolved
     * `image_url` string, making it safe to pass to legacy code
     * that still reads `.image_url` directly.
     *
     * Use this right after fetching a list from the API:
     *   const items = ImageHelper.resolveAll(response.data.food_items, 'food');
     */
    resolveAll(entities, type = 'restaurant') {
        if (!Array.isArray(entities)) return entities;
        return entities.map(entity => ({
            ...entity,
            image_url: type === 'food'
                ? this.getFoodImage(entity)
                : this.getRestaurantImage(entity)
        }));
    }
};
