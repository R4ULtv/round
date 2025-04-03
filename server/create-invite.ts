"use server";

import { projectInvitation } from "@/auth-schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { createHash } from "crypto";

export async function createInvite(emailList: string[], projectId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unauthorized");
  if (!session.user) throw new Error("User not found");

  const invitedById = session.user.id;

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await db.insert(projectInvitation).values(
    emailList.map((email) => {
      const baseString = `${email}:${process.env.BETTER_AUTH_SECRET}:${projectId}`;
      const token = createHash("sha256").update(baseString).digest("hex");
      return {
        id: crypto.randomUUID(),
        email,
        token,
        projectId,
        invitedById,
        expiresAt,
      };
    }),
  );
}
