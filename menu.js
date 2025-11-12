// Update navigation based on login status
function updateNavigation() {
  const authLink = document.getElementById("auth-link");
  const mobileAuthLink = document.getElementById("mobile-auth-link");

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  if (currentUser) {
    // User is logged in - show logout with user name
    const displayText = `Log Out (${currentUser.name})`;
    if (authLink) {
      authLink.innerHTML = displayText;
      authLink.onclick = handleLogout;
    }
    if (mobileAuthLink) {
      mobileAuthLink.innerHTML = displayText;
      mobileAuthLink.onclick = handleLogout;
    }
  }
}

// Handle logout
function handleLogout(e) {
  e.preventDefault();
  localStorage.removeItem("currentUser");
  localStorage.removeItem("pendingBooking");
  window.location.href = "login.html";
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
