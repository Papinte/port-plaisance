const Reservation = require('../models/Reservation');

exports.getAllReservations = async (catwayId) => {
    // catwayId est un ObjectId, mais on le convertit en nombre si nécessaire
    const catwayNumber = await require('../models/Catway').findById(catwayId).then(c => c.catwayNumber);
    return await Reservation.find({ catwayNumber: catwayNumber });
};

exports.getReservationById = async (id) => {
    const reservation = await Reservation.findById(id);
    if (!reservation) throw new Error('Réservation non trouvée');
    return reservation;
};

exports.createReservation = async (catwayId, reservationData) => {
    const { clientName, boatName, checkIn, checkOut } = reservationData;
    if (!clientName || !boatName || !checkIn || !checkOut) {
        throw new Error('Tous les champs (clientName, boatName, checkIn, checkOut) sont requis');
    }
    const catway = await require('../models/Catway').findById(catwayId);
    if (!catway) throw new Error('Catway non trouvé');
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        throw new Error('Dates invalides');
    }
    if (checkInDate >= checkOutDate) {
        throw new Error('La date de début doit être antérieure à la date de fin');
    }
    const reservation = new Reservation({ 
        catwayNumber: catway.catwayNumber, 
        ...reservationData 
    });
    return await reservation.save();
};

exports.deleteReservation = async (id) => {
    const reservation = await Reservation.findByIdAndDelete(id);
    if (!reservation) throw new Error('Réservation non trouvée');
    return true;
};