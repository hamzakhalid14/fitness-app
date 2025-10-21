import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  FitnessCenter,
  Timer,
  LocalFireDepartment,
  Delete,
  Edit,
  Visibility
} from '@mui/icons-material';
import axios from 'axios';

const MyWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' ou 'table'

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
      console.log('Workouts récupérés:', response.data);
      setWorkouts(response.data);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger les entraînements: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkout = async (id) => {
    if (window.confirm('Supprimer cet entraînement ?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/workouts/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setWorkouts(workouts.filter(w => w._id !== id));
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={fetchWorkouts} sx={{ mt: 2 }}>
          Réessayer
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Mes Entraînements
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {workouts.length} entraînement(s) dans votre base de données
          </Typography>
        </Box>
        <Box>
          <Button 
            variant={viewMode === 'cards' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('cards')}
            sx={{ mr: 1 }}
          >
            Cartes
          </Button>
          <Button 
            variant={viewMode === 'table' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('table')}
          >
            Tableau
          </Button>
        </Box>
      </Box>

      {workouts.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <FitnessCenter sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Aucun entraînement trouvé
            </Typography>
            <Typography color="textSecondary">
              Utilisez Postman pour ajouter des workouts à votre base de données
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Vue en cartes */}
          {viewMode === 'cards' && (
            <Grid container spacing={3}>
              {workouts.map((workout) => (
                <Grid item xs={12} sm={6} md={4} key={workout._id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" noWrap>
                          {workout.name}
                        </Typography>
                        <Chip 
                          label={workout.completed ? 'Terminé' : 'En cours'}
                          color={workout.completed ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Timer sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {workout.duration || 'N/A'} min
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocalFireDepartment sx={{ fontSize: 16, mr: 1, color: 'orange' }} />
                          <Typography variant="body2">
                            {workout.calories || 'N/A'} cal
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <FitnessCenter sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {workout.exercises?.length || 0} exercices
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="caption" color="textSecondary">
                        {formatDate(workout.date || workout.createdAt)}
                      </Typography>

                      {workout.notes && (
                        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                          "{workout.notes}"
                        </Typography>
                      )}

                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Tooltip title="Voir détails">
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Modifier">
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => deleteWorkout(workout._id)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Vue en tableau */}
          {viewMode === 'table' && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Durée</TableCell>
                    <TableCell>Calories</TableCell>
                    <TableCell>Exercices</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workouts.map((workout) => (
                    <TableRow key={workout._id}>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {workout.name}
                        </Typography>
                        {workout.notes && (
                          <Typography variant="caption" color="textSecondary">
                            {workout.notes}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={workout.completed ? 'Terminé' : 'En cours'}
                          color={workout.completed ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{workout.duration || 'N/A'} min</TableCell>
                      <TableCell>{workout.calories || 'N/A'} cal</TableCell>
                      <TableCell>{workout.exercises?.length || 0}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(workout.date || workout.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Voir">
                            <IconButton size="small">
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Modifier">
                            <IconButton size="small">
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => deleteWorkout(workout._id)}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {/* Informations de débogage */}
      <Card sx={{ mt: 4, bgcolor: 'grey.50' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Informations de debug
          </Typography>
          <Typography variant="body2">
            • Endpoint: GET /api/workouts<br/>
            • Nombre de workouts: {workouts.length}<br/>
            • Dernière mise à jour: {new Date().toLocaleTimeString()}
          </Typography>
          <Button 
            variant="outlined" 
            onClick={fetchWorkouts} 
            sx={{ mt: 2 }}
            size="small"
          >
            Actualiser
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default MyWorkouts;