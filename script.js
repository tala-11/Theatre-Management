// Render shows
function renderShows(showsData) {
  const showsContainer = document.getElementById('allShows');
  if (!showsContainer) return;
  
  showsContainer.innerHTML = '';
  
  if (showsData.length === 0) {
    showsContainer.innerHTML = '<p class="no-results">No shows match your filters. Please try different criteria.</p>';
    return;
  }
  
  showsData.forEach(show => {
    const showCard = document.createElement('div');
    showCard.className = 'show-card';
    showCard.setAttribute('data-id', show.id);
    
    showCard.innerHTML = `      <div class="show-content">
        <span class="show-category">${show.category}</span>
        <h3 class="show-title">${show.title}</h3>
        <div class="show-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          ${show.date}
        </div>
        <div class="show-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          ${show.duration}
        </div>
        <div class="show-rating">
          ${generateStarRating(show.rating)}
          <span>${show.rating.toFixed(1)}</span>
        </div>
        <div class="show-price">$${show.price}</div>
        <div class="show-actions">
          <button class="btn btn-primary book-btn" data-id="${show.id}">Book Now</button>
          <button class="btn btn-outline details-btn" data-id="${show.id}">Details</button>
        </div>
      </div>
    `;
    
    showsContainer.appendChild(showCard);
  });
}

// --------- VENUES PAGE FUNCTIONS ---------

// Render venues
function renderVenues() {
  const venuesGrid = document.getElementById('venuesGrid');
  if (!venuesGrid) return;
  
  venuesGrid.innerHTML = '';
  
  venues.forEach(venue => {
    const venueCard = document.createElement('div');
    venueCard.className = 'venue-card';
    venueCard.setAttribute('data-id', venue.id);
    
    venueCard.innerHTML = `      <div class="venue-content">
        <h3 class="venue-title">${venue.name}</h3>
        <div class="venue-capacity">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Capacity: ${venue.capacity} people
        </div>
        <p class="venue-description">${venue.description}</p>
        <div class="venue-amenities">
          ${renderAmenities(venue.amenities)}
        </div>
        <div class="venue-actions">
          <button class="btn btn-primary book-venue-btn" data-id="${venue.id}">Book Venue</button>
          <button class="btn btn-outline venue-details-btn" data-id="${venue.id}">See Details</button>
        </div>
      </div>
    `;
    
    venuesGrid.appendChild(venueCard);
  });
}

// Render venue amenities
function renderAmenities(amenities) {
  let amenitiesHTML = '';
  
  amenities.forEach(amenity => {
    amenitiesHTML += `
      <div class="venue-amenity">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        ${amenity}
      </div>
    `;
  });
  
  return amenitiesHTML;
}

// Show venue details
function showVenueDetails(venueId) {
  const venue = venues.find(v => v.id == venueId);
  if (!venue) return;
  
  alert(`
    ${venue.name}
    Capacity: ${venue.capacity} people
    Location: ${venue.location}
    Price: ${venue.pricePerDay.toLocaleString()} per day
    
    For more information, please contact our venue management team.
  `);
}

// Book venue (for companies)
function bookVenue(venueId) {
  if (!isLoggedIn) {
    alert('Please log in to book a venue.');
    openModal('loginModal');
    return;
  }
  
  if (userType !== 'company') {
    alert('Only company accounts can book entire venues. Please register as a company to proceed.');
    return;
  }
  
  // Store selected venue id for later
  localStorage.setItem('selected_venue_id', venueId);
  
  // Setup date and time selectors
  setupDateSelector();
  setupTimeSelector();
  
  // Open booking modal
  openModal('companyBookingModal');
}

// Setup date selector
function setupDateSelector() {
  const dateSelector = document.getElementById('dateSelector');
  if (!dateSelector) return;
  
  dateSelector.innerHTML = '';
  
  // Generate dates for next 14 days
  const today = new Date();
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    const dateItem = document.createElement('div');
    dateItem.className = 'date-item';
    dateItem.setAttribute('data-date', date.toISOString().split('T')[0]);
    
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const weekday = date.toLocaleString('default', { weekday: 'short' });
    
    dateItem.innerHTML = `
      <div>${weekday}</div>
      <div><strong>${day}</strong></div>
      <div>${month}</div>
    `;
    
    dateItem.addEventListener('click', function() {
      this.classList.toggle('selected');
    });
    
    dateSelector.appendChild(dateItem);
  }
}

// Setup time selector
function setupTimeSelector() {
  const timeSelector = document.getElementById('timeSelector');
  if (!timeSelector) return;
  
  timeSelector.innerHTML = '';
  
  // Available time slots
  const times = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'];
  
  times.forEach(time => {
    const timeItem = document.createElement('div');
    timeItem.className = 'time-item';
    timeItem.setAttribute('data-time', time);
    timeItem.textContent = time;
    
    timeItem.addEventListener('click', function() {
      // Remove selected class from all time items
      document.querySelectorAll('.time-item').forEach(item => {
        item.classList.remove('selected');
      });
      
      // Add selected class to clicked item
      this.classList.add('selected');
    });
    
    timeSelector.appendChild(timeItem);
  });
}

// --------- BOOKING & CART FUNCTIONS ---------

