/**
 * @module reservationService
 * @description Service pour gérer les opérations sur les réservations (logique métier).
 */
const Reservation = require('../models/Reservation');

/**
 * @desc Récupère toutes les réservations pour un catway spécifique
 * @param {string} catwayId - L'ID du catway
 * @returns {Array} Liste des réservations
 */
exports.getAllReservations = async (catwayId) => {
    // catwayId est un ObjectId, mais on le convertit en nombre si nécessaire
    const catwayNumber = await require('../models/Catway').findById(catwayId).then(c => c.catwayNumber);
    return await Reservation.find({ catwayNumber: catwayNumber });
};

/**
 * @desc Récupère une réservation par son ID
 * @param {string} id - L'ID de la réservation
 * @returns {Object} Détails de la réservation
 * @throws {Error} Si la réservation n'est pas trouvée
 */
exports.getReservationById = async (id) => {
    const reservation = await Reservation.findById(id);
    if (!reservation) throw new Error('Réservation non trouvée');
    return reservation;
};

/**
 * @desc Crée une nouvelle réservation pour un catway
 * @param {string} catwayId - L'ID du catway
 * @param {Object} reservationData - Données de la réservation (clientName, boatName, checkIn, checkOut)
 * @returns {Object} Réservation créée
 * @throws {Error} Si les données sont invalides ou le catway n'est pas trouvé
 */
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

/**
 * @desc Supprime une réservation
 * @param {string} id - L'ID de la réservation
 * @returns {boolean} Confirmation de suppression
 * @throws {Error} Si la réservation n'est pas trouvée
 */
exports.deleteReservation = async (id) => {
    const reservation = await Reservation.findByIdAndDelete(id);
    if (!reservation) throw new Error('Réservation non trouvée');
    return true;
};