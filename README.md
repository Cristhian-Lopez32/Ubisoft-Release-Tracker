Backend RESTful con Autenticación JWT

Este proyecto implementa un backend seguro y escalable usando Node.js, Express, y MongoDB Atlas.
Incluye autenticación mediante JSON Web Tokens (JWT), operaciones CRUD y rutas protegidas por roles.

🚀 Características principales

✅ Autenticación segura con JWT

✅ Registro e inicio de sesión de usuarios

✅ Rutas protegidas y por rol (user, admin)

✅ CRUD completo de eventos

✅ Conexión a MongoDB Atlas

✅ Estructura modular y escalable

✅ Compatible con Postman para pruebas HTTP

📂 Estructura del proyecto
Proyecto_Web/
├── backend/
│   ├── index.js              # Servidor principal
│   ├── package.json          # Dependencias y scripts
│   ├── .env.example          # Variables de entorno (modelo)
│   ├── .gitignore            # Exclusión de .env y node_modules
│   └── /node_modules/        # Ignorado por Git
│
├── tests/
│   └── pruebas_postman.json  # Colección de pruebas API
│
├── docs/
│   └── informe_backend.pdf   # Explicación técnica del código
│
└── README.md

⚙️ Instalación y configuración

1️⃣ Clonar el repositorio:

git clone https://github.com/tu_usuario/backend-autenticacion-jwt.git
cd backend


2️⃣ Instalar dependencias:

npm install


3️⃣ Configurar variables de entorno:
Crear un archivo .env basado en .env.example:

PORT=4000
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/mi_base
JWT_SECRET=mi_clave_ultra_segura


4️⃣ Iniciar el servidor:

npm start


✅ Servidor corriendo en:
http://localhost:4000

🧠 Endpoints principales
🔐 Autenticación
Método	Ruta	Descripción
POST	/api/auth/register	Registrar usuario
POST	/api/auth/login	Iniciar sesión
GET	/api/auth/me	Obtener datos del usuario autenticado
📅 CRUD de Eventos
Método	Ruta	Descripción
GET	/api/events	Listar eventos del usuario
POST	/api/events	Crear evento
PUT	/api/events/:id	Actualizar evento
DELETE	/api/events/:id	Eliminar evento
🧰 Ruta protegida de administrador
Método	Ruta	Descripción
GET	/api/admin/data	Acceso solo para role: admin
🧪 Pruebas recomendadas (Postman)

Incluye el archivo tests/pruebas_postman.json para importar en Postman:

Registro de usuarios

Inicio de sesión

CRUD de eventos

Acceso restringido a rutas protegidas

👥 Colaboradores

Cristhian Yesid Lopez
Diego Alejandro Guerra
Maira Alejandra Mendez

🧱 Requisitos cumplidos

✅ Código fuente completo del backend
✅ Estructura organizada por módulos
✅ Archivo README técnico y descriptivo
✅ Evidencia de historial de commits colaborativos
✅ Exclusión correcta del archivo .env
