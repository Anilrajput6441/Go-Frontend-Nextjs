export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  createdAt?: string;
  updatedAt?: string;
  // API returns snake_case, so include both formats
  created_at?: string;
  updated_at?: string;
}
