const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../server');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth API - Role & Phone', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('POST /api/auth/register', () => {
        it('should register a user with role and phone', async () => {
            sinon.stub(User, 'findOne').resolves(null);
            sinon.stub(User, 'create').resolves({
                id: 'abc123',
                name: 'Test User',
                email: 'test@test.com',
                role: 'driver',
                phone: '0412345678',
            });
            sinon.stub(jwt, 'sign').returns('fake-token');

            const res = await chai.request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@test.com',
                    password: 'password123',
                    role: 'driver',
                    phone: '0412345678',
                });

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('role', 'driver');
            expect(res.body).to.have.property('phone', '0412345678');
            expect(res.body).to.have.property('token');
        });

        it('should default role to customer when not provided', async () => {
            sinon.stub(User, 'findOne').resolves(null);
            sinon.stub(User, 'create').resolves({
                id: 'abc123',
                name: 'Test User',
                email: 'test@test.com',
                role: 'customer',
                phone: undefined,
            });
            sinon.stub(jwt, 'sign').returns('fake-token');

            const res = await chai.request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@test.com',
                    password: 'password123',
                });

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('role', 'customer');
        });

        it('should reject invalid role', async () => {
            sinon.stub(User, 'findOne').resolves(null);
            sinon.stub(User, 'create').rejects(
                new Error('User validation failed: role: `hacker` is not a valid enum value for path `role`.')
            );

            const res = await chai.request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@test.com',
                    password: 'password123',
                    role: 'hacker',
                });

            expect(res).to.have.status(500);
            expect(res.body.message).to.include('not a valid enum value');
        });

        it('should reject duplicate email', async () => {
            sinon.stub(User, 'findOne').resolves({ email: 'test@test.com' });

            const res = await chai.request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@test.com',
                    password: 'password123',
                    role: 'customer',
                });

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message', 'User already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should return role and phone on login', async () => {
            sinon.stub(User, 'findOne').resolves({
                id: 'abc123',
                name: 'Test User',
                email: 'test@test.com',
                password: await bcrypt.hash('password123', 10),
                role: 'dispatcher',
                phone: '0498765432',
            });
            sinon.stub(jwt, 'sign').returns('fake-token');

            const res = await chai.request(app)
                .post('/api/auth/login')
                .send({ email: 'test@test.com', password: 'password123' });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('role', 'dispatcher');
            expect(res.body).to.have.property('phone', '0498765432');
            expect(res.body).to.have.property('token');
        });

        it('should reject invalid password', async () => {
            sinon.stub(User, 'findOne').resolves({
                id: 'abc123',
                email: 'test@test.com',
                password: await bcrypt.hash('password123', 10),
            });

            const res = await chai.request(app)
                .post('/api/auth/login')
                .send({ email: 'test@test.com', password: 'wrongpassword' });

            expect(res).to.have.status(401);
        });
    });

    describe('Authorise middleware', () => {
        const { authorise } = require('../middleware/authMiddleware');

        it('should call next() when user role is allowed', () => {
            const req = { user: { role: 'dispatcher' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
            const next = sinon.stub();

            authorise('dispatcher', 'driver')(req, res, next);

            expect(next.calledOnce).to.be.true;
            expect(res.status.called).to.be.false;
        });

        it('should return 403 when user role is not allowed', () => {
            const req = { user: { role: 'customer' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
            const next = sinon.stub();

            authorise('dispatcher', 'driver')(req, res, next);

            expect(next.called).to.be.false;
            expect(res.status.calledWith(403)).to.be.true;
        });

        it('should return 403 when no user on request', () => {
            const req = {};
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
            const next = sinon.stub();

            authorise('dispatcher')(req, res, next);

            expect(next.called).to.be.false;
            expect(res.status.calledWith(403)).to.be.true;
        });
    });
});
