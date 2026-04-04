
const express = require('express');
const {
    createRoute,
    getRoutes,
    getRouteById,
    updateRoute,
    deleteRoute,
} = require('../controllers/routeController');
const { protect, authorise } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorise('dispatcher'), createRoute);
router.get('/', protect, authorise('dispatcher', 'driver'), getRoutes);
router.get('/:id', protect, authorise('dispatcher', 'driver'), getRouteById);
router.put('/:id', protect, authorise('dispatcher', 'driver'), updateRoute);
router.delete('/:id', protect, authorise('dispatcher'), deleteRoute);

module.exports = router;
