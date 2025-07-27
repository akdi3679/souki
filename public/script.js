// Global state
let isLoggedIn = false
let currentUser = null
const currentLocation = { city: "New York, NY", range: 5 }
let currentTab = "home"
const currentBidFilter = "all"
let authToken = localStorage.getItem("authToken")

// API Configuration
const API_BASE = "/api"

// Initialize app
document.addEventListener("DOMContentLoaded", async () => {
  await initializeApp()
  setupEventListeners()

  if (authToken) {
    await validateToken()
  }

  updateAuthButton()
  loadInitialData()
})

// Initialize application
async function initializeApp() {
  try {
    // Check authentication status
    if (authToken) {
      await validateToken()
    }

    // Load initial data
    await loadInitialData()

    console.log("✅ Souki Marketplace initialized successfully!")
  } catch (error) {
    console.error("❌ Initialization error:", error)
    showError("Failed to initialize application")
  }
}

// Validate authentication token
async function validateToken() {
  try {
    const response = await fetch(`${API_BASE}/auth/validate`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      isLoggedIn = true
      currentUser = data.user
    } else {
      localStorage.removeItem("authToken")
      authToken = null
    }
  } catch (error) {
    console.error("Token validation error:", error)
    localStorage.removeItem("authToken")
    authToken = null
  }
}

// Load initial data
async function loadInitialData() {
  try {
    await Promise.all([loadDeals(), loadProducts(), loadHotBids(), loadGroups()])
  } catch (error) {
    console.error("Error loading initial data:", error)
  }
}

// API Helper functions
async function apiRequest(endpoint, options = {}) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
    ...options,
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config)

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  return response.json()
}

// Load deals
async function loadDeals() {
  try {
    showLoading("deals-grid")
    const data = await apiRequest("/products?featured=true&limit=10")

    const dealsGrid = document.getElementById("deals-grid")
    dealsGrid.innerHTML = ""

    data.products.forEach((product) => {
      const dealCard = createDealCard(product)
      dealsGrid.appendChild(dealCard)
    })
  } catch (error) {
    console.error("Error loading deals:", error)
    showError("Failed to load deals")
  }
}

// Load products
async function loadProducts() {
  try {
    showLoading("products-grid")
    const data = await apiRequest("/products?limit=12")

    const productsGrid = document.getElementById("products-grid")
    productsGrid.innerHTML = ""

    data.products.forEach((product) => {
      const productCard = createProductCard(product)
      productsGrid.appendChild(productCard)
    })
  } catch (error) {
    console.error("Error loading products:", error)
    showError("Failed to load products")
  }
}

// Load hot bids
async function loadHotBids() {
  try {
    const data = await apiRequest("/bids?status=active&limit=6")

    const hotBidsGrid = document.getElementById("hot-bids-grid")
    if (hotBidsGrid) {
      hotBidsGrid.innerHTML = ""

      data.bids.forEach((bid) => {
        const bidCard = createBidCard(bid)
        hotBidsGrid.appendChild(bidCard)
      })
    }
  } catch (error) {
    console.error("Error loading hot bids:", error)
  }
}

