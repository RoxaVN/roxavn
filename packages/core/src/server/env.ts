import dotenv from 'dotenv';
import { constants } from '../base/index.js';

export function initEnv() {
  dotenv.config();
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'postgresql://admin:admin@localhost:5434/roxavn';
  }
  if (!process.env.RUN_API_JOBS) {
    process.env.RUN_API_JOBS = '1';
  }
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = constants.ENV_DEVELOPMENT as any;
  }

  if (process.env.NODE_ENV === constants.ENV_DEVELOPMENT) {
    if (!process.env.DATABASE_LOGGING) {
      process.env.DATABASE_LOGGING = '1';
    }
    if (!process.env.RUN_CRON_JOBS) {
      process.env.RUN_CRON_JOBS = '1';
    }
  }
}
