import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  AI_PROVIDER: (process.env.AI_PROVIDER as 'gemini' | 'openai' | 'demo') || 'demo',
  AI_API_KEY: process.env.AI_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || '',
  AI_MODEL: process.env.AI_MODEL || 'gemini-1.5-flash',
  DEMO_MODE_FORCED: process.env.DEMO_MODE === 'true' || false,
};
