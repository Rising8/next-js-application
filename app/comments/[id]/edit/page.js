// app/comments/[id]/edit/page.js
// Edit page for a single comment

import Link from "next/link";
import { notFound } from "next/navigation";
import api from "@/lib/api";
import CommentEditForm from "@/components/CommentEditForm";

async function getComment(id) {
    try {
        const res = await api.get(`/comments/${id}`);
        return res.data.data || res.data;
    } catch (error) {
        if (error.response?.status === 404) notFound();
        throw error;
    }
}

export default async function EditCommentPage({ params }) {
    const { id } = params;
    const comment = await getComment(id);

    return (
        <div className="p-6 tasks-wrapper">
            <Link href={`/comments`} className="text-sm text-blue-600 hover:underline">
                ← Back to all comments
            </Link>

            <h1 className="text-2xl font-bold mb-4 page-title">Edit Comment</h1>

            <CommentEditForm commentId={id} />
        </div>
    );
}

// Pre-generate static paths
export async function generateStaticParams() {
    if (!process.env.NEXT_PUBLIC_API_URL || !process.env.NEXT_PUBLIC_API_TOKEN) return [];

    try {
        const res = await api.get("/comments");
        const comments = res.data.data || res.data || [];
        return comments.filter(c => c?.id).map(c => ({ id: c.id.toString() }));
    } catch (error) {
        console.warn("Unable to pre-generate comment edit pages:", error.message);
        return [];
    }
}
