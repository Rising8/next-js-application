// app/projects/[id]/page.js
// View an individual project

import api from "@/lib/api";

export async function generateStaticParams() {
    if (!process.env.NEXT_PUBLIC_API_URL || !process.env.NEXT_PUBLIC_API_TOKEN) return [];

    try {
        const res = await api.get("/projects");
        const projects = res.data.data || res.data || [];
        return projects.filter(p => p?.id).map(p => ({ id: p.id.toString() }));
    } catch (error) {
        console.warn("Unable to pre-generate project pages:", error.message);
        return [];
    }
}


export default async function ProjectPage({ params }) {
    const { id } = params;

    let project = null;
    try {
        const res = await api.get(`/projects/${id}`);
        project = res.data.data || res.data;
    } catch (error) {
        return <p className="text-red-600">Error loading project: {error.message}</p>;
    }

    if (!project) return <p>Project not found</p>;

    return (
        <div className="p-6 max-w-lg mx-auto rounded project-card neon-card">
            <h1 className="project-title mb-3">
                <strong className="project-label">Project Name: </strong>
                {project.name}
            </h1>

            {project.description && (
                <p className="project-description mb-2">
                    <strong className="project-label">Description:</strong>{" "}
                    {project.description}
                </p>
            )}

            {project.created_at && (
                <p className="project-description mb-2">
                    <strong className="project-label">Created:</strong>{" "}
                    {new Date(project.created_at).toLocaleDateString()}
                </p>
            )}

            {project.tasks && project.tasks.length > 0 && (
                <div className="mt-4">
                    <strong className="project-label">Tasks:</strong>
                    <ul className="mt-2 list-disc list-inside text-gray-700">
                        {project.tasks.map(task => (
                            <li key={task.id}>
                                {task.name} ({task.status})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
