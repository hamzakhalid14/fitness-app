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
  IconButton
} from '@mui/material';
import {
  FitnessCenter,
  Timer,
  LocalFireDepartment,
  PlayArrow,
  Edit,
  Delete,
  Visibility
} from '@mui/icons-material';
import axios from 'axios';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/workouts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setWorkouts(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des workouts:', error);
      setError('Impossible de charger les entraînements');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet entraînement ?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/workouts/${workoutId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setWorkouts(workouts.filter(w => w._id !== workoutId));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError('Impossible de supprimer l\'entraînement');
      }
    }
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mes Entraînements
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {workouts.length} entraînement(s) trouvé(s)
        </Typography>
      </Box>

      {workouts.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <FitnessCenter sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Aucun entraînement trouvé
            </Typography>
            <Typography color="textSecondary">
              Commencez par créer votre premier entraînement !
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {workouts.map((workout) => (
            <Grid item xs={12} sm={6} md={4} key={workout._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* En-tête du workout */}
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

                  {/* Informations principales */}
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

                  {/* Date */}
                  <Typography variant="caption" color="textSecondary">
                    {formatDate(workout.date)}
                  </Typography>

                  {/* Notes si disponibles */}
                  {workout.notes && (
                    <Box sx={{ mt: 2 }}>
                      <Divider sx={{ mb: 1 }} />
                      <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                        "{workout.notes}"
                      </Typography>
                    </Box>
                  )}

                  {/* Progress bar pour les exercices terminés */}
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

                {/* Actions */}
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
                    
                    <IconButton size="small" color="warning">
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
    </Container>
  );
};

export default WorkoutList;