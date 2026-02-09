require("dotenv").config();
const express = require("express");
const app = express();

app.use("/api/restaurants", require("./routes/restaurant"));


// test route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

// shang high
// golden pizza
// dominos pizza
// chillox banani
// pizza dine
// hakka dhaka
// kacchi dine gulshan
// almajis arabian restaurant
