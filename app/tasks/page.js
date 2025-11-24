// Lists all tasks

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState("");

    // Fetch all tasks
    const fetchTasks = async () => {
        try {
            const res = await api.get("/tasks"); 
            setTasks(res.data.data || res.data);
            setError("");
        } catch (err) {
            setError(err.message || "Unable to fetch tasks.");
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Delete a task
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        try {
            await api.delete(`/tasks/${id}`);
            setTasks((prev) => prev.filter((task) => task.id !== id));
        } catch (err) {
            setError(err.message || "Unable to delete task.");
        }
    };

    return (
        <div className="p-6 projects-wrapper">
            <h1 className="text-2xl font-bold mb-4 page-title">Tasks</h1>

            {/* Show errors */}
            {error && (
                <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-red-700 error-box">
                    {error}
                </div>
            )}

            {/* Add Task Button */}
            <Link
                href="/tasks/new"
                className="mb-6 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 add-project-btn"
            >
                + Add Task
            </Link>

            {/* Task List */}
            <div className="border p-4 rounded shadow hover:shadow-md transition project-card flex flex-col">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="border p-4 mb-4 rounded shadow hover:shadow-md transition project-card"
                    >
                        {/* Title */}
                        <Link
                            href={`/tasks/${task.id}`}
                            className="font-semibold text-lg text-blue-600 hover:underline project-title"
                        >
                            {task.name}
                        {/* Description */}
                        </Link>
                        <p className="text-sm text-gray-600 mb-2 project-description">
                            {task.description || "No description"}
                        </p>
                        {/* Created */}
                        {task.created?.human && (
                            <p className="project-description text-sm text-gray-500 mb-2">
                                <strong style={{ color: "#39ff14" }}>Created:</strong> {task.created.human}
                            </p>
                        )}
                        {/* Due Date */}
                        {task.due_date && (
                            <p className=" project-description text-sm text-gray-500 mb-2">
                                <strong style={{ color: "#39ff14" }}>Due:</strong> {new Date(task.due_date).toLocaleDateString()}
                            </p>
                        )}
                        {/* Status */}
                        {task.status && (
                            <p className="project-description text-sm font-medium text-gray-700 mb-2">
                                <strong style={{ color: "#39ff14" }}>Status:</strong> {task.status}
                            </p>
                        )}

                        {/* View, Edit & Delete */}
                        <div className="flex gap-2 task-actions">
                            <Link
                                href={`/tasks/${task.id}`}
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 neon-btn"
                            >
                                View
                            </Link>
                            <Link
                                href={`/tasks/${task.id}/edit`}
                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 edit-btn"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(task.id)}
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
