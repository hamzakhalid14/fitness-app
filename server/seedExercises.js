const mongoose = require('mongoose');
const Exercise = require('./models/Exercise');

// Connexion à la base de données
mongoose.connect('mongodb://localhost:27017/fitness-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const exercises = [
  // Exercices de Force - Haut du corps
  {
    name: "Pompes classiques",
    category: "force",
    muscleGroup: "pectoraux",
    difficulty: "beginner",
    description: "Exercice de base pour développer les pectoraux, triceps et épaules",
    equipment: "aucun"
  },
  {
    name: "Tractions",
    category: "force",
    muscleGroup: "dorsaux",
    difficulty: "intermediate",
    description: "Exercice excellent pour le développement du dos et des biceps",
    equipment: "barre de traction"
  },
  {
    name: "Développé couché",
    category: "force",
    muscleGroup: "pectoraux",
    difficulty: "intermediate",
    description: "Exercice roi pour les pectoraux avec barre ou haltères",
    equipment: "barre et banc"
  },
  {
    name: "Curl biceps",
    category: "force",
    muscleGroup: "biceps",
    difficulty: "beginner",
    description: "Exercice d'isolation pour les biceps avec haltères",
    equipment: "haltères"
  },
  {
    name: "Dips",
    category: "force",
    muscleGroup: "triceps",
    difficulty: "intermediate",
    description: "Exercice au poids du corps pour les triceps et pectoraux",
    equipment: "barres parallèles"
  },

  // Exercices de Force - Bas du corps
  {
    name: "Squats",
    category: "force",
    muscleGroup: "quadriceps",
    difficulty: "beginner",
    description: "Exercice fondamental pour les jambes et les fessiers",
    equipment: "aucun"
  },
  {
    name: "Fentes",
    category: "force",
    muscleGroup: "quadriceps",
    difficulty: "beginner",
    description: "Exercice unilatéral pour les jambes et l'équilibre",
    equipment: "aucun"
  },
  {
    name: "Soulevé de terre",
    category: "force",
    muscleGroup: "ischio-jambiers",
    difficulty: "advanced",
    description: "Exercice complet pour la chaîne postérieure",
    equipment: "barre"
  },
  {
    name: "Hip thrust",
    category: "force",
    muscleGroup: "fessiers",
    difficulty: "intermediate",
    description: "Exercice ciblé pour le développement des fessiers",
    equipment: "banc"
  },
  {
    name: "Mollets debout",
    category: "force",
    muscleGroup: "mollets",
    difficulty: "beginner",
    description: "Exercice d'isolation pour les mollets",
    equipment: "haltères"
  },

  // Exercices Cardio
  {
    name: "Course à pied",
    category: "cardio",
    muscleGroup: "jambes",
    difficulty: "beginner",
    description: "Exercice cardiovasculaire complet en extérieur ou sur tapis",
    equipment: "chaussures de course"
  },
  {
    name: "Burpees",
    category: "cardio",
    muscleGroup: "corps entier",
    difficulty: "advanced",
    description: "Exercice explosif combinant squat, planche et saut",
    equipment: "aucun"
  },
  {
    name: "Jumping jacks",
    category: "cardio",
    muscleGroup: "corps entier",
    difficulty: "beginner",
    description: "Exercice cardio simple et efficace",
    equipment: "aucun"
  },
  {
    name: "Vélo elliptique",
    category: "cardio",
    muscleGroup: "corps entier",
    difficulty: "beginner",
    description: "Exercice cardio à faible impact",
    equipment: "vélo elliptique"
  },
  {
    name: "Montées de genoux",
    category: "cardio",
    muscleGroup: "jambes",
    difficulty: "beginner",
    description: "Exercice cardio rapide pour échauffement",
    equipment: "aucun"
  },

  // Exercices Core/Abdominaux
  {
    name: "Planche",
    category: "core",
    muscleGroup: "abdominaux",
    difficulty: "beginner",
    description: "Exercice isométrique pour renforcer le tronc",
    equipment: "aucun"
  },
  {
    name: "Crunchs",
    category: "core",
    muscleGroup: "abdominaux",
    difficulty: "beginner",
    description: "Exercice classique pour les abdominaux",
    equipment: "aucun"
  },
  {
    name: "Russian twists",
    category: "core",
    muscleGroup: "obliques",
    difficulty: "intermediate",
    description: "Exercice de rotation pour les obliques",
    equipment: "aucun"
  },
  {
    name: "Mountain climbers",
    category: "core",
    muscleGroup: "abdominaux",
    difficulty: "intermediate",
    description: "Exercice dynamique combinant cardio et renforcement",
    equipment: "aucun"
  },
  {
    name: "Dead bug",
    category: "core",
    muscleGroup: "abdominaux",
    difficulty: "beginner",
    description: "Exercice de stabilisation du tronc",
    equipment: "aucun"
  },

  // Exercices Flexibilité
  {
    name: "Étirement des ischio-jambiers",
    category: "flexibility",
    muscleGroup: "ischio-jambiers",
    difficulty: "beginner",
    description: "Étirement assis ou debout pour l'arrière des cuisses",
    equipment: "aucun"
  },
  {
    name: "Étirement des quadriceps",
    category: "flexibility",
    muscleGroup: "quadriceps",
    difficulty: "beginner",
    description: "Étirement debout ou couché pour l'avant des cuisses",
    equipment: "aucun"
  },
  {
    name: "Étirement des épaules",
    category: "flexibility",
    muscleGroup: "épaules",
    difficulty: "beginner",
    description: "Étirement croisé pour les épaules et deltoides",
    equipment: "aucun"
  },
  {
    name: "Cat-cow stretch",
    category: "flexibility",
    muscleGroup: "dos",
    difficulty: "beginner",
    description: "Étirement dynamique pour la colonne vertébrale",
    equipment: "aucun"
  },
  {
    name: "Pigeon pose",
    category: "flexibility",
    muscleGroup: "hanches",
    difficulty: "intermediate",
    description: "Étirement profond des hanches et fessiers",
    equipment: "aucun"
  }
];

async function seedExercises() {
  try {
    console.log('Connexion à la base de données...');
    
    // Supprimer tous les exercices existants (optionnel)
    console.log('Suppression des exercices existants...');
    await Exercise.deleteMany({});
    
    // Insérer les nouveaux exercices
    console.log('Insertion des 25 exercices...');
    const result = await Exercise.insertMany(exercises);
    
    console.log(`✅ ${result.length} exercices insérés avec succès !`);
    console.log('Exercices ajoutés :');
    result.forEach((exercise, index) => {
      console.log(`${index + 1}. ${exercise.name} (${exercise.category})`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion :', error);
  } finally {
    // Fermer la connexion
    mongoose.connection.close();
    console.log('Connexion fermée.');
  }
}

// Exécuter le script
seedExercises();