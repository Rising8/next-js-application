"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";

const PAGE_SIZE = 5;

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        api.get("/users")
            .then((res) => {
                setUsers(res.data.data || res.data);
                setCurrentPage(1);
                setSuccess("Users loaded successfully.");
                setError(null);
            })
            .catch((err) => {
                setError(err.message);
                setSuccess("");
            })
            .finally(() => setLoading(false));
    }, []);

    const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return users.slice(start, start + PAGE_SIZE);
    }, [currentPage, users]);

    const goToPage = (page) => {
        setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    };

    const getFirstUser = (name) => (name ? name.charAt(0).toUpperCase() : "?");

    if (loading) return <p className="p-6 text-gray-600">Loading users...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <p className="font-semibold">Unable to load users</p>
                    <p>{error}</p>
                </div>
            )}
            {!error && success && (
                <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                    <p className="font-semibold">Success</p>
                    <p>{success}</p>
                </div>
            )}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 text-sm shadow-sm">
                <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                        Total users
                    </p>
                    <p className="text-xl font-semibold text-gray-900">
                        {users.length}
                    </p>
                </div>
                <div className="flex gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {PAGE_SIZE} per page
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        Page {currentPage}
                    </span>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                <table className="min-w-full border-collapse text-sm">
                    <thead className="bg-slate-50 text-left font-semibold text-slate-600">
                        <tr>
                            <th className="p-3">User</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.map((user, index) => {
                            const emailValue =
                                typeof user.email === "string"
                                    ? user.email
                                    : user.email?.address;
                            const verified =
                                typeof user.email === "object"
                                    ? user.email?.verified
                                    : undefined;
                            const createdValue =
                                user.created?.human ||
                                user.created?.string ||
                                "—";

                            return (
                                <tr
                                    key={user.id}
                                    className={`${
                                        index % 2 === 0
                                            ? "bg-white"
                                            : "bg-slate-50/40"
                                    } transition hover:bg-blue-50`}
                                >
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                                                {getFirstUser(user.name)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    ID: {user.id}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="break-all text-sm text-slate-800">
                                                {emailValue || "N/A"}
                                            </span>
                                            {verified !== undefined && (
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                        verified
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                                >
                                                    {verified
                                                        ? "Verified"
                                                        : "Unverified"}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                                            {createdValue}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
                <button
                    className="rounded border border-gray-300 px-3 py-1 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <p className="text-gray-600">
                    Page {currentPage} of {totalPages}
                </p>
                <button
                    className="rounded border border-gray-300 px-3 py-1 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
