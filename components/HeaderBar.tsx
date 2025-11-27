"use client";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function HeaderBar() {
  const { user } = useAuth();
  const userName = user?.name || "User";

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header className="flex items-center justify-between p-6 bg-white border border-gray-200 dark:border-gray-800 rounded-2xl">
      <div>
        <h1 className="text-2xl font-bold">
          {getGreeting()}, {userName}!
        </h1>
        <p className="text-sm text-gray-500">What do you plan to do today?</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-white/60 px-3 py-2 rounded-lg shadow-sm">
          <img src="/favicon.ico" alt="org" className="w-7 h-7 rounded-full" />
          <div>
            <div className="text-sm font-medium">Odama Studio</div>
            <div className="text-xs text-gray-400">1,354 members</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-3 py-1 bg-gray-100 rounded-md text-sm">
            Focus Mode
          </button>
          <button className="px-3 py-1 bg-black text-white rounded-md text-sm">
            AI Assist
          </button>
        </div>
      </div>
    </header>
  );
}
