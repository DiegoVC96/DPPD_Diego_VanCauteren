# 🚗 DriveFlow — Plataforma Premium de Alquiler de Autos
> **Proyecto de Certificación Profesional**  
> *Stack:* Java 26 (Spring Boot 4.1.0) | React 19 | Tailwind CSS v4 | XAMPP (MySQL)

---

## 📄 1. Definición del Proyecto
**DriveFlow** es una solución de software diseñada para optimizar y automatizar el negocio de alquiler y gestión de flotas vehiculares. 

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
| **CP-B1** | USB #1: Editar | Confirmar el modal de edición y mutar el precio por día de un vehículo. | Los datos viajan por el método `PUT`, el backend aplica Jakarta Validation y la grilla del cliente se refresca automáticamente en caliente. | **PASSED** |

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
