const StockTransaction = require('../models/StockTransaction');
const Product = require('../models/Product');
const { stockIn, stockOut } = require('../validations/transactionValidation');

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await StockTransaction.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(50)
      .populate('product_id', 'name sku');
      
    res.status(200).json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.addStock = async (req, res) => {
  try {
    const { error } = stockIn.validate(req.body);
    if (error) return res.status(400).json({ success: false, error: error.details[0].message });

    const { product_id, quantity, reference, notes } = req.body;

    const product = await Product.findOne({ _id: product_id, user: req.user.id });
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Logic: Increase quantity_in_stock
    product.quantity_in_stock += quantity;
    await product.save(); // Triggers status update middleware

    const transaction = await StockTransaction.create({
      user: req.user.id,
      product_id,
      transaction_type: 'IN',
      quantity,
      reference,
      notes
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.removeStock = async (req, res) => {
  try {
    const { error } = stockOut.validate(req.body);
    if (error) return res.status(400).json({ success: false, error: error.details[0].message });

    const { product_id, quantity, reference, notes } = req.body;

    const product = await Product.findOne({ _id: product_id, user: req.user.id });
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Validation: Check if enough stock is available
    if (product.quantity_in_stock < quantity) {
      return res.status(400).json({ 
        success: false, 
        error: `Not enough stock. Available quantity is ${product.quantity_in_stock}` 
      });
    }

    // Logic: Decrease quantity_in_stock
    product.quantity_in_stock -= quantity;
    await product.save(); // Triggers status update middleware

    const transaction = await StockTransaction.create({
      user: req.user.id,
      product_id,
      transaction_type: 'OUT',
      quantity,
      reference,
      notes
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
