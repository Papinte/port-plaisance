const reservationService = require('../services/reservationService');

exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await reservationService.getAllReservations(req.params.id);
        res.json(reservations);
    } catch (err) {
        console.error('Erreur dans getAllReservations:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.getReservationById = async (req, res) => {
    try {
        const reservation = await reservationService.getReservationById(req.params.reservationId);
        res.json(reservation);
    } catch (err) {
        console.error('Erreur dans getReservationById:', err);
        res.status(404).json({ error: err.message });
    }
};

exports.createReservation = async (req, res) => {
    try {
        const reservation = await reservationService.createReservation(req.params.id, req.body);
        res.status(201).json(reservation);
    } catch (err) {
        console.error('Erreur dans createReservation:', err);
        res.status(400).json({ error: err.message });
    }
};

exports.deleteReservation = async (req, res) => {
    try {
        await reservationService.deleteReservation(req.params.reservationId);
        res.json({ message: 'Réservation supprimée avec succès !' });
    } catch (err) {
        console.error('Erreur dans deleteReservation:', err);
        res.status(404).json({ error: err.message });
    }
};