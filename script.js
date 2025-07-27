// Global state
let isLoggedIn = false
let currentUser = null
let currentLocation = { city: "New York, NY", range: 5 }
let currentTab = "home"
let currentBidFilter = "all"

// Sample data
const sampleDeals = [
  {
    id: 1,
    title: "iPhone 14 Pro Max",
    originalPrice: 1099,
    currentPrice: 899,
    discount: 18,
    location: "Manhattan, NY",
    image: "📱",
    badge: "HOT DEAL",
    type: "deal",
  },
  {
    id: 2,
    title: "MacBook Air M2",
    originalPrice: 1199,
    currentPrice: 999,
    discount: 17,
    location: "Brooklyn, NY",
    image: "💻",
    badge: "LIMITED TIME",
    type: "deal",
  },
  {
    id: 3,
    title: "Sony WH-1000XM4",
    originalPrice: 349,
    currentPrice: 249,
    discount: 29,
    location: "Queens, NY",
    image: "🎧",
    badge: "FLASH SALE",
    type: "deal",
  },
  {
    id: 4,
    title: "Nintendo Switch OLED",
    originalPrice: 349,
    currentPrice: 299,
    discount: 14,
    location: "Bronx, NY",
    image: "🎮",
    badge: "DEAL",
    type: "deal",
  },
  {
    id: 5,
    title: 'Samsung 4K TV 55"',
    originalPrice: 799,
    currentPrice: 599,
    discount: 25,
    location: "Staten Island, NY",
    image: "📺",
    badge: "MEGA DEAL",
    type: "deal",
  },
]

const sampleProducts = [
  {
    id: 1,
    title: "Vintage Leather Jacket",
    price: 89,
    condition: "Like New",
    location: "Manhattan, NY",
    rating: 4.8,
    image: "🧥",
    category: "fashion",
    type: "product",
  },
  {
    id: 2,
    title: "Mountain Bike",
    price: 450,
    condition: "Good",
    location: "Brooklyn, NY",
    rating: 4.5,
    image: "🚴",
    category: "sports",
    type: "product",
  },
  {
    id: 3,
    title: "Coffee Table",
    price: 120,
    condition: "Excellent",
    location: "Queens, NY",
    rating: 4.9,
    image: "🪑",
    category: "home",
    type: "product",
  },
  {
    id: 4,
    title: "Guitar Acoustic",
    price: 200,
    condition: "Good",
    location: "Staten Island, NY",
    rating: 4.6,
    image: "🎸",
    category: "music",
    type: "product",
  },
  {
    id: 5,
    title: "Designer Handbag",
    price: 75,
    condition: "Like New",
    location: "Manhattan, NY",
    rating: 4.7,
    image: "👜",
    category: "fashion",
    type: "product",
  },
  {
    id: 6,
    title: "Smart Watch",
    price: 180,
    condition: "Excellent",
    location: "Brooklyn, NY",
    rating: 4.8,
    image: "⌚",
    category: "electronics",
    type: "product",
  },
]

const sampleBids = [
  {
    id: 1,
    title: "Rare Vintage Camera Leica M3",
    currentBid: 1250,
    bidCount: 23,
    watchers: 156,
    timeLeft: "2h 34m",
    minBid: 1300,
    image: "📷",
    badge: "LIVE",
    status: "live",
    seller: "VintageCollector",
    type: "bid",
  },
  {
    id: 2,
    title: "Gaming PC RTX 4080 Setup",
    currentBid: 2100,
    bidCount: 45,
    watchers: 289,
    timeLeft: "1d 5h",
    minBid: 2150,
    image: "🖥️",
    badge: "HOT",
    status: "live",
    seller: "TechGuru",
    type: "bid",
  },
  {
    id: 3,
    title: "Antique Wooden Desk",
    currentBid: 450,
    bidCount: 12,
    watchers: 67,
    timeLeft: "4h 12m",
    minBid: 475,
    image: "🪑",
    badge: "ENDING SOON",
    status: "ending",
    seller: "AntiqueDealer",
    type: "bid",
  },
  {
    id: 4,
    title: "Professional DSLR Canon 5D",
    currentBid: 890,
    bidCount: 34,
    watchers: 123,
    timeLeft: "3d 2h",
    minBid: 920,
    image: "📸",
    badge: "LIVE",
    status: "live",
    seller: "PhotoPro",
    type: "bid",
  },
]

