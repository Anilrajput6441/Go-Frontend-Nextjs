"use client";

import React, { useState } from "react";
import type { Task } from "@/types/task";
import { deleteTask, updateTask } from "@/services/taskService";

// status options for the task list
const STATUS_OPTIONS = [
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

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
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleStatusUpdate(taskId: string, newStatus: string) {
    try {
      setUpdatingId(taskId);
      await updateTask(taskId, { status: newStatus });
      onRefresh?.();
    } catch (err) {
      console.error("failed to update status", err);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  }

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
                <select
                  value={task.status}
                  disabled={updatingId === task.id}
                  onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                  className={`text-xs rounded border px-2 py-1 bg-white
    ${updatingId === task.id ? "opacity-50" : ""}
  `}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

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
