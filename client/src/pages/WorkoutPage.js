import React from 'react';
import { Container, Tabs, Tab, Box } from '@mui/material';
import { useState } from 'react';
import WorkoutDisplay from '../components/workout/WorkoutDisplay';
import WorkoutUpdateDemo from '../components/workout/WorkoutUpdateDemo';
import Layout from '../layout/Layout';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`workout-tabpanel-${index}`}
      aria-labelledby={`workout-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const WorkoutPage = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="workout tabs">
            <Tab label="Mes Workouts" />
            <Tab label="Démo Update" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <WorkoutDisplay />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <WorkoutUpdateDemo />
        </TabPanel>
      </Container>
    </Layout>
  );
};

export default WorkoutPage;