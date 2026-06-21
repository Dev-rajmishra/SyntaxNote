"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Folder as FolderIcon,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  Plus,
  FolderPlus,
  Edit3,
  Trash2,
} from "lucide-react";
import { Folder, Note } from "@/lib/db";
import PromptModal from "./PromptModal";

interface NoteFilesProps {
  searchQuery: string;
}

export default function NoteFiles({ searchQuery }: NoteFilesProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeNoteId = searchParams.get("id");

  const [folders, setFolders] = useState<Folder[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [promptState, setPromptState] = useState<{
    isOpen: boolean;
    title: string;
    placeholder: string;
    defaultValue: string;
    submitLabel: string;
    onSubmit: (value: string) => void;
  }>({
    isOpen: false,
    title: "",
    placeholder: "",
    defaultValue: "",
    submitLabel: "",
    onSubmit: () => {},
  });

  // Fetch folders and notes
  const fetchData = async () => {
    try {
      const [foldersRes, notesRes] = await Promise.all([
        fetch("/api/v1/folder").then((res) => res.json()),
        fetch("/api/v1/notes").then((res) => res.json()),
      ]);
      if (foldersRes.success) setFolders(foldersRes.folders);
      if (notesRes.success) setNotes(notesRes.notes);
    } catch (e) {
      console.error("Failed to fetch sidebar notes and folders data", e);
    }
  };

  useEffect(() => {
    fetchData();

    const handleRefresh = () => fetchData();
    window.addEventListener("refresh-sidebar", handleRefresh);
    return () => window.removeEventListener("refresh-sidebar", handleRefresh);
  }, []);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const handleCreateFolder = (parentId: string | null = null) => {
    setPromptState({
      isOpen: true,
      title: "New Folder",
      placeholder: "Enter folder name...",
      defaultValue: "",
      submitLabel: "Create Folder",
      onSubmit: async (name) => {
        try {
          const res = await fetch("/api/v1/folder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, parentID: parentId }),
          }).then((r) => r.json());

          if (res.success) {
            await fetchData();
            if (parentId) {
              setExpandedFolders((prev) => ({ ...prev, [parentId]: true }));
            }
          } else {
            alert(res.message || "Failed to create folder");
          }
        } catch (e) {
          console.error(e);
        } finally {
          setActiveMenuId(null);
        }
      },
    });
  };

  const handleRenameFolder = (folderId: string, currentName: string) => {
    setPromptState({
      isOpen: true,
      title: "Rename Folder",
      placeholder: "Enter new folder name...",
      defaultValue: currentName,
      submitLabel: "Rename",
      onSubmit: async (name) => {
        if (name === currentName) return;
        try {
          const res = await fetch(`/api/v1/folder/${folderId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
          }).then((r) => r.json());

          if (res.success) {
            fetchData();
          } else {
            alert(res.message || "Failed to rename folder");
          }
        } catch (e) {
          console.error(e);
        } finally {
          setActiveMenuId(null);
        }
      },
    });
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm("Are you sure you want to delete this folder? Subfolders will also be deleted, and notes inside will move to root.")) return;

    try {
      const res = await fetch(`/api/v1/folder/${folderId}`, {
        method: "DELETE",
      }).then((r) => r.json());

      if (res.success) {
        fetchData();
      } else {
        alert(res.message || "Failed to delete folder");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActiveMenuId(null);
    }
  };

  const handleCreateNote = (folderId: string | null = null) => {
    setPromptState({
      isOpen: true,
      title: "New Note",
      placeholder: "Enter note title...",
      defaultValue: "",
      submitLabel: "Create Note",
      onSubmit: async (title) => {
        try {
          const res = await fetch("/api/v1/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title,
              content: `<h1>${title}</h1><p>Start writing your note here...</p>`,
              folderId: folderId,
              tags: [],
            }),
          }).then((r) => r.json());

          if (res.success) {
            await fetchData();
            if (folderId) {
              setExpandedFolders((prev) => ({ ...prev, [folderId]: true }));
            }
            router.push(`/text-note?id=${res.note.id}`);
          } else {
            alert(res.message || "Failed to create note");
          }
        } catch (e) {
          console.error(e);
        } finally {
          setActiveMenuId(null);
        }
      },
    });
  };

  const handleNoteClick = (noteId: string) => {
    router.push(`/text-note?id=${noteId}`);
  };

  // --- FILTER TREE LOGIC FOR SEARCH QUERY ---
  let filteredNotes = notes;
  let filteredFolders = folders;
  let autoExpandedIds: string[] = [];

  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();

    // Match notes
    const matchingNotes = notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
    );

    // Match folders
    const matchingFolders = folders.filter((f) => f.name.toLowerCase().includes(q));

    const visibleFolderIds = new Set<string>();
    const expandIds = new Set<string>();

    matchingNotes.forEach((note) => {
      let currentFolderId = note.folderId;
      while (currentFolderId) {
        visibleFolderIds.add(currentFolderId);
        expandIds.add(currentFolderId);
        const folder = folders.find((f) => f.id === currentFolderId);
        currentFolderId = folder ? folder.parentId : null;
      }
    });

    matchingFolders.forEach((folder) => {
      visibleFolderIds.add(folder.id);
      let currentParentId = folder.parentId;
      while (currentParentId) {
        visibleFolderIds.add(currentParentId);
        expandIds.add(currentParentId);
        const parentFolder = folders.find((f) => f.id === currentParentId);
        currentParentId = parentFolder ? parentFolder.parentId : null;
      }
    });

    filteredNotes = notes.filter(
      (n) =>
        matchingNotes.some((mn) => mn.id === n.id) ||
        (n.folderId && visibleFolderIds.has(n.folderId))
    );
    filteredFolders = folders.filter((f) => visibleFolderIds.has(f.id));
    autoExpandedIds = Array.from(expandIds);
  }

  // Render a folder node recursively
  const renderFolderNode = (folder: Folder, depth = 0) => {
    const isExpanded = !!expandedFolders[folder.id] || autoExpandedIds.includes(folder.id);
    const childFolders = filteredFolders.filter((f) => f.parentId === folder.id);
    const childNotes = filteredNotes.filter((n) => n.folderId === folder.id);
    const hasChildren = childFolders.length > 0 || childNotes.length > 0;
    const isMenuOpen = activeMenuId === folder.id;

    return (
      <div key={folder.id} className="w-full">
        {/* Folder row */}
        <div
          className="group flex items-center justify-between rounded-md h-8 px-2 hover:bg-zinc-800/40 text-zinc-350 hover:text-zinc-200 transition-colors cursor-pointer select-none relative"
          style={{ paddingLeft: `${depth * 10 + 6}px` }}
        >
          <div
            onClick={() => toggleFolder(folder.id)}
            className="flex items-center gap-1.5 flex-1 min-w-0"
          >
            <span className="text-zinc-650 shrink-0">
              {isExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
            </span>
            <span className="text-amber-550/80 shrink-0">
              {isExpanded ? <FolderOpen size={13} /> : <FolderIcon size={13} />}
            </span>
            <span className="text-[13px] font-medium truncate select-none leading-none pt-0.5">
              {folder.name}
            </span>
          </div>

          {/* Actions Container with Direct Shortcuts */}
          <div className="flex items-center gap-0.5 shrink-0">
            {/* Create Note Shortcut */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCreateNote(folder.id);
              }}
              className="opacity-80 md:opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-700/80 text-zinc-500 hover:text-violet-400 rounded shrink-0 transition-all cursor-pointer"
              title="Create note inside this folder"
            >
              <Plus size={13} />
            </button>

            {/* Delete Folder Shortcut */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFolder(folder.id);
              }}
              className="opacity-80 md:opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-700/80 text-zinc-500 hover:text-rose-400 rounded shrink-0 transition-all cursor-pointer"
              title="Delete folder"
            >
              <Trash2 size={13} />
            </button>

            {/* More Options Dropdown Trigger */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenuId(isMenuOpen ? null : folder.id);
              }}
              className="opacity-80 md:opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-700/80 text-zinc-500 hover:text-zinc-200 rounded shrink-0 transition-all cursor-pointer"
              title="More folder options"
            >
              <MoreVertical size={13} />
            </button>
          </div>

          {/* Options Dropdown Menu */}
          {isMenuOpen && (
            <>
              {/* Click-outside backdrop overlay to close menu */}
              <div
                className="fixed inset-0 z-40 cursor-default"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuId(null);
                }}
              />
              
              <div
                className="absolute right-2 top-7 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 py-1 w-40 text-left"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => handleCreateNote(folder.id)}
                  className="w-full px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={12} className="text-violet-400" />
                  Create Note
                </button>
                <button
                  onClick={() => handleCreateFolder(folder.id)}
                  className="w-full px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center gap-2 cursor-pointer"
                >
                  <FolderPlus size={12} className="text-amber-550" />
                  Create Folder
                </button>
                <button
                  onClick={() => handleRenameFolder(folder.id, folder.name)}
                  className="w-full px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center gap-2 cursor-pointer"
                >
                  <Edit3 size={12} className="text-zinc-400" />
                  Rename Folder
                </button>
                <div className="w-full h-px bg-zinc-800 my-1" />
                <button
                  onClick={() => handleDeleteFolder(folder.id)}
                  className="w-full px-3 py-1.5 text-xs text-rose-400 hover:bg-zinc-800 hover:text-rose-300 flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 size={12} className="text-rose-500" />
                  Delete Folder
                </button>
              </div>
            </>
          )}
        </div>

        {/* Nested content items */}
        {isExpanded && hasChildren && (
          <div className="w-full">
            {childFolders.map((subfolder) => renderFolderNode(subfolder, depth + 1))}
            {childNotes.map((note) => renderNoteNode(note, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Render a note file node (flat, tldraw-like link list)
  const renderNoteNode = (note: Note, depth = 0) => {
    const isActive = activeNoteId === note.id;
    return (
      <div
        key={note.id}
        onClick={() => handleNoteClick(note.id)}
        className={`
          flex items-center gap-2 rounded-md h-8 px-3 text-[13px] transition-colors cursor-pointer select-none
          ${
            isActive
              ? "bg-[#2c2c2c] text-white font-bold"
              : "text-zinc-455 hover:bg-[#252525] hover:text-zinc-250"
          }
        `}
        style={{ paddingLeft: `${depth * 10 + 24}px` }}
      >
        <span className="truncate select-none flex-1">{note.title}</span>
        {note.isPinned && (
          <span className="text-[8.5px] px-1 bg-amber-950/50 border border-amber-900/60 text-amber-450 rounded shrink-0">
            PIN
          </span>
        )}
      </div>
    );
  };

  const rootFolders = filteredFolders.filter((f) => f.parentId === null);
  const rootNotes = filteredNotes.filter((n) => n.folderId === null);

  return (
    <div className="flex flex-col p-2 space-y-1">
      {rootFolders.length === 0 && rootNotes.length === 0 && (
        <div className="text-center text-[11px] text-zinc-650 font-patrick italic py-6 select-none">
          {searchQuery.trim() ? "No search results match." : "Workspace is empty."}
        </div>
      )}

      {/* Folders list */}
      {rootFolders.map((folder) => renderFolderNode(folder, 0))}

      {/* Root files list */}
      {rootNotes.map((note) => renderNoteNode(note, 0))}

      <PromptModal
        isOpen={promptState.isOpen}
        title={promptState.title}
        placeholder={promptState.placeholder}
        defaultValue={promptState.defaultValue}
        submitLabel={promptState.submitLabel}
        onSubmit={(val) => {
          promptState.onSubmit(val);
          setPromptState((prev) => ({ ...prev, isOpen: false }));
        }}
        onClose={() => setPromptState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
