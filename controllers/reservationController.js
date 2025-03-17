exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({ catwayNumber: req.params.id });
        res.json(reservations);
    } catch (err) {
        res.status(500).send('Erreur : ' + err.message);
    }
};

exports.getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.idReservation);
        if (!reservation) return res.status(404).send('Réservation non trouvée');
        res.json(reservation);
    } catch (err) {
        res.status(500).send('Erreur : ' + err.message);
    }
};

exports.createReservation = async (req, res) => {
    try {
        const { clientName, boatName, checkIn, checkOut } = req.body;
        const reservation = new Reservation({ catwayNumber: req.params.id, clientName, boatName, checkIn, checkOut });
        await reservation.save();
        res.status(201).json(reservation);
    } catch (err) {
        res.status(500).send('Erreur : ' + err.message);
    }
};

exports.deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.idReservation);
        if (!reservation) return res.status(404).send('Réservation non trouvée');
        res.send('Réservation supprimée avec succès !');
    } catch (err) {
        res.status(500).send('Erreur : ' + err.message);
    }
};