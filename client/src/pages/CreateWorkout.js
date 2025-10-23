import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add,
  Delete,
  Save,
  Cancel,
  FitnessCenter,
  Search,
  Timer,
  LocalFireDepartment
} from '@mui/icons-material';

const CreateWorkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Formulaire de base
  const [workoutData, setWorkoutData] = useState({
    name: '',
    duration: '',
    calories: '',
    notes: '',
    completed: false,
    exercises: []
  });

  // Gestion des exercices
  const [availableExercises, setAvailableExercises] = useState([]);
  const [exerciseDialog, setExerciseDialog] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseDetails, setExerciseDetails] = useState({
    sets: '',
    reps: '',
    weight: '',
    duration: '',
    notes: ''
  });

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/exercises', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAvailableExercises(response.data);
    } catch (error) {
      console.error('Erreur récupération exercices:', error);
    }
  };

  const handleWorkoutChange = (field, value) => {
    setWorkoutData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddExercise = () => {
    if (selectedExercise) {
      const newExercise = {
        exerciseId: selectedExercise._id,
        name: selectedExercise.name,
        category: selectedExercise.category,
        sets: parseInt(exerciseDetails.sets) || 0,
        reps: parseInt(exerciseDetails.reps) || 0,
        weight: parseFloat(exerciseDetails.weight) || 0,
        duration: parseInt(exerciseDetails.duration) || 0,
        notes: exerciseDetails.notes
      };

      setWorkoutData(prev => ({
        ...prev,
        exercises: [...prev.exercises, newExercise]
      }));

      // Reset
      setSelectedExercise(null);
      setExerciseDetails({
        sets: '',
        reps: '',
        weight: '',
        duration: '',
        notes: ''
      });
      setExerciseDialog(false);
    }
  };

  const handleRemoveExercise = (index) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...workoutData,
        duration: parseInt(workoutData.duration) || 0,
        calories: parseInt(workoutData.calories) || 0,
        date: new Date()
      };

      const response = await axios.post('http://localhost:5000/api/workouts', payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/my-workouts');
      }, 2000);

    } catch (error) {
      console.error('Erreur création workout:', error);
      setError('Erreur lors de la création de l\'entraînement: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">
            Créer un nouvel entraînement
          </Typography>
          <Box>
            <Button 
              onClick={() => navigate('/my-workouts')}
              sx={{ mr: 2 }}
            >
              Annuler
            </Button>
            <Button 
              variant="contained"
              startIcon={<Save />}
              onClick={handleSubmit}
              disabled={loading || !workoutData.name}
            >
              Sauvegarder
            </Button>
          </Box>
        </Box>

        {/* Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Entraînement créé avec succès ! Redirection...
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Informations de base */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Informations générales
                </Typography>
                
                <TextField
                  fullWidth
                  label="Nom de l'entraînement"
                  value={workoutData.name}
                  onChange={(e) => handleWorkoutChange('name', e.target.value)}
                  sx={{ mb: 3 }}
                  required
                />

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Durée (minutes)"
                      type="number"
                      value={workoutData.duration}
                      onChange={(e) => handleWorkoutChange('duration', e.target.value)}
                      InputProps={{
                        startAdornment: <Timer sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Calories brûlées"
                      type="number"
                      value={workoutData.calories}
                      onChange={(e) => handleWorkoutChange('calories', e.target.value)}
                      InputProps={{
                        startAdornment: <LocalFireDepartment sx={{ mr: 1, color: 'orange' }} />
                      }}
                    />
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={workoutData.notes}
                  onChange={(e) => handleWorkoutChange('notes', e.target.value)}
                  sx={{ mb: 3 }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={workoutData.completed}
                      onChange={(e) => handleWorkoutChange('completed', e.target.checked)}
                    />
                  }
                  label="Entraînement terminé"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Exercices */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Exercices ({workoutData.exercises.length})
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => setExerciseDialog(true)}
                  >
                    Ajouter
                  </Button>
                </Box>

                {workoutData.exercises.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                    <FitnessCenter sx={{ fontSize: 48, mb: 2 }} />
                    <Typography>
                      Aucun exercice ajouté
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {workoutData.exercises.map((exercise, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={exercise.name}
                            secondary={
                              <Box>
                                <Chip 
                                  label={exercise.category} 
                                  size="small" 
                                  sx={{ mr: 1, mb: 1 }} 
                                />
                                <Typography variant="body2">
                                  {exercise.sets > 0 && `${exercise.sets} séries`}
                                  {exercise.reps > 0 && ` × ${exercise.reps} reps`}
                                  {exercise.weight > 0 && ` @ ${exercise.weight}kg`}
                                  {exercise.duration > 0 && ` - ${exercise.duration}min`}
                                </Typography>
                                {exercise.notes && (
                                  <Typography variant="caption" color="text.secondary">
                                    {exercise.notes}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton 
                              edge="end" 
                              onClick={() => handleRemoveExercise(index)}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < workoutData.exercises.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Dialog pour ajouter un exercice */}
        <Dialog open={exerciseDialog} onClose={() => setExerciseDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Ajouter un exercice</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Sélectionner un exercice</InputLabel>
                <Select
                  value={selectedExercise?._id || ''}
                  onChange={(e) => {
                    const exercise = availableExercises.find(ex => ex._id === e.target.value);
                    setSelectedExercise(exercise);
                  }}
                >
                  {availableExercises.map((exercise) => (
                    <MenuItem key={exercise._id} value={exercise._id}>
                      <Box>
                        <Typography>{exercise.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {exercise.category}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Séries"
                    type="number"
                    value={exerciseDetails.sets}
                    onChange={(e) => setExerciseDetails(prev => ({...prev, sets: e.target.value}))}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Répétitions"
                    type="number"
                    value={exerciseDetails.reps}
                    onChange={(e) => setExerciseDetails(prev => ({...prev, reps: e.target.value}))}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Poids (kg)"
                    type="number"
                    value={exerciseDetails.weight}
                    onChange={(e) => setExerciseDetails(prev => ({...prev, weight: e.target.value}))}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Durée (min)"
                    type="number"
                    value={exerciseDetails.duration}
                    onChange={(e) => setExerciseDetails(prev => ({...prev, duration: e.target.value}))}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={2}
                    value={exerciseDetails.notes}
                    onChange={(e) => setExerciseDetails(prev => ({...prev, notes: e.target.value}))}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExerciseDialog(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleAddExercise}
              variant="contained"
              disabled={!selectedExercise}
            >
              Ajouter
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default CreateWorkout;