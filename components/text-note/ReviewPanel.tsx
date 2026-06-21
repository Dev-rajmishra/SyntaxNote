"use client";

import React from "react";
import { Folder, Note } from "@/lib/db";
import {
  FileCode,
  Tag,
  BookOpen,
  Pin,
  Heart,
  FolderOpen,
  Trash2,
  Plus,
  FileText,
} from "lucide-react";

interface ReviewPanelProps {
  activeRightTab: "preview" | "organization" | "files";
  setActiveRightTab: (tab: "preview" | "organization" | "files") => void;
  content: string;
  isPinned: boolean;
  setIsPinned: (p: boolean) => void;
  isFavorite: boolean;
  setIsFavorite: (f: boolean) => void;
  folderId: string | null;
  setFolderId: (id: string | null) => void;
  allFolders: Folder[];
  getFolderLabel: (f: Folder) => string;
  tags: string[];
  newTagName: string;
  setNewTagName: (t: string) => void;
  handleAddTag: (e: React.FormEvent) => void;
  handleRemoveTag: (t: string) => void;
  allNotes: Note[];
  noteId: string | null;
  loadingList: boolean;
  newDraftTitle: string;
  setNewDraftTitle: (t: string) => void;
  handleCreateDraft: (e: React.FormEvent) => Promise<void>;
  handleTogglePinNote: (n: Note) => Promise<void>;
  handleToggleFavoriteNote: (n: Note) => Promise<void>;
  handleDeleteNoteFromList: (n: Note) => Promise<void>;
  handleSelectNote: (id: string) => void;
  handleDeleteFolder: (folderId: string) => Promise<void>;
  setIsAutoSaved: (isAutoSaved: boolean) => void;
}

