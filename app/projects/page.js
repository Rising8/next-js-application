// lists projects 

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [form, setForm] = useState({ name: "", description: "" });
    const [editing, setEditing] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");

    const fetchProjects = (message = "") => {
        return api
            .get("/projects")
            .then((res) => {
                setProjects(res.data.data || res.data);
                if (message) {
                    setSuccess(message);
                }
                setError(null);
            })
            .catch((err) => {
                setError(err.message);
                setSuccess("");
            });
    };

    useEffect(() => {
        fetchProjects("Projects loaded successfully.");
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formMethod = editing ? api.put : api.post;
        const actionLabel = editing ? "updated" : "created";
        const url = editing ? `/projects/${editing}` : "/projects";

        formMethod(url, form)
            .then(() => {
                return fetchProjects(`Project ${actionLabel} successfully.`);
            })
            .then(() => {
                setForm({ name: "", description: "" });
                setEditing(null);
            })
            .catch((err) => {
                setError(err.message);
                setSuccess("");
            });
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        try {
            await api.delete(`/projects/${id}`);
            setProjects((prev) => prev.filter((project) => project.id !== id));
            await fetchProjects("Project deleted successfully.");
            await wait(200);
        } catch (err) {
            setError(err.message);
            setSuccess("");
        }
    };

    const handleEdit = (project) => {
        setForm({ name: project.name, description: project.description });
        setEditing(project.id);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Projects</h1>
            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <p className="font-semibold">
                        Unable to complete the action
                    </p>
                    <p>{error}</p>
                </div>
            )}
            {!error && success && (
                <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                    <p className="font-semibold">Success</p>
                    <p>{success}</p>
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="mb-6 space-y-4 rounded-lg border bg-white p-4 shadow-sm"
            >
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Project Name
                    </label>
                    <input
                        type="text"
                        placeholder="Enter a project name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                        className="rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        placeholder="Describe the project (optional)"
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                        className="rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        rows="3"
                    />
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        type="submit"
                        className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                    >
                        {editing ? "Update Project" : "Add Project"}
                    </button>
                    {editing && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditing(null);
                                setForm({ name: "", description: "" });
                            }}
                            className="rounded bg-gray-400 px-4 py-2 font-semibold text-white hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="border p-4 rounded shadow hover:shadow-md transition"
                    >
                        <Link
                            href={`/projects/${project.id}`}
                            className="font-semibold text-lg text-blue-600 hover:underline"
                        >
                            {project.name}
                        </Link>
                        <p className="text-sm text-gray-600 mb-2">
                            {project.description || "No description"}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(project)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(project.id)}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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
