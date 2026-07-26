import { db } from "../src/db";
import { users } from "../src/db/schema";
import { hashPassword } from "../src/lib/auth";

async function createAdmin() {
  const allUsers = await db.select().from(users);
  
  if (allUsers.length === 0) {
    console.log("No users found. Creating default admin account...");
    const passwordHash = await hashPassword("admin123");
    
    await db.insert(users).values({
      username: "admin",
      passwordHash: passwordHash,
      name: "Administrator",
      role: "admin",
    });
    
    console.log("Admin account created successfully!");
    console.log("Username: admin");
    console.log("Password: admin123");
  } else {
    console.log(`Found ${allUsers.length} users. Skipping default admin creation.`);
  }
}

createAdmin()
  .catch(console.error)
  .finally(() => process.exit(0));
