const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation');

// Route pour le tableau de bord
router.get('/dashboard', async (req, res) => {
    console.log('Requête GET /dashboard');
    try {
        res.render('dashboard', { title: 'Tableau de bord', error: null, message: null });
    } catch (err) {
        console.log('Erreur dans GET /dashboard:', err);
        res.render('dashboard', { title: 'Tableau de bord', error: 'Erreur : ' + err.message, message: null });
    }
});

// Créer un utilisateur
router.post('/users/create', async (req, res) => {
    console.log('Requête POST /users/create avec:', req.body);
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        const message = `Utilisateur "${name}" créé avec succès ! ID: ${user._id}`;
        res.render('dashboard', { title: 'Tableau de bord', error: null, message });
    } catch (err) {
        console.log('Erreur dans POST /users/create:', err);
        res.render('dashboard', { title: 'Tableau de bord', error: 'Erreur lors de la création de l’utilisateur : ' + err.message, message: null });
    }
});

// Modifier un utilisateur
router.post('/users/modify', async (req, res) => {
    console.log('Requête POST /users/modify avec:', req.body);
    try {
        const { id, name, email, password } = req.body;
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (password) updateData.password = password;
        const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!user) throw new Error('Utilisateur non trouvé');
        const message = `Utilisateur avec ID ${id} modifié avec succès !`;
        res.render('dashboard', { title: 'Tableau de bord', error: null, message });
    } catch (err) {
        console.log('Erreur dans POST /users/modify:', err);
        res.render('dashboard', { title: 'Tableau de bord', error: 'Erreur lors de la modification de l’utilisateur : ' + err.message, message: null });
    }
});

// Supprimer un utilisateur
router.post('/users/delete', async (req, res) => {
    console.log('Requête POST /users/delete avec:', req.body);
    try {
        const { id } = req.body;
        const user = await User.findByIdAndDelete(id);
        if (!user) throw new Error('Utilisateur non trouvé');
        const message = `Utilisateur avec ID ${id} supprimé avec succès !`;
        res.render('dashboard', { title: 'Tableau de bord', error: null, message });
    } catch (err) {
        console.log('Erreur dans POST /users/delete:', err);
        res.render('dashboard', { title: 'Tableau de bord', error: 'Erreur lors de la suppression de l’utilisateur : ' + err.message, message: null });
    }
});

// Afficher les détails d'un utilisateur
router.get('/users/details', async (req, res) => {
    console.log('Requête GET /users/details avec:', req.query);
    try {
        const { id } = req.query;
        const user = await User.findById(id);
        if (!user) throw new Error('Utilisateur non trouvé');
        const message = `Détails de l'utilisateur : Nom: ${user.name}, Email: ${user.email}, ID: ${user._id}`;
        res.render('dashboard', { title: 'Tableau de bord', error: null, message });
    } catch (err) {
        console.log('Erreur dans GET /users/details:', err);
        res.render('dashboard', { title: 'Tableau de bord', error: 'Erreur lors de la récupération des détails : ' + err.message, message: null });
    }
});

// Créer un catway
router.post('/catways/create', async (req, res) => {
    console.log('Requête POST /catways/create avec:', req.body);
    try {
        const { catwayNumber, type, catwayState } = req.body;
        const existingCatway = await Catway.findOne({ catwayNumber });
        if (existingCatway) {
            throw new Error('Un catway avec ce numéro existe déjà');
        }
        const catway = new Catway({ catwayNumber, type, catwayState });
        await catway.save();
        console.log('Catway sauvegardé:', catway);
        const savedCatway = await Catway.findById(catway._id);
        console.log('Catway retrouvé après sauvegarde:', savedCatway);
        const allCatways = await Catway.find();
        console.log('Tous les catways dans la base après création:', allCatways);
        const message = `Catway numéro ${catwayNumber} créé avec succès ! ID: ${catway._id}`;
        res.render('dashboard', { title: 'Tableau de bord', error: null, message });
    } catch (err) {
        console.log('Erreur dans POST /catways/create:', err);
        res.render('dashboard', { title: 'Tableau de bord', error: 'Erreur lors de la création du catway : ' + err.message, message: null });
    }
});

