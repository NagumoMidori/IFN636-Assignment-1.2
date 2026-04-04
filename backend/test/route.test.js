
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../server');
const Route = require('../models/Route');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);
const { expect } = chai;

const stubAuth = (user) => {
    sinon.stub(jwt, 'verify').returns({ id: user._id });
    sinon.stub(User, 'findById').returns({
        select: sinon.stub().resolves(user),
    });
};

const dispatcherUser = {
    _id: 'dispatcher123',
    id: 'dispatcher123',
    name: 'Dispatcher',
    email: 'dispatcher@test.com',
    role: 'dispatcher',
};

const driverUser = {
    _id: 'driver123',
    id: 'driver123',
    name: 'Driver',
    email: 'driver@test.com',
    role: 'driver',
};

const customerUser = {
    _id: 'customer123',
    id: 'customer123',
    name: 'Customer',
    email: 'customer@test.com',
    role: 'customer',
};

const sampleRoute = {
    _id: 'route123',
    routeId: 'Route-1532',
    driver: { _id: 'driver123', name: 'Driver', email: 'driver@test.com', phone: '0400000000' },
    stops: [
        { _id: 'stop1', address: '123 Main St', city: 'Brisbane', completed: false },
        { _id: 'stop2', address: '456 Queen St', city: 'Gold Coast', completed: true },
    ],
    status: 'active',
    transportType: 'car',
    distance: '120 km',
    duration: '1h 30m',
    createdAt: new Date(),
};