export const ReviewPanel: React.FC<ReviewPanelProps> = ({
  activeRightTab,
  setActiveRightTab,
  content,
  isPinned,
  setIsPinned,
  isFavorite,
  setIsFavorite,
  folderId,
  setFolderId,
  allFolders,
  getFolderLabel,
  tags,
  newTagName,
  setNewTagName,
  handleAddTag,
  handleRemoveTag,
  allNotes,
  noteId,
  loadingList,
  newDraftTitle,
  setNewDraftTitle,
  handleCreateDraft,
  handleTogglePinNote,
  handleToggleFavoriteNote,
  handleDeleteNoteFromList,
  handleSelectNote,
  handleDeleteFolder,
  setIsAutoSaved,
}) => {
  return (
    <div className="w-full md:w-[50%] flex flex-col justify-between pl-0 md:pl-3">
      <div className="flex items-center justify-between border-b-2 border-dashed border-neutral-300 pb-2 mb-2 z-20">
        <div className="flex gap-1.5">
          {/* Tab: HTML Preview */}
          <button
            onClick={() => setActiveRightTab("preview")}
            className={`px-2.5 py-1.5 text-xs rounded font-patrick flex items-center gap-1.5 transition-all cursor-pointer border ${
              activeRightTab === "preview"
                ? "border-violet-400 bg-violet-50 text-violet-700 font-bold"
                : "border-slate-300 bg-slate-100 text-slate-655 hover:bg-slate-200 hover:text-slate-800"
            }`}
          >
            <FileCode size={13} />
            <span>HTML Preview</span>
          </button>

          {/* Tab: Organization */}
          <button
            onClick={() => setActiveRightTab("organization")}
            className={`px-2.5 py-1.5 text-xs rounded font-patrick flex items-center gap-1.5 transition-all cursor-pointer border ${
              activeRightTab === "organization"
                ? "border-violet-400 bg-violet-50 text-violet-700 font-bold"
                : "border-slate-300 bg-slate-100 text-slate-655 hover:bg-slate-200 hover:text-slate-800"
            }`}
          >
            <Tag size={13} />
            <span>Organization</span>
          </button>

          {/* Tab: Saved Notes index */}
          <button
            onClick={() => setActiveRightTab("files")}
            className={`px-2.5 py-1.5 text-xs rounded font-patrick flex items-center gap-1.5 transition-all cursor-pointer border ${
              activeRightTab === "files"
                ? "border-violet-400 bg-violet-50 text-violet-700 font-bold"
                : "border-slate-300 bg-slate-100 text-slate-655 hover:bg-slate-200 hover:text-slate-800"
            }`}
          >
            <BookOpen size={13} />
            <span>Index list ({allNotes.length})</span>
          </button>
        </div>
      </div>

      {/* Right tab content body */}
      <div className="grow rounded border border-dashed border-neutral-300/80 bg-white min-h-95 overflow-hidden flex flex-col p-4 relative shadow-sm text-slate-700">
        {activeRightTab === "preview" ? (
          <div className="w-full h-full overflow-y-auto flex flex-col relative select-text">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] filter blur-[0.5px] z-0">
              <svg
                xmlns="http://www.w3.org/2500/svg"
                viewBox="0 0 24 24"
                className="w-64 h-64 fill-current text-slate-800"
              >
                <path d="M21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM11 19H3V6h8v13zm10 0h-8V6h8v13z" />
              </svg>
            </div>

            <div
              className="prose prose-slate max-w-none wrap-break-word grow select-text relative z-10 font-sans text-slate-855 pb-6
                prose-h1:text-[20px] prose-h1:font-bold prose-h1:border-b prose-h1:border-slate-200 prose-h1:pb-1 prose-h1:text-slate-900
                prose-h2:text-[17px] prose-h2:font-bold prose-h2:border-b prose-h2:border-dashed prose-h2:border-slate-200 prose-h2:pb-0.5 prose-h2:text-slate-900
                prose-p:text-sm prose-p:leading-relaxed prose-p:text-slate-650
                prose-li:text-sm prose-li:text-slate-650"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        ) : activeRightTab === "organization" ? (
          <div className="w-full h-full overflow-y-auto flex flex-col space-y-6">
            {/* 1. Pins and Favorites settings */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-inter block">
                Important Flags
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsPinned(!isPinned);
                    setIsAutoSaved(false);
                  }}
                  disabled={!noteId}
                  className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs transition-all cursor-pointer ${
                    isPinned
                      ? "bg-amber-100 border-amber-400 text-amber-800 font-bold"
                      : "bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-800"
                  } ${!noteId ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <Pin size={12} className={isPinned ? "fill-amber-800" : ""} />
                  <span>{isPinned ? "Pinned Note" : "Pin Note"}</span>
                </button>

                <button
                  onClick={() => {
                    setIsFavorite(!isFavorite);
                    setIsAutoSaved(false);
                  }}
                  disabled={!noteId}
                  className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs transition-all cursor-pointer ${
                    isFavorite
                      ? "bg-rose-100 border-rose-300 text-rose-800 font-bold"
                      : "bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-800"
                  } ${!noteId ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <Heart size={12} className={isFavorite ? "fill-rose-800" : ""} />
                  <span>{isFavorite ? "Favorited" : "Favorite"}</span>
                </button>
              </div>
            </div>

            {/* 2. Folder parent selection settings */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-inter block">
                Parent Folder Location
              </span>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 bg-slate-100 border border-slate-300 rounded-lg p-1.5">
                  <FolderOpen size={16} className="text-slate-500 shrink-0" />
                  <select
                    value={folderId || ""}
                    onChange={(e) => {
                      setFolderId(e.target.value || null);
                      setIsAutoSaved(false);
                    }}
                    disabled={!noteId}
                    className={`bg-transparent border-none text-slate-750 text-xs w-full outline-none cursor-pointer font-sans ${
                      !noteId ? "pointer-events-none" : ""
                    }`}
                  >
                    <option value="" className="bg-white text-slate-800">Root (No Folder)</option>
                    {allFolders.map((f) => (
                      <option key={f.id} value={f.id} className="bg-white text-slate-800">
                        {getFolderLabel(f)}
                      </option>
                    ))}
                  </select>
                </div>
                {folderId && (
                  <button
                    type="button"
                    onClick={() => handleDeleteFolder(folderId)}
                    className="px-3 py-1.5 border border-rose-300 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg text-xs flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                    title="Delete selected folder"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* 3. Note Tags management settings */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-inter block">
                Note Tags ({tags.length})
              </span>

              {/* Active tags badges */}
              <div className="flex flex-wrap gap-1.5 py-1">
                {tags.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No tags assigned.</span>
                ) : (
                  tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-slate-100 border border-slate-300 text-slate-600 rounded-full shadow-sm"
                    >
                      <Tag size={10} />
                      <span>{t}</span>
                      <button
                        onClick={() => handleRemoveTag(t)}
                        className="text-slate-450 hover:text-rose-600 font-bold ml-0.5 cursor-pointer"
                        title="Remove tag"
                      >
                        &times;
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Add tag form */}
              <form onSubmit={handleAddTag} className="flex gap-2 pt-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Add tag (e.g. research)..."
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  disabled={!noteId}
                  className="flex-1 bg-slate-100 border border-slate-300 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-violet-300 focus:border-violet-500"
                />
                <button
                  type="submit"
                  disabled={!noteId}
                  className="px-3.5 py-1.5 bg-violet-650 hover:bg-violet-500 text-white font-patrick text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Add Tag
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="w-full h-full overflow-y-auto flex flex-col">
            {/* Header branding / banner */}
            <div className="space-y-2.5 mb-4 border-b border-dashed border-slate-200 pb-3">
              <div className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded border border-amber-300 font-patrick select-none">
                Foundations Chapter 📝
              </div>
              <h3 className="font-caveat text-xl font-bold m-0 text-slate-800">
                1. Note Creation & management
              </h3>
              <p className="text-xs text-slate-500 leading-snug m-0 font-patrick">
                Build the core repository of your mind. Supports creating organic Markdown notes, plaintext notes,
                pinning critical documents to the top, favoriting core drafts, and manual/auto-saving backup history.
              </p>
              <div className="text-[9px] font-sans mt-0.5 text-slate-400 italic">
                💡 Sandbox: Pin, Favorite, or Delete drafts in the index sheet!
              </div>
            </div>

            {/* Create Note Input Form at the top */}
            <form onSubmit={handleCreateDraft} className="flex gap-2 mb-4 shrink-0">
              <input
                type="text"
                placeholder="Create a new draft title..."
                value={newDraftTitle}
                onChange={(e) => setNewDraftTitle(e.target.value)}
                className="grow px-3 py-1.5 bg-slate-55 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-violet-500 text-slate-700 font-sans"
                maxLength={50}
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-violet-650 hover:bg-violet-555 text-white rounded-lg text-xs flex items-center justify-center cursor-pointer shadow-sm transition-colors shrink-0"
              >
                <Plus size={13} />
              </button>
            </form>

            {loadingList ? (
              <div className="grow flex items-center justify-center font-patrick text-slate-500 text-sm">
                Loading notes index...
              </div>
            ) : allNotes.length === 0 ? (
              <div className="grow flex flex-col items-center justify-center text-center font-patrick text-slate-500 py-6">
                <p className="m-0 text-sm">No saved notes found.</p>
              </div>
            ) : (
              <div className="space-y-2 grow pr-1 overflow-y-auto">
                {allNotes.map((note) => {
                  const folder = allFolders.find((f) => f.id === note.folderId);
                  return (
                    <div
                      key={note.id}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all shadow-sm ${
                        note.id === noteId
                          ? "bg-violet-50 border-violet-300"
                          : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/50"
                      }`}
                    >
                      <div
                        onClick={() => handleSelectNote(note.id)}
                        className="grow flex items-center gap-1.5 cursor-pointer min-w-0"
                      >
                        <FileText size={13} className={`shrink-0 ${
                          note.id === noteId ? "text-violet-500" : "text-slate-450"
                        }`} />
                        <div className="flex flex-col min-w-0">
                          <span className={`font-patrick text-sm font-bold leading-tight truncate ${
                            note.id === noteId ? "text-violet-900" : "text-slate-750"
                          }`}>
                            {note.title}
                          </span>
                          <span className={`text-[9px] truncate ${
                            note.id === noteId ? "text-violet-650" : "text-slate-400"
                          }`}>
                            Updated {new Date(note.updatedAt).toLocaleTimeString()}
                          </span>
                        </div>
                        {folder && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-200/70 text-slate-500 rounded font-sans shrink-0 font-semibold max-w-20 truncate ml-1.5">
                            {folder.name}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-slate-400 select-none ml-2 shrink-0 z-40">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePinNote(note);
                          }}
                          className={`hover:text-rose-500 cursor-pointer transition-colors ${
                            note.isPinned ? "text-rose-600" : ""
                          }`}
                          title={note.isPinned ? "Unpin Note" : "Pin Note"}
                        >
                          <Pin
                            size={12}
                            className={note.isPinned ? "fill-rose-600" : ""}
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavoriteNote(note);
                          }}
                          className={`hover:text-red-500 cursor-pointer transition-colors ${
                            note.isFavorite ? "text-red-500" : ""
                          }`}
                          title={note.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                        >
                          <Heart
                            size={12}
                            className={note.isFavorite ? "fill-red-500" : ""}
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNoteFromList(note);
                          }}
                          className="hover:text-slate-700 cursor-pointer transition-colors"
                          title="Delete Note"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-center font-patrick text-[11px] text-slate-550 pt-2 select-none">
        Auto-saves modifications instantly. Check HTML or Organization tabs to edit attributes.
      </div>
    </div>
  );
};
