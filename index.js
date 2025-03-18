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

// Configurer EJS (corriger la clé 'view engine')
app.set('view engine', 'ejs'); // Correction ici
app.set('views', path.join(__dirname, 'views')); // Assurer que le chemin est correct

// Middleware pour servir des fichiers statiques
app.use(express.static('public'));

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connecté à MongoDB:', process.env.MONGO_URI))
    .catch(err => console.error('Erreur MongoDB:', err));

// Importer les middlewares
const authenticateToken = require('./middlewares/authMiddleware');

// Importer les modèles
const Catway = require('./models/Catway');
const Reservation = require('./models/Reservation');

// Importer les routes
const catwayRoutes = require('./routes/catwayRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Routes publiques (sans authentification)
app.get('/', (req, res) => {
    res.render('index', { title: 'Accueil - Port de Plaisance Russell', error: null });
});

app.get('/docs', (req, res) => {
    res.render('docs', { title: 'Documentation de l’API' });
});

app.use('/auth', authRoutes);

// Routes protégées (avec authentification)
app.use('/dashboard', authenticateToken, dashboardRoutes);
app.use('/api/catways', authenticateToken, catwayRoutes);
app.use('/api/catways/:id/reservations', authenticateToken, reservationRoutes);

// Routes protégées pour les pages HTML
app.get('/catways', authenticateToken, async (req, res) => {
    try {
        const catways = await Catway.find();
        res.render('catways/index', { title: 'Liste des catways', catways });
    } catch (err) {
        res.status(500).send('Erreur lors de la récupération des catways');
    }
});

app.get('/catways/:id', authenticateToken, async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id);
        if (!catway) return res.status(404).send('Catway non trouvé');
        res.render('catways/details', { title: 'Détails du catway', catway });
    } catch (err) {
        res.status(500).send('Erreur lors de la récupération des détails du catway');
    }
});

app.get('/catways/details', authenticateToken, async (req, res) => {
    try {
        const { id } = req.query;
        const catway = await Catway.findById(id);
        if (!catway) return res.render('dashboard', { title: 'Tableau de bord', error: 'Catway non trouvé' });
        res.render('catways/details', { title: 'Détails du catway', catway });
    } catch (err) {
        res.render('dashboard', { title: 'Tableau de bord', error: 'Erreur lors de la récupération des détails : ' + err.message });
    }
});

app.get('/reservations', authenticateToken, async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.render('reservations/index', { title: 'Liste des réservations', reservations });
    } catch (err) {
        res.status(500).send('Erreur lors de la récupération des réservations');
    }
});

app.get('/reservations/:id', authenticateToken, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) return res.status(404).send('Réservation non trouvée');
        res.render('reservations/details', { title: 'Détails de la réservation', reservation });
    } catch (err) {
        res.status(500).send('Erreur lors de la récupération des détails de la réservation');
    }
});

app.get('/reservations/details', authenticateToken, async (req, res) => {
    try {
        const { id } = req.query;
        const reservation = await Reservation.findById(id);
        if (!reservation) return res.render('dashboard', { title: 'Tableau de bord', error: 'Réservation non trouvée' });
        res.render('reservations/details', { title: 'Détails de la réservation', reservation });
    } catch (err) {
        res.render('dashboard', { title: 'Tableau de bord', error: 'Erreur lors de la récupération des détails : ' + err.message });
    }
});

// Middleware pour capturer les erreurs non gérées
app.use((err, req, res, next) => {
    console.error('Erreur non gérée:', err);
    res.status(500).send('Une erreur est survenue sur le serveur. Vérifiez le terminal pour plus de détails.');
});

// Ajoute cette ligne pour exporter l'app pour les tests
module.exports = app;

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});