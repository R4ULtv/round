import { issue as issueSchema, user as userSchema } from "@/auth-schema";
import PriorityChanger from "@/components/issues/priority-changer";
import StatusChanger from "@/components/issues/status-changer";
import TargetDateChanger from "../issues/target-date-changer";
import AssignedChanger from "../issues/assigned-changer";
import LabelsChanger from "../issues/labels-changer";

type IssueWithUser = typeof issueSchema.$inferSelect & {
  assignedUser?: typeof userSchema.$inferSelect | null;
};

export default function IssueItem({
  members,
  issue,
}: {
  members: (typeof userSchema.$inferSelect)[];
  issue: IssueWithUser;
}) {
  return (
    <div className="flex items-center justify-between px-6 h-11">
      <div className="flex items-center gap-1">
        <PriorityChanger issueId={issue.id} priority={issue.priority} />
        <span className="text-sm text-muted-foreground">{issue.id}</span>
        <StatusChanger issueId={issue.id} status={issue.status} />
        <span className="text-sm font-semibold">{issue.title}</span>
      </div>
      <div className="flex items-center gap-2.5">
        <LabelsChanger issueId={issue.id} labels={issue.labels} />
        {issue.targetDate && (
          <TargetDateChanger issueId={issue.id} targetDate={issue.targetDate} />
        )}
        <span className="text-sm text-muted-foreground">
          {issue.createdAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
        <AssignedChanger
          issueId={issue.id}
          members={members}
          assignedUser={issue.assignedUser || undefined}
        />
      </div>
    </div>
  );
}
