const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all restaurants
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT restaurant_id, name, rating
      FROM restaurant
    `);

    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
