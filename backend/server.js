const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: "https://live-request-test.netlify.app" })); // Allow frontend
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schema and Model
const requestSchema = new mongoose.Schema({
  name: { type: String, default: "User" },
  request: { type: String, required: true },
});

const Request = mongoose.model("Request", requestSchema);

// Routes
app.get("/requests", async (req, res) => {
  try {
    const requests = await Request.find().sort({ _id: -1 }); // Fetch latest requests first
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Error fetching requests" });
  }
});

app.post("/requests", async (req, res) => {
  const { name, request } = req.body;
  try {
    const newRequest = new Request({ name, request });
    await newRequest.save();
    res.status(201).json({ message: "Request added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding request" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
