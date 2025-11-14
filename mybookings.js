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

// Calculate travel duration in days based on different time formats
function calculateTravelDays(travelDurationText) {
  const travelDuration = travelDurationText.toLowerCase();
  let travelDays = 0;

  // Handle different time formats
  if (travelDuration.includes("-")) {
    // Handle ranges like "5-6 years"
    const rangeMatch = travelDuration.match(
      /(\d+)\s*-\s*(\d+)\s*(day|month|year|days|months|years)/
    );
    if (rangeMatch) {
      const minValue = parseInt(rangeMatch[1]);
      const maxValue = parseInt(rangeMatch[2]);
      const unit = rangeMatch[3];
      // Use the larger value from the range
      travelDays = convertToDays(maxValue, unit);
    }
  } else {
    // Handle single values like "3 days", "5 months", "2 years"
    const singleMatch = travelDuration.match(
      /(\d+)\s*(day|month|year|days|months|years)/
    );
    if (singleMatch) {
      const value = parseInt(singleMatch[1]);
      const unit = singleMatch[2];
      travelDays = convertToDays(value, unit);
    }
  }

  return travelDays;
}

// Helper function to convert different time units to days
function convertToDays(value, unit) {
  const normalizedUnit = unit.toLowerCase().replace(/s$/, ""); // Remove trailing 's'

  switch (normalizedUnit) {
    case "day":
      return value;
    case "month":
      return value * 30; // Approximate month as 30 days
    case "year":
      return value * 365; // Approximate year as 365 days
    default:
      return value; // Default to days if unknown unit
  }
}

// Recalculate total price for booking
function recalculateTotalPrice(booking) {
  const travelDays = calculateTravelDays(booking.destination.travelDuration);
  const passengerCount = booking.passengers.length;

  // Calculate total price: destination price + (travel days * 2 * accommodation price * passenger count)
  const destinationPrice = booking.destination.price || 0;
  const accommodationPrice = booking.accommodation.pricePerDay || 0;

  return (
    destinationPrice + travelDays * 2 * accommodationPrice * passengerCount
  );
}

// Form validation functions (same as booking page)
function validateName(name) {
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name.trim());
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

function validatePhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

function validateDate(date) {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
}

// Show error message in edit form
function showEditError(input, message) {
  const errorElement = input.parentNode.querySelector(".error-message");
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
  input.classList.add("input-error");
  input.classList.remove("input-success");
}

// Clear error message in edit form
function clearEditError(input) {
  const errorElement = input.parentNode.querySelector(".error-message");
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }
  input.classList.remove("input-error");
}

// Show success state in edit form
function showEditSuccess(input) {
  const errorElement = input.parentNode.querySelector(".error-message");
  if (errorElement) {
    errorElement.style.display = "none";
  }
  input.classList.remove("input-error");
  input.classList.add("input-success");
}

// Validate input in edit form
function validateEditInput(input) {
  const value = input.value.trim();
  const validationType = input.getAttribute("data-validation");

  if (value === "") {
    showEditError(input, "This field is required");
    return false;
  }

  let isValid = false;
  let errorMessage = "";

  switch (validationType) {
    case "name":
      isValid = validateName(value);
      errorMessage =
        "Please enter a valid name (2-50 characters, letters only)";
      break;
    case "email":
      isValid = validateEmail(value);
      errorMessage = "Please enter a valid email address";
      break;
    case "phone":
      isValid = validatePhone(value);
      errorMessage = "Please enter a valid phone number";
      break;
  }

  if (!isValid) {
    showEditError(input, errorMessage);
    return false;
  } else {
    showEditSuccess(input);
    return true;
  }
}

// Validate entire edit form
function validateEditForm(form) {
  let isValid = true;

  // Validate departure date
  const departureDate = form.querySelector('input[name="departureDate"]');
  if (departureDate.value === "") {
    showEditError(departureDate, "Please select a departure date");
    isValid = false;
  } else if (!validateDate(departureDate.value)) {
    showEditError(
      departureDate,
      "Departure date must be today or in the future"
    );
    isValid = false;
  } else {
    clearEditError(departureDate);
  }

  // Validate passenger forms
  const passengerForms = form.querySelectorAll(".passenger-form");
  passengerForms.forEach((passengerForm) => {
    const firstName = passengerForm.querySelector('input[name$="-firstName"]');
    const lastName = passengerForm.querySelector('input[name$="-lastName"]');
    const email = passengerForm.querySelector('input[name$="-email"]');
    const phone = passengerForm.querySelector('input[name$="-phone"]');

    if (!validateEditInput(firstName)) isValid = false;
    if (!validateEditInput(lastName)) isValid = false;
    if (!validateEditInput(email)) isValid = false;
    if (!validateEditInput(phone)) isValid = false;
  });

  return isValid;
}

