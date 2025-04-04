import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const project = pgTable("project", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull().unique(),
  description: text("description"),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  icon: text("icon"),
  isPublic: boolean("is_public").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  targetDate: timestamp("target_date"),
  deletedAt: timestamp("deleted_at"),
});

export const statusEnum = pgEnum("status_type", [
  "backlog",
  "todo",
  "in_progress",
  "review",
  "done",
  "canceled",
  "duplicate",
]);

export const priorityEnum = pgEnum("priority_type", [
  "no_priority",
  "low",
  "medium",
  "high",
  "urgent",
]);

export const issue = pgTable("issue", {
  id: text("id").primaryKey(),
  number: integer("number").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  labels: text("labels")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  status: statusEnum("status").notNull().default("backlog"),
  priority: priorityEnum("priority").notNull().default("no_priority"),
  projectId: text("project_id")
    .notNull()
    .references(() => project.id, { onDelete: "cascade" }),
  createdById: text("created_by_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  assignedUserId: text("assigned_user_id").references(() => user.id, {
    onDelete: "set null",
  }),
  targetDate: timestamp("target_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const projectMember = pgTable("project_member", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => project.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const labels = [
  { label: "bug", color: "oklch(65.34% 0.1835 23.68)" },
  { label: "feature", color: "oklch(72.16% 0.1708 302.88)" },
  { label: "enhancement", color: "oklch(71.21% 0.151 249.88)" },
  { label: "documentation", color: "oklch(56.81% 0.1585 275.24)" },
  { label: "security", color: "oklch(70.29% 0.1267 158.89)" },
  { label: "performance", color: "oklch(82.41% 0.1794 91.33)" },
];

export const invitationStatusEnum = pgEnum("invitation_status", [
  "pending",
  "accepted",
  "rejected",
  "expired",
]);

export const projectInvitation = pgTable("project_invitation", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  projectId: text("project_id")
    .notNull()
    .references(() => project.id, { onDelete: "cascade" }),
  invitedById: text("invited_by_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: invitationStatusEnum("status").notNull().default("pending"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
