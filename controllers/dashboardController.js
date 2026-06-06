const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const StockTransaction = require('../models/StockTransaction');
const Category = require('../models/Category');

exports.getDashboardStats = async (req, res) => {
  try {
    // Total Products count
    const totalProducts = await Product.countDocuments({ user: req.user.id });

    // Active Suppliers count
    const activeSuppliers = await Supplier.countDocuments({ status: 'Active', user: req.user.id });

    // Low Stock items count (and Out of Stock)
    const lowStockItems = await Product.countDocuments({ 
      status: { $in: ['Low Stock', 'Out of Stock'] },
      user: req.user.id
    });

    // 5 most recent stock transactions
    const recentTransactions = await StockTransaction.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(5)
      .populate('product_id', 'name sku');

    // Calculate Total Inventory Value
    const products = await Product.find({ user: req.user.id }).populate('category_id', 'name');
    const totalInventoryValue = products.reduce((acc, p) => acc + (p.unit_price * p.quantity_in_stock), 0);

    // Category Distribution
    const categoryDistribution = {};
    products.forEach(p => {
      const catName = p.category_id ? p.category_id.name : 'Uncategorized';
      if (!categoryDistribution[catName]) {
        categoryDistribution[catName] = 0;
      }
      categoryDistribution[catName]++;
    });

    // Last 7 Days Activity (IN/OUT quantities)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentActivityTxns = await StockTransaction.find({
      user: req.user.id,
      date: { $gte: sevenDaysAgo }
    });

    const activityByDate = {};
    for (let i = 0; i <= 6; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      activityByDate[dateStr] = { in: 0, out: 0 };
    }

    recentActivityTxns.forEach(txn => {
      const dateStr = txn.date.toISOString().split('T')[0];
      if (activityByDate[dateStr]) {
        if (txn.transaction_type === 'IN') {
          activityByDate[dateStr].in += txn.quantity;
        } else {
          activityByDate[dateStr].out += txn.quantity;
        }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        activeSuppliers,
        lowStockItems,
        recentTransactions,
        totalInventoryValue,
        categoryDistribution,
        activityByDate
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
