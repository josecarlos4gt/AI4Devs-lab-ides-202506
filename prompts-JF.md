# Herramienta
Visual Studio Code y Copilot Github 

# Prompt #1
# Para el Desarrollo del Backend
Actúa como un desarrollador backend experto en Node.js, Express, TypeScript, Prisma ORM (con PostgreSQL) y Top 10 Owasp Web. Tu tarea es crear el API RESTful necesario para gestionar la adición de nuevos candidatos a un sistema ATS, siguiendo la historia de usuario y criterios de aceptación, e integrándote con la estructura de proyecto dada.

**Requisitos específicos del backend:**

1.  **Configuración del Proyecto:**
    * Asegúrate de que el código se ubique dentro de `backend/src/`.
    * Utiliza `tsconfig.json` para la configuración de TypeScript.
    * Configura Prisma para conectarse a una base de datos PostgreSQL, utilizando `.env` para la cadena de conexión.

2.  **Esquema de Prisma (`backend/prisma/schema.prisma`):**
    * Define un modelo `Candidato` en tu `schema.prisma` con los siguientes campos y tipos de datos de PostgreSQL/Prisma, incluyendo validaciones y relaciones implícitas:
        * `id`: Int @id @default(autoincrement())
        * `nombre`: String
        * `apellido`: String
        * `correoElectronico`: String @unique
        * `telefono`: String
        * `direccion`: String
        * `educacion`: Json (para almacenar un array de objetos de educación; describe la estructura esperada del JSON)
        * `experienciaLaboral`: Json (para almacenar un array de objetos de experiencia laboral; describe la estructura esperada del JSON)
        * `cvUrl`: String? (opcional, para la URL del CV subido)
        * `fechaCreacion`: DateTime @default(now())
        * `fechaActualizacion`: DateTime @updatedAt (se actualiza automáticamente en cada cambio)
    * **Nota sobre `Json`:** Para `educacion` y `experienciaLaboral`, almacenar como `Json` en PostgreSQL es flexible para estructuras anidadas. Especifica la forma esperada de los objetos dentro de estos JSON (ej., `{ institucion: string, titulo: string, fechaInicio: DateTime, fechaFin: DateTime? }`).

3.  **Endpoint para Añadir Candidato (`backend/src/controllers/candidatoController.ts` y `backend/src/routes/candidatoRoutes.ts`):**
    * Crea un endpoint `POST /api/candidatos`.
    * **Validación de Datos (Middleware):** Implementa un middleware de validación robusto (ej., con `express-validator` o validación manual) en el servidor para todos los campos requeridos (`nombre`, `apellido`, `correoElectronico`, `telefono`, `direccion`) y el formato de `correoElectronico`, antes de interactuar con Prisma.
    * **Manejo de Archivos:**
        * Integra `multer` para procesar la subida del CV (PDF o DOCX).
        * Define una utilidad para subir el archivo localmente. Especifica dónde se guardará y cómo se servirá estáticamente (considerando la seguridad).
        * Almacena la URL resultante del CV en el campo `cvUrl` del modelo `Candidato`.
    * **Interacción con Prisma:** Utiliza el cliente de Prisma para crear un nuevo registro de `Candidato` en la base de datos con los datos validados y la `cvUrl`.
    * **Respuestas HTTP:**
        * Si la validación y el guardado son exitosos, devuelve un `status 201 Created` con el objeto del nuevo candidato.
        * Si hay errores de validación, devuelve un `status 400 Bad Request` con un JSON que contenga mensajes de error claros.
        * Maneja errores internos (ej., fallo de conexión a DB, error al subir archivo, error de unicidad del email en Prisma) y devuelve un `status 500 Internal Server Error` con un mensaje genérico.
        * Para el error de unicidad del email (P2002 de Prisma), devuelve un `status 409 Conflict`.

4.  **Seguridad y Privacidad:**
    * Implementa un middleware de autenticación (ej., basado en JWT) para asegurar que solo usuarios autorizados (reclutadores) puedan acceder al endpoint.
    * Asegura la sanitización de los datos de entrada para prevenir ataques.

5.  **Estructura del Código:**
    * Organiza tu código en `backend/src/` utilizando la estructura de capas: `routes/` (para definir las rutas), `controllers/` (para la lógica de negocio y la interacción con Prisma), y `utils/` o `services/` (para la lógica de subida de archivos y validaciones auxiliares).

**Entrega esperada:**

