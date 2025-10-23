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
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  Snackbar,
  Badge,
  CardActions,
  CardHeader,
  Tooltip,
  Collapse,
  Avatar
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
  ExpandMore,
  ExpandLess,
  Schedule,
  Today,
  Group,
  Person,
  TrendingUp,
  Assessment
} from '@mui/icons-material';
import { workoutsAPI, exercisesAPI } from '../../services/api';

const WorkoutDisplay = () => {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [expandedWorkout, setExpandedWorkout] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' ou 'table'
  
  const [workoutForm, setWorkoutForm] = useState({
    name: '',
    duration: '',
    calories: '',
    notes: '',
    exercises: []
  });

  // Statistiques calculées
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalTime: 0,
    totalCalories: 0,
    averageDuration: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [workouts]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [workoutsResponse, exercisesResponse] = await Promise.all([
        workoutsAPI.getAll(),
        exercisesAPI.getAll()
      ]);
      console.log('Workouts récupérés:', workoutsResponse);
      setWorkouts(workoutsResponse.data || workoutsResponse);
      setExercises(exercisesResponse.data || exercisesResponse);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      setError('Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (!workouts || workouts.length === 0) {
      setStats({ totalWorkouts: 0, totalTime: 0, totalCalories: 0, averageDuration: 0 });
      return;
    }

    const totalWorkouts = workouts.length;
    const totalTime = workouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
    const totalCalories = workouts.reduce((sum, workout) => sum + (workout.calories || 0), 0);
    const averageDuration = totalWorkouts > 0 ? Math.round(totalTime / totalWorkouts) : 0;

    setStats({
      totalWorkouts,
      totalTime,
      totalCalories,
      averageDuration
    });
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
      name: workout.name || '',
      duration: workout.duration?.toString() || '',
      calories: workout.calories?.toString() || '',
      notes: workout.notes || '',
      exercises: workout.exercises || []
    });
    setSelectedExercises(workout.exercises?.map(ex => ex.exercise?._id || ex.exercise) || []);
    setOpenDialog(true);
  };

  const handleSaveWorkout = async () => {
    try {
      const workoutData = {
        ...workoutForm,
        duration: workoutForm.duration ? parseInt(workoutForm.duration) : 0,
        calories: workoutForm.calories ? parseInt(workoutForm.calories) : 0,
        exercises: selectedExercises.map((exerciseId, index) => ({
          exercise: exerciseId,
          order: index + 1,
          sets: [{
            setNumber: 1,
            reps: 10,
            weight: 0,
            restTime: 60,
            completed: false
          }]
        }))
      };

      let response;
      if (editingWorkout) {
        response = await workoutsAPI.update(editingWorkout._id, workoutData);
        setWorkouts(workouts.map(w => w._id === editingWorkout._id ? response.data || response : w));
        showSnackbar('Entraînement modifié avec succès', 'success');
      } else {
        response = await workoutsAPI.create(workoutData);
        setWorkouts([...workouts, response.data || response]);
        showSnackbar('Entraînement créé avec succès', 'success');
      }

      setOpenDialog(false);
      fetchData(); // Recharger les données pour s'assurer de la cohérence
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showSnackbar('Erreur lors de la sauvegarde', 'error');
    }
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

  const handleExerciseToggle = (exerciseId) => {
    setSelectedExercises(prev => {
      if (prev.includes(exerciseId)) {
        return prev.filter(id => id !== exerciseId);
      } else {
        return [...prev, exerciseId];
      }
    });
  };

  const toggleExpandWorkout = (workoutId) => {
    setExpandedWorkout(expandedWorkout === workoutId ? null : workoutId);
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

  const getStatusColor = (workout) => {
    if (workout.completed) return 'success';
    if (workout.status === 'en-cours') return 'warning';
    return 'default';
  };

  const getStatusText = (workout) => {
    if (workout.completed) return 'Terminé';
    if (workout.status === 'en-cours') return 'En cours';
    return 'Planifié';
  };

  const renderStatsCards = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ textAlign: 'center', backgroundColor: '#e3f2fd' }}>
          <CardContent>
            <Avatar sx={{ bgcolor: '#1976d2', mx: 'auto', mb: 1 }}>
              <Assessment />
            </Avatar>
            <Typography variant="h6" component="div">
              {stats.totalWorkouts}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Entraînements
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ textAlign: 'center', backgroundColor: '#fff3e0' }}>
          <CardContent>
            <Avatar sx={{ bgcolor: '#f57c00', mx: 'auto', mb: 1 }}>
              <Timer />
            </Avatar>
            <Typography variant="h6" component="div">
              {stats.totalTime} min
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Temps Total
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ textAlign: 'center', backgroundColor: '#ffebee' }}>
          <CardContent>
            <Avatar sx={{ bgcolor: '#d32f2f', mx: 'auto', mb: 1 }}>
              <LocalFireDepartment />
            </Avatar>
            <Typography variant="h6" component="div">
              {stats.totalCalories}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Calories Brûlées
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ textAlign: 'center', backgroundColor: '#e8f5e8' }}>
          <CardContent>
            <Avatar sx={{ bgcolor: '#388e3c', mx: 'auto', mb: 1 }}>
              <TrendingUp />
            </Avatar>
            <Typography variant="h6" component="div">
              {stats.averageDuration} min
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Durée Moyenne
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderWorkoutCard = (workout) => (
    <Grid item xs={12} sm={6} md={4} key={workout._id}>
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4
          }
        }}
      >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: getStatusColor(workout) === 'success' ? '#4caf50' : 
                           getStatusColor(workout) === 'warning' ? '#ff9800' : '#757575' }}>
              <FitnessCenter />
            </Avatar>
          }
          title={workout.name}
          subheader={formatDate(workout.createdAt)}
          action={
            <Chip 
              label={getStatusText(workout)} 
              color={getStatusColor(workout)}
              size="small"
            />
          }
        />
        
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Timer sx={{ mr: 1, fontSize: 16 }} />
              <Typography variant="body2" color="text.secondary">
                {workout.duration || 0} min
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalFireDepartment sx={{ mr: 1, fontSize: 16 }} />
              <Typography variant="body2" color="text.secondary">
                {workout.calories || 0} cal
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Group sx={{ mr: 1, fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              {workout.exercises?.length || 0} exercices
            </Typography>
          </Box>

          {workout.notes && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
              "{workout.notes}"
            </Typography>
          )}

          <Collapse in={expandedWorkout === workout._id}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Exercices:
            </Typography>
            <List dense>
              {workout.exercises?.map((exercise, index) => (
                <ListItem key={index} sx={{ py: 0 }}>
                  <ListItemText
                    primary={exercise.exercise?.name || 'Exercice inconnu'}
                    secondary={`${exercise.sets?.length || 0} série(s)`}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </CardContent>

        <CardActions>
          <Button
            size="small"
            onClick={() => toggleExpandWorkout(workout._id)}
            startIcon={expandedWorkout === workout._id ? <ExpandLess /> : <ExpandMore />}
          >
            {expandedWorkout === workout._id ? 'Réduire' : 'Détails'}
          </Button>
          
          <Tooltip title="Modifier">
            <IconButton
              size="small"
              onClick={() => handleEditWorkout(workout)}
              color="primary"
            >
              <Edit />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Supprimer">
            <IconButton
              size="small"
              onClick={() => handleDeleteWorkout(workout._id)}
              color="error"
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    </Grid>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* En-tête avec titre et bouton d'ajout */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mes Entraînements
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateWorkout}
          size="large"
        >
          Nouvel Entraînement
        </Button>
      </Box>

      {/* Cartes de statistiques */}
      {renderStatsCards()}

      {/* Liste des workouts */}
      {workouts.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <FitnessCenter sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Aucun entraînement trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Commencez votre parcours fitness en créant votre premier entraînement !
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateWorkout}
          >
            Créer mon premier entraînement
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {workouts.map(renderWorkoutCard)}
        </Grid>
      )}

      {/* Dialog pour créer/modifier un workout */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingWorkout ? 'Modifier l\'entraînement' : 'Nouvel entraînement'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nom de l'entraînement"
              value={workoutForm.name}
              onChange={(e) => setWorkoutForm({...workoutForm, name: e.target.value})}
              margin="normal"
              required
            />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Durée (minutes)"
                  type="number"
                  value={workoutForm.duration}
                  onChange={(e) => setWorkoutForm({...workoutForm, duration: e.target.value})}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Calories brûlées"
                  type="number"
                  value={workoutForm.calories}
                  onChange={(e) => setWorkoutForm({...workoutForm, calories: e.target.value})}
                  margin="normal"
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
              margin="normal"
            />

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Sélectionner les exercices:
            </Typography>
            
            <Paper sx={{ maxHeight: 200, overflow: 'auto', p: 1 }}>
              <List>
                {exercises.map((exercise) => (
                  <ListItem
                    key={exercise._id}
                    button
                    onClick={() => handleExerciseToggle(exercise._id)}
                  >
                    <Checkbox
                      checked={selectedExercises.includes(exercise._id)}
                      onChange={() => handleExerciseToggle(exercise._id)}
                    />
                    <ListItemText
                      primary={exercise.name}
                      secondary={exercise.muscleGroup}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Annuler
          </Button>
          <Button onClick={handleSaveWorkout} variant="contained">
            {editingWorkout ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert
          onClose={() => setSnackbar({...snackbar, open: false})}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WorkoutDisplay;