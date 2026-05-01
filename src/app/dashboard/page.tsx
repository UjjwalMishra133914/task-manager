"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Badge from "@/components/ui/Badge";
import useAuth from "@/hooks/useAuth";

type Task = {
  _id: string;
  title: string;
  status: "Pending" | "In Progress" | "Done";
};

export default function Dashboard() {
  useAuth(); // 🔐 protect route

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchDashboard(token);
      fetchTasks(token);
    }
  }, []);

  // 📊 Fetch stats
  const fetchDashboard = async (token: string) => {
    const res = await fetch("/api/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setStats(data);
  };

  // 📥 Fetch recent tasks
  const fetchTasks = async (token: string) => {
    const res = await fetch("/api/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    // show only latest 3 tasks
    setTasks(data.slice(0, 3));
    setLoading(false);
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6">
        
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          
          <div className="bg-white p-4 rounded shadow">
            <h3>Total Tasks</h3>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3>Completed</h3>
            <p className="text-2xl font-bold text-green-600">
              {stats.completed}
            </p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3>Pending</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </div>

        </div>

        {/* Tasks */}
        <div>
          <h2 className="font-bold mb-3">Recent Tasks</h2>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white p-4 rounded shadow flex justify-between"
                >
                  <span>{task.title}</span>
                  <Badge status={task.status} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}