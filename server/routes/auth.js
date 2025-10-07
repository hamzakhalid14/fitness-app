const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

//inscription

router.post('/register', async (req, res) => {
    try{
        const { username, email, password } = req.body;
        //verifier si l'utilisateur existe deja
        const userExists = await User.findOne({
            $or: [{ email }, { username }]
        });
        if(userExists) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        const user = new User({
            username,
            email,
            password
        });
        await user.save();
        //generer un token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email, profile: user.profile } });
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

//connexion

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        //verifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        //verifier le mot de passe
        const isMatch = await user.correctPassword(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        //generer un token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, user: { id: user._id, username: user.username, email: user.email, profile: user.profile } });
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

//get user profile
router.get('/profile', auth, async (req, res) => {
    res.json(req.user);
});

// mettre à jour le profil
router.put('/profile', auth, async (req, res) => {
    try {
        const { username, email, profile } = req.body;
        
        // Vérifier si le nom d'utilisateur ou l'email existe déjà (sauf pour l'utilisateur actuel)
        const existingUser = await User.findOne({
            $and: [
                { _id: { $ne: req.user._id } },
                { $or: [{ email }, { username }] }
            ]
        });
        
        if (existingUser) {
            return res.status(400).json({ message: 'Ce nom d\'utilisateur ou cet email est déjà utilisé' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { username, email, profile },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});

// changer le mot de passe
router.put('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Vérifier le mot de passe actuel
        const user = await User.findById(req.user._id);
        const isMatch = await user.correctPassword(currentPassword, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
        }

        // Mettre à jour le mot de passe
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Mot de passe modifié avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});

module.exports = router;