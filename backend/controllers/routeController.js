
const Route = require('../models/Route');

// @desc    Create a route
// @route   POST /api/routes
// @access  Dispatcher only
const createRoute = async (req, res) => {
    const { routeId, driver, stops, transportType, distance, duration } = req.body;
    try {
        const route = await Route.create({
            routeId,
            driver: driver || null,
            stops: stops || [],
            transportType,
            distance,
            duration,
        });
        res.status(201).json(route);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get routes (role-based)
// @route   GET /api/routes
// @access  Dispatcher, Driver
const getRoutes = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === 'driver') {
            filter.driver = req.user.id;
        }
        // dispatcher sees all

        const routes = await Route.find(filter)
            .populate('driver', 'name email phone')
            .sort({ createdAt: -1 });

        res.json(routes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get route by ID
// @route   GET /api/routes/:id
// @access  Dispatcher, Driver (assigned only)
const getRouteById = async (req, res) => {
    try {
        const route = await Route.findById(req.params.id)
            .populate('driver', 'name email phone');

        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }

        // Driver can only view assigned routes
        if (
            req.user.role === 'driver' &&
            (!route.driver || route.driver._id.toString() !== req.user.id)
        ) {
            return res.status(403).json({ message: 'Not authorised' });
        }

        res.json(route);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a route
// @route   PUT /api/routes/:id
// @access  Dispatcher (reassign driver, regenerate), Driver (mark stops complete)
const updateRoute = async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);

        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }

        if (req.user.role === 'dispatcher') {
            const { driver, stops, transportType, distance, duration, status } = req.body;
            if (driver !== undefined) route.driver = driver;
            if (stops) route.stops = stops;
            if (transportType) route.transportType = transportType;
            if (distance) route.distance = distance;
            if (duration) route.duration = duration;
            if (status) route.status = status;
        } else if (req.user.role === 'driver') {
            // Driver can only mark stops as complete
            if (!route.driver || route.driver.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Not authorised' });
            }

            const { stopId } = req.body;
            if (stopId) {
                const stop = route.stops.id(stopId);
                if (!stop) {
                    return res.status(404).json({ message: 'Stop not found' });
                }
                stop.completed = true;
            }

            // Auto-complete route if all stops are done
            const allCompleted = route.stops.every((s) => s.completed);
            if (allCompleted && route.stops.length > 0) {
                route.status = 'completed';
            }
        } else {
            return res.status(403).json({ message: 'Not authorised' });
        }

        const updated = await route.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a route
// @route   DELETE /api/routes/:id
// @access  Dispatcher only
const deleteRoute = async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);

        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }

        await route.deleteOne();
        res.json({ message: 'Route removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRoute,
    getRoutes,
    getRouteById,
    updateRoute,
    deleteRoute,
};
