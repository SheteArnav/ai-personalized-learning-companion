import express from 'express';
import cors from 'cors';
import { CONFIG } from './config/env.js';
import apiRouter from './routes/api.js';

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Mount API routes
app.use('/api', apiRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Synapse AI Backend Engine is active.',
    endpoints: {
      health: '/api/health',
      profile: '/api/profile',
      roadmap: '/api/roadmap',
      chat: '/api/chat',
      quiz: '/api/quiz/generate',
      documents: '/api/documents',
      analytics: '/api/analytics',
    },
  });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[ServerError]', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(CONFIG.PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Synapse AI Server running on http://localhost:${CONFIG.PORT}`);
  console.log(`🤖 AI Provider: ${CONFIG.AI_PROVIDER.toUpperCase()}`);
  console.log(`🎯 Mode: ${CONFIG.DEMO_MODE_FORCED || !CONFIG.AI_API_KEY ? 'DEMO MOCK ENGINE (High-Fidelity)' : 'LIVE AI API'}`);
  console.log(`====================================================`);
});