// Show details modal
function showDetails(showId) {
  const show = shows.find(s => s.id == showId);
  if (!show) return;
  
  const showDetailsContent = document.getElementById('showDetailsContent');
  
  showDetailsContent.innerHTML = `
    <div class="show-details-header">
            <div class="show-details-info">
        <h2 class="show-details-title">${show.title}</h2>
        <div class="show-details-meta">
          <div class="show-info">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            ${show.date}
          </div>
          <div class="show-info">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            ${show.duration}
          </div>
          <div class="show-rating">
            ${generateStarRating(show.rating)}
            <span>${show.rating.toFixed(1)}</span>
          </div>
        </div>
        <div class="show-details-price">$${show.price}<div>
        <p class="show-details-description">${show.description}</p>
        <div class="show-details-cast">
          <strong>Cast:</strong> ${show.cast}
        </div>
        <button class="btn btn-primary book-show-btn" data-id="${show.id}">Book Tickets</button>
      </div>
    </div>
    
    <div class="seat-selection">
      <h3>Select Your Seats</h3>
      <div class="screen">STAGE</div>
      <div class="seats-container" id="seatsContainer">
        ${generateSeats()}
      </div>
      <div class="seat-legend">
        <div class="legend-item">
          <div class="legend-color color-available"></div>
          <span>Available</span>
        </div>
        <div class="legend-item">
          <div class="legend-color color-selected"></div>
          <span>Selected</span>
        </div>
        <div class="legend-item">
          <div class="legend-color color-booked"></div>
          <span>Booked</span>
        </div>
      </div>
      <button class="btn btn-primary add-to-cart-btn" data-id="${show.id}">Add to Cart</button>
    </div>
  `;
  
  // Open the modal
  openModal('showDetailsModal');
  
  // Add event listeners
  
  // Seat selection
  document.querySelectorAll('.seat:not(.booked)').forEach(seat => {
    seat.addEventListener('click', function() {
      this.classList.toggle('selected');
    });
  });
  
  // Book show button
  document.querySelector('.book-show-btn').addEventListener('click', function() {
    document.querySelector('.seat-selection').scrollIntoView({
      behavior: 'smooth'
    });
  });
  
  // Add to cart button
  document.querySelector('.add-to-cart-btn').addEventListener('click', function() {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    
    if (!isLoggedIn) {
      alert('Please log in to book tickets');
      closeModal('showDetailsModal');
      openModal('loginModal');
      return;
    }
    
    // Get seat IDs
    const seats = [];
    selectedSeats.forEach(seat => {
      seats.push(seat.textContent);
    });
    
    // Apply coupon discount if available
    let price = show.price;
    let discountInfo = '';
    
    if (appliedCoupon) {
      price = price * (1 - appliedCoupon.discount);
      discountInfo = ` (${appliedCoupon.description} applied)`;
    }
    
    // Add to cart
    const cartItem = {
      id: Date.now(),
      showId: show.id,
      title: show.title,
      image: show.image,
      price: price,
      originalPrice: show.price,
      discountInfo: discountInfo,
      seats: seats,
      totalPrice: price * seats.length
    };
    
    cart.push(cartItem);
    saveCartToStorage();
    updateCartCount();
    
    // Send confirmation email if logged in
    if (userEmail) {
      sendConfirmationEmail(userEmail, 'ticket', {
        title: show.title,
        seats: seats,
        date: show.date,
        price: price * seats.length
      });
    }
    
    // Close show details and open cart
    closeModal('showDetailsModal');
    openModal('cartModal');
    renderCart();
  });
}

// Generate seats for selection
function generateSeats() {
  let seatsHTML = '';
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 10;
  
  // Create random already booked seats
  const bookedSeats = new Set();
  for (let i = 0; i < 20; i++) {
    const row = rows[Math.floor(Math.random() * rows.length)];
    const seat = Math.floor(Math.random() * seatsPerRow) + 1;
    bookedSeats.add(`${row}${seat}`);
  }
  
  // Generate HTML
  rows.forEach(row => {
    seatsHTML += `<div class="seat-row">`;
    for (let i = 1; i <= seatsPerRow; i++) {
      const seatId = `${row}${i}`;
      const isBooked = bookedSeats.has(seatId);
      
      seatsHTML += `<div class="seat ${isBooked ? 'booked' : ''}" data-seat="${seatId}">${seatId}</div>`;
    }
    seatsHTML += `</div>`;
  });
  
  return seatsHTML;
}

