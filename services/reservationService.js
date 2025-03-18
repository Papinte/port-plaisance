const Reservation = require('../models/Reservation');

exports.getAllReservations = async (catwayId) => {
    return await Reservation.find({ catwayNumber: catwayId });
};

exports.getReservationById = async (id) => {
    const reservation = await Reservation.findById(id);
    if (!reservation) throw new Error('Réservation non trouvée');
    return reservation;
};

exports.createReservation = async (catwayId, reservationData) => {
    const { clientName, boatName, checkIn, checkOut } = reservationData;
    if (!catwayId || !clientName || !boatName || !checkIn || !checkOut) throw new Error('Tous les champs sont requis');
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkInDate >= checkOutDate) throw new Error('La date de début doit être antérieure à la date de fin');
    const reservation = new Reservation({ catwayNumber: catwayId, ...reservationData });
    return await reservation.save();
};

exports.deleteReservation = async (id) => {
    const reservation = await Reservation.findByIdAndDelete(id);
    if (!reservation) throw new Error('Réservation non trouvée');
    return true;
};