"use client";

import React, { useState } from "react";
import { aiCreateTask } from "@/services/aiTools";

export default function CreateTask({ onCreated }: { onCreated?: () => void }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await aiCreateTask(title, desc);
      setTitle("");
      setDesc("");
      onCreated?.();
    } catch (err) {
      console.error(err);
      alert("Failed to create task");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white p-4 rounded-2xl border border-gray-200 dark:border-gray-800 "
    >
      <div className="flex gap-3">
        <input
          className="flex-1 p-2 border rounded"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
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
            setDesc("");
          }}
          className="px-4 py-2 border rounded"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
