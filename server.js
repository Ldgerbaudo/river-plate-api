const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const USER = process.env.USER;
const PASS = process.env.PASS;

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: "No autorizado" });

  const [type, credentials] = authHeader.split(' ');
  if (type !== 'Basic' || !credentials) return res.status(401).json({ error: "No autorizado" });

  const decoded = Buffer.from(credentials, 'base64').toString();
  const [username, password] = decoded.split(':');

  if (username !== USER || password !== PASS) {
    return res.status(403).json({ error: "Usuario o contraseña incorrectos" });
  }

  next();
}

let partidos = [
  { id: 1, fecha: "1901-05-01", rival: "Equipo X", goles_local: 2, goles_visitante: 1 },
  { id: 2, fecha: "1901-06-15", rival: "Equipo Y", goles_local: 3, goles_visitante: 0 },
  { id: 3, fecha: "1902-07-10", rival: "Equipo Z", goles_local: 1, goles_visitante: 1 }
];

app.get('/', (req, res) => res.send('🔥 API de River'));
app.get('/partidos', authMiddleware, (req, res) => res.json(partidos));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
