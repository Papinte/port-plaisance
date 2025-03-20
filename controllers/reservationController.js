const reservationService = require('../services/reservationService');

/**
 * @module reservationController
 * @description Contrôleur pour gérer les opérations sur les réservations (création, lecture, suppression).
 */

/**
 * @route GET /api/catways/:id/reservations
 * @desc Récupère la liste des réservations pour un catway spécifique
 * @access Privé (nécessite un token JWT)
 * @param {string} id - L'ID du catway
 * @returns {Array} Liste des réservations
 * @throws {500} Erreur serveur
 */
exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await reservationService.getAllReservations(req.params.id);
        res.json(reservations);
    } catch (err) {
        console.error('Erreur dans getAllReservations:', err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * @route GET /api/catways/:id/reservations/:reservationId
 * @desc Récupère les détails d'une réservation spécifique
 * @access Privé (nécessite un token JWT)
 * @param {string} id - L'ID du catway
 * @param {string} reservationId - L'ID de la réservation
 * @returns {Object} Détails de la réservation
 * @throws {404} Réservation non trouvée
 */
exports.getReservationById = async (req, res) => {
    try {
        const reservation = await reservationService.getReservationById(req.params.reservationId);
        res.json(reservation);
    } catch (err) {
        console.error('Erreur dans getReservationById:', err);
        res.status(404).json({ error: err.message });
    }
};

/**
 * @route POST /api/catways/:id/reservations
 * @desc Crée une nouvelle réservation pour un catway
 * @access Privé (nécessite un token JWT)
 * @param {string} id - L'ID du catway
 * @param {Object} req.body - Données de la réservation (clientName, boatName, checkIn, checkOut)
 * @returns {Object} Réservation créée
 * @throws {400} Données invalides
 */
exports.createReservation = async (req, res) => {
    try {
        const reservation = await reservationService.createReservation(req.params.id, req.body);
        res.status(201).json(reservation);
    } catch (err) {
        console.error('Erreur dans createReservation:', err);
        res.status(400).json({ error: err.message });
    }
};

/**
 * @route DELETE /api/catways/:id/reservations/:reservationId
 * @desc Supprime une réservation
 * @access Privé (nécessite un token JWT)
 * @param {string} id - L'ID du catway
 * @param {string} reservationId - L'ID de la réservation
 * @returns {Object} Message de confirmation
 * @throws {404} Réservation non trouvée
 */
exports.deleteReservation = async (req, res) => {
    try {
        await reservationService.deleteReservation(req.params.reservationId);
        res.json({ message: 'Réservation supprimée avec succès !' });
    } catch (err) {
        console.error('Erreur dans deleteReservation:', err);
        res.status(404).json({ error: err.message });
    }
};