* Código fuente completo del backend en TypeScript (dentro de `backend/src/`).
* El archivo `backend/prisma/schema.prisma` con el modelo `Candidato`.
* Instrucciones o comandos necesarios para configurar o implementar el cambio.


# Prompt #2
# Para el Desarrollo del Frontend
Actúa como un desarrollador frontend experto en React.js, un framework de CSS (Tailwind CSS, Material-UI o similar) y Top 10 Owasp Web. Tu tarea es construir la interfaz de usuario para añadir un nuevo candidato al sistema ATS, siguiendo la historia de usuario y criterios de aceptación, e integrándote con la estructura de proyecto dada.

**Requisitos específicos del frontend:**

1.  **Estructura del Proyecto:**
    * El código React debe estar en `frontend/src/`.
    * Asegúrate de que el formulario y sus componentes estén bien organizados (ej., `frontend/src/components/AddCandidateForm.tsx`).

2.  **Accesibilidad de la Función (`frontend/src/App.tsx` o similar):**
    * Desde una página principal simulada del dashboard del reclutador (un componente `DashboardPage.tsx` simple), crea un **botón o enlace prominente** con el texto "Añadir Nuevo Candidato".
    * Al hacer clic, navega (usando `react-router-dom`) o muestra un modal/dialogo con el formulario `AddCandidateForm`.

3.  **Formulario de Ingreso de Datos (`frontend/src/components/AddCandidateForm.tsx`):**
    * Diseña un formulario visualmente atractivo e intuitivo con los siguientes campos de entrada:
        * **Campos de Texto:** `Nombre`, `Apellido`, `Correo Electrónico`, `Teléfono`, `Dirección`.
        * **Campos Dinámicos (Array de Objetos):**
            * `Educación`: Un botón "Añadir Educación" que agregue dinámicamente un conjunto de campos: `Institución`, `Título`, `Fecha de Inicio` (selector de fecha), `Fecha de Fin` (selector de fecha, opcional/en curso). Permite eliminar entradas individuales.
            * `Experiencia Laboral`: Similar a Educación, con campos: `Empresa`, `Puesto`, `Fecha de Inicio` (selector de fecha), `Fecha de Fin` (selector de fecha, opcional/actual), `Descripción` (textarea). Permite eliminar entradas individuales.
        * **Carga de Archivo:** Un `input type="file"` para el CV.
            * Permite seleccionar solo archivos `.pdf` y `.docx`.
            * Muestra el nombre del archivo seleccionado y la opción de "cambiar" o "borrar" el archivo.
        * Un botón "Enviar Candidato".

4.  **Validación de Datos en el Cliente:**
    * Implementa validación en tiempo real (al escribir y al salir del campo) para todos los campos obligatorios.
    * Valida el formato del `Correo Electrónico`.
    * Muestra mensajes de error claros y amigables debajo de cada campo que no cumpla la validación (ej., "El nombre es obligatorio", "Por favor, introduce un correo electrónico válido").
    * Deshabilita el botón "Enviar Candidato" si hay errores de validación pendientes.

5.  **Comunicación con el Backend:**
    * Utiliza `fetch` o `axios` para realizar la solicitud `POST` al endpoint `/api/candidatos` del backend.
    * El `Content-Type` de la solicitud debe ser `multipart/form-data` para manejar la subida del archivo.
    * Maneja el estado de carga (`isLoading`) para deshabilitar el formulario y mostrar un spinner.

6.  **Confirmación y Manejo de Errores (Feedback al Usuario):**
    * **Éxito:** Si la solicitud es exitosa (código 201), muestra un mensaje de confirmación visible (ej., un `Toast` como "¡Candidato añadido exitosamente!") y luego limpia el formulario, o redirige al usuario de vuelta al dashboard.
    * **Error:** Si la solicitud falla (códigos 400, 409, 500, etc.), muestra un mensaje de error claro y útil al usuario (ej., "Error: El correo electrónico ya está registrado." o "Error al añadir candidato. Por favor, intente de nuevo."). Si los errores provienen del backend (ej. validación 400), muestra esos errores específicos.

7.  **Consideraciones Adicionales:**
    * **Accesibilidad y Responsive Design:** Asegura que la interfaz sea totalmente responsive y usable en diferentes tamaños de pantalla y dispositivos.
    * **UX/UI:** La interfaz debe ser intuitiva y fácil de usar, minimizando la carga cognitiva.
    * **Autocompletado (Opcional):** Si es viable, integra una funcionalidad básica de autocompletado para campos como `Institución` o `Empresa` con una lista predefinida de sugerencias (simulando una integración real), para saber cuáles elementos colocar en la lista utiliza datos preexistentes en el sistema. Realiza los cambios necesarios en el Backend para este propósito.

