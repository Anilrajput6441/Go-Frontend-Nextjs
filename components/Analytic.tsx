"use client";

import React, { useCallback, useMemo, useState } from "react";
import type { Task } from "@/types/task";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  HiOutlineClipboardDocumentList,
  HiOutlineCheckCircle,
  HiOutlineCog6Tooth,
  HiOutlineClock,
  HiOutlineCalendar,
} from "react-icons/hi2";

interface AnalyticProps {
  tasks: Task[];
}

type DateFilter = "today" | "last7days" | "thismonth" | "custom";

interface DateRange {
  start: Date;
  end: Date;
}

const COLORS = {
  todo: "#94a3b8",
  "in-progress": "#fbbf24",
  done: "#10b981",
};

// Helper to normalize status (handle both in-progress and in_progress)
function normalizeStatus(status: string): string {
  if (status === "in_progress") return "in-progress";
  return status;
}

export default function Analytic({ tasks }: AnalyticProps) {
  const [dateFilter, setDateFilter] = useState<DateFilter>("last7days");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

  // Calculate date range based on filter
  const dateRange = useMemo((): DateRange => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    switch (dateFilter) {
      case "today":
        return {
          start: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            0,
            0,
            0,
            0
          ),
          end: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            23,
            59,
            59,
            999
          ),
        };
      case "last7days":
        start.setDate(today.getDate() - 6);
        return { start, end: today };
      case "thismonth":
        start.setDate(1);
        return { start, end: today };
      case "custom":
        if (customStartDate && customEndDate) {
          const customStart = new Date(customStartDate);
          customStart.setHours(0, 0, 0, 0);
          const customEnd = new Date(customEndDate);
          customEnd.setHours(23, 59, 59, 999);
          return { start: customStart, end: customEnd };
        }
        return { start, end: today };
      default:
        return { start, end: today };
    }
  }, [dateFilter, customStartDate, customEndDate]);

  // Helper to get date from task (handles both camelCase and snake_case)
  const getTaskDate = useCallback(
    (task: Task, field: "created" | "updated"): string | undefined => {
      const taskWithSnakeCase = task as Task & {
        created_at?: string;
        updated_at?: string;
      };
      if (field === "created") {
        return taskWithSnakeCase.created_at || task.createdAt;
      } else {
        return taskWithSnakeCase.updated_at || task.updatedAt;
      }
    },
    []
  );

  // Filter tasks by date range - moved into useMemo to avoid dependency issues
  const filteredTasks = useMemo(() => {
    const filterTasksByDate = (
      tasksToFilter: Task[],
      dateRangeToUse: DateRange
    ): Task[] => {
      const getDateString = (date: Date): string => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}`;
      };

      const parseDateString = (dateStr: string | undefined): string | null => {
        if (!dateStr) return null;
        try {
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) return null;
          return getDateString(date);
        } catch {
          return null;
        }
      };

      const startStr = getDateString(dateRangeToUse.start);
      const endStr = getDateString(dateRangeToUse.end);

      // Filter tasks by date range - strict filtering (no fallbacks)
      return tasksToFilter.filter((task) => {
        // Get dates using helper (handles both camelCase and snake_case)
        const createdStr = parseDateString(getTaskDate(task, "created"));
        const updatedStr = parseDateString(getTaskDate(task, "updated"));

        // If task has no dates, exclude it from date filtering
        if (!createdStr && !updatedStr) {
          return false;
        }

        // Check if task was created or updated within the date range
        const createdInRange =
          createdStr && createdStr >= startStr && createdStr <= endStr;
        const updatedInRange =
          updatedStr && updatedStr >= startStr && updatedStr <= endStr;

        return createdInRange || updatedInRange;
      });
    };

    return filterTasksByDate(tasks, dateRange);
  }, [tasks, dateRange, getTaskDate]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(
      (t) => normalizeStatus(t.status) === "done"
    ).length;
    // Handle both "in-progress" and "in_progress" formats
    const inProgress = filteredTasks.filter(
      (t) => normalizeStatus(t.status) === "in-progress"
    ).length;
    const todo = filteredTasks.filter(
      (t) => normalizeStatus(t.status) === "todo"
    ).length;
    const remaining = todo + inProgress;

    // Overall progress (completed + half of in-progress)
    const overallProgress =
      total > 0 ? ((completed + inProgress * 0.5) / total) * 100 : 0;

    // Tasks completed this month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const completedThisMonth = filteredTasks.filter((task) => {
      const updatedAt = getTaskDate(task, "updated");
      if (normalizeStatus(task.status) !== "done" || !updatedAt) return false;
      const updatedDate = new Date(updatedAt);
      return (
        updatedDate.getMonth() === currentMonth &&
        updatedDate.getFullYear() === currentYear
      );
    }).length;

    // Efficiency (completion rate)
    const efficiency = total > 0 ? (completed / total) * 100 : 0;

    // Calculate daily completion trends for the last 7 days
    const dailyCompletions = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const count = filteredTasks.filter((task) => {
        const updatedAt = getTaskDate(task, "updated");
        if (normalizeStatus(task.status) !== "done" || !updatedAt) return false;
        const taskDate = new Date(updatedAt);
        return (
          taskDate.getDate() === date.getDate() &&
          taskDate.getMonth() === date.getMonth() &&
          taskDate.getFullYear() === date.getFullYear()
        );
      }).length;

      return { date: dateStr, completed: count };
    });

    // Weekly trends - Show current task distribution by status
    // If tasks have dates, show by date. Otherwise, show current status counts.
    const weeklyTrends = Array.from({ length: 4 }, (_, weekIndex) => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Calculate week boundaries
      const weekEndDaysAgo = weekIndex * 7;
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() - weekEndDaysAgo);
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() - 6);

      // Helper functions
      const getDateString = (date: Date): string => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}`;
      };

      const parseDateString = (dateStr: string | undefined): string | null => {
        if (!dateStr) return null;
        try {
          const date = new Date(dateStr);
          return isNaN(date.getTime()) ? null : getDateString(date);
        } catch {
          return null;
        }
      };

      const weekStartStr = getDateString(weekStart);
      const weekEndStr = getDateString(weekEnd);

      let weekCompleted = 0;
      let weekInProgress = 0;
      let weekCreated = 0;

      filteredTasks.forEach((task) => {
        // Get dates using helper (handles both formats)
        const updatedAt = getTaskDate(task, "updated");
        const createdAt = getTaskDate(task, "created");

        // Try to use dates if available
        if (updatedAt || createdAt) {
          // Check completed by updatedAt
          if (normalizeStatus(task.status) === "done" && updatedAt) {
            const dateStr = parseDateString(updatedAt);
            if (dateStr && dateStr >= weekStartStr && dateStr <= weekEndStr) {
              weekCompleted++;
            }
          }
          // Check in-progress by updatedAt
          else if (
            normalizeStatus(task.status) === "in-progress" &&
            updatedAt
          ) {
            const dateStr = parseDateString(updatedAt);
            if (dateStr && dateStr >= weekStartStr && dateStr <= weekEndStr) {
              weekInProgress++;
            }
          }
          // Check created by createdAt
          if (createdAt) {
            const dateStr = parseDateString(createdAt);
            if (dateStr && dateStr >= weekStartStr && dateStr <= weekEndStr) {
              weekCreated++;
            }
          }
        }
      });

      // Format labels
      const startLabel = weekStart.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const endLabel = weekEnd.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      return {
        week: `Week ${weekIndex + 1}`,
        weekRange: `${startLabel} - ${endLabel}`,
        completed: weekCompleted,
        inProgress: weekInProgress,
        created: weekCreated,
      };
    }).reverse();

    return {
      total,
      completed,
      inProgress,
      todo,
      remaining,
      completedThisMonth,
      efficiency: Math.round(efficiency * 10) / 10,
      overallProgress: Math.round(overallProgress * 10) / 10,
      dailyCompletions,
      weeklyTrends,
    };
  }, [filteredTasks, getTaskDate]);

  // Pie chart data - handle both status formats
  const statusData = [
    { name: "Done", value: metrics.completed, color: COLORS.done },
    {
      name: "In Progress",
      value: metrics.inProgress,
      color: COLORS["in-progress"],
    },
    { name: "Todo", value: metrics.todo, color: COLORS.todo },
  ].filter((item) => item.value > 0); // Only show statuses that have tasks

  return (
    <div className="flex-1 pl-5 flex flex-col min-w-0 overflow-y-auto">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Track your productivity and task completion
            </p>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg border p-2">
              <button
                onClick={() => setDateFilter("today")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  dateFilter === "today"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setDateFilter("last7days")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  dateFilter === "last7days"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setDateFilter("thismonth")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  dateFilter === "thismonth"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setDateFilter("custom")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  dateFilter === "custom"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Custom Range
              </button>
            </div>
          </div>
        </div>

        {/* Custom Date Range Inputs */}
        {dateFilter === "custom" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border p-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              {customStartDate && customEndDate && (
                <div className="ml-auto">
                  <p className="text-sm text-gray-500">
                    Showing tasks from{" "}
                    {new Date(customStartDate).toLocaleDateString()} to{" "}
                    {new Date(customEndDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Tasks</p>
                <p className="text-3xl font-bold mt-2">{metrics.total}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <HiOutlineClipboardDocumentList className="w-6 h-6 text-black dark:text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-3xl font-bold mt-2">{metrics.completed}</p>
                {metrics.total > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {((metrics.completed / metrics.total) * 100).toFixed(1)}%
                  </p>
                )}
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <HiOutlineCheckCircle className="w-6 h-6 text-black dark:text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-3xl font-bold mt-2">{metrics.inProgress}</p>
                {metrics.total > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {((metrics.inProgress / metrics.total) * 100).toFixed(1)}%
                  </p>
                )}
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <HiOutlineCog6Tooth className="w-6 h-6 text-black dark:text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Remaining</p>
                <p className="text-3xl font-bold mt-2">{metrics.remaining}</p>
                {metrics.total > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {((metrics.remaining / metrics.total) * 100).toFixed(1)}%
                  </p>
                )}
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <HiOutlineClock className="w-6 h-6 text-black dark:text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-3xl font-bold mt-2">
                  {metrics.completedThisMonth}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <HiOutlineCalendar className="w-6 h-6 text-black dark:text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overall Progress Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
            <h2 className="text-xl font-semibold mb-4">Overall Progress</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    Overall Progress (with in-progress tasks)
                  </span>
                  <span className="text-2xl font-bold">
                    {metrics.overallProgress.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${metrics.overallProgress}%` }}
                  />
                </div>
              </div>
              <div className="text-xs text-gray-500 pt-2">
                Calculated as: (Completed + 50% of In Progress) / Total
              </div>
            </div>
          </div>

          {/* Completion Rate Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
            <h2 className="text-xl font-semibold mb-4">Completion Rate</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Tasks Completed</span>
                  <span className="text-2xl font-bold">
                    {metrics.efficiency}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${metrics.efficiency}%` }}
                  />
                </div>
              </div>
              <div className="text-xs text-gray-500 pt-2">
                {metrics.completed} out of {metrics.total} tasks completed
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
            <h2 className="text-xl font-semibold mb-4">
              Task Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Completions Line Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
            <h2 className="text-xl font-semibold mb-4">
              Daily Completions (Last 7 Days)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.dailyCompletions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Trends Bar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">
              Weekly Trends (Last 4 Weeks)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.weeklyTrends || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="weekRange"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="inProgress" fill="#fbbf24" name="In Progress" />
                <Bar dataKey="created" fill="#3b82f6" name="Created" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
          <h2 className="text-xl font-semibold mb-4">Status Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS.todo }}
                />
                <span className="font-medium">Todo</span>
              </div>
              <p className="text-2xl font-bold">{metrics.todo}</p>
              <p className="text-sm text-gray-500 mb-3">
                {metrics.total > 0
                  ? ((metrics.todo / metrics.total) * 100).toFixed(1)
                  : 0}
                % of total
              </p>
              {metrics.total > 0 && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gray-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(metrics.todo / metrics.total) * 100}%`,
                    }}
                  />
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS["in-progress"] }}
                />
                <span className="font-medium">In Progress</span>
              </div>
              <p className="text-2xl font-bold">{metrics.inProgress}</p>
              <p className="text-sm text-gray-500 mb-3">
                {metrics.total > 0
                  ? ((metrics.inProgress / metrics.total) * 100).toFixed(1)
                  : 0}
                % of total
              </p>
              {metrics.total > 0 && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(metrics.inProgress / metrics.total) * 100}%`,
                    }}
                  />
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS.done }}
                />
                <span className="font-medium">Done</span>
              </div>
              <p className="text-2xl font-bold">{metrics.completed}</p>
              <p className="text-sm text-gray-500 mb-3">
                {metrics.total > 0
                  ? ((metrics.completed / metrics.total) * 100).toFixed(1)
                  : 0}
                % of total
              </p>
              {metrics.total > 0 && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(metrics.completed / metrics.total) * 100}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