const sampleGroups = [
  {
    id: 1,
    name: "Electronics Enthusiasts",
    members: 15420,
    description: "Buy, sell, and discuss the latest electronics and gadgets.",
    icon: "📱",
    category: "electronics",
    privacy: "public",
    isPopular: true,
  },
  {
    id: 2,
    name: "Vintage Fashion Lovers",
    members: 8930,
    description: "Find unique vintage clothing and accessories.",
    icon: "👗",
    category: "fashion",
    privacy: "public",
    isPopular: true,
  },
  {
    id: 3,
    name: "Home & Garden",
    members: 12150,
    description: "Everything for your home and garden needs.",
    icon: "🏡",
    category: "home",
    privacy: "public",
    isPopular: true,
  },
  {
    id: 4,
    name: "Car Parts & Accessories",
    members: 6780,
    description: "Automotive parts, accessories, and discussions.",
    icon: "🚗",
    category: "automotive",
    privacy: "public",
    isPopular: false,
  },
  {
    id: 5,
    name: "Gaming Community",
    members: 9845,
    description: "Gaming gear, consoles, and game discussions.",
    icon: "🎮",
    category: "electronics",
    privacy: "public",
    isPopular: true,
  },
  {
    id: 6,
    name: "Book Collectors",
    members: 4567,
    description: "Rare books, textbooks, and literary discussions.",
    icon: "📚",
    category: "books",
    privacy: "private",
    isPopular: false,
  },
]

const sampleConversations = [
  {
    id: 1,
    name: "John Smith",
    lastMessage: "Is the laptop still available?",
    time: "2m ago",
    unread: true,
    avatar: "👤",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    lastMessage: "Thanks for the quick delivery!",
    time: "1h ago",
    unread: false,
    avatar: "👩",
  },
  {
    id: 3,
    name: "Mike Wilson",
    lastMessage: "Can you do $150 for the bike?",
    time: "3h ago",
    unread: true,
    avatar: "👨",
  },
]

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  loadDeals()
  loadProducts()
  loadBids()
  loadGroups()
  loadConversations()
  setupEventListeners()
  updateAuthButton()
  updateRangeCircle()
  updateWishlistContent()
})

// Tab management
function showTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active")
  })

  // Remove active class from all nav icons
  document.querySelectorAll(".nav-icon").forEach((icon) => {
    icon.classList.remove("active")
  })

  // Show selected tab
  document.getElementById(`${tabName}-tab`).classList.add("active")

  // Add active class to clicked nav icon
  event.target.closest(".nav-icon").classList.add("active")

  currentTab = tabName

  // Load tab-specific content
  if (tabName === "groups") {
    loadGroups()
  } else if (tabName === "bids") {
    loadBids()
  } else if (tabName === "wishlist") {
    updateWishlistContent()
  } else if (tabName === "messages") {
    loadConversations()
  }
}

// Load deals
function loadDeals() {
  const dealsGrid = document.getElementById("deals-grid")
  dealsGrid.innerHTML = ""

  sampleDeals.forEach((deal) => {
    const dealCard = createDealCard(deal)
    dealsGrid.appendChild(dealCard)
  })
}

// Create deal card
function createDealCard(deal) {
  const card = document.createElement("div")
  card.className = "deal-card"
  card.innerHTML = `
    <div class="deal-badge">${deal.badge}</div>
    <div class="deal-image">${deal.image}</div>
    <div class="deal-content">
      <h3 class="deal-title">${deal.title}</h3>
      <div class="deal-location">
        <i class="fas fa-map-marker-alt"></i>
        ${deal.location}
      </div>
      <div class="deal-prices">
        <span class="original-price">$${deal.originalPrice}</span>
        <span class="current-price">$${deal.currentPrice}</span>
        <span class="discount-badge">${deal.discount}% OFF</span>
      </div>
    </div>
  `

  card.addEventListener("click", () => {
    showItemDetail(deal)
  })

  return card
}

// Load products
function loadProducts() {
  const productsGrid = document.getElementById("products-grid")
  productsGrid.innerHTML = ""

  sampleProducts.forEach((product) => {
    const productCard = createProductCard(product)
    productsGrid.appendChild(productCard)
  })
}

