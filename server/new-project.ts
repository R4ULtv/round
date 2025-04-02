"use server";

import { project as projectSchema, projectMember } from "@/auth-schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";

type ProjectInput = Omit<typeof projectSchema.$inferInsert, "ownerId">;

export async function createProject(project: ProjectInput) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unauthorized");
  if (!session.user) throw new Error("User not found");

  const ownerId = session.user.id;

  const newProject = await db
    .insert(projectSchema)
    .values({ ...project, ownerId });
  if (!newProject) throw new Error("Project creation failed");

  return await db.insert(projectMember).values({
    id: crypto.randomUUID(),
    projectId: project.id,
    userId: ownerId,
  });
}
