// Create stars background
function createStars() {
  const starsContainer = document.getElementById("stars-container");
  const starCount = 100;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    // Random position
    const left = Math.random() * 100;
    const top = Math.random() * 100;

    // Random size
    const size = Math.random() * 3;

    // Random animation delay
    const delay = Math.random() * 5;

    star.style.left = `${left}%`;
    star.style.top = `${top}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDelay = `${delay}s`;

    starsContainer.appendChild(star);
  }
}

// Check if user is logged in
function checkUserLogin() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  return currentUser;
}

// Get user's bookings from localStorage
function getUserBookings(userId) {
  try {
    const allBookings = JSON.parse(
      localStorage.getItem("spaceBookings") || "[]"
    );
    console.log("All bookings from localStorage:", allBookings);
    console.log("Looking for user ID:", userId);

    const userBookings = allBookings.filter((booking) => {
      console.log("Checking booking:", booking.userId, "vs", userId);
      return booking.userId === userId;
    });

    console.log("Found user bookings:", userBookings);
    return userBookings;
  } catch (error) {
    console.error("Error getting user bookings:", error);
    return [];
  }
}

// Format date for display
function formatDate(dateString) {
  try {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch (error) {
    return "Invalid date";
  }
}

// Format currency
function formatCurrency(amount) {
  if (typeof amount !== "number") {
    amount = parseFloat(amount) || 0;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// Display bookings
function displayBookings(bookings) {
  const container = document.getElementById("bookings-container");

  if (bookings.length === 0) {
    container.innerHTML = `
        <div class="empty-state max-w-2xl mx-auto p-8 text-center">
          <div class="w-20 h-20 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center mx-auto mb-6 glow">
            <i class="fas fa-rocket text-white text-2xl"></i>
          </div>
          <h2 class="font-orbitron text-2xl mb-4 text-glow">No Bookings Yet</h2>
          <p class="text-gray-300 mb-6">You haven't booked any space voyages yet. Start your journey to the stars!</p>
          <a href="booking.html" class="btn-primary text-white px-8 py-3 rounded-lg font-bold text-lg inline-block glow">
            Book Your Journey
          </a>
        </div>
      `;
    return;
  }

  // Sort bookings by booking date (newest first)
  bookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));

  let html = `
      <div class="max-w-4xl mx-auto">
        <h2 class="font-orbitron text-2xl mb-6">Your Space Voyages</h2>
        <div class="space-y-6">
    `;

  bookings.forEach((booking, index) => {
    const statusClass =
      booking.status === "confirmed"
        ? "status-confirmed"
        : booking.status === "pending"
        ? "status-pending"
        : "status-cancelled";

    const statusText =
      booking.status === "confirmed"
        ? "Confirmed"
        : booking.status === "pending"
        ? "Pending"
        : "Cancelled";

    html += `
        <div class="booking-card p-6">
          <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
            <div>
              <h3 class="font-orbitron text-xl text-neon-blue mb-2">${
                booking.destination.name
              }</h3>
              <p class="text-gray-300">Departure: ${formatDate(
                booking.departureDate
              )}</p>
              <p class="text-gray-400 text-sm">Booking ID: ${
                booking.bookingId
              }</p>
            </div>
            <div class="mt-2 md:mt-0 flex flex-col items-end">
              <span class="status-badge ${statusClass}">${statusText}</span>
              <p class="text-gray-400 text-sm mt-1">Booked on: ${formatDate(
                booking.bookingDate
              )}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p class="text-gray-400">Travel Duration</p>
              <p class="font-semibold">${booking.destination.travelDuration}</p>
            </div>
            <div>
              <p class="text-gray-400">Accommodation</p>
              <p class="font-semibold">${booking.accommodation.name}</p>
            </div>
            <div>
              <p class="text-gray-400">Passengers</p>
              <p class="font-semibold">${booking.passengers.length}</p>
            </div>
            <div>
              <p class="text-gray-400">Total Price</p>
              <p class="font-semibold text-neon-cyan">${formatCurrency(
                booking.totalPrice
              )} USD</p>
            </div>
          </div>
          
          <div class="border-t border-neon-blue/20 pt-4">
            <h4 class="font-orbitron text-neon-blue mb-2">Passengers</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              ${booking.passengers
                .map(
                  (passenger) => `
                <div class="text-sm">
                  <p class="font-semibold">${passenger.firstName} ${passenger.lastName}</p>
                  <p class="text-gray-400">${passenger.email}</p>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
          
          <div class="flex justify-end mt-4 space-x-3">
            <button class="btn-secondary px-4 py-2 rounded-lg text-sm" onclick="viewBookingDetails('${
              booking.bookingId
            }')">
              View Details
            </button>
            ${
              booking.status !== "cancelled"
                ? `
              <button class="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm hover:bg-red-500/30 transition-colors" onclick="cancelBooking('${booking.bookingId}')">
                Cancel
              </button>
            `
                : ""
            }
          </div>
        </div>
      `;
  });

  html += `
        </div>
      </div>
    `;

  container.innerHTML = html;
}

