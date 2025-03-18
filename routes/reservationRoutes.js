const express = require('express');
const router = express.Router({ mergeParams: true });
const reservationController = require('../controllers/reservationController');

router.get('/', reservationController.getAllReservations);
router.get('/:reservationId', reservationController.getReservationById);
router.post('/', reservationController.createReservation);
router.delete('/:reservationId', reservationController.deleteReservation);

module.exports = router;