const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
//updated cors code
const app = express();
app.use(express.json());
app.use(cors());

const requests = []; // Temporary in-memory storage

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Live Music Request API");
});

// Fetch all requests
app.get("/requests", (req, res) => {
  res.json(requests);
});

// Add a new request
app.post("/requests", (req, res) => {
  const { name, request } = req.body;
  if (!request) return res.status(400).json({ error: "Request is required" });

  const newRequest = { _id: Date.now().toString(), name, request };
  requests.push(newRequest);
  res.status(201).json(newRequest);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Middleware
const allowedOrigins = ["https://live-request-test.netlify.app",
  "http://127.0.0.1:5500",// Local frontend for testing
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));
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
app.get("/", (req, res) => {
  res.send("Welcome to the Live Music Request API");
});

app.get("/requests", async (req, res) => {
  try {
    const requests = await Request.find();
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
