import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard del Reclutador
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/nuevo-candidato')}
        >
          Añadir Nuevo Candidato
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => navigate('/candidatos')}
        >
          Ver Candidatos
        </Button>
      </Box>
    </Container>
  );
};

export default DashboardPage;
