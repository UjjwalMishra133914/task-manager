"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import TaskCard from "@/components/TaskCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type Task = {
  _id: string;
  title: string;
  status: "Pending" | "In Progress" | "Done";
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [role, setRole] = useState("");
  const [newTask, setNewTask] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const r = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    setRole(r || "");

    if (token) {
      fetchTasks(token);
    }
  }, []);

  const fetchTasks = async (token: string) => {
    try {
      const res = await fetch("/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("TASKS:", data);

      if (!res.ok) return;

      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  const addTask = async () => {
    const token = localStorage.getItem("token");

    if (!newTask || !assignedTo || !token) return;

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: newTask,
        assignedTo,
      }),
    });

    const data = await res.json();
    console.log("CREATE:", data);

    setNewTask("");
    setAssignedTo("");
    setShowModal(false);

    fetchTasks(token);
  };

  const changeStatus = async (task: Task) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const statusFlow = ["Pending", "In Progress", "Done"] as const;
    const currentIndex = statusFlow.indexOf(task.status);
    const nextStatus = statusFlow[(currentIndex + 1) % 3];

    await fetch(`/api/tasks/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: nextStatus }),
    });

    fetchTasks(token);
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6">
        
        <div className="flex justify-between items-center mb-6">
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

        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              title={task.title}
              status={task.status}
              onStatusChange={() => changeStatus(task)}
            />
          ))}
        </div>

        {tasks.length === 0 && (
          <p className="text-gray-500 mt-4">No tasks found</p>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow w-96">
              <h2 className="text-lg font-bold mb-4">Create Task</h2>

              <Input
                placeholder="Task Title"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />

              <Input
                placeholder="Assign User ID"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              />

              <div className="flex gap-2 mt-4">
                <Button text="Add Task" onClick={addTask} />

                <button
                  onClick={() => setShowModal(false)}
                  className="border px-4 rounded"
                >
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