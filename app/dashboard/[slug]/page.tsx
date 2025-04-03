import { issue, user as userSchema } from "@/auth-schema";

import { AppSidebar } from "@/components/nav/app-sidebar";
import IssuesList from "@/components/layout/issues-list";
import NewIssueDialog from "@/components/layout/new-issue-dialog";
import { SiteHeader } from "@/components/nav/header";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { desc, eq } from "drizzle-orm";

import { ListFilterIcon, Settings2Icon } from "lucide-react";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getCurrentProject,
  getProjectMembers,
  getUserProjects,
} from "@/lib/data-cache";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const cookieStore = await cookies();
  const { slug } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/login");

  const currentProject = await getCurrentProject(slug);

  if (!currentProject) {
    redirect("/dashboard");
  }

  const projectsWhereUserIsMember = await getUserProjects(session.user.id);
  const membersOfCurrentProject = await getProjectMembers(slug);

  const results = await db
    .select({
      issue: issue,
      assignedUser: userSchema,
    })
    .from(issue)
    .where(eq(issue.projectId, slug))
    .leftJoin(userSchema, eq(issue.assignedUserId, userSchema.id))
    .orderBy(desc(issue.priority));

  const issues = results.map((result) => ({
    ...result.issue,
    assignedUser: result.assignedUser || null,
  }));

  return (
    <SidebarProvider
      defaultOpen={
        cookieStore.get("sidebar_state")?.value === "false" ? false : true
      }
    >
      <AppSidebar
        variant="inset"
        projects={projectsWhereUserIsMember}
        members={membersOfCurrentProject}
      />
      <SidebarInset>
        <SiteHeader project={currentProject} />
        <div className="border-b flex items-center justify-between gap-2 py-1.5 px-4 lg:gap-2 lg:px-6">
          <Button variant="outline" size="sm">
            <ListFilterIcon />
            Filters
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings2Icon />
              Display
            </Button>
            <NewIssueDialog
              defaultProject={currentProject}
              members={membersOfCurrentProject}
              projects={projectsWhereUserIsMember}
            />
          </div>
        </div>
        <IssuesList issues={issues} members={membersOfCurrentProject} />
      </SidebarInset>
    </SidebarProvider>
  );
}
