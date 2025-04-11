import React from "react";

const NoteGrid: React.FC = () => {
    const notes = [
        { id: 1, title: "Note 1", content: "This is the first note." },
        { id: 2, title: "Note 2", content: "This is the second note." },
        { id: 3, title: "Note 3", content: "This is the third note." },
        { id: 4, title: "Note 4", content: "This is the fourth note." },
    ];

    return (
        <div style={styles.gridContainer}>
            {notes.map((note) => (
                <div key={note.id} style={styles.noteCard}>
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                </div>
            ))}
        </div>
    );
};

const styles = {
    gridContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "16px",
        padding: "16px",
    },
    noteCard: {
        backgroundColor: "#f9f9f9",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
};

export default NoteGrid;