// Render cart
function renderCart() {
  const cartContent = document.getElementById('cartContent');
  if (!cartContent) return;
  
  if (cart.length === 0) {
    cartContent.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }
  
  let cartHTML = '<div class="cart-items">';
  
  cart.forEach(item => {
    cartHTML += `
      <div class="cart-item">
                <div class="cart-item-details">
          <h4 class="cart-item-title">${item.title}</h4>
          <div class="cart-item-info">Price: ${item.price.toFixed(2)} per ticket${item.discountInfo || ''}</div>
          <div class="cart-item-seats">Seats: ${item.seats.join(', ')}</div>
        </div>
        <div class="cart-item-price">${item.totalPrice.toFixed(2)}</div>
        <button class="cart-item-remove" data-id="${item.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;
  });
  
  cartHTML += '</div>';
  
  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => total + item.totalPrice, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;
  
  cartHTML += `
    <div class="cart-summary">
      <div class="summary-row">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div class="summary-row">
        <span>Tax (8%)</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      <div class="summary-row summary-total">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  `;
  
  // Add employee coupon section
  if (userType === 'employee' && !appliedCoupon) {
    cartHTML += `
      <button class="btn btn-outline form-submit apply-coupon-btn" style="margin-bottom: 10px;">Apply Coupon Code</button>
    `;
  } else if (appliedCoupon) {
    cartHTML += `
      <div class="coupon-applied">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${appliedCoupon.description} applied</span>
        <button class="btn-text remove-coupon">Remove</button>
      </div>
    `;
  }
  
  cartHTML += `<button class="btn btn-primary form-submit checkout-btn">Proceed to Checkout</button>`;
  
  cartContent.innerHTML = cartHTML;
  
  // Add event listeners
  document.querySelectorAll('.cart-item-remove').forEach(button => {
    button.addEventListener('click', function() {
      const itemId = parseInt(this.getAttribute('data-id'));
      removeFromCart(itemId);
    });
  });
  
  if (document.querySelector('.apply-coupon-btn')) {
    document.querySelector('.apply-coupon-btn').addEventListener('click', function() {
      closeModal('cartModal');
      openModal('couponModal');
    });
  }
  
  if (document.querySelector('.remove-coupon')) {
    document.querySelector('.remove-coupon').addEventListener('click', function() {
      appliedCoupon = null;
      renderCart();
    });
  }
  
  document.querySelector('.checkout-btn').addEventListener('click', function() {
    if (!isLoggedIn) {
      alert('Please log in to complete your checkout.');
      closeModal('cartModal');
      openModal('loginModal');
      return;
    }
    
    alert('Thank you for your purchase! Your tickets will be emailed to you shortly.');
    cart = [];
    saveCartToStorage();
    updateCartCount();
    closeModal('cartModal');
  });
}

// Remove from cart
function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  saveCartToStorage();
  updateCartCount();
  renderCart();
}

// Update cart count
function updateCartCount() {
  const cartCount = document.getElementById('cartCount');
  if (!cartCount) return;
  
  if (cart.length > 0) {
    cartCount.textContent = cart.length;
    cartCount.style.display = 'flex';
  } else {
    cartCount.style.display = 'none';
  }
}

// Save cart to localStorage
function saveCartToStorage() {
  localStorage.setItem('cedarstage_cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
  const storedCart = localStorage.getItem('cedarstage_cart');
  if (storedCart) {
    cart = JSON.parse(storedCart);
  }
}

// --------- UTILITY FUNCTIONS ---------

// Generate star rating
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let starsHTML = '';
  
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      // Full star
      starsHTML += `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      `;
    } else if (i === fullStars + 1 && hasHalfStar) {
      // Half star
      starsHTML += `
        <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" clip-path="inset(0 50% 0 0)"></polygon>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none"></polygon>
        </svg>
      `;
    } else {
      // Empty star
      starsHTML += `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      `;
    }
  }
  
  return starsHTML;
}// Theater Booking System - Main JavaScript

// Sample data
const shows = [
  {
    id: 1,
    title: "Hamlet",
    image: "/api/placeholder/600/400",
    category: "Drama",
    date: "Apr 15 - Apr 30, 2025",
    rating: 4.8,
    price: 9,
    description: "Shakespeare's classic tragedy follows the Prince of Denmark as he seeks revenge for his father's murder.",
    cast: "John Smith as Hamlet, Emily Davis as Ophelia, Michael Johnson as Claudius",
    duration: "2 hours 45 minutes",
    featured: true
  },
  {
    id: 2,
    title: "The Lion King",
    image: "/api/placeholder/600/400",
    category: "Musical",
    date: "May 5 - May 20, 2025",
    rating: 4.9,
    price: 10,
    description: "Disney's beloved musical about a young lion prince who reclaims his kingdom from his treacherous uncle.",
    cast: "Robert Williams as Simba, Sarah Johnson as Nala, David Thompson as Scar",
    duration: "2 hours 30 minutes",
    featured: true
  },
  {
    id: 3,
    title: "Swan Lake",
    image: "/api/placeholder/600/400",
    category: "Ballet",
    date: "Apr 22 - May 8, 2025",
    rating: 4.7,
    price: 8,
    description: "Tchaikovsky's timeless ballet about a princess turned into a swan by an evil sorcerer's curse.",
    cast: "Anna Petrova as Odette/Odile, Michael Chen as Prince Siegfried",
    duration: "3 hours with intermission",
    featured: true
  },
  {
    id: 4,
    title: "A Streetcar Named Desire",
    image: "/api/placeholder/600/400",
    category: "Drama",
    date: "June 1 - June 15, 2025",
    rating: 4.6,
    price: 7,
    description: "Tennessee Williams' Pulitzer Prize-winning play about Blanche DuBois and her descent into madness.",
    cast: "Lisa Monroe as Blanche, James Wilson as Stanley",
    duration: "2 hours 15 minutes",
    featured: true
  },
  {
    id: 5,
    title: "The Phantom of the Opera",
    image: "/api/placeholder/600/400",
    category: "Musical",
    date: "May 25 - June 25, 2025",
    rating: 4.9,
    price: 10,
    description: "Andrew Lloyd Webber's iconic musical about a mysterious figure who haunts an opera house.",
    cast: "Richard Davis as The Phantom, Emma White as Christine",
    duration: "2 hours 30 minutes",
    featured: true
  },
  {
    id: 6,
    title: "Chicago",
    image: "/api/placeholder/600/400",
    category: "Musical",
    date: "June 10 - July 5, 2025",
    rating: 4.8,
    price: 9.5,
    description: "The longest-running American musical on Broadway, set in the jazz age of the 1920s.",
    cast: "Jennifer Lopez as Roxie Hart, Nicole Smith as Velma Kelly",
    duration: "2 hours 15 minutes",
    featured: true
  }
];

const venues = [
  {
    id: 1,
    name: "Main Stage Theater",
    image: "/api/placeholder/800/500",
    capacity: 850,
    description: "Our largest venue with state-of-the-art facilities, perfect for major productions and musicals.",
    amenities: ["Professional Lighting", "Premium Sound System", "Orchestra Pit", "Large Backstage Area", "VIP Boxes"],
    pricePerDay: 3500,
    location: "123 Hamra Street, Beirut, Lebanon",
    featured: true
  },
  {
    id: 2,
    name: "Intimate Studio Theater",
    image: "/api/placeholder/800/500",
    capacity: 200,
    description: "A cozy venue ideal for smaller productions, experimental theater, and intimate performances.",
    amenities: ["Flexible Seating", "Modern Sound System", "Basic Lighting Setup", "Rehearsal Space"],
    pricePerDay: 1200,
    location: "123 Hamra Street, Beirut, Lebanon",
    featured: true
  },
  {
    id: 3,
    name: "The Black Box",
    image: "/api/placeholder/800/500",
    capacity: 150,
    description: "A versatile black box theater space that can be configured in multiple ways for innovative performances.",
    amenities: ["Configurable Space", "Basic Lighting Grid", "Sound System", "Dressing Rooms"],
    pricePerDay: 900,
    location: "123 Hamra Street, Beirut, Lebanon",
    featured: true
  },
  {
    id: 4,
    name: "Grand Hall",
    image: "/api/placeholder/800/500",
    capacity: 500,
    description: "An elegant venue with classical architecture, perfect for ballet, opera, and formal theater events.",
    amenities: ["Classical Architecture", "Premium Acoustics", "Orchestra Pit", "Balcony Seating", "Historical Setting"],
    pricePerDay: 2500,
    location: "123 Hamra Street, Beirut, Lebanon",
    featured: true
  }
];

const testimonials = [
  {
    text: "The booking process was seamless, and the customer service was exceptional. I had a wonderful time at the show!",
    name: "Jana Ellweis",
    title: "Theater Enthusiast",
    avatar: "/api/placeholder/100/100"
  },
  {
    text: "As a theater company, we found this platform incredibly useful for managing our performances and connecting with our audience.",
    name: "Aya Jamal",
    title: "Artistic Director",
    avatar: "/api/placeholder/100/100"
  },
  {
    text: "I love the real-time seat selection feature. It's so convenient to see exactly where you'll be sitting before booking.",
    name: "Leen Houchaimi",
    title: "Regular Patron",
    avatar: "/api/placeholder/100/100"
  }
];

// Valid coupon codes (only accessible to employees)
const couponCodes = [
  { code: "STAFF25", discount: 0.25, description: "25% Staff Discount" },
  { code: "FAMILY15", discount: 0.15, description: "15% Family & Friends Discount" },
  { code: "STUDENT10", discount: 0.10, description: "10% Student Discount" },
  { code: "OPENING50", discount: 0.50, description: "50% Opening Night Special" }
];

// Global variables
let isLoggedIn = false;
let cart = [];
let userType = 'client'; // client, company, or employee
let userEmail = '';
let appliedCoupon = null;

// DOM Ready Handler
document.addEventListener('DOMContentLoaded', function() {
  // Initialize page
  initNavigation();
  
  // Check for login state
  checkLoginStatus();
  
  // Load cart data
  loadCartFromStorage();
  updateCartCount();
  
  // Home page elements
  if (document.getElementById('featuredShows')) {
    renderFeaturedShows();
  }
  
  if (document.getElementById('testimonials')) {
    renderTestimonials();
  }
  
  // Shows page elements
  if (document.getElementById('allShows')) {
    renderShows(shows);
    setupFilters();
  }
  
  // Venues page elements
  if (document.getElementById('venuesGrid')) {
    renderVenues();
  }
  
  // Setup event listeners
  setupEventListeners();
  
  // Load modals
  loadModals();

  // Setup search functionality
  setupSearch();
});

// Initialize navigation
function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('show');
    });
  }
  
  // Add cart button to header
  const authButtons = document.querySelector('.auth-buttons');
  if (authButtons && !document.getElementById('cartBtn')) {
    // Create cart button (using popcorn icon)
    const cartButton = document.createElement('button');
    cartButton.className = 'btn btn-outline';
    cartButton.id = 'cartBtn';
    cartButton.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M7 8 L17 8 L19 21 L5 21 Z"></path>
        <path d="M9 8 C9 4 11 4 12 2 C13 4 15 4 15 8"></path>
        <path d="M8 10 C8.5 12 8 14 9 15"></path>
        <path d="M12 10 C12.5 12 12 14 13 15"></path>
        <path d="M16 10 C16.5 12 16 14 17 15"></path>
      </svg>
      <span id="cartCount" style="display: none; background-color: var(--secondary); color: white; width: 18px; height: 18px; border-radius: 50%; font-size: 12px; align-items: center; justify-content: center; position: absolute; top: -5px; right: -5px;">0</span>
    `;
    cartButton.style.position = 'relative';
    
    // Create book venue button
    const bookVenueBtn = document.createElement('button');
    bookVenueBtn.className = 'btn btn-primary';
    bookVenueBtn.id = 'bookVenueBtn';
    bookVenueBtn.textContent = 'Book Venue';
    bookVenueBtn.style.display = 'none'; // Hide initially

    // Create Apply Coupon button (only for employees)
    const applyCouponBtn = document.createElement('button');
    applyCouponBtn.className = 'btn btn-outline';
    applyCouponBtn.id = 'applyCouponBtn';
    applyCouponBtn.textContent = 'Apply Coupon';
    applyCouponBtn.style.display = 'none'; // Hide initially
    
    // Add buttons to header
    authButtons.insertBefore(cartButton, authButtons.firstChild);
    authButtons.insertBefore(bookVenueBtn, authButtons.firstChild);
    authButtons.insertBefore(applyCouponBtn, authButtons.firstChild);
    
    // Add event listeners
    cartButton.addEventListener('click', function() {
      openModal('cartModal');
      renderCart();
    });
    
    bookVenueBtn.addEventListener('click', function() {
      openModal('companyBookingModal');
    });

    applyCouponBtn.addEventListener('click', function() {
      openModal('couponModal');
    });
  }
}

// Setup common event listeners
function setupEventListeners() {
  // Login and register buttons
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  
  if (loginBtn) {
    loginBtn.addEventListener('click', function() {
      openModal('loginModal');
    });
  }
  
  if (registerBtn) {
    registerBtn.addEventListener('click', function() {
      openModal('registerModal');
    });
  }
  
  // Book buttons
  document.addEventListener('click', function(event) {
    // Show details/booking
    if (event.target.classList.contains('book-btn') || event.target.classList.contains('details-btn')) {
      const showId = event.target.getAttribute('data-id');
      showDetails(showId);
    }
    
    // Venue booking
    if (event.target.classList.contains('book-venue-btn')) {
      const venueId = event.target.getAttribute('data-id');
      bookVenue(venueId);
    }
    
    // Venue details
    if (event.target.classList.contains('venue-details-btn')) {
      const venueId = event.target.getAttribute('data-id');
      showVenueDetails(venueId);
    }
  });
  
  // FAQ toggles
  const faqToggles = document.querySelectorAll('.faq-toggle');
  faqToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const faqItem = this.closest('.faq-item');
      faqItem.classList.toggle('active');
    });
  });

  // Setup coupon form
  const couponForm = document.getElementById('couponForm');
  if (couponForm) {
    couponForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const couponCode = document.getElementById('couponCode').value.trim().toUpperCase();
      
      if (!couponCode) {
        alert('Please enter a coupon code');
        return;
      }
      
      // Check if code is valid
      const coupon = couponCodes.find(c => c.code === couponCode);
      
      if (coupon) {
        appliedCoupon = coupon;
        closeModal('couponModal');
        alert(`Coupon "${coupon.description}" has been applied successfully!`);
        
        // If cart is open, update it
        if (document.getElementById('cartModal').classList.contains('show')) {
          renderCart();
        }
      } else {
        alert('Invalid coupon code');
      }
    });
  }
}

