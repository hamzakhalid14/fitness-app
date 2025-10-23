import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Edit,
  Delete,
  ArrowBack,
  FitnessCenter,
  Timer,
  LocalFireDepartment,
  Today,
  Notes,
  CheckCircle,
  RadioButtonUnchecked,
  Share,
  Print
} from '@mui/icons-material';

const ViewWorkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkout = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/workouts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setWorkout(response.data);
    } catch (error) {
      console.error('Erreur récupération workout:', error);
      setError('Impossible de charger l\'entraînement: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWorkout();
  }, [fetchWorkout]);

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet entraînement ?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/workouts/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        navigate('/my-workouts');
      } catch (error) {
        console.error('Erreur suppression:', error);
        setError('Erreur lors de la suppression');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotalVolume = () => {
    if (!workout?.exercises) return 0;
    return workout.exercises.reduce((total, exercise) => {
      return total + (exercise.sets * exercise.reps * exercise.weight);
    }, 0);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button onClick={() => navigate('/my-workouts')}>
          Retour aux entraînements
        </Button>
      </Container>
    );
  }

  if (!workout) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Entraînement non trouvé
        </Alert>
        <Button onClick={() => navigate('/my-workouts')}>
          Retour aux entraînements
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/my-workouts')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" gutterBottom>
              {workout.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip 
                icon={workout.completed ? <CheckCircle /> : <RadioButtonUnchecked />}
                label={workout.completed ? 'Terminé' : 'En cours'}
                color={workout.completed ? 'success' : 'warning'}
              />
              <Typography variant="body2" color="text.secondary">
                <Today sx={{ mr: 0.5, fontSize: 16 }} />
                {formatDate(workout.date || workout.createdAt)}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Imprimer">
            <IconButton onClick={() => window.print()}>
              <Print />
            </IconButton>
          </Tooltip>
          <Tooltip title="Partager">
            <IconButton>
              <Share />
            </IconButton>
          </Tooltip>
          <Button 
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate(`/edit-workout/${id}`)}
            sx={{ mr: 1 }}
          >
            Modifier
          </Button>
          <Button 
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
          >
            Supprimer
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Statistiques générales */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Statistiques de l'entraînement
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                      <Timer />
                    </Avatar>
                    <Typography variant="h4" color="primary">
                      {workout.duration || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      minutes
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'orange', mx: 'auto', mb: 1 }}>
                      <LocalFireDepartment />
                    </Avatar>
                    <Typography variant="h4" sx={{ color: 'orange' }}>
                      {workout.calories || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      calories
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1 }}>
                      <FitnessCenter />
                    </Avatar>
                    <Typography variant="h4" color="success.main">
                      {workout.exercises?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      exercices
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 1 }}>
                      <FitnessCenter />
                    </Avatar>
                    <Typography variant="h4" color="secondary.main">
                      {calculateTotalVolume().toFixed(0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      kg total
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Notes */}
        {workout.notes && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Notes sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Notes
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  "{workout.notes}"
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Liste des exercices */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Exercices ({workout.exercises?.length || 0})
              </Typography>
              
              {!workout.exercises || workout.exercises.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                  <FitnessCenter sx={{ fontSize: 64, mb: 2 }} />
                  <Typography variant="h6">
                    Aucun exercice dans cet entraînement
                  </Typography>
                </Box>
              ) : (
                <List>
                  {workout.exercises.map((exercise, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ px: 0 }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.light' }}>
                          {index + 1}
                        </Avatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="h6">
                                {exercise.name}
                              </Typography>
                              <Chip 
                                label={exercise.category} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Grid container spacing={2}>
                                {exercise.sets > 0 && (
                                  <Grid item>
                                    <Typography variant="body2">
                                      <strong>Séries:</strong> {exercise.sets}
                                    </Typography>
                                  </Grid>
                                )}
                                {exercise.reps > 0 && (
                                  <Grid item>
                                    <Typography variant="body2">
                                      <strong>Reps:</strong> {exercise.reps}
                                    </Typography>
                                  </Grid>
                                )}
                                {exercise.weight > 0 && (
                                  <Grid item>
                                    <Typography variant="body2">
                                      <strong>Poids:</strong> {exercise.weight} kg
                                    </Typography>
                                  </Grid>
                                )}
                                {exercise.duration > 0 && (
                                  <Grid item>
                                    <Typography variant="body2">
                                      <strong>Durée:</strong> {exercise.duration} min
                                    </Typography>
                                  </Grid>
                                )}
                              </Grid>
                              
                              {exercise.notes && (
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                  <em>Notes: {exercise.notes}</em>
                                </Typography>
                              )}
                              
                              {/* Calcul du volume pour cet exercice */}
                              {exercise.sets > 0 && exercise.reps > 0 && exercise.weight > 0 && (
                                <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                                  Volume: {(exercise.sets * exercise.reps * exercise.weight).toFixed(0)} kg
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < workout.exercises.length - 1 && <Divider sx={{ my: 2 }} />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Informations techniques */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: 'grey.50' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informations techniques
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>ID:</strong> {workout._id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Créé le:</strong> {formatDate(workout.createdAt)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Modifié le:</strong> {formatDate(workout.updatedAt)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Utilisateur:</strong> {workout.userId}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ViewWorkout;