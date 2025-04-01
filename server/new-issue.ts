"use server";

import { issue as issueSchema, project as projectSchema } from "@/auth-schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { headers } from "next/headers";

type IssueInput = Omit<
  typeof issueSchema.$inferInsert,
  "id" | "createdById" | "number"
>;

// Generate a unique issue ID based on the project ID and the next available number {PRO-12}
async function generateIssueId(projectId: string) {
  const result = await db
    .select({
      maxNumber: sql<number>`COALESCE(MAX(${issueSchema.number}), 0)`,
    })
    .from(issueSchema)
    .where(sql`${issueSchema.projectId} = ${projectId}`);

  const nextNumber = (result[0]?.maxNumber || 0) + 1;

  const project = await db
    .select()
    .from(projectSchema)
    .where(sql`${projectSchema.id} = ${projectId}`);

  const formattedId = `${project[0].shortName}-${nextNumber}`;

  return {
    id: formattedId,
    number: nextNumber,
  };
}

export async function createIssue(issue: IssueInput) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unauthorized");
  if (!session.user) throw new Error("User not found");

  const { id, number } = await generateIssueId(issue.projectId);
  const createdById = session.user.id;

  return db.insert(issueSchema).values({ ...issue, id, number, createdById });
}
