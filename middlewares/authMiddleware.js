const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    // Vérifier d'abord le token dans l'en-tête Authorization (pour les requêtes API)
    let token = req.headers['authorization']?.split(' ')[1];

    // Si pas de token dans l'en-tête, vérifier dans les cookies (pour les pages web)
    if (!token && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        // Si c'est une requête pour une page web, rediriger vers la page de connexion
        if (req.accepts('html')) {
            return res.redirect('/');
        }
        return res.status(401).send('Accès refusé : Aucun token fourni');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (req.accepts('html')) {
            return res.redirect('/');
        }
        res.status(403).send('Token invalide');
    }
};

module.exports = authenticateToken;