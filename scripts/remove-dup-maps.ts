import { db } from "../src/db";
import { contentFields } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function run() {
  // Delete field id=43 (peta - old duplicate)
  await db.delete(contentFields).where(eq(contentFields.id, 43));
  console.log("Deleted field id=43 (peta / URL Peta lama)");
}

run().then(() => { console.log("Done"); process.exit(0); }).catch(e => { console.error(e); process.exit(1); });
