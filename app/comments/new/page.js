// Creates a new comment by the logged in user

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function NewCommentPage() {
    const [workspaces, setWorkspaces] = useState([]);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);

    const [form, setForm] = useState({
        content: "",
        workspace_id: "",
        commentable_type: "Project",
        commentable_id: "",
    });

    const [error, setError] = useState("");
    const router = useRouter();

    // Load workspaces, projects, and tasks
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resProjects, resTasks, resComments] = await Promise.all([
                    api.get("/projects"),
                    api.get("/tasks"),
                    api.get("/comments"),
                ]);

                const projectsData = resProjects.data.data || resProjects.data || [];
                const tasksData = resTasks.data.data || resTasks.data || [];
                const commentsData = resComments.data.data || resComments.data || [];

                setProjects(projectsData);
                setTasks(tasksData);

                // Extract unique workspaces from comments
                const uniqueWorkspaces = [
                    ...new Map(
                        commentsData.map((c) => [c.workspace.id, c.workspace])
                    ).values(),
                ];
                setWorkspaces(uniqueWorkspaces);

                if (uniqueWorkspaces.length > 0) {
                    setForm((prev) => ({
                        ...prev,
                        workspace_id: uniqueWorkspaces[0].id,
                    }));
                }
            } catch (err) {
                setError("Failed to load data");
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/comments", {
                content: form.content,
                workspace_id: form.workspace_id,
                commentable_type: form.commentable_type,
                commentable_id: form.commentable_id,
            });

            router.push("/comments");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Error creating comment");
        }
    };

    const commentableItems =
        form.commentable_type === "Project" ? projects : tasks;

    return (
        <div className="p-6 comments-wrapper">
            <h1 className="text-2xl font-bold mb-4 page-title">Add New Comment</h1>

            {error && <p className="error-box text-red-600 mb-2">{error}</p>}

            <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded border p-4 shadow-sm neon-form"
            >
                {/* Workspace Select */}
                <div className="flex flex-col gap-1 mb-4">
                    <label className="text-sm font-medium text-gray-700">Workspace</label>
                    <div className="control">
                        <select
                            value={form.workspace_id}
                            onChange={(e) =>
                                setForm({ ...form, workspace_id: e.target.value })
                            }
                            className="rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 select neon-input"
                            required
                        >
                            {workspaces.map((ws) => (
                                <option key={ws.id} value={ws.id}>
                                    {ws.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Commentable Type */}
                <div className="flex flex-col gap-1 mb-4">
                    <label className="text-sm font-medium text-gray-700">Comment Target</label>
                    <div className="control">
                        <select
                            value={form.commentable_type}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    commentable_type: e.target.value,
                                    commentable_id: "",
                                })
                            }
                            className="rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 select neon-input"
                        >
                            <option value="Project">Project</option>
                            <option value="Task">Task</option>
                        </select>
                    </div>
                </div>

                {/* Select Project or Task */}
                <div className="flex flex-col gap-1 mb-4">
                    <label className="text-sm font-medium text-gray-700">
                        Select {form.commentable_type}
                    </label>
                    <div className="control">
                        <select
                            value={form.commentable_id}
                            onChange={(e) =>
                                setForm({ ...form, commentable_id: e.target.value })
                            }
                            className="rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 select neon-input"
                            required
                        >
                            <option value="">
                                -- Select {form.commentable_type} --
                            </option>
                            {commentableItems.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Comment Content */}
                <div className="flex flex-col gap-1 mb-4">
                    <label className="text-sm font-medium text-gray-700">Content</label>
                    <div className="control">
                        <textarea
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            className="rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 textarea neon-textarea"
                            rows="3"
                            required
                        />
                    </div>
                </div>

                {/* Submit */}
                <div className="field is-grouped is-justify-content-center">
                    <div className="control">
                        <button
                            type="submit"
                            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 button neon-btn"
                        >
                            Add Comment
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
