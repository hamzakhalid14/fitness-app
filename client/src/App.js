import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './layout/Layout';
import Dashboard from './pages/Dashboard';
import ExercisesConnected from './pages/ExercisesConnected';
import Workout from './pages/Workout';
import MyWorkouts from './pages/MyWorkouts';
import WorkoutPage from './pages/WorkoutPage';
import CreateWorkout from './pages/CreateWorkout';
import ViewWorkout from './pages/ViewWorkout';
import EditWorkout from './pages/EditWorkout';
import Auth from './pages/Auth';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Chargement...</div>;
  }
  
  return user ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="exercises" element={<ExercisesConnected />} />
              <Route path="workout" element={<Workout />} />
              <Route path="my-workouts" element={<MyWorkouts />} />
              <Route path="create-workout" element={<CreateWorkout />} />
              <Route path="view-workout/:id" element={<ViewWorkout />} />
              <Route path="edit-workout/:id" element={<EditWorkout />} />
              <Route path="workout-manager" element={<WorkoutPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;