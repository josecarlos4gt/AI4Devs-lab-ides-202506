import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const crearCandidato = async (req: Request, res: Response) => {
  try {
    const {
      nombre,
      apellido,
      correoElectronico,
      telefono,
      direccion,
      educacion,
      experienciaLaboral
    } = req.body;

    // El archivo CV es procesado por multer y la URL se adjunta aquí
    const cvUrl = req.file ? `/uploads/cv/${req.file.filename}` : undefined;

    // prisma.candidato puede no estar disponible si no has generado el cliente
    // Asegúrate de ejecutar: npx prisma generate
    // Si sigue sin funcionar, prueba con prisma['candidato']
    const nuevoCandidato = await (prisma as any).candidato.create({
      data: {
        nombre,
        apellido,
        correoElectronico,
        telefono,
        direccion,
        educacion: JSON.parse(educacion),
        experienciaLaboral: JSON.parse(experienciaLaboral),
        cvUrl
      }
    });

    return res.status(201).json(nuevoCandidato);
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
    }
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

export const obtenerCandidatos = async (req: Request, res: Response) => {
  try {
    const candidatos = await (prisma as any).candidato.findMany({
      orderBy: { fechaCreacion: 'desc' }
    });
    res.json(candidatos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener candidatos.' });
  }
};
