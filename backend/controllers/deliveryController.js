
const Delivery = require('../models/Delivery');

// @desc    Create a delivery request
// @route   POST /api/deliveries
// @access  Customer
const createDelivery = async (req, res) => {
    const { receiverName, receiverPhone, pickupAddress, packageType } = req.body;
    try {
        const delivery = await Delivery.create({
            receiverName,
            receiverPhone,
            pickupAddress,
            packageType,
            customer: req.user.id,
        });
        res.status(201).json(delivery);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get deliveries (role-based)
// @route   GET /api/deliveries
// @access  Protected
const getDeliveries = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === 'customer') {
            filter.customer = req.user.id;
        } else if (req.user.role === 'driver') {
            filter.driver = req.user.id;
        }
        // dispatcher sees all — no filter

        const deliveries = await Delivery.find(filter)
            .populate('customer', 'name email phone')
            .populate('driver', 'name email phone')
            .sort({ createdAt: -1 });

        res.json(deliveries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get delivery by ID
// @route   GET /api/deliveries/:id
// @access  Protected (ownership/role check)
const getDeliveryById = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id)
            .populate('customer', 'name email phone')
            .populate('driver', 'name email phone');

        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        // Customer can only view own deliveries
        if (
            req.user.role === 'customer' &&
            delivery.customer._id.toString() !== req.user.id
        ) {
            return res.status(403).json({ message: 'Not authorised' });
        }

        // Driver can only view assigned deliveries
        if (
            req.user.role === 'driver' &&
            (!delivery.driver || delivery.driver._id.toString() !== req.user.id)
        ) {
            return res.status(403).json({ message: 'Not authorised' });
        }

        res.json(delivery);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a delivery
// @route   PUT /api/deliveries/:id
// @access  Customer (own), Dispatcher (any)
const updateDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id);

        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        if (req.user.role === 'customer') {
            // Customer can only update own pending deliveries
            if (delivery.customer.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Not authorised' });
            }
            if (delivery.status !== 'pending') {
                return res.status(400).json({ message: 'Can only update pending deliveries' });
            }
            const { receiverName, receiverPhone, pickupAddress, packageType } = req.body;
            delivery.receiverName = receiverName || delivery.receiverName;
            delivery.receiverPhone = receiverPhone || delivery.receiverPhone;
            delivery.pickupAddress = pickupAddress || delivery.pickupAddress;
            delivery.packageType = packageType || delivery.packageType;
        } else if (req.user.role === 'dispatcher') {
            // Dispatcher can update status and assign driver
            const { status, driver } = req.body;
            if (status) delivery.status = status;
            if (driver) delivery.driver = driver;
        } else {
            return res.status(403).json({ message: 'Not authorised' });
        }

        const updated = await delivery.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a delivery
// @route   DELETE /api/deliveries/:id
// @access  Dispatcher only
const deleteDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id);

        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        await delivery.deleteOne();
        res.json({ message: 'Delivery removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createDelivery,
    getDeliveries,
    getDeliveryById,
    updateDelivery,
    deleteDelivery,
};
