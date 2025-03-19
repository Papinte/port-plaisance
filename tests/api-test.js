const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = require('../index');
let server;

before(async () => {
    await mongoose.connection.close().catch(() => {});
    const testUri = process.env.MONGO_URI_TEST || 'mongodb://localhost/test-port-de-plaisance';
    await mongoose.connect(testUri);
    console.log('Connecté à la base de test:', testUri);

    const user = new User({ name: 'TestUser', email: 'test@example.com', password: 'password123' });
    await user.save();
});

after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (server) server.close();
});

beforeEach((done) => {
    server = app.listen(3001, done);
});

afterEach((done) => {
    server.close(done);
});

let token;
beforeEach(async () => {
    const user = await User.findOne({ email: 'test@example.com' });
    token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

describe('API Catways', () => {
    it('devrait lister tous les catways', async () => {
        const res = await request(app)
            .get('/api/catways')
            .set('Authorization', `Bearer ${token}`);
        assert.equal(res.status, 200);
        assert(Array.isArray(res.body));
    });

    it('devrait créer un catway', async () => {
        const res = await request(app)
            .post('/api/catways')
            .set('Authorization', `Bearer ${token}`)
            .send({ catwayNumber: 999, type: 'long', catwayState: 'disponible' });
        assert.equal(res.status, 201);
        assert(res.body.catwayNumber === 999);
    });

    it('devrait récupérer les détails d’un catway', async () => {
        const createRes = await request(app)
            .post('/api/catways')
            .set('Authorization', `Bearer ${token}`)
            .send({ catwayNumber: 1000, type: 'short', catwayState: 'occupé' });
        const catwayId = createRes.body._id;
        const res = await request(app)
            .get(`/api/catways/${catwayId}`)
            .set('Authorization', `Bearer ${token}`);
        assert.equal(res.status, 200);
        assert.equal(res.body._id, catwayId);
    });

    it('devrait modifier un catway (PUT)', async () => {
        const createRes = await request(app)
            .post('/api/catways')
            .set('Authorization', `Bearer ${token}`)
            .send({ catwayNumber: 1001, type: 'long', catwayState: 'disponible' });
        const catwayId = createRes.body._id;
        const res = await request(app)
            .put(`/api/catways/${catwayId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ catwayNumber: 1001, type: 'short', catwayState: 'occupé' });
        assert.equal(res.status, 200);
        assert.equal(res.body.type, 'short');
    });

    it('devrait modifier partiellement un catway (PATCH)', async () => {
        const createRes = await request(app)
            .post('/api/catways')
            .set('Authorization', `Bearer ${token}`)
            .send({ catwayNumber: 1002, type: 'long', catwayState: 'disponible' });
        const catwayId = createRes.body._id;
        const res = await request(app)
            .patch(`/api/catways/${catwayId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ catwayState: 'occupé' });
        assert.equal(res.status, 200);
        assert.equal(res.body.catwayState, 'occupé');
    });

    it('devrait supprimer un catway', async () => {
        const createRes = await request(app)
            .post('/api/catways')
            .set('Authorization', `Bearer ${token}`)
            .send({ catwayNumber: 1003, type: 'long', catwayState: 'disponible' });
        const catwayId = createRes.body._id;
        const res = await request(app)
            .delete(`/api/catways/${catwayId}`)
            .set('Authorization', `Bearer ${token}`);
        assert.equal(res.status, 200);
        assert.equal(res.body.message, 'Catway supprimé avec succès !');
    });
});

describe('API Réservations', () => {
    it('devrait lister toutes les réservations d’un catway', async () => {
        try {
            const catwayRes = await request(app)
                .post('/api/catways')
                .set('Authorization', `Bearer ${token}`)
                .send({ catwayNumber: 2000, type: 'long', catwayState: 'disponible' });
            if (catwayRes.status !== 201) throw new Error(`Échec de la création du catway: ${catwayRes.status} - ${catwayRes.text}`);
            const catwayId = catwayRes.body._id;
            const res = await request(app)
                .get(`/api/catways/${catwayId}/reservations`)
                .set('Authorization', `Bearer ${token}`);
            assert.equal(res.status, 200);
            assert(Array.isArray(res.body));
        } catch (err) {
            assert.fail(`Erreur: ${err.message}`);
        }
    });

    it('devrait créer une réservation', async () => {
        const catwayRes = await request(app)
            .post('/api/catways')
            .set('Authorization', `Bearer ${token}`)
            .send({ catwayNumber: 2001, type: 'long', catwayState: 'disponible' });
        if (catwayRes.status !== 201) throw new Error(`Échec de la création du catway: ${catwayRes.status}`);
        const catwayId = catwayRes.body._id;
        const checkIn = new Date('2025-03-19T10:00:00Z');
        const checkOut = new Date('2025-03-20T10:00:00Z');
        const res = await request(app)
            .post(`/api/catways/${catwayId}/reservations`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                clientName: 'TestClient',
                boatName: 'TestBoat',
                checkIn: checkIn.toISOString(),
                checkOut: checkOut.toISOString()
            });
        console.log('Réponse création réservation:', res.body, res.status);
        assert.equal(res.status, 201);
        assert.equal(res.body.clientName, 'TestClient');
    });

    it('devrait récupérer les détails d’une réservation', async () => {
        const catwayRes = await request(app)
            .post('/api/catways')
            .set('Authorization', `Bearer ${token}`)
            .send({ catwayNumber: 2002, type: 'long', catwayState: 'disponible' });
        if (catwayRes.status !== 201) throw new Error(`Échec de la création du catway: ${catwayRes.status}`);
        const catwayId = catwayRes.body._id;
        const checkIn = new Date('2025-03-19T10:00:00Z');
        const checkOut = new Date('2025-03-20T10:00:00Z');
        const reservationRes = await request(app)
            .post(`/api/catways/${catwayId}/reservations`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                clientName: 'TestClient2',
                boatName: 'TestBoat2',
                checkIn: checkIn.toISOString(),
                checkOut: checkOut.toISOString()
            });
        if (reservationRes.status !== 201) throw new Error(`Échec de la création de la réservation: ${reservationRes.status}`);
        const reservationId = reservationRes.body._id;
        const res = await request(app)
            .get(`/api/catways/${catwayId}/reservations/${reservationId}`)
            .set('Authorization', `Bearer ${token}`);
        assert.equal(res.status, 200);
        assert.equal(res.body._id, reservationId);
    });

    it('devrait supprimer une réservation', async () => {
        const catwayRes = await request(app)
            .post('/api/catways')
            .set('Authorization', `Bearer ${token}`)
            .send({ catwayNumber: 2003, type: 'long', catwayState: 'disponible' });
        if (catwayRes.status !== 201) throw new Error(`Échec de la création du catway: ${catwayRes.status}`);
        const catwayId = catwayRes.body._id;
        const checkIn = new Date('2025-03-19T10:00:00Z');
        const checkOut = new Date('2025-03-20T10:00:00Z');
        const reservationRes = await request(app)
            .post(`/api/catways/${catwayId}/reservations`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                clientName: 'TestClient3',
                boatName: 'TestBoat3',
                checkIn: checkIn.toISOString(),
                checkOut: checkOut.toISOString()
            });
        if (reservationRes.status !== 201) throw new Error(`Échec de la création de la réservation: ${reservationRes.status}`);
        const reservationId = reservationRes.body._id;
        const res = await request(app)
            .delete(`/api/catways/${catwayId}/reservations/${reservationId}`)
            .set('Authorization', `Bearer ${token}`);
        assert.equal(res.status, 200);
        assert.equal(res.body.message, 'Réservation supprimée avec succès !');
    });
});