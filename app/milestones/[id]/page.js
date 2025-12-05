// app/milestones/[id]/page.js
// View an individual milestone
import api from "@/lib/api";

export async function generateStaticParams() {
    if (!process.env.NEXT_PUBLIC_API_URL || !process.env.NEXT_PUBLIC_API_TOKEN) return [];

    try {
        const res = await api.get("/milestones");
        const milestones = res.data.data || res.data || [];
        return milestones.filter(c => c?.id).map(c => ({ id: c.id.toString() }));
    } catch (error) {
        console.warn("Unable to pre-generate milestone pages:", error.message);
        return [];
    }
}

export default async function MilestonePage({ params }) {
    const { id } = params;

    let milestone = null;
    try {
        const res = await api.get(`/milestones/${id}`);
        milestone = res.data.data || res.data;
    } catch (error) {
        return <p className="text-red-600">Error loading comment: {error.message}</p>;
    }

    if (!milestone) return <p>Milestone not found</p>;

    return (
        <div className="p-6 max-w-lg mx-auto rounded comment-card neon-card">
            <h1 className="project-title mb-3">
                <strong className="project-label">Milestone:</strong>{milestone.title}
            </h1>

            <p className="project-description mb-3">
                <strong className="project-label">Description:</strong>{" "}
                {milestone.description || "No description"}
            </p>

            {milestone.due_date && (
                <p className="project-description mb-2 text-gray-300">
                    <strong className="project-label">Due Date:</strong>{" "}
                    {new Date(milestone.due_date).toLocaleDateString()}
                </p>
            )}

            <p className="project-description mb-3">
                <strong className="project-label">Completed:</strong>{" "}
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                        milestone.completed_at
                            ? "bg-green-600 text-white"
                            : "bg-gray-700 text-white"
                    }`}
                >
                    {milestone.completed_at ? "Yes" : "No"}
                </span>
            </p>

            {milestone.workspace && (
                <p
                    className="project-description mb-3 break-all"
                    style={{ wordBreak: "break-word" }}
                >
                    <strong className="project-label">Workspace:</strong>{" "}
                    <span className="text-gray-300">{milestone.workspace.name}</span>
                </p>
            )}
        </div>
    );
}
