import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Fab,
  
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Search,
  Add,
  FitnessCenter,
  AccessTime,
  LocalFireDepartment,
  Edit,
  Delete
} from '@mui/icons-material';
import ExerciseForm from '../components/exercises/ExerciseForm';
import { exercisesAPI } from '../services/api';

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);

  // charger depuis l'API
  useEffect(() => {
    const load = async () => {
      try {
        const data = await exercisesAPI.getAll();
        // API peut renvoyer un tableau dans data.exercises ou data
        const list = Array.isArray(data) ? data : data.exercises || [];
        setExercises(list);
        setFilteredExercises(list);
      } catch (err) {
        console.error('Erreur en chargeant les exercices', err);
      }
    };

    load();
  }, []);

  // Filtrage des exercices
  useEffect(() => {
    let filtered = exercises;

    if (searchTerm) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(exercise =>
        exercise.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredExercises(filtered);
  }, [exercises, searchTerm, selectedCategory]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'primary';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      default: return 'Non défini';
    }
  };

  const handleAddExercise = () => {
    setEditingExercise(null);
    setOpenDialog(true);
  };

  const handleSaveExercise = async (form) => {
    try {
      if (editingExercise && editingExercise._id) {
        const updated = await exercisesAPI.update(editingExercise._id, form);
        setExercises(prev => prev.map(e => (e._id === updated._id ? updated : e)));
      } else {
        const created = await exercisesAPI.create(form);
        setExercises(prev => [created, ...prev]);
      }
      setOpenDialog(false);
      setEditingExercise(null);
    } catch (err) {
      console.error('Erreur sauvegarde exercice', err);
      let errorMessage = 'Erreur lors de la sauvegarde';
      
      if (err.errors && Array.isArray(err.errors)) {
        errorMessage = err.errors.join(', ');
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(errorMessage);
    }
  };

  const handleEdit = (exercise) => {
    setEditingExercise(exercise);
    setOpenDialog(true);
  };

  const handleDelete = async (exercise) => {
    if (!window.confirm('Supprimer cet exercice ?')) return;
    try {
      await exercisesAPI.delete(exercise._id || exercise.id);
      setExercises(prev => prev.filter(e => (e._id || e.id) !== (exercise._id || exercise.id)));
    } catch (err) {
      console.error('Erreur suppression', err);
      alert(err.message || 'Impossible de supprimer');
    }
  };

  const ExerciseCard = ({ exercise }) => (
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" component="div">
              {exercise.name}
            </Typography>
            <Chip
              label={getDifficultyLabel(exercise.difficulty)}
              color={getDifficultyColor(exercise.difficulty)}
              size="small"
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {exercise.category} • {exercise.muscleGroup}
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 2 }}>
            {exercise.description}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTime fontSize="small" color="action" />
              <Typography variant="body2">{exercise.duration}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocalFireDepartment fontSize="small" color="action" />
              <Typography variant="body2">{exercise.calories} cal</Typography>
            </Box>
          </Box>
        </CardContent>
        
        <CardActions>
          <Button size="small" startIcon={<FitnessCenter />}>
            Ajouter au workout
          </Button>
          <Button size="small" onClick={() => handleEdit(exercise)} startIcon={<Edit />}>
            Modifier
          </Button>
          <Button size="small" color="error" onClick={() => handleDelete(exercise)} startIcon={<Delete />}>
            Supprimer
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Bibliothèque d'exercices
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Découvrez et gérez vos exercices
        </Typography>
      </Box>

      {/* Filtres et recherche */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          variant="outlined"
          placeholder="Rechercher un exercice..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Catégorie</InputLabel>
          <Select
            value={selectedCategory}
            label="Catégorie"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="all">Toutes</MenuItem>
            <MenuItem value="force">Force</MenuItem>
            <MenuItem value="cardio">Cardio</MenuItem>
            <MenuItem value="core">Core</MenuItem>
            <MenuItem value="flexibility">Flexibilité</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Liste des exercices */}
      <Grid container spacing={3}>
        {filteredExercises.map((exercise) => (
          <ExerciseCard key={exercise._id || exercise.id} exercise={exercise} />
        ))}
      </Grid>

      {filteredExercises.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Aucun exercice trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Essayez de modifier vos critères de recherche
          </Typography>
        </Box>
      )}

      {/* Bouton d'ajout */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleAddExercise}
      >
        <Add />
      </Fab>

      {/* Dialog d'ajout d'exercice */}
      <ExerciseForm
        open={openDialog}
        onClose={() => { setOpenDialog(false); setEditingExercise(null); }}
        onSave={handleSaveExercise}
        initialData={editingExercise || {}}
      />
    </Container>
  );
};

export default Exercises;