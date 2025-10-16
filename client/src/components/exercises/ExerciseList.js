import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Add, FitnessCenter } from '@mui/icons-material';
import axios from 'axios';

const ExerciseList = ({ onAddExercise, onEditExercise }) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    muscleGroup: '',
    search: ''
  });

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const res = await axios.get('/api/exercises');
      setExercises(res.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter(exercise => {
    return (
      (filters.category === '' || exercise.category === filters.category) &&
      (filters.muscleGroup === '' || exercise.muscleGroup === filters.muscleGroup) &&
      (filters.search === '' || 
        exercise.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        exercise.description.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getCategoryColor = (category) => {
    const colors = {
      'cardio': 'error',
      'force': 'primary',
      'flexibilité': 'success'
    };
    return colors[category] || 'default';
  };

  if (loading) return <Typography>Chargement...</Typography>;

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Rechercher"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          sx={{ minWidth: 200 }}
        />
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Catégorie</InputLabel>
          <Select
            value={filters.category}
            label="Catégorie"
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <MenuItem value="">Toutes</MenuItem>
            <MenuItem value="cardio">Cardio</MenuItem>
            <MenuItem value="force">Force</MenuItem>
            <MenuItem value="flexibilité">Flexibilité</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Muscle</InputLabel>
          <Select
            value={filters.muscleGroup}
            label="Muscle"
            onChange={(e) => handleFilterChange('muscleGroup', e.target.value)}
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="pectoraux">Pectoraux</MenuItem>
            <MenuItem value="dos">Dos</MenuItem>
            <MenuItem value="jambes">Jambes</MenuItem>
            {/* Ajouter autres groupes musculaires */}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAddExercise}
          sx={{ ml: 'auto' }}
        >
          Nouvel Exercice
        </Button>
      </Box>

      <Grid container spacing={3}>
        {filteredExercises.map((exercise) => (
          <Grid item xs={12} sm={6} md={4} key={exercise._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FitnessCenter sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    {exercise.name}
                  </Typography>
                </Box>

                <Typography color="textSecondary" sx={{ mb: 2 }}>
                  {exercise.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={exercise.category}
                    color={getCategoryColor(exercise.category)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={exercise.muscleGroup}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="textSecondary">
                  Difficulté: {exercise.difficulty}
                </Typography>

                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    onClick={() => onEditExercise(exercise)}
                  >
                    Modifier
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {/* Ajouter à l'entraînement */}}
                  >
                    Ajouter
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ExerciseList;