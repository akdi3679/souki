const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const compression = require("compression")
const path = require("path")
const multer = require("multer")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { body, validationResult } = require("express-validator")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3000

// Security middleware
app.use(helmet())
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number.parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: "Too many requests from this IP, please try again later.",
})
app.use("/api/", limiter)

// CORS configuration
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? "https://yourdomain.com" : "http://localhost:3000",
    credentials: true,
  }),
)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Static files
app.use(express.static("public"))
app.use("/uploads", express.static("uploads"))

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err))

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 500 },
    location: { type: String, default: "" },
    phone: { type: String, default: "" },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    badges: [{ type: String }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    connections: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    activeListings: { type: Number, default: 0 },
    profileViews: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    preferences: {
      notifications: { type: Boolean, default: true },
      emailUpdates: { type: Boolean, default: true },
      showProfile: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
)

// Product Schema
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: null },
    category: { type: String, required: true },
    condition: { type: String, required: true, enum: ["new", "like-new", "good", "fair", "poor"] },
    images: [{ type: String }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String, required: true },
    shipping: {
      cost: { type: Number, default: 0 },
      expedited: { type: Boolean, default: false },
      freeShipping: { type: Boolean, default: false },
    },
    returns: {
      accepted: { type: Boolean, default: false },
      duration: { type: Number, default: 0 }, // days
    },
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, default: "active", enum: ["active", "sold", "inactive"] },
    featured: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true },
)

// Bid Schema
const bidSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    startingBid: { type: Number, required: true, min: 0 },
    currentBid: { type: Number, required: true },
    buyNowPrice: { type: Number, default: null },
    category: { type: String, required: true },
    condition: { type: String, required: true },
    images: [{ type: String }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String, required: true },
    endTime: { type: Date, required: true },
    bids: [
      {
        bidder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        amount: { type: Number, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    watchers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, default: "active", enum: ["active", "ended", "cancelled"] },
    shipping: {
      cost: { type: Number, default: 0 },
      expedited: { type: Boolean, default: false },
    },
    returns: {
      accepted: { type: Boolean, default: false },
      duration: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
)

// Group Schema
const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    privacy: { type: String, default: "public", enum: ["public", "private"] },
    icon: { type: String, default: "" },
    cover: { type: String, default: "" },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    memberCount: { type: Number, default: 0 },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    rules: [{ type: String }],
    isPopular: { type: Boolean, default: false },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
)

// Models
const User = mongoose.model("User", userSchema)
const Product = mongoose.model("Product", productSchema)
const Bid = mongoose.model("Bid", bidSchema)
const Group = mongoose.model("Group", groupSchema)

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: Number.parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed!"), false)
    }
  },
})

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" })
    }
    req.user = user
    next()
  })
}

// API Routes

// Authentication Routes
app.post(
  "/api/auth/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, email, password } = req.body

      // Check if user exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, Number.parseInt(process.env.BCRYPT_ROUNDS) || 12)

      // Create user
      const user = new User({
        name,
        email,
        password: hashedPassword,
      })

      await user.save()

      // Generate JWT
      const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      })

      res.status(201).json({
        message: "User created successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  },
)

app.post("/api/auth/login", [body("email").isEmail().normalizeEmail(), body("password").exists()], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    // Update last active
    user.lastActive = new Date()
    await user.save()

    // Generate JWT
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        rating: user.rating,
        badges: user.badges,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Product Routes
app.get("/api/products", async (req, res) => {
  try {
    const { category, condition, minPrice, maxPrice, location, search, page = 1, limit = 20 } = req.query

    const query = { status: "active" }

    if (category && category !== "all") query.category = category
    if (condition && condition !== "all") query.condition = condition
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number.parseFloat(minPrice)
      if (maxPrice) query.price.$lte = Number.parseFloat(maxPrice)
    }
    if (location) query.location = new RegExp(location, "i")
    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { tags: new RegExp(search, "i") },
      ]
    }

    const products = await Product.find(query)
      .populate("seller", "name avatar rating ratingCount")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Product.countDocuments(query)

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get products error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name avatar rating ratingCount badges joinedAt followers following",
    )

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    // Increment views
    product.views += 1
    await product.save()

    // Get similar products
    const similarProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: "active",
    })
      .populate("seller", "name avatar rating")
      .limit(6)

    res.json({ product, similarProducts })
  } catch (error) {
    console.error("Get product error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Bid Routes
app.get("/api/bids", async (req, res) => {
  try {
    const { status = "active", category, page = 1, limit = 20 } = req.query

    const query = {}
    if (status !== "all") {
      if (status === "ending") {
        query.endTime = { $lte: new Date(Date.now() + 24 * 60 * 60 * 1000) } // Ending in 24h
        query.status = "active"
      } else {
        query.status = status
      }
    }

    if (category && category !== "all") query.category = category

    const bids = await Bid.find(query)
      .populate("seller", "name avatar rating ratingCount")
      .sort({ endTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    res.json({ bids })
  } catch (error) {
    console.error("Get bids error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// User Profile Routes
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "name avatar")
      .populate("following", "name avatar")

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Increment profile views
    user.profileViews += 1
    await user.save()

    // Get user's products and bids
    const products = await Product.find({ seller: user._id, status: "active" }).limit(6).sort({ createdAt: -1 })

    const bids = await Bid.find({ seller: user._id, status: "active" }).limit(6).sort({ endTime: 1 })

    res.json({ user, products, bids })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Group Routes
app.get("/api/groups", async (req, res) => {
  try {
    const { category, search, popular, page = 1, limit = 20 } = req.query

    const query = {}
    if (category && category !== "all") query.category = category
    if (search) query.name = new RegExp(search, "i")
    if (popular === "true") query.isPopular = true

    const groups = await Group.find(query)
      .populate("admin", "name avatar")
      .sort({ memberCount: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    res.json({ groups })
  } catch (error) {
    console.error("Get groups error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// File upload route
app.post("/api/upload", authenticateToken, upload.array("images", 10), (req, res) => {
  try {
    const files = req.files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      path: `/uploads/${file.filename}`,
      size: file.size,
    }))

    res.json({ files })
  } catch (error) {
    console.error("Upload error:", error)
    res.status(500).json({ error: "Upload failed" })
  }
})

// Serve main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Error:", error)

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large" })
    }
  }

  res.status(500).json({ error: "Internal server error" })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Environment: ${process.env.NODE_ENV}`)
  console.log(`🔗 Local: http://localhost:${PORT}`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully")
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed")
    process.exit(0)
  })
})
