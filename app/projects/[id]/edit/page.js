// app/projects/[id]/edit/page.js
// Edit page for projects
// reads the form from ProjectEditForm.js
// similar to app/tasks/[id]/edit/page.js, it handles the UI 

import Link from "next/link";
import { notFound } from "next/navigation";
import api from "@/lib/api";
import ProjectEditForm from "@/components/ProjectEditForm";

async function getProject(id) {
    try {
        const res = await api.get(`/projects/${id}`);
        return res.data.data || res.data;
    } catch (error) {
        if (error.response?.status === 404) {
            notFound();
        }
        throw error;
    }
}

export default async function ProjectDetail({ params }) {
    const { id } = params;
    const project = await getProject(id);

    return (
        <div className="p-6 projects-wrapper">
            <Link 
                href={`/projects`} 
                className="text-sm text-blue-600 hover:underline"
            >
                ← Back to projects
            </Link>

            <h1 className="text-2xl font-bold mb-4 page-title">Edit Project</h1>

            <ProjectEditForm projectId={id} project={project} />
        </div>
    );
}

export async function generateStaticParams() {
    if (
        !process.env.NEXT_PUBLIC_API_URL ||
        !process.env.NEXT_PUBLIC_API_TOKEN
    ) {
        return [];
    }
    try {
        const res = await api.get("/projects");
        const projects = res.data.data || res.data || [];
        return projects
            .filter((project) => project?.id)
            .map((project) => ({ id: project.id.toString() }));
    } catch (error) {
        console.warn("Unable to pre-generate project pages:", error.message);
        return [];
    }
}
