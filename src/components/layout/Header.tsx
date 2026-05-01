"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setUser("U"); // later dynamic karenge
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <header className="bg-white shadow px-8 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">Task Manager</h1>

      <div className="flex items-center gap-6">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>

        {user ? (
          <>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              {user}
            </div>

            <button onClick={logout} className="text-red-500">
              Logout
            </button>
          </>
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