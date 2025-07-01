import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import candidatoRoutes from './routes/candidatoRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

const port = 3010;

app.use(express.json());

// Servir archivos estáticos de CV de forma segura
app.use('/uploads/cv', express.static(path.join(__dirname, '../../uploads/cv'), {
  index: false,
  setHeaders: (res) => {
    res.setHeader('Content-Disposition', 'attachment');
  }
}));

// Rutas de candidatos
app.use(candidatoRoutes);

// Rutas de autenticación
app.use(authRoutes);

app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.type('text/plain'); 
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
