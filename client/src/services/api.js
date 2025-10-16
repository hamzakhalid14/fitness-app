import axios from 'axios';

// Configuration de base pour l'API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Instance Axios avec configuration de base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et les erreurs
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authAPI = {
  // Connexion
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de connexion' };
    }
  },

  // Inscription
  register: async (name, email, password) => {
    try {
      const response = await apiClient.post('/auth/register', { name, email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de l\'inscription' };
    }
  },

  // Vérification du token
  verifyToken: async () => {
    try {
      const response = await apiClient.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Token invalide' };
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Ignore les erreurs de déconnexion côté serveur
      console.warn('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer le stockage local dans tous les cas
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
};

// Services pour les exercices
export const exercisesAPI = {
  // Récupérer tous les exercices
  getAll: async () => {
    try {
      const response = await apiClient.get('/exercises');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des exercices' };
    }
  },

  // Récupérer un exercice par ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/exercises/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Exercice non trouvé' };
    }
  },

  // Créer un nouvel exercice
  create: async (exerciseData) => {
    try {
      const response = await apiClient.post('/exercises', exerciseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la création de l\'exercice' };
    }
  },

  // Mettre à jour un exercice
  update: async (id, exerciseData) => {
    try {
      const response = await apiClient.put(`/exercises/${id}`, exerciseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour de l\'exercice' };
    }
  },

  // Supprimer un exercice
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/exercises/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la suppression de l\'exercice' };
    }
  }
};

// Services pour les workouts
export const workoutsAPI = {
  // Récupérer tous les workouts de l'utilisateur
  getAll: async () => {
    try {
      const response = await apiClient.get('/workouts');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des workouts' };
    }
  },

  // Récupérer un workout par ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/workouts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Workout non trouvé' };
    }
  },

  // Créer un nouveau workout
  create: async (workoutData) => {
    try {
      const response = await apiClient.post('/workouts', workoutData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la création du workout' };
    }
  },

  // Mettre à jour un workout
  update: async (id, workoutData) => {
    try {
      const response = await apiClient.put(`/workouts/${id}`, workoutData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour du workout' };
    }
  },

  // Supprimer un workout
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/workouts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la suppression du workout' };
    }
  },

  // Récupérer les statistiques des workouts
  getStats: async () => {
    try {
      const response = await apiClient.get('/workouts/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des statistiques' };
    }
  }
};

// Services pour les utilisateurs
export const userAPI = {
  // Récupérer le profil utilisateur
  getProfile: async () => {
    try {
      const response = await apiClient.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération du profil' };
    }
  },

  // Mettre à jour le profil utilisateur
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour du profil' };
    }
  }
};

export default apiClient;