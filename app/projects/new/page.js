// app/projects/new/page.js
// creating a new project page
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function NewProjectPage() {
    const [form, setForm] = useState({ name: "", description: "" });
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/projects", form);
            router.push("/projects"); 
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="p-6 projects-wrapper">
            <h1 className="text-2xl font-bold mb-4 page-title">Add New Project</h1>
            {error && <p className="error-box text-red-600 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4 rounded border p-4 shadow-sm neon-form">
                {/* Project Name */}
                <div className="flex flex-col gap-1 mb-4">
                    <label className="text-sm font-medium text-gray-700">Project Name</label>
                    <div className="control">
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 input neon-input"
                            required
                        />
                    </div>
                </div>
                {/* Project Description */}
                <div className="flex flex-col gap-1 mb-4">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <div className="control">
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 textarea neon-textarea"
                            rows="3"
                        />
                    </div>
                </div>       

                <div className="field is-grouped is-justify-content-center">
                    <div className="control">
                        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 button neon-btn">
                            Add Project
                        </button>
                    </div>
                </div>         
            </form>
        </div>
    );
}
