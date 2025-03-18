const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = async (req, res) => {
    console.log('Traitement login avec:', req.body);
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('Email et mot de passe requis');
        }
        const user = await User.findOne({ email });
        if (!user) {
            if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
                return res.render('index', { title: 'Accueil - Port de Plaisance Russell', error: 'Email ou mot de passe incorrect' });
            }
            return res.status(401).send('Email ou mot de passe incorrect');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
                return res.render('index', { title: 'Accueil - Port de Plaisance Russell', error: 'Email ou mot de passe incorrect' });
            }
            return res.status(401).send('Email ou mot de passe incorrect');
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        const now = new Date();
        console.log('Token créé à:', now.toISOString(), 'Expiration:', new Date(now.getTime() + 60 * 60 * 1000).toISOString());
        console.log('Token créé:', token);
        console.log('JWT_SECRET utilisé:', process.env.JWT_SECRET);

        if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
            res.cookie('token', token, { httpOnly: true });
            console.log('Cookie défini avec token:', token);
            return res.redirect('/dashboard/dashboard'); // Ajuster la redirection ici
        }

        res.json({ token });
    } catch (err) {
        console.log('Erreur dans login:', err);
        res.status(500).send('Erreur : ' + err.message);
    }
};