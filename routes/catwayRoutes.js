/**
 * @module catwayRoutes
 * @description Routes pour gérer les catways via l'API.
 */
const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catwayController');

/**
 * @route GET /api/catways
 * @desc Liste tous les catways
 */
router.get('/', catwayController.getAllCatways);

/**
 * @route GET /api/catways/:id
 * @desc Récupère un catway spécifique
 */
router.get('/:id', catwayController.getCatwayById);

/**
 * @route POST /api/catways
 * @desc Crée un nouveau catway
 */
router.post('/', catwayController.createCatway);

/**
 * @route PUT /api/catways/:id
 * @desc Met à jour un catway (remplace toutes les données)
 */
router.put('/:id', catwayController.updateCatway);

/**
 * @route PATCH /api/catways/:id
 * @desc Met à jour partiellement un catway
 */
router.patch('/:id', catwayController.patchCatway);

/**
 * @route DELETE /api/catways/:id
 * @desc Supprime un catway
 */
router.delete('/:id', catwayController.deleteCatway);

module.exports = router;