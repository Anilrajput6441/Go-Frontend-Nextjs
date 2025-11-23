"use client";
import React from "react";

export default function HeaderBar() {
  return (
    <header className="flex items-center justify-between p-6 bg-transparent">
      <div>
        <h1 className="text-2xl font-bold">Good Morning, Pristia!</h1>
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
