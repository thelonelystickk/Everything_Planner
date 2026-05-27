import React, { useState, useEffect } from "react";

const uid = () => Math.random().toString(36).slice(2);

function IconBtn({ icon, onClick, className = "" }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`px-2 text-lg hover:scale-110 transition ${className}`}
    >
      {icon}
    </button>
  );
}

function Folder({ data, onUpdate, onDelete }) {
  const [open, setOpen] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newNote, setNewNote] = useState("");

  const addFolder = () => {
    if (!newFolderName.trim()) return;

    onUpdate({
      ...data,
      children: [
        ...data.children,
        {
          id: uid(),
          name: newFolderName,
          children: [],
          notes: []
        }
      ]
    });

    setNewFolderName("");
  };

  const addNote = () => {
    if (!newNote.trim()) return;

    onUpdate({
      ...data,
      notes: [
        ...data.notes,
        {
          id: uid(),
          text: newNote
        }
      ]
    });

    setNewNote("");
  };

  const renameFolder = () => {
    const name = prompt("Rename folder", data.name);

    if (!name || !name.trim()) return;

    onUpdate({
      ...data,
      name
    });
  };

  const updateChild = (childId, updatedChild) => {
    onUpdate({
      ...data,
      children: data.children.map((c) =>
        c.id === childId ? updatedChild : c
      )
    });
  };

  const deleteChild = (id) => {
    onUpdate({
      ...data,
      children: data.children.filter((c) => c.id !== id)
    });
  };

  const deleteNote = (id) => {
    onUpdate({
      ...data,
      notes: data.notes.filter((n) => n.id !== id)
    });
  };

  return (
    <div className="my-3">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer bg-neutral-900 border border-neutral-700 p-3 rounded-2xl hover:bg-neutral-800 transition"
      >
        <span className="text-2xl">
          {open ? "📂" : "📁"}
        </span>

        <span className="text-lg font-medium">
          {data.name}
        </span>

        <div className="ml-auto flex gap-1">
          <IconBtn
            icon="✏️"
            onClick={renameFolder}
            className="hover:text-yellow-400"
          />

          <IconBtn
            icon="⚙️"
            onClick={() =>
              setShowActions(!showActions)
            }
            className="hover:text-blue-400"
          />

          {data.name !== "Root" && (
            <IconBtn
              icon="🗑️"
              onClick={onDelete}
              className="hover:text-red-400"
            />
          )}
        </div>
      </div>

      {showActions && (
        <div className="ml-6 mt-3 bg-neutral-900 border border-neutral-700 p-4 rounded-2xl">
          <input
            value={newFolderName}
            onChange={(e) =>
              setNewFolderName(e.target.value)
            }
            placeholder="New folder name"
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2 mb-3 outline-none"
          />

          <button
            onClick={addFolder}
            className="w-full bg-green-700 hover:bg-green-600 rounded-xl p-2 mb-4 transition"
          >
            Add Folder
          </button>

          <textarea
            value={newNote}
            onChange={(e) =>
              setNewNote(e.target.value)
            }
            placeholder="Write note..."
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2 mb-3 outline-none"
          />

          <button
            onClick={addNote}
            className="w-full bg-blue-700 hover:bg-blue-600 rounded-xl p-2 transition"
          >
            Add Note
          </button>
        </div>
      )}

      {open && (
        <div className="ml-6 mt-2">
          {data.notes.map((n) => (
            <div
              key={n.id}
              className="bg-neutral-900 border border-neutral-700 p-3 rounded-2xl my-2 flex justify-between items-center"
            >
              <span>📝 {n.text}</span>

              <IconBtn
                icon="🗑️"
                onClick={() => deleteNote(n.id)}
                className="hover:text-red-400"
              />
            </div>
          ))}

          {data.children.map((child) => (
            <Folder
              key={child.id}
              data={child}
              onUpdate={(updated) =>
                updateChild(child.id, updated)
              }
              onDelete={() =>
                deleteChild(child.id)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const safeParse = (key, fallback) => {
    try {
      const item = localStorage.getItem(key);

      return item
        ? JSON.parse(item)
        : fallback;
    } catch {
      return fallback;
    }
  };

  const [root, setRoot] = useState(() =>
    safeParse("planner-root", {
      id: uid(),
      name: "Root",
      children: [],
      notes: []
    })
  );

  const [todo, setTodo] = useState(() =>
    safeParse("planner-todo", [])
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "planner-root",
      JSON.stringify(root)
    );

    localStorage.setItem(
      "planner-todo",
      JSON.stringify(todo)
    );
  }, [root, todo]);

  const addTodo = (text) => {
    if (!text.trim()) return;

    setTodo([
      ...todo,
      {
        id: uid(),
        text,
        done: false,
        createdAt: Date.now()
      }
    ]);
  };

  const toggleTodo = (id) => {
    setTodo(
      todo.map((t) =>
        t.id === id
          ? {
              ...t,
              done: !t.done
            }
          : t
      )
    );
  };

  const deleteTodo = (id) => {
    setTodo(
      todo.filter((t) => t.id !== id)
    );
  };

  const filteredTodo = todo.filter((t) =>
    t.text
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">
        Everything Planner
      </h1>

      <input
        placeholder="Search tasks..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="w-full bg-neutral-900 border border-neutral-700 rounded-2xl p-3 mb-6 outline-none"
      />

      <Folder
        data={root}
        onUpdate={setRoot}
        onDelete={() => {}}
      />

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">
          To-Do List
        </h2>

        <input
          placeholder="New task..."
          className="w-full bg-neutral-900 border border-neutral-700 rounded-2xl p-3 mb-4 outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTodo(e.target.value);
              e.target.value = "";
            }
          }}
        />

        {filteredTodo.map((t) => (
          <div
            key={t.id}
            className={`p-3 rounded-2xl border my-2 flex justify-between items-center transition ${
              t.done
                ? "bg-green-700 border-green-600 line-through"
                : "bg-neutral-900 border-neutral-700"
            }`}
          >
            <div
              className="flex-1 cursor-pointer"
              onClick={() =>
                toggleTodo(t.id)
              }
            >
              <div>{t.text}</div>

              <div className="text-xs opacity-60 mt-1">
                {new Date(
                  t.createdAt
                ).toLocaleString()}
              </div>
            </div>

            <IconBtn
              icon="🗑️"
              onClick={() =>
                deleteTodo(t.id)
              }
              className="hover:text-red-400"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
