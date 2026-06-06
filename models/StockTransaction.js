const mongoose = require('mongoose');

const StockTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  product_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  transaction_type: {
    type: String,
    enum: ['IN', 'OUT'],
    required: [true, 'Transaction type must be IN or OUT']
  },
  quantity: {
    type: Number,
    required: [true, 'Please add quantity'],
    min: [1, 'Quantity must be at least 1']
  },
  reference: {
    type: String,
    trim: true,
    default: 'N/A'
  },
  notes: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StockTransaction', StockTransactionSchema);