// Setup search functionality
function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const searchResults = document.getElementById('searchResults');
  
  if (searchInput && searchBtn && searchResults) {
    const performSearch = function() {
      const query = searchInput.value.trim().toLowerCase();
      
      if (query.length < 2) {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        return;
      }
      
      // Search in shows
      const matchedShows = shows.filter(show => 
        show.title.toLowerCase().includes(query) || 
        show.category.toLowerCase().includes(query) || 
        show.description.toLowerCase().includes(query)
      );
      
      // Search in venues
      const matchedVenues = venues.filter(venue => 
        venue.name.toLowerCase().includes(query) || 
        venue.description.toLowerCase().includes(query)
      );
      
      // Display results
      if (matchedShows.length === 0 && matchedVenues.length === 0) {
        searchResults.innerHTML = '<p>No results found</p>';
      } else {
        let resultsHTML = '';
        
        if (matchedShows.length > 0) {
          resultsHTML += '<h3>Shows</h3><ul>';
          matchedShows.forEach(show => {
            resultsHTML += `
              <li>
                <a href="#" class="search-result-item" data-type="show" data-id="${show.id}">
                  ${show.title} - ${show.category}
                </a>
              </li>
            `;
          });
          resultsHTML += '</ul>';
        }
        
        if (matchedVenues.length > 0) {
          resultsHTML += '<h3>Venues</h3><ul>';
          matchedVenues.forEach(venue => {
            resultsHTML += `
              <li>
                <a href="#" class="search-result-item" data-type="venue" data-id="${venue.id}">
                  ${venue.name} - Capacity: ${venue.capacity}
                </a>
              </li>
            `;
          });
          resultsHTML += '</ul>';
        }
        
        searchResults.innerHTML = resultsHTML;
      }
      
      searchResults.style.display = 'block';
    };
    
    // Event listeners
    searchBtn.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      } else if (searchInput.value.trim().length >= 2) {
        performSearch();
      } else if (searchInput.value.trim().length === 0) {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
      }
    });
    
    // Handle search result clicks
    searchResults.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (e.target.classList.contains('search-result-item')) {
        const type = e.target.getAttribute('data-type');
        const id = e.target.getAttribute('data-id');
        
        if (type === 'show') {
          showDetails(id);
        } else if (type === 'venue') {
          showVenueDetails(id);
        }
        
        // Clear search
        searchInput.value = '';
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
      }
    });
    
    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target) && !searchBtn.contains(e.target)) {
        searchResults.style.display = 'none';
      }
    });
  }
}

