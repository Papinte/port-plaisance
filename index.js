const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connecté à MongoDB:', process.env.MONGO_URI))
    .catch(err => console.error('Erreur MongoDB:', err));

const authenticateToken = require('./middlewares/authMiddleware');
const catwayRoutes = require('./routes/catwayRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Routes publiques
app.get('/', (req, res) => {
    res.render('index', { title: 'Accueil - Port de Plaisance Russell', error: null });
});

app.get('/docs', (req, res) => {
    res.render('docs', { title: 'Documentation de l’API' });
});

app.use('/auth', authRoutes);

// Routes API protégées
app.use('/api/catways', authenticateToken, catwayRoutes);
app.use('/api/catways/:id/reservations', authenticateToken, reservationRoutes);

// Routes HTML protégées
app.use('/dashboard', authenticateToken, dashboardRoutes);

// Routes HTML spécifiques pour les listes et détails
app.get('/catways', authenticateToken, async (req, res) => {
    try {
        const catways = await require('./models/Catway').find();
        res.render('catways/index', { title: 'Liste des catways', catways });
    } catch (err) {
        res.status(500).json({ error: 'Erreur : ' + err.message });
    }
});

app.get('/catways/:id', authenticateToken, async (req, res) => {
    try {
        const catway = await require('./models/Catway').findById(req.params.id);
        if (!catway) return res.status(404).json({ error: 'Catway non trouvé' });
        res.render('catways/details', { title: 'Détails du catway', catway });
    } catch (err) {
        res.status(500).json({ error: 'Erreur : ' + err.message });
    }
});

app.get('/reservations', authenticateToken, async (req, res) => {
    try {
        const reservations = await require('./models/Reservation').find();
        res.render('reservations/index', { title: 'Liste des réservations', reservations });
    } catch (err) {
        res.status(500).json({ error: 'Erreur : ' + err.message });
    }
});

app.get('/reservations/:id', authenticateToken, async (req, res) => {
    try {
        const reservation = await require('./models/Reservation').findById(req.params.id);
        if (!reservation) return res.status(404).json({ error: 'Réservation non trouvée' });
        res.render('reservations/details', { title: 'Détails de la réservation', reservation });
    } catch (err) {
        res.status(500).json({ error: 'Erreur : ' + err.message });
    }
});

app.use((err, req, res, next) => {
    console.error('Erreur non gérée:', err);
    res.status(500).json({ error: 'Une erreur est survenue sur le serveur.' });
});

module.exports = app;

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});