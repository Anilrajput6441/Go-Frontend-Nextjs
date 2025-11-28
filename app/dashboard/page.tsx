"use client";
import AppLayout from "@/components/AppLayout";
import Sidebar from "@/components/Sidebar";
import TodoView from "@/components/TodoView";
import AuthGuard from "@/components/AuthGuard";
import { useState, useEffect } from "react";
import type { Task } from "@/types/task";
import { listTasks } from "@/services/taskService";
import Analytic from "@/components/Analytic";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiCollapsed, setAiCollapsed] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedView, setSelectedView] = useState("todo");

  async function refreshTasks() {
    try {
      // Only show loading on initial load
      if (isInitialLoad) {
        setLoading(true);
      }
      const data = await listTasks();
      // Handle different response structures - could be array or object with tasks/data property
      const taskList = Array.isArray(data)
        ? data
        : data?.tasks || data?.data || [];
      setTasks(taskList);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setTasks([]);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }

  useEffect(() => {
    refreshTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthGuard>
      <AppLayout>
        <div className="flex h-full overflow-hidden p-5">
          <Sidebar selectedView={selectedView} onViewChange={setSelectedView} />

          {selectedView === "todo" && (
            <TodoView
              tasks={tasks}
              loading={loading}
              refreshTasks={refreshTasks}
              aiCollapsed={aiCollapsed}
              setAiCollapsed={setAiCollapsed}
            />
          )}

          {selectedView === "analytics" && <Analytic tasks={tasks} />}
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
