import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { redirect } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import {
  BoxIcon,
  CalendarPlusIcon,
  CalendarX2Icon,
  ChevronRightIcon,
  ListFilterIcon,
  Settings2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeSwitch from "@/components/theme-switch";
import NewProjectDialog from "@/components/layout/new-project-dialog";
import DynamicIcon from "@/components/dynamic-icon";
import {
  getProjectIssuesCount,
  getUserProjectsWithOwner,
} from "@/lib/data-cache";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/login");

  const userProjects = await getUserProjectsWithOwner(session.user.id);

  const projectsWithIssueCount = await Promise.all(
    userProjects.map(async ({ project, user }) => {
      const issueCount = await getProjectIssuesCount(project.id);
      return { project, user, issueCount };
    }),
  );

  return (
    <main className="bg-sidebar min-h-svh flex w-full">
      <div className="bg-background relative flex w-full flex-1 flex-col md:m-2 md:rounded-xl md:shadow-sm">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <Button variant="ghost" size="icon" className="size-7 -ml-1">
              <BoxIcon />
            </Button>
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <h1 className="text-base font-medium">Projects</h1>
            <span className="text-sm bg-muted rounded-sm px-1.5 py-0.5">
              {userProjects.length}
            </span>
            <div className="ml-auto">
              <ThemeSwitch />
            </div>
          </div>
        </header>
        <div className="border-b flex items-center justify-between gap-2 h-12 px-4 lg:gap-2 lg:px-6">
          <Button variant="outline" size="sm">
            <ListFilterIcon />
            Filters
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings2Icon />
              Display
            </Button>
            <NewProjectDialog />
          </div>
        </div>
        <div className="grid" role="list">
          {projectsWithIssueCount.map(({ user, project, issueCount }) => (
            <Link
              key={project.id}
              href={`/dashboard/${project.id}`}
              className="flex items-center justify-between px-6 h-11 hover:bg-muted/50"
            >
              <div className="flex items-center gap-2.5">
                {project.icon && (
                  <div className="bg-muted rounded-sm p-1 border border-border">
                    <DynamicIcon name={project.icon} className="size-3.5" />
                  </div>
                )}
                <span className="text-sm font-semibold">{project.name}</span>
                <span className="text-xs font-semibold bg-muted rounded-sm px-1.5 py-0.5">
                  {project.shortName}
                </span>
                <ChevronRightIcon className="size-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {project.description}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Avatar className="size-5">
                    <AvatarImage
                      src={user.image || undefined}
                      alt={user.name}
                    />
                    <AvatarFallback className="text-xs">
                      {user.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {user.name}
                </div>
                {project.targetDate ? (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CalendarX2Icon className="size-4" />
                    {new Date(project.targetDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CalendarPlusIcon className="size-4" />
                    No target Date
                  </span>
                )}
                <span className="text-sm font-semibold">
                  {issueCount.total
                    ? Math.round(
                        ((issueCount.total - issueCount.open) /
                          issueCount.total) *
                          100,
                      )
                    : 0}
                  %
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
