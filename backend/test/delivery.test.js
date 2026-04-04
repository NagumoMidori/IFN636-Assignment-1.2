
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../server');
const Delivery = require('../models/Delivery');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);
const { expect } = chai;

// Helper: generate a fake token and stub User.findById for protect middleware
const stubAuth = (user) => {
    sinon.stub(jwt, 'verify').returns({ id: user._id });
    sinon.stub(User, 'findById').returns({
        select: sinon.stub().resolves(user),
    });
};

const customerUser = {
    _id: 'customer123',
    id: 'customer123',
    name: 'Customer',
    email: 'customer@test.com',
    role: 'customer',
};

const driverUser = {
    _id: 'driver123',
    id: 'driver123',
    name: 'Driver',
    email: 'driver@test.com',
    role: 'driver',
};

const dispatcherUser = {
    _id: 'dispatcher123',
    id: 'dispatcher123',
    name: 'Dispatcher',
    email: 'dispatcher@test.com',
    role: 'dispatcher',
};

const sampleDelivery = {
    _id: 'del123',
    receiverName: 'John Doe',
    receiverPhone: '0412345678',
    pickupAddress: '123 Main St',
    packageType: 'Parcel',
    status: 'pending',
    customer: { _id: 'customer123', name: 'Customer', email: 'customer@test.com', phone: '0400000000' },
    driver: null,
    createdAt: new Date(),
    updatedAt: new Date(),
};

