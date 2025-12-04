"use client";

import Link from "next/link";

export default function HomePage() {
    const name = "Edmand";

    const menuItems = [
        { title: "Projects", desc: "View & create projects", link: "/projects", icon: "📁", glow: "#ffea00" },
        { title: "Tasks", desc: "Manage your tasks", link: "/tasks", icon: "📝", glow: "#00e5ff" },
        { title: "Comments", desc: "Track your comments", link: "/comments", icon: "💬", glow: "#d500f9" },
        { title: "Checklist Items", desc: "Review item statuses", link: "/checklist-items", icon: "✅", glow: "#69f0ae" },
        { title: "Milestones", desc: "Track milestones", link: "/milestones", icon: "🎯", glow: "#ff4081" },
    ];

    return (
        <main className="section">
            <div className="container">

                {/* Neon Gradient Header */}
                <div className="cyber-header">
                    <h1 className="title is-2 cyber-header-text">Hi {name},</h1>
                    <p className="subtitle is-4 cyber-header-text">
                        Welcome to your NextJS dashboard.
                    </p>
                </div>

                {/* Cards Row */}
                <div className="cyber-row mt-6">
                    {menuItems.map((item) => (
                        <Link key={item.title} href={item.link} className="cyber-flex">
                            <div className="cyber-card" style={{ "--glow": item.glow }}>
                                {/* Neon Border */}
                                <div className="cyber-card-border"></div>

                                {/* Icon */}
                                <div className="cyber-icon" style={{ "--glow": item.glow }}>
                                    {item.icon}
                                </div>

                                <p className="title is-4 cyber-title-text">{item.title}</p>
                                <p className="subtitle is-6 cyber-desc-text">{item.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
