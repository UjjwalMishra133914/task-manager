"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProjectCard from "@/components/ProjectCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function Projects() {
    const [projects, setProjects] = useState<string[]>([
        "Website Redesign",
        "Mobile App",
    ]);

    const [newProject, setNewProject] = useState("");
    const [showModal, setShowModal] = useState(false);

    const role = localStorage.getItem("role");

    const addProject = () => {
        if (!newProject) return;

        setProjects([...projects, newProject]);
        setNewProject("");
        setShowModal(false);
    };

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Projects</h1>

                    {role === "admin" && (
                        <button>+ New Project</button>
                    )}
                </div>

                {/* Project Grid */}
                <div className="grid grid-cols-3 gap-4">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} name={project} />
                    ))}
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                        <div className="bg-white p-6 rounded shadow w-96">
                            <h2 className="text-lg font-bold mb-4">
                                Create Project
                            </h2>

                            <Input
                                placeholder="Project Name"
                                onChange={(e) => setNewProject(e.target.value)}
                            />

                            <div className="flex gap-2 mt-4">
                                <Button text="Create" onClick={addProject} />
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