# 🚗 DriveFlow — Plataforma Premium de Alquiler de Autos
> **Proyecto de Certificación Profesional**  
> *Stack:* Java 26 (Spring Boot 4.1.0) | React 19 | Tailwind CSS v4 | XAMPP (MySQL)

---

## 📄 1. Definición del Proyecto
**DriveFlow** es una solución de software de nivel empresarial (*Enterprise*) diseñada para optimizar y automatizar el negocio de alquiler y gestión de flotas vehiculares. 

El núcleo técnico de la aplicación está enfocado en la **resolución de concurrencia y el manejo crítico de disponibilidad de servicios**. Evita de forma algorítmica las sobre-reservas (*overbooking*) en bloques cronológicos compartidos. Proporciona una interfaz fluida, limpia y responsiva para el cliente, junto con una consola administrativa aislada de alta seguridad para el operador del negocio.

---

## 🎨 2. Identidad Visual de la Marca

### Isologotipo Diseñado
El isotipo de la marca se compone de una geometría abstracta circular-minimalista que contiene las iniciales **DF**. Transmite dinamismo, velocidad y fluidez (*Flow*), proyectando una experiencia de confianza y alta sofisticación corporativa.

### Paleta de Colores de Identidad (Escala Tailwind CSS v4)
Para consolidar una estética premium y de descanso visual, el sistema implementa estrictamente las siguientes variables de color:
*   **Color Primario (Energía y Acento):** `Blue-600` (`#2563EB`) — Utilizado en botones de acción y estados activos.
*   **Color Secundario (Sofisticación Dark):** `Slate-900` (`#0F172A`) — Utilizado en Headers fijos, Footers y el menú lateral.
*   **Fondo General (Descanso Visual):** `Slate-50` (`#F8FAFC`) — Un gris pizarra ultra-suave que incrementa el contraste de los datos.
*   **Contenedores y Tarjetas:** `White` (`#FFFFFF`) con bordes en `Slate-200` (`#E2E8F0`) — Delimitadores armónicos.

---

## 🛣️ 3. Plan de Pruebas y Resultados (Sprint 1)
Basado rigurosamente en las Historias de Usuario (US) cubiertas en este ciclo, se diseñaron y ejecutaron los siguientes casos de prueba con un **100% de tasa de éxito**:

| ID Caso | Historia de Usuario | Descripción del Caso de Prueba | Criterio de Aceptación | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **CP-01** | US #1: Encabezado | Hacer scroll vertical prolongado en la página de inicio. | El Header se mantiene fijo (`fixed top-0`) sin ocultarse ni pisar el contenido. | **PASSED** |
| **CP-02** | US #2: Cuerpo | Redimensionar la ventana del navegador de 1920px a 375px. | El contenedor `<main>` adapta las grillas y el fondo `bg-brand-bg` cubre el 100% del alto visible. | **PASSED** |
| **CP-03** | US #3: Registrar | Intentar registrar un auto con un nombre idéntico a uno ya almacenado. | El Backend intercepta la petición, arroja `NombreDuplicadoException` y retorna un HTTP 409 Conflict controlado por el `@ControllerAdvice`. | **PASSED** |
| **CP-04** | US #4: Home | Recargar el Home tres veces consecutivas. | El listado de productos muestra un máximo de 10 elementos ordenados de forma aleatoria y no predecible en cada refresco. | **PASSED** |
| **CP-05** | US #5: Detalle | Hacer clic en "Ver detalle" e inspeccionar el sub-header interno. | El título del coche se alinea estrictamente a la izquierda y la flecha de retorno a la derecha ocupando el 100% del ancho de pantalla. | **PASSED** |
| **CP-06** | US #6: Galería | Abrir la vista de detalle en resolución de Escritorio. | Se despliega un mosaico tipo Grid Premium con 1 imagen grande a la izquierda y 4 simétricas a la derecha con el botón flotante "Ver más". | **PASSED** |
| **CP-07** | US #7: Footer | Inspeccionar la sección inferior de la plataforma en dispositivos móviles. | El bloque se apila verticalmente, manteniendo legible el isologotipo, el copyright y el año dinámico actual sin desbordes. | **PASSED** |
| **CP-08** | US #8: Paginar | Interactuar con los controles de navegación del listado. | Los botones de avanzar, retroceder e inicio funcionan de forma reactiva asíncrona, deshabilitándose de forma segura en los extremos. | **PASSED** |
| **CP-09** | US #9: Panel Admin | Intentar ingresar a la URL `/administración` desde un smartphone. | El sistema detecta el ancho de pantalla menor a 1024px, bloquea el renderizado y muestra el aviso de "Panel no disponible en móviles". | **PASSED** |
| **CP-10** | US #10: Listar | Ingresar a la sub-vista de inventario de la consola. | Se renderiza una tabla limpia con las tres columnas requeridas por el negocio de forma estricta: `Id`, `Nombre` y `Acciones`. | **PASSED** |
| **CP-11** | US #11: Eliminar | Hacer clic en la papelera de una fila y presionar "No, mantener". | El modal informativo se cierra fluidamente y el registro permanece intacto en la base de datos MySQL de XAMPP sin sufrir alteraciones. | **PASSED** |
| **CP-12** | USB #1: Editar | Confirmar el modal de edición y mutar el precio por día de un vehículo. | Los datos viajan por el método `PUT`, el backend aplica Jakarta Validation y la grilla del cliente se refresca automáticamente en caliente. | **PASSED** |

