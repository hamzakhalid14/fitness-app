const express = require('express');
const Exercise = require('../models/Exercise');
const auth = require('../middleware/auth');

const router = express.Router();

// des exercices publics et privés

router.get('/', auth, async (req, res) => {
    try {
        const exercises = await Exercise.find({
            $or: [
                { isPublic: true },
                { createdBy: req.user._id }
            ]
        }).populate('createdBy', 'username ');

        res.json(exercises);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur 2' });
    }
});
// exercice par id
router.get('/:id', auth, async (req, res) => {
    try {
        const exercise = await Exercise.findOne({
            _id: req.params.id,
            $or: [
                { isPublic: true },
                { createdBy: req.user._id }
            ]
        }).populate('createdBy', 'username');
        
        if (!exercise) {
            return res.status(404).json({ message: 'Exercice non trouvé' });
        }
        res.json(exercise);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});

// creer un exercice
router.post('/', auth, async (req, res) => {
    try {
        const newExercise = new Exercise({
            ...req.body,
            createdBy: req.user._id
        });
        await newExercise.save();
        await newExercise.populate('createdBy', 'username');
        res.status(201).json(newExercise);
    } catch (error) {
        console.error('Erreur création exercice:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Données invalides', 
                errors: Object.values(error.errors).map(e => e.message) 
            });
        }
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});
// mettre a jour un exercice
router.put('/:id', auth, async (req, res) => {
    try {
        const exercise = await Exercise.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user._id },
            req.body,
            { new: true, runValidators: true }
        ).populate('createdBy', 'username');
        
        if (!exercise) {
            return res.status(404).json({ message: 'Exercice non trouvé ou non autorisé' });
        }
        res.json(exercise);
    } catch (error) {
        console.error('Erreur modification exercice:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Données invalides', 
                errors: Object.values(error.errors).map(e => e.message) 
            });
        }
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});


// supprimer un exercice
router.delete('/:id', auth, async (req, res) => {
    try {
        const exercise = await Exercise.findOneAndDelete({ 
            _id: req.params.id, 
            createdBy: req.user._id 
        });
        
        if (!exercise) {
            return res.status(404).json({ message: 'Exercice non trouvé ou non autorisé' });
        }
        
        res.json({ message: 'Exercice supprimé' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});

module.exports = router;
