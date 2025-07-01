import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Candidato {
  id: number;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  telefono: string;
  direccion: string;
  educacion: any;
  experienciaLaboral: any;
  cvUrl?: string;
  fechaCreacion: string;
}

const CandidatesTablePage: React.FC = () => {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetch('/api/candidatos', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('No autorizado o error de servidor');
        return res.json();
      })
      .then(data => setCandidatos(data))
      .catch(() => setError('No se pudieron cargar los candidatos.'))
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Lista de Candidatos</Typography>
      {loading ? <CircularProgress /> : error ? <Alert severity="error">{error}</Alert> : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Apellido</TableCell>
                  <TableCell>Correo</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>CV</TableCell>
                  <TableCell>Fecha de Registro</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candidatos.map(c => (
                  <TableRow key={c.id}>
                    <TableCell>{c.nombre}</TableCell>
                    <TableCell>{c.apellido}</TableCell>
                    <TableCell>{c.correoElectronico}</TableCell>
                    <TableCell>{c.telefono}</TableCell>
                    <TableCell>{c.cvUrl ? <a href={c.cvUrl} target="_blank" rel="noopener noreferrer">Ver CV</a> : 'No adjunto'}</TableCell>
                    <TableCell>{new Date(c.fechaCreacion).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="outlined" color="secondary" size="large" sx={{ mt: 3 }} onClick={() => navigate('/')}>Regresar</Button>
        </>
      )}
    </Container>
  );
};

export default CandidatesTablePage;
