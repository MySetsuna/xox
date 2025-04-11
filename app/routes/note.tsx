import { Outlet, useSearchParams } from "react-router";
import { useState } from "react";

type Note = {
    id: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: string;
    isPinned: boolean;
};

const mockNotes: Note[] = [
    {
        id: "1",
        title: "Pinned Note",
        content: "This is a pinned note.",
        tags: ["work"],
        createdAt: "2023-10-01",
        isPinned: true,
    },
    {
        id: "2",
        title: "Regular Note",
        content: "This is a regular note.",
        tags: ["personal"],
        createdAt: "2023-10-02",
        isPinned: false,
    },
];

export default function NotePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [mode, setMode] = useState<"list" | "grid">("list");

    const filterByTag = searchParams.get("tag");
    const sortBy = searchParams.get("sort");

    const filteredNotes = mockNotes
        .filter((note) => (filterByTag ? note.tags.includes(filterByTag) : true))
        .sort((a, b) => {
            if (sortBy === "time") {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return 0;
        });

    const pinnedNotes = filteredNotes.filter((note) => note.isPinned);
    const regularNotes = filteredNotes.filter((note) => !note.isPinned);

    return (
        <div>
            <header>
                <h1>Notes</h1>
                <div>
                    <button onClick={() => setSearchParams({ sort: "time" })}>
                        Sort by Time
                    </button>
                    <button onClick={() => setSearchParams({ tag: "work" })}>
                        Filter by Tag: Work
                    </button>
                    <button onClick={() => setSearchParams({})}>Clear Filters</button>
                    <button onClick={() => setMode(mode === "list" ? "grid" : "list")}>
                        Toggle Mode: {mode === "list" ? "Grid" : "List"}
                    </button>
                </div>
            </header>
            <main>
                <section>
                    <h2>Pinned Notes</h2>
                    <div className={mode}>
                        {pinnedNotes.map((note) => (
                            <NoteCard key={note.id} note={note} />
                        ))}
                    </div>
                </section>
                <section>
                    <h2>All Notes</h2>
                    <div className={mode}>
                        {regularNotes.map((note) => (
                            <NoteCard key={note.id} note={note} />
                        ))}
                    </div>
                </section>
                <Outlet />
            </main>
        </div>
    );
}

function NoteCard({ note }: { note: Note }) {
    return (
        <div className="note-card">
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <small>Tags: {note.tags.join(", ")}</small>
            <small>Created At: {note.createdAt}</small>
        </div>
    );
}