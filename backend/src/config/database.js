require('dotenv').config(); // Assure que les variables sont chargées
const { PrismaClient } = require('../generated/client'); // ⚠️ Adaptez le chemin vers votre client généré
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

// Création de l'adaptateur avec les infos de connexion
const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5, // Recommandé pour éviter "Too many connections" [citation:3]
  ssl: true, // ⚠️ IMPORTANT pour TiDB Cloud : force la connexion SSL [citation:4]
});

// Instanciation de Prisma Client avec l'adaptateur
const prisma = new PrismaClient({
  adapter, // On passe l'adaptateur ici
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

module.exports = prisma;
