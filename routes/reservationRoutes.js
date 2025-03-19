/**
 * @module reservationRoutes
 * @description Routes pour gérer les réservations via l'API.
 */
const express = require('express');
const router = express.Router({ mergeParams: true });
const reservationController = require('../controllers/reservationController');

/**
 * @route GET /api/catways/:id/reservations
 * @desc Liste toutes les réservations d'un catway
 */
router.get('/', reservationController.getAllReservations);

/**
 * @route GET /api/catways/:id/reservations/:reservationId
 * @desc Récupère une réservation spécifique
 */
router.get('/:reservationId', reservationController.getReservationById);

/**
 * @route POST /api/catways/:id/reservations
 * @desc Crée une nouvelle réservation
 */
router.post('/', reservationController.createReservation);

/**
 * @route DELETE /api/catways/:id/reservations/:reservationId
 * @desc Supprime une réservation
 */
router.delete('/:reservationId', reservationController.deleteReservation);

module.exports = router;