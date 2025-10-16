import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import { Container, Paper, Box, Tabs, Tab, Typography } from '@mui/material';
import { FitnessCenter } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Auth() {
  const [tabValue, setTabValue] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Rediriger vers le dashboard si l'utilisateur est déjà connecté
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Si l'utilisateur est connecté, ne pas afficher la page d'auth
  if (user) {
    return null;
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Header avec logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <FitnessCenter sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom>
            FitnessApp
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Votre compagnon d'entraînement personnel
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
          {/* Onglets */}
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Connexion" />
            <Tab label="Inscription" />
          </Tabs>

          {/* Contenu des onglets */}
          <TabPanel value={tabValue} index={0}>
            <Login />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Register onSuccess={() => setTabValue(0)} />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
}

export default Auth;