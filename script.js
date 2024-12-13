const API_URL = "https://nodayz.onrender.com/requests"; // Replace with your deployed backend URL

// DOM Elements
const liveRequestBtn = document.getElementById("liveRequestBtn");
const requestBox = document.getElementById("requestBox");
const requestForm = document.getElementById("requestForm");
const requestsDisplay = document.getElementById("requestsDisplay");
const duplicateMessage = document.getElementById("duplicateMessage");

// Show request form when button is clicked
liveRequestBtn.addEventListener("click", () => {
  liveRequestBtn.classList.add("hidden");
  requestBox.classList.remove("hidden");
});

// Fetch and display existing requests
async function fetchRequests() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch requests");
    }

    const requests = await response.json();

    // Clear and populate the request display
    requestsDisplay.innerHTML = "";
    requests.forEach(({ _id, name, request }) => {
      const requestItem = document.createElement("div");
      requestItem.className = "request-item";
      requestItem.innerHTML = `
        <strong>${name || "User"}:</strong> ${request}
      `;
      requestsDisplay.appendChild(requestItem);
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
  }
}

// Load requests on page load
fetchRequests();

// Handle form submission
requestForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const musicRequest = document.getElementById("musicRequest").value.trim();
  const userName = document.getElementById("userName").value.trim() || "User";

  if (!musicRequest) {
    alert("Please enter a music request!");
    return;
  }

  try {
    // Check for duplicates
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch requests");
    }

    const requests = await response.json();
    const duplicate = requests.some(
      (req) => req.request.toLowerCase() === musicRequest.toLowerCase()
    );

    if (duplicate) {
      duplicateMessage.classList.remove("hidden");
      setTimeout(() => duplicateMessage.classList.add("hidden"), 3000); // Hide after 3 seconds
      return;
    }

    // Post new request
    const newRequest = { name: userName, request: musicRequest };
    const postResponse = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRequest),
    });

    if (!postResponse.ok) {
      throw new Error("Failed to post new request");
    }

    // Clear form fields
    document.getElementById("musicRequest").value = "";
    document.getElementById("userName").value = "";

    // Refresh the display with the updated list of requests
    fetchRequests();
  } catch (error) {
    console.error("Error posting request:", error);
  }
});
