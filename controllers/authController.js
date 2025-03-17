const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send('Email ou mot de passe incorrect');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send('Email ou mot de passe incorrect');
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
            res.cookie('token', token, { httpOnly: true });
            return res.redirect('/dashboard');
        }

        res.json({ token });
    } catch (err) {
        res.status(500).send('Erreur : ' + err.message);
    }
};