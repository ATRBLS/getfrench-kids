require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { WebSocketServer } = require('ws');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const sessionRoutes = require('./routes/sessions');
const ttsRoute = require('./routes/tts');
const kidsRoutes = require('./routes/kids');
const setupDeepgramWS = require('./routes/deepgram');

const app = express();
const PORT = process.env.PORT || 3002;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'https://kids.getfrench.app',
  'https://getfrench-kids.vercel.app',
  'https://client-two-rosy.vercel.app',
];
if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/tts', ttsRoute);
app.use('/api/kids', kidsRoutes);

app.get('/api/health', (_req, res) => res.json({ ok: true, app: 'getfrench-kids' }));

const server = app.listen(PORT, () => console.log(`GetFrench Kids server running on :${PORT}`));

const wss = new WebSocketServer({ server, path: '/api/deepgram' });
setupDeepgramWS(wss);

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} already in use.`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
