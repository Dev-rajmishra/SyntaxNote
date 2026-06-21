"use client";

import React from "react";
import { EditorContent, Editor } from "@tiptap/react";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Heading1,
  Heading2,
  Code,
  List,
  CheckCircle2,
  AlertCircle,
  CornerDownRight,
} from "lucide-react";
import { GrammarSuggestion } from "./types";

interface EditorPanelProps {
  editor: Editor | null;
  isAutoSaved: boolean;
  grammarSuggestions: GrammarSuggestion[];
  fixGrammar: (suggestion: GrammarSuggestion) => void;
  viewMode: "split" | "full";
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  editor,
  isAutoSaved,
  grammarSuggestions,
  fixGrammar,
  viewMode,
}) => {
  // Stats Counters
  const wordCount = editor
    ? editor.getText().trim()
      ? editor.getText().trim().split(/\s+/).length
      : 0
    : 0;
  const charCount = editor ? editor.getText().length : 0;

  const toolbarButtons = [
    {
      icon: <BoldIcon size={14} />,
      title: "Bold",
      action: () => editor?.chain().focus().toggleBold().run(),
      isActive: editor?.isActive("bold"),
    },
    {
      icon: <ItalicIcon size={14} />,
      title: "Italic",
      action: () => editor?.chain().focus().toggleItalic().run(),
      isActive: editor?.isActive("italic"),
    },
    {
      icon: <Heading1 size={14} />,
      title: "Heading 1",
      action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor?.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 size={14} />,
      title: "Heading 2",
      action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor?.isActive("heading", { level: 2 }),
    },
    {
      icon: <Code size={14} />,
      title: "Code Block",
      action: () => editor?.chain().focus().toggleCodeBlock().run(),
      isActive: editor?.isActive("codeBlock"),
    },
    {
      icon: <List size={14} />,
      title: "Bullet List",
      action: () => editor?.chain().focus().toggleBulletList().run(),
      isActive: editor?.isActive("bulletList"),
    },
  ];

  return (
    <div className={`flex flex-col justify-between pr-0 transition-all duration-300 ${
      viewMode === "full"
        ? "w-full md:pr-0 border-r-0"
        : "w-full md:w-[50%] md:pr-3 border-r-0 md:border-r border-slate-300/70"
    }`}>
      {/* Editor toolbar */}
      <div className="flex flex-wrap items-center gap-1 bg-slate-100/80 border border-slate-300 rounded p-1 mb-2">
        {toolbarButtons.map((btn, idx) => (
          <button
            key={idx}
            type="button"
            onClick={btn.action}
            className={`p-1.5 rounded transition-colors  cursor-pointer ${
              btn.isActive
                ? "bg-violet-650 text-black shadow-sm"
                : "text-slate-500 hover:bg-slate-200 hover:text-slate-800"
            }`}
            title={btn.title}
          >
            {btn.icon}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-1.5 px-2 text-[10px] text-slate-500 font-sans border-l border-slate-300">
          <CheckCircle2
            size={10}
            className={isAutoSaved ? "text-emerald-500" : "text-slate-550 animate-spin"}
          />
          <span>{isAutoSaved ? "Saved" : "Syncing..."}</span>
        </div>
      </div>

      {/* Editor Container */}
      <div className="grow relative rounded border border-dashed border-neutral-300 bg-white focus-within:ring-2 focus-within:ring-violet-300/20 transition-all min-h-95 flex flex-col z-10 overflow-hidden shadow-sm">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.035] filter blur-[0.8px] z-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            className="w-72 h-72 fill-current text-slate-800"
          >
            <path d="M20 150 L180 150 L180 170 L20 170 Z" />
            <path d="M25 120 L175 120 L175 145 L25 145 Z" />
            <path d="M35 90 L165 90 L165 115 L35 115 Z" />
            <rect x="55" y="45" width="8" height="35" rx="1" fill="white" />
          </svg>
        </div>

        <EditorContent editor={editor} className="w-full h-full relative z-10 flex flex-col" />
      </div>

      {/* Grammar Suggestions */}
      <div className="mt-3 border-t border-slate-300 pt-2">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-inter mb-1.5 flex items-center gap-1.5">
          <AlertCircle size={10} className={grammarSuggestions.length > 0 ? "text-amber-500" : "text-emerald-500"} />
          <span>Grammar Corrections ({grammarSuggestions.length})</span>
          {grammarSuggestions.length > 0 && (
            <span className="ml-auto text-[9px] text-slate-400 italic normal-case tracking-normal font-sans">
              Click Fix to apply
            </span>
          )}
        </div>

        {grammarSuggestions.length === 0 ? (
          <div className="text-slate-400 font-patrick text-xs italic py-1">
            No issues found. Click "Check Grammar" to scan your note.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-1 pb-1">
            {grammarSuggestions.map((sug, idx) => (
              <div
                key={idx}
                className="shrink-0 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 flex items-center gap-2 shadow-sm hover:border-amber-400 transition-colors"
              >
                <div className="flex flex-col text-[10px] leading-tight max-w-44">
                  <div className="flex items-center gap-1">
                    <span className="line-through text-rose-500 font-mono">{sug.text}</span>
                    <CornerDownRight size={8} className="text-slate-400 shrink-0" />
                    <span className="font-bold text-emerald-700 font-mono">{sug.suggestion}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-sans mt-0.5 truncate max-w-44">{sug.message}</span>
                </div>
                <button
                  onClick={() => fixGrammar(sug)}
                  className="px-2 py-0.5 text-[9px] font-bold font-sans bg-emerald-600 hover:bg-emerald-700 text-white rounded-md cursor-pointer shrink-0 transition-colors"
                >
                  Fix
                </button>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Stats Footer */}
      <div className="flex justify-between items-center text-slate-400 font-patrick text-xs border-t border-slate-300 pt-2 select-text">
        <span>
          Words: <strong className="text-slate-350">{wordCount}</strong> | Characters:{" "}
          <strong className="text-slate-350">{charCount}</strong>
        </span>
        <span className="italic">WYSIWYG TipTap Active</span>
      </div>
    </div>
  );
};
