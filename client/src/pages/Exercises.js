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
  InputLabel
} from '@mui/material';
import {
  Search,
  Add,
  FitnessCenter,
  AccessTime,
  LocalFireDepartment
} from '@mui/icons-material';

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    category: '',
    muscleGroup: '',
    description: '',
    difficulty: 'beginner'
  });

  // Données d'exemple
  useEffect(() => {
    const sampleExercises = [
      {
        id: 1,
        name: 'Push-ups',
        category: 'Force',
        muscleGroup: 'Pectoraux, Triceps',
        description: 'Exercice de base pour le haut du corps',
        difficulty: 'beginner',
        duration: '30 sec',
        calories: 50
      },
      {
        id: 2,
        name: 'Squats',
        category: 'Force',
        muscleGroup: 'Quadriceps, Fessiers',
        description: 'Exercice fondamental pour les jambes',
        difficulty: 'beginner',
        duration: '45 sec',
        calories: 60
      },
      {
        id: 3,
        name: 'Burpees',
        category: 'Cardio',
        muscleGroup: 'Corps entier',
        description: 'Exercice intense pour tout le corps',
        difficulty: 'advanced',
        duration: '60 sec',
        calories: 100
      },
      {
        id: 4,
        name: 'Planche',
        category: 'Core',
        muscleGroup: 'Abdominaux, Core',
        description: 'Renforcement du centre du corps',
        difficulty: 'intermediate',
        duration: '60 sec',
        calories: 40
      }
    ];
    setExercises(sampleExercises);
    setFilteredExercises(sampleExercises);
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
    if (newExercise.name && newExercise.category && newExercise.muscleGroup) {
      const exercise = {
        id: exercises.length + 1,
        ...newExercise,
        duration: '30 sec',
        calories: 50
      };
      setExercises([...exercises, exercise]);
      setNewExercise({
        name: '',
        category: '',
        muscleGroup: '',
        description: '',
        difficulty: 'beginner'
      });
      setOpenDialog(false);
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
          <Button size="small">Détails</Button>
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
          <ExerciseCard key={exercise.id} exercise={exercise} />
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
        onClick={() => setOpenDialog(true)}
      >
        <Add />
      </Fab>

      {/* Dialog d'ajout d'exercice */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter un nouvel exercice</DialogTitle>
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
          <Button onClick={handleAddExercise} variant="contained">Ajouter</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Exercises;