# 🚗 DriveFlow - Car Rental Platform

DriveFlow es una plataforma empresarial para el alquiler y gestión de vehículos comerciales de flota, que permite a los usuarios buscar automóviles por fecha, gestionar sus favoritos, puntuar el servicio y recibir contratos de confirmación automatizados de forma asíncrona.

---

## 🛠️ Tecnologías

### Frontend
- **Core Library:** React 19 (Ecosistema optimizado mediante React Compiler)
- **Build Tool:** Vite
- **Styles & Layout:** Tailwind CSS
- **Form & Validation:** React Hook Form + Zod 
- **Date Management:** `react-date-range` 1.4.0 + `date-fns` 4.x

### Backend
- **Core Server:** Java 26
- **Framework:** Spring Boot (Spring Data JPA, Spring Security)
- **Asincronismo:** Virtual Threads de Java acoplados a `@Async`
- **Criptografía:** BCryptPasswordEncoder (60 caracteres estructurales)

### Base de Datos
- **Engine:** MySQL / MariaDB (Servidor local administrado mediante XAMPP)

---

## 📦 Instalación Local

### Requisitos Previos
- **Java Development Kit (JDK):** Versión 26 o superior
- **Node.js:** Versión 20.x o superior (LTS)
- **XAMPP Control Panel:** Módulos Apache y MySQL habilitados

### Pasos Numerados
1. **Clonar el repositorio unificado:**
   ```bash
   git clone https://github.com
   cd driveflow
   ```

2. **Inicializar y poblar la Base de Datos:**
   - Abra el panel de control de XAMPP y encienda Apache y MySQL.
   - Ingrese a phpMyAdmin (`http://localhost/phpmyadmin/`).
   - Cree una nueva base de datos llamada `driveflow_db`.

3. **Compilar y ejecutar el Servidor Backend:**
   ```bash
   cd driveflow-backend
   ./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xmx512m -Xms256m"
   ```

4. **Instalar dependencias y ejecutar la Interfaz Frontend:**
   ```bash
   cd ../driveflow-frontend
   npm install
   npm run dev -- --force
   ```

5. **Acceder a la aplicación:**
   - Abra su navegador e ingrese a `http://localhost:5173/`.

## ⚙️ Configuración Backend

Las variables de entorno se gestionan a través de propiedades externalizadas. A continuación, se detalla la estructura base que debés configurar en tu archivo **`driveflow-backend/src/main/resources/application.properties`**:

```properties
# 🗄️ Conexión de Base de Datos Nativa
spring.datasource.url=jdbc:mysql://localhost:3306/driveflow_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=

# ⚙️ Configuración ORM Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# 📧 Servidor SMTP de Notificaciones Asíncronas
spring.mail.host=://example.com
spring.mail.port=587
spring.mail.username=MAIL_APLICACIONES
spring.mail.password=PASSWORD_APLICACIONES
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

## 💻 Configuración Frontend

El cliente en React se conecta a la API local mediante propiedades de entorno. Creá un archivo **`.env`** en la raíz de la carpeta `driveflow-frontend/` con las siguientes claves:

```env
# 🌐 URL Base del Servidor de API Local
VITE_API_URL=http://localhost:8080/api

# 🏷️ Identidad de la Aplicación
VITE_APP_NAME=DriveFlow Car Rental
```

## 🌐 Endpoints de API

| Módulo | Método | Endpoint | Descripción | Auth |
| :--- | :---: | :--- | :--- | :---: |
| **Auth** | POST | `/api/usuarios/registro` | Registro de cuentas de clientes | ❌ |
| **Auth** | POST | `/api/usuarios/login` | Autenticación y devolución de DTO | ❌ |
| **Vehículos** | GET | `/api/vehiculos/paginados` | Catálogo de autos paginado y filtrado | ❌ |
| **Vehículos** | POST | `/api/vehiculos` | Alta de nuevo automóvil en flota | ✅ (ADMIN) |
| **Favoritos** | POST | `/api/usuarios/{uid}/favoritos/{vid}` | Marcar un producto como favorito | ✅ (USER) |
| **Favoritos** | GET | `/api/usuarios/{uid}/favoritos-completos` | Listar favoritos reales del cliente | ✅ (USER) |
| **Reservas** | GET | `/api/reservas/ocupadas/{vid}` | Consultar días bloqueados de un auto | ❌ |
| **Reservas** | POST | `/api/reservas` | Confirmar contrato de alquiler | ✅ (USER) |
| **Reseñas** | POST | `/api/puntuaciones/vehiculo/{vid}/usuario/{uid}` | Puntuar y dejar opinión de un auto | ✅ (USER) |
| **Categorías** | DELETE| `/api/categorias/{id}` | Eliminar categoría sin autos asociados | ✅ (ADMIN) |

## 📊 Diagrama de Base de Datos

El diseño lógico relacional se encuentra normalizado en Tercera Forma Normal (3FN) para mitigar anomalías de inserción y asegurar la integridad referencial en cascada:

[usuarios] 1 ------ N [reservas] N ------ 1 [vehiculos] N ------ 1 [categorias]1                                1                      1|                     |                      |N                     N                      N[usuarios_favoritos] [puntuaciones]          [politicas]

