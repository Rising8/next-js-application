// Creates a new task

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function NewTaskPage() {
    const [form, setForm] = useState({
        name: "",
        description: "",
        due_date: "",
        status: "to_do",
    });

    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/tasks", form);
            router.push("/tasks"); 
        } catch (err) {
            setError(err.message || "Error creating task");
        }
    };

    return (
        <div className="p-6 tasks-wrapper">
            <h1 className="text-2xl font-bold mb-4 page-title">Add New Task</h1>

            {error && <p className="error-box text-red-600 mb-2">{error}</p>}

            <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded border p-4 shadow-sm neon-form"
            >
                {/* Task Name */}
                <div className="flex flex-col gap-1 mb-4">
                    <label className="text-sm font-medium text-gray-700">Task Name</label>
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

                {/* Description */}
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

                {/* Due Date */}
                <div className="flex flex-col gap-1 mb-4">
                    <label className="text-sm font-medium text-gray-700">Due Date</label>
                    <div className="control">
                        <input
                            type="date"
                            value={form.due_date}
                            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                            className="rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 input neon-input"
                        />
                    </div>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1 mb-4">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className="control">
                        <select
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                            className="rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 select neon-input"
                        >
                            <option value="to_do">to_do</option>
                            <option value="in_progress">in_progress</option>
                            <option value="done">done</option>
                        </select>
                    </div>
                </div>

                {/* Submit */}
                <div className="field is-grouped is-justify-content-center">
                    <div className="control">
                        <button
                            type="submit"
                            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 button neon-btn"
                        >
                            Add Task
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
