"use client";

import React, { useEffect, useState } from "react";
import { aiListTasks, aiDeleteTask } from "@/services/aiTools";
import type { Task } from "@/types/task";

export default function TaskList({ onRefresh }: { onRefresh?: () => void }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadTasks() {
    setLoading(true);
    setError(null);
    try {
      const res = await aiListTasks();
      // Handle different response structures
      // Could be res directly, res.tasks, res.data, etc.
      const taskList = Array.isArray(res) ? res : res?.tasks || res?.data || [];
      setTasks(taskList);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setError("Failed to load tasks. Please try again.");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []); // Component remounts when key changes, so this will run again

  async function handleDelete(id: string) {
    try {
      await aiDeleteTask(id);
      await loadTasks();
      // Also trigger parent refresh if callback exists
      onRefresh?.();
    } catch (err) {
      console.error("delete failed", err);
      alert("Failed to delete task");
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Today Task</h2>
        <div className="text-sm text-gray-500">
          {loading
            ? "..."
            : `${tasks.length} ${tasks.length === 1 ? "item" : "items"}`}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading tasks...</p>
      ) : error ? (
        <div className="text-sm text-red-500">
          {error}
          <button
            onClick={loadTasks}
            className="ml-2 text-blue-600 hover:underline"
          >
            Retry
          </button>
        </div>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-gray-500">No tasks yet. Create one above!</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task._id}
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
                  onClick={() => handleDelete(task._id)}
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
