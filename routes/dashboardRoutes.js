const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation');

// Créer un utilisateur
router.post('/users/create', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        res.redirect('/dashboard');
    } catch (err) {
        res.render('dashboard', { title: 'Tableau de bord', error: 'Erreur lors de la création de l’utilisateur : ' + err.message });
    }
});

// Modifier un utilisateur
router.post('/users/modify', async (req, res) => {
    try {
        const { id, name, email, password } = req.body;
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (password) updateData.password = password;
        const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!user) throw new Error('Utilisateur non trouvé');
        res.redirect('/dashboard');
    } catch (err) {
        res.render('dashboard', { title: 'Tableau de bord', error: 'Erreur lors de la modification de l’utilisateur : ' + err.message });
    }
});

// Supprimer un utilisateur
router.post('/users/delete', async (req, res) => {
    try {
        const { id } = req.body;
        const user = await User.findByIdAndDelete(id);
        if (!user) throw new Error('Utilisateur non trouvé');
        res.redirect('/dashboard');
    } catch (err) {
        res.render('dashboard', { title: 'Tableau de bord', error: 'Erreur lors de la suppression de l’utilisateur : ' + err.message });
    }
});

// Afficher les détails d'un utilisateur
router.get('/users/details', async (req, res) => {
    const { id } = req.query;
    const user = await User.findById(id);
    if (!user) return res.render('dashboard', { title: 'Tableau de bord', error: 'Utilisateur non trouvé' });
    res.render('dashboard', { title: 'Tableau de bord', message: `Détails : ${user.name}, ${user.email}` });
});

// Créer un catway
router.post('/catways/create', async (req, res) => {
    try {
        const { catwayNumber, type, catwayState } = req.body;
        const catway = new Catway({ catwayNumber, type, catwayState });
        await catway.save();
        res.redirect('/dashboard');
    } catch (err) {
        res.render('dashboard', { title: 'Tableau de bord', error: 'Erreur lors de la création du catway : ' + err.message });
    }
});

// Modifier l'état d'un catway
router.post('/catways/modify-state', async (req, res) => {
    try {
        const { id, catwayState } = req.body;
        const catway = await Catway.findByIdAndUpdate(id, { catwayState }, { new: true, runValidators: true });
        if (!catway) throw new Error('Catway non trouvé');
        res.redirect('/dashboard');
    } catch (err) {
        res.render('dashboard', { title: 'Tableau de bord', error: 'Erreur lors de la modification de l’état du catway : ' + err.message });
    }
});

// Supprimer un catway
router.post('/catways/delete', async (req, res) => {
    try {
        const { id } = req.body;
        const catway = await Catway.findByIdAndDelete(id);
        if (!catway) throw new Error('Catway non trouvé');
        res.redirect('/dashboard');
    } catch (err) {
        res.render('dashboard', { title: 'Tableau de bord', error: 'Erreur lors de la suppression du catway : ' + err.message });
    }
});

// Créer une réservation
router.post('/reservations/create', async (req, res) => {
    try {
        const { clientName, boatName, checkIn, checkOut } = req.body;
        const reservation = new Reservation({ clientName, boatName, checkIn, checkOut });
        await reservation.save();
        res.redirect('/dashboard');
    } catch (err) {
        res.render('dashboard', { title: 'Tableau de bord', error: 'Erreur lors de la création de la réservation : ' + err.message });
    }
});

// Supprimer une réservation
router.post('/reservations/delete', async (req, res) => {
    try {
        const { id } = req.body;
        const reservation = await Reservation.findByIdAndDelete(id);
        if (!reservation) throw new Error('Réservation non trouvée');
        res.redirect('/dashboard');
    } catch (err) {
        res.render('dashboard', { title: 'Tableau de bord', error: 'Erreur lors de la suppression de la réservation : ' + err.message });
    }
});

module.exports = router;