// Load modals HTML
function loadModals() {
  const modalsContainer = document.getElementById('modalsContainer');
  if (!modalsContainer) return;
  
  // Create modals container
  modalsContainer.innerHTML = `
    <!-- Login Modal -->
    <div class="modal-backdrop" id="loginModal">
      <div class="modal">
        <button class="modal-close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h2 class="modal-title">Login to Your Account</h2>
        <form id="loginForm">
          <div class="form-group">
            <label for="loginEmail" class="form-label">Email Address</label>
            <input type="email" id="loginEmail" class="form-input" placeholder="Enter your email">
          </div>
          <div class="form-group">
            <label for="loginPassword" class="form-label">Password</label>
            <input type="password" id="loginPassword" class="form-input" placeholder="Enter your password">
          </div>
          <div class="form-switch">
            <input type="checkbox" id="rememberMe" class="form-check">
            <label for="rememberMe">Remember me</label>
          </div>
          <button type="submit" class="form-submit">Login</button>
          <div class="form-footer">
            <p>Don't have an account? <a href="#" id="switchToRegister">Register</a></p>
          </div>
        </form>
      </div>
    </div>

    <!-- Registration Modal -->
    <div class="modal-backdrop" id="registerModal">
      <div class="modal">
        <button class="modal-close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h2 class="modal-title">Create an Account</h2>
        <div class="user-type-toggle">
          <button type="button" class="user-type-btn active" data-type="client">Individual</button>
          <button type="button" class="user-type-btn" data-type="company">Company</button>
          <button type="button" class="user-type-btn" data-type="employee">Employee</button>
        </div>
        <form id="registerForm">
          <div class="form-group">
            <label for="registerName" class="form-label">Full Name</label>
            <input type="text" id="registerName" class="form-input" placeholder="Enter your full name">
          </div>
          <div class="form-group company-field" style="display: none;">
            <label for="companyName" class="form-label">Company Name</label>
            <input type="text" id="companyName" class="form-input" placeholder="Enter company name">
          </div>
          <div class="form-group employee-field" style="display: none;">
            <label for="employeeCode" class="form-label">Employee Code</label>
            <input type="text" id="employeeCode" class="form-input" placeholder="Enter employee code">
          </div>
          <div class="form-group">
            <label for="registerEmail" class="form-label">Email Address</label>
            <input type="email" id="registerEmail" class="form-input" placeholder="Enter your email">
          </div>
          <div class="form-group">
            <label for="registerPassword" class="form-label">Password</label>
            <input type="password" id="registerPassword" class="form-input" placeholder="Create a password">
          </div>
          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <input type="password" id="confirmPassword" class="form-input" placeholder="Confirm your password">
          </div>
          <button type="submit" class="form-submit">Register</button>
          <div class="form-footer">
            <p>Already have an account? <a href="#" id="switchToLogin">Login</a></p>
          </div>
        </form>
      </div>
    </div>

    <!-- Show Details Modal -->
    <div class="modal-backdrop show-details-modal" id="showDetailsModal">
      <div class="modal">
        <button class="modal-close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div id="showDetailsContent">
          <!-- Show details will be inserted here by JavaScript -->
        </div>
      </div>
    </div>

    <!-- Cart Modal -->
    <div class="modal-backdrop" id="cartModal">
      <div class="modal">
        <button class="modal-close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h2 class="modal-title">Your Cart</h2>
        <div id="cartContent">
          <!-- Cart content will be inserted here by JavaScript -->
        </div>
      </div>
    </div>

    <!-- Coupon Modal -->
    <div class="modal-backdrop" id="couponModal">
      <div class="modal">
        <button class="modal-close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h2 class="modal-title">Apply Coupon</h2>
        <form id="couponForm">
          <div class="form-group">
            <label for="couponCode" class="form-label">Enter Coupon Code</label>
            <input type="text" id="couponCode" class="form-input" placeholder="Enter coupon code">
          </div>
          <button type="submit" class="form-submit">Apply Coupon</button>
        </form>
      </div>
    </div>

    <!-- Company Booking Modal -->
    <div class="modal-backdrop" id="companyBookingModal">
      <div class="modal">
        <button class="modal-close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h2 class="modal-title">Book Entire Venue</h2>
        <form id="companyBookingForm">
          <div class="form-group">
            <label class="form-label">Select Date(s)</label>
            <div class="date-selector" id="dateSelector">
              <!-- Date selectors will be inserted here by JavaScript -->
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Select Time</label>
            <div class="time-selector" id="timeSelector">
              <!-- Time selectors will be inserted here by JavaScript -->
            </div>
          </div>
          <div class="form-group">
            <label for="eventTitle" class="form-label">Event Title</label>
            <input type="text" id="eventTitle" class="form-input" placeholder="Enter your event title">
          </div>
          <div class="form-group">
            <label for="eventDescription" class="form-label">Event Description</label>
            <textarea id="eventDescription" class="form-input" rows="4" placeholder="Describe your event"></textarea>
          </div>
          <div class="form-group">
            <label for="specialRequests" class="form-label">Special Requests</label>
            <textarea id="specialRequests" class="form-input" rows="3" placeholder="Any special requirements for the venue setup?"></textarea>
          </div>
          <button type="submit" class="form-submit">Request Booking</button>
        </form>
      </div>
    </div>
  `;
  
  // Set up modal event listeners
  setupModalListeners();
}