// Create deal card
function createDealCard(product) {
  const card = document.createElement("div")
  card.className = "deal-card"

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  card.innerHTML = `
    <div class="deal-badge">${discount > 0 ? `${discount}% OFF` : "DEAL"}</div>
    <div class="image-carousel">
      <div class="carousel-container" id="carousel-${product._id}">
        ${product.images
          .map(
            (image, index) => `
          <div class="carousel-slide ${index === 0 ? "active" : ""}">
            <img src="${image}" alt="${product.title}" loading="lazy">
          </div>
        `,
          )
          .join("")}
      </div>
      ${
        product.images.length > 1
          ? `
        <button class="carousel-btn prev" onclick="previousImage('${product._id}')">‹</button>
        <button class="carousel-btn next" onclick="nextImage('${product._id}')">›</button>
        <div class="carousel-nav">
          ${product.images
            .map(
              (_, index) => `
            <div class="carousel-dot ${index === 0 ? "active" : ""}" onclick="goToImage('${product._id}', ${index})"></div>
          `,
            )
            .join("")}
        </div>
      `
          : ""
      }
    </div>
    <div class="product-content">
      <h3 class="product-title">${product.title}</h3>
      <div class="product-condition ${product.condition}">${formatCondition(product.condition)}</div>
      <div class="product-price-section">
        ${product.originalPrice ? `<div class="original-price">$${product.originalPrice}</div>` : ""}
        <div class="product-price">$${product.price}</div>
        <div class="shipping-info ${product.shipping.freeShipping ? "free" : ""}">
          ${product.shipping.freeShipping ? "Free shipping" : `+$${product.shipping.cost} shipping`}
        </div>
      </div>
      <div class="product-actions">
        <button class="btn-primary" onclick="buyNow('${product._id}')">Buy Now</button>
        <button class="btn-icon" onclick="shareProduct('${product._id}')" title="Share">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.50-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
          </svg>
        </button>
        <button class="btn-icon" onclick="addToWishlist('${product._id}', 'product')" title="Add to Wishlist">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
          </svg>
        </button>
      </div>
      <div class="seller-info">
        <div class="seller-avatar">${product.seller.avatar || "👤"}</div>
        <div class="seller-details">
          <h4>${product.seller.name}</h4>
          <div class="seller-rating">
            <span class="rating-stars">${"★".repeat(Math.floor(product.seller.rating))}</span>
            <span>${product.seller.rating} (${product.seller.ratingCount})</span>
          </div>
        </div>
      </div>
    </div>
  `

  card.addEventListener("click", (e) => {
    if (!e.target.closest("button")) {
      showProductDetail(product._id)
    }
  })

  return card
}

// Create product card
function createProductCard(product) {
  const card = document.createElement("div")
  card.className = "product-card"

  card.innerHTML = `
    <div class="product-image-container">
      <img src="${product.images[0] || "/placeholder.svg"}" alt="${product.title}" class="product-image" loading="lazy">
    </div>
    <div class="product-content">
      <h3 class="product-title">${product.title}</h3>
      <div class="product-condition ${product.condition}">${formatCondition(product.condition)}</div>
      <div class="product-price">$${product.price}</div>
      <div class="shipping-info ${product.shipping.freeShipping ? "free" : ""}">
        ${product.shipping.freeShipping ? "Free shipping" : `+$${product.shipping.cost} shipping`}
      </div>
      <div class="seller-info">
        <div class="seller-avatar">${product.seller.avatar || "👤"}</div>
        <div class="seller-details">
          <h4>${product.seller.name}</h4>
          <div class="seller-rating">
            <span class="rating-stars">${"★".repeat(Math.floor(product.seller.rating))}</span>
            <span>${product.seller.rating}</span>
          </div>
        </div>
      </div>
    </div>
  `

  card.addEventListener("click", () => {
    showProductDetail(product._id)
  })

  return card
}

// Create bid card
function createBidCard(bid) {
  const card = document.createElement("div")
  card.className = "bid-card"

  const timeLeft = calculateTimeLeft(bid.endTime)
  const isEndingSoon = timeLeft.hours < 24

  card.innerHTML = `
    <div class="bid-header">
      <div class="bid-status ${getBidStatus(bid)}">${getBidStatusText(bid)}</div>
      <button class="btn-icon" onclick="addToWishlist('${bid._id}', 'bid')" title="Add to Watchlist">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>
    </div>
    <div class="bid-info">
      <div class="bid-image">
        <img src="${bid.images[0] || "/placeholder.svg"}" alt="${bid.title}" loading="lazy">
      </div>
      <div class="bid-details">
        <h4>${bid.title}</h4>
        <div class="bid-seller">by ${bid.seller.name}</div>
        <div class="bid-stats">
          <div class="bid-stat">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            ${bid.watchers.length} watching
          </div>
          <div class="bid-stat">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            ${bid.bids.length} bids
          </div>
          <div class="bid-stat">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            </svg>
            ${formatTimeLeft(timeLeft)}
          </div>
        </div>
      </div>
    </div>
    <div class="bid-pricing">
      <div class="current-bid">
        <div class="amount">$${bid.currentBid}</div>
        <div class="label">Current bid</div>
      </div>
      <div class="bid-count">
        <div class="number">${bid.bids.length}</div>
        <div class="label">Bids</div>
      </div>
      <div class="time-left ${isEndingSoon ? "ending-soon" : ""}">
        <div class="time">${formatTimeLeft(timeLeft)}</div>
        <div class="label">Time left</div>
      </div>
    </div>
    <div class="bid-actions">
      <button class="bid-btn" onclick="placeBid('${bid._id}')">
        Bid $${getMinimumBid(bid)}
      </button>
      <button class="bid-btn secondary" onclick="showProductDetail('${bid._id}')">
        View Details
      </button>
    </div>
  `

  return card
}

