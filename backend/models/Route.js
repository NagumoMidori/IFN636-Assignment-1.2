
const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema(
    {
        address: { type: String, required: true },
        city: { type: String, required: true },
        lat: { type: Number },
        lng: { type: Number },
        completed: { type: Boolean, default: false },
    },
    { _id: true }
);

const routeSchema = new mongoose.Schema(
    {
        routeId: { type: String, required: true, unique: true },
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        stops: [stopSchema],
        status: {
            type: String,
            enum: ['active', 'completed'],
            default: 'active',
        },
        transportType: {
            type: String,
            enum: ['bike', 'car', 'train'],
            default: 'car',
        },
        distance: { type: String, default: '' },
        duration: { type: String, default: '' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Route', routeSchema);
