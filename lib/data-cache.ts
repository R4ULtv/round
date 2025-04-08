import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import {
  projectMember,
  project as projectSchema,
  user as userSchema,
  issue as issueSchema,
} from "@/auth-schema";
import { eq, and, isNull, count, ne } from "drizzle-orm";

const CACHE_TAGS = {
  PROJECT_MEMBERS: "project-members",
  USER_PROJECTS: "user-projects",
  CURRENT_PROJECT: "current-project",
  PROJECT_MEMBERS_COUNT: "project-members-count",
  PROJECT_ISSUES_COUNT: "project-issues-count",
};

export const getProjectMembers = unstable_cache(
  async (projectId: string) => {
    const members = await db
      .select({
        id: userSchema.id,
        name: userSchema.name,
        email: userSchema.email,
        emailVerified: userSchema.emailVerified,
        image: userSchema.image,
        createdAt: userSchema.createdAt,
        updatedAt: userSchema.updatedAt,
      })
      .from(projectMember)
      .innerJoin(userSchema, eq(projectMember.userId, userSchema.id))
      .where(eq(projectMember.projectId, projectId));

    return members;
  },
  [`${CACHE_TAGS.PROJECT_MEMBERS}`],
  {
    tags: [CACHE_TAGS.PROJECT_MEMBERS],
    revalidate: 3600, // Cache for 1 hour
  },
);

export const getUserProjects = unstable_cache(
  async (userId: string) => {
    const projects = await db
      .select({
        id: projectSchema.id,
        name: projectSchema.name,
        shortName: projectSchema.shortName,
        createdAt: projectSchema.createdAt,
        updatedAt: projectSchema.updatedAt,
        icon: projectSchema.icon,
        description: projectSchema.description,
        ownerId: projectSchema.ownerId,
        isPublic: projectSchema.isPublic,
        targetDate: projectSchema.targetDate,
        deletedAt: projectSchema.deletedAt,
      })
      .from(projectMember)
      .innerJoin(projectSchema, eq(projectMember.projectId, projectSchema.id))
      .where(eq(projectMember.userId, userId));

    return projects;
  },
  [`${CACHE_TAGS.USER_PROJECTS}`],
  {
    tags: [CACHE_TAGS.USER_PROJECTS],
    revalidate: 3600, // Cache for 1 hour
  },
);

export const getCurrentProject = unstable_cache(
  async (projectId: string) => {
    const project = await db
      .select()
      .from(projectSchema)
      .where(eq(projectSchema.id, projectId));

    if (project.length === 0) {
      return null;
    }

    return project[0];
  },
  [`${CACHE_TAGS.CURRENT_PROJECT}`],
  {
    tags: [CACHE_TAGS.CURRENT_PROJECT],
    revalidate: 3600, // Cache for 1 hour
  },
);

/**
 * Get user projects with owner information
 */
export const getUserProjectsWithOwner = unstable_cache(
  async (userId: string) => {
    const projects = await db
      .select()
      .from(projectMember)
      .innerJoin(projectSchema, eq(projectMember.projectId, projectSchema.id))
      .innerJoin(userSchema, eq(projectSchema.ownerId, userSchema.id))
      .where(eq(projectMember.userId, userId));

    return projects;
  },
  [`${CACHE_TAGS.USER_PROJECTS}-with-owner`],
  {
    tags: [`${CACHE_TAGS.USER_PROJECTS}-with-owner`],
    revalidate: 3600, // Cache for 1 hour
  },
);

/**
 * Get the count of members for a specific project
 */
export const getProjectMembersCount = unstable_cache(
  async (projectId: string) => {
    const result = await db
      .select({ count: count() })
      .from(projectMember)
      .where(eq(projectMember.projectId, projectId));

    return result[0]?.count ?? 0;
  },
  [`${CACHE_TAGS.PROJECT_MEMBERS_COUNT}`],
  {
    tags: [CACHE_TAGS.PROJECT_MEMBERS_COUNT],
    revalidate: 3600, // Cache for 1 hour
  },
);

/**
 * Get issue counts for a project, including total and open issues
 */
export const getProjectIssuesCount = unstable_cache(
  async (projectId: string) => {
    // Get total issues count
    const totalResult = await db
      .select({ count: count() })
      .from(issueSchema)
      .where(eq(issueSchema.projectId, projectId));

    const openResult = await db
      .select({ count: count() })
      .from(issueSchema)
      .where(
        and(
          eq(issueSchema.projectId, projectId),
          and(isNull(issueSchema.deletedAt), ne(issueSchema.status, "done")),
        ),
      );

    return {
      total: totalResult[0]?.count ?? 0,
      open: openResult[0]?.count ?? 0,
    };
  },
  [`${CACHE_TAGS.PROJECT_ISSUES_COUNT}`],
  {
    tags: [CACHE_TAGS.PROJECT_ISSUES_COUNT],
    revalidate: 3600, // Cache for 1 hour
  },
);

export { CACHE_TAGS };
