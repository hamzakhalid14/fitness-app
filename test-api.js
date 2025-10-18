// Test rapide de l'API exercises
// Pour tester : node test-api.js

const API_BASE = 'http://localhost:5000/api';

// Token d'exemple - remplacez par un vrai token d'authentification
const testToken = 'YOUR_JWT_TOKEN_HERE';

async function testExerciseAPI() {
  console.log('🧪 Test de l\'API exercises...\n');

  // Test 1: Récupérer tous les exercices
  try {
    const response = await fetch(`${API_BASE}/exercises`, {
      headers: {
        'Authorization': `Bearer ${testToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const exercises = await response.json();
      console.log('✅ GET /exercises - OK');
      console.log(`   Nombre d'exercices: ${exercises.length}`);
    } else {
      console.log('❌ GET /exercises - ERREUR');
      console.log('   Status:', response.status);
    }
  } catch (error) {
    console.log('❌ GET /exercises - ERREUR DE CONNEXION');
    console.log('   Assurez-vous que le serveur backend est démarré sur le port 5000');
  }

  // Test 2: Créer un nouvel exercice
  const newExercise = {
    name: 'Test Cardio',
    category: 'Cardio',
    muscleGroup: 'Corps entier',
    description: 'Exercise de test pour validation API',
    difficulty: 'beginner'
  };

  try {
    const response = await fetch(`${API_BASE}/exercises`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${testToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newExercise)
    });
    
    if (response.ok) {
      const created = await response.json();
      console.log('✅ POST /exercises - OK');
      console.log(`   Exercise créé avec ID: ${created._id}`);
    } else {
      console.log('❌ POST /exercises - ERREUR');
      console.log('   Status:', response.status);
      const error = await response.text();
      console.log('   Erreur:', error);
    }
  } catch (error) {
    console.log('❌ POST /exercises - ERREUR DE CONNEXION');
    console.log('   Erreur:', error.message);
  }

  console.log('\n📝 Instructions:');
  console.log('1. Assurez-vous que le serveur backend tourne (npm start dans /server)');
  console.log('2. Assurez-vous d\'être connecté avec un token valide');
  console.log('3. Testez l\'ajout/modification depuis l\'interface web');
}

testExerciseAPI();