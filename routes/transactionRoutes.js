const express = require('express');
const router = express.Router();
const {
  getTransactions,
  addStock,
  removeStock
} = require('../controllers/transactionController');

router.route('/')
  .get(getTransactions);

router.route('/in')
  .post(addStock);

router.route('/out')
  .post(removeStock);

module.exports = router;
