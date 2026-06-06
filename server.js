const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: [
    'http://10.227.56.251:8000',
    'http://localhost:8000',
    'http://127.0.0.1:8000'
  ],
  credentials: true
}));

// Set security headers
app.use(helmet());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Route files
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const productRoutes = require('./routes/productRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Middleware
const { protect } = require('./middleware/auth');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/categories', protect, categoryRoutes);
app.use('/api/suppliers', protect, supplierRoutes);
app.use('/api/products', protect, productRoutes);
app.use('/api/transactions', protect, transactionRoutes);
app.use('/api/dashboard', protect, dashboardRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Inventory Management API Running'
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Inventory Management API Running'
  });
});

// 404 Not Found Middleware (Catch-all for undefined routes)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