// Create product card
function createProductCard(product) {
  const card = document.createElement("div")
  card.className = "product-card"
  card.innerHTML = `
    <div class="product-image">${product.image}</div>
    <div class="product-content">
      <h3 class="product-title">${product.title}</h3>
      <div class="product-price">$${product.price}</div>
      <div class="product-meta">
        <span>${product.condition} • ${product.location}</span>
        <div class="product-rating">
          <span class="stars">★★★★★</span>
          <span>${product.rating}</span>
        </div>
      </div>
    </div>
  `

  card.addEventListener("click", () => {
    showItemDetail(product)
  })

  return card
}

// Load bids
function loadBids() {
  const bidsContainer = document.getElementById("bids-container")
  bidsContainer.innerHTML = ""

  let filteredBids = sampleBids

  if (currentBidFilter !== "all") {
    filteredBids = sampleBids.filter((bid) => {
      switch (currentBidFilter) {
        case "ending":
          return bid.status === "ending"
        case "finished":
          return bid.status === "finished"
        case "coming":
          return bid.status === "coming"
        case "watching":
          return bid.status === "watching"
        default:
          return true
      }
    })
  }

  filteredBids.forEach((bid) => {
    const bidCard = createBidCard(bid)
    bidsContainer.appendChild(bidCard)
  })
}

// Create bid card
function createBidCard(bid) {
  const card = document.createElement("div")
  card.className = "bid-card"
  card.innerHTML = `
    <div class="bid-header">
      <div class="bid-badge ${bid.status}">${bid.badge}</div>
      <button onclick="addToWishlist(${bid.id}, 'bid')" style="background: none; border: none; color: #65676b; cursor: pointer;">
        <i class="fas fa-heart"></i>
      </button>
    </div>
    <div class="bid-info">
      <div class="bid-image">${bid.image}</div>
      <div class="bid-details">
        <h4>${bid.title}</h4>
        <p>by ${bid.seller}</p>
        <div class="bid-stats">
          <span><i class="fas fa-eye"></i> ${bid.watchers} watching</span>
          <span><i class="fas fa-gavel"></i> ${bid.bidCount} bids</span>
          <span><i class="fas fa-clock"></i> ${bid.timeLeft}</span>
        </div>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
      <div>
        <div style="font-size: 18px; font-weight: 600; color: #1877f2;">$${bid.currentBid}</div>
        <div style="font-size: 12px; color: #65676b;">Current bid</div>
      </div>
    </div>
    <div class="bid-actions">
      <button class="bid-btn" onclick="placeBid(${bid.id})">
        Bid $${bid.minBid}
      </button>
      <button class="bid-btn" style="background: #42b883;" onclick="showItemDetail(${JSON.stringify(bid).replace(/"/g, "&quot;")})">
        View Details
      </button>
    </div>
  `

  return card
}

// Filter bids
function filterBids(filter) {
  currentBidFilter = filter

  // Update active tab
  document.querySelectorAll(".bid-tab").forEach((tab) => {
    tab.classList.remove("active")
  })
  event.target.classList.add("active")

  loadBids()
}

// Place bid
function placeBid(bidId) {
  if (!isLoggedIn) {
    showAuthModal()
    return
  }

  const bid = sampleBids.find((b) => b.id === bidId)
  const newBidAmount = prompt(`Enter your bid amount (minimum $${bid.minBid}):`)

  if (newBidAmount && Number.parseFloat(newBidAmount) >= bid.minBid) {
    alert(`Bid placed successfully for $${newBidAmount}!`)
    // Update bid data
    bid.currentBid = Number.parseFloat(newBidAmount)
    bid.bidCount += 1
    bid.minBid = Number.parseFloat(newBidAmount) + 25
    loadBids()
  } else if (newBidAmount) {
    alert(`Bid must be at least $${bid.minBid}`)
  }
}

// Load groups
function loadGroups() {
  const popularGroupsContainer = document.getElementById("popular-groups")
  const allGroupsContainer = document.getElementById("all-groups")

  if (popularGroupsContainer) {
    popularGroupsContainer.innerHTML = ""
    sampleGroups
      .filter((group) => group.isPopular)
      .forEach((group) => {
        const groupCard = createPopularGroupCard(group)
        popularGroupsContainer.appendChild(groupCard)
      })
  }

  if (allGroupsContainer) {
    allGroupsContainer.innerHTML = ""
    sampleGroups.forEach((group) => {
      const groupCard = createGroupCard(group)
      allGroupsContainer.appendChild(groupCard)
    })
  }
}

