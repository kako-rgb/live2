const API_URL = "https://live2-1.onrender.com/requests"; // Replace with your deployed backend URL

document.getElementById("liveRequestBtn").addEventListener("click", () => {
  document.getElementById("liveRequestBtn").classList.add("hidden");
  document.getElementById("requestBox").classList.remove("hidden");
});

const requestForm = document.getElementById("requestForm");
const requestsDisplay = document.getElementById("requestsDisplay");
const duplicateMessage = document.getElementById("duplicateMessage");
// update welcome
app.get("/", (req, res) => {
  res.send("Welcome to the Live Music Request API");
});

// Fetch and display existing requests
async function fetchRequests() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch requests");
    const requests = await response.json();

    requestsDisplay.innerHTML = ""; // Clear current display
    requests.forEach(({ _id, name, request }) => {
      const requestItem = document.createElement("div");
      requestItem.className = "request-item";
      requestItem.innerHTML = `
        <span>${_id.substring(0, 5)}. ${name || "User"}</span>
        ${request}
      `;
      requestsDisplay.appendChild(requestItem);
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
  }
}

fetchRequests(); // Load requests on page load

requestForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const musicRequest = document.getElementById("musicRequest").value.trim();
  const userName = document.getElementById("userName").value.trim() || "User";

  try {
    // Check for duplicates
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch requests");
    const requests = await response.json();
    const duplicate = requests.some((req) => req.request.toLowerCase() === musicRequest.toLowerCase());

    if (duplicate) {
      duplicateMessage.classList.remove("hidden");
      setTimeout(() => duplicateMessage.classList.add("hidden"), 3000); // Hide after 3 seconds
      return;
    }

    // Post new request
    const newRequest = { name: userName, request: musicRequest };
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRequest),
    });

    document.getElementById("musicRequest").value = "";
    document.getElementById("userName").value = "";

    fetchRequests(); // Refresh display
  } catch (error) {
    console.error("Error posting request:", error);
  }
});
