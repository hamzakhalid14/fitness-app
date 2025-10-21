// Script de test pour vérifier l'API workouts
// Exécutez ce code dans la console du navigateur

console.log('=== TEST API WORKOUTS ===');

// 1. Vérifier si le token existe
const token = localStorage.getItem('token');
console.log('Token présent:', !!token);
console.log('Token:', token ? token.substring(0, 20) + '...' : 'Aucun token');

// 2. Tester l'endpoint health
fetch('http://localhost:5000/api/health')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Health check:', data);
  })
  .catch(error => {
    console.error('❌ Health check failed:', error);
  });

// 3. Tester l'endpoint workouts avec token
if (token) {
  fetch('http://localhost:5000/api/workouts', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('Workouts response status:', response.status);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  })
  .then(data => {
    console.log('✅ Workouts data:', data);
  })
  .catch(error => {
    console.error('❌ Workouts request failed:', error);
  });
} else {
  console.log('⚠️ Pas de token - connectez-vous d\'abord');
}

// 4. Vérifier les détails utilisateur
const user = localStorage.getItem('user');
console.log('User data:', user ? JSON.parse(user) : 'Aucun utilisateur');

console.log('=== FIN TEST ===');