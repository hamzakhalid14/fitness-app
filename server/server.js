const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
// Route de santé pour tester la connexion
app.get('/api/health', (req, res) => {
    res.json({ 
        message: 'Backend fonctionne !', 
        database: mongoose.connection.readyState === 1 ? 'Connectée' : 'Déconnectée',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/exercises', require('./routes/exercises'));

//connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-app')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
