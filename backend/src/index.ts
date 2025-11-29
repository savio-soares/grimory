import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import tasksRoutes from './routes/tasks';
import checksRoutes from './routes/checks';
import historyRoutes from './routes/history';
import journalsRoutes from './routes/journals';

const app = express();
const PORT = process.env.PORT || 3001;

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Disable to allow inline scripts from frontend
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? true // Allow same origin in production
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// Parser JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/checks', checksRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/journals', journalsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendPath));
  
  // Fallback for SPA - Express 5 uses {*path} instead of *
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🔮 Grimoire Backend running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
