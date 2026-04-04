
const express = require('express');
const {
    createDelivery,
    getDeliveries,
    getDeliveryById,
    updateDelivery,
    deleteDelivery,
} = require('../controllers/deliveryController');
const { protect, authorise } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorise('customer'), createDelivery);
router.get('/', protect, getDeliveries);
router.get('/:id', protect, getDeliveryById);
router.put('/:id', protect, authorise('customer', 'dispatcher'), updateDelivery);
router.delete('/:id', protect, authorise('dispatcher'), deleteDelivery);

module.exports = router;
