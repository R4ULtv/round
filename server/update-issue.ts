"use server";

import { issue as issueSchema } from "@/auth-schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

type IssueId = typeof issueSchema.$inferSelect.id;
type UpdateResult = { success: boolean; error?: string };

/**
 * Gets the current authenticated session or throws an error if not authenticated
 * @returns Authenticated session with user information
 * @throws Error if unauthorized or user not found
 */
const getSession = async () => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) throw new Error("Unauthorized");
    if (!session.user) throw new Error("User not found");

    return session;
  } catch (error) {
    console.error("Authentication error:", error);
    throw new Error("Authentication failed");
  }
};

/**
 * Generic helper function to update a field in an issue
 * @param issueId The ID of the issue to update
 * @param updateData Object containing the fields to update
 * @returns Result of the update operation
 */
async function updateIssueField<T extends Partial<typeof issueSchema.$inferSelect>>(
  issueId: IssueId,
  updateData: T
): Promise<UpdateResult> {
  try {
    const session = await getSession();
    
    await db
      .update(issueSchema)
      .set({ ...updateData, updatedAt: new Date() })
      .where(
        and(
          eq(issueSchema.id, issueId),
          eq(issueSchema.createdById, session.user.id),
        ),
      );
    
    return { success: true };
  } catch (error) {
    console.error(`Failed to update issue ${issueId}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Updates the status of an issue
 * @param params Object containing issueId and new status
 */
export async function updateStatus({
  issueId,
  status,
}: {
  issueId: IssueId;
  status: typeof issueSchema.$inferSelect.status;
}): Promise<UpdateResult> {
  return updateIssueField(issueId, { status });
}

/**
 * Updates the priority of an issue
 * @param params Object containing issueId and new priority
 */
export async function updatePriority({
  issueId,
  priority,
}: {
  issueId: IssueId;
  priority: typeof issueSchema.$inferSelect.priority;
}): Promise<UpdateResult> {
  return updateIssueField(issueId, { priority });
}

/**
 * Updates the assigned user of an issue
 * @param params Object containing issueId and new assignedUserId
 */
export async function updateAssignedUser({
  issueId,
  assignedUserId,
}: {
  issueId: IssueId;
  assignedUserId: typeof issueSchema.$inferSelect.assignedUserId;
}): Promise<UpdateResult> {
  return updateIssueField(issueId, { assignedUserId });
}

/**
 * Updates the target date of an issue
 * @param params Object containing issueId and new targetDate
 */
export async function updateTargetDate({
  issueId,
  targetDate,
}: {
  issueId: IssueId;
  targetDate: typeof issueSchema.$inferSelect.targetDate;
}): Promise<UpdateResult> {
  return updateIssueField(issueId, { targetDate });
}

/**
 * Updates the labels of an issue
 * @param params Object containing issueId and new labels
 */
export async function updateLabels({
  issueId,
  labels,
}: {
  issueId: IssueId;
  labels: typeof issueSchema.$inferSelect.labels;
}): Promise<UpdateResult> {
  return updateIssueField(issueId, { labels });
}
