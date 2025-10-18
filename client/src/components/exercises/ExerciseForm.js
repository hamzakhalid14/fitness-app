import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const ExerciseForm = ({ open, onClose, onSave, initialData = {} }) => {
  const [form, setForm] = React.useState({
    name: '',
    category: '',
    muscleGroup: '',
    description: '',
    difficulty: 'beginner'
  });

  React.useEffect(() => {
    if (initialData && Object.keys(initialData).length) {
      setForm({
        name: initialData.name || '',
        category: initialData.category || '',
        muscleGroup: initialData.muscleGroup || '',
        description: initialData.description || '',
        difficulty: initialData.difficulty || 'beginner'
      });
    } else {
      setForm({
        name: '',
        category: '',
        muscleGroup: '',
        description: '',
        difficulty: 'beginner'
      });
    }
  }, [initialData, open]);

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    // validation minimale
    if (!form.name || !form.category || !form.muscleGroup) {
      alert('Veuillez renseigner au moins le nom, la catégorie et le groupe musculaire.');
      return;
    }
    
    // Validation supplémentaire
    if (form.name.trim().length < 2) {
      alert('Le nom de l\'exercice doit contenir au moins 2 caractères.');
      return;
    }
    
    // Nettoyer les données avant envoi
    const cleanedForm = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      muscleGroup: form.muscleGroup.trim()
    };
    
    onSave(cleanedForm);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData && initialData._id ? 'Modifier l\'exercice' : 'Ajouter un exercice'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nom"
          fullWidth
          value={form.name}
          onChange={handleChange('name')}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Catégorie</InputLabel>
          <Select value={form.category} label="Catégorie" onChange={handleChange('category')}>
            <MenuItem value="force">Force</MenuItem>
            <MenuItem value="cardio">Cardio</MenuItem>
            <MenuItem value="core">Core</MenuItem>
            <MenuItem value="flexibility">Flexibilité</MenuItem>
          </Select>
        </FormControl>

        <TextField
          margin="dense"
          label="Groupe musculaire"
          fullWidth
          value={form.muscleGroup}
          onChange={handleChange('muscleGroup')}
          sx={{ mb: 2 }}
        />

        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={form.description}
          onChange={handleChange('description')}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth>
          <InputLabel>Difficulté</InputLabel>
          <Select value={form.difficulty} label="Difficulté" onChange={handleChange('difficulty')}>
            <MenuItem value="beginner">Débutant</MenuItem>
            <MenuItem value="intermediate">Intermédiaire</MenuItem>
            <MenuItem value="advanced">Avancé</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="contained" onClick={handleSubmit}>Enregistrer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExerciseForm;
