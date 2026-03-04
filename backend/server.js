const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

const restaurantRoutes = require('./routes/restaurant');
app.use('/api/restaurants', restaurantRoutes);

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});