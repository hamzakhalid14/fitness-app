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

module.exports = router;