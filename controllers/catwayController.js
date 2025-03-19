const catwayService = require('../services/catwayService');

/**
 * @module catwayController
 * @description Contrôleur pour gérer les opérations sur les catways (création, lecture, mise à jour, suppression).
 */

/**
 * @route GET /api/catways
 * @desc Récupère la liste de tous les catways
 * @access Privé (nécessite un token JWT)
 * @returns {Array} Liste des catways
 * @throws {500} Erreur serveur
 */
exports.getAllCatways = async (req, res) => {
    try {
        const catways = await catwayService.getAllCatways();
        res.json(catways);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @route GET /api/catways/:id
 * @desc Récupère les détails d'un catway spécifique
 * @access Privé (nécessite un token JWT)
 * @param {string} id - L'ID du catway
 * @returns {Object} Détails du catway
 * @throws {404} Catway non trouvé
 */
exports.getCatwayById = async (req, res) => {
    try {
        const catway = await catwayService.getCatwayById(req.params.id);
        res.json(catway);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

/**
 * @route POST /api/catways
 * @desc Crée un nouveau catway
 * @access Privé (nécessite un token JWT)
 * @param {Object} req.body - Données du catway (catwayNumber, type, catwayState)
 * @returns {Object} Catway créé
 * @throws {400} Données invalides
 */
exports.createCatway = async (req, res) => {
    try {
        const catway = await catwayService.createCatway(req.body);
        res.status(201).json(catway);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * @route PUT /api/catways/:id
 * @desc Met à jour un catway existant (remplace toutes les données)
 * @access Privé (nécessite un token JWT)
 * @param {string} id - L'ID du catway
 * @param {Object} req.body - Nouvelles données du catway
 * @returns {Object} Catway mis à jour
 * @throws {404} Catway non trouvé
 */
exports.updateCatway = async (req, res) => {
    try {
        const catway = await catwayService.updateCatway(req.params.id, req.body);
        res.json(catway);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

/**
 * @route PATCH /api/catways/:id
 * @desc Met à jour partiellement un catway existant
 * @access Privé (nécessite un token JWT)
 * @param {string} id - L'ID du catway
 * @param {Object} req.body - Données à mettre à jour (ex. catwayState)
 * @returns {Object} Catway mis à jour
 * @throws {404} Catway non trouvé
 */
exports.patchCatway = async (req, res) => {
    try {
        const catway = await catwayService.patchCatway(req.params.id, req.body);
        res.json(catway);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

/**
 * @route DELETE /api/catways/:id
 * @desc Supprime un catway
 * @access Privé (nécessite un token JWT)
 * @param {string} id - L'ID du catway
 * @returns {Object} Message de confirmation
 * @throws {404} Catway non trouvé
 */
exports.deleteCatway = async (req, res) => {
    try {
        await catwayService.deleteCatway(req.params.id);
        res.json({ message: 'Catway supprimé avec succès !' });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};