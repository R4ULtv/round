import {
  issue as issueSchema,
  user as userSchema,
  statusEnum,
} from "@/auth-schema";
import { StatusIcon } from "@/lib/icons";
import IssueItem from "@/components/layout/issue-item";

type IssueStatus = (typeof statusEnum.enumValues)[number];

type IssueWithUser = typeof issueSchema.$inferSelect & {
  assignedUser?: typeof userSchema.$inferSelect | null;
};

type StatusConfig = {
  label: string;
  gradient: string;
};

export default function IssueList({
  members,
  issues,
}: {
  members: (typeof userSchema.$inferSelect)[];
  issues: IssueWithUser[];
}) {
  const groupedIssues = issues.reduce(
    (groups, issue) => {
      const status = issue.status;
      if (!groups[status]) {
        groups[status] = [];
      }
      groups[status].push(issue);
      return groups;
    },
    {} as Record<IssueStatus, IssueWithUser[]>,
  );

  const statusConfigs: Record<IssueStatus, StatusConfig> = {
    backlog: {
      label: "Backlog",
      gradient: "from-muted/50",
    },
    todo: {
      label: "Todo",
      gradient: "from-muted/50",
    },
    in_progress: {
      label: "In Progress",
      gradient: "from-yellow-400/5",
    },
    review: {
      label: "Review",
      gradient: "from-green-400/5",
    },
    done: {
      label: "Done",
      gradient: "from-blue-400/5",
    },
    canceled: {
      label: "Canceled",
      gradient: "from-muted/50",
    },
  };

  const statuses: IssueStatus[] = [
    "backlog",
    "todo",
    "in_progress",
    "review",
    "done",
    "canceled",
  ];

  return (
    <div className="grid" role="list" aria-label="Issues by status">
      {statuses.map((status) => {
        const statusIssues = groupedIssues[status] || [];
        const config = statusConfigs[status];
        return (
          <div key={status}>
            <div
              className={`flex items-center gap-2 h-10 px-6 bg-gradient-to-r ${config.gradient} to-transparent`}
              role="region"
              aria-label={`${config.label} section`}
            >
              <StatusIcon status={status} className="size-3.5" />
              <h2 className="first-letter:uppercase font-semibold text-sm">
                {config.label}
              </h2>
              <span className="text-muted-foreground text-sm">
                {statusIssues.length}
              </span>
            </div>
            {statusIssues.map((issue) => (
              <IssueItem key={issue.id} issue={issue} members={members} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