// Show success notification
function showSuccessNotification(message) {
  const notification = document.createElement("div");
  notification.className =
    "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeIn";
  notification.innerHTML = `
    <div class="flex items-center">
      <i class="fas fa-check-circle mr-2"></i>
      <span>${message}</span>
    </div>
  `;

  // Add CSS animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out;
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.remove();
    document.head.removeChild(style);
  }, 3000);
}

// Show error notification
function showErrorNotification(message) {
  const notification = document.createElement("div");
  notification.className =
    "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeIn";
  notification.innerHTML = `
    <div class="flex items-center">
      <i class="fas fa-exclamation-circle mr-2"></i>
      <span>${message}</span>
    </div>
  `;

  // Add CSS animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out;
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.remove();
    document.head.removeChild(style);
  }, 3000);
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
            <button class="bg-blue-500/20 border border-blue-500/50 text-blue-400 px-4 py-2 rounded-lg text-sm hover:bg-blue-500/30 transition-colors" onclick="downloadBookingTicket('${
              booking.bookingId
            }')">
              Download Ticket
            </button>
            ${
              booking.status === "confirmed"
                ? `
              <button class="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-2 rounded-lg text-sm hover:bg-green-500/30 transition-colors" onclick="editBooking('${booking.bookingId}')">
                Edit
              </button>
            `
                : ""
            }
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
    showErrorNotification("Booking not found!");
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
        
        <div class="flex justify-end space-x-3 mt-6">
          <button class="bg-blue-500/20 border border-blue-500/50 text-blue-400 px-6 py-2 rounded-lg hover:bg-blue-500/30 transition-colors" onclick="downloadBookingTicket('${
            booking.bookingId
          }')">
            Download Ticket
          </button>
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

