"use client";
import React from "react";
import classNames from "classnames";

const MenuItem = ({ label, active }: { label: string; active?: boolean }) => (
  <div
    className={classNames(
      "px-4 py-3 rounded-md flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800",
      { "bg-gray-100 dark:bg-gray-800": active }
    )}
  >
    <div className="w-8 h-8 rounded-md bg-white/60 flex items-center justify-center text-sm">
      🗂
    </div>
    <div className="text-sm font-medium">{label}</div>
  </div>
);

export default function Sidebar() {
  return (
    <aside className="w-72 p-6 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
          B
        </div>
        <div>
          <div className="text-lg font-bold">BetterTasks</div>
          <div className="text-xs text-gray-500">Personal workspace</div>
        </div>
      </div>

      <div className="space-y-2">
        <MenuItem label="To-do" active />
        <MenuItem label="Share My Impact" />
        <MenuItem label="Analytics" />
        <MenuItem label="Leaderboard" />
      </div>

      <div className="mt-8">
        <h4 className="text-xs text-gray-400 uppercase mb-3">Lists</h4>
        <div className="space-y-3">
          <div className="px-3 py-2 rounded-md flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="flex items-center gap-3">
              <div className="text-sm">🔥 Odama Website</div>
            </div>
            <div className="text-xs text-gray-400">2</div>
          </div>
          <div className="px-3 py-2 rounded-md flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="text-sm">🏠 Personal Project</div>
            <div className="text-xs text-gray-400">5</div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-3 rounded-lg">
          Upgrade plan
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
        <div>Light</div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-yellow-300" />
          <div className="w-6 h-6 rounded-full bg-gray-800" />
        </div>
      </div>
    </aside>
  );
}
