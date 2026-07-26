import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing in environment variables");
}

// Keep the pool tiny for Next.js build workers and Vercel serverless functions.
// Large per-process pools quickly exhaust small managed Postgres plans.

const globalForDb = globalThis as unknown as {
  client: postgres.Sql | undefined;
};

export const client = globalForDb.client ?? postgres(connectionString, { max: 1 });
if (process.env.NODE_ENV !== 'production') globalForDb.client = client;

export const db = drizzle(client, { schema });
