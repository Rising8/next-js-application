// Lists all checklist items

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function ChecklistItemsPage() {
    const [items, setItems] = useState([]);
    const [error, setError] = useState("");

    // Fetch all checklist items
    const fetchChecklistItems = async () => {
        try {
            const res = await api.get("/checklist-items"); 
            setItems(res.data.data || res.data);
            setError("");
        } catch (err) {
            setError(err.message || "Unable to fetch checklist items.");
        }
    };

    useEffect(() => {
        fetchChecklistItems();
    }, []);

    // Delete an item
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this checklist item?")) return;
        try {
            await api.delete(`/checklist-items/${id}`);
            setItems((prev) => prev.filter((c) => c.id !== id));
        } catch (err) {
            setError(err.message || "Unable to delete item.");
        }
    };

    return (
        <div className="p-6 projects-wrapper">
            <h1 className="text-2xl font-bold mb-4 page-title">Checklist Items</h1>

            {/* Show errors */}
            {error && (
                <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-red-700 error-box">
                    {error}
                </div>
            )}

            {/* Add button */}
            {/* <Link
                href="/checklist-items/new"
                className="mb-6 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 add-project-btn"
            >
                + Add Checklist Item
            </Link> */}

            {/* Checklist Item Cards */}
            <div className="border p-4 rounded shadow hover:shadow-md transition project-card flex flex-col">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="border p-4 mb-4 rounded shadow hover:shadow-md transition project-card"
                    >
                        {/* Label (Title) */}
                        <Link
                            href={`/checklist-items/${item.id}`}
                            className="font-semibold text-lg text-blue-600 hover:underline checklist-label"
                        >
                            {item.label}
                        </Link>

                        {/* Completed: 0 means no, 1 means yes*/}
                        <p className="text-sm text-gray-600 mb-2 project-description">
                            <strong style={{ color: "#39ff14" }}>Completed:</strong>{" "}
                            {item.completed ? "Yes" : "No"}
                        </p>

                        {/* Task ID */}
                        <p className="text-sm text-gray-600 mb-2 project-description break-all"
                            style={{ wordBreak: "break-word" }}
                        >
                            <strong style={{ color: "#39ff14" }}>Task ID:</strong> {item.task_id}
                        </p>

                        {/* View, Edit & Delete */}
                        {/* <div className="flex gap-2 task-actions">
                            <Link
                                href={`/checklist-items/${item.id}`}
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 neon-btn"
                            >
                                View
                            </Link>
                            <Link
                                href={`/checklist-items/${item.id}/edit`}
                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 edit-btn"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 delete-btn"
                            >
                                Delete
                            </button>
                        </div> */}
                    </div>
                ))}
            </div>
        </div>
    );
}
