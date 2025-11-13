// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ---------------------------
// 🔧 CONFIGURACIÓN DEL SERVIDOR
// ---------------------------
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// ---------------------------
// ⚙️ CONEXIÓN A MONGODB ATLAS
// ---------------------------
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true, // TLS moderno obligatorio
      tlsAllowInvalidCertificates: false, // Seguridad estricta
    });
    console.log('✅ Conectado correctamente a MongoDB Atlas');
  } catch (err) {
    console.error('❌ Error al conectar a MongoDB Atlas:');
    console.error('Mensaje:', err.message);
    if (err.reason) console.error('Razón:', err.reason);
    console.error('🧭 Sugerencia: revisa tu versión de Node (>=18) y el formato del MONGO_URI en .env');
  }
})();

// ---------------------------
// 📦 MODELOS DE DATOS
// ---------------------------
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const User = mongoose.model('User', userSchema);
const Event = mongoose.model('Event', eventSchema);

// ---------------------------
// 🛡️ MIDDLEWARE DE AUTENTICACIÓN
// ---------------------------
function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'No token provided' });

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ---------------------------
// 🔐 AUTENTICACIÓN Y REGISTRO
// ---------------------------
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: 'Campos requeridos' });

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ error: 'Usuario ya existe' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error en el inicio de sesión' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({ user: { id: user._id, username: user.username, email: user.email, role: user.role } });
});

// ---------------------------
// 📅 CRUD COMPLETO DE EVENTOS
// ---------------------------
app.get('/api/events', authMiddleware, async (req, res) => {
  const events = await Event.find({ owner: req.user.id });
  res.json({ events });
});

app.post('/api/events', authMiddleware, async (req, res) => {
  const { title, date } = req.body;
  if (!title || !date) return res.status(400).json({ error: 'Faltan campos' });

  const event = await Event.create({ title, date, owner: req.user.id });
  res.json({ event });
});

app.put('/api/events/:id', authMiddleware, async (req, res) => {
  const { title, date } = req.body;
  const event = await Event.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    { title, date },
    { new: true }
  );
  if (!event) return res.status(404).json({ error: 'Evento no encontrado o no autorizado' });
  res.json({ event });
});

app.delete('/api/events/:id', authMiddleware, async (req, res) => {
  const deleted = await Event.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  if (!deleted) return res.status(404).json({ error: 'Evento no encontrado o no autorizado' });
  res.json({ success: true });
});

// ---------------------------
// 🔒 RUTA PROTEGIDA PARA ADMINS
// ---------------------------
app.get('/api/admin/data', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'No autorizado' });
  res.json({ secret: 'Solo los administradores pueden ver esto 🚀' });
});

// ---------------------------
// 🚀 INICIO DEL SERVIDOR
// ---------------------------
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
