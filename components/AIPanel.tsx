"use client";

import React, { useState } from "react";
import AIChat from "./AIChat"; // re-use previous full screen chat for right column or make a lighter version

export default function AIPanel({
  collapsed,
  onClose,
}: {
  collapsed?: boolean;
  onClose?: () => void;
}) {
  if (collapsed)
    return (
      <div className="w-96 p-4 border-l bg-white dark:bg-gray-800 hidden md:block">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">AI Assist ✨</h3>
          <button onClick={onClose} className="text-sm text-gray-500">
            Close
          </button>
        </div>
      </div>
    );

  return (
    <aside className="w-96 p-4 border-l bg-white dark:bg-gray-800 hidden md:block">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">AI Assist ✨</h3>
        <div className="text-sm text-gray-400">Knowledge, answers, ideas</div>
      </div>

      {/* show reference screenshot */}
      <div className="mb-4">
        <img
          src={"/mnt/data/Screenshot 2025-11-23 at 1.52.42 PM.png"}
          alt="reference"
          className="w-full rounded-md shadow"
        />
      </div>

      <div className="h-[60vh]">
        {/* embed a compact chat UI component */}
        <AIChat />
      </div>
    </aside>
  );
}
