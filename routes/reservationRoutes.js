const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams pour accéder à :id
const reservationController = require('../controllers/reservationController');

router.get('/', reservationController.getAllReservations);
router.get('/:idReservation', reservationController.getReservationById);
router.post('/', reservationController.createReservation);
router.delete('/:idReservation', reservationController.deleteReservation);

module.exports = router;