describe('Route API', () => {
    afterEach(() => {
        sinon.restore();
    });

    // --- CREATE ---
    describe('POST /api/routes', () => {
        it('should allow dispatcher to create a route', async () => {
            stubAuth(dispatcherUser);
            sinon.stub(Route, 'create').resolves({
                _id: 'route123',
                routeId: 'Route-1532',
                driver: null,
                stops: [],
                status: 'active',
                transportType: 'car',
            });

            const res = await chai.request(app)
                .post('/api/routes')
                .set('Authorization', 'Bearer fake-token')
                .send({
                    routeId: 'Route-1532',
                    transportType: 'car',
                });

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('routeId', 'Route-1532');
        });

        it('should reject driver from creating a route', async () => {
            stubAuth(driverUser);

            const res = await chai.request(app)
                .post('/api/routes')
                .set('Authorization', 'Bearer fake-token')
                .send({ routeId: 'Route-9999' });

            expect(res).to.have.status(403);
        });

        it('should reject customer from creating a route', async () => {
            stubAuth(customerUser);

            const res = await chai.request(app)
                .post('/api/routes')
                .set('Authorization', 'Bearer fake-token')
                .send({ routeId: 'Route-9999' });

            expect(res).to.have.status(403);
        });
    });

    // --- GET ALL ---
    describe('GET /api/routes', () => {
        it('should return all routes for dispatcher', async () => {
            stubAuth(dispatcherUser);

            const mockQuery = {
                populate: sinon.stub().returnsThis(),
                sort: sinon.stub().resolves([sampleRoute]),
            };
            sinon.stub(Route, 'find').returns(mockQuery);

            const res = await chai.request(app)
                .get('/api/routes')
                .set('Authorization', 'Bearer fake-token');

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array').with.lengthOf(1);
            expect(Route.find.calledWith({})).to.be.true;
        });

        it('should return only assigned routes for driver', async () => {
            stubAuth(driverUser);

            const mockQuery = {
                populate: sinon.stub().returnsThis(),
                sort: sinon.stub().resolves([]),
            };
            sinon.stub(Route, 'find').returns(mockQuery);

            const res = await chai.request(app)
                .get('/api/routes')
                .set('Authorization', 'Bearer fake-token');

            expect(res).to.have.status(200);
            expect(Route.find.calledWith({ driver: 'driver123' })).to.be.true;
        });

        it('should reject customer from viewing routes', async () => {
            stubAuth(customerUser);

            const res = await chai.request(app)
                .get('/api/routes')
                .set('Authorization', 'Bearer fake-token');

            expect(res).to.have.status(403);
        });
    });

    // --- GET BY ID ---
    describe('GET /api/routes/:id', () => {
        it('should return route for dispatcher', async () => {
            stubAuth(dispatcherUser);

            const mockQuery = {
                populate: sinon.stub().resolves(sampleRoute),
            };
            sinon.stub(Route, 'findById').returns(mockQuery);

            const res = await chai.request(app)
                .get('/api/routes/route123')
                .set('Authorization', 'Bearer fake-token');

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('routeId', 'Route-1532');
        });

        it('should return 404 for non-existent route', async () => {
            stubAuth(dispatcherUser);

            const mockQuery = {
                populate: sinon.stub().resolves(null),
            };
            sinon.stub(Route, 'findById').returns(mockQuery);

            const res = await chai.request(app)
                .get('/api/routes/nonexistent')
                .set('Authorization', 'Bearer fake-token');

            expect(res).to.have.status(404);
        });

        it('should reject driver viewing unassigned route', async () => {
            stubAuth(driverUser);

            const otherRoute = {
                ...sampleRoute,
                driver: { _id: 'other999', name: 'Other', email: 'other@test.com' },
            };
            const mockQuery = {
                populate: sinon.stub().resolves(otherRoute),
            };
            sinon.stub(Route, 'findById').returns(mockQuery);

            const res = await chai.request(app)
                .get('/api/routes/route123')
                .set('Authorization', 'Bearer fake-token');

            expect(res).to.have.status(403);
        });
    });

    // --- UPDATE ---
    describe('PUT /api/routes/:id', () => {
        it('should allow dispatcher to reassign driver', async () => {
            stubAuth(dispatcherUser);

            const mockRoute = {
                _id: 'route123',
                routeId: 'Route-1532',
                driver: null,
                transportType: 'car',
                status: 'active',
                save: sinon.stub().resolvesThis(),
            };
            sinon.stub(Route, 'findById').resolves(mockRoute);

            const res = await chai.request(app)
                .put('/api/routes/route123')
                .set('Authorization', 'Bearer fake-token')
                .send({ driver: 'driver123' });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('driver', 'driver123');
        });

        it('should allow driver to mark stop as complete', async () => {
            stubAuth(driverUser);

            const stopSubDoc = {
                _id: 'stop1',
                address: '123 Main St',
                city: 'Brisbane',
                completed: false,
            };
            const mockRoute = {
                _id: 'route123',
                driver: 'driver123',
                stops: {
                    id: sinon.stub().returns(stopSubDoc),
                    every: sinon.stub().returns(false),
                },
                status: 'active',
                save: sinon.stub().resolvesThis(),
            };
            // Make stops iterable for every() check
            mockRoute.stops = [stopSubDoc];
            mockRoute.stops.id = sinon.stub().returns(stopSubDoc);

            sinon.stub(Route, 'findById').resolves(mockRoute);

            const res = await chai.request(app)
                .put('/api/routes/route123')
                .set('Authorization', 'Bearer fake-token')
                .send({ stopId: 'stop1' });

            expect(res).to.have.status(200);
            expect(stopSubDoc.completed).to.be.true;
        });

        it('should reject customer from updating route', async () => {
            stubAuth(customerUser);

            const res = await chai.request(app)
                .put('/api/routes/route123')
                .set('Authorization', 'Bearer fake-token')
                .send({ status: 'completed' });

            expect(res).to.have.status(403);
        });
    });

    // --- DELETE ---
    describe('DELETE /api/routes/:id', () => {
        it('should allow dispatcher to delete a route', async () => {
            stubAuth(dispatcherUser);

            const mockRoute = {
                _id: 'route123',
                deleteOne: sinon.stub().resolves(),
            };
            sinon.stub(Route, 'findById').resolves(mockRoute);

            const res = await chai.request(app)
                .delete('/api/routes/route123')
                .set('Authorization', 'Bearer fake-token');

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Route removed');
        });

        it('should reject driver from deleting a route', async () => {
            stubAuth(driverUser);

            const res = await chai.request(app)
                .delete('/api/routes/route123')
                .set('Authorization', 'Bearer fake-token');

            expect(res).to.have.status(403);
        });

        it('should return 404 when deleting non-existent route', async () => {
            stubAuth(dispatcherUser);
            sinon.stub(Route, 'findById').resolves(null);

            const res = await chai.request(app)
                .delete('/api/routes/nonexistent')
                .set('Authorization', 'Bearer fake-token');

            expect(res).to.have.status(404);
        });
    });
});
