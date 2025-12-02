import type { Task } from "@/types/task";

// Helper to get date from task (handles both formats)
function getTaskDate(
  task: Task,
  field: "created" | "updated"
): string | undefined {
  const taskWithSnakeCase = task as Task & {
    created_at?: string;
    updated_at?: string;
  };
  if (field === "created") {
    return taskWithSnakeCase.created_at || task.createdAt;
  } else {
    return taskWithSnakeCase.updated_at || task.updatedAt;
  }
}

// Helper to check if a date is today
function isToday(dateString: string | undefined): boolean {
  if (!dateString) return false;
  const taskDate = new Date(dateString);
  const today = new Date();

  return (
    taskDate.getDate() === today.getDate() &&
    taskDate.getMonth() === today.getMonth() &&
    taskDate.getFullYear() === today.getFullYear()
  );
}

// Generate task summary
export function generateTaskSummary(tasks: Task[]): string {
  // Helper to normalize status
  const normalizeStatus = (status: string): string => {
    if (status === "in_progress") return "in-progress";
    return status;
  };

  // Calculate metrics
  const completedToday = tasks.filter(
    (t) =>
      normalizeStatus(t.status) === "done" && isToday(getTaskDate(t, "updated"))
  ).length;

  const pending = tasks.filter(
    (t) => normalizeStatus(t.status) !== "done"
  ).length;

  const total = tasks.length;
  const completed = tasks.filter(
    (t) => normalizeStatus(t.status) === "done"
  ).length;

  const inProgress = tasks.filter(
    (t) => normalizeStatus(t.status) === "in-progress"
  ).length;

  const todo = tasks.filter((t) => normalizeStatus(t.status) === "todo").length;

  // Format as a concise summary
  return `User summary:
- Completed today: ${completedToday}
- Pending: ${pending}
- Total tasks: ${total}
- Completed: ${completed}
- In progress: ${inProgress}
- Todo: ${todo}`;
}
