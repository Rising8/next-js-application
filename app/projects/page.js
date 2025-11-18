"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState("");

    // Fetch all projects
    const fetchProjects = async () => {
        try {
            const res = await api.get("/projects");
            setProjects(res.data.data || res.data); 
            setError("");
        } catch (err) {
            setError(err.message || "Unable to fetch projects.");
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // Delete a project
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        try {
            await api.delete(`/projects/${id}`);
            setProjects((prev) => prev.filter((project) => project.id !== id));
        } catch (err) {
            setError(err.message || "Unable to delete project.");
        }
    };

    return (
        <div className="p-6 projects-wrapper">
            <h1 className="text-2xl font-bold mb-4 page-title">Projects</h1>

            {/* Show errors */}
            {error && (
                <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-red-700 error-box">
                    {error}
                </div>
            )}

            {/* Add Project Button */}
            <Link
                href="/projects/new"
                className="mb-6 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 add-project-btn"
            >
                + Add Project
            </Link>

            {/* Project List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 project-grid">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="border p-4 rounded shadow hover:shadow-md transition project-card"
                    >
                        <Link
                            href={`/projects/${project.id}`}
                            className="font-semibold text-lg text-blue-600 hover:underline project-title"
                        >
                            {project.name}
                        </Link>
                        <p className="text-sm text-gray-600 mb-2 project-description">
                            {project.description || "No description"}
                        </p>

                        {/* Edit & Delete */}
                        <div className="flex gap-2 project-actions">
                            <Link
                                href={`/projects/${project.id}/edit`}
                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 edit-btn"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(project.id)}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 delete-btn"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
