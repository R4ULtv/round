import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { project as projectSchema } from "@/auth-schema";
import ThemeSwitch from "@/components/theme-switch";

export function SiteHeader({
  project,
}: {
  project: typeof projectSchema.$inferInsert;
}) {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-out">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{project.name}</h1>
        <div className="ml-auto">
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
}
