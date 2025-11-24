// app/comments/[id]/page.js
// View an individual comment
import api from "@/lib/api";

export async function generateStaticParams() {
    if (!process.env.NEXT_PUBLIC_API_URL || !process.env.NEXT_PUBLIC_API_TOKEN) return [];

    try {
        const res = await api.get("/comments");
        const comments = res.data.data || res.data || [];
        return comments.filter(c => c?.id).map(c => ({ id: c.id.toString() }));
    } catch (error) {
        console.warn("Unable to pre-generate comment pages:", error.message);
        return [];
    }
}

export default async function CommentPage({ params }) {
    const { id } = params;

    let comment = null;
    try {
        const res = await api.get(`/comments/${id}`);
        comment = res.data.data || res.data;
    } catch (error) {
        return <p className="text-red-600">Error loading comment: {error.message}</p>;
    }

    if (!comment) return <p>Comment not found</p>;

    return (
        <div className="p-6 max-w-lg mx-auto rounded comment-card neon-card">
            <h1 className="project-title mb-3">
                <strong className="project-label">Comment:</strong>{comment.content}
            </h1>

            {comment.user && (
                <p className="project-description mb-2">
                    <strong className="project-label">User:</strong> {comment.user.name} ({comment.user.email?.address})
                </p>
            )}

            {comment.workspace && (
                <p className="project-description mb-2">
                    <strong className="project-label">Workspace:</strong> {comment.workspace.name}
                </p>
            )}

            {comment.commentable && (
                <p className="project-description mb-2">
                    <strong className="project-label">Attached to:</strong> {comment.commentable.type} - {comment.commentable.id}
                </p>
            )}

            {comment.user?.created?.human && (
                <p className="project-description mb-2 text-sm text-gray-500">
                    Created: {comment.user.created.human}
                </p>
            )}
        </div>
    );
}
