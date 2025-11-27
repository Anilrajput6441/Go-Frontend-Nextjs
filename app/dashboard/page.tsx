"use client";
import AppLayout from "@/components/AppLayout";
import Sidebar from "@/components/Sidebar";
import HeaderBar from "@/components/HeaderBar";
import CreateTask from "@/components/CreateTask";
import TaskList from "@/components/TaskList";
import AIPanel from "@/components/AIPanel";
import AuthGuard from "@/components/AuthGuard";
import { useState, useEffect } from "react";
import type { Task } from "@/types/task";
import { listTasks } from "@/services/taskService";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiCollapsed, setAiCollapsed] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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
          <Sidebar />

          <div className="flex-1 pl-5 flex flex-col min-w-0">
            <main className="grid grid-cols-12 gap-1 flex-1 min-h-0 overflow-hidden">
              <div className="col-span-8 space-y-5 overflow-y-auto pr-4">
                <HeaderBar />
                {/* Center content */}
                <div className="space-y-6">
                  <CreateTask onCreated={refreshTasks} />
                  <TaskList
                    tasks={tasks}
                    loading={loading}
                    onRefresh={refreshTasks}
                  />
                </div>
              </div>
              {/* Right AI Panel */}
              <div className="col-span-4 h-full">
                <AIPanel
                  collapsed={aiCollapsed}
                  onClose={() => setAiCollapsed(true)}
                  onAIAction={refreshTasks}
                />
              </div>
            </main>
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
