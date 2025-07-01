import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const educacionSchema = z.array(z.object({
  institucion: z.string().min(1),
  titulo: z.string().min(1),
  fechaInicio: z.string().min(1),
  fechaFin: z.string().optional()
}));

const experienciaLaboralSchema = z.array(z.object({
  empresa: z.string().min(1),
  puesto: z.string().min(1),
  fechaInicio: z.string().min(1),
  fechaFin: z.string().optional(),
  descripcion: z.string().optional()
}));

const candidatoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio.'),
  apellido: z.string().min(1, 'El apellido es obligatorio.'),
  correoElectronico: z.string().email('El correo electrónico no es válido.'),
  telefono: z.string().min(1, 'El teléfono es obligatorio.'),
  direccion: z.string().min(1, 'La dirección es obligatoria.'),
  educacion: z.preprocess((val) => typeof val === 'string' ? JSON.parse(val as string) : val, educacionSchema),
  experienciaLaboral: z.preprocess((val) => typeof val === 'string' ? JSON.parse(val as string) : val, experienciaLaboralSchema)
});

export const validateCandidato = [
  (req: Request, res: Response, next: NextFunction) => {
    const result = candidatoSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        errors: result.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }
    next();
  }
];