// Create popular group card (horizontal)
function createPopularGroupCard(group) {
  const card = document.createElement("div")
  card.className = "deal-card"
  card.style.minWidth = "280px"
  card.innerHTML = `
    <div class="deal-image">${group.icon}</div>
    <div class="deal-content">
      <h3 class="deal-title">${group.name}</h3>
      <div class="deal-location">
        <i class="fas fa-users"></i>
        ${group.members.toLocaleString()} members
      </div>
      <p style="font-size: 14px; color: #65676b; margin: 10px 0;">${group.description}</p>
      <button class="join-group-btn" onclick="joinGroup(${group.id})">
        ${group.privacy === "private" ? "Request to Join" : "Join Group"}
      </button>
    </div>
  `

  return card
}

// Create group card
function createGroupCard(group) {
  const card = document.createElement("div")
  card.className = "group-card"
  card.innerHTML = `
    <div class="group-header">
      <div class="group-icon">${group.icon}</div>
      <div class="group-info">
        <h4>${group.name}</h4>
        <div class="group-members">
          ${group.members.toLocaleString()} members • 
          <span style="color: ${group.privacy === "private" ? "#ff9500" : "#34c759"};">
            <i class="fas fa-${group.privacy === "private" ? "lock" : "globe"}"></i>
            ${group.privacy}
          </span>
        </div>
      </div>
    </div>
    <p class="group-description">${group.description}</p>
    <button class="join-group-btn" onclick="joinGroup(${group.id})">
      ${group.privacy === "private" ? "Request to Join" : "Join Group"}
    </button>
  `

  return card
}

// Join group
function joinGroup(groupId) {
  if (!isLoggedIn) {
    showAuthModal()
    return
  }

  const group = sampleGroups.find((g) => g.id === groupId)
  const action = group.privacy === "private" ? "Request sent to" : "Joined"
  alert(`${action} ${group.name}!`)
}

// Filter groups
function filterGroups() {
  const filter = document.getElementById("group-category-filter").value
  const allGroupsContainer = document.getElementById("all-groups")

  allGroupsContainer.innerHTML = ""

  let filteredGroups = sampleGroups
  if (filter !== "all") {
    filteredGroups = sampleGroups.filter((group) => group.category === filter)
  }

  filteredGroups.forEach((group) => {
    const groupCard = createGroupCard(group)
    allGroupsContainer.appendChild(groupCard)
  })
}

// Search groups
function searchGroups() {
  const searchTerm = document.getElementById("group-search").value.toLowerCase()
  const allGroupsContainer = document.getElementById("all-groups")

  allGroupsContainer.innerHTML = ""

  const filteredGroups = sampleGroups.filter(
    (group) => group.name.toLowerCase().includes(searchTerm) || group.description.toLowerCase().includes(searchTerm),
  )

  filteredGroups.forEach((group) => {
    const groupCard = createGroupCard(group)
    allGroupsContainer.appendChild(groupCard)
  })
}

