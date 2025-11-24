// components/TaskEditForm.js
// renders a form for editing an existing task
// fetches data from api, manages state, handles inputs and submits updates to backend
//backend+logic for form
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function TaskEditForm({ taskId }) {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        description: "",
        due_date: "",
        status: "to_do",
    });
    const [projectId, setProjectId] = useState(""); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await api.get(`/tasks/${taskId}`);
                const data = res.data.data || res.data;

                setForm({
                    name: data.name || "",
                    description: data.description || "",
                    due_date: data.due_date || "",
                    status: data.status === "todo" ? "to_do" : data.status || "to_do",
                });
                setProjectId(data.project?.id || ""); 
            } catch (err) {
                setError(err.message || "Error loading task");
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [taskId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/tasks/${taskId}`, {
                name: form.name,
                description: form.description,
                due_date: form.due_date || null,
                status: form.status === "to_do" ? "todo" : form.status,
                project_id: projectId, 
            });

            router.push(`/tasks`);
            router.refresh();
        } catch (err) {
            console.error(err.response || err);
            setError(
                err.response?.data?.message || err.message || "Error updating task"
            );
        }
    };

    if (loading) return <p>Loading task...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded border p-4 shadow-sm neon-form"
        >
            {/* Task Name */}
            <div className="flex flex-col gap-1 mb-4">
                <label className="text-sm font-medium text-gray-700">Task Name</label>
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
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows="3"
                    className="rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 textarea neon-textarea"
                />
            </div>

            {/* Due Date */}
            <div className="flex flex-col gap-1 mb-4">
                <label className="text-sm font-medium text-gray-700">Due Date</label>
                <input
                    type="date"
                    value={form.due_date || ""}
                    onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                    className="rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 input select neon-input"
                />
            </div>

             {/* Status */}
            <div className="flex flex-col gap-1 mb-4">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 input select neon-input"
                >
                    <option value="to_do">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
            </div>

            <div className="field is-grouped is-justify-content-center">
                    <div className="control">
                        <button
                            type="submit"
                            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 button neon-btn"
                        >
                            Update Task
                        </button>
                    </div>
                </div>
        </form>
    );
}



