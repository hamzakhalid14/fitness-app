import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  Add,
  Timer
} from '@mui/icons-material';
import axios from 'axios';

const WorkoutTracker = () => {
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, time]);

  const startWorkout = () => {
    setIsActive(true);
    // Créer un nouvel entraînement si aucun n'est en cours
    if (!currentWorkout) {
      const newWorkout = {
        name: `Entraînement ${new Date().toLocaleDateString()}`,
        date: new Date(),
        exercises: [],
        completed: false
      };
      setCurrentWorkout(newWorkout);
    }
  };

  const pauseWorkout = () => {
    setIsActive(false);
  };

  const finishWorkout = async () => {
    setIsActive(false);
    
    if (currentWorkout) {
      try {
        const workoutToSave = {
          ...currentWorkout,
          duration: Math.floor(time / 60), // convertir en minutes
          completed: true
        };
        
        await axios.post('/api/workouts', workoutToSave);
        setCurrentWorkout(null);
        setTime(0);
      } catch (error) {
        console.error('Error saving workout:', error);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header avec timer */}
      <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          {currentWorkout?.name || 'Entraînement en cours'}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Timer sx={{ mr: 1, fontSize: 40 }} />
          <Typography variant="h3" component="div">
            {formatTime(time)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          {!isActive ? (
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={startWorkout}
              color="success"
            >
              Démarrer
            </Button>
          ) : (
            <Button
              variant="outlined"
              startIcon={<Pause />}
              onClick={pauseWorkout}
            >
              Pause
            </Button>
          )}
          
          <Button
            variant="contained"
            startIcon={<Stop />}
            onClick={finishWorkout}
            color="error"
            disabled={!currentWorkout}
          >
            Terminer
          </Button>
        </Box>
      </Paper>

      {/* Exercices de l'entraînement */}
      {currentWorkout && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Exercices
          </Typography>
          
          {currentWorkout.exercises.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary" gutterBottom>
                Aucun exercice ajouté
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => {/* Ouvrir modal d'ajout */}}
              >
                Ajouter un exercice
              </Button>
            </Paper>
          ) : (
            <List>
              {currentWorkout.exercises.map((exercise, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={exercise.exercise?.name}
                    secondary={
                      <Box>
                        <Typography variant="body2">
                          {exercise.sets.length} séries
                        </Typography>
                        {exercise.notes && (
                          <Typography variant="body2" color="textSecondary">
                            Notes: {exercise.notes}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      onClick={() => setSelectedExercise(exercise)}
                    >
                      Démarrer
                    </Button>
                    <IconButton size="small">
                      <Add />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      )}

      {/* Modal pour tracker un exercice spécifique */}
      {selectedExercise && (
        <ExerciseTracker
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onUpdate={(updatedExercise) => {
            // Mettre à jour l'exercice dans currentWorkout
            const updatedExercises = currentWorkout.exercises.map(ex =>
              ex === selectedExercise ? updatedExercise : ex
            );
            setCurrentWorkout(prev => ({
              ...prev,
              exercises: updatedExercises
            }));
          }}
        />
      )}
    </Box>
  );
};

// Composant pour tracker un exercice spécifique
const ExerciseTracker = ({ exercise, onClose, onUpdate }) => {
  const [currentSet, setCurrentSet] = useState(0);
  const [restTime, setRestTime] = useState(0);

  const handleSetComplete = (setIndex, data) => {
    const updatedSets = exercise.sets.map((set, index) =>
      index === setIndex ? { ...set, ...data, completed: true } : set
    );
    
    onUpdate({
      ...exercise,
      sets: updatedSets
    });

    // Démarrer le timer de repos si ce n'est pas le dernier set
    if (setIndex < exercise.sets.length - 1 && data.restTime) {
      setRestTime(data.restTime);
      setCurrentSet(setIndex + 1);
    }
  };

  return (
    <Paper sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', p: 3, minWidth: 400 }}>
      <Typography variant="h6" gutterBottom>
        {exercise.exercise?.name}
      </Typography>
      
      {/* Affichage du set courant */}
      {exercise.sets[currentSet] && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">
              Set {currentSet + 1}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                label="Répétitions"
                type="number"
                defaultValue={exercise.sets[currentSet].reps}
                size="small"
              />
              <TextField
                label="Poids (kg)"
                type="number"
                defaultValue={exercise.sets[currentSet].weight}
                size="small"
              />
              <TextField
                label="Repos (s)"
                type="number"
                defaultValue={exercise.sets[currentSet].restTime}
                size="small"
              />
            </Box>
            
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => handleSetComplete(currentSet, {
                reps: exercise.sets[currentSet].reps,
                weight: exercise.sets[currentSet].weight,
                restTime: exercise.sets[currentSet].restTime
              })}
            >
              Set Terminé
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Timer de repos */}
      {restTime > 0 && (
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h6" color="primary">
            Repos: {restTime}s
          </Typography>
        </Box>
      )}

      <Button onClick={onClose} fullWidth>
        Fermer
      </Button>
    </Paper>
  );
};

export default WorkoutTracker;