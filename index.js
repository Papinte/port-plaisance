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

// Configurer EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour servir des fichiers statiques
app.use(express.static('public'));

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connecté à MongoDB'))
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

// Utiliser les routes API (préfixées par /api pour les séparer)
app.use('/api/catways', authenticateToken, catwayRoutes);
app.use('/api/catways/:id/reservations', authenticateToken, reservationRoutes);

// Routes spécifiques pour dashboardRoutes
app.use('/users', authenticateToken, dashboardRoutes); // Pour /users/create, /users/modify, etc.
app.use('/catways/create', authenticateToken, dashboardRoutes);
app.use('/catways/modify-state', authenticateToken, dashboardRoutes);
app.use('/catways/delete', authenticateToken, dashboardRoutes);
app.use('/reservations/create', authenticateToken, dashboardRoutes);
app.use('/reservations/delete', authenticateToken, dashboardRoutes);
app.use('/auth', authRoutes);

// Routes pour les pages HTML
app.get('/', (req, res) => {
    res.render('index', { title: 'Accueil - Port de Plaisance Russell', error: null });
});

app.get('/dashboard', authenticateToken, (req, res) => {
    res.render('dashboard', { title: 'Tableau de bord', error: null });
});

app.get('/catways', authenticateToken, async (req, res) => {
    const catways = await Catway.find();
    res.render('catways/index', { title: 'Liste des catways', catways });
});

app.get('/catways/:id', authenticateToken, async (req, res) => {
    const catway = await Catway.findById(req.params.id);
    if (!catway) return res.status(404).send('Catway non trouvé');
    res.render('catways/details', { title: 'Détails du catway', catway });
});

app.get('/catways/details', authenticateToken, async (req, res) => {
    const { id } = req.query;
    const catway = await Catway.findById(id);
    if (!catway) return res.render('dashboard', { title: 'Tableau de bord', error: 'Catway non trouvé' });
    res.render('catways/details', { title: 'Détails du catway', catway });
});

app.get('/reservations', authenticateToken, async (req, res) => {
    const reservations = await Reservation.find();
    res.render('reservations/index', { title: 'Liste des réservations', reservations });
});

app.get('/reservations/:id', authenticateToken, async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).send('Réservation non trouvée');
    res.render('reservations/details', { title: 'Détails de la réservation', reservation });
});

app.get('/reservations/details', authenticateToken, async (req, res) => {
    const { id } = req.query;
    const reservation = await Reservation.findById(id);
    if (!reservation) return res.render('dashboard', { title: 'Tableau de bord', error: 'Réservation non trouvée' });
    res.render('reservations/details', { title: 'Détails de la réservation', reservation });
});

app.get('/docs', (req, res) => {
    res.render('docs', { title: 'Documentation de l’API' });
});

// Ajoute cette ligne pour exporter l'app pour les tests
module.exports = app;

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});