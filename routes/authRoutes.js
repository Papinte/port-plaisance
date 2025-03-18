const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User');

// Route pour créer un utilisateur (inscription)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).send('Utilisateur créé avec succès !');
    } catch (err) {
        res.status(500).send('Erreur : ' + err.message);
    }
});

// Route pour se connecter
router.post('/login', authController.login);

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;