"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NotebookPage from "@/components/background/NoteBookBg";
import PencilLoader from "@/components/Loader/PencilLoader";
import {
  FileText,
  Pin,
  Heart,
  Trash2,
  Folder,
  Tag,
  Plus,
  RefreshCw,
  Lock,
  Unlock,
  ChevronRight,
  ChevronDown,
  ArrowRight
} from "lucide-react";

// Types
interface DraftNote {
  id: number;
  title: string;
  category: string;
  isPinned: boolean;
  isFavorite: boolean;
}

interface GraphNode {
  id: number;
  label: string;
  x: number;
  y: number;
  color: string;
}

interface GraphLink {
  source: number;
  target: number;
}

export default function RecreatedHomePage() {
  const router = useRouter();
  
  // App Loader state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loaderText, setLoaderText] = useState<string>("Tearing paper sheets...");

  // Load timer simulation
  useEffect(() => {
    const texts = [
      "Inking notebook lines...",
      "Binding margins...",
      "Sharpening graphite pencil...",
      "Stamping catalog card..."
    ];
    
    let textIdx = 0;
    const interval = setInterval(() => {
      if (textIdx < texts.length) {
        setLoaderText(texts[textIdx]);
        textIdx++;
      }
    }, 400);

    const timer = setTimeout(() => {
      setIsLoading(false);
      clearInterval(interval);
    }, 1800);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // Section Scrolling references
  const scrollToSection = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // --- INTERACTIVE SANDBOX STATES ---

  // 1. Foundations Note Index Pad
  const [draftNotes, setDraftNotes] = useState<DraftNote[]>([
    { id: 1, title: "Chemistry Lab Log", category: "University", isPinned: true, isFavorite: true },
    { id: 2, title: "Side Project Draft", category: "Work", isPinned: false, isFavorite: false },
    { id: 3, title: "Lemon Pie Recipe", category: "Personal", isPinned: false, isFavorite: true }
  ]);
  const [newDraftTitle, setNewDraftTitle] = useState<string>("");

  const addDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDraftTitle.trim()) return;
    const categories = ["University", "Work", "Personal"];
    const newNote: DraftNote = {
      id: Date.now(),
      title: newDraftTitle,
      category: categories[Math.floor(Math.random() * categories.length)],
      isPinned: false,
      isFavorite: false
    };
    setDraftNotes([newNote, ...draftNotes]);
    setNewDraftTitle("");
  };

  const togglePinDraft = (id: number) => {
    setDraftNotes(draftNotes.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n));
  };

  const toggleFavDraft = (id: number) => {
    setDraftNotes(draftNotes.map(n => n.id === id ? { ...n, isFavorite: !n.isFavorite } : n));
  };

  const deleteDraft = (id: number) => {
    setDraftNotes(draftNotes.filter(n => n.id !== id));
  };

  // 2. Editor & Markdown Formatting Cheatsheet
  const [activeFormat, setActiveFormat] = useState<string>("headings");
  const formatCodeMap: Record<string, { raw: string; preview: React.ReactNode }> = {
    headings: {
      raw: "# Inked Heading 1\n## Subheading 2",
      preview: (
        <div className="space-y-1">
          <h3 className="font-patrick text-2xl font-bold border-b border-dashed border-slate-350 pb-0.5 m-0 text-slate-800">Inked Heading 1</h3>
          <h4 className="font-patrick text-xl font-bold m-0 text-slate-700">Subheading 2</h4>
        </div>
      )
    },
    code: {
      raw: "Standard `inline code` blocks\n```js\nconsole.log('Notebook compiler success!');\n```",
      preview: (
        <div className="space-y-1.5 font-patrick text-slate-700">
          <div>Standard <code className="px-1 py-0.5 bg-neutral-200 text-neutral-805 font-mono text-xs rounded">inline code</code> blocks</div>
          <pre className="p-2.5 bg-slate-100 border border-slate-300 rounded font-mono text-[11px] text-slate-800 overflow-x-auto">
            {`// compiled script\nconsole.log('Notebook compiler success!');`}
          </pre>
        </div>
      )
    },
    math: {
      raw: "$$ E = mc^2 $$\n$$ x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a} $$",
      preview: (
        <div className="space-y-2.5 py-1 text-center font-serif text-slate-850">
          <div className="p-2 rounded bg-amber-50 border border-amber-200 shadow-sm rotate-[-0.5deg]">
            E = mc²
          </div>
          <div className="p-2 rounded bg-amber-50 border border-amber-200 shadow-sm rotate-[0.5deg] text-sm">
            x = (-b ± √(b² - 4ac)) / 2a
          </div>
        </div>
      )
    },
    charts: {
      raw: "```mermaid\ngraph TD;\n  Ideas-->Drafts-->Stamps;\n```",
      preview: (
        <div className="p-3.5 border border-dashed border-purple-300 bg-purple-50/40 rounded-xl text-center font-gochi text-xs text-purple-805 shadow-[2px_2px_4px_rgba(0,0,0,0.02)] select-none">
          <div className="font-bold border-b border-purple-200/50 pb-1 mb-1.5">Mermaid Chart Flow</div>
          <div className="flex justify-around items-center gap-1">
            <span className="px-1.5 py-0.5 border border-purple-300 bg-white rounded shadow-sm">Ideas</span>
            <span>➔</span>
            <span className="px-1.5 py-0.5 border border-purple-300 bg-white rounded shadow-sm">Drafts</span>
            <span>➔</span>
            <span className="px-1.5 py-0.5 border border-purple-300 bg-white rounded shadow-sm">Stamps</span>
          </div>
        </div>
      )
    }
  };

  // 3. Folder Directory Tree simulator
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    root: true,
    uni: true,
    work: false
  });
  const [activeFolderFilter] = useState<string>("All");
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const toggleFolder = (folderKey: string) => {
    setExpandedFolders(prev => ({ ...prev, [folderKey]: !prev[folderKey] }));
  };

  const simulatedNotes = [
    { title: "Quantum Physics.md", folder: "uni", tags: ["#academic", "#notes"] },
    { title: "Organic Chemistry.md", folder: "uni", tags: ["#academic", "#chemistry"] },
    { title: "Refactoring Checklist.md", folder: "work", tags: ["#todo", "#dev"] },
    { title: "Weekly Tasks.md", folder: "root", tags: ["#todo", "#personal"] }
  ];

  const filteredSimNotes = simulatedNotes.filter(note => {
    if (activeFolderFilter !== "All" && note.folder !== activeFolderFilter) return false;
    if (selectedTag !== "All" && !note.tags.includes(selectedTag)) return false;
    return true;
  });

  // 4. Wiki Links & Network Graph
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([
    { id: 1, label: "Quantum Physics ⚛️", x: 120, y: 70, color: "bg-amber-100 border-amber-300 text-amber-800" },
    { id: 2, label: "Relativity Theory 🌌", x: 280, y: 50, color: "bg-purple-100 border-purple-300 text-purple-805" },
    { id: 3, label: "Chemistry Lab 🧪", x: 70, y: 200, color: "bg-emerald-100 border-emerald-300 text-emerald-805" },
    { id: 4, label: "Math Equations 📐", x: 260, y: 190, color: "bg-sky-100 border-sky-300 text-sky-850" },
    { id: 5, label: "Central Archive 📅", x: 180, y: 130, color: "bg-pink-100 border-pink-300 text-pink-805" }
  ]);
  const [graphLinks] = useState<GraphLink[]>([
    { source: 1, target: 2 },
    { source: 1, target: 5 },
    { source: 3, target: 5 },
    { source: 4, target: 5 },
    { source: 2, target: 3 }
  ]);
  const [draggingNodeId, setDraggingNodeId] = useState<number | null>(null);

  const handleGraphNodeDown = (e: React.PointerEvent<SVGGElement>, id: number) => {
    e.stopPropagation();
    setDraggingNodeId(id);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleGraphNodeMove = (e: React.PointerEvent<SVGGElement>, id: number) => {
    if (draggingNodeId !== id) return;
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    
    const localX = Math.max(20, Math.min(rect.width - 20, e.clientX - rect.left));
    const localY = Math.max(20, Math.min(rect.height - 20, e.clientY - rect.top));

    setGraphNodes(prev =>
      prev.map(n => (n.id === id ? { ...n, x: localX, y: localY } : n))
    );
  };

  const handleGraphNodeUp = (e: React.PointerEvent<SVGGElement>, id: number) => {
    setDraggingNodeId(null);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // 5. AI Assistant Typewriter Study Tools
  const [aiChat, setAiChat] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "ai", text: "Welcome! Click one of the study macro options below to simulate inking action items." }
  ]);
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);

  const triggerAiResponse = (prompt: string, response: string) => {
    if (isAiTyping) return;
    setAiChat(prev => [...prev, { sender: "user", text: prompt }]);
    setIsAiTyping(true);

    let typedText = "";
    let i = 0;
    
    const interval = setInterval(() => {
      if (i < response.length) {
        typedText += response.charAt(i);
        setAiChat(prev => {
          const list = [...prev];
          if (list[list.length - 1]?.sender === "ai" && list.length > 1) {
            list[list.length - 1] = { sender: "ai", text: typedText };
            return list;
          } else {
            return [...list, { sender: "ai", text: typedText }];
          }
        });
        i++;
      } else {
        clearInterval(interval);
        setIsAiTyping(false);
      }
    }, 20);
  };

  // 6. Security Private Folder Vault
  const [passcode, setPasscode] = useState<string>("");
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [vaultError, setVaultError] = useState<string | null>(null);

  const handleKeypadPress = (val: string) => {
    setVaultError(null);
    if (passcode.length < 4) {
      const newPass = passcode + val;
      setPasscode(newPass);
      
      if (newPass === "1234") {
        setTimeout(() => {
          setIsUnlocked(true);
          setPasscode("");
        }, 300);
      } else if (newPass.length === 4) {
        setTimeout(() => {
          setVaultError("⚠️ Invalid passcode code!");
          setPasscode("");
        }, 300);
      }
    }
  };

  const handleLockVault = () => {
    setIsUnlocked(false);
    setPasscode("");
    setVaultError(null);
  };

  // --- GUEST STAMPS LOG ---
  const [guestStamps, setGuestStamps] = useState<string[]>([]);
  const stampQuotes = [
    "APPROVED INK ✏️",
    "VISITED CATALOG 🎟️",
    "NO FINES CHARGED 💸",
    "SCHOLAR CHECK-IN 📖",
    "RAW CSS STAMPED 🎨",
    "DRAFT APPROVED ✍️",
  ];

  useEffect(() => {
    const saved = localStorage.getItem("syntaxnote_guest_stamps");
    if (saved) {
      setGuestStamps(JSON.parse(saved));
    }
  }, []);

  const addStamp = () => {
    if (guestStamps.length >= 6) {
      alert("🎟️ Your check-in card is full! Double-click to erase.");
      return;
    }
    const randQuote = stampQuotes[Math.floor(Math.random() * stampQuotes.length)];
    const dateStr = new Date().toLocaleDateString([], { month: "short", day: "numeric" });
    const fullStamp = `${randQuote} • ${dateStr}`;
    const updated = [...guestStamps, fullStamp];
    setGuestStamps(updated);
    localStorage.setItem("syntaxnote_guest_stamps", JSON.stringify(updated));
  };

  const clearStamps = () => {
    setGuestStamps([]);
    localStorage.removeItem("syntaxnote_guest_stamps");
  };

  // Render Loader if active
  if (isLoading) {
    return <PencilLoader text={loaderText} />;
  }

  return (
    <div className="w-full bg-[#fcfaf2] text-slate-800 flex flex-col font-patrick relative">
      {/* Centered open catalog binder */}
      <div className="w-full flex flex-col grow items-stretch">
        {/* RULED DOUBLE PAGE CONTAINER */}
        <NotebookPage
          showTornEdge={false}
          className="border border-slate-300 overflow-hidden"
        >
          {/* Catalog Contents Wrapper */}
          <div className="space-y-12">
            {/* Header branding */}
            <div className="text-center mt-20 border-b border-dashed border-slate-300/60">
              <h1 className="font-caveat text-5xl font-bold text-slate-850 m-0 tracking-wide">
                SyntaxNote Catalog Chronicles
              </h1>
              <p className="font-patrick  text-lg text-slate-500 mt-10 max-w-md mx-auto leading-snug">
                Browse our complete, logical features listing index. Drag,
                interact, or lock directories to test the UI!
              </p>
              <a
                href="/mdNote"
                className="mt-8 inline-flex items-center gap-1.5 px-6 py-2 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 text-emerald-800 font-bold rounded-lg transition-transform hover:scale-103 cursor-pointer shadow-sm"
              >
                <span>Launch Main Editor Workspace</span>
                <ArrowRight size={14} />
              </a>
            </div>

            {/* SECTION 1: NOTE FOUNDATIONS */}
            <section
              id="core"
              className="grid grid-cols-1 md:grid-cols-12 gap-7 items-center border-b border-dashed border-slate-300/50 pb-6 mt-3"
            >
              <div className="md:col-span-6 space-y-2.5 ml-6">
                <div className="inline-block px-2 py-0.5 bg-amber-100 text-amber-850 text-xs font-bold uppercase rounded border border-amber-300 select-none">
                  Foundations Chapter 📝
                </div>
                <h3 className="font-caveat text-3xl  font-bold m-0 text-slate-850">
                  1. Note Creation & management
                </h3>
                <p className="text-[15px] text-slate-650 leading-relaxed m-0">
                  Build the core repository of your mind. Supports creating
                  organic Markdown notes, plaintext notes, pinning critical
                  documents to the top, favoriting core drafts, and
                  manual/auto-saving backup history.
                </p>
                <div className="text-xs font-sans mt-1 text-slate-400 italic">
                  💡 Sandbox: Pin, Favorite, or Delete drafts in the index
                  sheet!
                </div>
              </div>

              {/* Note Index Sandbox */}
              <div className="md:col-span-6 bg-white/85 border border-slate-300 rounded-xl p-4 shadow-sm">
                <form onSubmit={addDraft} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Create a new draft title..."
                    value={newDraftTitle}
                    onChange={(e) => setNewDraftTitle(e.target.value)}
                    className="grow px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs focus:outline-none focus:border-violet-500"
                    maxLength={25}
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded text-xs flex items-center justify-center cursor-pointer shadow-sm"
                  >
                    <Plus size={13} />
                  </button>
                </form>

                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {draftNotes.length === 0 ? (
                    <div className="text-center text-slate-400 text-xs py-4 font-sans">
                      No drafts remain. Click add!
                    </div>
                  ) : (
                    draftNotes.map((note) => (
                      <div
                        key={note.id}
                        className="flex justify-between items-center px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs hover:border-slate-300 transition-colors"
                      >
                        <span className="font-patrick font-bold text-slate-750 flex items-center gap-1.5">
                          <FileText size={11} className="text-slate-450" />
                          <span>{note.title}</span>
                          <span className="text-[10px] px-1 bg-slate-200 text-slate-500 rounded">
                            {note.category}
                          </span>
                        </span>

                        <div className="flex gap-2 text-slate-400 select-none">
                          <button
                            onClick={() => togglePinDraft(note.id)}
                            className={`hover:text-rose-500 cursor-pointer ${note.isPinned ? "text-rose-600" : ""}`}
                          >
                            <Pin
                              size={11}
                              className={note.isPinned ? "fill-rose-600" : ""}
                            />
                          </button>
                          <button
                            onClick={() => toggleFavDraft(note.id)}
                            className={`hover:text-red-500 cursor-pointer ${note.isFavorite ? "text-red-500" : ""}`}
                          >
                            <Heart
                              size={11}
                              className={note.isFavorite ? "fill-red-500" : ""}
                            />
                          </button>
                          <button
                            onClick={() => deleteDraft(note.id)}
                            className="hover:text-slate-700 cursor-pointer"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* SECTION 2: TEXT EDITOR & MD */}
            <section
              id="editor"
              className="grid grid-cols-1 md:grid-cols-12 gap-7 items-center border-b border-dashed border-slate-300/50 pb-8 mt-3 ml-5"
            >
              <div className="md:col-span-6 space-y-2.5">
                <div className="inline-block px-2 py-0.5 bg-sky-100 text-sky-850 text-xs font-bold uppercase rounded border border-sky-300 select-none">
                  Formatting Chapter ✍️
                </div>
                <h3 className="font-caveat text-3xl font-bold m-0 text-slate-850">
                  2. Text Editor & Markdown
                </h3>
                <p className="text-[15px] text-slate-650 leading-relaxed m-2">
                  Write with syntax highlighted markdown rules, headings, list
                  markers, and tables. Access math block support via LaTeX
                  equations and diagram visualizations via Mermaid charts.
                </p>
                <div className="text-xs font-sans mt-2 text-slate-400 italic">
                  💡 Sandbox: Click macro formats to preview compilation
                  outputs!
                </div>
              </div>

              {/* Cheatsheet Sandbox */}
              <div className="md:col-span-6 flex flex-col border border-slate-300 rounded-xl bg-white/80 overflow-hidden shadow-sm min-h-40">
                <div className="bg-slate-100 border-b border-slate-200 px-2.5 py-1.5 flex gap-1 select-none text-[11px] font-sans">
                  {["headings", "code", "math", "charts"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveFormat(t)}
                      className={`px-2 py-0.5 rounded cursor-pointer capitalize ${
                        activeFormat === t
                          ? "bg-slate-800 text-white font-bold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-25 items-center">
                  <div className="bg-slate-55 p-2 border border-slate-200 rounded text-[11px] font-mono text-slate-700 whitespace-pre-wrap select-text leading-tight">
                    {formatCodeMap[activeFormat].raw}
                  </div>
                  <div className="border border-slate-250/60 p-2.5 rounded bg-[#fdfbf7]">
                    {formatCodeMap[activeFormat].preview}
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3: DIRECTORY TAG ORGANIZER */}
            <section
              id="folders"
              className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center border-b border-dashed border-slate-300/50 pb-8 mt-3 ml-5"
            >
              <div className="md:col-span-6 space-y-2.5">
                <div className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-850 text-xs font-bold uppercase rounded border border-emerald-300 select-none">
                  Structure Chapter 📁
                </div>
                <h3 className="font-caveat text-3xl font-bold m-0 text-slate-850">
                  3. Nested Directories & Tag Filters
                </h3>
                <p className="text-[15px] text-slate-650 leading-relaxed m-0">
                  Organize your notebook with nested folders, move files between
                  directories, and tag individual notes. Use the advanced tags
                  checklist to filter content quickly across headings or text
                  values.
                </p>
                <div className="text-xs font-sans mt-1 text-slate-400 italic">
                  💡 Sandbox: Expand folders or select tag bubbles to filter
                  notes!
                </div>
              </div>

              {/* Folder Tree Sandbox */}
              <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white/80 border border-slate-300 rounded-xl p-3 shadow-sm text-xs min-h-40">
                {/* Simulated folder tree */}
                <div className="sm:col-span-5 border-r border-slate-200 pr-2 space-y-2 select-none">
                  <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Notebook Tree
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => toggleFolder("root")}
                      className="flex items-center gap-1 cursor-pointer font-patrick text-slate-800"
                    >
                      {expandedFolders.root ? (
                        <ChevronDown size={11} />
                      ) : (
                        <ChevronRight size={11} />
                      )}
                      <Folder
                        size={11}
                        className="text-amber-500 fill-amber-500/20"
                      />
                      <span>Workspace Root</span>
                    </button>

                    {expandedFolders.root && (
                      <div className="pl-4 space-y-1">
                        <button
                          onClick={() => toggleFolder("uni")}
                          className="flex items-center gap-1 cursor-pointer font-patrick text-slate-700"
                        >
                          {expandedFolders.uni ? (
                            <ChevronDown size={11} />
                          ) : (
                            <ChevronRight size={11} />
                          )}
                          <Folder
                            size={11}
                            className="text-amber-500 fill-amber-500/20"
                          />
                          <span>University/</span>
                        </button>

                        <button
                          onClick={() => toggleFolder("work")}
                          className="flex items-center gap-1 cursor-pointer font-patrick text-slate-700"
                        >
                          {expandedFolders.work ? (
                            <ChevronDown size={11} />
                          ) : (
                            <ChevronRight size={11} />
                          )}
                          <Folder
                            size={11}
                            className="text-amber-500 fill-amber-500/20"
                          />
                          <span>Work Projects/</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Filter and note outputs */}
                <div className="sm:col-span-7 flex flex-col justify-between pl-1">
                  <div className="flex flex-wrap gap-1.5 mb-2 select-none">
                    {["All", "#academic", "#todo", "#personal"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTag(t)}
                        className={`px-1.5 py-0.5 rounded-full border text-[10px] cursor-pointer ${
                          selectedTag === t
                            ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                            : "bg-slate-50 border-slate-300 text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1 grow overflow-y-auto max-h-25 pr-1">
                    {filteredSimNotes.length === 0 ? (
                      <div className="text-center text-slate-400 italic py-4">
                        No matching notes in catalog.
                      </div>
                    ) : (
                      filteredSimNotes.map((note, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center px-2 py-1 bg-slate-50 border border-slate-200 rounded"
                        >
                          <span className="font-patrick font-medium text-slate-700">
                            {note.title}
                          </span>
                          <span className="text-[9px] text-slate-400">
                            {note.tags.join(" ")}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4: WIKI LINKS & GRAPH */}
            <section
              id="graph"
              className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center border-b border-dashed border-slate-300/50 pb-8 mt-3 ml-5"
            >
              <div className="md:col-span-6 space-y-2.5">
                <div className="inline-block px-2 py-0.5 bg-purple-100 text-purple-850 text-xs font-bold uppercase rounded border border-purple-300 select-none">
                  Connections Chapter 🕸️
                </div>
                <h3 className="font-caveat text-3xl font-bold m-0 text-slate-850">
                  4. Wiki Linking & Backlink Graphs
                </h3>
                <p className="text-[15px] text-slate-650 leading-relaxed m-0">
                  Build relationships between documents. Create wiki linkages
                  like <code>[[Quantum Physics]]</code> in the editor,
                  auto-reveal backlinks, and browse notes visually on a
                  connected network graph.
                </p>
                <div className="text-xs font-sans text-slate-400 italic">
                  💡 Sandbox: Click and drag graph note nodes to watch the links
                  stretch!
                </div>
              </div>

              {/* Connected Graph Sandbox */}
              <div className="md:col-span-6 border border-slate-300 bg-white/80 rounded-xl overflow-hidden min-h-45 shadow-sm relative">
                <svg className="w-full h-full min-h-32.5 bg-slate-50/50 select-none">
                  {graphLinks.map((link, idx) => {
                    const s = graphNodes.find((n) => n.id === link.source);
                    const t = graphNodes.find((n) => n.id === link.target);
                    if (!s || !t) return null;
                    return (
                      <line
                        key={idx}
                        x1={s.x}
                        y1={s.y}
                        x2={t.x}
                        y2={t.y}
                        stroke="#10b981"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        className="opacity-70"
                      />
                    );
                  })}

                  {graphNodes.map((node) => (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onPointerDown={(e) => handleGraphNodeDown(e, node.id)}
                      onPointerMove={(e) => handleGraphNodeMove(e, node.id)}
                      onPointerUp={(e) => handleGraphNodeUp(e, node.id)}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <circle
                        r="10"
                        className="fill-emerald-400 stroke-emerald-500 stroke-2 animate-pulse"
                      />
                      <foreignObject x="-50" y="12" width="100" height="24">
                        <div
                          className={`px-1 rounded border text-[9px] font-gochi text-center select-none shadow-sm ${node.color}`}
                        >
                          {node.label}
                        </div>
                      </foreignObject>
                    </g>
                  ))}
                </svg>

                <button
                  onClick={() =>
                    setGraphNodes([
                      {
                        id: 1,
                        label: "Quantum Physics ⚛️",
                        x: 120,
                        y: 70,
                        color: "bg-amber-100 border-amber-300 text-amber-800",
                      },
                      {
                        id: 2,
                        label: "Relativity Theory 🌌",
                        x: 280,
                        y: 50,
                        color:
                          "bg-purple-100 border-purple-300 text-purple-805",
                      },
                      {
                        id: 3,
                        label: "Chemistry Lab 🧪",
                        x: 70,
                        y: 200,
                        color:
                          "bg-emerald-100 border-emerald-300 text-emerald-805",
                      },
                      {
                        id: 4,
                        label: "Math Equations 📐",
                        x: 260,
                        y: 190,
                        color: "bg-sky-100 border-sky-300 text-sky-850",
                      },
                      {
                        id: 5,
                        label: "Central Archive 📅",
                        x: 180,
                        y: 130,
                        color: "bg-pink-100 border-pink-300 text-pink-805",
                      },
                    ])
                  }
                  className="absolute top-2 right-2 p-1 bg-white hover:bg-slate-50 border border-slate-200 rounded shadow-sm text-slate-400 hover:text-slate-650 cursor-pointer"
                >
                  <RefreshCw size={11} />
                </button>
              </div>
            </section>

            {/* SECTION 5: AI COMPANION */}
            <section
              id="ai"
              className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center border-b border-dashed border-slate-300/50 pb-8 mt-3 ml-5"
            >
              <div className="md:col-span-6 space-y-2.5">
                <div className="inline-block px-2 py-0.5 bg-rose-100 text-rose-850 text-xs font-bold uppercase rounded border border-rose-300 select-none">
                  AI Chapter 🧠
                </div>
                <h3 className="font-caveat text-3xl font-bold m-0 text-slate-850">
                  5. AI Assistant & Study Tools
                </h3>
                <p className="text-[15px] text-slate-650 leading-relaxed m-0">
                  Formulate notes faster with AI assistance. Summarize pages,
                  generate flashcards, create study quizzes, explain highlighted
                  text, and convert recordings to text via Speech-to-Text
                  transcription.
                </p>
                <div className="text-xs mt-1 font-sans text-slate-400 italic">
                  💡 Sandbox: Ask the AI for summaries or quizzes below!
                </div>
              </div>

              {/* AI Assistant Sandbox */}
              <div className="md:col-span-6 flex flex-col border border-slate-300 rounded-xl bg-white/80 shadow-sm overflow-hidden min-h-45">
                <div className="grow p-3 overflow-y-auto space-y-2 max-h-32.5 flex flex-col text-xs leading-normal">
                  {aiChat.map((msg, i) => (
                    <div
                      key={i}
                      className={`max-w-[85%] rounded-lg px-2.5 py-1.5 shadow-sm ${
                        msg.sender === "user"
                          ? "self-end bg-purple-100 border border-purple-200 text-purple-950 font-patrick"
                          : "self-start bg-[#fdfbf7] border border-slate-200 text-slate-750 font-gochi"
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                  {isAiTyping && (
                    <div className="self-start bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[10px] text-slate-400 font-sans italic flex gap-1 items-center">
                      <RefreshCw size={9} className="animate-spin" />
                      <span>Writing...</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-250/60 bg-slate-50 p-1.5 flex gap-1 justify-around select-none text-[10px]">
                  <button
                    disabled={isAiTyping}
                    onClick={() =>
                      triggerAiResponse(
                        "📝 Summarize note draft",
                        "Summary:\n- Auto-saving handles draft recovery.\n- Local storage prevents note losses.",
                      )
                    }
                    className="px-2 py-1 bg-white border border-slate-300 hover:bg-purple-50 text-purple-700 font-sans rounded cursor-pointer disabled:opacity-50"
                  >
                    📝 Summarize Draft
                  </button>
                  <button
                    disabled={isAiTyping}
                    onClick={() =>
                      triggerAiResponse(
                        "❓ Create study quiz",
                        "Notebook Quiz:\nQ1: What are wiki links?\nQ2: Explain backlink graphs.",
                      )
                    }
                    className="px-2 py-1 bg-white border border-slate-300 hover:bg-purple-50 text-purple-700 font-sans rounded cursor-pointer disabled:opacity-50"
                  >
                    ❓ Create Quiz
                  </button>
                </div>
              </div>
            </section>

            {/* SECTION 6: VAULT SECURITY & SYNC */}
            <section
              id="security"
              className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center border-b border-dashed border-slate-300/50 pb-8 mt-3 ml-5"
            >
              <div className="md:col-span-6 space-y-2.5">
                <div className="inline-block px-2 py-0.5 bg-orange-100 text-orange-850 text-xs font-bold uppercase rounded border border-orange-300 select-none">
                  Privacy Chapter 🔒
                </div>
                <h3 className="font-caveat text-3xl font-bold m-0 text-slate-850">
                  6. Folder Security & Sync
                </h3>
                <p className="text-[15px] text-slate-650 leading-relaxed m-0">
                  Protect private information with password locks. Features
                  local end-to-end encryption, OAuth logins, real-time shared
                  collaboration, version histories, and PWA cross-device
                  synchronization.
                </p>
                <div className="text-xs font-sans mt-1 text-slate-400 italic">
                  💡 Sandbox: Enter passcode <strong>"1234"</strong> to unlock
                  the private file vault!
                </div>
              </div>

              {/* Private Folder Sandbox */}
              <div className="md:col-span-6 bg-white/85 border border-slate-300 rounded-xl p-3.5 shadow-sm text-xs min-h-40 flex items-center justify-center">
                {!isUnlocked ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-1.5 text-rose-705 font-bold font-patrick uppercase">
                      <Lock size={13} className="animate-bounce" />
                      <span>Vault Locked</span>
                    </div>

                    <div className="flex gap-1.5 select-none">
                      {["*", "*", "*", "*"].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center font-bold ${
                            passcode.length > i
                              ? "bg-slate-850 border-slate-855 text-white"
                              : "bg-slate-50"
                          }`}
                        >
                          {passcode.length > i ? "•" : ""}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 select-none font-sans">
                      {["1", "2", "3", "4"].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleKeypadPress(num)}
                          className="w-8 h-8 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold flex items-center justify-center cursor-pointer active:scale-95 text-slate-800"
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        onClick={() => setPasscode("")}
                        className="w-16 h-8 col-span-2 rounded border border-slate-200 bg-rose-50 text-rose-707 hover:bg-rose-100 font-bold flex items-center justify-center cursor-pointer text-[10px]"
                      >
                        Reset
                      </button>
                    </div>
                    {vaultError && (
                      <div className="text-[10px] text-red-500 font-sans">
                        {vaultError}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full text-center space-y-2 font-patrick">
                    <div className="flex items-center justify-center gap-1 text-emerald-707 font-bold uppercase">
                      <Unlock size={13} />
                      <span>Vault Unlocked</span>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-250 rounded-lg text-emerald-800 rotate-[-0.5deg] text-[13px] shadow-sm select-text">
                      🔑 <strong>Private Draft:</strong> "Startup idea: A
                      physical typewriter that automatically pushes to a GitHub
                      repository."
                    </div>
                    <button
                      onClick={handleLockVault}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-202 border border-slate-300 rounded font-sans text-[10px] font-bold text-slate-700 cursor-pointer shadow-sm select-none"
                    >
                      Re-lock Cabinet
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* SECTION 7: STAMPS CARD */}
            <section
              id="card"
              className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center border-b border-dashed border-slate-300/50 pb-8 mt-3 ml-5"
            >
              <div className="md:col-span-6 space-y-2.5">
                <div className="inline-block px-2 py-0.5 bg-violet-100 text-violet-850 text-xs font-bold uppercase rounded border border-violet-355 select-none">
                 Stamps Card 🎟️
                </div>
                <h3 className="font-caveat text-3xl font-bold m-0 text-slate-850">
                7. Visitor check-in Card
                </h3>
                <p className="text-[15px] text-slate-650 leading-relaxed m-0">
                  Track your catalog checkout details. Stamping a check-in card
                  helps verify that you check off notebook library logs with
                  authentic ink.
                </p>
                <div className="text-xs mt-1 font-sans text-slate-400 italic">
                  💡 Sandbox: Add random check-in stamps to fill your index
                  card!
                </div>
              </div>

              {/* Stamps card widget */}
              <div className="md:col-span-6 relative p-5 bg-[#faf8f2] border-2 border-slate-300 border-dashed rounded-xl shadow-sm min-h-40 flex flex-col justify-between">
                <div className="flex justify-between items-center select-none">
                  <span className="font-caveat font-bold text-sm text-slate-500">
                    Cardholder Catalog Index
                  </span>
                  <div className="flex gap-2 text-[10px] font-sans">
                    <button
                      onClick={addStamp}
                      className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-850 hover:bg-emerald-200 border border-emerald-250 cursor-pointer font-bold"
                    >
                      Add Stamp
                    </button>
                    <button
                      onClick={clearStamps}
                      className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-250 cursor-pointer font-bold"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-3 select-none">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-11 border border-slate-200 rounded-lg flex items-center justify-center text-[10px] font-gochi text-purple-700 text-center font-bold px-1 rotate-[-1.5deg] shadow-[inset_0.5px_0.5px_2px_rgba(0,0,0,0.03)] ${
                        guestStamps[i]
                          ? "bg-purple-50/70 border-purple-300 shadow-sm border-double border-2"
                          : "bg-slate-50/50"
                      }`}
                    >
                      {guestStamps[i] ? guestStamps[i] : `${i + 1}`}
                    </div>
                  ))}
                </div>

                <div className="text-[10px] text-slate-400 text-center font-sans">
                  Visitor stamps card syncs automatically to browser local
                  storage.
                </div>
              </div>
            </section>
          </div>
        </NotebookPage>
      </div>
    </div>
  );
}
