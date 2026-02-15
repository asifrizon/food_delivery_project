const express = require('express');
const cors = require('cors'); // Add this

const app = express();

// Add CORS BEFORE routes
app.use(cors()); // Add this line

app.use(express.json());

// Your routes
const restaurantRoutes = require('./routes/restaurant');
app.use('/api/restaurants', restaurantRoutes);

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});