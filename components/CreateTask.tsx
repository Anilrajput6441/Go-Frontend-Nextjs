"use client";

import React, { useState } from "react";
import { aiCreateTask } from "@/services/aiTools";
import toast from "react-hot-toast";

export default function CreateTask({ onCreated }: { onCreated?: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event?: React.FormEvent) {
    event?.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await aiCreateTask(title, description);
      setTitle("");
      setDescription("");
      toast.success("Task created successfully!");
      onCreated?.();
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-2xl border border-gray-200 dark:border-gray-800 "
    >
      <div className="flex gap-3">
        <input
          className="flex-1 p-2 border rounded"
          placeholder="Task title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <select className="p-2 border rounded">
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      <textarea
        className="w-full mt-3 p-2 border rounded"
        placeholder="Description (optional)"
        rows={3}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Adding..." : "Add Task"}
        </button>
        <button
          type="button"
          onClick={() => {
            setTitle("");
            setDescription("");
          }}
          className="px-4 py-2 border rounded"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
