"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { changePassword } from "@/services/userService";

export default function SecurityPage() {
  const router = useRouter();
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!oldPassword || !newPassword) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);
    try {
      await changePassword({ oldPassword, newPassword });
      alert("Password changed successfully");
      setOld("");
      setNew("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to change password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/profile")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          title="Go back to profile"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium">Back to Profile</span>
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-semibold">Security</h1>
        <p className="text-sm text-gray-500">Change your account password</p>
      </div>

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 space-y-4">
        <div>
          <label className="text-sm text-gray-500">Old Password</label>
          <input
            type="password"
            className="w-full mt-1 border rounded px-3 py-2"
            value={oldPassword}
            onChange={(e) => setOld(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">New Password</label>
          <input
            type="password"
            className="w-full mt-1 border rounded px-3 py-2"
            value={newPassword}
            onChange={(e) => setNew(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </div>
    </div>
  );
}
