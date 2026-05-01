"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ProjectCard from "@/components/ProjectCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]); // ✅ NEW
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]); // ✅ NEW

  const [newProject, setNewProject] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const r = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    setRole(r || "");

    if (token) {
      fetchProjects(token);

      if (r === "admin") {
        fetchUsers(token); // ✅ load members
      }
    }
  }, []);

  // 📁 Fetch Projects
  const fetchProjects = async (token: string) => {
    try {
      const res = await fetch("/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 👤 Fetch Users (ALL MEMBERS)
  const fetchUsers = async (token: string) => {
    try {
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ➕ Create Project
  const addProject = async () => {
    if (!newProject) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newProject,
          members: selectedMembers, // ✅ IMPORTANT
        }),
      });

      const data = await res.json();

      setProjects([...projects, data]);

      // reset
      setNewProject("");
      setSelectedMembers([]);
      setShowModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Projects</h1>

          {role === "admin" && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              + New Project
            </button>
          )}
        </div>

        {loading && <p>Loading...</p>}

        <div className="grid grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project._id} name={project.name} />
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded w-96">
              <h2 className="font-bold mb-4">Create Project</h2>

              <Input
                placeholder="Project Name"
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
              />

              {/* ✅ MULTI USER SELECT */}
              <select
                multiple
                className="w-full border p-2 mt-2"
                onChange={(e) => {
                  const values = Array.from(
                    e.target.selectedOptions
                  ).map((opt) => opt.value);

                  setSelectedMembers(values);
                }}
              >
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name || u.email}
                  </option>
                ))}
              </select>

              <div className="flex gap-2 mt-4">
                <Button text="Create" onClick={addProject} />

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