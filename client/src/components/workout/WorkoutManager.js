import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  LinearProgress,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Paper,
  Snackbar
} from '@mui/material';
import {
  FitnessCenter,
  Timer,
  LocalFireDepartment,
  PlayArrow,
  Edit,
  Delete,
  Visibility,
  Add,
  Close,
  Save,
  Remove
} from '@mui/icons-material';
import { workoutsAPI, exercisesAPI } from '../../services/api';

const WorkoutManager = () => {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [workoutForm, setWorkoutForm] = useState({
    name: '',
    duration: '',
    calories: '',
    notes: '',
    exercises: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [workoutsResponse, exercisesResponse] = await Promise.all([
        workoutsAPI.getAll(),
        exercisesAPI.getAll()
      ]);
      setWorkouts(workoutsResponse.data);
      setExercises(exercisesResponse.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      setError('Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkout = () => {
    setEditingWorkout(null);
    setWorkoutForm({
      name: '',
      duration: '',
      calories: '',
      notes: '',
      exercises: []
    });
    setSelectedExercises([]);
    setOpenDialog(true);
  };

  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout);
    setWorkoutForm({
      name: workout.name,
      duration: workout.duration || '',
      calories: workout.calories || '',
      notes: workout.notes || '',
      exercises: workout.exercises || []
    });
    const selectedIds = workout.exercises?.map(ex => ex.exercise._id || ex.exercise) || [];
    setSelectedExercises(selectedIds);
    setOpenDialog(true);
  };

  const handleDeleteWorkout = async (workoutId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet entraînement ?')) {
      try {
        await workoutsAPI.delete(workoutId);
        setWorkouts(workouts.filter(w => w._id !== workoutId));
        showSnackbar('Entraînement supprimé avec succès', 'success');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showSnackbar('Erreur lors de la suppression', 'error');
      }
    }
  };

  const handleSaveWorkout = async () => {
    try {
      const workoutData = {
        ...workoutForm,
        duration: workoutForm.duration ? parseInt(workoutForm.duration) : undefined,
        calories: workoutForm.calories ? parseInt(workoutForm.calories) : undefined,
        exercises: selectedExercises.map((exerciseId, index) => ({
          exercise: exerciseId,
          order: index + 1,
          sets: [
            {
              setNumber: 1,
              reps: 10,
              weight: 0,
              restTime: 60,
              completed: false
            }
          ]
        }))
      };

      let response;
      if (editingWorkout) {
        response = await workoutsAPI.update(editingWorkout._id, workoutData);
        setWorkouts(workouts.map(w => w._id === editingWorkout._id ? response.data : w));
        showSnackbar('Entraînement modifié avec succès', 'success');
      } else {
        response = await workoutsAPI.create(workoutData);
        setWorkouts([...workouts, response.data]);
        showSnackbar('Entraînement créé avec succès', 'success');
      }

      setOpenDialog(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showSnackbar('Erreur lors de la sauvegarde', 'error');
    }
  };

  const handleExerciseToggle = (exerciseId) => {
    setSelectedExercises(prev => {
      if (prev.includes(exerciseId)) {
        return prev.filter(id => id !== exerciseId);
      } else {
        return [...prev, exerciseId];
      }
    });
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCompletionColor = (completed) => {
    return completed ? 'success' : 'warning';
  };

  const getCompletionText = (completed) => {
    return completed ? 'Terminé' : 'En cours';
  };

  const getExerciseName = (exerciseId) => {
    const exercise = exercises.find(ex => ex._id === exerciseId);
    return exercise ? exercise.name : 'Exercice inconnu';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Mes Entraînements
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {workouts.length} entraînement(s) trouvé(s)
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateWorkout}
          sx={{ height: 'fit-content' }}
        >
          Nouveau Workout
        </Button>
      </Box>

      {workouts.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <FitnessCenter sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Aucun entraînement trouvé
            </Typography>
            <Typography color="textSecondary" sx={{ mb: 3 }}>
              Commencez par créer votre premier entraînement !
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={handleCreateWorkout}>
              Créer mon premier workout
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {workouts.map((workout) => (
            <Grid item xs={12} sm={6} md={4} key={workout._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                      {workout.name}
                    </Typography>
                    <Chip
                      label={getCompletionText(workout.completed)}
                      color={getCompletionColor(workout.completed)}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Timer sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                      <Typography variant="body2" color="textSecondary">
                        {workout.duration ? `${workout.duration} min` : 'Durée non définie'}
                      </Typography>
                    </Box>
                    
                    {workout.calories && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocalFireDepartment sx={{ mr: 1, fontSize: 20, color: 'orange' }} />
                        <Typography variant="body2" color="textSecondary">
                          {workout.calories} cal
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <FitnessCenter sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                      <Typography variant="body2" color="textSecondary">
                        {workout.exercises?.length || 0} exercice(s)
                      </Typography>
                    </Box>
                  </Box>

                  {workout.exercises && workout.exercises.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="textSecondary">
                        Exercices:
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        {workout.exercises.slice(0, 3).map((exerciseEntry, index) => (
                          <Chip
                            key={index}
                            label={exerciseEntry.exercise?.name || getExerciseName(exerciseEntry.exercise)}
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
                    </Box>
                  )}

                  <Typography variant="caption" color="textSecondary">
                    {formatDate(workout.date)}
                  </Typography>

                  {workout.notes && (
                    <Box sx={{ mt: 2 }}>
                      <Divider sx={{ mb: 1 }} />
                      <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                        "{workout.notes}"
                      </Typography>
                    </Box>
                  )}

                  {workout.exercises && workout.exercises.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="textSecondary">
                        Progression des exercices
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={workout.completed ? 100 : 0}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  )}
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      size="small" 
                      startIcon={<PlayArrow />}
                      variant={workout.completed ? "outlined" : "contained"}
                      sx={{ flex: 1 }}
                    >
                      {workout.completed ? 'Refaire' : 'Commencer'}
                    </Button>
                    
                    <IconButton size="small" color="primary">
                      <Visibility />
                    </IconButton>
                    
                    <IconButton 
                      size="small" 
                      color="warning"
                      onClick={() => handleEditWorkout(workout)}
                    >
                      <Edit />
                    </IconButton>
                    
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteWorkout(workout._id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {editingWorkout ? 'Modifier l\'entraînement' : 'Créer un nouveau entraînement'}
            <IconButton onClick={() => setOpenDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nom de l'entraînement"
              value={workoutForm.name}
              onChange={(e) => setWorkoutForm({...workoutForm, name: e.target.value})}
              sx={{ mb: 2 }}
              required
            />
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Durée (minutes)"
                  type="number"
                  value={workoutForm.duration}
                  onChange={(e) => setWorkoutForm({...workoutForm, duration: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Calories estimées"
                  type="number"
                  value={workoutForm.calories}
                  onChange={(e) => setWorkoutForm({...workoutForm, calories: e.target.value})}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={workoutForm.notes}
              onChange={(e) => setWorkoutForm({...workoutForm, notes: e.target.value})}
              sx={{ mb: 3 }}
            />

            <Typography variant="h6" gutterBottom>
              Sélectionner les exercices
            </Typography>
            
            <Paper sx={{ maxHeight: 300, overflow: 'auto', border: 1, borderColor: 'divider' }}>
              <List>
                {exercises.map((exercise) => (
                  <ListItem key={exercise._id} disablePadding>
                    <ListItemButton onClick={() => handleExerciseToggle(exercise._id)}>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={selectedExercises.includes(exercise._id)}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText 
                        primary={exercise.name}
                        secondary={`${exercise.category} - ${exercise.muscle}`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>

            {selectedExercises.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Exercices sélectionnés ({selectedExercises.length}):
                </Typography>
                <Box>
                  {selectedExercises.map((exerciseId) => (
                    <Chip
                      key={exerciseId}
                      label={getExerciseName(exerciseId)}
                      onDelete={() => handleExerciseToggle(exerciseId)}
                      deleteIcon={<Remove />}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveWorkout}
            disabled={!workoutForm.name || selectedExercises.length === 0}
            startIcon={<Save />}
          >
            {editingWorkout ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WorkoutManager;