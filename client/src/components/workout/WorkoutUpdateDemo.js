import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Grid,
  Alert,
  TextField,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { workoutsAPI } from '../../services/api';

const WorkoutUpdateDemo = () => {
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'info' });
  const [updateForm, setUpdateForm] = useState({
    name: '',
    duration: '',
    calories: '',
    notes: ''
  });

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const response = await workoutsAPI.getAll();
      setWorkouts(response.data || response);
      setMessage({ text: `${(response.data || response).length} workouts chargés`, type: 'success' });
    } catch (error) {
      setMessage({ text: 'Erreur lors du chargement: ' + error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const selectWorkout = (workout) => {
    setSelectedWorkout(workout);
    setUpdateForm({
      name: workout.name || '',
      duration: workout.duration?.toString() || '',
      calories: workout.calories?.toString() || '',
      notes: workout.notes || ''
    });
  };

  const handleUpdate = async () => {
    if (!selectedWorkout) return;

    try {
      setLoading(true);
      const updateData = {
        ...updateForm,
        duration: parseInt(updateForm.duration) || 0,
        calories: parseInt(updateForm.calories) || 0
      };

      await workoutsAPI.update(selectedWorkout._id, updateData);
      setMessage({ text: 'Workout mis à jour avec succès!', type: 'success' });
      
      // Mettre à jour la liste locale
      setWorkouts(workouts.map(w => 
        w._id === selectedWorkout._id ? { ...w, ...updateData } : w
      ));
      
      // Mettre à jour le workout sélectionné
      setSelectedWorkout({ ...selectedWorkout, ...updateData });
      
    } catch (error) {
      setMessage({ text: 'Erreur lors de la mise à jour: ' + error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const createTestWorkout = async () => {
    try {
      setLoading(true);
      const testWorkout = {
        name: `Test Workout ${Date.now()}`,
        duration: 30,
        calories: 250,
        notes: 'Workout de test créé pour démonstration',
        exercises: []
      };

      const response = await workoutsAPI.create(testWorkout);
      setWorkouts([...workouts, response.data || response]);
      setMessage({ text: 'Workout de test créé avec succès!', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Erreur lors de la création: ' + error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        🧪 Démo des Fonctionnalités UPDATE
      </Typography>
      
      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Liste des workouts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Mes Workouts ({workouts.length})
                </Typography>
                <Button
                  variant="outlined"
                  onClick={createTestWorkout}
                  disabled={loading}
                  size="small"
                >
                  Créer Test
                </Button>
              </Box>
              
              <Button
                variant="contained"
                onClick={loadWorkouts}
                disabled={loading}
                fullWidth
                sx={{ mb: 2 }}
              >
                {loading ? <CircularProgress size={20} /> : 'Recharger'}
              </Button>

              {workouts.length === 0 ? (
                <Typography color="text.secondary" textAlign="center">
                  Aucun workout trouvé. Créez un workout de test pour commencer.
                </Typography>
              ) : (
                <List>
                  {workouts.map((workout, index) => (
                    <React.Fragment key={workout._id}>
                      {index > 0 && <Divider />}
                      <ListItem
                        button
                        selected={selectedWorkout?._id === workout._id}
                        onClick={() => selectWorkout(workout)}
                      >
                        <ListItemText
                          primary={workout.name}
                          secondary={
                            <Box>
                              <Chip label={`${workout.duration || 0} min`} size="small" sx={{ mr: 1 }} />
                              <Chip label={`${workout.calories || 0} cal`} size="small" color="secondary" />
                              {workout.notes && (
                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                  "{workout.notes}"
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Formulaire de mise à jour */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ✏️ Modifier le Workout
              </Typography>
              
              {!selectedWorkout ? (
                <Typography color="text.secondary">
                  Sélectionnez un workout à modifier dans la liste de gauche.
                </Typography>
              ) : (
                <Box component="form" sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Nom du workout"
                    value={updateForm.name}
                    onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                    margin="normal"
                  />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Durée (minutes)"
                        type="number"
                        value={updateForm.duration}
                        onChange={(e) => setUpdateForm({ ...updateForm, duration: e.target.value })}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Calories"
                        type="number"
                        value={updateForm.calories}
                        onChange={(e) => setUpdateForm({ ...updateForm, calories: e.target.value })}
                        margin="normal"
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={3}
                    value={updateForm.notes}
                    onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                    margin="normal"
                  />

                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleUpdate}
                      disabled={loading}
                      fullWidth
                    >
                      {loading ? <CircularProgress size={20} /> : 'Mettre à jour'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setSelectedWorkout(null);
                        setUpdateForm({ name: '', duration: '', calories: '', notes: '' });
                      }}
                      fullWidth
                    >
                      Annuler
                    </Button>
                  </Box>

                  {selectedWorkout && (
                    <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        📊 Informations actuelles:
                      </Typography>
                      <Typography variant="body2">
                        ID: {selectedWorkout._id}
                      </Typography>
                      <Typography variant="body2">
                        Créé: {new Date(selectedWorkout.createdAt).toLocaleString('fr-FR')}
                      </Typography>
                      {selectedWorkout.updatedAt && (
                        <Typography variant="body2">
                          Modifié: {new Date(selectedWorkout.updatedAt).toLocaleString('fr-FR')}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Instructions */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📋 Instructions de test
          </Typography>
          <Typography variant="body2" paragraph>
            1. <strong>Créer un workout de test</strong> : Cliquez sur "Créer Test" pour générer un workout d'exemple
          </Typography>
          <Typography variant="body2" paragraph>
            2. <strong>Sélectionner un workout</strong> : Cliquez sur un workout dans la liste de gauche
          </Typography>
          <Typography variant="body2" paragraph>
            3. <strong>Modifier les données</strong> : Utilisez le formulaire de droite pour modifier le nom, durée, calories et notes
          </Typography>
          <Typography variant="body2" paragraph>
            4. <strong>Sauvegarder</strong> : Cliquez sur "Mettre à jour" pour enregistrer les modifications
          </Typography>
          <Typography variant="body2" paragraph>
            5. <strong>Vérifier</strong> : Les modifications apparaîtront immédiatement dans la liste
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default WorkoutUpdateDemo;