const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');
const settingsRoutes = require('./routes/admin/settingsRoutes');
const authRoutes = require('./routes/common/authRoutes');
const institutionRoutes = require('./routes/admin/institutionRoutes');
const dashboardRoutes = require('./routes/common/dashboardRoutes');
const calendarRoutes = require('./routes/common/calendarRoutes');
const userRoutes = require('./routes/admin/userRoutes');
const courseRoutes = require('./routes/common/courseRoutes');
const hierarchyRoutes = require('./routes/admin/hierarchyRoutes');
const teachingUnitRoutes = require('./routes/admin/teachingUnitRoutes');
const materialRoutes = require('./routes/common/materialRoutes');
const notificationRoutes = require('./routes/common/notificationRoutes');
const courseModuleRoutes = require('./routes/common/courseModuleRoutes');
const announcementRoutes = require('./routes/common/announcementRoutes');
const enrollmentRoutes = require('./routes/admin/enrollmentRoutes');
const financeRoutes = require('./routes/admin/financeRoutes');
const academicYearRoutes = require('./routes/admin/academicYearRoutes');
const assignmentRoutes = require('./routes/common/assignmentRoutes');
const quizRoutes = require('./routes/quizRoutes');
const mobileMoneyRoutes = require('./routes/admin/mobileMoneyRoutes');
const examRoutes = require('./routes/admin/examRoutes');
const gradeRoutes = require('./routes/admin/gradeRoutes');
const forumRoutes = require('./routes/common/forumRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// ═══════════════════════════════════════════════════════════
// 1. CORS (DOIT ÊTRE LE TOUT PREMIER)
// ═══════════════════════════════════════════════════════════
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://masterclass-lms.vercel.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options(/.*/, cors());

// ═══════════════════════════════════════════════════════════
// 2. AUTRES MIDDLEWARES
// ═══════════════════════════════════════════════════════════
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json({ limit: '600mb' }));
app.use(express.urlencoded({ extended: true, limit: '600mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/uploads/materials', express.static(path.join(__dirname, '../uploads/materials')));

// ═══════════════════════════════════════════════════════════
// 3. HEALTH CHECK
// ═══════════════════════════════════════════════════════════
app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'API LMS opérationnelle', timestamp: new Date() });
});

// ═══════════════════════════════════════════════════════════
// 4. ROUTES (TOUTES DÉCLARÉES ICI, APRÈS LES MIDDLEWARES)
// ═══════════════════════════════════════════════════════════
app.use('/api/settings', settingsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/institution', institutionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/hierarchy', hierarchyRoutes);
app.use('/api/teaching-units', teachingUnitRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/programs', courseModuleRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/academic-years', academicYearRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api', quizRoutes);
app.use('/api/mobile-money', mobileMoneyRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/forum', forumRoutes);

// ═══════════════════════════════════════════════════════════
// 5. GESTION DES ERREURS
// ═══════════════════════════════════════════════════════════
app.use(notFound);
app.use(errorHandler);

module.exports = app;
