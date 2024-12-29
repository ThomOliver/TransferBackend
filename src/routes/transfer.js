const express = require('express');
const router = express.Router();
const {
  createTransfer,
  getTransferById,
  getAllTransfers,
} = require('../controllers/transferController');

router.post('/', createTransfer);

router.get('/', getAllTransfers);

router.get('/:id', getTransferById);


module.exports = router;
