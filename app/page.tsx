import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GithubIcon, RoundIcon } from "@/lib/icons";
import {
  CodeIcon,
  GlobeIcon,
  KanbanIcon,
  LayoutDashboardIcon,
  ServerIcon,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-gradient-to-b from-background to-background/80 px-4 py-24">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-[30%] -right-[20%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container px-4 flex flex-col items-center justify-center gap-8 z-10">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <RoundIcon className="size-12" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 text-pretty">
            Simple. Powerful. Round.
          </h1>
        </div>
        <p className="text-xl text-center text-muted-foreground max-w-md text-pretty">
          A lightweight, self-hostable alternative to Linear.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="rounded-full gap-2 px-6" asChild>
            <a
              href="https://github.com/r4ultv/round"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon className="size-5" />
              Deploy now
            </a>
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="rounded-full gap-2 px-6"
            asChild
          >
            <a
              href="https://github.com/R4ULtv/round?tab=readme-ov-file#getting-started"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GlobeIcon className="size-5" />
              Learn More
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mt-8">
          {[
            {
              title: "Project Management",
              description:
                "Organize work with projects, issues, and customizable workflows",
              icon: <KanbanIcon className="size-6 text-primary" />,
            },
            {
              title: "Self-Hostable",
              description:
                "Full control over your data and deployment environment",
              icon: <ServerIcon className="size-6 text-primary" />,
            },
            {
              title: "Modern Tech Stack",
              description:
                "Built with Next.js 15, TypeScript, and Tailwind CSS v4",
              icon: <CodeIcon className="size-6 text-primary" />,
            },
          ].map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {feature.icon} {feature.title}
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 flex items-center gap-3">
        <Button
          className="rounded-full gap-2 text-muted-foreground"
          variant="link"
          asChild
        >
          <Link href="/dashboard">
            <LayoutDashboardIcon className="size-4" />
            Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
