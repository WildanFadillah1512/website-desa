import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("Missing DATABASE_URL");

console.log("Connecting to Aiven DB for migration...");
// Use ssl: 'require' explicitly for Aiven
const migrationClient = postgres(connectionString, { max: 1, ssl: 'require' });

async function runMigration() {
  try {
    const db = drizzle(migrationClient);
    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: resolve(__dirname, './src/db/migrations') });
    console.log("Migrations applied successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await migrationClient.end();
    process.exit(0);
  }
}

runMigration();
