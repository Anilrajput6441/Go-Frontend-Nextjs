"use client";

import React from "react";
import AIChat from "./AIChat"; // re-use previous full screen chat for right column or make a lighter version
import { Task } from "@/types/task";

export default function AIPanel({
  collapsed,
  onClose,
  onAIAction,
  tasks = [],
}: {
  collapsed?: boolean;
  onClose?: () => void;
  onAIAction?: () => void;
  tasks?: Task[];
}) {
  if (collapsed)
    return (
      <div className="w-96 p-4 bg-white rounded-2xl border border-gray-200 dark:border-gray-800 h-full hidden md:flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">AI Assist ✨</h3>
          <button onClick={onClose} className="text-sm text-gray-500">
            Close
          </button>
        </div>
      </div>
    );

  return (
    <aside className="w-[24vw] h-full bg-white rounded-2xl border border-gray-200 dark:border-gray-800 hidden md:flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-4 flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold">AI Assist ✨</h3>
        <div className="text-sm text-gray-400">Knowledge, answers, ideas</div>
      </div>

      {/* Reference screenshot removed - fix path if needed */}
      {/* <div className="mb-4">
        <img
          src="/path/to/screenshot.png"
          alt="reference"
          className="w-full rounded-md shadow"
        />
      </div> */}

      <div className="flex-1 min-h-0 overflow-hidden p-4">
        {/* embed a compact chat UI component */}
        <AIChat onAIAction={onAIAction} tasks={tasks} />
      </div>
    </aside>
  );
}