// Setup modal event listeners
function setupModalListeners() {
  // Close buttons
  const closeButtons = document.querySelectorAll('.modal-close');
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modalId = this.closest('.modal-backdrop').id;
      closeModal(modalId);
    });
  });
  
  // Switch between login and register
  const switchToRegister = document.getElementById('switchToRegister');
  const switchToLogin = document.getElementById('switchToLogin');
  
  if (switchToRegister) {
    switchToRegister.addEventListener('click', function(e) {
      e.preventDefault();
      closeModal('loginModal');
      openModal('registerModal');
    });
  }
  
  if (switchToLogin) {
    switchToLogin.addEventListener('click', function(e) {
      e.preventDefault();
      closeModal('registerModal');
      openModal('loginModal');
    });
  }
  
  // User type toggle
  const userTypeButtons = document.querySelectorAll('.user-type-btn');
  userTypeButtons.forEach(button => {
    button.addEventListener('click', function() {
      userTypeButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      userType = this.getAttribute('data-type');
      const companyFields = document.querySelectorAll('.company-field');
      const employeeFields = document.querySelectorAll('.employee-field');
      
      companyFields.forEach(field => {
        field.style.display = userType === 'company' ? 'block' : 'none';
      });

      employeeFields.forEach(field => {
        field.style.display = userType === 'employee' ? 'block' : 'none';
      });
    });
  });
  
  // Form submissions
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const companyBookingForm = document.getElementById('companyBookingForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      if (email && password) {
        isLoggedIn = true;
        userEmail = email;
        localStorage.setItem('cedarstage_logged_in', 'true');
        localStorage.setItem('cedarstage_user_type', userType);
        localStorage.setItem('cedarstage_user_email', email);
        
        closeModal('loginModal');
        updateLoginStatus();
        alert('You have been logged in successfully!');
      } else {
        alert('Please fill in all fields.');
      }
    });
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('registerName').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
      }
      
      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      // Check employee code if employee type
      if (userType === 'employee') {
        const employeeCode = document.getElementById('employeeCode').value;
        if (!employeeCode) {
          alert('Please enter your employee code.');
          return;
        }
        
        // Validate employee code (simple example - in real life this would check against a database)
        if (employeeCode !== 'CEDAR2025') {
          alert('Invalid employee code.');
          return;
        }
      }
      
      isLoggedIn = true;
      userEmail = email;
      localStorage.setItem('cedarstage_logged_in', 'true');
      localStorage.setItem('cedarstage_user_type', userType);
      localStorage.setItem('cedarstage_user_email', email);
      
      closeModal('registerModal');
      updateLoginStatus();
      alert('Account created successfully!');
    });
  }
  
  if (companyBookingForm) {
    // Setup date selector
    setupDateSelector();
    
    // Setup time selector
    setupTimeSelector();
    
    companyBookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const selectedDates = document.querySelectorAll('.date-item.selected');
      const selectedTime = document.querySelector('.time-item.selected');
      const eventTitle = document.getElementById('eventTitle').value;
      
      if (selectedDates.length === 0 || !selectedTime || !eventTitle) {
        alert('Please complete all required fields.');
        return;
      }
      
      closeModal('companyBookingModal');
      
      // Send confirmation email (simulated)
      if (userEmail) {
        sendConfirmationEmail(userEmail, 'venue', {
          title: eventTitle,
          dates: Array.from(selectedDates).map(date => date.getAttribute('data-date')),
          time: selectedTime.getAttribute('data-time')
        });
      }
      
      alert('Your venue booking request has been submitted. Our team will contact you shortly!');
    });
  }
  
  // Close modals when clicking on backdrop
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');
  modalBackdrops.forEach(backdrop => {
    backdrop.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal(this.id);
      }
    });
  });
}

