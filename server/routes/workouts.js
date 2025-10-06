const express = require('express');
const Exercise = require('../models/Exercise');
const auth = require('../middleware/auth');
const Workout = require('../models/Workout');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const workouts = await Workout.find({ userId: req.user._id }).populate('exercises.exercise');
        res.json(workouts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});

// obtenir un entrainement par id
router.get('/:id', auth, async (req, res) => {
    try {
        const workout = await Workout.findOne({ _id: req.params.id, userId: req.user._id }).populate('exercises.exercise');
        if (!workout) {
            return res.status(404).json({ message: 'Entraînement non trouvé' });
        }
        res.json(workout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});

// creer un entrainement
router.post('/', auth, async (req, res) => {
    try {
        const newWorkout = new Workout({
            ...req.body,
            userId: req.user._id
        });
        await newWorkout.save();
        await newWorkout.populate('exercises.exercise');
        res.status(201).json(newWorkout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});

// mettre a jour un entrainement
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedWorkout = await Workout.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { ...req.body },
            { new: true }
        ).populate('exercises.exercise');

        if (!updatedWorkout) {
            return res.status(404).json({ message: 'Entraînement non trouvé' });
        }

        res.json(updatedWorkout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});

// supprimer un entrainement
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedWorkout = await Workout.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!deletedWorkout) {
            return res.status(404).json({ message: 'Entraînement non trouvé' });
        }
        res.json({ message: 'Entraînement supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});
module.exports = router;