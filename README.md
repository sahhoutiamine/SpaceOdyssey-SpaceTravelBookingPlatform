SpaceOdyssey - Space Travel Booking Platform
A modern, interactive web application for booking interstellar travel experiences. Built with vanilla JavaScript, HTML5, and styled with Tailwind CSS, featuring a stunning space-themed UI with glassmorphism effects and smooth animations.
🚀 Features
Core Functionality

Interactive Booking System - Complete booking flow with form validation
User Authentication - Login system with persistent sessions
Booking Management - View, edit, and cancel bookings
Dynamic Pricing - Real-time price calculation based on selections
Responsive Design - Fully responsive across all devices
Local Storage - Data persistence using browser localStorage

User Experience

Animated starfield background
Glassmorphism UI effects
Smooth transitions and hover effects
Real-time form validation with visual feedback
Downloadable booking confirmations
Printable tickets with themed design

📄 Pages Overview

1. Home Page (index.html)
   Landing page featuring:

Hero section with call-to-action
Featured destinations showcase
Service highlights
Responsive navigation

2. Destinations (destinations.html)
   Browse available space destinations:

Grid layout of destination cards
Detailed information for each location
Pricing and travel duration
Direct booking links

3. Booking (booking.html)
   Complete booking form including:

Destination selection with live preview
Departure date picker
Accommodation type selection
Multi-passenger forms (solo/couple/group)
Dynamic passenger management
Real-time price calculation
Form validation
Login redirect for unauthenticated users

4. My Bookings (mybookings.html)
   Personal booking dashboard:

List of all user bookings
Booking status indicators (confirmed/pending/cancelled)
View detailed booking information
Edit existing bookings
Cancel bookings
Download printable tickets

5. About (about.html)
   Company information and mission statement
6. Login (login.html)
   User authentication:

Email/password login form
Form validation
Session management
Redirect handling for pending bookings

🛠️ Technical Stack
Frontend

HTML5 - Semantic markup
CSS3 - Custom styles with Tailwind CSS
JavaScript (ES6+) - Vanilla JS for all functionality
Tailwind CSS - Utility-first CSS framework
Font Awesome - Icon library
Google Fonts - Orbitron & Exo 2 fonts

Data Management

localStorage - Client-side data persistence
JSON - Data format for destinations, accommodations, and users

📁 Project Structure
SpaceOdyssey/
├── index.html # Home page
├── destinations.html # Destinations listing
├── booking.html # Booking form
├── mybookings.html # User bookings dashboard
├── about.html # About page
├── login.html # Login page
├── booking.js # Booking page logic
├── mybookings.js # Bookings management logic
├── menu.js # Navigation menu handler
├── style.css # Custom styles
├── destinations.json # Destinations data
├── accommodations.json # Accommodation options
├── users.json # User credentials (demo)
└── README.md # Project documentation
🎨 Design Features
Color Scheme

Space Dark: #0a0a18 - Primary background
Space Blue: #1a1a2e - Secondary background
Space Purple: #16213e - Accent background
Neon Blue: #0ea5e9 - Primary accent
Neon Purple: #8b5cf6 - Secondary accent
Neon Cyan: #06b6d4 - Tertiary accent

Typography

Orbitron - Headers and branding (bold, futuristic)
Exo 2 - Body text (clean, readable)

Visual Effects

Animated twinkling stars background
Glassmorphism cards with backdrop blur
Gradient borders and buttons
Glow effects on interactive elements
Smooth transitions and animations

🚀 Getting Started
Prerequisites

Modern web browser (Chrome, Firefox, Safari, Edge)
Local web server (optional, for development)

Installation

Clone the repository

bashgit clone https://github.com/sahhoutiamine/SpaceOdyssey-SpaceTravelBookingPlatform
cd SpaceOdyssey

Open in browser

Simply open index.html in your browser
Or use a local server:

bash # Using Python
python -m http.server 8000

# Using Node.js

npx http-server

```

3. **Access the application**
   - Navigate to `http://localhost:8000` (if using local server)
   - Or open `index.html` directly

### Demo Credentials
```

Email: john.doe@example.com
Password: password123

Email: jane.smith@example.com
Password: password456
💡 Usage Guide
Making a Booking

Browse Destinations

Visit the Destinations page
Review available space travel options

Start Booking

Click "Book Your Journey" from any page
Select your destination from the dropdown
Choose departure date
Select passenger type (solo/couple/group)
Choose accommodation type

Add Passengers

Fill in passenger details
Add additional passengers for group bookings
Include special requirements if needed

Authentication

Login if you have an account
Your booking details will be saved during login

Confirmation

Review booking details
Download confirmation PDF
Access booking ticket

Managing Bookings

View Bookings

Navigate to "My Bookings"
See all your reservations

Edit Booking

Click "Edit" on confirmed bookings
Modify passenger details
Change departure date
Update accommodation
Price automatically recalculates

Cancel Booking

Click "Cancel" on any booking
Confirm cancellation
Status updates to "Cancelled"

Download Ticket

Click "Download Ticket"
Print or save PDF

🔧 Key Functions
Booking System (booking.js)

createStars() - Generates animated starfield
loadDestinations() - Fetches destinations from JSON
loadAccommodations() - Loads accommodation options
validateForm() - Comprehensive form validation
updatePriceCalculation() - Real-time price updates
addPassengerForm() - Dynamic passenger form creation
saveBookingToLocalStorage() - Persists booking data
showBookingConfirmation() - Displays confirmation modal

Booking Management (mybookings.js)

getUserBookings() - Retrieves user's bookings
displayBookings() - Renders booking cards
editBooking() - Opens edit modal
cancelBooking() - Handles cancellation
downloadBookingTicket() - Generates printable ticket
recalculateTotalPrice() - Updates price on edits

Validation Functions

validateName() - Name format validation
validateEmail() - Email format validation
validatePhone() - Phone number validation
validateDate() - Future date validation

📊 Data Structure
Booking Object
javascript{
bookingId: "BK-1234567890-abc123",
userId: 1,
userEmail: "user@example.com",
bookingDate: "2024-01-15T10:30:00Z",
status: "confirmed", // or "pending", "cancelled"
destination: {
id: "moon",
name: "The Moon",
description: "...",
travelDuration: "3 days",
distance: "384,400 km",
gravity: "0.16g",
temperature: "-173°C to 127°C",
price: 50000
},
departureDate: "2024-06-15",
accommodation: {
id: "deluxe",
name: "Deluxe Suite",
size: "2 people",
occupancy: "2 adults",
pricePerDay: 800
},
passengers: [
{
firstName: "John",
lastName: "Doe",
email: "john@example.com",
phone: "+1234567890",
specialRequirements: "Window seat"
}
],
totalPrice: 54800,
passengerType: "solo"
}
🔒 Security Notes
⚠️ Important: This is a demo application for educational purposes.

Passwords are stored in plain text in users.json
No server-side validation
No actual payment processing
localStorage is not encrypted
Not suitable for production use

🐛 Known Issues

localStorage has size limitations (typically 5-10MB)
No data synchronization across devices
Browser cache clearing removes all data
Limited to single-device usage

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
👨‍💻 Author
Amine SAHHOUTI

GitHub: @sahhoutiamine
Email: midoriaduko@gmail.com

🙏 Acknowledgments

Font Awesome for icons
Google Fonts for typography
Tailwind CSS for utility classes
Inspiration from modern space exploration initiatives

📞 Support
For support, email support@spaceodyssey.com or open an issue in the repository.