// Show product detail modal
async function showProductDetail(productId) {
  try {
    showLoading("product-detail-body")
    const modal = document.getElementById("product-detail-modal")
    modal.classList.add("show")
    document.body.style.overflow = "hidden"

    const data = await apiRequest(`/products/${productId}`)
    const product = data.product
    const similarProducts = data.similarProducts

    const detailBody = document.getElementById("product-detail-body")
    detailBody.innerHTML = `
      <div class="product-detail">
        <div class="product-detail-header">
          <div class="product-detail-images">
            <div class="main-image" onclick="zoomImage('${product.images[0]}')">
              <img src="${product.images[0]}" alt="${product.title}" id="main-product-image">
            </div>
            ${
              product.images.length > 1
                ? `
              <div class="image-thumbnails">
                ${product.images
                  .map(
                    (image, index) => `
                  <div class="thumbnail ${index === 0 ? "active" : ""}" onclick="changeMainImage('${image}', this)">
                    <img src="${image}" alt="Product image ${index + 1}">
                  </div>
                `,
                  )
                  .join("")}
              </div>
            `
                : ""
            }
          </div>
          <div class="product-detail-info">
            <h1 class="product-detail-title">${product.title}</h1>
            <div class="product-detail-price">
              <span class="current-price">$${product.price}</span>
              ${
                product.originalPrice
                  ? `
                <span class="original-price">$${product.originalPrice}</span>
                <span class="discount-percentage">${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF</span>
              `
                  : ""
              }
            </div>
            
            <div class="product-meta">
              <div class="meta-row">
                <span class="meta-label">Condition:</span>
                <span class="meta-value">${formatCondition(product.condition)}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Location:</span>
                <span class="meta-value">${product.location}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Shipping:</span>
                <span class="meta-value ${product.shipping.freeShipping ? "shipping-free" : ""}">
                  ${product.shipping.freeShipping ? "Free shipping" : `$${product.shipping.cost}`}
                  ${product.shipping.expedited ? " • Expedited available" : ""}
                </span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Returns:</span>
                <span class="meta-value ${product.returns.accepted ? "returns-accepted" : "returns-not-accepted"}">
                  ${product.returns.accepted ? `Accepted within ${product.returns.duration} days` : "Not accepted"}
                </span>
              </div>
            </div>
            
            <div class="product-actions">
              <button class="btn-primary" onclick="buyNow('${product._id}')">Buy Now</button>
              <button class="btn-secondary" onclick="contactSeller('${product.seller._id}')">Contact Seller</button>
              <button class="btn-icon" onclick="shareProduct('${product._id}')" title="Share">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.50-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                </svg>
              </button>
              <button class="btn-icon" onclick="addToWishlist('${product._id}', 'product')" title="Add to Wishlist">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                </svg>
              </button>
            </div>
            
            <div class="quick-message">
              <h4>Quick Message</h4>
              <textarea placeholder="Is this product still available?" id="quick-message-text">Is this product still available?</textarea>
              <button class="btn-primary" onclick="sendQuickMessage('${product.seller._id}')">Send Message</button>
            </div>
          </div>
        </div>
        
        <div class="seller-profile">
          <div class="seller-header">
            <div class="seller-avatar-large">${product.seller.avatar || "👤"}</div>
            <div>
              <div class="seller-name">${product.seller.name}</div>
              <div class="seller-joined">Member since ${formatDate(product.seller.joinedAt)}</div>
              <div class="profile-badges">
                ${product.seller.badges.map((badge) => `<span class="badge ${badge.toLowerCase().replace(" ", "-")}">${badge}</span>`).join("")}
              </div>
            </div>
          </div>
          <div class="seller-stats">
            <div class="seller-stat">
              <span class="seller-stat-number">${product.seller.rating}</span>
              <span class="seller-stat-label">Rating</span>
            </div>
            <div class="seller-stat">
              <span class="seller-stat-number">${product.seller.ratingCount}</span>
              <span class="seller-stat-label">Reviews</span>
            </div>
            <div class="seller-stat">
              <span class="seller-stat-number">${product.seller.followers.length}</span>
              <span class="seller-stat-label">Followers</span>
            </div>
            <div class="seller-stat">
              <span class="seller-stat-number">${product.seller.following.length}</span>
              <span class="seller-stat-label">Following</span>
            </div>
          </div>
        </div>
        
        <div class="product-description">
          <h3>Description</h3>
          <p>${product.description}</p>
        </div>
        
        ${
          similarProducts.length > 0
            ? `
          <div class="similar-items">
            <h3>Similar Items</h3>
            <div class="similar-grid">
              ${similarProducts
                .map(
                  (item) => `
                <div class="product-card" onclick="showProductDetail('${item._id}')">
                  <div class="product-image-container">
                    <img src="${item.images[0]}" alt="${item.title}" class="product-image">
                  </div>
                  <div class="product-content">
                    <h4 class="product-title">${item.title}</h4>
                    <div class="product-price">$${item.price}</div>
                  </div>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }
      </div>
    `
  } catch (error) {
    console.error("Error loading product detail:", error)
    showError("Failed to load product details")
  }
}

// Utility functions
function formatCondition(condition) {
  const conditions = {
    new: "New",
    "like-new": "Like New",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
  }
  return conditions[condition] || condition
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })
}

function calculateTimeLeft(endTime) {
  const now = new Date().getTime()
  const end = new Date(endTime).getTime()
  const difference = end - now

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  }
}

