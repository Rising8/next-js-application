// Update individual task details

// Edit page for a single task
// app/tasks/[id]/edit/page.js
//reads the form from TaskEditForm.js (separated for easier readability)
// this page only handles the ui /layout for edit page.

import Link from "next/link";
import { notFound } from "next/navigation";
import api from "@/lib/api";
import TaskEditForm from "@/components/TaskEditForm";

async function getTask(id) {
    try {
        const res = await api.get(`/tasks/${id}`);
        return res.data.data || res.data;
    } catch (error) {
        if (error.response?.status === 404) notFound();
        throw error;
    }
}

export default async function EditTaskPage({ params }) {
    const { id } = params;
    const task = await getTask(id);

    return (
        <div className="p-6 tasks-wrapper">
            <Link href={`/tasks`} className="text-sm text-blue-600 hover:underline">
                ← Back to all tasks
            </Link>

            <h1 className="text-2xl font-bold mb-4 page-title">Edit Task</h1>

            <TaskEditForm taskId={id} />
        </div>
    );
}

// Pre-generate static paths
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
