const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [150, 'Name can not be more than 150 characters']
  },
  sku: {
    type: String,
    required: [true, 'Please add a SKU (Stock Keeping Unit)'],
    unique: true,
    trim: true
  },
  category_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true
  },
  supplier_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Supplier',
    required: true
  },
  unit_price: {
    type: Number,
    required: [true, 'Please add a unit price'],
    min: [0, 'Unit price must be at least 0']
  },
  quantity_in_stock: {
    type: Number,
    required: [true, 'Please add quantity in stock'],
    min: [0, 'Quantity in stock cannot be negative'],
    default: 0
  },
  reorder_level: {
    type: Number,
    required: [true, 'Please add a reorder level'],
    min: [0, 'Reorder level cannot be negative'],
    default: 5
  },
  status: {
    type: String,
    enum: ['In Stock', 'Low Stock', 'Out of Stock'],
    default: 'In Stock'
  }
}, {
  timestamps: true
});

// Middleware to automatically update status based on stock and reorder level
ProductSchema.pre('save', function () {
  if (this.quantity_in_stock === 0) {
    this.status = 'Out of Stock';
  } else if (this.quantity_in_stock <= this.reorder_level) {
    this.status = 'Low Stock';
  } else {
    this.status = 'In Stock';
  }
});

module.exports = mongoose.model('Product', ProductSchema);