// Load conversations
function loadConversations() {
  const conversationsList = document.getElementById("conversations-list")
  if (!conversationsList) return

  conversationsList.innerHTML = ""

  sampleConversations.forEach((conversation) => {
    const conversationItem = document.createElement("div")
    conversationItem.style.cssText = `
      padding: 15px;
      border-bottom: 1px solid #e4e6ea;
      cursor: pointer;
      transition: background 0.3s ease;
    `

    conversationItem.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="font-size: 24px;">${conversation.avatar}</div>
        <div style="flex: 1;">
          <div style="font-weight: 600; margin-bottom: 5px;">${conversation.name}</div>
          <div style="font-size: 14px; color: #65676b; ${conversation.unread ? "font-weight: 600;" : ""}">${conversation.lastMessage}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 12px; color: #65676b;">${conversation.time}</div>
          ${conversation.unread ? '<div style="width: 8px; height: 8px; background: #1877f2; border-radius: 50%; margin: 5px auto 0;"></div>' : ""}
        </div>
      </div>
    `

    conversationItem.addEventListener("mouseenter", () => {
      conversationItem.style.background = "#f0f2f5"
    })

    conversationItem.addEventListener("mouseleave", () => {
      conversationItem.style.background = "transparent"
    })

    conversationItem.addEventListener("click", () => {
      openChat(conversation)
    })

    conversationsList.appendChild(conversationItem)
  })
}

// Open chat
function openChat(conversation) {
  document.getElementById("chat-title").textContent = conversation.name
  const chatMessages = document.getElementById("chat-messages")

  chatMessages.innerHTML = `
    <div style="margin-bottom: 20px;">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
        <div style="font-size: 32px;">${conversation.avatar}</div>
        <div>
          <div style="font-weight: 600; font-size: 18px;">${conversation.name}</div>
          <div style="color: #65676b;">Active 2 hours ago</div>
        </div>
      </div>
    </div>
    
    <div style="margin-bottom: 15px;">
      <div style="background: #f0f2f5; padding: 10px 15px; border-radius: 18px; display: inline-block; max-width: 70%;">
        ${conversation.lastMessage}
      </div>
      <div style="font-size: 12px; color: #65676b; margin-top: 5px;">${conversation.time}</div>
    </div>
    
    <div style="text-align: right; margin-bottom: 15px;">
      <div style="background: #1877f2; color: white; padding: 10px 15px; border-radius: 18px; display: inline-block; max-width: 70%;">
        Hi! I'm interested in the item you posted.
      </div>
      <div style="font-size: 12px; color: #65676b; margin-top: 5px;">1h ago</div>
    </div>
  `
}

// Update wishlist content
function updateWishlistContent() {
  const wishlistContent = document.getElementById("wishlist-content")

  if (!isLoggedIn) {
    wishlistContent.innerHTML = `
      <div class="signin-message">
        <h3>Sign in to see your wishlist</h3>
        <p>Save items you're interested in and keep track of your favorite finds</p>
        <button class="auth-submit-btn" onclick="showAuthModal()">Sign In</button>
      </div>
    `
    return
  }

  // Show wishlist items categorized
  wishlistContent.innerHTML = `
    <div class="section-header">
      <h2>My Wishlist</h2>
      <p>Items you've saved for later</p>
    </div>
    
    <div style="margin-bottom: 30px;">
      <h3 style="margin-bottom: 15px;">Deals (2)</h3>
      <div class="products-grid">
        ${createWishlistItem(sampleDeals[0])}
        ${createWishlistItem(sampleDeals[1])}
      </div>
    </div>
    
    <div style="margin-bottom: 30px;">
      <h3 style="margin-bottom: 15px;">Products (1)</h3>
      <div class="products-grid">
        ${createWishlistItem(sampleProducts[0])}
      </div>
    </div>
    
    <div style="margin-bottom: 30px;">
      <h3 style="margin-bottom: 15px;">Bids (1)</h3>
      <div class="products-grid">
        ${createWishlistItem(sampleBids[0])}
      </div>
    </div>
  `
}

// Create wishlist item
function createWishlistItem(item) {
  const price = item.currentPrice || item.price || item.currentBid
  const badge = item.type === "bid" ? "AUCTION" : item.type === "deal" ? "DEAL" : "PRODUCT"

  return `
    <div class="product-card" onclick="showItemDetail(${JSON.stringify(item).replace(/"/g, "&quot;")})">
      <div class="product-image">${item.image}</div>
      <div class="product-content">
        <div style="background: #1877f2; color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px; display: inline-block; margin-bottom: 8px;">
          ${badge}
        </div>
        <h3 class="product-title">${item.title}</h3>
        <div class="product-price">$${price}</div>
        <div class="product-meta">
          <span>${item.condition || "Good"} • ${item.location}</span>
          <button onclick="removeFromWishlist(${item.id}); event.stopPropagation();" style="background: none; border: none; color: #ff3b30; cursor: pointer;">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `
}

// Add to wishlist
function addToWishlist(itemId, type) {
  if (!isLoggedIn) {
    showAuthModal()
    return
  }

  alert("Added to wishlist!")
  // Update badge count
  const badge = document.querySelector('.nav-icon[title="Wishlist"] .badge')
  if (badge) {
    badge.textContent = Number.parseInt(badge.textContent) + 1
  }
}

// Remove from wishlist
function removeFromWishlist(itemId) {
  alert("Removed from wishlist!")
  updateWishlistContent()

  // Update badge count
  const badge = document.querySelector('.nav-icon[title="Wishlist"] .badge')
  if (badge) {
    const count = Math.max(0, Number.parseInt(badge.textContent) - 1)
    badge.textContent = count
    if (count === 0) badge.style.display = "none"
  }
}

// Show item detail
function showItemDetail(item) {
  const modal = document.getElementById("detail-modal")
  const content = document.getElementById("detail-content-body")

  const price = item.currentPrice || item.price || item.currentBid
  const originalPrice = item.originalPrice || null

  content.innerHTML = `
    <div style="padding: 30px;">
      <div style="display: flex; gap: 30px; margin-bottom: 30px;">
        <div style="flex: 1;">
          <div style="font-size: 120px; text-align: center; background: #f5f5f7; border-radius: 15px; padding: 40px;">
            ${item.image}
          </div>
        </div>
        <div style="flex: 1;">
          <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 15px;">${item.title}</h1>
          
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
            ${originalPrice ? `<span style="text-decoration: line-through; color: #86868b; font-size: 18px;">$${originalPrice}</span>` : ""}
            <span style="font-size: 32px; font-weight: 700; color: #1877f2;">$${price}</span>
            ${item.discount ? `<span style="background: #34c759; color: white; padding: 4px 8px; border-radius: 10px; font-size: 14px;">${item.discount}% OFF</span>` : ""}
          </div>
          
          ${
            item.type === "bid"
              ? `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Current bid:</span>
                <strong>$${item.currentBid}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Number of bids:</span>
                <strong>${item.bidCount}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Time left:</span>
                <strong style="color: #ff3b30;">${item.timeLeft}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Watchers:</span>
                <strong>${item.watchers}</strong>
              </div>
            </div>
          `
              : ""
          }
          
          <div style="margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
              <i class="fas fa-map-marker-alt" style="color: #65676b;"></i>
              <span>${item.location}</span>
            </div>
            ${
              item.condition
                ? `
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <i class="fas fa-info-circle" style="color: #65676b;"></i>
                <span>Condition: ${item.condition}</span>
              </div>
            `
                : ""
            }
            ${
              item.seller
                ? `
              <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-user" style="color: #65676b;"></i>
                <span>Seller: ${item.seller}</span>
              </div>
            `
                : ""
            }
          </div>
          
          <div style="display: flex; gap: 10px;">
            ${
              item.type === "bid"
                ? `
              <button class="auth-submit-btn" onclick="placeBid(${item.id})" style="flex: 1;">
                Place Bid ($${item.minBid})
              </button>
            `
                : `
              <button class="auth-submit-btn" style="flex: 1;">
                ${item.type === "deal" ? "Buy Now" : "Contact Seller"}
              </button>
            `
            }
            <button onclick="addToWishlist(${item.id}, '${item.type}')" style="padding: 12px; background: #f0f2f5; border: none; border-radius: 8px; cursor: pointer;">
              <i class="fas fa-heart"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div>
        <h3 style="margin-bottom: 15px;">Description</h3>
        <p style="line-height: 1.6; color: #515154;">
          This is a detailed description of the ${item.title}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>
    </div>
  `

  modal.classList.add("show")
  document.body.style.overflow = "hidden"
}

// Close detail modal
function closeDetailModal() {
  document.getElementById("detail-modal").classList.remove("show")
  document.body.style.overflow = "auto"
}

// Setup event listeners
function setupEventListeners() {
  // Range slider
  const rangeSlider = document.getElementById("range-slider")
  const rangeValue = document.getElementById("range-value")

  if (rangeSlider && rangeValue) {
    rangeSlider.addEventListener("input", function () {
      rangeValue.textContent = `${this.value} km`
      updateRangeCircle()
    })
  }

  // Search functionality
  const searchInput = document.querySelector(".search-input")
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        performSearch()
      }
    })
  }

  // Category selectors
  const categorySelects = document.querySelectorAll(".category-select, .category-nav-select")
  categorySelects.forEach((select) => {
    select.addEventListener("change", function () {
      filterByCategory(this.value)
    })
  })

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".auth-container")) {
      document.getElementById("profile-dropdown").classList.remove("show")
    }
  })
}

// Update range circle
function updateRangeCircle() {
  const rangeSlider = document.getElementById("range-slider")
  const rangeCircle = document.getElementById("range-circle")

  if (rangeSlider && rangeCircle) {
    const range = rangeSlider.value
    const size = Math.min(200, range * 4) // Scale the circle size

    rangeCircle.style.width = `${size}px`
    rangeCircle.style.height = `${size}px`
  }
}

// Perform search
function performSearch() {
  const searchInput = document.querySelector(".search-input")
  const categorySelect = document.querySelector(".category-select")

  const query = searchInput.value.trim()
  const category = categorySelect.value

  if (!query) {
    alert("Please enter a search term")
    return
  }

  // Show search results tab
  showSearchResults(query, category)
}

// Show search results
function showSearchResults(query, category) {
  // Hide all tabs
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active")
  })

  // Show search results
  document.getElementById("search-results").classList.add("active")

  // Simulate search results
  const allItems = [...sampleDeals, ...sampleProducts, ...sampleBids]
  const filteredItems = allItems.filter((item) => {
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === "all" || item.category === category
    return matchesQuery && matchesCategory
  })

  const resultsGrid = document.getElementById("search-results-grid")
  resultsGrid.innerHTML = ""

  if (filteredItems.length === 0) {
    resultsGrid.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; grid-column: 1 / -1;">
        <i class="fas fa-search" style="font-size: 48px; color: #d2d2d7; margin-bottom: 15px;"></i>
        <h3>No results found</h3>
        <p style="color: #65676b;">Try adjusting your search terms or filters</p>
      </div>
    `
    return
  }

  filteredItems.forEach((item) => {
    const card =
      item.type === "deal" ? createDealCard(item) : item.type === "bid" ? createBidCard(item) : createProductCard(item)
    resultsGrid.appendChild(card)
  })
}

