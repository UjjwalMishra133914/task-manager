"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState("");

  // 🔥 STEP 3: get role from localStorage
  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole || "");
  }, []);

  // 🎯 Role-based menu
  const menu = [
    { name: "Dashboard", path: "/dashboard" },

    // 👑 Only admin
    ...(role === "admin"
      ? [{ name: "Projects", path: "/projects" }]
      : []),

    { name: "Tasks", path: "/tasks" },
  ];

  return (
    <aside className="w-64 h-[calc(100vh-64px)] bg-gray-900 text-white p-5">
      
      <h2 className="text-xl font-bold mb-8 text-blue-400">
        Task Manager
      </h2>

      <nav className="space-y-3">
        {menu.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block px-3 py-2 rounded transition ${
              pathname === item.path
                ? "bg-blue-600"
                : "hover:bg-gray-700"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

    </aside>
  );
}