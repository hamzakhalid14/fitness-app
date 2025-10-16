import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  FitnessCenter,
  Timeline,
  TrendingUp,
  Today
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { workoutsAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    thisWeek: 0,
    totalExercises: 0,
    streak: 0
  });
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données du dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Charger les statistiques et les workouts récents
        const [statsResponse, workoutsResponse] = await Promise.all([
          workoutsAPI.getStats().catch(() => ({ 
            totalWorkouts: 15, 
            thisWeek: 3, 
            totalExercises: 45, 
            streak: 7 
          })),
          workoutsAPI.getAll().catch(() => [])
        ]);
        
        setStats(statsResponse);
        setRecentWorkouts(workoutsResponse.slice(0, 3) || []);
        
      } catch (error) {
        console.error('Erreur lors du chargement du dashboard:', error);
        setError('Impossible de charger les données. Affichage des données de démonstration.');
        
        // Données de démonstration
        setStats({
          totalWorkouts: 15,
          thisWeek: 3,
          totalExercises: 45,
          streak: 7
        });
        setRecentWorkouts([
          { 
            _id: '1',
            name: 'Full Body Demo', 
            date: new Date().toISOString(),
            exercises: [{ name: 'Push-ups' }, { name: 'Squats' }]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const StatCard = ({ title, value, icon: Icon, color = "primary" }) => (
    <Grid item xs={12} sm={6} md={3}>
      <Card 
        elevation={3} 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)'
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
          <Icon 
            sx={{ 
              fontSize: 40, 
              color: `${color}.main`, 
              mb: 1 
            }} 
          />
          <Typography variant="h4" component="div" gutterBottom>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  const QuickActions = () => (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Actions rapides
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<FitnessCenter />}
          href="/workout"
          sx={{ minWidth: 150 }}
        >
          Nouveau workout
        </Button>
        <Button
          variant="outlined"
          startIcon={<Timeline />}
          href="/exercises"
          sx={{ minWidth: 150 }}
        >
          Voir exercices
        </Button>
      </Box>
    </Paper>
  );

  const RecentActivity = () => (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Activité récente
      </Typography>
      <Box sx={{ mt: 2 }}>
        {[
          { date: 'Aujourd\'hui', workout: 'Full Body', exercises: 8 },
          { date: 'Hier', workout: 'Cardio', exercises: 5 },
          { date: 'Il y a 2 jours', workout: 'Upper Body', exercises: 10 }
        ].map((activity, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 1,
              borderBottom: index < 2 ? '1px solid #eee' : 'none'
            }}
          >
            <Box>
              <Typography variant="body1">{activity.workout}</Typography>
              <Typography variant="body2" color="text.secondary">
                {activity.date}
              </Typography>
            </Box>
            <Chip
              label={`${activity.exercises} exercices`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Bonjour, {user?.name || 'Utilisateur'} ! 👋
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Voici un aperçu de vos progrès en fitness
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <StatCard
          title="Workouts totaux"
          value={stats.totalWorkouts}
          icon={FitnessCenter}
          color="primary"
        />
        <StatCard
          title="Cette semaine"
          value={stats.thisWeek}
          icon={Today}
          color="secondary"
        />
        <StatCard
          title="Exercices réalisés"
          value={stats.totalExercises}
          icon={Timeline}
          color="success"
        />
        <StatCard
          title="Série actuelle"
          value={`${stats.streak} jours`}
          icon={TrendingUp}
          color="warning"
        />
      </Grid>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <RecentActivity />
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Objectifs
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Workouts cette semaine: 3/5
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: 8,
                    backgroundColor: '#f0f0f0',
                    borderRadius: 4,
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      width: '60%',
                      height: '100%',
                      backgroundColor: 'primary.main'
                    }}
                  />
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Continuez comme ça ! 💪
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;