require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const prisma = require('./config/database');
const { verifyConnection } = require('./config/email');
const { verifySmsConfig } = require('./config/sms');
const { setIO } = require('./config/socket');
const socketHandler = require('./sockets');

const PORT = process.env.PORT || 5000;

// ═══════════════════════════════════════════════════════════
// CRÉER LE SERVEUR HTTP
// ═══════════════════════════════════════════════════════════
const httpServer = http.createServer(app);

// ═══════════════════════════════════════════════════════════
// CRÉER SOCKET.IO
// ═══════════════════════════════════════════════════════════
const io = new Server(httpServer, {
  cors: {
    origin: [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://localhost:5173',
      'http://localhost:3000',
      'https://masterclass-lms.vercel.app', // ✅ Ajout de votre domaine Vercel
    ],
    credentials: true,
    methods: ['GET', 'POST'],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Enregistrer les handlers
socketHandler(io);

// Rendre io accessible dans toute l'app
setIO(io);
app.set('io', io);

// ✅ Route de secours pour le Health Check de Render (évite le 404 sur HEAD /)
app.get('/', (req, res) => {
  res.status(200).send('API LMS opérationnelle');
});

// ═══════════════════════════════════════════════════════════
// DÉMARRER LE SERVEUR
// ═══════════════════════════════════════════════════════════
// ✅ Ajout de '0.0.0.0' pour écouter sur toutes les interfaces réseau
httpServer.listen(PORT, '0.0.0.0', async () => {
  console.log('');
  console.log('════════════════════════════════════════════════════');
  console.log(`🚀 Serveur LMS démarré sur le port ${PORT}`);
  console.log(`📊 Environnement : ${process.env.NODE_ENV}`);
  console.log(`🔌 Socket.IO actif`);
  console.log('════════════════════════════════════════════════════');
  console.log('');

  // Vérifier la configuration email
  await verifyConnection();

  // Vérifier la configuration SMS
  verifySmsConfig();
});

// ═══════════════════════════════════════════════════════════
// GESTION DES ERREURS
// ═══════════════════════════════════════════════════════════
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  httpServer.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  httpServer.close(() => process.exit(1));
});

process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM reçu, arrêt en cours...');
  await prisma.$disconnect();
  httpServer.close(() => process.exit(0));
});

module.exports = { app, io, httpServer };
