"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const name = localStorage.getItem("name") || "";
    const email = localStorage.getItem("email") || "";
    const role = localStorage.getItem("role") || "";

    setUser({
      name,
      email,
      role,
    });
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // ✅ avatar letter safe
  const getInitial = () => {
    if (!user?.name) return "U";
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-white shadow px-8 py-4 flex justify-between items-center relative">
      <h1 className="text-xl font-bold text-blue-600">Task Manager</h1>

      <div className="flex items-center gap-6">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>

        {user ? (
          <div className="relative">
            {/* Avatar */}
            <div
              onClick={() => setOpen(!open)}
              className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer font-semibold"
            >
              {getInitial()}
            </div>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-lg z-50">
                <div className="p-3 border-b">
                  <p className="font-semibold">
                    {user.name || "No Name"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user.email || "No Email"}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {user.role || "No Role"}
                  </p>
                </div>

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}