// Modifier l'état d'un catway
router.post('/catways/modify-state', async (req, res) => {
    console.log('Requête POST /catways/modify-state avec:', req.body);
    try {
        const { id, catwayState } = req.body;
        const catway = await Catway.findById(id);
        if (!catway) throw new Error('Catway non trouvé');
        catway.catwayState = catwayState;
        await catway.save();
        console.log('Catway modifié:', catway);
        const message = `État du catway avec ID ${id} modifié avec succès en "${catwayState}" !`;
        res.render('dashboard', { title: 'Tableau de bord', error: null, message });
    } catch (err) {
        console.log('Erreur dans POST /catways/modify-state:', err);
        res.render('dashboard', { title: 'Tableau de bord', error: 'Erreur lors de la modification de l’état du catway : ' + err.message, message: null });
    }
});

// Supprimer un catway
router.post('/catways/delete', async (req, res) => {
    console.log('Requête POST /catways/delete avec:', req.body);
    try {
        const { id } = req.body;
        const catway = await Catway.findById(id);
        if (!catway) throw new Error('Catway non trouvé');
        await Catway.deleteOne({ _id: id });
        console.log('Catway supprimé:', id);
        const message = `Catway avec ID ${id} supprimé avec succès !`;
        res.render('dashboard', { title: 'Tableau de bord', error: null, message });
    } catch (err) {
        console.log('Erreur dans POST /catways/delete:', err);
        res.render('dashboard', { title: 'Tableau de bord', error: 'Erreur lors de la suppression du catway : ' + err.message, message: null });
    }
});

// Créer une réservation
router.post('/reservations/create', async (req, res) => {
    console.log('Requête POST /reservations/create avec:', req.body);
    try {
        const { catwayNumber, clientName, boatName, checkIn, checkOut } = req.body;

        // Vérifier si les dates sont valides
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        if (checkInDate >= checkOutDate) {
            throw new Error('La date de début doit être antérieure à la date de fin');
        }

        // Vérifier les conflits de réservation
        const overlappingReservations = await Reservation.find({
            catwayNumber: catwayNumber,
            $or: [
                { checkIn: { $lte: checkOutDate }, checkOut: { $gte: checkInDate } }, // Chevauchement
            ],
        });
        if (overlappingReservations.length > 0) {
            throw new Error(`Le catway ${catwayNumber} est déjà réservé pour cette période.`);
        }

        // Vérifier si le catway existe
        const catway = await Catway.findOne({ catwayNumber });
        if (!catway) {
            throw new Error(`Le catway numéro ${catwayNumber} n'existe pas.`);
        }

        const reservation = new Reservation({ catwayNumber, clientName, boatName, checkIn, checkOut });
        await reservation.save();
        const message = `Réservation pour ${clientName} créée avec succès ! ID: ${reservation._id}`;
        res.render('dashboard', { title: 'Tableau de bord', error: null, message });
    } catch (err) {
        console.log('Erreur dans POST /reservations/create:', err);
        res.render('dashboard', { title: 'Tableau de bord', error: 'Erreur lors de la création de la réservation : ' + err.message, message: null });
    }
});

// Supprimer une réservation
router.post('/reservations/delete', async (req, res) => {
    console.log('Requête POST /reservations/delete avec:', req.body);
    try {
        const { id } = req.body;
        const reservation = await Reservation.findByIdAndDelete(id);
        if (!reservation) throw new Error('Réservation non trouvée');
        const message = `Réservation avec ID ${id} supprimée avec succès !`;
        res.render('dashboard', { title: 'Tableau de bord', error: null, message });
    } catch (err) {
        console.log('Erreur dans POST /reservations/delete:', err);
        res.render('dashboard', { title: 'Tableau de bord', error: 'Erreur lors de la suppression de la réservation : ' + err.message, message: null });
    }
});

module.exports = router;