import React, { useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "student-notes";

function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  
  const [editingId, setEditingId] = useState(null);

  // Load notes from localStorage when app starts
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = () => {
    if (!text.trim()) return;

    if (editingId) {
      // Update existing note
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingId ? { ...note, text } : note
        )
      );
      setEditingId(null);
    } else {
      // Add new note
      const newNote = {
        id: Date.now(),
        text: text.trim(),
      };
      setNotes((prev) => [newNote, ...prev]);
    }

    setText("");
  };

  const handleEdit = (note) => {
    setEditingId(note.id);
    setText(note.text);
  };

  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setText("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setText("");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Student Notes App</h1>

      <div style={styles.form}>
        <textarea
          style={styles.textarea}
          placeholder="Type your note here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div>
          <button onClick={handleAddNote} style={styles.button}>
            {editingId ? "Update Note" : "Add Note"}
          </button>
          {editingId && (
            <button onClick={handleCancelEdit} style={styles.cancelButton}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <h2 style={styles.subTitle}>All Notes</h2>
      {notes.length === 0 && <p>No notes saved yet.</p>}

      <ul style={styles.list}>
        {notes.map((note) => (
          <li key={note.id} style={styles.listItem}>
            <span>{note.text}</span>
            <div>
              <button
                onClick={() => handleEdit(note)}
                style={styles.smallButton}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(note.id)}
                style={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontFamily: "Arial, sans-serif",
  },
  title: { textAlign: "center" },
  subTitle: { marginTop: "24px" },
  form: { marginBottom: "16px" },
  textarea: {
    width: "100%",
    minHeight: "80px",
    padding: "8px",
    boxSizing: "border-box",
    marginBottom: "8px",
  },
  button: {
    padding: "6px 12px",
    marginRight: "8px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "6px 12px",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px",
    borderBottom: "1px solid #eee",
    gap: "10px",
  },
  smallButton: {
    padding: "4px 8px",
    marginRight: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "4px 8px",
    cursor: "pointer",
  },
};

export default App;
