// Update navigation based on login status
function updateNavigation() {
  const authLink = document.getElementById("auth-link");
  const mobileAuthLink = document.getElementById("mobile-auth-link");
  const loginNavLink = document.querySelector('a[href="login.html"]');
  const mobileLoginNavLink = document.querySelector(
    '#mobile-menu a[href="login.html"]'
  );

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  if (currentUser) {
    // User is logged in - show logout with user name and hide login links
    const displayText = `Log Out (${currentUser.name})`;
    if (authLink) {
      authLink.innerHTML = displayText;
      authLink.onclick = handleLogout;
      authLink.href = "javascript:void(0)";
    }
    if (mobileAuthLink) {
      mobileAuthLink.innerHTML = displayText;
      mobileAuthLink.onclick = handleLogout;
      mobileAuthLink.href = "javascript:void(0)";
    }

    // Hide login navigation links
    if (loginNavLink) {
      loginNavLink.style.display = "none";
    }
    if (mobileLoginNavLink) {
      mobileLoginNavLink.style.display = "none";
    }
  }
}

// Handle logout with confirmation popup
function handleLogout() {
  // Create popup overlay
  const popupOverlay = document.createElement("div");
  popupOverlay.style.cssText = `
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
  `;

  // Create popup content
  const popup = document.createElement("div");
  popup.className = "login-card";
  popup.style.cssText = `
    max-width: 400px;
    width: 90%;
    padding: 2rem;
    text-align: center;
    animation: fadeIn 0.3s ease;
  `;

  // Add popup content
  popup.innerHTML = `
    <div class="w-16 h-16 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center mx-auto mb-4 glow">
      <i class="fas fa-sign-out-alt text-white text-xl"></i>
    </div>
    <h2 class="font-orbitron text-2xl mb-4 text-glow">Confirm Logout</h2>
    <p class="text-gray-300 mb-6">Are you sure you want to log out of your SpaceVoyager account?</p>
    <div class="flex space-x-4">
      <button id="cancel-logout" class="flex-1 py-3 rounded-lg border border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10 transition-all duration-300 font-bold">
        Cancel
      </button>
      <button id="confirm-logout" class="flex-1 py-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 transition-all duration-300 font-bold glow">
        Log Out
      </button>
    </div>
  `;

  // Add fadeIn animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);

  // Append popup to overlay and overlay to body
  popupOverlay.appendChild(popup);
  document.body.appendChild(popupOverlay);

  // Add event listeners
  document
    .getElementById("cancel-logout")
    .addEventListener("click", function () {
      document.body.removeChild(popupOverlay);
      document.head.removeChild(style);
    });

  document
    .getElementById("confirm-logout")
    .addEventListener("click", function () {
      // Remove current user from localStorage
      localStorage.removeItem("currentUser");

      // Remove popup
      document.body.removeChild(popupOverlay);
      document.head.removeChild(style);

      // Update navigation
      updateNavigation();

      // Redirect to home page
      window.location.href = "index.html";
    });

  // Close popup when clicking outside
  popupOverlay.addEventListener("click", function (e) {
    if (e.target === popupOverlay) {
      document.body.removeChild(popupOverlay);
      document.head.removeChild(style);
    }
  });
}

// Mobile menu toggle
function setupMobileMenu() {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("open");
    });
  }
}

// Call this when the page loads
document.addEventListener("DOMContentLoaded", function () {
  updateNavigation();
  setupMobileMenu();
});