// Open modal
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
  }
}

// Close modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
  }
}

// Close all modals
function closeAllModals() {
  const modals = document.querySelectorAll('.modal-backdrop');
  modals.forEach(modal => {
    modal.classList.remove('show');
  });
}

// Check login status
function checkLoginStatus() {
  const loggedIn = localStorage.getItem('cedarstage_logged_in');
  const storedUserType = localStorage.getItem('cedarstage_user_type');
  const storedEmail = localStorage.getItem('cedarstage_user_email');
  
  if (loggedIn === 'true') {
    isLoggedIn = true;
    userType = storedUserType || 'client';
    userEmail = storedEmail || '';
    updateLoginStatus();
  }
}

// Update login status in UI
function updateLoginStatus() {
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const bookVenueBtn = document.getElementById('bookVenueBtn');
  const applyCouponBtn = document.getElementById('applyCouponBtn');
  
  if (!loginBtn || !registerBtn) return;
  
  if (isLoggedIn) {
    // Hide login/register buttons
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    
    // Add user menu if not exists
    const authButtons = document.querySelector('.auth-buttons');
    
    if (!document.getElementById('userMenuBtn')) {
      const userMenuBtn = document.createElement('button');
      userMenuBtn.className = 'btn btn-outline';
      userMenuBtn.id = 'userMenuBtn';
      userMenuBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        My Account
      `;
      
      const logoutBtn = document.createElement('button');
      logoutBtn.className = 'btn btn-outline';
      logoutBtn.id = 'logoutBtn';
      logoutBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        Logout
      `;
      
      authButtons.appendChild(userMenuBtn);
      authButtons.appendChild(logoutBtn);
      
      logoutBtn.addEventListener('click', function() {
        isLoggedIn = false;
        userType = 'client';
        userEmail = '';
        appliedCoupon = null;
        localStorage.removeItem('cedarstage_logged_in');
        localStorage.removeItem('cedarstage_user_type');
        localStorage.removeItem('cedarstage_user_email');
        updateLoginStatus();
        alert('You have been logged out successfully.');
      });
    } else {
      document.getElementById('userMenuBtn').style.display = 'flex';
      document.getElementById('logoutBtn').style.display = 'flex';
    }
    
    // Show company booking button if company
    if (bookVenueBtn) {
      bookVenueBtn.style.display = userType === 'company' ? 'flex' : 'none';
    }
    
    // Show coupon button if employee
    if (applyCouponBtn) {
      applyCouponBtn.style.display = userType === 'employee' ? 'flex' : 'none';
    }
  } else {
    // Show login/register buttons
    loginBtn.style.display = 'flex';
    registerBtn.style.display = 'flex';
    
    // Hide user menu
    if (document.getElementById('userMenuBtn')) {
      document.getElementById('userMenuBtn').style.display = 'none';
      document.getElementById('logoutBtn').style.display = 'none';
    }
    
    // Hide company booking button
    if (bookVenueBtn) {
      bookVenueBtn.style.display = 'none';
    }
    
    // Hide coupon button
    if (applyCouponBtn) {
      applyCouponBtn.style.display = 'none';
    }
  }
}

// Send confirmation email (simulation)
function sendConfirmationEmail(email, type, details) {
  console.log(`Sending confirmation email to ${email}`);
  console.log(`Type: ${type}`);
  console.log('Details:', details);
  
  // In a real application, this would make an API call to send an actual email
  // For now, we'll just simulate it with an alert
  if (type === 'ticket') {
    
  } else if (type === 'venue') {
    alert(`Confirmation email sent to ${email} for your ticket purchase!`);
  }
}

// --------- HOME PAGE FUNCTIONS ---------

