"use client";

import React, { useState, useEffect, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  X,
  FileText,
  Folder as FolderIcon,
  LogOut,
  Settings,
  User,
} from "lucide-react";

import { signOut } from "@/app/(app)/api/v1/auth/signOut/action";
import NoteFiles from "./NoteFiles";
import PromptModal from "./PromptModal";

interface SidebarProps {
  user?: string | null;
}

export default function Sidebar({ user: initialUser }: SidebarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [userProfile, setUserProfile] = useState<{ name: string; email: string } | null>(null);
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

  // Fetch real logged-in user details
  useEffect(() => {
    fetch("/api/v1/user/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setUserProfile({
            name: data.profile.name,
            email: data.profile.email,
          });
        }
      })
      .catch((err) => console.error("Failed to load user profile", err));
  }, []);

  const handleSignOutInternal = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  const handleBrandClick = () => {
    router.push("/home")
  }

  const handleCreateNoteRoot = () => {
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
              folderId: null,
              tags: [],
            }),
          }).then((r) => r.json());

          if (res.success) {
            window.dispatchEvent(new Event("refresh-sidebar"));
            router.push(`/text-note?id=${res.note.id}`);
          } else {
            alert(res.message || "Failed to create note");
          }
        } catch (e) {
          console.error(e);
        }
      },
    });
  };

  const handleCreateFolderRoot = () => {
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
            body: JSON.stringify({ name, parentID: null }),
          }).then((r) => r.json());

          if (res.success) {
            window.dispatchEvent(new Event("refresh-sidebar"));
          } else {
            alert(res.message || "Failed to create folder");
          }
        } catch (e) {
          console.error(e);
        }
      },
    });
  };

  const activeName = userProfile?.name || initialUser || "User";
  const activeEmail = userProfile?.email || "user@syntasnote.com";

  return (
    <aside className="w-64 h-screen shrink-0 bg-[#1e1e1e] border-r border-zinc-800 flex flex-col z-35 relative text-zinc-300">
      {/* 1. Header logo branding */}
      <div className="h-14 flex items-center px-4 border-b border-zinc-900 shrink-0">
        <div className="flex items-center gap-2">
          <button>
            <Image
              src="https://res.cloudinary.com/dxojgqsrh/image/upload/v1781777178/digi-cloudinary/images/te4ms9jzxhwq89yfjkfc.png"
              alt="SyntaxNote logo"
              onClick={handleBrandClick}
              width={24}
              height={24}
              className="shrink-0 opacity-90"
            />
          </button>
          <span className="font-caveat font-bold text-xl text-zinc-100 tracking-wide">
            SyntaxNote
          </span>
        </div>
      </div>

      {/* 3. Search input bar */}
      <div className="px-4 py-1.5 shrink-0">
        <div className="flex items-center gap-2 w-full h-9 px-3 rounded-lg border border-zinc-850 bg-zinc-900/40 focus-within:border-zinc-700 transition-colors">
          <Search size={14} className="text-zinc-555 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-zinc-200 text-xs outline-none w-full placeholder-zinc-600"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-zinc-500 hover:text-zinc-200 shrink-0 cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* 4. Action buttons: New note / New folder */}
      <div className="px-4 py-1.5 shrink-0 flex gap-2">
        <button
          onClick={handleCreateNoteRoot}
          className="flex-1 flex items-center justify-center gap-2 h-9 px-3 rounded-lg border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800 text-zinc-200 text-xs font-patrick font-bold cursor-pointer transition-colors"
        >
          <FileText size={13} className="text-violet-400" />
          <span>New note</span>
        </button>
        <button
          onClick={handleCreateFolderRoot}
          className="grow-0 flex items-center justify-center h-9 w-9 rounded-lg border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors"
          title="New folder at root"
        >
          <FolderIcon size={13} className="text-amber-550" />
        </button>
      </div>

      <div className="w-full h-px bg-zinc-900 mt-2 shrink-0" />

      {/* 5. Main scrollable tree section */}
      <div className="flex-1 overflow-y-auto">
        <NoteFiles searchQuery={searchQuery} />
      </div>

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

      {/* 6. Footer Profile / Settings */}
      <div className="p-3 border-t border-zinc-900 bg-zinc-950/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-violet-650 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {activeName[0].toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-patrick text-sm font-bold text-zinc-200 leading-tight truncate">
              {activeName}
            </span>
            <span className="text-[9px] font-sans text-zinc-550 truncate">
              {activeEmail}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => router.push("/profile")}
            className="p-1.5 hover:bg-zinc-900 text-zinc-500 hover:text-zinc-200 rounded-lg cursor-pointer transition-colors shrink-0"
            title="Profile"
          >
            <User size={14} />
          </button>
          <button
            onClick={() => router.push("/settings")}
            className="p-1.5 hover:bg-zinc-900 text-zinc-500 hover:text-zinc-200 rounded-lg cursor-pointer transition-colors shrink-0"
            title="Settings"
          >
            <Settings size={14} />
          </button>
          <button
            onClick={handleSignOutInternal}
            disabled={isPending}
            className="p-1.5 hover:bg-zinc-900 text-zinc-500 hover:text-rose-400 rounded-lg cursor-pointer transition-colors shrink-0"
            title="Sign Out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
