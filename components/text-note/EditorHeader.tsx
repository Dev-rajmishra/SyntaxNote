"use client";

import React from "react";
import {
  FileText,
  Check,
  Copy,
  Download,
  Trash2,
  Maximize2,
  Minimize2,
  Save,
} from "lucide-react";

interface EditorHeaderProps {
  title: string;
  setTitle: (title: string) => void;
  setIsAutoSaved: (isAutoSaved: boolean) => void;
  checkingGrammar: boolean;
  triggerGrammarCheck: () => Promise<void>;
  copyHtml: () => void;
  downloadMarkdownFile: () => void;
  triggerDeleteNote: () => Promise<void>;
  viewMode: "split" | "full";
  setViewMode: (mode: "split" | "full") => void;
  savingNote: boolean;
  triggerSaveNote: () => Promise<void>;
  hasNoteId: boolean;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  title,
  setTitle,
  setIsAutoSaved,
  checkingGrammar,
  triggerGrammarCheck,
  copyHtml,
  downloadMarkdownFile,
  triggerDeleteNote,
  viewMode,
  setViewMode,
  savingNote,
  triggerSaveNote,
  hasNoteId,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-dashed border-neutral-300 pb-3 z-20">
      <div className="flex items-center gap-2 text-slate-800 w-full sm:max-w-xs">
        <FileText size={18} className="text-violet-500 shrink-0" />
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setIsAutoSaved(false);
          }}
          className="bg-transparent border-none text-slate-800 font-patrick text-xl font-bold focus:outline-none focus:ring-1 focus:ring-violet-300 rounded px-1.5 w-full"
          placeholder="Note Title"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        {/* Grammar check */}
        <button
          onClick={triggerGrammarCheck}
          disabled={checkingGrammar}
          className={`px-3 py-1.5 text-xs rounded border border-slate-300 font-patrick text-slate-650 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
            checkingGrammar ? "animate-pulse pointer-events-none" : ""
          }`}
          title="Verify spelling and grammar"
        >
          <Check size={13} className={checkingGrammar ? "animate-spin" : ""} />
          <span>{checkingGrammar ? "Checking..." : "Check Grammar"}</span>
        </button>

        {/* Copy HTML */}
        <button
          onClick={copyHtml}
          className="px-3 py-1.5 text-xs rounded border border-slate-300 font-patrick text-slate-650 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          title="Copy compiled HTML code"
        >
          <Copy size={13} />
          <span>Copy HTML</span>
        </button>

        {/* Download */}
        <button
          onClick={downloadMarkdownFile}
          className="px-3 py-1.5 text-xs rounded border border-slate-300 font-patrick text-slate-655 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          title="Download document as HTML"
        >
          <Download size={13} />
          <span>Download</span>
        </button>

        {/* Delete Current Note */}
        <button
          onClick={triggerDeleteNote}
          disabled={!hasNoteId}
          className={`px-3 py-1.5 text-xs rounded border border-rose-300 font-patrick text-rose-700 bg-rose-50 hover:bg-rose-100 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
            !hasNoteId ? "opacity-50 pointer-events-none" : ""
          }`}
          title="Delete current note"
        >
          <Trash2 size={13} />
          <span>Delete</span>
        </button>

        {/* Layout view mode toggle */}
        <button
          onClick={() => setViewMode(viewMode === "split" ? "full" : "split")}
          className="px-3 py-1.5 text-xs rounded border border-slate-300 font-patrick text-slate-650 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          title={viewMode === "split" ? "Switch to full editor layout" : "Switch to split editor & review layout"}
        >
          {viewMode === "split" ? (
            <>
              <Maximize2 size={13} />
              <span>Only Editor</span>
            </>
          ) : (
            <>
              <Minimize2 size={13} />
              <span>Editor & Review</span>
            </>
          )}
        </button>

        {/* Save Note */}
        <button
          onClick={triggerSaveNote}
          disabled={savingNote || !hasNoteId}
          className={`px-4 py-1.5 text-xs rounded border border-violet-500 font-patrick text-black bg-violet-650 hover:bg-violet-555 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
            savingNote ? "animate-pulse pointer-events-none" : ""
          } ${!hasNoteId ? "opacity-50 pointer-events-none" : ""}`}
          title="Save note"
        >
          <Save size={13} />
          <span>{savingNote ? "Saving..." : "Save Note"}</span>
        </button>
      </div>
    </div>
  );
};