// Download booking ticket
function downloadBookingTicket(bookingId) {
  const user = checkUserLogin();
  if (!user) return;

  const bookings = getUserBookings(user.id);
  const booking = bookings.find((b) => b.bookingId === bookingId);

  if (!booking) {
    showErrorNotification("Booking not found!");
    return;
  }

  // Create a printable version of the ticket with the same theme
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>SpaceVoyager Booking Ticket - ${booking.bookingId}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');
        
        body {
          font-family: 'Exo 2', sans-serif;
          background: linear-gradient(to bottom, #0a0a18, #1a1a2e, #16213e);
          color: white;
          padding: 20px;
          margin: 0;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }
        
        body::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(
              circle at 10% 20%,
              rgba(14, 165, 233, 0.1) 0%,
              transparent 20%
            ),
            radial-gradient(
              circle at 90% 60%,
              rgba(139, 92, 246, 0.1) 0%,
              transparent 20%
            ),
            radial-gradient(
              circle at 40% 80%,
              rgba(6, 182, 212, 0.1) 0%,
              transparent 20%
            );
          z-index: -1;
        }
        
        .ticket-container {
          max-width: 800px;
          margin: 0 auto;
          background: rgba(22, 33, 62, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 30px;
          border: 2px solid rgba(14, 165, 233, 0.4);
          box-shadow: 0 0 40px rgba(14, 165, 233, 0.3);
          position: relative;
          z-index: 1;
        }
        
        .header {
          text-align: center;
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 3px solid rgba(14, 165, 233, 0.4);
        }
        
        .logo {
          font-family: 'Orbitron', sans-serif;
          font-size: 32px;
          font-weight: bold;
          background: linear-gradient(45deg, #0ea5e9, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
          text-shadow: 0 0 15px rgba(14, 165, 233, 0.6);
        }
        
        .title {
          color: #06b6d4;
          font-size: 28px;
          margin-bottom: 8px;
          font-family: 'Orbitron', sans-serif;
          text-shadow: 0 0 12px rgba(6, 182, 212, 0.6);
        }
        
        .subtitle {
          color: #9ca3af;
          font-size: 16px;
          margin-bottom: 15px;
        }
        
        .ticket-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 25px;
          padding: 20px;
          background: rgba(10, 10, 24, 0.6);
          border-radius: 10px;
          border: 1px solid rgba(14, 165, 233, 0.3);
        }
        
        .info-item {
          text-align: center;
        }
        
        .info-label {
          color: #9ca3af;
          font-size: 14px;
          margin-bottom: 5px;
        }
        
        .info-value {
          color: white;
          font-weight: bold;
          font-family: 'Orbitron', sans-serif;
          font-size: 16px;
        }
        
        .neon-cyan {
          color: #06b6d4;
          text-shadow: 0 0 10px rgba(6, 182, 212, 0.6);
        }
        
        .neon-blue {
          color: #0ea5e9;
          text-shadow: 0 0 10px rgba(14, 165, 233, 0.6);
        }
        
        .journey-section {
          background: rgba(10, 10, 24, 0.6);
          border-radius: 12px;
          border: 1px solid rgba(14, 165, 233, 0.3);
          padding: 25px;
          margin-bottom: 20px;
        }
        
        .section-title {
          color: #0ea5e9;
          font-size: 20px;
          margin-bottom: 15px;
          border-bottom: 2px solid #0ea5e9;
          padding-bottom: 8px;
          font-family: 'Orbitron', sans-serif;
          text-shadow: 0 0 10px rgba(14, 165, 233, 0.4);
        }
        
        .journey-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }
        
        .detail-item {
          margin-bottom: 12px;
        }
        
        .label {
          color: #9ca3af;
          font-size: 14px;
          margin-bottom: 5px;
        }
        
        .value {
          color: white;
          font-weight: bold;
          font-size: 16px;
        }
        
        .passenger-section {
          background: rgba(10, 10, 24, 0.6);
          border-radius: 12px;
          border: 1px solid rgba(14, 165, 233, 0.3);
          padding: 25px;
          margin-bottom: 20px;
        }
        
        .passenger-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        
        .passenger-item {
          background: rgba(14, 165, 233, 0.15);
          padding: 15px;
          border-radius: 8px;
          border: 1px solid rgba(14, 165, 233, 0.3);
          font-size: 14px;
        }
        
        .passenger-header {
          font-family: 'Orbitron', sans-serif;
          color: #06b6d4;
          margin-bottom: 8px;
          font-size: 16px;
        }
        
        .passenger-details {
          color: #e5e7eb;
          margin-bottom: 5px;
        }
        
        .passenger-contact {
          color: #9ca3af;
          font-size: 13px;
        }
        
        .total-section {
          text-align: center;
          margin: 25px 0;
          padding: 25px;
          background: rgba(10, 10, 24, 0.8);
          border-radius: 12px;
          border: 3px solid rgba(6, 182, 212, 0.5);
          box-shadow: 0 0 25px rgba(6, 182, 212, 0.4);
        }
        
        .total-price {
          font-size: 36px;
          color: #06b6d4;
          font-weight: bold;
          font-family: 'Orbitron', sans-serif;
          text-shadow: 0 0 20px rgba(6, 182, 212, 0.7);
          margin: 10px 0;
        }
        
        .total-label {
          color: #9ca3af;
          font-size: 18px;
          margin-bottom: 10px;
        }
        
        .barcode {
          text-align: center;
          margin: 20px 0;
          padding: 15px;
          background: white;
          border-radius: 8px;
        }
        
        .barcode-placeholder {
          font-family: monospace;
          color: black;
          font-size: 24px;
          letter-spacing: 8px;
          padding: 10px;
        }
        
        .footer {
          text-align: center;
          margin-top: 25px;
          padding-top: 20px;
          border-top: 2px solid rgba(14, 165, 233, 0.3);
          color: #9ca3af;
          font-size: 14px;
        }
        
        .contact-info {
          display: flex;
          justify-content: center;
          gap: 25px;
          margin: 15px 0;
          flex-wrap: wrap;
        }
        
        .contact-item {
          text-align: center;
          font-size: 13px;
        }
        
        .special-requirements {
          font-style: italic;
          color: #cbd5e1;
          margin-top: 8px;
          font-size: 13px;
        }
        
        .status-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-family: 'Orbitron', sans-serif;
          font-size: 14px;
          margin-left: 10px;
        }
        
        .status-confirmed {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid #22c55e;
        }
        
        @media print {
          body {
            background: linear-gradient(to bottom, #0a0a18, #1a1a2e, #16213e) !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            padding: 10px;
          }
          
          .ticket-container {
            box-shadow: none;
            border: 3px solid #0ea5e9;
            padding: 25px;
          }
        }
      </style>
    </head>
    <body>
      <div class="ticket-container">
        <div class="header">
          <div class="logo">SpaceVoyager</div>
          <div class="title">Space Travel Ticket</div>
          <div class="subtitle">Your Journey to the Stars</div>
        </div>
        
        <div class="ticket-info">
          <div class="info-item">
            <div class="info-label">Ticket Number</div>
            <div class="info-value neon-cyan">#${booking.bookingId}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Booking Date</div>
            <div class="info-value">${formatDate(booking.bookingDate)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Departure Date</div>
            <div class="info-value">${formatDate(booking.departureDate)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Status</div>
            <div class="info-value">
              ${
                booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
              }
              <span class="status-badge status-confirmed">Confirmed</span>
            </div>
          </div>
        </div>
        
        <div class="journey-section">
          <div class="section-title">Journey Details</div>
          <div class="journey-grid">
            <div class="detail-item">
              <div class="label">Destination</div>
              <div class="value neon-cyan">${booking.destination.name}</div>
            </div>
            <div class="detail-item">
              <div class="label">Travel Duration</div>
              <div class="value">${booking.destination.travelDuration}</div>
            </div>
            <div class="detail-item">
              <div class="label">Distance</div>
              <div class="value">${booking.destination.distance}</div>
            </div>
            <div class="detail-item">
              <div class="label">Gravity</div>
              <div class="value">${booking.destination.gravity}</div>
            </div>
            <div class="detail-item">
              <div class="label">Temperature</div>
              <div class="value">${booking.destination.temperature}</div>
            </div>
            <div class="detail-item">
              <div class="label">Accommodation</div>
              <div class="value neon-blue">${booking.accommodation.name}</div>
            </div>
            <div class="detail-item">
              <div class="label">Accommodation Size</div>
              <div class="value">${booking.accommodation.size}</div>
            </div>
            <div class="detail-item">
              <div class="label">Number of Passengers</div>
              <div class="value neon-cyan">${booking.passengers.length}</div>
            </div>
          </div>
        </div>
        
        <div class="passenger-section">
          <div class="section-title">Passenger Information</div>
          <div class="passenger-list">
            ${booking.passengers
              .map(
                (passenger, index) => `
              <div class="passenger-item">
                <div class="passenger-header">Passenger ${index + 1}</div>
                <div class="passenger-details">
                  <strong>${passenger.firstName} ${passenger.lastName}</strong>
                </div>
                <div class="passenger-contact">
                  📧 ${passenger.email}<br>
                  📞 ${passenger.phone}
                </div>
                ${
                  passenger.specialRequirements
                    ? `
                <div class="special-requirements">
                  <strong>Special Requirements:</strong> ${passenger.specialRequirements}
                </div>
                `
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>
        </div>
        
        <div class="barcode">
          <div class="barcode-placeholder">${booking.bookingId
            .replace(/-/g, "")
            .padEnd(20, "0")}</div>
          <div style="color: black; font-size: 12px; margin-top: 5px;">Scan this code at the spaceport</div>
        </div>
        
        <div class="total-section">
          <div class="total-label">Total Amount Paid</div>
          <div class="total-price">${formatCurrency(
            booking.totalPrice
          )} USD</div>
          <div style="color: #9ca3af; font-size: 14px; margin-top: 8px;">
            Includes destination fee + accommodation for all passengers
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Important Information:</strong></p>
          <p>Please arrive at the spaceport at least 4 hours before departure time.</p>
          <p>Bring valid government-issued photo ID for all passengers.</p>
          <div class="contact-info">
            <div class="contact-item">
              <strong>SpaceVoyager Customer Service</strong><br>
              📧 support@spacevoyager.com<br>
              📞 +1 (800) SPACE-TRIP
            </div>
            <div class="contact-item">
              <strong>Spaceport Address</strong><br>
              Kennedy Space Center<br>
              Cape Canaveral, FL 32899
            </div>
          </div>
          <p style="margin-top: 20px; font-size: 12px;">© 2024 SpaceVoyager. All rights reserved.</p>
          <p style="font-size: 11px; margin-top: 10px; opacity: 0.8;">
            This is your official space travel ticket. Please keep this document safe and present it at the spaceport.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  printWindow.document.write(printContent);
  printWindow.document.close();

  // Wait for content to load then print
  printWindow.onload = function () {
    setTimeout(() => {
      printWindow.print();
      showSuccessNotification("Ticket downloaded successfully!");
    }, 1000);
  };
}

// Edit booking function
function editBooking(bookingId) {
  const user = checkUserLogin();
  if (!user) return;

  const bookings = getUserBookings(user.id);
  const booking = bookings.find((b) => b.bookingId === bookingId);

  if (!booking) {
    showErrorNotification("Booking not found!");
    return;
  }

  // Create edit modal
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
          <h2 class="font-orbitron text-2xl text-neon-blue">Edit Booking</h2>
          <button id="close-edit-modal" class="text-gray-400 hover:text-white text-xl">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form id="edit-booking-form">
          <div class="space-y-6">
            <div>
              <h3 class="font-orbitron text-xl mb-4">Journey Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-400 mb-2">Departure Date</label>
                  <input 
                    type="date" 
                    name="departureDate" 
                    value="${booking.departureDate}"
                    class="w-full bg-space-dark/50 border border-neon-blue/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
                    required
                    min="${new Date().toISOString().split("T")[0]}"
                  />
                  <div class="error-message" style="display: none;"></div>
                </div>
                <div>
                  <label class="block text-gray-400 mb-2">Accommodation</label>
                  <select 
                    name="accommodation" 
                    class="w-full bg-space-dark/50 border border-neon-blue/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
                  >
                    <option value="standard" ${
                      booking.accommodation.id === "standard" ? "selected" : ""
                    }>Standard Cabin</option>
                    <option value="deluxe" ${
                      booking.accommodation.id === "deluxe" ? "selected" : ""
                    }>Deluxe Suite</option>
                    <option value="luxury" ${
                      booking.accommodation.id === "luxury" ? "selected" : ""
                    }>Luxury Quarters</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="font-orbitron text-xl mb-4">Passenger Details</h3>
              <div id="passengers-container" class="space-y-4">
                ${booking.passengers
                  .map(
                    (passenger, index) => `
                  <div class="passenger-form bg-space-dark/50 p-4 rounded-lg">
                    <h4 class="font-semibold mb-3">Passenger ${index + 1}</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-gray-400 mb-2">First Name</label>
                        <input 
                          type="text" 
                          name="passenger-${index}-firstName" 
                          value="${passenger.firstName}"
                          class="w-full bg-space-dark/50 border border-neon-blue/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
                          required
                          data-validation="name"
                        />
                        <div class="error-message" style="display: none;"></div>
                      </div>
                      <div>
                        <label class="block text-gray-400 mb-2">Last Name</label>
                        <input 
                          type="text" 
                          name="passenger-${index}-lastName" 
                          value="${passenger.lastName}"
                          class="w-full bg-space-dark/50 border border-neon-blue/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
                          required
                          data-validation="name"
                        />
                        <div class="error-message" style="display: none;"></div>
                      </div>
                      <div>
                        <label class="block text-gray-400 mb-2">Email</label>
                        <input 
                          type="email" 
                          name="passenger-${index}-email" 
                          value="${passenger.email}"
                          class="w-full bg-space-dark/50 border border-neon-blue/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
                          required
                          data-validation="email"
                        />
                        <div class="error-message" style="display: none;"></div>
                      </div>
                      <div>
                        <label class="block text-gray-400 mb-2">Phone</label>
                        <input 
                          type="tel" 
                          name="passenger-${index}-phone" 
                          value="${passenger.phone}"
                          class="w-full bg-space-dark/50 border border-neon-blue/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
                          required
                          data-validation="phone"
                        />
                        <div class="error-message" style="display: none;"></div>
                      </div>
                      <div class="md:col-span-2">
                        <label class="block text-gray-400 mb-2">Special Requirements</label>
                        <textarea 
                          name="passenger-${index}-specialRequirements"
                          class="w-full bg-space-dark/50 border border-neon-blue/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
                          rows="2"
                        >${passenger.specialRequirements || ""}</textarea>
                      </div>
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
            
            <div>
              <h3 class="font-orbitron text-xl mb-4">Special Requests</h3>
              <div class="bg-space-dark/50 p-4 rounded-lg">
                <label class="block text-gray-400 mb-2">Additional Notes</label>
                <textarea 
                  name="specialRequests"
                  class="w-full bg-space-dark/50 border border-neon-blue/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
                  rows="3"
                  placeholder="Any special requests or notes for your journey..."
                >${booking.specialRequests || ""}</textarea>
              </div>
            </div>

            <div class="bg-space-dark/50 p-4 rounded-lg border border-neon-blue/30">
              <h3 class="font-orbitron text-xl mb-3 text-neon-cyan">Price Summary</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-400">Destination Fee:</span>
                  <span>${formatCurrency(booking.destination.price)}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Current Accommodation:</span>
                  <span>${formatCurrency(
                    booking.accommodation.pricePerDay
                  )}/day</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Number of Passengers:</span>
                  <span>${booking.passengers.length}</span>
                </div>
                <div class="border-t border-neon-blue/20 pt-2 mt-2">
                  <div class="flex justify-between font-bold">
                    <span>Current Total:</span>
                    <span class="text-neon-cyan">${formatCurrency(
                      booking.totalPrice
                    )}</span>
                  </div>
                </div>
                <div class="text-xs text-gray-400 mt-1">
                  * Price will be recalculated based on your changes
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-4 mt-6">
            <button type="button" class="btn-secondary px-6 py-2 rounded-lg" id="cancel-edit">
              Cancel
            </button>
            <button type="submit" class="btn-primary text-white px-6 py-2 rounded-lg glow">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    `;

  document.body.appendChild(modal);

  // Setup input validation for edit form
  const inputs = modal.querySelectorAll("input[data-validation]");
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateEditInput(this);
    });

    input.addEventListener("input", function () {
      // Clear error as user types
      if (this.value.trim() !== "") {
        clearEditError(this);
      }
    });
  });

  // Close modal events
  document.getElementById("close-edit-modal").addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  document.getElementById("cancel-edit").addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  // Form submission
  document
    .getElementById("edit-booking-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      // Validate form
      if (!validateEditForm(e.target)) {
        showErrorNotification(
          "Please fix the errors in the form before saving."
        );
        return;
      }

      // Get form data
      const formData = new FormData(e.target);
      const updatedBooking = { ...booking };

      // Update departure date
      updatedBooking.departureDate = formData.get("departureDate");

      // Update accommodation
      const accommodationType = formData.get("accommodation");
      const accommodationOptions = {
        standard: {
          id: "standard",
          name: "Standard Cabin",
          size: "2 people",
          occupancy: "2 adults",
          pricePerDay: 500,
          shortDescription: "Comfortable standard accommodation",
        },
        deluxe: {
          id: "deluxe",
          name: "Deluxe Suite",
          size: "2 people",
          occupancy: "2 adults",
          pricePerDay: 800,
          shortDescription: "Spacious deluxe suite with premium amenities",
        },
        luxury: {
          id: "luxury",
          name: "Luxury Quarters",
          size: "4 people",
          occupancy: "4 adults",
          pricePerDay: 1200,
          shortDescription: "Ultimate luxury experience with premium space",
        },
      };
      updatedBooking.accommodation = accommodationOptions[accommodationType];

      // Update passengers
      updatedBooking.passengers = booking.passengers.map((passenger, index) => {
        return {
          ...passenger,
          firstName: formData.get(`passenger-${index}-firstName`),
          lastName: formData.get(`passenger-${index}-lastName`),
          email: formData.get(`passenger-${index}-email`),
          phone: formData.get(`passenger-${index}-phone`),
          specialRequirements: formData.get(
            `passenger-${index}-specialRequirements`
          ),
        };
      });

      // Update special requests
      updatedBooking.specialRequests = formData.get("specialRequests");

      // Recalculate total price using the same logic as booking page
      updatedBooking.totalPrice = recalculateTotalPrice(updatedBooking);

      // Save updated booking
      const allBookings = JSON.parse(
        localStorage.getItem("spaceBookings") || "[]"
      );
      const bookingIndex = allBookings.findIndex(
        (b) => b.bookingId === bookingId
      );

      if (bookingIndex !== -1) {
        allBookings[bookingIndex] = updatedBooking;
        localStorage.setItem("spaceBookings", JSON.stringify(allBookings));

        // Refresh the display
        initPage();

        // Show success message
        showSuccessNotification("Booking updated successfully!");
      } else {
        showErrorNotification("Error updating booking!");
      }

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
      showSuccessNotification("Booking cancelled successfully!");
    } else {
      showErrorNotification("Booking not found!");
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