## 🛣️ Plan de Pruebas y Resultados (Sprint 2)
Basado en las nuevas lógicas relacionales, criptográficas y de seguridad implementadas en este ciclo, se diseñaron y ejecutaron los siguientes casos de prueba en caliente, obteniendo una **tasa de éxito del 100%**:

| ID Caso | Historia de Usuario | Descripción del Caso de Prueba | Criterio de Aceptación | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **CP-13** | US #12: Categorizar | Registrar un nuevo vehículo seleccionando una familia en el combo desplegable. | El payload envía el `categoriaId` de forma numérica saneada (`parseInt`) y XAMPP crea la clave foránea relacional sin arrojar un HTTP 400. | **PASSED** |
| **CP-14** | US #13: Registro | Crear una cuenta de usuario con un correo electrónico mal formateado (ej: `juan.perez#gmail`). | Jakarta Validation intercepta la petición en red, el `@ControllerAdvice` mapea el fallo y el formulario en React pinta el mensaje semántico exacto debajo del input. | **PASSED** |
| **CP-15** | US #14: Identificar | Iniciar sesión con credenciales correctas en la ventana modal de acceso. | El Backend procesa y empareja la clave mediante `passwordEncoder.matches`, el `AuthContext` centraliza la sesión en Lazy Mode y el Header renderiza el avatar circular con las iniciales. | **PASSED** |
| **CP-16** | US #15: Cerrar Sesión | Pulsar la opción "Cerrar sesión" dispuesta verticalmente debajo del avatar. | La clave `df_session` se purga atómicamente del `localStorage`, el estado de React muta a anónimo y el Header restituye los botones de ingreso convencionales de forma inmediata. | **PASSED** |
| **CP-17** | US #16: Roles Admin | Ingresar a la sub-vista "Usuarios y Roles" en la consola e interactuar con el botón de rango. | Se dispara una petición `PATCH` al servidor que conmuta el enumerado `Rol` en MySQL. El botón cambia dinámicamente de "Hacer Admin" a "Quitar Admin" modificando los privilegios en caliente. | **PASSED** |
| **CP-18** | Criptografía (Core) | Inspeccionar la tabla `usuarios` en phpMyAdmin tras dar de alta una cuenta. | La columna `password` almacena de forma inalterable un hash criptográfico irreversible de 60 caracteres generado por el algoritmo **BCrypt**, eliminando el texto plano. | **PASSED** |
| **CP-19** | US #17: Atributos | Intentar registrar una característica con un nombre que ya existe en el maestro. | El servicio del Backend arroja un `NombreDuplicadoException` controlado, devolviendo al cliente un estado estructurado HTTP 409 Conflict. | **PASSED** |
| **CP-20** | US #18: Ver Atributos | Abrir la vista pública de detalle de un automóvil con equipamiento asignado. | Se renderiza un bloque independiente titulado "Características" que dibuja los iconos vectoriales de Lucide correspondientes de manera fluida y con grilla responsiva. | **PASSED** |
| **CP-21** | US #19: Notificación | Completar el formulario de registro de un cliente nuevo. | Spring Mail intercepta el evento e invoca al `EmailService` de forma asíncrona delegando el despacho HTML premium a los **Virtual Threads de Java 26** sin congelar la UI. | **PASSED** |
| **CP-22** | US #20: Sección Filtro | Seleccionar simultáneamente las tarjetas de categorías 'SUV' y 'Eléctricos' en el Home. | React Router orquesta los estados en red concatenando los filtros múltiples en la URL. El catálogo reduce la muestra e inyecta la barra informativa detallando el conteo de coincidencias sobre el inventario global. | **PASSED** |
| **CP-23** | US #21: Crear Familia | Guardar una nueva categoría rellenando el formulario de la consola administrativa. | El objeto viaja por el método `POST` inyectando el título, la descripción, el icono y la `urlImagen` representativa de forma atómica en XAMPP. | **PASSED** |
| **CP-24** | USB #2: CRUD Familias | Pulsar la papelera de una categoría en la lista y cancelar la confirmación del modal. | El puntero de control del modal se vacía restituyendo el foco de la tabla original de inmediato, impidiendo alteraciones de red y resguardando la integridad referencial. | **PASSED** |