function formatTimeLeft(timeLeft) {
  if (timeLeft.days > 0) {
    return `${timeLeft.days}d ${timeLeft.hours}h`
  } else if (timeLeft.hours > 0) {
    return `${timeLeft.hours}h ${timeLeft.minutes}m`
  } else {
    return `${timeLeft.minutes}m ${timeLeft.seconds}s`
  }
}

function getBidStatus(bid) {
  const timeLeft = calculateTimeLeft(bid.endTime)
  if (timeLeft.days === 0 && timeLeft.hours < 24) {
    return "ending"
  }
  return bid.status
}

function getBidStatusText(bid) {
  const status = getBidStatus(bid)
  const statusTexts = {
    active: "LIVE",
    ending: "ENDING SOON",
    ended: "ENDED",
  }
  return statusTexts[status] || "LIVE"
}

function getMinimumBid(bid) {
  return bid.currentBid + 25 // Minimum increment
}

// Event handlers
function showTab(tabName) {
  // Hide all tabs
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active")
  })

  // Remove active class from nav icons
  document.querySelectorAll(".nav-icon").forEach((icon) => {
    icon.classList.remove("active")
  })

  // Show selected tab
  document.getElementById(`${tabName}-tab`).classList.add("active")

  // Add active class to clicked icon
  event.target.closest(".nav-icon").classList.add("active")

  currentTab = tabName

  // Load tab-specific content
  if (tabName === "bids") {
    loadHotBids()
  } else if (tabName === "groups") {
    loadGroups()
  }
}

function closeProductDetail() {
  document.getElementById("product-detail-modal").classList.remove("show")
  document.body.style.overflow = "auto"
}

function changeMainImage(imageSrc, thumbnail) {
  document.getElementById("main-product-image").src = imageSrc

  // Update active thumbnail
  document.querySelectorAll(".thumbnail").forEach((thumb) => {
    thumb.classList.remove("active")
  })
  thumbnail.classList.add("active")
}

