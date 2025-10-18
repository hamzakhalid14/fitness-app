import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';

import {import {

  Container,  Container,

  Grid,  Grid,

  Card,  Card,

  CardContent,  CardContent,

  CardActions,  CardActions,

  Typography,  Typography,

  Button,  Button,

  Box,  Box,

  Chip,  Chip,

  TextField,  TextField,

  InputAdornment,  InputAdornment,

  Fab,  Fab,

  Dialog,  Dialog,

  DialogTitle,  DialogTitle,

  DialogContent,  DialogContent,

  DialogActions,  DialogActions,

  MenuItem,  MenuItem,

  Select,  Select,

  FormControl,  FormControl,

  InputLabel,  InputLabel,

  CircularProgress,  CircularProgress,

  Alert,  Alert,

  Snackbar  Snackbar

} from '@mui/material';} from '@mui/material';

import {import {

  Search,  Search,

  Add,  Add,

  FitnessCenter,  FitnessCenter,

  Edit,  Edit,

  Delete  Delete

} from '@mui/icons-material';} from '@mui/icons-material';

import { exercisesAPI } from '../services/api';import { exercisesAPI } from '../services/api';



const ExercisesConnected = () => {const ExercisesConnected = () => {

  const [exercises, setExercises] = useState([]);  const [exercises, setExercises] = useState([]);

  const [filteredExercises, setFilteredExercises] = useState([]);  const [filteredExercises, setFilteredExercises] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');  const [searchTerm, setSearchTerm] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('all');  const [selectedCategory, setSelectedCategory] = useState('all');

  const [loading, setLoading] = useState(true);  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);  const [error, setError] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);  const [openDialog, setOpenDialog] = useState(false);

  const [editingExercise, setEditingExercise] = useState(null);  const [editingExercise, setEditingExercise] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [deletingId, setDeletingId] = useState(null);  const [newExercise, setNewExercise] = useState({

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });    name: '',

  const [newExercise, setNewExercise] = useState({    category: '',

    name: '',    muscleGroup: '',

    category: '',    description: '',

    muscleGroup: '',    difficulty: 'beginner'

    description: '',  });

    difficulty: 'beginner'

  });  // Charger les exercices depuis le backend

  useEffect(() => {

  // Charger les exercices depuis le backend    const loadExercises = async () => {

  useEffect(() => {      try {

    const loadExercises = async () => {        setLoading(true);

      try {        setError(null);

        setLoading(true);        const response = await exercisesAPI.getAll();

        setError(null);        setExercises(response.exercises || response || []);

        const response = await exercisesAPI.getAll();      } catch (error) {

        // Normaliser la réponse : l'API peut renvoyer un tableau ou { exercises: [...] }        console.error('Erreur lors du chargement des exercices:', error);

        const data = Array.isArray(response) ? response : (response.exercises || response);        setError('Impossible de charger les exercices depuis le serveur. Affichage des exercices de démonstration.');

        setExercises(data || []);        

      } catch (error) {        // Exercices de démonstration en cas d'erreur

        console.error('Erreur lors du chargement des exercices:', error);        const demoExercises = [

        setError('Impossible de charger les exercices depuis le serveur. Affichage des exercices de démonstration.');          {

            _id: '1',

        // Exercices de démonstration en cas d'erreur            name: 'Push-ups',

        const demoExercises = [            category: 'Force',

          {            muscleGroup: 'Pectoraux, Triceps',

            _id: '1',            description: 'Exercice de base pour le haut du corps',

            name: 'Push-ups',            difficulty: 'beginner'

            category: 'Force',          },

            muscleGroup: 'Pectoraux, Triceps',          {

            description: 'Exercice de base pour le haut du corps',            _id: '2',

            difficulty: 'beginner'            name: 'Squats',

          },            category: 'Force',

          {            muscleGroup: 'Quadriceps, Fessiers',

            _id: '2',            description: 'Exercice fondamental pour les jambes',

            name: 'Squats',            difficulty: 'beginner'

            category: 'Force',          },

            muscleGroup: 'Quadriceps, Fessiers',          {

            description: 'Exercice fondamental pour les jambes',            _id: '3',

            difficulty: 'beginner'            name: 'Burpees',

          },            category: 'Cardio',

          {            muscleGroup: 'Corps entier',

            _id: '3',            description: 'Exercice intense pour tout le corps',

            name: 'Burpees',            difficulty: 'advanced'

            category: 'Cardio',          },

            muscleGroup: 'Corps entier',          {

            description: 'Exercice intense pour tout le corps',            _id: '4',

            difficulty: 'advanced'            name: 'Planche',

          },            category: 'Core',

          {            muscleGroup: 'Abdominaux, Core',

            _id: '4',            description: 'Renforcement du centre du corps',

            name: 'Planche',            difficulty: 'intermediate'

            category: 'Core',          }

            muscleGroup: 'Abdominaux, Core',        ];

            description: 'Renforcement du centre du corps',        setExercises(demoExercises);

            difficulty: 'intermediate'      } finally {

          }        setLoading(false);

        ];      }

        setExercises(demoExercises);    };

      } finally {

        setLoading(false);    loadExercises();

      }  }, []);

    };

  // Filtrage des exercices

    loadExercises();  useEffect(() => {

  }, []);    let filtered = exercises;



  // Filtrage des exercices    if (searchTerm) {

  useEffect(() => {      filtered = filtered.filter(exercise =>

    let filtered = exercises;        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||

        exercise.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase())

    if (searchTerm) {      );

      filtered = filtered.filter(exercise =>    }

        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||

        exercise.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase())    if (selectedCategory !== 'all') {

      );      filtered = filtered.filter(exercise =>

    }        exercise.category.toLowerCase() === selectedCategory.toLowerCase()

      );

    if (selectedCategory !== 'all') {    }

      filtered = filtered.filter(exercise =>

        exercise.category.toLowerCase() === selectedCategory.toLowerCase()    setFilteredExercises(filtered);

      );  }, [exercises, searchTerm, selectedCategory]);

    }

  const getDifficultyColor = (difficulty) => {

    setFilteredExercises(filtered);    switch (difficulty) {

  }, [exercises, searchTerm, selectedCategory]);      case 'beginner': return 'success';

      case 'intermediate': return 'warning';

  const getDifficultyColor = (difficulty) => {      case 'advanced': return 'error';

    switch (difficulty) {      default: return 'primary';

      case 'beginner': return 'success';    }

      case 'intermediate': return 'warning';  };

      case 'advanced': return 'error';

      default: return 'primary';  const getDifficultyLabel = (difficulty) => {

    }    switch (difficulty) {

  };      case 'beginner': return 'Débutant';

      case 'intermediate': return 'Intermédiaire';

  const getDifficultyLabel = (difficulty) => {      case 'advanced': return 'Avancé';

    switch (difficulty) {      default: return 'Non défini';

      case 'beginner': return 'Débutant';    }

      case 'intermediate': return 'Intermédiaire';  };

      case 'advanced': return 'Avancé';

      default: return 'Non défini';  const handleAddOrUpdateExercise = async () => {

    }    if (!newExercise.name || !newExercise.category || !newExercise.muscleGroup) {

  };      setSnackbar({ 

        open: true, 

  const handleAddOrUpdateExercise = async () => {        message: 'Veuillez remplir tous les champs obligatoires', 

    if (!newExercise.name || !newExercise.category || !newExercise.muscleGroup) {        severity: 'error' 

      setSnackbar({       });

        open: true,       return;

        message: 'Veuillez remplir tous les champs obligatoires',     }

        severity: 'error' 

      });    try {

      return;      if (editingExercise) {

    }        // Mise à jour d'un exercice existant

        const response = await exercisesAPI.update(editingExercise._id, newExercise);

    setIsSubmitting(true);        setExercises(exercises.map(ex => 

    try {          ex._id === editingExercise._id ? response.exercise || response : ex

      if (editingExercise) {        ));

        // Mise à jour d'un exercice existant        setSnackbar({ 

        const id = editingExercise._id || editingExercise.id;          open: true, 

        const response = await exercisesAPI.update(id, newExercise);          message: 'Exercice mis à jour avec succès', 

        const updated = response.exercise || response || {};          severity: 'success' 

        setExercises(prev => prev.map(ex => {        });

          const exId = ex._id || ex.id;      } else {

          const updatedId = updated._id || updated.id;        // Création d'un nouvel exercice

          return exId === updatedId ? updated : ex;        const response = await exercisesAPI.create(newExercise);

        }));        setExercises([...exercises, response.exercise || response]);

        setSnackbar({ open: true, message: 'Exercice mis à jour avec succès', severity: 'success' });        setSnackbar({ 

      } else {          open: true, 

        // Création d'un nouvel exercice          message: 'Exercice créé avec succès', 

        const response = await exercisesAPI.create(newExercise);          severity: 'success' 

        const created = response.exercise || response || {};        });

        setExercises(prev => [...prev, created]);      }

        setSnackbar({ open: true, message: 'Exercice créé avec succès', severity: 'success' });      

      }      // Réinitialiser le formulaire

      setNewExercise({

      // Réinitialiser le formulaire        name: '',

      setNewExercise({ name: '', category: '', muscleGroup: '', description: '', difficulty: 'beginner' });        category: '',

      setEditingExercise(null);        muscleGroup: '',

      setOpenDialog(false);        description: '',

    } catch (error) {        difficulty: 'beginner'

      console.error('Erreur lors de la sauvegarde:', error);      });

      setSnackbar({ open: true, message: error?.message || error?.data?.message || 'Erreur lors de la sauvegarde de l\'exercice', severity: 'error' });      setEditingExercise(null);

    } finally {      setOpenDialog(false);

      setIsSubmitting(false);      

    }    } catch (error) {

  };      console.error('Erreur lors de la sauvegarde:', error);

      setSnackbar({ 

  const handleEditExercise = (exercise) => {        open: true, 

    setEditingExercise(exercise);        message: error.message || 'Erreur lors de la sauvegarde de l\'exercice', 

    setNewExercise({        severity: 'error' 

      name: exercise.name,      });

      category: exercise.category,    }

      muscleGroup: exercise.muscleGroup,  };

      description: exercise.description,

      difficulty: exercise.difficulty  const handleEditExercise = (exercise) => {

    });    setEditingExercise(exercise);

    setOpenDialog(true);    setNewExercise({

  };      name: exercise.name,

      category: exercise.category,

  const handleDeleteExercise = async (exerciseId) => {      muscleGroup: exercise.muscleGroup,

    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet exercice ?')) {      description: exercise.description,

      setDeletingId(exerciseId);      difficulty: exercise.difficulty

      try {    });

        await exercisesAPI.delete(exerciseId);    setOpenDialog(true);

        setExercises(prev => prev.filter(ex => (ex._id || ex.id) !== exerciseId));  };

        setSnackbar({ open: true, message: 'Exercice supprimé avec succès', severity: 'success' });

      } catch (error) {  const handleDeleteExercise = async (exerciseId) => {

        console.error('Erreur lors de la suppression:', error);    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet exercice ?')) {

        setSnackbar({ open: true, message: error?.message || 'Erreur lors de la suppression de l\'exercice', severity: 'error' });      try {

      } finally {        await exercisesAPI.delete(exerciseId);

        setDeletingId(null);        setExercises(exercises.filter(ex => ex._id !== exerciseId));

      }        setSnackbar({ 

    }          open: true, 

  };          message: 'Exercice supprimé avec succès', 

          severity: 'success' 

  const ExerciseCard = ({ exercise }) => (        });

    <Grid item xs={12} sm={6} md={4}>      } catch (error) {

      <Card         console.error('Erreur lors de la suppression:', error);

        elevation={3}        setSnackbar({ 

        sx={{           open: true, 

          height: '100%',          message: 'Erreur lors de la suppression de l\'exercice', 

          display: 'flex',          severity: 'error' 

          flexDirection: 'column',        });

          transition: 'transform 0.2s',      }

          '&:hover': {    }

            transform: 'translateY(-4px)'  };

          }

        }}  const ExerciseCard = ({ exercise }) => (

      >    <Grid item xs={12} sm={6} md={4}>

        <CardContent sx={{ flexGrow: 1 }}>      <Card 

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>        elevation={3}

            <Typography variant="h6" component="div">        sx={{ 

              {exercise.name}          height: '100%',

            </Typography>          display: 'flex',

            <Chip          flexDirection: 'column',

              label={getDifficultyLabel(exercise.difficulty)}          transition: 'transform 0.2s',

              color={getDifficultyColor(exercise.difficulty)}          '&:hover': {

              size="small"            transform: 'translateY(-4px)'

            />          }

          </Box>        }}

                >

          <Typography variant="body2" color="text.secondary" gutterBottom>        <CardContent sx={{ flexGrow: 1 }}>

            {exercise.category} • {exercise.muscleGroup}          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>

          </Typography>            <Typography variant="h6" component="div">

                        {exercise.name}

          <Typography variant="body2" sx={{ mb: 2 }}>            </Typography>

            {exercise.description}            <Chip

          </Typography>              label={getDifficultyLabel(exercise.difficulty)}

        </CardContent>              color={getDifficultyColor(exercise.difficulty)}

                      size="small"

        <CardActions sx={{ justifyContent: 'space-between' }}>            />

          <Button           </Box>

            size="small"           

            startIcon={<FitnessCenter />}          <Typography variant="body2" color="text.secondary" gutterBottom>

            variant="outlined"            {exercise.category} • {exercise.muscleGroup}

          >          </Typography>

            Utiliser          

          </Button>          <Typography variant="body2" sx={{ mb: 2 }}>

          <Box>            {exercise.description}

            <Button           </Typography>

              size="small"         </CardContent>

              startIcon={<Edit />}        

              onClick={() => handleEditExercise(exercise)}        <CardActions sx={{ justifyContent: 'space-between' }}>

            >          <Button 

              Modifier            size="small" 

            </Button>            startIcon={<FitnessCenter />}

            <Button             variant="outlined"

              size="small"           >

              startIcon={<Delete />}            Utiliser

              color="error"          </Button>

              onClick={() => handleDeleteExercise(exercise._id || exercise.id)}          <Box>

              disabled={deletingId === (exercise._id || exercise.id)}            <Button 

            >              size="small" 

              {deletingId === (exercise._id || exercise.id) ? 'Suppression...' : 'Supprimer'}              startIcon={<Edit />}

            </Button>              onClick={() => handleEditExercise(exercise)}

          </Box>            >

        </CardActions>              Modifier

      </Card>            </Button>

    </Grid>            <Button 

  );              size="small" 

              startIcon={<Delete />}

  if (loading) {              color="error"

    return (              onClick={() => handleDeleteExercise(exercise._id)}

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>            >

        <CircularProgress size={60} />              Supprimer

        <Typography variant="h6" sx={{ mt: 2 }}>            </Button>

          Chargement des exercices...          </Box>

        </Typography>        </CardActions>

      </Container>      </Card>

    );    </Grid>

  }  );



  return (  if (loading) {

    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>    return (

      {error && (      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>

        <Alert severity="warning" sx={{ mb: 3 }}>        <CircularProgress size={60} />

          {error}        <Typography variant="h6" sx={{ mt: 2 }}>

        </Alert>          Chargement des exercices...

      )}        </Typography>

            </Container>

      <Box sx={{ mb: 4 }}>    );

        <Typography variant="h4" gutterBottom>  }

          Bibliothèque d'exercices

        </Typography>  return (

        <Typography variant="subtitle1" color="text.secondary">    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

          Découvrez et gérez vos exercices      {error && (

        </Typography>        <Alert severity="warning" sx={{ mb: 3 }}>

      </Box>          {error}

        </Alert>

      {/* Filtres et recherche */}      )}

      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>      

        <TextField      <Box sx={{ mb: 4 }}>

          variant="outlined"        <Typography variant="h4" gutterBottom>

          placeholder="Rechercher un exercice..."          Bibliothèque d'exercices

          value={searchTerm}        </Typography>

          onChange={(e) => setSearchTerm(e.target.value)}        <Typography variant="subtitle1" color="text.secondary">

          InputProps={{          Découvrez et gérez vos exercices

            startAdornment: (        </Typography>

              <InputAdornment position="start">      </Box>

                <Search />

              </InputAdornment>      {/* Filtres et recherche */}

            ),      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>

          }}        <TextField

          sx={{ minWidth: 300 }}          variant="outlined"

        />          placeholder="Rechercher un exercice..."

                  value={searchTerm}

        <FormControl sx={{ minWidth: 150 }}>          onChange={(e) => setSearchTerm(e.target.value)}

          <InputLabel>Catégorie</InputLabel>          InputProps={{

          <Select            startAdornment: (

            value={selectedCategory}              <InputAdornment position="start">

            label="Catégorie"                <Search />

            onChange={(e) => setSelectedCategory(e.target.value)}              </InputAdornment>

          >            ),

            <MenuItem value="all">Toutes</MenuItem>          }}

            <MenuItem value="force">Force</MenuItem>          sx={{ minWidth: 300 }}

            <MenuItem value="cardio">Cardio</MenuItem>        />

            <MenuItem value="core">Core</MenuItem>        

            <MenuItem value="flexibility">Flexibilité</MenuItem>        <FormControl sx={{ minWidth: 150 }}>

          </Select>          <InputLabel>Catégorie</InputLabel>

        </FormControl>          <Select

      </Box>            value={selectedCategory}

            label="Catégorie"

      {/* Liste des exercices */}            onChange={(e) => setSelectedCategory(e.target.value)}

      <Grid container spacing={3}>          >

        {filteredExercises.map((exercise) => (            <MenuItem value="all">Toutes</MenuItem>

          <ExerciseCard key={exercise._id || exercise.id} exercise={exercise} />            <MenuItem value="force">Force</MenuItem>

        ))}            <MenuItem value="cardio">Cardio</MenuItem>

      </Grid>            <MenuItem value="core">Core</MenuItem>

            <MenuItem value="flexibility">Flexibilité</MenuItem>

      {filteredExercises.length === 0 && (          </Select>

        <Box sx={{ textAlign: 'center', mt: 4 }}>        </FormControl>

          <Typography variant="h6" color="text.secondary">      </Box>

            Aucun exercice trouvé

          </Typography>      {/* Liste des exercices */}

          <Typography variant="body2" color="text.secondary">      <Grid container spacing={3}>

            {exercises.length === 0 ? 'Ajoutez votre premier exercice !' : 'Essayez de modifier vos critères de recherche'}        {filteredExercises.map((exercise) => (

          </Typography>          <ExerciseCard key={exercise._id} exercise={exercise} />

        </Box>        ))}

      )}      </Grid>



      {/* Bouton d'ajout */}      {filteredExercises.length === 0 && (

      <Fab        <Box sx={{ textAlign: 'center', mt: 4 }}>

        color="primary"          <Typography variant="h6" color="text.secondary">

        aria-label="add"            Aucun exercice trouvé

        sx={{ position: 'fixed', bottom: 16, right: 16 }}          </Typography>

        onClick={() => {          <Typography variant="body2" color="text.secondary">

          setEditingExercise(null);            {exercises.length === 0 ? 'Ajoutez votre premier exercice !' : 'Essayez de modifier vos critères de recherche'}

          setNewExercise({          </Typography>

            name: '',        </Box>

            category: '',      )}

            muscleGroup: '',

            description: '',      {/* Bouton d'ajout */}

            difficulty: 'beginner'      <Fab

          });        color="primary"

          setOpenDialog(true);        aria-label="add"

        }}        sx={{ position: 'fixed', bottom: 16, right: 16 }}

      >        onClick={() => {

        <Add />          setEditingExercise(null);

      </Fab>          setNewExercise({

            name: '',

      {/* Dialog d'ajout/modification d'exercice */}            category: '',

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>            muscleGroup: '',

        <DialogTitle>            description: '',

          {editingExercise ? 'Modifier l\'exercice' : 'Ajouter un nouvel exercice'}            difficulty: 'beginner'

        </DialogTitle>          });

        <DialogContent>          setOpenDialog(true);

          <TextField        }}

            autoFocus      >

            margin="dense"        <Add />

            label="Nom de l'exercice"      </Fab>

            fullWidth

            variant="outlined"      {/* Dialog d'ajout/modification d'exercice */}

            value={newExercise.name}      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>

            onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}        <DialogTitle>

            sx={{ mb: 2 }}          {editingExercise ? 'Modifier l\'exercice' : 'Ajouter un nouvel exercice'}

          />        </DialogTitle>

                  <DialogContent>

          <FormControl fullWidth sx={{ mb: 2 }}>          <TextField

            <InputLabel>Catégorie</InputLabel>            autoFocus

            <Select            margin="dense"

              value={newExercise.category}            label="Nom de l'exercice"

              label="Catégorie"            fullWidth

              onChange={(e) => setNewExercise({...newExercise, category: e.target.value})}            variant="outlined"

            >            value={newExercise.name}

              <MenuItem value="Force">Force</MenuItem>            onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}

              <MenuItem value="Cardio">Cardio</MenuItem>            sx={{ mb: 2 }}

              <MenuItem value="Core">Core</MenuItem>          />

              <MenuItem value="Flexibility">Flexibilité</MenuItem>          

            </Select>          <FormControl fullWidth sx={{ mb: 2 }}>

          </FormControl>            <InputLabel>Catégorie</InputLabel>

                      <Select

          <TextField              value={newExercise.category}

            margin="dense"              label="Catégorie"

            label="Groupe musculaire"              onChange={(e) => setNewExercise({...newExercise, category: e.target.value})}

            fullWidth            >

            variant="outlined"              <MenuItem value="Force">Force</MenuItem>

            value={newExercise.muscleGroup}              <MenuItem value="Cardio">Cardio</MenuItem>

            onChange={(e) => setNewExercise({...newExercise, muscleGroup: e.target.value})}              <MenuItem value="Core">Core</MenuItem>

            sx={{ mb: 2 }}              <MenuItem value="Flexibility">Flexibilité</MenuItem>

          />            </Select>

                    </FormControl>

          <TextField          

            margin="dense"          <TextField

            label="Description"            margin="dense"

            fullWidth            label="Groupe musculaire"

            multiline            fullWidth

            rows={3}            variant="outlined"

            variant="outlined"            value={newExercise.muscleGroup}

            value={newExercise.description}            onChange={(e) => setNewExercise({...newExercise, muscleGroup: e.target.value})}

            onChange={(e) => setNewExercise({...newExercise, description: e.target.value})}            sx={{ mb: 2 }}

            sx={{ mb: 2 }}          />

          />          

                    <TextField

          <FormControl fullWidth>            margin="dense"

            <InputLabel>Difficulté</InputLabel>            label="Description"

            <Select            fullWidth

              value={newExercise.difficulty}            multiline

              label="Difficulté"            rows={3}

              onChange={(e) => setNewExercise({...newExercise, difficulty: e.target.value})}            variant="outlined"

            >            value={newExercise.description}

              <MenuItem value="beginner">Débutant</MenuItem>            onChange={(e) => setNewExercise({...newExercise, description: e.target.value})}

              <MenuItem value="intermediate">Intermédiaire</MenuItem>            sx={{ mb: 2 }}

              <MenuItem value="advanced">Avancé</MenuItem>          />

            </Select>          

          </FormControl>          <FormControl fullWidth>

        </DialogContent>            <InputLabel>Difficulté</InputLabel>

        <DialogActions>            <Select

          <Button onClick={() => setOpenDialog(false)} disabled={isSubmitting}>Annuler</Button>              value={newExercise.difficulty}

          <Button onClick={handleAddOrUpdateExercise} variant="contained" disabled={isSubmitting}>              label="Difficulté"

            {isSubmitting ? (editingExercise ? 'Traitement...' : 'Création...') : (editingExercise ? 'Modifier' : 'Ajouter')}              onChange={(e) => setNewExercise({...newExercise, difficulty: e.target.value})}

          </Button>            >

        </DialogActions>              <MenuItem value="beginner">Débutant</MenuItem>

      </Dialog>              <MenuItem value="intermediate">Intermédiaire</MenuItem>

              <MenuItem value="advanced">Avancé</MenuItem>

      {/* Snackbar pour les notifications */}            </Select>

      <Snackbar          </FormControl>

        open={snackbar.open}        </DialogContent>

        autoHideDuration={4000}        <DialogActions>

        onClose={() => setSnackbar({ ...snackbar, open: false })}          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>

      >          <Button onClick={handleAddOrUpdateExercise} variant="contained">

        <Alert             {editingExercise ? 'Modifier' : 'Ajouter'}

          severity={snackbar.severity}           </Button>

          onClose={() => setSnackbar({ ...snackbar, open: false })}        </DialogActions>

        >      </Dialog>

          {snackbar.message}

        </Alert>      {/* Snackbar pour les notifications */}

      </Snackbar>      <Snackbar

    </Container>        open={snackbar.open}

  );        autoHideDuration={4000}

};        onClose={() => setSnackbar({ ...snackbar, open: false })}

      >

export default ExercisesConnected;        <Alert 

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