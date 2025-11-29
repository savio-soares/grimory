import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';

// Carregar variáveis de ambiente
dotenv.config();

// Importar rotas
import authRoutes from './routes/auth';
import tasksRoutes from './routes/tasks';
import checksRoutes from './routes/checks';
import historyRoutes from './routes/history';
import journalsRoutes from './routes/journals';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de Segurança
app.use(helmet({
  contentSecurityPolicy: false, // Desabilitar para permitir inline scripts do frontend
}));

// CORS configurado
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? true // Permitir mesma origem em produção
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// Parser JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/checks', checksRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/journals', journalsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Servir frontend em produção
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendPath));
  
  // Fallback para SPA - Express 5 usa {*path} ao invés de *
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Error handler global
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`🔮 Grimório Backend rodando na porta ${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