## 📋 Historias de Usuario Resueltas (Sprint 3)

### 🔍 US #22: Realizar búsqueda (Motor de Filtrado)
- **Maquetación:** Bloque buscador con título corporativo y párrafo informativo visible.
- **Calendario Doble:** Integración responsiva de un calendario de dos meses continuos (`months={2}`) en idioma español para definir rangos de entrega y devolución.
- **Feedback Interactivo:** Sistema de autocompletado con sugerencias flotantes en tiempo real sobre los nombres de los automóviles comerciales, controlado con un Debounce de 300ms para cuidar el rendimiento de la red.
- **Fidelidad Visual:** El buscador mantiene inalteradas las cuadrículas de categorías y recomendaciones inferiores, actualizando las tarjetas en caliente.

### 📅 US #23: Visualizar disponibilidad (Ficha de Detalle)
- **Visualización Pasiva:** Inclusión de un calendario doble estático de consulta prominente dentro de la tarjeta de cotización lateral de `DetalleProducto.jsx`.
- **Indicador de Ocupación:** Conexión con el endpoint asíncrono `/api/reservas/ocupadas/{id}`. Las fechas reservadas se inyectan en `disabledDates`, pintándose en gris pizarra blando y bloqueando cualquier interacción física.
- **Manejo de Errores Robustos:** Intercepción atómica ante fallos de conexión en red, ocultando la rejilla rota y desplegando un banner de contingencia con el botón interactivo *"Intentar acceder nuevamente"*.

### 📱 US #27: Redes - Compartir productos
- **Acción Emergente:** Botón vectorial flotante (`Share2`) en la cabecera que despliega un modal interactivo difuminando el fondo.
- **Contenido Multidominio:** Sincronización en caliente de la imagen representativa del coche, su título, descripción breve y enlace directo inmutable.
- **Personalización e Integración:** Cuadro de texto para redactar un mensaje propio y botones con el kit de marca oficial para Facebook, Twitter (X) y WhatsApp. Utiliza la API universal acortada **`wa.me/`** para disparar la apertura nativa en smartphones y tabletas sin redundancia de variables.

### ⭐ US #28: Puntuar producto
- **Sistema de Estrellas:** Formulario interactivo de escala de 1 a 5 estrellas (`Star`) en un bloque prominente de la ficha técnica reservado para usuarios autenticados.
- **Historial Detallado:** El módulo despliega el nombre del autor, estrellas otorgadas, comentarios detallados y la fecha de publicación formateada (`es-AR`).
- **Puntuación Media Dinámica:** Recálculo matemático inmediato en caliente en el Backend de XAMPP tras cada inserción, actualizando el promedio y el volumen total de reseñas tanto en el Header de la ficha como en el catálogo general del Home.

### 🗑️ US #29: Eliminar categoría
- **Acceso Intuitivo:** Botón de papelera rojo estilizado dentro del maestro de familias en la consola.
- **Confirmación Preventiva:** Modal de alerta de alta visibilidad que intercepta la acción, detallando el ID y el nombre exacto de la categoría.
- **Seguridad Relacional:** El Backend (`CategoriaService.java`) valida que la categoría no contenga vehículos asociados en stock; si existen coches vinculados, frena la operación arrojando un error `HTTP 409 Conflict` procesado de forma clara para el administrador. Expone botones simétricos de *"Confirmar Baja"* o *"Cancelar Acción"*.

---

### 🛣️ Plan de Pruebas y Resultados (Sprint 4)

| ID Historia | Funcionalidad Evaluada | Objetivo del Caso de Test | Criterio de Aceptación Validado | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **US #30** | Reservas: Seleccionar fecha | `validarPasswordZod` | Zod congela el envío en frío si el string de la clave mide menos de 6 caracteres. | 🟢 PASSED |
| **US #30** | Reservas: Seleccionar fecha | `fallarPorSolapamiento` | El servicio intercepta y bloquea el guardado si el rango encierra días ya ocupados. | 🟢 PASSED |
| **US #31** | Reservas: Visualizar detalles | `registrarReservaOk` | El controlador asimila el DTO del vehículo con sus características y responde con `201 Created`. | 🟢 PASSED |
| **US #32** | Realizar reserva | `guardarReservaExitosa` | El motor persiste físicamente la orden en MySQL e inserta las variables opcionales (Teléfono/Destino). | 🟢 PASSED |
| **US #32** | Realizar reserva | `registrarReservaFail` | Si dos operarios envían el mismo auto en milisegundos idénticos, la API responde con `400 Bad Request`. | 🟢 PASSED |
| **US #35** | Notificación por correo | `verificarHashLength` | El backend delega la seguridad a hilos virtuales, asegurando el hash de 60 caracteres previo al correo. | 🟢 PASSED |
| **US #35** | Notificación por correo | `verificarMatches` | El validador criptográfico BCrypt rechaza accesos si varía una sola mayúscula del remitente/usuario. | 🟢 PASSED |

