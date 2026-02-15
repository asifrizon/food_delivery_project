const express = require("express");
const router = express.Router();
const db = require("../db");
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        r.restaurant_id,
        r.address_id,
        r.name,
        r.rating,
        a.police_station,
        (SELECT image_url FROM restaurant_image 
         WHERE restaurant_id = r.restaurant_id LIMIT 1) as image_url,
        (SELECT offer_type FROM offer 
         WHERE restaurant_id = r.restaurant_id 
         ORDER BY offer_value DESC LIMIT 1) as offer_type,
        (SELECT offer_value FROM offer 
         WHERE restaurant_id = r.restaurant_id 
         ORDER BY offer_value DESC LIMIT 1) as offer_value
      FROM restaurant r
      LEFT JOIN address a ON r.address_id = a.address_id
      ORDER BY r.rating DESC
    `);

    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});
// GET food items and offers for a specific restaurant
router.get("/:restaurant_id/menu", async (req, res) => {
  try {
    const restaurantId = req.params.restaurant_id;

    // Get all food items for this restaurant
    const [foodItems] = await db.query(`
  SELECT 
    fi.food_id,
    fi.restaurant_id,
    fi.name,
    fi.price,
    fi.description,
    fi.availability,
    fi.category,
    (SELECT image_url FROM food_image 
     WHERE food_id = fi.food_id LIMIT 1) as image_url
  FROM food_item fi
  WHERE fi.restaurant_id = ?
  ORDER BY fi.category, fi.name
`, [restaurantId]);

    // Get all active offers for this restaurant
    const [offers] = await db.query(`
      SELECT 
        offer_id,
        restaurant_id,
        offer_type,
        offer_value,
        start_time,
        end_time,
        min_order_amount,
        max_discount
      FROM offer
      WHERE restaurant_id = ?
        AND food_id IS NULL
        AND NOW() BETWEEN start_time AND end_time
      ORDER BY offer_value DESC
    `, [restaurantId]);

    res.json({
      success: true,
      data: {
        food_items: foodItems,
        offers: offers
      }
    });

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

module.exports = router;
