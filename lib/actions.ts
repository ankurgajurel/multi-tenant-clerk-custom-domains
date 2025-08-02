"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getDomain() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  try {
    const result = await db
      .select({ domain: pages.domain })
      .from(pages)
      .where(eq(pages.user_id, userId))
      .limit(1);

    return result.length > 0 ? result[0].domain : "";
  } catch (error) {
    console.error("Error fetching domain:", error);
    return "";
  }
}

export async function updateDomain(domain: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    await db
      .insert(pages)
      .values({ user_id: userId, domain })
      .onConflictDoUpdate({
        target: pages.user_id,
        set: { domain },
      });

    return { success: true };
  } catch (error) {
    console.error("Error updating domain:", error);
    throw new Error("Failed to update domain");
  }
}

export async function getUserByDomain(domain: string) {
  try {
    const result = await db
      .select({ user_id: pages.user_id })
      .from(pages)
      .where(eq(pages.domain, domain))
      .limit(1);
    
    return result.length > 0 ? result[0].user_id : null;
  } catch (error) {
    console.error("Error fetching user by domain:", error);
    return null;
  }
}
