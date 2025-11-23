"use client";

import { useState } from "react";
import { login } from "@/services/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await login(email, password);
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Invalid login");
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={submit}
        className="w-80 bg-white shadow p-6 rounded space-y-4"
      >
        <h1 className="text-xl font-bold">Login</h1>

        <input
          className="w-full p-2 border rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 border rounded"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
