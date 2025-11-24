// Lists all comment content
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function CommentsPage() {
    const [comments, setComments] = useState([]);
    const [error, setError] = useState("");

    // Fetch comments
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

    return (
        <div className="p-6 projects-wrapper">
            <h1 className="text-2xl font-bold mb-4 page-title">Comments</h1>

            {/* Error box */}
            {error && (
                <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-red-700 error-box">
                    {error}
                </div>
            )}

            <div className="border p-4 rounded shadow hover:shadow-md transition project-card flex flex-col">
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
                    </div>
                ))}
            </div>
        </div>
    );
}
