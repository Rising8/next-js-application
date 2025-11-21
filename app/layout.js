import Link from "next/link";

import "../styles/globals.css";

export const metadata = {
    title: "AT3 Next.js App",
    description: "A modern application built with Next.js and Bulma",
    openGraph: {
        title: "My Next.js App",
        description: "A modern web application built with Next.js",
        images: [
            {
                url: "/logo.png",
                width: 800,
                height: 600,
                alt: "App Logo",
            },
        ],
        siteName: "My Next.js App",
    },
};


export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                {/* Navbar */}
                <nav
                    className="navbar is-primary"
                    role="navigation"
                    aria-label="main navigation"
                >
                    <div className="navbar-brand">
                        <Link className="navbar-item" href="/">
                            <span className="title has-text-white">
                                AT3 Next.js App
                            </span>
                        </Link>
                    </div>

                    <div className="navbar-menu">
                        <div className="navbar-start">
                            <Link className="navbar-item" href="/">
                                Dashboard
                            </Link>                 
                            <Link className="navbar-item" href="/projects">
                                Projects
                            </Link>
                            <Link className="navbar-item" href="/tasks">
                                Tasks
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Main content section */}
                <section className="section">
                    <div className="container">
                        <div className="columns">

                            {/* Sidebar showing the flow */}
                            <aside className="column is-3">
                                <nav className="menu box">
                                    <p className="menu-label">Users</p>
                                    <ul className="menu-list">
                                        <li><Link href="/users">Users</Link></li>
                                    </ul>

                                    <p className="menu-label mt-4">Projects</p>
                                    <ul className="menu-list">
                                        <li><Link href="/projects">All Projects</Link></li>
                                        <li><Link href="/projects/new">+ New Project</Link></li>
                                    </ul>

                                    <p className="menu-label mt-4">Tasks</p>
                                    <ul className="menu-list">
                                        <li><Link href="/tasks">All Tasks</Link></li>
                                        <li><Link href="/tasks/new">+ New Task</Link></li>
                                        <li><Link href="/tasks/assigned">Project Tasks</Link></li>
                                    </ul>

                                    <p className="menu-label mt-4">Comments & Checklist</p>
                                    <ul className="menu-list">
                                        <li><Link href="/comments">All Comments</Link></li>
                                        <li><Link href="/checklist-items">Checklist Items</Link></li>
                                    </ul>

                                    <p className="menu-label mt-4">Milestones</p>
                                    <ul className="menu-list">
                                        <li><Link href="/milestones">All Milestones</Link></li>
                                    </ul>
                                </nav>
                            </aside>

                            {/* Main Content */}
                            <main className="column">
                                <div className="box">{children}</div>
                            </main>

                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="footer">
                    <div className="content has-text-centered">
                        <p>
                            © 2025 <strong>AT3 Next.js App</strong>. Built with 
                            Next.js
                        </p>
                    </div>
                </footer>
            </body>
        </html>
    );
}