// components/ProjectEditForm.js

"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ProjectEditForm({ projectId, project }) {
    const router = useRouter();

    const [form, setForm] = useState({
        name: project?.name || "",
        description: project?.description || "",
    });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await api.put(`/projects/${projectId}`, form);
            router.push(`/projects`); 
            router.refresh();
        } catch (err) {
            console.error("Update failed", err);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block font-medium">Project Name</label>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>

            <div>
                <label className="block font-medium">Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Save Changes
            </button>
        </form>
    );
}
