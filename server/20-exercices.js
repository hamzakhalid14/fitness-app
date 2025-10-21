const exercices = [
  {
    "name": "Push-ups",
    "description": "Exercice de musculation pour les pectoraux, triceps et épaules",
    "category": "force",
    "muscleGroup": "pectoraux",
    "difficulty": "débutant",
    "equipment": "poids corps",
    "instructions": ["Placez-vous en position de planche", "Descendez en gardant le corps droit", "Remontez en poussant avec les bras"],
    "isPublic": true
  },
  {
    "name": "Squats",
    "description": "Exercice fondamental pour les jambes et les fessiers",
    "category": "force",
    "muscleGroup": "quadriceps",
    "difficulty": "débutant",
    "equipment": "poids corps",
    "instructions": ["Tenez-vous debout, pieds écartés à la largeur des épaules", "Descendez comme si vous vous asseyiez sur une chaise", "Remontez en poussant avec les talons"],
    "isPublic": true
  },
  {
    "name": "Planche",
    "description": "Exercice isométrique pour renforcer le core",
    "category": "force",
    "muscleGroup": "abdominaux",
    "difficulty": "débutant",
    "equipment": "poids corps",
    "instructions": ["Placez-vous en position de planche sur les avant-bras", "Gardez le corps droit comme une planche", "Maintenez la position en contractant les abdos"],
    "isPublic": true
  },
  {
    "name": "Burpees",
    "description": "Exercice complet combinant force et cardio",
    "category": "cardio",
    "muscleGroup": "corps entier",
    "difficulty": "intermédiaire",
    "equipment": "poids corps",
    "instructions": ["Commencez debout", "Descendez en squat et placez les mains au sol", "Sautez en arrière en position planche", "Faites un push-up", "Revenez en squat et sautez vers le haut"],
    "isPublic": true
  },
  {
    "name": "Fentes",
    "description": "Exercice unilatéral pour les jambes et l'équilibre",
    "category": "force",
    "muscleGroup": "quadriceps",
    "difficulty": "débutant",
    "equipment": "poids corps",
    "instructions": ["Tenez-vous debout", "Faites un grand pas vers l'avant", "Descendez jusqu'à ce que les deux genoux forment un angle de 90°", "Revenez à la position de départ"],
    "isPublic": true
  },
  {
    "name": "Mountain Climbers",
    "description": "Exercice cardio dynamique pour le core et les jambes",
    "category": "cardio",
    "muscleGroup": "abdominaux",
    "difficulty": "intermédiaire",
    "equipment": "poids corps",
    "instructions": ["Placez-vous en position de planche", "Amenez alternativement chaque genou vers la poitrine", "Maintenez un rythme rapide"],
    "isPublic": true
  },
  {
    "name": "Jumping Jacks",
    "description": "Exercice cardio simple et efficace",
    "category": "cardio",
    "muscleGroup": "corps entier",
    "difficulty": "débutant",
    "equipment": "poids corps",
    "instructions": ["Tenez-vous debout, pieds joints, bras le long du corps", "Sautez en écartant les pieds et en levant les bras", "Revenez à la position initiale en sautant"],
    "isPublic": true
  },
  {
    "name": "Dips sur chaise",
    "description": "Exercice pour renforcer les triceps et les épaules",
    "category": "force",
    "muscleGroup": "triceps",
    "difficulty": "intermédiaire",
    "equipment": "chaise",
    "instructions": ["Asseyez-vous au bord d'une chaise, mains agrippées au rebord", "Glissez vers l'avant et descendez en fléchissant les bras", "Remontez en poussant avec les bras"],
    "isPublic": true
  },
  {
    "name": "Wall Sit",
    "description": "Exercice isométrique pour les quadriceps",
    "category": "force",
    "muscleGroup": "quadriceps",
    "difficulty": "débutant",
    "equipment": "mur",
    "instructions": ["Placez le dos contre un mur", "Descendez jusqu'à ce que les cuisses soient parallèles au sol", "Maintenez la position"],
    "isPublic": true
  },
  {
    "name": "Crunches",
    "description": "Exercice classique pour les abdominaux",
    "category": "force",
    "muscleGroup": "abdominaux",
    "difficulty": "débutant",
    "equipment": "poids corps",
    "instructions": ["Allongez-vous sur le dos, genoux fléchis", "Placez les mains derrière la tête", "Contractez les abdos et soulevez les épaules du sol"],
    "isPublic": true
  },
  {
    "name": "Relevés de jambes",
    "description": "Exercice pour les abdominaux inférieurs",
    "category": "force",
    "muscleGroup": "abdominaux",
    "difficulty": "intermédiaire",
    "equipment": "poids corps",
    "instructions": ["Allongez-vous sur le dos, jambes tendues", "Levez les jambes jusqu'à 90°", "Redescendez lentement sans toucher le sol"],
    "isPublic": true
  },
  {
    "name": "Pike Push-ups",
    "description": "Variation des pompes ciblant les épaules",
    "category": "force",
    "muscleGroup": "épaules",
    "difficulty": "intermédiaire",
    "equipment": "poids corps",
    "instructions": ["Placez-vous en position de V inversé", "Descendez la tête vers le sol", "Remontez en poussant avec les bras"],
    "isPublic": true
  },
  {
    "name": "Glute Bridges",
    "description": "Exercice pour renforcer les fessiers",
    "category": "force",
    "muscleGroup": "fessiers",
    "difficulty": "débutant",
    "equipment": "poids corps",
    "instructions": ["Allongez-vous sur le dos, genoux fléchis", "Contractez les fessiers et soulevez le bassin", "Maintenez la position puis redescendez"],
    "isPublic": true
  },
  {
    "name": "High Knees",
    "description": "Exercice cardio pour améliorer la coordination",
    "category": "cardio",
    "muscleGroup": "jambes",
    "difficulty": "débutant",
    "equipment": "poids corps",
    "instructions": ["Courez sur place", "Levez les genoux le plus haut possible", "Maintenez un rythme rapide"],
    "isPublic": true
  },
  {
    "name": "Russian Twists",
    "description": "Exercice pour les obliques et la rotation du tronc",
    "category": "force",
    "muscleGroup": "obliques",
    "difficulty": "intermédiaire",
    "equipment": "poids corps",
    "instructions": ["Asseyez-vous, jambes légèrement fléchies", "Penchez-vous en arrière en gardant le dos droit", "Tournez le tronc de gauche à droite"],
    "isPublic": true
  },
  {
    "name": "Step-ups",
    "description": "Exercice fonctionnel pour les jambes",
    "category": "force",
    "muscleGroup": "quadriceps",
    "difficulty": "débutant",
    "equipment": "marche ou banc",
    "instructions": ["Placez un pied sur une marche ou un banc", "Montez en poussant avec la jambe sur la marche", "Redescendez de manière contrôlée"],
    "isPublic": true
  },
  {
    "name": "Bear Crawl",
    "description": "Exercice complet pour la force et la coordination",
    "category": "force",
    "muscleGroup": "corps entier",
    "difficulty": "intermédiaire",
    "equipment": "poids corps",
    "instructions": ["Placez-vous à quatre pattes", "Soulevez les genoux légèrement du sol", "Avancez en coordination opposée bras-jambe"],
    "isPublic": true
  },
  {
    "name": "Superman",
    "description": "Exercice pour renforcer le bas du dos",
    "category": "force",
    "muscleGroup": "dorsaux",
    "difficulty": "débutant",
    "equipment": "poids corps",
    "instructions": ["Allongez-vous sur le ventre", "Levez simultanément les bras et les jambes", "Maintenez la position puis redescendez"],
    "isPublic": true
  },
  {
    "name": "Lateral Lunges",
    "description": "Fentes latérales pour travailler les adducteurs",
    "category": "force",
    "muscleGroup": "adducteurs",
    "difficulty": "intermédiaire",
    "equipment": "poids corps",
    "instructions": ["Tenez-vous debout, pieds écartés", "Faites un grand pas sur le côté", "Fléchissez une jambe en gardant l'autre tendue", "Revenez au centre"],
    "isPublic": true
  },
  {
    "name": "Bicycle Crunches",
    "description": "Exercice dynamique pour les abdominaux et obliques",
    "category": "force",
    "muscleGroup": "abdominaux",
    "difficulty": "intermédiaire",
    "equipment": "poids corps",
    "instructions": ["Allongez-vous sur le dos, mains derrière la tête", "Amenez alternativement chaque coude vers le genou opposé", "Simulez un mouvement de pédalage"],
    "isPublic": true
  }
];

module.exports = exercices;