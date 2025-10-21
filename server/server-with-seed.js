const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const Exercise = require('./models/Exercise');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/exercises', require('./routes/exercises'));
app.use('/api/workouts', require('./routes/workouts'));

const PORT = process.env.PORT || 5000;

// Fonction pour vérifier et insérer les exercices par défaut
async function ensureDefaultExercises() {
  try {
    const exerciseCount = await Exercise.countDocuments();
    
    if (exerciseCount === 0) {
      console.log('🔄 Aucun exercice trouvé, insertion des exercices par défaut...');
      
      const defaultExercises = [
        {
          name: "Pompes classiques",
          category: "force",
          muscleGroup: "pectoraux",
          difficulty: "beginner",
          description: "Exercice de base pour développer les pectoraux, triceps et épaules",
          equipment: "aucun"
        },
        {
          name: "Squats",
          category: "force",
          muscleGroup: "quadriceps",
          difficulty: "beginner",
          description: "Exercice fondamental pour les jambes et les fessiers",
          equipment: "aucun"
        },
        {
          name: "Planche",
          category: "core",
          muscleGroup: "abdominaux",
          difficulty: "beginner",
          description: "Exercice isométrique pour renforcer le tronc",
          equipment: "aucun"
        },
        {
          name: "Course à pied",
          category: "cardio",
          muscleGroup: "jambes",
          difficulty: "beginner",
          description: "Exercice cardiovasculaire complet",
          equipment: "chaussures de course"
        },
        {
          name: "Étirement des ischio-jambiers",
          category: "flexibility",
          muscleGroup: "ischio-jambiers",
          difficulty: "beginner",
          description: "Étirement pour l'arrière des cuisses",
          equipment: "aucun"
        }
      ];
      
      await Exercise.insertMany(defaultExercises);
      console.log('✅ 5 exercices par défaut insérés avec succès !');
    } else {
      console.log(`✅ ${exerciseCount} exercices trouvés dans la base de données`);
    }
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des exercices :', error);
  }
}

// Démarrage du serveur
async function startServer() {
  try {
    // Connexion à MongoDB
    await mongoose.connect('mongodb://localhost:27017/fitness-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connecté à MongoDB');
    
    // Vérifier et insérer les exercices par défaut si nécessaire
    await ensureDefaultExercises();
    
    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📊 API disponible sur http://localhost:${PORT}/api`);
    });
    
  } catch (error) {
    console.error('❌ Erreur de démarrage :', error);
    process.exit(1);
  }
}

startServer();