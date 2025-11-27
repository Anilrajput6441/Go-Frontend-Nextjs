"use client";

import React, { useState } from "react";
import type { Task } from "@/types/task";
import { deleteTask } from "@/services/taskService";

export default function TaskList({
  tasks = [],
  loading: initialLoading,
  onRefresh,
}: {
  tasks?: Task[];
  loading?: boolean;
  onRefresh?: () => void;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(id: string) {
    try {
      console.log("deleting first task", id);
      setDeleting(true);
      await deleteTask(id);
      onRefresh?.();
    } catch (err) {
      console.error("delete failed", err);
      alert("Failed to delete task");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 dark:border-gray-800 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Today Task</h2>
        <div className="text-sm text-gray-500">
          {initialLoading || deleting
            ? "..."
            : `${tasks.length} ${tasks.length === 1 ? "item" : "items"}`}
        </div>
      </div>

      {initialLoading ? (
        <p className="text-sm text-gray-500">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-gray-500">No tasks yet. Create one above!</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between border rounded p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-medium">{task.title}</h3>
                {task.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {task.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    task.status === "done"
                      ? "bg-green-100 text-green-800"
                      : task.status === "in-progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {task.status}
                </span>

                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