// Filter by category
function filterByCategory(category) {
  // Update active category
  document.querySelectorAll(".category-item").forEach((item) => {
    item.classList.remove("active")
  })

  if (event && event.target.classList.contains("category-item")) {
    event.target.classList.add("active")
  }

  console.log(`Filtering by category: ${category}`)
  // Implement category filtering logic here
}

// Auth functions
function toggleAuth() {
  if (isLoggedIn) {
    // Show profile dropdown
    const dropdown = document.getElementById("profile-dropdown")
    dropdown.classList.toggle("show")
  } else {
    showAuthModal()
  }
}

function showAuthModal() {
  document.getElementById("auth-modal").style.display = "block"
  document.body.style.overflow = "hidden"
}

function closeAuthModal() {
  document.getElementById("auth-modal").style.display = "none"
  document.body.style.overflow = "auto"
}

function switchToSignup() {
  document.getElementById("login-form").style.display = "none"
  document.getElementById("signup-form").style.display = "block"
  document.getElementById("auth-title").textContent = "Create Account"
}

function switchToLogin() {
  document.getElementById("signup-form").style.display = "none"
  document.getElementById("login-form").style.display = "block"
  document.getElementById("auth-title").textContent = "Welcome Back"
}

function login(userData) {
  isLoggedIn = true
  currentUser = userData
  updateAuthButton()
  closeAuthModal()
  updateWishlistContent()

  // Show success message
  alert("Successfully logged in!")
}

