// app/tasks/[id]/page.js
// View an individual task
import api from "@/lib/api";

export async function generateStaticParams() {
    if (!process.env.NEXT_PUBLIC_API_URL || !process.env.NEXT_PUBLIC_API_TOKEN) return [];

    try {
        const res = await api.get("/tasks");
        const tasks = res.data.data || res.data || [];
        return tasks.filter(t => t?.id).map(t => ({ id: t.id.toString() }));
    } catch (error) {
        console.warn("Unable to pre-generate task edit pages:", error.message);
        return [];
    }
}


export default async function TaskPage({ params }) {
    const { id } = params;

    let task = null;
    try {
        const res = await api.get(`/tasks/${id}`);
        task = res.data.data || res.data;
    } catch (error) {
        return <p className="text-red-600">Error loading task: {error.message}</p>;
    }

    if (!task) return <p>Task not found</p>;

    // Map API status values to CSS classes
    const statusMap = {
        todo: "status-to-do",
        to_do: "status-to-do",       
        in_progress: "status-in-progress",
        done: "status-done",
        completed: "status-done",
    };

    // Map API status values to display labels
    const statusLabelMap = {
        todo: "To Do",
        to_do: "To Do",
        in_progress: "In Progress",
        done: "Done",
        completed: "Done",
    };
    const statusClass = statusMap[task.status] || "";

    return (
        <div className="p-6 max-w-lg mx-auto rounded project-card neon-card">
            <h1 className="project-title mb-3">
                <strong className="project-label">Task Name: </strong>{task.name}</h1>
            <p className="project-description mb-2">
                <strong className="project-label">Description:</strong> {task.description || "No description"}
            </p>

            {task.due_date && (
                <p className="project-description mb-2">
                    <strong className="project-label">Due:</strong> {new Date(task.due_date).toLocaleDateString()}
                </p>
            )}

            <span className={`status-badge ${statusClass}`}>
                Status: {task.status.replace("_", " ").toUpperCase()}
            </span>

            {task.project && (
                <p className="project-description mt-2">
                    <strong className="project-label">Project:</strong> {task.project.name}
                </p>
            )}
        </div>
    );
}
