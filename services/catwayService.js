const Catway = require('../models/Catway');

exports.getAllCatways = async () => {
    return await Catway.find();
};

exports.getCatwayById = async (id) => {
    const catway = await Catway.findById(id);
    if (!catway) throw new Error('Catway non trouvé');
    return catway;
};

exports.createCatway = async (catwayData) => {
    const { catwayNumber, type, catwayState } = catwayData;
    if (!catwayNumber || !type || !catwayState) throw new Error('Tous les champs sont requis');
    if (!['long', 'short'].includes(type)) throw new Error('Type doit être "long" ou "short"');
    const catway = new Catway(catwayData);
    return await catway.save();
};

exports.updateCatway = async (id, catwayData) => {
    return await Catway.findByIdAndUpdate(id, catwayData, { new: true, runValidators: true });
};

exports.patchCatway = async (id, catwayData) => {
    return await Catway.findByIdAndUpdate(id, catwayData, { new: true, runValidators: true });
};

exports.deleteCatway = async (id) => {
    const catway = await Catway.findByIdAndDelete(id);
    if (!catway) throw new Error('Catway non trouvé');
    return true;
};