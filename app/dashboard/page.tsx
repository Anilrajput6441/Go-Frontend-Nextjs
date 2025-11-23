"use client";
import AppLayout from "@/components/AppLayout";
import Sidebar from "@/components/Sidebar";
import HeaderBar from "@/components/HeaderBar";
import CreateTask from "@/components/CreateTask";
import TaskList from "@/components/TaskList";
import AIPanel from "@/components/AIPanel";
import { useState } from "react";

export default function DashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [aiCollapsed, setAiCollapsed] = useState(false);

  const refresh = () => setRefreshKey((k) => k + 1);

  return (
    <AppLayout>
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <HeaderBar />

          <main className="p-6">
            <div className="grid grid-cols-12 gap-6">
              {/* Center content */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                <CreateTask onCreated={refresh} />
                <TaskList key={refreshKey} onRefresh={refresh} />
              </div>

              {/* Right AI Panel */}
              <div className="col-span-12 lg:col-span-4">
                <AIPanel
                  collapsed={aiCollapsed}
                  onClose={() => setAiCollapsed(true)}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
