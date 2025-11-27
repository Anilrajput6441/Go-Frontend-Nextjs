"use client";

import { useEffect, useState } from "react";
import { getUser, updateUser, deleteUser } from "@/services/userService";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";

interface User {
  email: string;
  full_name: string;
  role?: string;
  password?: string;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState<User>({
    email: "",
    full_name: "",
    role: "",
    password: "",
    created_at: "",
  });

  /* Fetch profile on load */
  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getUser();
        setUser(data);
      } catch (err) {
        console.error("Failed to load profile", err);
        // router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  /* Update profile */
  async function handleSave() {
    setSaving(true);
    try {
      await updateUser(user);
      alert("Profile updated successfully");
    } catch {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  /* Delete account */
  async function handleDelete() {
    const ok = confirm(
      "This will permanently delete your account. Are you sure?"
    );
    if (!ok) return;

    try {
      await deleteUser();
      localStorage.clear(); // remove tokens
      router.push("/login");
    } catch {
      alert("Failed to delete account");
    }
  }

  if (loading) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <AuthGuard>
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
            title="Go back to dashboard"
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
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-sm text-gray-500">
            Manage your account information
          </p>
        </div>

        {/* Account Info */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border p-6">
          <h2 className="font-medium mb-4">Account Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>

            <div>
              <p className="text-gray-500">Role</p>
              <p className="font-medium capitalize">{user?.role || "user"}</p>
            </div>

            <div>
              <p className="text-gray-500">Joined</p>
              <p className="font-medium">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>

        {/* Edit Profile */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border p-6">
          <h2 className="font-medium mb-1">Personal Details</h2>
          <p className="text-sm text-gray-500 mb-4">
            Update your name information
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Full Name
              </label>
              <input
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={user.full_name}
                onChange={(e) =>
                  setUser({ ...user, full_name: e.target.value })
                }
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </section>

        {/* Security Settings */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border p-6">
          <h2 className="font-medium mb-1">Security Settings</h2>
          <p className="text-sm text-gray-500 mb-4">
            Manage your account security and password
          </p>

          <button
            onClick={() => router.push("/profile/security")}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Change Password
          </button>
        </section>

        {/* Danger Zone */}
        <section className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-medium text-red-700">Danger Zone</h2>
          <p className="text-sm text-red-600 mt-1">
            Deleting your account is permanent.
          </p>

          <button
            onClick={handleDelete}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
          >
            Delete account
          </button>
        </section>
      </div>
    </AuthGuard>
  );
}
