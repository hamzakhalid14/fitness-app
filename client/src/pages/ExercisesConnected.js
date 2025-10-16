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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Search,
  Add,
  FitnessCenter,
  Edit,
  Delete
} from '@mui/icons-material';
import { exercisesAPI } from '../services/api';

const ExercisesConnected = () => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newExercise, setNewExercise] = useState({
    name: '',
    category: '',
    muscleGroup: '',
    description: '',
    difficulty: 'beginner'
  });

  // Charger les exercices depuis le backend
  useEffect(() => {
    const loadExercises = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await exercisesAPI.getAll();
        setExercises(response.exercises || response || []);
      } catch (error) {
        console.error('Erreur lors du chargement des exercices:', error);
        setError('Impossible de charger les exercices depuis le serveur. Affichage des exercices de démonstration.');
        
        // Exercices de démonstration en cas d'erreur
        const demoExercises = [
          {
            _id: '1',
            name: 'Push-ups',
            category: 'Force',
            muscleGroup: 'Pectoraux, Triceps',
            description: 'Exercice de base pour le haut du corps',
            difficulty: 'beginner'
          },
          {
            _id: '2',
            name: 'Squats',
            category: 'Force',
            muscleGroup: 'Quadriceps, Fessiers',
            description: 'Exercice fondamental pour les jambes',
            difficulty: 'beginner'
          },
          {
            _id: '3',
            name: 'Burpees',
            category: 'Cardio',
            muscleGroup: 'Corps entier',
            description: 'Exercice intense pour tout le corps',
            difficulty: 'advanced'
          },
          {
            _id: '4',
            name: 'Planche',
            category: 'Core',
            muscleGroup: 'Abdominaux, Core',
            description: 'Renforcement du centre du corps',
            difficulty: 'intermediate'
          }
        ];
        setExercises(demoExercises);
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
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

  const handleAddOrUpdateExercise = async () => {
    if (!newExercise.name || !newExercise.category || !newExercise.muscleGroup) {
      setSnackbar({ 
        open: true, 
        message: 'Veuillez remplir tous les champs obligatoires', 
        severity: 'error' 
      });
      return;
    }

    try {
      if (editingExercise) {
        // Mise à jour d'un exercice existant
        const response = await exercisesAPI.update(editingExercise._id, newExercise);
        setExercises(exercises.map(ex => 
          ex._id === editingExercise._id ? response.exercise || response : ex
        ));
        setSnackbar({ 
          open: true, 
          message: 'Exercice mis à jour avec succès', 
          severity: 'success' 
        });
      } else {
        // Création d'un nouvel exercice
        const response = await exercisesAPI.create(newExercise);
        setExercises([...exercises, response.exercise || response]);
        setSnackbar({ 
          open: true, 
          message: 'Exercice créé avec succès', 
          severity: 'success' 
        });
      }
      
      // Réinitialiser le formulaire
      setNewExercise({
        name: '',
        category: '',
        muscleGroup: '',
        description: '',
        difficulty: 'beginner'
      });
      setEditingExercise(null);
      setOpenDialog(false);
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSnackbar({ 
        open: true, 
        message: error.message || 'Erreur lors de la sauvegarde de l\'exercice', 
        severity: 'error' 
      });
    }
  };

  const handleEditExercise = (exercise) => {
    setEditingExercise(exercise);
    setNewExercise({
      name: exercise.name,
      category: exercise.category,
      muscleGroup: exercise.muscleGroup,
      description: exercise.description,
      difficulty: exercise.difficulty
    });
    setOpenDialog(true);
  };

  const handleDeleteExercise = async (exerciseId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet exercice ?')) {
      try {
        await exercisesAPI.delete(exerciseId);
        setExercises(exercises.filter(ex => ex._id !== exerciseId));
        setSnackbar({ 
          open: true, 
          message: 'Exercice supprimé avec succès', 
          severity: 'success' 
        });
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setSnackbar({ 
          open: true, 
          message: 'Erreur lors de la suppression de l\'exercice', 
          severity: 'error' 
        });
      }
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
        </CardContent>
        
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Button 
            size="small" 
            startIcon={<FitnessCenter />}
            variant="outlined"
          >
            Utiliser
          </Button>
          <Box>
            <Button 
              size="small" 
              startIcon={<Edit />}
              onClick={() => handleEditExercise(exercise)}
            >
              Modifier
            </Button>
            <Button 
              size="small" 
              startIcon={<Delete />}
              color="error"
              onClick={() => handleDeleteExercise(exercise._id)}
            >
              Supprimer
            </Button>
          </Box>
        </CardActions>
      </Card>
    </Grid>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement des exercices...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
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
          <ExerciseCard key={exercise._id} exercise={exercise} />
        ))}
      </Grid>

      {filteredExercises.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Aucun exercice trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {exercises.length === 0 ? 'Ajoutez votre premier exercice !' : 'Essayez de modifier vos critères de recherche'}
          </Typography>
        </Box>
      )}

      {/* Bouton d'ajout */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => {
          setEditingExercise(null);
          setNewExercise({
            name: '',
            category: '',
            muscleGroup: '',
            description: '',
            difficulty: 'beginner'
          });
          setOpenDialog(true);
        }}
      >
        <Add />
      </Fab>

      {/* Dialog d'ajout/modification d'exercice */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingExercise ? 'Modifier l\'exercice' : 'Ajouter un nouvel exercice'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom de l'exercice"
            fullWidth
            variant="outlined"
            value={newExercise.name}
            onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Catégorie</InputLabel>
            <Select
              value={newExercise.category}
              label="Catégorie"
              onChange={(e) => setNewExercise({...newExercise, category: e.target.value})}
            >
              <MenuItem value="Force">Force</MenuItem>
              <MenuItem value="Cardio">Cardio</MenuItem>
              <MenuItem value="Core">Core</MenuItem>
              <MenuItem value="Flexibility">Flexibilité</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="dense"
            label="Groupe musculaire"
            fullWidth
            variant="outlined"
            value={newExercise.muscleGroup}
            onChange={(e) => setNewExercise({...newExercise, muscleGroup: e.target.value})}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newExercise.description}
            onChange={(e) => setNewExercise({...newExercise, description: e.target.value})}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth>
            <InputLabel>Difficulté</InputLabel>
            <Select
              value={newExercise.difficulty}
              label="Difficulté"
              onChange={(e) => setNewExercise({...newExercise, difficulty: e.target.value})}
            >
              <MenuItem value="beginner">Débutant</MenuItem>
              <MenuItem value="intermediate">Intermédiaire</MenuItem>
              <MenuItem value="advanced">Avancé</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button onClick={handleAddOrUpdateExercise} variant="contained">
            {editingExercise ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
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

export default ExercisesConnected;