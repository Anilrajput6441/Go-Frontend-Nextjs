"use client";

import HeaderBar from "@/components/HeaderBar";
import CreateTask from "@/components/CreateTask";
import TaskList from "@/components/TaskList";
import AIPanel from "@/components/AIPanel";
import type { Task } from "@/types/task";

interface TodoViewProps {
  tasks: Task[];
  loading: boolean;
  refreshTasks: () => void;
  aiCollapsed: boolean;
  setAiCollapsed: (collapsed: boolean) => void;
}

export default function TodoView({
  tasks,
  loading,
  refreshTasks,
  aiCollapsed,
  setAiCollapsed,
}: TodoViewProps) {
  return (
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
            tasks={tasks}
          />
        </div>
      </main>
    </div>
  );
}
