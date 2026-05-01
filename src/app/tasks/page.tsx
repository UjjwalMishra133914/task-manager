"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type Task = {
  _id: string;
  title: string;
  status: "Pending" | "In Progress" | "Done";
  assignedTo?: {
    name: string;
    email: string;
  };
  project?: {
    name: string;
  };
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  const [role, setRole] = useState("");
  const [newTask, setNewTask] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [projectId, setProjectId] = useState("");

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const r = localStorage.getItem("role");

    setRole(r || "");

    if (token) {
      fetchTasks(token);
      fetchProjects(token);
    }
  }, []);

  // ✅ Fetch Tasks (SAFE)
  const fetchTasks = async (token: string) => {
    try {
      const res = await fetch("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok || !Array.isArray(data)) {
        console.log("TASK ERROR:", data);
        setTasks([]);
        return;
      }

      setTasks(data);
    } catch (err) {
      console.log(err);
      setTasks([]);
    }
  };

  // ✅ Fetch Projects (SAFE)
  const fetchProjects = async (token: string) => {
    try {
      const res = await fetch("/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        setProjects([]);
      }
    } catch {
      setProjects([]);
    }
  };

  // ✅ Fetch Users (ONLY AFTER PROJECT SELECT)
  const fetchUsers = async (token: string, pid: string) => {
    try {
      const res = await fetch(`/api/users?projectId=${pid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      console.log("USERS:", data); 

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch {
      setUsers([]);
    }
  };

  // ✅ Create Task
  const addTask = async () => {
    const token = localStorage.getItem("token");

    if (!newTask || !assignedTo || !projectId) {
      alert("Fill all fields");
      return;
    }

    await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: newTask,
        assignedTo,
        projectId,
      }),
    });

    setNewTask("");
    setAssignedTo("");
    setProjectId("");
    setUsers([]);
    setShowModal(false);

    fetchTasks(token!);
  };

  // ✅ Update Status (FIXED API)
  const changeStatus = async (task: Task) => {
    const token = localStorage.getItem("token");

    const flow = ["Pending", "In Progress", "Done"] as const;
    const next = flow[(flow.indexOf(task.status) + 1) % 3];

    await fetch(`/api/tasks/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: next }),
    });

    fetchTasks(token!);
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Tasks</h1>

          {role === "admin" && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              + New Task
            </button>
          )}
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {Array.isArray(tasks) &&
            tasks.map((task) => (
              <div key={task._id} className="border p-3 rounded">
                <h3 className="font-semibold">{task.title}</h3>

                <p className="text-sm text-gray-600">
                  Assigned To: {task.assignedTo?.name || "N/A"}
                </p>

                <p className="text-sm text-gray-600">
                  Project: {task.project?.name || "N/A"}
                </p>

                <p>Status: {task.status}</p>

                <button
                  onClick={() => changeStatus(task)}
                  className="mt-2 bg-gray-200 px-2 py-1 rounded"
                >
                  Change Status
                </button>
              </div>
            ))}
        </div>

        {tasks.length === 0 && (
          <p className="text-gray-500 mt-4">No tasks found</p>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded w-96">
              <h2 className="font-bold mb-4">Create Task</h2>

              <Input
                placeholder="Task Title"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />

              {/* Project */}
              <select
                value={projectId}
                onChange={(e) => {
                  const id = e.target.value;
                  setProjectId(id);

                  if (id) {
                    fetchUsers(localStorage.getItem("token")!, id);
                  }
                }}
                className="w-full border p-2 mt-2"
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>

              {/* Users */}
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full border p-2 mt-2"
              >
                <option value="">Select User</option>
                {Array.isArray(users) &&
                  users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name || u.email}
                    </option>
                  ))}
              </select>

              <div className="flex gap-2 mt-4">
                <Button text="Create" onClick={addTask} />
                <button onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}