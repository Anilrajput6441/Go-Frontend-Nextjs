"use client";
import React from "react";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import {
  FaClipboardList,
  FaShareAlt,
  FaChartLine,
  FaTrophy,
  FaHome,
  FaFire,
} from "react-icons/fa";

const MenuItem = ({
  label,
  active,
  onClick,
  icon: Icon,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  icon: React.ComponentType<{ className?: string }>;
}) => (
  <div
    onClick={onClick}
    className={classNames(
      "px-4 py-3 rounded-md flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800",
      { "bg-gray-100 dark:bg-gray-800": active }
    )}
  >
    <div className="w-8 h-8 rounded-md bg-white/60 dark:bg-gray-700/60 flex items-center justify-center text-sm">
      <Icon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
    </div>
    <div className="text-sm font-medium">{label}</div>
  </div>
);

export default function Sidebar({
  selectedView,
  onViewChange,
}: {
  selectedView?: string;
  onViewChange?: (view: string) => void;
}) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const userInitial =
    user?.name?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "U";

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="w-72 p-6 border border-gray-200 dark:border-gray-800 bg-white rounded-2xl dark:bg-gray-800 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <Image
          src="/tasklogo-copy.png"
          alt="logo"
          width={1000}
          height={1000}
          className="w-auto h-auto object-contain"
        />
      </div>

      <div className="space-y-2">
        <MenuItem
          label="To-do"
          active={selectedView === "todo"}
          onClick={() => onViewChange?.("todo")}
          icon={FaClipboardList}
        />

        <MenuItem
          label="Analytics"
          active={selectedView === "analytics"}
          onClick={() => onViewChange?.("analytics")}
          icon={FaChartLine}
        />
      </div>

      <div className="mt-8">
        <h4 className="text-xs text-gray-400 uppercase mb-3">Lists</h4>
        <div className="space-y-3">
          <div className="px-3 py-2 rounded-md flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="flex items-center gap-3">
              <FaFire className="w-4 h-4 text-orange-500" />
              <div className="text-sm">Odama Website</div>
            </div>
            <div className="text-xs text-gray-400">2</div>
          </div>
          <div className="px-3 py-2 rounded-md flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="flex items-center gap-3">
              <FaHome className="w-4 h-4 text-blue-500" />
              <div className="text-sm">Personal Project</div>
            </div>
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

      {/* Login/Logout Section */}
      <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
        {isAuthenticated ? (
          <div className="space-y-3">
            {user && (
              <div
                onClick={() => router.push("/profile")}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {userInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {user.email}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/profile");
                  }}
                  className="text-gray-400 hover:text-indigo-600 transition-colors"
                  title="View Profile"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg text-sm font-medium transition-colors"
          >
            Login
          </button>
        )}
      </div>
    </aside>
  );
}
