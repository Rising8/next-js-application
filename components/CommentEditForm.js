// components/CommentEditForm.js
// renders a form for editing an existing comment
// fetches data from api, manages state, handles inputs and submits updates to backend
// backend + logic for form

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function CommentEditForm({ commentId }) {
    const router = useRouter();
    const [form, setForm] = useState({
        content: "",
        commentable_type: "",
        commentable_id: "",
        workspace: "",
        user_name: "",
    });
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resProjects, resTasks, resComment] = await Promise.all([
                    api.get("/projects"),
                    api.get("/tasks"),
                    api.get(`/comments/${commentId}`),
                ]);

                const projectsData = resProjects.data.data || resProjects.data || [];
                const tasksData = resTasks.data.data || resTasks.data || [];
                const commentData = resComment.data.data || resComment.data;

                setProjects(projectsData);
                setTasks(tasksData);

                // ensure the correct list is available before setting an ID
const type = commentData.commentable?.type || "Project";
const id = commentData.commentable?.id || "";

// only set the id if it exists in the correct list
const validOptions = type === "Task" ? tasksData : projectsData;
const validId = validOptions.some(item => item.id == id) ? id : "";

setForm({
    content: commentData.content || "",
    commentable_type: type,
    commentable_id: validId,
    workspace: commentData.workspace?.name || "",
    user_name: commentData.user?.name || "Unknown",
});
            } catch (err) {
                setError(err.message || "Error loading comment");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [commentId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/comments/${commentId}`, {
                content: form.content,
                commentable_type: form.commentable_type,
                commentable_id: form.commentable_id,
            });

            router.push("/comments");
            router.refresh();
        } catch (err) {
            setError(
                err.response?.data?.message || err.message || "Error updating comment"
            );
        }
    };

    const commentableOptions =
        form.commentable_type === "Project" ? projects : tasks;

    const handleTypeChange = (value) => {
        setForm({
            ...form,
            commentable_type: value,
            commentable_id: "",
        });
    };

    if (loading) return <p>Loading comment...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded border p-4 shadow-sm neon-form"
        >
            {/* Workspace (readonly) */}
            <div className="flex flex-col gap-1 mb-4">
                <label className="text-sm font-medium text-gray-700">Workspace</label>
                <input
                    type="text"
                    value={form.workspace}
                    disabled
                    className="rounded border border-gray-300 p-2 bg-gray-100 cursor-not-allowed input neon-input"
                />
            </div>

            {/* Created By (readonly) */}
            <div className="flex flex-col gap-1 mb-4">
                <label className="text-sm font-medium text-gray-700">Created By</label>
                <input
                    type="text"
                    value={form.user_name}
                    disabled
                    className="rounded border border-gray-300 p-2 bg-gray-100 cursor-not-allowed input neon-input"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 mb-4">
                <label className="text-sm font-medium text-gray-700">Content</label>
                <textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    rows="3"
                    className="rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 textarea neon-textarea"
                    required
                />
            </div>

            {/* Commentable Type */}
            <div className="flex flex-col gap-1 mb-4">
                <label className="text-sm font-medium text-gray-700">Type</label>
                <select
                    key={form.commentable_type}
                    value={form.commentable_type}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 select input neon-input"
                    required
                >
                    <option value="Project">Project</option>
                    <option value="Task">Task</option>
                </select>
            </div>

            {/* Commentable Selection */}
            <div className="flex flex-col gap-1 mb-4">
                <label className="text-sm font-medium text-gray-700">
                    Select {form.commentable_type}
                </label>
                <select
                    value={form.commentable_id}
                    onChange={(e) =>
                        setForm({ ...form, commentable_id: e.target.value })
                    }
                    className="rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 select input neon-input"
                    required
                >
                    <option value="">-- Select {form.commentable_type} --</option>
                    {commentableOptions.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="field is-grouped is-justify-content-center">
                <div className="control">
                    <button
                        type="submit"
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 button neon-btn"
                    >
                        Update Comment
                    </button>
                </div>
            </div>
        </form>
    );
}
