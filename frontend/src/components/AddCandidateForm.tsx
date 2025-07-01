import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Educacion {
  institucion: string;
  titulo: string;
  fechaInicio: string;
  fechaFin?: string;
}

interface ExperienciaLaboral {
  empresa: string;
  puesto: string;
  fechaInicio: string;
  fechaFin?: string;
  descripcion?: string;
}

const initialEducacion: Educacion = { institucion: '', titulo: '', fechaInicio: '', fechaFin: '' };
const initialExperiencia: ExperienciaLaboral = { empresa: '', puesto: '', fechaInicio: '', fechaFin: '', descripcion: '' };

const AddCandidateForm: React.FC = () => {
  const [form, setForm] = useState({
    nombre: '', apellido: '', correoElectronico: '', telefono: '', direccion: '',
    educacion: [ { ...initialEducacion } ],
    experienciaLaboral: [ { ...initialExperiencia } ],
    cv: null as File | null
  });
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Validaciones
  const validate = (field?: string) => {
    let newErrors: any = { ...errors };
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!field || field === 'nombre') newErrors.nombre = form.nombre.trim() ? '' : 'El nombre es obligatorio.';
    if (!field || field === 'apellido') newErrors.apellido = form.apellido.trim() ? '' : 'El apellido es obligatorio.';
    if (!field || field === 'correoElectronico') newErrors.correoElectronico = emailRegex.test(form.correoElectronico) ? '' : 'Por favor, introduce un correo electrónico válido.';
    if (!field || field === 'telefono') newErrors.telefono = form.telefono.trim() ? '' : 'El teléfono es obligatorio.';
    if (!field || field === 'direccion') newErrors.direccion = form.direccion.trim() ? '' : 'La dirección es obligatoria.';
    // Educación
    newErrors.educacion = form.educacion.map((e, i) => {
      if (!e.institucion || !e.titulo || !e.fechaInicio) return 'Todos los campos son obligatorios excepto Fecha Fin.';
      return '';
    });
    // Experiencia
    newErrors.experienciaLaboral = form.experienciaLaboral.map((e, i) => {
      if (!e.empresa || !e.puesto || !e.fechaInicio) return 'Todos los campos son obligatorios excepto Fecha Fin y Descripción.';
      return '';
    });
    // CV
    newErrors.cv = form.cv ? (['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(form.cv.type) ? '' : 'Solo se permiten archivos PDF o DOCX.') : '';
    setErrors(newErrors);
    return newErrors;
  };

  const isFormValid = () => {
    return !Object.values(errors).some((err: any) => {
      if (Array.isArray(err)) return err.some((e) => e);
      return !!err;
    });
  };

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    const updatedForm = { ...form, [e.target.name]: e.target.value };
    setErrors(validate(undefined));
  };
  const handleEducacionChange = (idx: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newArr = [...form.educacion];
    newArr[idx][e.target.name as keyof Educacion] = e.target.value;
    setForm({ ...form, educacion: newArr });
    setErrors(validate(undefined));
  };
  const handleExperienciaChange = (idx: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newArr = [...form.experienciaLaboral];
    newArr[idx][e.target.name as keyof ExperienciaLaboral] = e.target.value;
    setForm({ ...form, experienciaLaboral: newArr });
    setErrors(validate(undefined));
  };
  const handleAddEducacion = () => {
    setForm({ ...form, educacion: [...form.educacion, { ...initialEducacion }] });
  };
  const handleRemoveEducacion = (idx: number) => {
    const newArr = form.educacion.filter((_, i) => i !== idx);
    setForm({ ...form, educacion: newArr });
    validate('educacion');
  };
  const handleAddExperiencia = () => {
    setForm({ ...form, experienciaLaboral: [...form.experienciaLaboral, { ...initialExperiencia }] });
  };
  const handleRemoveExperiencia = (idx: number) => {
    const newArr = form.experienciaLaboral.filter((_, i) => i !== idx);
    setForm({ ...form, experienciaLaboral: newArr });
    validate('experienciaLaboral');
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, cv: e.target.files[0] });
      validate('cv');
    }
  };
  const handleRemoveFile = () => {
    setForm({ ...form, cv: null });
    validate('cv');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validar todos los campos antes de enviar
    const newErrors = validate();
    setErrors(newErrors);
    if (!isFormValid()) {
      setErrorMsg('Por favor, corrige los errores del formulario antes de enviar.');
      return;
    }
    // Verificar JWT antes de enviar
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
      setErrorMsg('No tienes sesión activa. Por favor, inicia sesión para continuar.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      const data = new FormData();
      data.append('nombre', form.nombre);
      data.append('apellido', form.apellido);
      data.append('correoElectronico', form.correoElectronico);
      data.append('telefono', form.telefono);
      data.append('direccion', form.direccion);
      data.append('educacion', JSON.stringify(form.educacion));
      data.append('experienciaLaboral', JSON.stringify(form.experienciaLaboral));
      if (form.cv) data.append('cv', form.cv);
      await axios.post('/api/candidatos', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setSuccess('¡Candidato añadido exitosamente!');
      setForm({
        nombre: '', apellido: '', correoElectronico: '', telefono: '', direccion: '',
        educacion: [ { ...initialEducacion } ],
        experienciaLaboral: [ { ...initialExperiencia } ],
        cv: null
      });
      setErrors({});
      setTimeout(() => navigate('/'), 2000);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrorMsg(err.response.data.errors.map((e: any) => e.message).join(' '));
      } else if (err.response && err.response.data && err.response.data.error) {
        setErrorMsg(err.response.data.error);
      } else {
        setErrorMsg('Error al añadir candidato. Por favor, intente de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Añadir Nuevo Candidato</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} onBlur={() => validate('nombre')} error={!!errors.nombre} helperText={errors.nombre} fullWidth required autoComplete="off" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Apellido" name="apellido" value={form.apellido} onChange={handleChange} onBlur={() => validate('apellido')} error={!!errors.apellido} helperText={errors.apellido} fullWidth required autoComplete="off" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Correo Electrónico" name="correoElectronico" value={form.correoElectronico} onChange={handleChange} onBlur={() => validate('correoElectronico')} error={!!errors.correoElectronico} helperText={errors.correoElectronico} fullWidth required autoComplete="off" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} onBlur={() => validate('telefono')} error={!!errors.telefono} helperText={errors.telefono} fullWidth required autoComplete="off" />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} onBlur={() => validate('direccion')} error={!!errors.direccion} helperText={errors.direccion} fullWidth required autoComplete="off" />
            </Grid>
            {/* Educación */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2 }}>Educación</Typography>
              {form.educacion.map((edu, idx) => (
                <Paper key={idx} sx={{ p: 2, mb: 2, position: 'relative' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField label="Institución" name="institucion" value={edu.institucion} onChange={e => handleEducacionChange(idx, e)} fullWidth required autoComplete="off" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField label="Título" name="titulo" value={edu.titulo} onChange={e => handleEducacionChange(idx, e)} fullWidth required autoComplete="off" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <TextField label="Fecha de Inicio" name="fechaInicio" type="date" value={edu.fechaInicio} onChange={e => handleEducacionChange(idx, e)} fullWidth required InputLabelProps={{ shrink: true }} inputProps={{ pattern: '\\d{4}-\\d{2}-\\d{2}' }} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <TextField label="Fecha de Fin" name="fechaFin" type="date" value={edu.fechaFin || ''} onChange={e => handleEducacionChange(idx, e)} fullWidth InputLabelProps={{ shrink: true }} inputProps={{ pattern: '\\d{4}-\\d{2}-\\d{2}' }} />
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      {form.educacion.length > 1 && (
                        <IconButton onClick={() => handleRemoveEducacion(idx)} color="error"><RemoveIcon /></IconButton>
                      )}
                    </Grid>
                  </Grid>
                  {errors.educacion && errors.educacion[idx] && (
                    <Typography color="error" variant="body2">{errors.educacion[idx]}</Typography>
                  )}
                </Paper>
              ))}
              <Button startIcon={<AddIcon />} onClick={handleAddEducacion} variant="outlined">Añadir Educación</Button>
            </Grid>
            {/* Experiencia Laboral */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2 }}>Experiencia Laboral</Typography>
              {form.experienciaLaboral.map((exp, idx) => (
                <Paper key={idx} sx={{ p: 2, mb: 2, position: 'relative' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField label="Empresa" name="empresa" value={exp.empresa} onChange={e => handleExperienciaChange(idx, e)} fullWidth required autoComplete="off" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField label="Puesto" name="puesto" value={exp.puesto} onChange={e => handleExperienciaChange(idx, e)} fullWidth required autoComplete="off" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField label="Fecha de Inicio" name="fechaInicio" type="date" value={exp.fechaInicio} onChange={e => handleExperienciaChange(idx, e)} fullWidth required InputLabelProps={{ shrink: true }} inputProps={{ pattern: '\\d{4}-\\d{2}-\\d{2}' }} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField label="Fecha de Fin" name="fechaFin" type="date" value={exp.fechaFin || ''} onChange={e => handleExperienciaChange(idx, e)} fullWidth InputLabelProps={{ shrink: true }} inputProps={{ pattern: '\\d{4}-\\d{2}-\\d{2}' }} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label="Descripción" name="descripcion" value={exp.descripcion || ''} onChange={e => handleExperienciaChange(idx, e)} fullWidth multiline minRows={3} maxRows={6} />
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      {form.experienciaLaboral.length > 1 && (
                        <IconButton onClick={() => handleRemoveExperiencia(idx)} color="error"><RemoveIcon /></IconButton>
                      )}
                    </Grid>
                  </Grid>
                  {errors.experienciaLaboral && errors.experienciaLaboral[idx] && (
                    <Typography color="error" variant="body2">{errors.experienciaLaboral[idx]}</Typography>
                  )}
                </Paper>
              ))}
              <Button startIcon={<AddIcon />} onClick={handleAddExperiencia} variant="outlined">Añadir Experiencia</Button>
            </Grid>
            {/* CV */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2 }}>CV</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button variant="contained" component="label">
                  Seleccionar Archivo
                  <input type="file" accept=".pdf,.docx" hidden onChange={handleFileChange} />
                </Button>
                {form.cv && (
                  <>
                    <Typography>{form.cv.name}</Typography>
                    <Button color="error" onClick={handleRemoveFile}>Borrar</Button>
                  </>
                )}
              </Box>
              {errors.cv && <Typography color="error" variant="body2">{errors.cv}</Typography>}
            </Grid>
            {/* Botón Enviar */}
            <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
              <Button type="submit" variant="contained" color="primary" size="large" disabled={!isFormValid() || isLoading} startIcon={isLoading ? <CircularProgress size={20} /> : null}>
                Enviar Candidato
              </Button>
              <Button variant="outlined" color="secondary" size="large" sx={{ ml: 2 }} onClick={() => navigate('/')}>Regresar</Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Snackbar open={!!success} autoHideDuration={2000} onClose={() => setSuccess('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success" sx={{ width: '100%' }}>{success}</Alert>
      </Snackbar>
      <Snackbar open={!!errorMsg} autoHideDuration={4000} onClose={() => setErrorMsg('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="error" sx={{ width: '100%' }}>{errorMsg}</Alert>
      </Snackbar>
    </Container>
  );
};

export default AddCandidateForm;