describe('Delivery API', () => {
    afterEach(() => {
        sinon.restore();
    });

    // --- CREATE ---
    describe('POST /api/deliveries', () => {
        it('should allow customer to create a delivery', async () => {
            stubAuth(customerUser);
            sinon.stub(Delivery, 'create').resolves({
                _id: 'del123',
                receiverName: 'John Doe',
                receiverPhone: '0412345678',
                pickupAddress: '123 Main St',
                packageType: 'Parcel',
                status: 'pending',
                customer: 'customer123',
            });

            const res = await chai.request(app)
                .post('/api/deliveries')
                .set('Authorization', 'Bearer fake-token')
                .send({
                    receiverName: 'John Doe',
                    receiverPhone: '0412345678',
                    pickupAddress: '123 Main St',
                    packageType: 'Parcel',
                });

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('receiverName', 'John Doe');
            expect(res.body).to.have.property('status', 'pending');
        });

        it('should reject driver from creating a delivery', async () => {
            stubAuth(driverUser);

            const res = await chai.request(app)
                .post('/api/deliveries')
                .set('Authorization', 'Bearer fake-token')
                .send({
                    receiverName: 'John Doe',
                    receiverPhone: '0412345678',
                    pickupAddress: '123 Main St',
                    packageType: 'Parcel',
                });

            expect(res).to.have.status(403);
        });
    });

    // --- GET ALL ---
    describe('GET /api/deliveries', () => {
        it('should return customer own deliveries', async () => {
            stubAuth(customerUser);

            const mockQuery = {
                populate: sinon.stub().returnsThis(),
                sort: sinon.stub().resolves([sampleDelivery]),
            };
            sinon.stub(Delivery, 'find').returns(mockQuery);

            const res = await chai.request(app)
                .get('/api/deliveries')
                .set('Authorization', 'Bearer fake-token');

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array').with.lengthOf(1);
            expect(Delivery.find.calledWith({ customer: 'customer123' })).to.be.true;
        });

        it('should return all deliveries for dispatcher', async () => {
            stubAuth(dispatcherUser);

            const mockQuery = {
                populate: sinon.stub().returnsThis(),
                sort: sinon.stub().resolves([sampleDelivery]),
            };
            sinon.stub(Delivery, 'find').returns(mockQuery);

            const res = await chai.request(app)
                .get('/api/deliveries')
                .set('Authorization', 'Bearer fake-token');

            expect(res).to.have.status(200);
            expect(Delivery.find.calledWith({})).to.be.true;
        });

        it('should return driver assigned deliveries', async () => {
            stubAuth(driverUser);

            const mockQuery = {
                populate: sinon.stub().returnsThis(),
                sort: sinon.stub().resolves([]),
            };
            sinon.stub(Delivery, 'find').returns(mockQuery);

            const res = await chai.request(app)
                .get('/api/deliveries')
                .set('Authorization', 'Bearer fake-token');

            expect(res).to.have.status(200);
            expect(Delivery.find.calledWith({ driver: 'driver123' })).to.be.true;
        });
    });

    // --- GET BY ID ---
    describe('GET /api/deliveries/:id', () => {
        it('should return delivery for owner customer', async () => {
            stubAuth(customerUser);

            const mockQuery = {
                populate: sinon.stub().returnsThis(),
            };
            mockQuery.populate.onSecondCall().resolves(sampleDelivery);
            sinon.stub(Delivery, 'findById').returns(mockQuery);

            const res = await chai.request(app)
                .get('/api/deliveries/del123')
                .set('Authorization', 'Bearer fake-token');

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('receiverName', 'John Doe');
        });

        it('should return 404 for non-existent delivery', async () => {
            stubAuth(customerUser);

            const mockQuery = {
                populate: sinon.stub().returnsThis(),
            };
            mockQuery.populate.onSecondCall().resolves(null);
            sinon.stub(Delivery, 'findById').returns(mockQuery);

            const res = await chai.request(app)
                .get('/api/deliveries/nonexistent')
                .set('Authorization', 'Bearer fake-token');

            expect(res).to.have.status(404);
        });

        it('should reject customer viewing another customers delivery', async () => {
            stubAuth(customerUser);

            const otherDelivery = {
                ...sampleDelivery,
                customer: { _id: 'other999', name: 'Other', email: 'other@test.com' },
            };
            const mockQuery = {
                populate: sinon.stub().returnsThis(),
            };
            mockQuery.populate.onSecondCall().resolves(otherDelivery);
            sinon.stub(Delivery, 'findById').returns(mockQuery);

            const res = await chai.request(app)
                .get('/api/deliveries/del123')
                .set('Authorization', 'Bearer fake-token');

            expect(res).to.have.status(403);
        });
    });

    // --- UPDATE ---
    describe('PUT /api/deliveries/:id', () => {
        it('should allow customer to update own pending delivery', async () => {
            stubAuth(customerUser);

            const mockDelivery = {
                _id: 'del123',
                receiverName: 'John Doe',
                receiverPhone: '0412345678',
                pickupAddress: '123 Main St',
                packageType: 'Parcel',
                status: 'pending',
                customer: 'customer123',
                save: sinon.stub().resolvesThis(),
            };
            sinon.stub(Delivery, 'findById').resolves(mockDelivery);

            const res = await chai.request(app)
                .put('/api/deliveries/del123')
                .set('Authorization', 'Bearer fake-token')
                .send({ receiverName: 'Jane Doe' });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('receiverName', 'Jane Doe');
        });

        it('should reject customer updating non-pending delivery', async () => {
            stubAuth(customerUser);

            const mockDelivery = {
                _id: 'del123',
                status: 'delivered',
                customer: 'customer123',
            };
            sinon.stub(Delivery, 'findById').resolves(mockDelivery);

            const res = await chai.request(app)
                .put('/api/deliveries/del123')
                .set('Authorization', 'Bearer fake-token')
                .send({ receiverName: 'Jane Doe' });

            expect(res).to.have.status(400);
        });

        it('should allow dispatcher to assign driver and update status', async () => {
            stubAuth(dispatcherUser);

            const mockDelivery = {
                _id: 'del123',
                status: 'pending',
                customer: 'customer123',
                driver: null,
                save: sinon.stub().resolvesThis(),
            };
            sinon.stub(Delivery, 'findById').resolves(mockDelivery);

            const res = await chai.request(app)
                .put('/api/deliveries/del123')
                .set('Authorization', 'Bearer fake-token')
                .send({ status: 'delivered', driver: 'driver123' });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('status', 'delivered');
            expect(res.body).to.have.property('driver', 'driver123');
        });
    });

    // --- DELETE ---
    describe('DELETE /api/deliveries/:id', () => {
        it('should allow dispatcher to delete a delivery', async () => {
            stubAuth(dispatcherUser);

            const mockDelivery = {
                _id: 'del123',
                deleteOne: sinon.stub().resolves(),
            };
            sinon.stub(Delivery, 'findById').resolves(mockDelivery);

            const res = await chai.request(app)
                .delete('/api/deliveries/del123')
                .set('Authorization', 'Bearer fake-token');

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Delivery removed');
        });

        it('should reject customer from deleting a delivery', async () => {
            stubAuth(customerUser);

            const res = await chai.request(app)
                .delete('/api/deliveries/del123')
                .set('Authorization', 'Bearer fake-token');

            expect(res).to.have.status(403);
        });

        it('should return 404 when deleting non-existent delivery', async () => {
            stubAuth(dispatcherUser);
            sinon.stub(Delivery, 'findById').resolves(null);

            const res = await chai.request(app)
                .delete('/api/deliveries/nonexistent')
                .set('Authorization', 'Bearer fake-token');

            expect(res).to.have.status(404);
        });
    });
});
