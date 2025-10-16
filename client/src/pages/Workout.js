import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  Snackbar,
  Alert
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  Add,
  Timer,
  FitnessCenter,
  Check
} from '@mui/icons-material';

const Workout = () => {
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [workoutInProgress, setWorkoutInProgress] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [workoutTemplates, setWorkoutTemplates] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newWorkout, setNewWorkout] = useState({ name: '', exercises: [] });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Données d'exemple pour les templates de workout
  useEffect(() => {
    const templates = [
      {
        id: 1,
        name: 'Full Body Débutant',
        duration: '30 min',
        exercises: [
          { name: 'Push-ups', sets: 3, reps: 10, rest: 60 },
          { name: 'Squats', sets: 3, reps: 15, rest: 60 },
          { name: 'Planche', sets: 3, duration: 30, rest: 60 },
          { name: 'Jumping Jacks', sets: 3, reps: 20, rest: 60 }
        ]
      },
      {
        id: 2,
        name: 'Cardio Intense',
        duration: '20 min',
        exercises: [
          { name: 'Burpees', sets: 4, reps: 10, rest: 45 },
          { name: 'Mountain Climbers', sets: 4, reps: 20, rest: 45 },
          { name: 'High Knees', sets: 4, duration: 30, rest: 45 },
          { name: 'Jump Squats', sets: 4, reps: 15, rest: 45 }
        ]
      },
      {
        id: 3,
        name: 'Upper Body',
        duration: '40 min',
        exercises: [
          { name: 'Push-ups', sets: 4, reps: 12, rest: 90 },
          { name: 'Pike Push-ups', sets: 3, reps: 8, rest: 90 },
          { name: 'Tricep Dips', sets: 3, reps: 10, rest: 90 },
          { name: 'Planche', sets: 3, duration: 45, rest: 90 }
        ]
      }
    ];
    setWorkoutTemplates(templates);
  }, []);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    } else if (!isTimerRunning && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startWorkout = (template) => {
    setCurrentWorkout({ ...template, startTime: Date.now() });
    setWorkoutInProgress(true);
    setCurrentExerciseIndex(0);
    setTimer(0);
    setIsTimerRunning(true);
    setSnackbar({ open: true, message: `Workout "${template.name}" commencé !`, severity: 'success' });
  };

  const pauseResumeWorkout = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const stopWorkout = () => {
    setWorkoutInProgress(false);
    setCurrentWorkout(null);
    setCurrentExerciseIndex(0);
    setTimer(0);
    setIsTimerRunning(false);
    setSnackbar({ open: true, message: 'Workout terminé !', severity: 'info' });
  };

  const nextExercise = () => {
    if (currentExerciseIndex < currentWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      stopWorkout();
    }
  };

  const getCurrentProgress = () => {
    if (!currentWorkout) return 0;
    return ((currentExerciseIndex + 1) / currentWorkout.exercises.length) * 100;
  };

  const WorkoutCard = ({ workout }) => (
    <Grid item xs={12} sm={6} md={4}>
      <Card 
        elevation={3}
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)'
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom>
            {workout.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Timer fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {workout.duration}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FitnessCenter fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {workout.exercises.length} exercices
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            {workout.exercises.slice(0, 3).map((exercise, index) => (
              <Chip
                key={index}
                label={exercise.name}
                size="small"
                variant="outlined"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
            {workout.exercises.length > 3 && (
              <Chip
                label={`+${workout.exercises.length - 3} autres`}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </CardContent>
        <Box sx={{ p: 2, pt: 0 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={() => startWorkout(workout)}
            disabled={workoutInProgress}
          >
            Commencer
          </Button>
        </Box>
      </Card>
    </Grid>
  );

  const ActiveWorkoutPanel = () => {
    if (!workoutInProgress || !currentWorkout) return null;

    const currentExercise = currentWorkout.exercises[currentExerciseIndex];

    return (
      <Card elevation={3} sx={{ mb: 4, p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {currentWorkout.name} en cours
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={getCurrentProgress()} 
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" color="text.secondary">
            Exercice {currentExerciseIndex + 1} sur {currentWorkout.exercises.length}
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            {formatTime(timer)}
          </Typography>
          <Typography variant="h5" gutterBottom>
            {currentExercise.name}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
            {currentExercise.reps && (
              <Chip label={`${currentExercise.reps} répétitions`} />
            )}
            {currentExercise.duration && (
              <Chip label={`${currentExercise.duration} secondes`} />
            )}
            <Chip label={`${currentExercise.sets} séries`} />
            <Chip label={`${currentExercise.rest}s repos`} color="secondary" />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={isTimerRunning ? <Pause /> : <PlayArrow />}
            onClick={pauseResumeWorkout}
          >
            {isTimerRunning ? 'Pause' : 'Reprendre'}
          </Button>
          <Button
            variant="contained"
            startIcon={<Check />}
            onClick={nextExercise}
          >
            Exercice suivant
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Stop />}
            onClick={stopWorkout}
          >
            Arrêter
          </Button>
        </Box>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Mes Workouts
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Choisissez un workout ou créez le vôtre
        </Typography>
      </Box>

      <ActiveWorkoutPanel />

      <Grid container spacing={3}>
        {workoutTemplates.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </Grid>

      {workoutTemplates.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Aucun workout disponible
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Créez votre premier workout pour commencer
          </Typography>
        </Box>
      )}

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setOpenDialog(true)}
        disabled={workoutInProgress}
      >
        <Add />
      </Fab>

      {/* Dialog de création de workout */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Créer un nouveau workout</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du workout"
            fullWidth
            variant="outlined"
            value={newWorkout.name}
            onChange={(e) => setNewWorkout({...newWorkout, name: e.target.value})}
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle1" gutterBottom>
            Exercices (fonctionnalité à venir)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            La création personnalisée d'exercices sera disponible dans une prochaine version.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button variant="contained" disabled>Créer</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Workout;