/**
 * @module authMiddleware
 * @description Middleware pour gérer l'authentification via JWT.
 */
const jwt = require('jsonwebtoken');
require('dotenv').config();


/**
 * @desc Vérifie le token JWT dans l'en-tête Authorization
 * @param {Object} req - Requête HTTP
 * @param {Object} res - Réponse HTTP
 * @param {Function} next - Fonction pour passer au prochain middleware
 * @throws {401} Token manquant ou invalide
 */
const authenticateToken = (req, res, next) => {
    let token = req.headers['authorization']?.split(' ')[1];
    console.log('Authorization header:', req.headers['authorization']);

    if (!token && req.cookies.token) {
        token = req.cookies.token;
        console.log('Token lu depuis le cookie:', token);
    }

    if (!token) {
        console.log('Aucun token trouvé pour:', req.url);
        return res.status(401).send('Accès refusé : Aucun token fourni');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token décodé:', decoded);
        console.log('JWT_SECRET utilisé pour vérification:', process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log('Erreur de validation du token:', err);
        res.status(403).send('Token invalide');
    }
};

module.exports = authenticateToken;