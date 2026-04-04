
const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
    {
        receiverName: { type: String, required: true },
        receiverPhone: { type: String, required: true },
        pickupAddress: { type: String, required: true },
        packageType: { type: String, required: true },
        status: {
            type: String,
            enum: ['pending', 'delivered', 'cancelled'],
            default: 'pending',
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Delivery', deliverySchema);
