const Category = require('../models/Category');
const { createCategory, updateCategory } = require('../validations/categoryValidation');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id });
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { error } = createCategory.validate(req.body);
    if (error) return res.status(400).json({ success: false, error: error.details[0].message });

    const categoryData = { ...req.body, user: req.user.id };
    const category = await Category.create(categoryData);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, error: 'Category name already exists' });
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { error } = updateCategory.validate(req.body);
    if (error) return res.status(400).json({ success: false, error: error.details[0].message });

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) return res.status(404).json({ success: false, error: 'Category not found' });
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!category) return res.status(404).json({ success: false, error: 'Category not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
