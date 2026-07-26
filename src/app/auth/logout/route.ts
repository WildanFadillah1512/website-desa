import { destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function GET() {
  redirect("/4d31n");
}

export async function POST() {
  await destroySession();
  redirect("/4d31n");
}
