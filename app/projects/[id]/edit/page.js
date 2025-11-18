// app/projects/[id]/page.js
// Edit page for projects

import Link from "next/link";
import { notFound } from "next/navigation";
import api from "@/lib/api";

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
    const { id } = await params;
    const project = await getProject(id);
    const createdAt = project.created?.human || project.created_at;

    return (
        <div className="space-y-6 p-6">
            <Link
                href="/projects"
                className="text-sm text-blue-600 hover:underline"
            >
                ← Back to projects
            </Link>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900">
                    {project.name}
                </h1>
                {project.description && (
                    <p className="mt-2 text-gray-600">{project.description}</p>
                )}

                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded border p-4">
                        <dt className="text-sm uppercase tracking-wide text-gray-500">
                            Project ID
                        </dt>
                        <dd className="mt-1 font-mono text-sm text-gray-900">
                            {project.id}
                        </dd>
                    </div>

                    {createdAt && (
                        <div className="rounded border p-4">
                            <dt className="text-sm uppercase tracking-wide text-gray-500">
                                Created
                            </dt>
                            <dd className="mt-1 text-gray-900">{createdAt}</dd>
                        </div>
                    )}
                </dl>
            </div>
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
