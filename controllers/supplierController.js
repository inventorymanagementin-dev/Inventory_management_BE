const Supplier = require('../models/Supplier');
const { createSupplier, updateSupplier } = require('../validations/supplierValidation');

exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({ user: req.user.id });
    res.status(200).json({ success: true, count: suppliers.length, data: suppliers });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.createSupplier = async (req, res) => {
  try {
    const { error } = createSupplier.validate(req.body);
    if (error) return res.status(400).json({ success: false, error: error.details[0].message });

    const supplierData = { ...req.body, user: req.user.id };
    const supplier = await Supplier.create(supplierData);
    res.status(201).json({ success: true, data: supplier });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    const { error } = updateSupplier.validate(req.body);
    if (error) return res.status(400).json({ success: false, error: error.details[0].message });

    const supplier = await Supplier.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!supplier) return res.status(404).json({ success: false, error: 'Supplier not found' });
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!supplier) return res.status(404).json({ success: false, error: 'Supplier not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
