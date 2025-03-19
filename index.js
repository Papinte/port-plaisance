const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { exec } = require('child_process');
const { execSync } = require('child_process');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
let PORT = process.env.PORT || 3000;

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

// Exécute les tests avant de démarrer le serveur
if (require.main === module) {
    try {
        const testOutput = execSync('npm test', { stdio: 'pipe', encoding: 'utf-8' });
        console.log('Tests réussis:', testOutput);
        // Vérifie si le port 3000 est libre
        exec(`netstat -aon | findstr :${PORT}`, (err, stdout, stderr) => {
            if (err || stdout) {
                console.warn('Port ${PORT} déjà utilisé, essai avec un port alternatif (3001)...');
                PORT = 3001; // Change de port si 3000 est occupé
            }
            app.listen(PORT, () => {
                console.log(`Serveur démarré sur le port ${PORT}`);
            });
        });
    } catch (error) {
        console.error('Tests échoués:', error.message);
        process.exit(1); // Arrête si les tests échouent
    }
}