function zoomImage(imageSrc) {
  const overlay = document.createElement("div")
  overlay.className = "zoom-overlay show"
  overlay.innerHTML = `<img src="${imageSrc}" class="zoom-image" alt="Zoomed product image">`

  overlay.addEventListener("click", () => {
    document.body.removeChild(overlay)
  })

  document.body.appendChild(overlay)
}

// Authentication functions
function toggleAuth() {
  if (isLoggedIn) {
    const dropdown = document.getElementById("profile-dropdown")
    dropdown.classList.toggle("show")
  } else {
    showAuthModal()
  }
}

function showAuthModal() {
  // Implementation for auth modal
  console.log("Show auth modal")
}

function updateAuthButton() {
  const authBtn = document.getElementById("auth-btn")
  const authBtnSpan = authBtn.querySelector("span")

  if (isLoggedIn && currentUser) {
    authBtnSpan.textContent = currentUser.name
  } else {
    authBtnSpan.textContent = "Register"
  }
}

// Loading and error states
function showLoading(elementId) {
  const element = document.getElementById(elementId)
  if (element) {
    element.innerHTML = '<div class="loading"><div class="spinner"></div></div>'
  }
}

function showError(message) {
  // Create and show error message
  const errorDiv = document.createElement("div")
  errorDiv.className = "error-message"
  errorDiv.textContent = message

  document.body.appendChild(errorDiv)

  setTimeout(() => {
    document.body.removeChild(errorDiv)
  }, 5000)
}

function showSuccess(message) {
  // Create and show success message
  const successDiv = document.createElement("div")
  successDiv.className = "success-message"
  successDiv.textContent = message

  document.body.appendChild(successDiv)

  setTimeout(() => {
    document.body.removeChild(successDiv)
  }, 3000)
}

// Setup event listeners
function setupEventListeners() {
  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".auth-container")) {
      document.getElementById("profile-dropdown").classList.remove("show")
    }
  })

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    const productModal = document.getElementById("product-detail-modal")
    if (e.target === productModal) {
      closeProductDetail()
    }
  })

  // Search functionality
  const searchInput = document.getElementById("main-search")
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        performSearch()
      }
    })
  }
}

// Placeholder functions for missing functionality
function performSearch() {
  console.log("Perform search")
}

function loadGroups() {
  console.log("Load groups")
}

function buyNow(productId) {
  if (!isLoggedIn) {
    showAuthModal()
    return
  }
  console.log("Buy now:", productId)
}

function addToWishlist(itemId, type) {
  if (!isLoggedIn) {
    showAuthModal()
    return
  }
  console.log("Add to wishlist:", itemId, type)
}

function shareProduct(productId) {
  if (navigator.share) {
    navigator.share({
      title: "Check out this product on Souki",
      url: `${window.location.origin}/product/${productId}`,
    })
  } else {
    // Fallback to clipboard
    navigator.clipboard.writeText(`${window.location.origin}/product/${productId}`)
    showSuccess("Link copied to clipboard!")
  }
}

function contactSeller(sellerId) {
  if (!isLoggedIn) {
    showAuthModal()
    return
  }
  console.log("Contact seller:", sellerId)
}

function sendQuickMessage(sellerId) {
  if (!isLoggedIn) {
    showAuthModal()
    return
  }

  const message = document.getElementById("quick-message-text").value
  console.log("Send message to:", sellerId, message)
  showSuccess("Message sent successfully!")
}

function placeBid(bidId) {
  if (!isLoggedIn) {
    showAuthModal()
    return
  }
  console.log("Place bid:", bidId)
}

// Image carousel functions
function nextImage(productId) {
  const carousel = document.getElementById(`carousel-${productId}`)
  // Implementation for next image
}

function previousImage(productId) {
  const carousel = document.getElementById(`carousel-${productId}`)
  // Implementation for previous image
}

function goToImage(productId, index) {
  const carousel = document.getElementById(`carousel-${productId}`)
  // Implementation for go to specific image
}

console.log("🚀 Souki Marketplace script loaded successfully!")
