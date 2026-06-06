const Product = require('../models/Product');
const { createProduct, updateProduct } = require('../validations/productValidation');

exports.getProducts = async (req, res) => {
  try {
    let query;
    const reqQuery = { ...req.query, user: req.user.id };

    // Support query filters like ?status=Low Stock
    query = Product.find(reqQuery).populate('category_id', 'name').populate('supplier_id', 'name email');

    const products = await query;
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { error } = createProduct.validate(req.body);
    if (error) return res.status(400).json({ success: false, error: error.details[0].message });

    const productData = { ...req.body, user: req.user.id };
    const product = await Product.create(productData);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, error: 'SKU already exists' });
    console.error('Product Creation Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Server Error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { error } = updateProduct.validate(req.body);
    if (error) return res.status(400).json({ success: false, error: error.details[0].message });

    const product = await Product.findOne({ _id: req.params.id, user: req.user.id });
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

    Object.assign(product, req.body);
    await product.save(); // using save to trigger pre-save middleware

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, error: 'SKU already exists' });
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
