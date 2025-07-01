import { Router } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Usuario demo (en producción usar base de datos y hash)
const DEMO_USER = {
  username: 'admin',
  password: 'admin123',
  id: 1,
  nombre: 'Administrador'
};

router.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    const token = jwt.sign(
      { id: DEMO_USER.id, username: DEMO_USER.username, nombre: DEMO_USER.nombre },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '2h' }
    );
    return res.json({ token, user: { id: DEMO_USER.id, nombre: DEMO_USER.nombre, username: DEMO_USER.username } });
  }
  return res.status(401).json({ error: 'Credenciales inválidas' });
});

export default router;
