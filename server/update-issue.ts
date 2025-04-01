"use server";

import { issue as issueSchema } from "@/auth-schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

const getSession = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) throw new Error("Unauthorized");
  if (!session.user) throw new Error("User not found");

  return session;
};

export async function updateStatus({
  issueId,
  status,
}: {
  issueId: typeof issueSchema.$inferSelect.id;
  status: typeof issueSchema.$inferSelect.status;
}) {
  const session = await getSession();

  return await db
    .update(issueSchema)
    .set({ status, updatedAt: new Date() })
    .where(
      and(
        eq(issueSchema.id, issueId),
        eq(issueSchema.createdById, session.user.id),
      ),
    );
}

export async function updatePriority({
  issueId,
  priority,
}: {
  issueId: typeof issueSchema.$inferSelect.id;
  priority: typeof issueSchema.$inferSelect.priority;
}) {
  const session = await getSession();

  return await db
    .update(issueSchema)
    .set({ priority, updatedAt: new Date() })
    .where(
      and(
        eq(issueSchema.id, issueId),
        eq(issueSchema.createdById, session.user.id),
      ),
    );
}

export async function updateAssignedUser({
  issueId,
  assignedUserId,
}: {
  issueId: typeof issueSchema.$inferSelect.id;
  assignedUserId: typeof issueSchema.$inferSelect.assignedUserId;
}) {
  const session = await getSession();

  return await db
    .update(issueSchema)
    .set({ assignedUserId, updatedAt: new Date() })
    .where(
      and(
        eq(issueSchema.id, issueId),
        eq(issueSchema.createdById, session.user.id),
      ),
    );
}

export async function updateTargetDate({
  issueId,
  targetDate,
}: {
  issueId: typeof issueSchema.$inferSelect.id;
  targetDate: typeof issueSchema.$inferSelect.targetDate;
}) {
  const session = await getSession();

  return await db
    .update(issueSchema)
    .set({ targetDate, updatedAt: new Date() })
    .where(
      and(
        eq(issueSchema.id, issueId),
        eq(issueSchema.createdById, session.user.id),
      ),
    );
}

export async function updateLabels({
  issueId,
  labels,
}: {
  issueId: typeof issueSchema.$inferSelect.id;
  labels: typeof issueSchema.$inferSelect.labels;
}) {
  const session = await getSession();

  return await db
    .update(issueSchema)
    .set({ labels, updatedAt: new Date() })
    .where(
      and(
        eq(issueSchema.id, issueId),
        eq(issueSchema.createdById, session.user.id),
      ),
    );
}
