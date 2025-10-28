import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { connectDB } from './server/config/db.js';
import contactsRouter from './server/routes/contactsRoutes.js';
import projectsRouter from './server/routes/projectsRoutes.js';
import qualificationsRouter from './server/routes/qualificationsRoutes.js';
import usersRouter from './server/routes/usersRoutes.js';
import { notFound, errorHandler } from './server/middleware/errorHandler.js';

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  process.env.CLIENT_ORIGIN || null,
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Helpful root message so hitting http://localhost:5000 is not a 404
app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio API running',
    health: '/api/health',
    docs: 'See README for endpoints',
  });
});

// Routes
app.use('/api/contacts', contactsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/qualifications', qualificationsRouter);
app.use('/api/users', usersRouter);

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI is not set. Please configure your .env file.');
    } else {
      await connectDB(process.env.MONGODB_URI);
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

export default app;
