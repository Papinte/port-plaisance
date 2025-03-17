const Catway = require('../models/Catway');

exports.getAllCatways = async (req, res) => {
    try {
        const catways = await Catway.find();
        res.render('catways/index', { title: 'Liste des catways', catways });
    } catch (err) {
        res.status(500).send('Erreur : ' + err.message);
    }
};

exports.getCatwayById = async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id);
        if (!catway) return res.status(404).send('Catway non trouvé');
        res.render('catways/details', { title: 'Détails du catway', catway }); // Rendre la vue
    } catch (err) {
        res.status(500).send('Erreur : ' + err.message);
    }
};

exports.createCatway = async (req, res) => {
    try {
        const { catwayNumber, type, catwayState } = req.body;
        const catway = new Catway({ catwayNumber, type, catwayState });
        await catway.save();
        res.status(201).send('Catway créé avec succès !');
    } catch (err) {
        res.status(500).send('Erreur : ' + err.message);
    }
};

exports.updateCatway = async (req, res) => {
    try {
        const { catwayNumber, type, catwayState } = req.body;
        const catway = await Catway.findByIdAndUpdate(
            req.params.id,
            { catwayNumber, type, catwayState },
            { new: true, runValidators: true }
        );
        if (!catway) return res.status(404).send('Catway non trouvé');
        res.json(catway);
    } catch (err) {
        res.status(500).send('Erreur : ' + err.message);
    }
};

exports.patchCatway = async (req, res) => {
    try {
        const catway = await Catway.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!catway) return res.status(404).send('Catway non trouvé');
        res.json(catway);
    } catch (err) {
        res.status(500).send('Erreur : ' + err.message);
    }
};

exports.deleteCatway = async (req, res) => {
    try {
        const catway = await Catway.findByIdAndDelete(req.params.id);
        if (!catway) return res.status(404).send('Catway non trouvé');
        res.send('Catway supprimé avec succès !');
    } catch (err) {
        res.status(500).send('Erreur : ' + err.message);
    }
};