// components/ProjectEditForm.js

"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ProjectEditForm({ projectId }) {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        description: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await api.get(`/projects/${projectId}`);
                const data = res.data.data || res.data;

                setForm({
                    name: data.name || "",
                    description: data.description || "",
                });
            } catch (err) {
                setError(err.message || "Error loading project");
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await api.put(`/projects/${projectId}`, form);

            router.push(`/projects`);
            router.refresh();
        } catch (err) {
            console.error("Update failed", err);
            setError(
                err.response?.data?.message ||
                err.message ||
                "Error updating project"
            );
        }
    }

    if (loading) return <p>Loading project...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded border p-4 shadow-sm neon-form"
        >
            {/* Project Name */}
            <div className="flex flex-col gap-1 mb-4">
                <label className="text-sm font-medium text-gray-700">
                    Project Name
                </label>
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 input neon-input"
                    required
                />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1 mb-4">
                <label className="text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                    rows="3"
                    className="rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 textarea neon-textarea"
                />
            </div>

            <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 neon-btn"
            >
                Update Project
            </button>
        </form>
    );
}