function logout() {
  isLoggedIn = false
  currentUser = null
  updateAuthButton()
  updateWishlistContent()
  document.getElementById("profile-dropdown").classList.remove("show")
  alert("Successfully logged out!")
}

function updateAuthButton() {
  const authBtn = document.getElementById("auth-btn")
  const authBtnSpan = authBtn.querySelector("span")
  const authBtnIcon = authBtn.querySelector("i")

  if (isLoggedIn) {
    authBtnSpan.textContent = currentUser ? currentUser.name : "Account"
    authBtnIcon.className = "fas fa-user-circle"
  } else {
    authBtnSpan.textContent = "Register"
    authBtnIcon.className = "fas fa-user"
  }
}

// Profile dropdown functions
function showAnalytics() {
  document.getElementById("profile-dropdown").classList.remove("show")
  alert("Analytics feature coming soon!")
}

function showProfile() {
  document.getElementById("profile-dropdown").classList.remove("show")
  alert("Profile page coming soon!")
}

function showSellings() {
  document.getElementById("profile-dropdown").classList.remove("show")
  alert("My Sellings page coming soon!")
}

// Location functions
function openLocationModal() {
  document.getElementById("location-modal").style.display = "block"
  document.body.style.overflow = "hidden"
}

function closeLocationModal() {
  document.getElementById("location-modal").style.display = "none"
  document.body.style.overflow = "auto"
}

function searchLocation() {
  const searchInput = document.getElementById("location-search-input")
  const query = searchInput.value.trim()

  if (!query) {
    alert("Please enter a location")
    return
  }

  // Simulate location search
  console.log(`Searching for location: ${query}`)
  alert(`Searching for: ${query}`)
}

function confirmLocation() {
  const searchInput = document.getElementById("location-search-input")
  const rangeSlider = document.getElementById("range-slider")

  const location = searchInput.value.trim() || currentLocation.city
  const range = rangeSlider.value

  currentLocation = { city: location, range: Number.parseInt(range) }

  // Update UI
  document.getElementById("current-location").textContent = location
  document.querySelector(".location-selector .range").textContent = `${range} km`

  closeLocationModal()
  alert(`Location updated to ${location} within ${range} km`)
}