---

## 🔒 Auditoría de Ciberseguridad y Optimización Aplicada

### 1. Eliminación Completa de "Cascading Renders" en Efectos
En cumplimiento con las directrices estrictas de rendimiento de **React**, se erradicaron las mutaciones de estados síncronas (`setState()`) del cuerpo directo de los `useEffect`. 
- En la ficha técnica, los estados de limpieza de errores se configuraron de forma directa en el nacimiento de las variables de los hooks, logrando que la consola de desarrollo de Vite compile al 100% limpia de advertencias.

### 2. Aislamiento de Capas Arquitectónicas (Controladores Puros)
Se saneó el 100% del Backend removiendo consultas e invocaciones residuales directas a interfaces JPA desde los controladores (`@RestController`). Toda la lógica del negocio, filtros y el control relacional se encapsuló en clases `@Service` inmutables, protegiendo el sistema contra inyecciones y garantizando una separación limpia de capas.

### 3. Cifrado Simétrico del Lado del Cliente (LocalStorage Protegido)
Se solucionó la vulnerabilidad crítica del almacenamiento de contraseñas. Al iniciar sesión, la contraseña en texto plano jamás se guarda en el disco; el objeto de sesión que viaja desde el `UsuarioResponseDTO` (el cual omite el password del JSON de red) se codifica mediante un algoritmo de cifrado reversible inyectado con **Web Crypto API** antes de guardarse en `localStorage`, quedando inaccesible ante ataques de extensiones maliciosas. Las firmas administrativas viajan de forma segura mediante `Basic Auth`.

---

## 🚀 4. Guía de Instalación y Despliegue (Para Evaluadores)

Sigue estos pasos secuenciales para levantar el entorno completo en tu máquina local:

### Prerrequisitos de Software
*   **Java Development Kit (JDK) 26** instalado y configurado en tus variables de entorno.
*   **Node.js** (versión v18 o superior) junto con **npm**.
*   **XAMPP Control Panel** (con los módulos de Apache y MySQL activos).

---

### Paso 1: Configurar la Base de Datos (XAMPP)
1. Abre tu panel de XAMPP e inicia los servicios de **Apache** y **MySQL**.
2. Dirígete en tu navegador a: `http://localhost/phpmyadmin/`.
3. Crea una base de datos nueva y vacía llamada exactamente: **`driveflow_db`** con el cotejamiento predeterminado.

---

### Paso 2: Desplegar el Backend (Spring Boot 4.1.0)
1. Abre una terminal dentro de la carpeta del servidor:
   ```bash
   cd driveflow-backend
   ```
2. Compila el código fuente y descarga las dependencias automáticas de Maven:
   ```bash
   ./mvnw clean install
   ```
3. Ejecuta la aplicación. El servidor embebido Tomcat se levantará en el puerto `8080` y activará el modelo de hilos virtuales de Java 26:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(Hibernate autogenerará la estructura relacional de las tablas dentro de tu base de datos de XAMPP al arrancar).*

---

### Paso 3: Desplegar el Frontend (React 19 + Tailwind v4)
1. Abre una segunda terminal independiente orientada a la carpeta de la interfaz de usuario:
   ```bash
   cd driveflow-frontend
   ```
2. Instala los módulos y paquetes de dependencias (`Vite`, `React 19`, `Lucide Icons`):
   ```bash
   npm install
   ```
3. Lanza el servidor de desarrollo de alta velocidad:
   ```bash
   npm run dev
   ```
4. Abre tu navegador e ingresa a la dirección local provista por Vite: `http://localhost:5173/`.

---

### 🛡️ 5. Notas de Arquitectura Limpia Destacadas para la Evaluación
*   **Aislamiento de Persistencia:** Ningún controlador (`@RestController`) inyecta directamente un repositorio. Toda interacción con la base de datos pasa estrictamente por la capa `@Service` de negocio.
*   **Eficiencia de Red:** La paginación utiliza `Pageable` de Spring Data a nivel nativo en lugar de procesar filtros masivos en la memoria del navegador.
*   **Seguridad de Entrada:** Todos los endpoints del servidor validan los payloads entrantes mediante `@Valid` y estructuras `record` inmutables (DTOs), respondiendo con mensajes semánticos mapeados automáticamente campo por campo por el interceptor global `@RestControllerAdvice`.
