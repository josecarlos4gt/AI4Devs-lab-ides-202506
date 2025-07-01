import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/login', { username, password });
      sessionStorage.setItem('jwtToken', res.data.token);
      setLoading(false);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error de autenticación');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" gutterBottom>Iniciar Sesión</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            autoComplete="username"
            required
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            autoComplete="current-password"
            required
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Ingresar
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
