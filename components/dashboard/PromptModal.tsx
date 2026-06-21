"use client";
import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface PromptModalProps {
  isOpen: boolean;
  title: string;
  placeholder?: string;
  defaultValue?: string;
  submitLabel?: string;
  onSubmit: (value: string) => void;
  onClose: () => void;
}

export default function PromptModal({
  isOpen,
  title,
  placeholder = "Enter text...",
  defaultValue = "",
  submitLabel = "Submit",
  onSubmit,
  onClose,
}: PromptModalProps) {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync value with defaultValue when modal opens
  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
      setError("");
      // Auto-focus input
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isOpen, defaultValue]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) {
      setError("⚠️ Value cannot be empty.");
      return;
    }
    onSubmit(value.trim());
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md select-none font-patrick">
      <div className="relative w-full p-4 mx-4" style={{ maxWidth: "380px" }}>
        {/* Washi Decals on the Corners */}
        <div className="absolute top-0 left-4 w-12 h-4 bg-yellow-200/40 border-x border-dashed border-yellow-400/30 transform -rotate-12 pointer-events-none z-10" />
        <div className="absolute top-0 right-4 w-12 h-4 bg-yellow-200/40 border-x border-dashed border-yellow-400/30 transform rotate-12 pointer-events-none z-10" />

        {/* Outer Index Card Wrapper */}
        <div className="relative bg-[#fbfbf8] border-2 border-neutral-300 rounded shadow-2xl p-6 pt-8 text-slate-800 border-dashed">
          {/* Top red header ruled line of index card */}
          <div className="absolute top-6 left-0 right-0 h-[1.5px] bg-red-400/50" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-1 right-1 p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Pencil Mascot (styled SVG) */}
          <div className="flex flex-col items-center mb-4 mt-2">
            <div className="relative w-14 h-14">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Pencil Yellow Body */}
                <path
                  d="M35 15 L65 15 L65 70 L35 70 Z"
                  fill="#fbbf24"
                  stroke="#475569"
                  strokeWidth="2.5"
                />
                {/* Pencil Tip (Wood) */}
                <path
                  d="M35 70 L50 90 L65 70 Z"
                  fill="#fef3c7"
                  stroke="#475569"
                  strokeWidth="2.5"
                />
                {/* Lead Tip */}
                <path d="M45 83 L50 90 L55 83 Z" fill="#475569" />
                {/* Pink Eraser */}
                <path
                  d="M35 15 C35 5, 65 5, 65 15 Z"
                  fill="#f43f5e"
                  stroke="#475569"
                  strokeWidth="2.5"
                />
                <circle cx="43" cy="40" r="3.5" fill="#1e293b" />
                <circle cx="57" cy="40" r="3.5" fill="#1e293b" />
                <path
                  d="M45 52 Q50 56 55 52"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <h3 className="text-center font-caveat text-2xl font-bold text-violet-750 tracking-wide mb-3 drop-shadow-sm">
            {title}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (error) setError("");
                }}
                className="w-full px-3 py-1.5 bg-white/70 border border-slate-300 rounded font-patrick text-md text-slate-800 focus:outline-none focus:border-violet-500 transition-colors shadow-sm placeholder-slate-400 font-medium"
                placeholder={placeholder}
              />
              {error && (
                <p className="text-[11px] text-red-500 mt-1 font-bold">
                  {error}
                </p>
              )}
            </div>

            {/* Buttons Row */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-patrick text-sm font-bold rounded border border-slate-300 cursor-pointer transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="
                  flex-1 relative py-1.5 bg-[#fee2e2]/95 hover:bg-[#fecaca] text-rose-800 border-x-2 border-dashed border-rose-400/50
                  font-patrick text-sm font-bold shadow-sm hover:shadow-md transition-all cursor-pointer w-full text-center
                "
              >
                {submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
