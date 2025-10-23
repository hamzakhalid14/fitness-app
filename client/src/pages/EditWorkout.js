import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  FormControlLabel,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Delete,
  Save,
  Cancel,
  FitnessCenter,
  Timer,
  LocalFireDepartment,
  ArrowBack,
  Edit as EditIcon
} from '@mui/icons-material';

const EditWorkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
  const [editingExerciseIndex, setEditingExerciseIndex] = useState(null);

  const fetchWorkout = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/workouts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const workout = response.data;
      setWorkoutData({
        name: workout.name || '',
        duration: workout.duration?.toString() || '',
        calories: workout.calories?.toString() || '',
        notes: workout.notes || '',
        completed: workout.completed || false,
        exercises: workout.exercises || []
      });
    } catch (error) {
      console.error('Erreur récupération workout:', error);
      setError('Impossible de charger l\'entraînement: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchExercises = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchWorkout();
    fetchExercises();
  }, [fetchWorkout, fetchExercises]);

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

      if (editingExerciseIndex !== null) {
        // Modifier un exercice existant
        setWorkoutData(prev => ({
          ...prev,
          exercises: prev.exercises.map((ex, index) => 
            index === editingExerciseIndex ? newExercise : ex
          )
        }));
        setEditingExerciseIndex(null);
      } else {
        // Ajouter un nouvel exercice
        setWorkoutData(prev => ({
          ...prev,
          exercises: [...prev.exercises, newExercise]
        }));
      }

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

  const handleEditExercise = (index) => {
    const exercise = workoutData.exercises[index];
    setEditingExerciseIndex(index);
    
    // Trouver l'exercice correspondant dans la liste disponible
    const availableExercise = availableExercises.find(ex => ex._id === exercise.exerciseId);
    setSelectedExercise(availableExercise);
    
    setExerciseDetails({
      sets: exercise.sets?.toString() || '',
      reps: exercise.reps?.toString() || '',
      weight: exercise.weight?.toString() || '',
      duration: exercise.duration?.toString() || '',
      notes: exercise.notes || ''
    });
    
    setExerciseDialog(true);
  };

  const handleRemoveExercise = (index) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...workoutData,
        duration: parseInt(workoutData.duration) || 0,
        calories: parseInt(workoutData.calories) || 0
      };

      await axios.put(`http://localhost:5000/api/workouts/${id}`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuccess(true);
      setTimeout(() => {
        navigate(`/view-workout/${id}`);
      }, 2000);

    } catch (error) {
      console.error('Erreur modification workout:', error);
      setError('Erreur lors de la modification de l\'entraînement: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => navigate(`/view-workout/${id}`)} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h4">
                Modifier l'entraînement
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                ID: {id}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Button 
              onClick={() => navigate(`/view-workout/${id}`)}
              sx={{ mr: 2 }}
              startIcon={<Cancel />}
            >
              Annuler
            </Button>
            <Button 
              variant="contained"
              startIcon={<Save />}
              onClick={handleSubmit}
              disabled={saving || !workoutData.name}
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
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
            Entraînement modifié avec succès ! Redirection...
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
                    onClick={() => {
                      setEditingExerciseIndex(null);
                      setSelectedExercise(null);
                      setExerciseDetails({
                        sets: '',
                        reps: '',
                        weight: '',
                        duration: '',
                        notes: ''
                      });
                      setExerciseDialog(true);
                    }}
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
                              onClick={() => handleEditExercise(index)}
                              sx={{ mr: 1 }}
                            >
                              <EditIcon />
                            </IconButton>
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

        {/* Dialog pour ajouter/modifier un exercice */}
        <Dialog open={exerciseDialog} onClose={() => setExerciseDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingExerciseIndex !== null ? 'Modifier l\'exercice' : 'Ajouter un exercice'}
          </DialogTitle>
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
              {editingExerciseIndex !== null ? 'Modifier' : 'Ajouter'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default EditWorkout;