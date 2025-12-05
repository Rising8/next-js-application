// app/checklist-items/[id]/page.js
// View an individual checklist item
import api from "@/lib/api";

export async function generateStaticParams() {
    if (!process.env.NEXT_PUBLIC_API_URL || !process.env.NEXT_PUBLIC_API_TOKEN) return [];

    try {
        const res = await api.get("/checklist-items");
        const comments = res.data.data || res.data || [];
        return comments.filter(c => c?.id).map(c => ({ id: c.id.toString() }));
    } catch (error) {
        console.warn("Unable to pre-generate checklist item pages:", error.message);
        return [];
    }
}


export default async function CheckListItemPage({ params }) {
    const { id } = params;

    let item = null;
    try {
        const res = await api.get(`/checklist-items/${id}`);
        item = res.data.data || res.data;
    } catch (error) {
        return <p className="text-red-600">Error loading checklist item: {error.message}</p>;
    }

    if (!item) return <p>Checklist item not found</p>;

    return (
        <div className="p-6 max-w-lg mx-auto rounded comment-card neon-card">
            <h1 className="project-title mb-3">
                <strong className="project-label">Checklist Item:</strong> {item.label}
            </h1>

            <p className="project-description mb-2">
                <strong className="project-label">Completed:</strong> {item.completed ? "Yes" : "No"}
            </p>

            {item.task_id && (
                <p className="project-description mb-2 break-all">
                    <strong className="project-label">Task ID:</strong> {item.task_id}
                </p>
            )}
        </div>
    );
}