function zoomIn() {
  console.log("Zooming in")
  // Implement zoom in functionality
}

function zoomOut() {
  console.log("Zooming out")
  // Implement zoom out functionality
}

// Sell/Bid panel functions
function openSellPanel() {
  if (!isLoggedIn) {
    showAuthModal()
    return
  }
  document.getElementById("sell-panel").classList.add("open")
  document.body.style.overflow = "hidden"
}

function closeSellPanel() {
  document.getElementById("sell-panel").classList.remove("open")
  document.body.style.overflow = "auto"
}

function openBidPanel() {
  if (!isLoggedIn) {
    showAuthModal()
    return
  }
  document.getElementById("bid-panel").classList.add("open")
  document.body.style.overflow = "hidden"
}

function closeBidPanel() {
  document.getElementById("bid-panel").classList.remove("open")
  document.body.style.overflow = "auto"
}

// Form submissions
document.addEventListener("submit", (e) => {
  e.preventDefault()

  const form = e.target
  const formData = new FormData(form)

  if (form.closest("#login-form")) {
    // Handle login
    const email = form.querySelector('input[type="email"]').value
    const password = form.querySelector('input[type="password"]').value

    // Test login
    if (email === "test@test.com" && password === "000") {
      login({ name: "Test User", email: email })
    } else if (email && password) {
      // Simulate login
      login({ name: email.split("@")[0], email: email })
    }
  } else if (form.closest("#signup-form")) {
    // Handle signup
    const name = form.querySelector('input[type="text"]').value
    const email = form.querySelector('input[type="email"]').value
    const password = form.querySelectorAll('input[type="password"]')[0].value
    const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    if (name && email && password) {
      // Simulate signup
      login({ name: name, email: email })
    }
  } else if (form.closest("#sell-form")) {
    // Handle sell form
    alert("Listing created successfully!")
    closeSellPanel()
  } else if (form.closest("#bid-form")) {
    // Handle bid form
    alert("Auction created successfully!")
    closeBidPanel()
  }
})

// Close modals when clicking outside
window.addEventListener("click", (e) => {
  const authModal = document.getElementById("auth-modal")
  const locationModal = document.getElementById("location-modal")
  const detailModal = document.getElementById("detail-modal")

  if (e.target === authModal) {
    closeAuthModal()
  }

  if (e.target === locationModal) {
    closeLocationModal()
  }

  if (e.target === detailModal) {
    closeDetailModal()
  }
})

// Close panels when clicking outside
document.addEventListener("click", (e) => {
  const sellPanel = document.getElementById("sell-panel")
  const bidPanel = document.getElementById("bid-panel")

  if (sellPanel.classList.contains("open") && !sellPanel.contains(e.target) && !e.target.closest(".sell-btn")) {
    closeSellPanel()
  }

  if (bidPanel.classList.contains("open") && !bidPanel.contains(e.target) && !e.target.closest(".bid-btn")) {
    closeBidPanel()
  }
})

// Simulate MongoDB connection (for demonstration)
class MockDatabase {
  constructor() {
    this.users = [{ id: 1, email: "test@test.com", password: "000", name: "Test User" }]
    this.products = sampleProducts
    this.deals = sampleDeals
    this.bids = sampleBids
    this.groups = sampleGroups
  }

  async createUser(userData) {
    const user = {
      id: Date.now(),
      ...userData,
      createdAt: new Date(),
    }
    this.users.push(user)
    return user
  }

  async findUser(email) {
    return this.users.find((user) => user.email === email)
  }

  async getProducts(filters = {}) {
    let products = [...this.products]

    if (filters.category && filters.category !== "all") {
      products = products.filter((p) => p.category === filters.category)
    }

    if (filters.location) {
      products = products.filter((p) => p.location.includes(filters.location))
    }

    return products
  }

  async getDeals() {
    return [...this.deals]
  }

  async getBids() {
    return [...this.bids]
  }

  async getGroups() {
    return [...this.groups]
  }
}

// Initialize mock database
const db = new MockDatabase()

// Export for potential use
window.SoukiApp = {
  db,
  currentUser,
  currentLocation,
  isLoggedIn,
}

console.log("Souki Marketplace initialized successfully! 🚀")