// Render featured shows
function renderFeaturedShows() {
  const featuredShowsContainer = document.getElementById('featuredShows');
  if (!featuredShowsContainer) return;
  
  const featuredShows = shows.filter(show => show.featured);
  
  featuredShowsContainer.innerHTML = '';
  
  featuredShows.forEach(show => {
    const showCard = document.createElement('div');
    showCard.className = 'show-card';
    showCard.setAttribute('data-id', show.id);
    
    showCard.innerHTML = `      <div class="show-content">
        <span class="show-category">${show.category}</span>
        <h3 class="show-title">${show.title}</h3>
        <div class="show-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          ${show.date}
        </div>
        <div class="show-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          ${show.duration}
        </div>
        <div class="show-rating">
          ${generateStarRating(show.rating)}
          <span>${show.rating.toFixed(1)}</span>
        </div>
        <div class="show-price">$${show.price}</div>
        <div class="show-actions">
          <button class="btn btn-primary book-btn" data-id="${show.id}">Book Now</button>
          <button class="btn btn-outline details-btn" data-id="${show.id}">Details</button>
        </div>
      </div>
    `;
    
    featuredShowsContainer.appendChild(showCard);
  });
}

// Render testimonials
function renderTestimonials() {
  const testimonialsContainer = document.getElementById('testimonials');
  if (!testimonialsContainer) return;
  
  testimonialsContainer.innerHTML = '';
  
  testimonials.forEach(testimonial => {
    const testimonialCard = document.createElement('div');
    testimonialCard.className = 'testimonial-card';
    
    testimonialCard.innerHTML = `
      <p class="testimonial-text">"${testimonial.text}"</p>
      <div class="testimonial-author">
                <div class="author-info">
          <h4>${testimonial.name}</h4>
          <p>${testimonial.title}</p>
        </div>
      </div>
    `;
    
    testimonialsContainer.appendChild(testimonialCard);
  });
}

// --------- SHOWS PAGE FUNCTIONS ---------

// Setup filters
function setupFilters() {
  const categoryFilter = document.getElementById('categoryFilter');
  const priceFilter = document.getElementById('priceFilter');
  const sortFilter = document.getElementById('sortFilter');
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterShows);
  }
  
  if (priceFilter) {
    priceFilter.addEventListener('change', filterShows);
  }
  
  if (sortFilter) {
    sortFilter.addEventListener('change', filterShows);
  }
}

// Filter shows based on selected filters
function filterShows() {
  let filteredShows = [...shows];
  
  // Get filter values
  const category = document.getElementById('categoryFilter').value;
  const price = document.getElementById('priceFilter').value;
  const sort = document.getElementById('sortFilter').value;
  
  // Apply category filter
  if (category !== 'all') {
    filteredShows = filteredShows.filter(show => show.category === category);
  }
  
  // Apply price filter
  if (price !== 'all') {
    if (price === 'under6') {
      filteredShows = filteredShows.filter(show => show.price < 6);
    } else if (price === '6to8') {
      filteredShows = filteredShows.filter(show => show.price >= 6 && show.price <= 8);
    } else if (price === '8to10') {
      filteredShows = filteredShows.filter(show => show.price > 8 && show.price <= 10);
    } else if (price === 'over10') {
      filteredShows = filteredShows.filter(show => show.price > 10);
    }
  }
  
  // Apply sorting
  if (sort === 'priceAsc') {
    filteredShows.sort((a, b) => a.price - b.price);
  } else if (sort === 'priceDesc') {
    filteredShows.sort((a, b) => b.price - a.price);
  } else if (sort === 'ratingDesc') {
    filteredShows.sort((a, b) => b.rating - a.rating);
  }
  
  // Render filtered shows
  renderShows(filteredShows);
}

// Render shows
function renderShows(showsData) {
  const showsContainer = document.getElementById('allShows');
  if (!showsContainer) return;
  
  showsContainer.innerHTML = '';
  
  if (showsData.length === 0) {
    showsContainer.innerHTML = '<p class="no-results">No shows match your filters. Please try different criteria.</p>';
    return;
  }
  
  showsData.forEach(show => {
    const showCard = document.createElement('div');
    showCard.className = 'show-card';
    showCard.setAttribute('data-id', show.id);
    
    showCard.innerHTML = `      <div class="show-content">
        <span class="show-category">${show.category}</span>
        <h3 class="show-title">${show.title}</h3>
        <div class="show-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          ${show.date}
        </div>
        <div class="show-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          ${show.duration}
        </div>
        <div class="show-rating">
          ${generateStarRating(show.rating)}
          <span>${show.rating.toFixed(1)}</span>
        </div>
        <div class="show-price">$${show.price}</div>
        <div class="show-actions">
          <button class="btn btn-primary book-btn" data-id="${show.id}">Book Now</button>
          <button class="btn btn-outline details-btn" data-id="${show.id}">Details</button>
        </div>
      </div>
    `;
    
    showsContainer.appendChild(showCard);
  });
}


// --- Updated Coupon & Purchase Logic ---
function applyCoupon(code, originalTotal) {
  const discounts = {
    'SAVE10': 0.10,
    'DISCOUNT5': 0.05
  };
  return discounts[code] ? originalTotal * (1 - discounts[code]) : originalTotal;
}




function confirmPurchase(user) {
  const subtotalElement = document.querySelector('.summary-row span');
  const totalElement = document.getElementById('totalPrice');
  const couponInput = document.getElementById('couponCode');

  let subtotal = parseFloat(subtotalElement?.innerText || '0');
  const taxRate = 0.08;
  let discount = 0;

  // Check coupon code
  const code = couponInput?.value.trim().toUpperCase();
  if (code === 'STAFF25') {
    discount = subtotal * 0.25;
  } else if (code === 'SAVE10') {
    discount = subtotal * 0.10;
  } else if (code === 'DISCOUNT5') {
    discount = subtotal * 0.05;
  }

  // Apply discount and calculate tax
  const discountedSubtotal = subtotal - discount;
  const tax = discountedSubtotal * taxRate;
  const total = discountedSubtotal + tax;

  // Update total in the DOM
  totalElement.innerText = '$' + total.toFixed(2);

  // Alert only after booking logic is done
  if (user.type === 'employee') {
    setTimeout(() => {
      alert('Your booking as an employee has been registered successfully.');
    }, 100);
  }
}



