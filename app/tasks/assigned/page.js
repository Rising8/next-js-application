"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function ProjectTasksPage() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState({ id: "", name: "" });
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingTasks, setLoadingTasks] = useState(false);
{/* I NEED TO CHANGE THIS TO_DO THING (and maybe the done/completed) LATER TO WHATEVER IS IN THE API SO THAT THE STYLE WILL WORK */}
    const statusMap = {
        to_do: "status-to-do",
        in_progress: "status-in-progress",
        done: "status-done",
    };

    // Load projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get("/projects");
                const data = res.data.data || res.data || [];
                setProjects(data);
                if (data.length > 0) {
                    setSelectedProject({ id: data[0].id, name: data[0].name });
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingProjects(false);
            }
        };
        fetchProjects();
    }, []);

    // Load tasks for selected project
    useEffect(() => {
        if (!selectedProject.id) return;
        const fetchTasks = async () => {
            setLoadingTasks(true);
            setError(null);
            try {
                const res = await api.get(`/tasks/projects/${selectedProject.id}`);
                setTasks(res.data.data || res.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingTasks(false);
            }
        };
        fetchTasks();
    }, [selectedProject]);

    const handleProjectChange = (e) => {
        const project = projects.find(p => p.id === e.target.value);
        if (project) setSelectedProject({ id: project.id, name: project.name });
        else { setSelectedProject({ id: "", name: "" }); setTasks([]); }
    };

    const handleDelete = async (taskId) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        try {
            await api.delete(`/tasks/${taskId}`);
            setTasks(prev => prev.filter(t => t.id !== taskId));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="p-6 tasks-wrapper">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <Link href="/tasks" className="text-sm text-blue-600 hover:underline">← Back to all tasks</Link>
                    <h1 className="text-2xl font-bold mb-3 project-title">My Project Tasks</h1>
                </div>
            </div>

            {loadingProjects && <p>Loading projects...</p>}
            {error && <p className="text-red-600 mb-4">Error: {error}</p>}

            {/* Project selector */}
            {projects.length > 0 && (
                <div className="mb-4">
                    <label className="project-label text-white mb-1">Select a project: </label>
                    <select value={selectedProject.id} onChange={handleProjectChange} className="project-select">
                        <option value="">-- Choose a project --</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
            )}

            {/* Tasks */}
            {selectedProject.id && (
                <>
                    <h2 className="text-xl font-semibold mb-4 project-title">
                        Tasks for: {selectedProject.name}
                    </h2>

                    {loadingTasks && <p>Loading tasks...</p>}
                    {!loadingTasks && tasks.length === 0 && <p className="text-gray-400">No tasks found for this project.</p>}

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tasks.map(task => (
                            <div key={task.id} className="project-card p-6 relative">
                                <Link href={`/tasks/${task.id}`} className="project-title text-lg font-bold hover:underline">
                                    {task.name}
                                </Link>

                                <p className="project-description mb-2 mt-1">
                                    {task.description || "No description"}
                                </p>

                                {task.due_date && (
                                    <p className="project-description mb-1">
                                        <strong style={{ color: "#39ff14", textShadow: "0 0 5px #39ff14, 0 0 10px #39ff14" }}>Due:</strong>{" "}
                                        {new Date(task.due_date).toLocaleDateString()}
                                    </p>
                                )}

                                <span className={`status-badge ${statusMap[task.status]}`}>
                                    Status: {task.status.replace('_', ' ').toUpperCase()}
                                </span>

                                <div className="flex gap-2 mt-3">
                                    <Link href={`/tasks/${task.id}/edit`} className="edit-btn">Edit</Link>
                                    <button onClick={() => handleDelete(task.id)} className="delete-btn">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
