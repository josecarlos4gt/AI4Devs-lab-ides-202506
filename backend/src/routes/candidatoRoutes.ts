import { Router } from 'express';
import { crearCandidato, obtenerCandidatos } from '../controllers/candidatoController';
import { validateCandidato } from '../middleware/validateCandidato';
import { authenticateJWT } from '../middleware/auth';
import { uploadCV } from '../utils/upload';

const router = Router();

// Ruta protegida, con validación y subida de archivo
router.post(
  '/api/candidatos',
  authenticateJWT,
  uploadCV.single('cv'),
  validateCandidato,
  crearCandidato
);

// Ruta protegida para obtener candidatos
router.get(
  '/api/candidatos',
  authenticateJWT,
  obtenerCandidatos
);

export default router;
