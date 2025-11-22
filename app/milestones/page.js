// Lists all milestones
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function MilestonesPage() {
    const [milestones, setMilestones] = useState([]);
    const [error, setError] = useState("");

    // Fetch milestones
    const fetchMilestones = async () => {
        try {
            const res = await api.get("/milestones");
            setMilestones(res.data.data || res.data);
            setError("");
        } catch (err) {
            setError(err.message || "Unable to fetch milestones.");
        }
    };

    useEffect(() => {
        fetchMilestones();
    }, []);

    return (
        <div className="p-6 projects-wrapper">
            <h1 className="text-2xl font-bold mb-4 page-title">Milestones</h1>

            {/* Error box */}
            {error && (
                <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-red-700 error-box">
                    {error}
                </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 project-grid">
                {milestones.map((m) => (
                    <div
                        key={m.id}
                        className="border p-4 rounded shadow hover:shadow-md transition project-card"
                    >
                        {/* Title */}
                        <Link
                            href={`/milestones/${m.id}`}
                            className="font-semibold text-lg text-blue-600 hover:underline checklist-label"
                        >
                            {m.title}
                        </Link>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-2 project-description">
                            <strong style= {{ color: "#39ff14"}}>Description: </strong>
                            {m.description || "No description"}
                        </p>

                        {/* Due date */}
                        {m.due_date && (
                            <p className="text-sm text-gray-500 mb-2 project-description">
                                <strong style={{ color: "#39ff14" }}>Due:</strong>{" "}
                                {new Date(m.due_date).toLocaleDateString()}
                            </p>
                        )}

                        {/* Completed - null = no */}
                        <p className="text-sm text-gray-600 mb-2 project-description flex items-center gap-1">
                            <strong style={{ color: "#39ff14" }}>Completed:</strong>
                            <span
                                className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    m.completed_at
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-700 text-white"
                                }`}
                            >
                                {m.completed_at ? "Yes" : "No"}
                            </span>
                        </p>

                        {/* Workspace */}
                        {m.workspace && (
                            <p
                                className="text-sm text-gray-600 mb-2 project-description break-all"
                                style={{ wordBreak: "break-word" }}
                            >
                                <strong style={{ color: "#39ff14" }}>Workspace:</strong>{" "}
                                <span className="text-gray-300">{m.workspace.name}</span>
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
