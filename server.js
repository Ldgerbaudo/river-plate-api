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


// endpoints
app.get('/', (req, res) => res.send('API de River'));
app.get('/partidos', authMiddleware, (req, res) => res.json(partidos));

app.post('/partidos', authMiddleware, (req, res) => {
  const { fecha, rival, competicion, estado, resultado, goleadores } = req.body;

  if (!fecha || !rival || !competicion || !estado || !resultado) {
    return res.status(400).json({ error: "Faltan campos obligatorios: fecha, rival, competicion, estado o resultado" });
  }

  if (!/^\d{8}$/.test(fecha)) {
    return res.status(400).json({ error: "Formato de fecha inválido. Debe ser DDMMYYYY" });
  }

  if (goleadores && (!Array.isArray(goleadores) || goleadores.some(g => !g.nombre || !g.minuto || !g.equipo))) {
    return res.status(400).json({ error: "Cada goleador debe tener nombre, minuto y equipo" });
  }

  const id = fecha;
  const fechaFormateada = `${fecha.substring(0,2)}-${fecha.substring(2,4)}-${fecha.substring(4,8)}`;

  const nuevoPartido = {
    id,
    fecha: fechaFormateada,
    rival,
    competicion,
    estado,
    resultado,
    goleadores: goleadores || []
  };

  partidos.push(nuevoPartido);

  res.status(201).json(nuevoPartido);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
