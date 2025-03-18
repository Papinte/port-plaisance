const catwayService = require('../services/catwayService');

exports.getAllCatways = async (req, res) => {
    try {
        const catways = await catwayService.getAllCatways();
        res.json(catways);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCatwayById = async (req, res) => {
    try {
        const catway = await catwayService.getCatwayById(req.params.id);
        res.json(catway);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

exports.createCatway = async (req, res) => {
    try {
        const catway = await catwayService.createCatway(req.body);
        res.status(201).json(catway);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateCatway = async (req, res) => {
    try {
        const catway = await catwayService.updateCatway(req.params.id, req.body);
        res.json(catway);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

exports.patchCatway = async (req, res) => {
    try {
        const catway = await catwayService.patchCatway(req.params.id, req.body);
        res.json(catway);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

exports.deleteCatway = async (req, res) => {
    try {
        await catwayService.deleteCatway(req.params.id);
        res.json({ message: 'Catway supprimé avec succès !' });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};