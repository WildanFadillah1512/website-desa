import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { users } from './src/db/schema';
import { eq } from 'drizzle-orm';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("Missing DATABASE_URL");

const client = postgres(connectionString, { max: 1, ssl: 'require' });
const db = drizzle(client);

async function seed() {
  console.log("Seeding database...");
  try {
    const existingAdmin = await db.select().from(users).where(eq(users.username, 'admin')).limit(1);
    
    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.insert(users).values({
        username: 'admin',
        passwordHash: hashedPassword,
        name: 'Administrator',
        role: 'admin',
      });
      console.log("Admin user created! (username: admin, password: admin123)");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await client.end();
    process.exit(0);
  }
}

seed();
