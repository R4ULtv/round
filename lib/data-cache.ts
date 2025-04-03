import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import {
  projectMember,
  project as projectSchema,
  user as userSchema,
} from "@/auth-schema";
import { eq } from "drizzle-orm";

const CACHE_TAGS = {
  PROJECT_MEMBERS: "project-members",
  USER_PROJECTS: "user-projects",
  CURRENT_PROJECT: "current-project",
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

// Export cache tags for revalidation
export { CACHE_TAGS };
