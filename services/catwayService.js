/**
 * @module catwayService
 * @description Service pour gérer les opérations sur les catways (logique métier).
 */
const Catway = require('../models/Catway');


/**
 * @desc Récupère tous les catways
 * @returns {Array} Liste des catways
 */
exports.getAllCatways = async () => {
    return await Catway.find();
};

/**
 * @desc Récupère un catway par son ID
 * @param {string} id - L'ID du catway
 * @returns {Object} Détails du catway
 * @throws {Error} Si le catway n'est pas trouvé
 */
exports.getCatwayById = async (id) => {
    const catway = await Catway.findById(id);
    if (!catway) throw new Error('Catway non trouvé');
    return catway;
};

/**
 * @desc Crée un nouveau catway
 * @param {Object} catwayData - Données du catway (catwayNumber, type, catwayState)
 * @returns {Object} Catway créé
 * @throws {Error} Si les données sont invalides
 */
exports.createCatway = async (catwayData) => {
    const { catwayNumber, type, catwayState } = catwayData;
    if (!catwayNumber || !type || !catwayState) throw new Error('Tous les champs sont requis');
    if (!['long', 'short'].includes(type)) throw new Error('Type doit être "long" ou "short"');
    const catway = new Catway(catwayData);
    return await catway.save();
};

/**
 * @desc Met à jour un catway (remplace toutes les données)
 * @param {string} id - L'ID du catway
 * @param {Object} catwayData - Nouvelles données du catway
 * @returns {Object} Catway mis à jour
 */
exports.updateCatway = async (id, catwayData) => {
    return await Catway.findByIdAndUpdate(id, catwayData, { new: true, runValidators: true });
};

/**
 * @desc Met à jour partiellement un catway
 * @param {string} id - L'ID du catway
 * @param {Object} catwayData - Données à mettre à jour
 * @returns {Object} Catway mis à jour
 */
exports.patchCatway = async (id, catwayData) => {
    return await Catway.findByIdAndUpdate(id, catwayData, { new: true, runValidators: true });
};

/**
 * @desc Supprime un catway
 * @param {string} id - L'ID du catway
 * @returns {boolean} Confirmation de suppression
 * @throws {Error} Si le catway n'est pas trouvé
 */
exports.deleteCatway = async (id) => {
    const catway = await Catway.findByIdAndDelete(id);
    if (!catway) throw new Error('Catway non trouvé');
    return true;
};