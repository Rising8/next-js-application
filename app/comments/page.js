// Lists all comments content

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function CommentsPage() {
    const [comments, setComments] = useState([]);
    const [error, setError] = useState("");

    // Fetch all comments
    const fetchComments = async () => {
        try {
            const res = await api.get("/comments");
            setComments(res.data.data || res.data);
            setError("");
        } catch (err) {
            setError(err.message || "Unable to fetch comments.");
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    // Delete a comment
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;
        try {
            await api.delete(`/comments/${id}`);
            setComments((prev) => prev.filter((c) => c.id !== id));
        } catch (err) {
            setError(err.message || "Unable to delete comment.");
        }
    };

    return (
        <div className="p-6 projects-wrapper">
            <h1 className="text-2xl font-bold mb-4 page-title">Comments</h1>

            {/* Show errors */}
            {error && (
                <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-red-700 error-box">
                    {error}
                </div>
            )}

            {/* Add Comment Button */}
            <Link
                href="/comments/new"
                className="mb-6 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 add-project-btn"
            >
                + Add Comment
            </Link>

            {/* Comments List */}
            <div className="border mt-5 p-4 rounded shadow hover:shadow-md transition project-card flex flex-col">
                {comments.map((c) => (
                    <div
                        key={c.id}
                        className="border p-4 mb-4 rounded shadow hover:shadow-md transition project-card"
                    >
                        {/* Comment content */}
                        <p className="text-sm text-gray-600 mb-2 project-description">
                            <strong style={{ color: "#39ff14" }}>Content: </strong>{c.content}
                        </p>
                        {/* User */}
                        {c.user && (
                            <p className="text-sm text-gray-600 mb-2 project-description">
                                <strong style={{ color: "#39ff14" }}>User:</strong>{" "}
                                <span className="text-gray-300">{c.user.name}</span>
                            </p>
                        )}
                        {/* Workspace */}
                        {c.workspace && (
                            <p
                                className="text-sm text-gray-600 mb-2 project-description break-all"
                                style={{ wordBreak: "break-word" }}
                            >
                                <strong style={{ color: "#39ff14" }}>Workspace:</strong>{" "}
                                <span className="text-gray-300">{c.workspace.name}</span>
                            </p>
                        )}
                        {/* Commentable */}
                        {c.commentable && (
                            <p className="text-sm text-gray-600 mb-2 project-description break-all">
                                <strong style={{ color: "#39ff14" }}>Attached To: </strong>
                                <span className="text-gray-300">
                                    {c.commentable.type} — {c.commentable.id}
                                </span>
                            </p>
                        )}

                        {/* View, Edit & Delete */}
                        <div className="flex gap-2 task-actions">
                            <Link
                                href={`/comments/${c.id}`}
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 neon-btn"
                            >
                                View
                            </Link>
                            <Link
                                href={`/comments/${c.id}/edit`}
                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 edit-btn"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(c.id)}
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
