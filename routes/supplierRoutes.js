const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/auth');
const {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');

router.route('/')
  .get(getSuppliers)
  .post(createSupplier);

router.route('/:id')
  .put(updateSupplier)
  .delete(authorize('admin'), deleteSupplier);

module.exports = router;