**Entrega esperada:**

* Código fuente completo del frontend en React (dentro de `frontend/src/`).
* Instrucciones o comandos necesarios para configurar o implementar el cambio.


# Prompt #3
# Diseño de la base de datos (PostgreSQL)
Actúa como un arquitecto de bases de datos relacionales, experto en PostgreSQL y en la definición de esquemas con Prisma ORM. Tu tarea es diseñar el esquema de la base de datos PostgreSQL para almacenar la información de los candidatos, optimizando para la consistencia, la integridad referencial y el rendimiento a través de Prisma.

1.  **Modelo de Datos (`backend/prisma/schema.prisma`):**
    * Define el modelo `Candidato` en tu `schema.prisma` con los siguientes campos, aplicando los tipos de datos de Prisma que se mapean a PostgreSQL y las directivas de Prisma (`@id`, `@unique`, `@default`, `@updatedAt`, `@map` si es necesario):
        * `id`: `Int @id @default(autoincrement())`
        * `nombre`: `String`
        * `apellido`: `String`
        * `correoElectronico`: `String @unique` (Debe ser único a nivel de base de datos)
        * `telefono`: `String`
        * `direccion`: `String`
        * `educacion`: `Json` (Almacenará un array de objetos JSON. Define la estructura JSON esperada para cada objeto de educación: `institucion: string`, `titulo: string`, `fechaInicio: DateTime`, `fechaFin: DateTime?`).
        * `experienciaLaboral`: `Json` (Almacenará un array de objetos JSON. Define la estructura JSON esperada para cada objeto de experiencia: `empresa: string`, `puesto: string`, `fechaInicio: DateTime`, `fechaFin: DateTime?`, `descripcion: string`).
        * `cvUrl`: `String?` (Campo opcional para la URL del CV, marcado con `?`)
        * `fechaCreacion`: `DateTime @default(now())`
        * `fechaActualizacion`: `DateTime @updatedAt` (Se actualiza automáticamente en cada modificación del registro)

2.  **Relaciones (si aplica):**
    * En este caso, al usar `Json` para `educacion` y `experienciaLaboral`, no hay relaciones explícitas con otras tablas. Justifica esta elección (ej., para simplificar el modelo de datos de un solo candidato, optimizar lecturas para el perfil completo del candidato).

3.  **Índices:**
    * Asegura que se defina un índice `@@unique` para `correoElectronico` en el modelo `Candidato` en `schema.prisma` para garantizar la unicidad y acelerar las búsquedas por este campo.
    * Considera si otros campos (ej., `apellido`, `nombre`) necesitarían índices para futuras funcionalidades de búsqueda o filtrado extensivo, y si es así, cómo se definirían en Prisma.

4.  **Ejemplo de Documento/Registro:**
    * Proporciona un ejemplo en formato JSON o un `create` statement de Prisma Client que represente cómo se vería un registro completo de un candidato en la base de datos PostgreSQL, incluyendo los campos `Json` con su estructura.

5.  **Migraciones de Prisma:**
    * Describe brevemente el proceso para generar la migración inicial de Prisma que aplique este esquema a la base de datos PostgreSQL.

**Entrega esperada:**

* El contenido completo del archivo `backend/prisma/schema.prisma` que define el modelo `Candidato` y sus directivas.
* Una justificación concisa del diseño de la base de datos, especialmente en el uso de campos `Json` para `educacion` y `experienciaLaboral`.
* Un ejemplo de cómo se almacenaría un candidato en PostgreSQL (JSON o `Prisma.CandidatoCreateInput` ejemplo).
* Los comandos básicos de Prisma CLI necesarios para aplicar este esquema a la base de datos.



# Ajustes y problemas
1. Cambio de librería expression-validator por Zod, debido a que no lograba que se compilara. Perdí mucho tiempo
2. Problemas de versiones de Typescript, React y framewor CSS debido a incompatibilidades. Perdí mucho tiempo
3. El token de autenticación lo guardaba en el LocalStorage, se cambió a LocalSession
4. Agregar una nueva vista de candidatos para validar la información ya procesada
5. Validar y redireccionar para que el usuario no pueda acceder a páginas si no se ha autenticado
6. Vista, que botones en Dashboard quedaran alineados, botón regresar en formularios, los campos de fecha se veían muy estrechos



# Inicio
http://localhost:3000/login
Usuario: admin
Clave: admin123
