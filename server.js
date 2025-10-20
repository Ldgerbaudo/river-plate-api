const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Usuario y contraseña desde variables de entorno
const USER = process.env.USER;
const PASS = process.env.PASS;

// Token base64 a partir de USER:PASS
const AUTH_TOKEN = Buffer.from(`${USER}:${PASS}`).toString('base64');

// Middleware de autenticación
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: "No autorizado" });

  const token = authHeader.split(' ')[1];
  if (token !== AUTH_TOKEN) return res.status(403).json({ error: "Token inválido" });

  next();
}

const partidos = [
  { id: 1, fecha: "1901-05-01", rival: "Equipo X", goles_local: 2, goles_visitante: 1 },
  { id: 2, fecha: "1901-06-15", rival: "Equipo Y", goles_local: 3, goles_visitante: 0 },
  { id: 3, fecha: "1902-07-10", rival: "Equipo Z", goles_local: 1, goles_visitante: 1 }
];

// Endpoint raíz
app.get('/', (req, res) => {
  res.send('🔥 API de River');
});

// Endpoint GET /partidos con auth
app.get('/partidos', authMiddleware, (req, res) => {
  res.json(partidos);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