// View booking details
function viewBookingDetails(bookingId) {
  const user = checkUserLogin();
  if (!user) return;

  const bookings = getUserBookings(user.id);
  const booking = bookings.find((b) => b.bookingId === bookingId);

  if (!booking) {
    alert("Booking not found!");
    return;
  }

  // Create modal for booking details
  const modal = document.createElement("div");
  modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(10, 10, 24, 0.8);
      backdrop-filter: blur(5px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    `;

  modal.innerHTML = `
      <div class="booking-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="font-orbitron text-2xl text-neon-blue">Booking Details</h2>
          <button id="close-modal" class="text-gray-400 hover:text-white text-xl">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="space-y-6">
          <div>
            <h3 class="font-orbitron text-xl mb-2">Journey Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-gray-400">Destination</p>
                <p class="font-semibold">${booking.destination.name}</p>
              </div>
              <div>
                <p class="text-gray-400">Departure Date</p>
                <p class="font-semibold">${formatDate(
                  booking.departureDate
                )}</p>
              </div>
              <div>
                <p class="text-gray-400">Travel Duration</p>
                <p class="font-semibold">${
                  booking.destination.travelDuration
                }</p>
              </div>
              <div>
                <p class="text-gray-400">Distance</p>
                <p class="font-semibold">${booking.destination.distance}</p>
              </div>
              <div>
                <p class="text-gray-400">Gravity</p>
                <p class="font-semibold">${booking.destination.gravity}</p>
              </div>
              <div>
                <p class="text-gray-400">Temperature</p>
                <p class="font-semibold">${booking.destination.temperature}</p>
              </div>
              <div>
                <p class="text-gray-400">Accommodation</p>
                <p class="font-semibold">${booking.accommodation.name}</p>
              </div>
              <div>
                <p class="text-gray-400">Accommodation Size</p>
                <p class="font-semibold">${booking.accommodation.size}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="font-orbitron text-xl mb-2">Passenger Details</h3>
            <div class="space-y-4">
              ${booking.passengers
                .map(
                  (passenger, index) => `
                <div class="bg-space-dark/50 p-4 rounded-lg">
                  <h4 class="font-semibold mb-2">Passenger ${index + 1}: ${
                    passenger.firstName
                  } ${passenger.lastName}</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <p class="text-gray-400">Email</p>
                      <p>${passenger.email}</p>
                    </div>
                    <div>
                      <p class="text-gray-400">Phone</p>
                      <p>${passenger.phone}</p>
                    </div>
                    ${
                      passenger.specialRequirements
                        ? `
                      <div class="md:col-span-2">
                        <p class="text-gray-400">Special Requirements</p>
                        <p>${passenger.specialRequirements}</p>
                      </div>
                    `
                        : ""
                    }
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
          
          <div>
            <h3 class="font-orbitron text-xl mb-2">Payment Summary</h3>
            <div class="bg-space-dark/50 p-4 rounded-lg">
              <div class="flex justify-between mb-2">
                <p class="text-gray-400">Destination Fee</p>
                <p>${formatCurrency(booking.destination.price)}</p>
              </div>
              <div class="flex justify-between mb-2">
                <p class="text-gray-400">Accommodation (${
                  booking.accommodation.name
                })</p>
                <p>${formatCurrency(booking.accommodation.pricePerDay)}/day</p>
              </div>
              <div class="flex justify-between mb-2">
                <p class="text-gray-400">Number of Passengers</p>
                <p>${booking.passengers.length}</p>
              </div>
              <div class="border-t border-neon-blue/20 pt-2 mt-2">
                <div class="flex justify-between font-bold">
                  <p>Total</p>
                  <p class="text-neon-cyan">${formatCurrency(
                    booking.totalPrice
                  )}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="font-orbitron text-xl mb-2">Booking Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-400">Booking ID</p>
                <p class="font-mono">${booking.bookingId}</p>
              </div>
              <div>
                <p class="text-gray-400">Booking Date</p>
                <p>${formatDate(booking.bookingDate)}</p>
              </div>
              <div>
                <p class="text-gray-400">Status</p>
                <p class="font-semibold ${
                  booking.status === "confirmed"
                    ? "text-green-400"
                    : booking.status === "pending"
                    ? "text-yellow-400"
                    : "text-red-400"
                }">
                  ${
                    booking.status.charAt(0).toUpperCase() +
                    booking.status.slice(1)
                  }
                </p>
              </div>
              <div>
                <p class="text-gray-400">Passenger Type</p>
                <p>${booking.passengerType}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end mt-6">
          <button class="btn-secondary px-6 py-2 rounded-lg" id="close-details">
            Close
          </button>
        </div>
      </div>
    `;

  document.body.appendChild(modal);

  // Close modal events
  document.getElementById("close-modal").addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  document.getElementById("close-details").addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

// Cancel booking
function cancelBooking(bookingId) {
  const user = checkUserLogin();
  if (!user) return;

  // Create confirmation modal
  const modal = document.createElement("div");
  modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(10, 10, 24, 0.8);
      backdrop-filter: blur(5px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    `;

  modal.innerHTML = `
      <div class="booking-card max-w-md w-full text-center p-6">
        <div class="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center mx-auto mb-4 glow">
          <i class="fas fa-exclamation-triangle text-white text-xl"></i>
        </div>
        <h2 class="font-orbitron text-2xl mb-4 text-glow">Cancel Booking</h2>
        <p class="text-gray-300 mb-6">Are you sure you want to cancel this space voyage? This action cannot be undone.</p>
        <div class="flex space-x-4">
          <button id="cancel-action" class="flex-1 py-3 rounded-lg border border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10 transition-all duration-300 font-bold">
            Keep Booking
          </button>
          <button id="confirm-cancel" class="flex-1 py-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 transition-all duration-300 font-bold glow">
            Cancel Voyage
          </button>
        </div>
      </div>
    `;

  document.body.appendChild(modal);

  // Event listeners for modal buttons
  document.getElementById("cancel-action").addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  document.getElementById("confirm-cancel").addEventListener("click", () => {
    // Get all bookings
    const allBookings = JSON.parse(
      localStorage.getItem("spaceBookings") || "[]"
    );

    // Find the booking and update its status
    const bookingIndex = allBookings.findIndex(
      (b) => b.bookingId === bookingId
    );

    if (bookingIndex !== -1) {
      // Update status to cancelled
      allBookings[bookingIndex].status = "cancelled";

      // Save back to localStorage
      localStorage.setItem("spaceBookings", JSON.stringify(allBookings));

      // Refresh the display
      initPage();

      // Show success message
      alert("Booking cancelled successfully!");
    } else {
      alert("Booking not found!");
    }

    document.body.removeChild(modal);
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

// Initialize the page
function initPage() {
  createStars();

  const user = checkUserLogin();
  const container = document.getElementById("bookings-container");

  if (!user) {
    container.innerHTML = `
        <div class="empty-state max-w-2xl mx-auto p-8 text-center">
          <div class="w-20 h-20 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center mx-auto mb-6 glow">
            <i class="fas fa-user-astronaut text-white text-2xl"></i>
          </div>
          <h2 class="font-orbitron text-2xl mb-4 text-glow">Authentication Required</h2>
          <p class="text-gray-300 mb-6">Please log in to view your space voyage bookings.</p>
          <a href="login.html" class="btn-primary text-white px-8 py-3 rounded-lg font-bold text-lg inline-block glow">
            Log In
          </a>
        </div>
      `;
    return;
  }

  const userBookings = getUserBookings(user.id);
  displayBookings(userBookings);
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", initPage);
