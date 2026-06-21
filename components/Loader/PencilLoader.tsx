"use client";

import React from "react";
import { Pencil } from "lucide-react";

interface PencilLoaderProps {
  text?: string;
  subtitle?: string;
  className?: string;
}

export default function PencilLoader({
  text = "Inking notebook lines...",
  subtitle = "Preparing light parchment wood desk...",
  className = "fixed inset-0 z-50",
}: PencilLoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center bg-[#fbfbf8] select-none font-patrick ${className}`}>
      {/* Animated Pencil Sketching SVG */}
      <div className="w-48 h-48 relative flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Page Outline — draws continuously */}
          <rect
            x="20" y="20" width="60" height="60" rx="4"
            fill="none" stroke="#4b5563" strokeWidth="2.5"
            className="animate-draw-line-loop"
          />

          {/* Red Margin — staggered */}
          <line
            x1="38" y1="25" x2="38" y2="75"
            stroke="#ff8ca3" strokeWidth="1.5"
            className="animate-draw-line-loop"
            style={{ animationDelay: "0.3s" }}
          />

          {/* Ruled lines — each staggered */}
          <line x1="25" y1="40" x2="75" y2="40" stroke="#a3c5f5" strokeWidth="1.5" className="animate-draw-line-loop" style={{ animationDelay: "0.5s" }} />
          <line x1="25" y1="50" x2="75" y2="50" stroke="#a3c5f5" strokeWidth="1.5" className="animate-draw-line-loop" style={{ animationDelay: "0.7s" }} />
          <line x1="25" y1="60" x2="75" y2="60" stroke="#a3c5f5" strokeWidth="1.5" className="animate-draw-line-loop" style={{ animationDelay: "0.9s" }} />
          <line x1="25" y1="70" x2="75" y2="70" stroke="#a3c5f5" strokeWidth="1.5" className="animate-draw-line-loop" style={{ animationDelay: "1.1s" }} />
        </svg>

        {/* Lucide Pencil Icon — moves in an infinite loop */}
        <div className="absolute top-0 left-0 w-8 h-8 animate-pencil-move-loop text-slate-700 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
          <Pencil className="w-full h-full stroke-2" />
        </div>
      </div>

      <h2 className="font-caveat text-3xl font-bold text-slate-700 m-0 mt-4 animate-pulse">
        {text}
      </h2>
      {subtitle && (
        <p className="font-patrick text-sm text-slate-400 mt-1.5 italic">
          {subtitle}
        </p>
      )}

      {/* CSS Animations — infinite loops, never pause */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Lines draw in, hold, then fade and repeat */
        @keyframes draw-line-loop {
          0% {
            stroke-dashoffset: 240;
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          55% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          75% {
            stroke-dashoffset: 0;
            opacity: 0.3;
          }
          100% {
            stroke-dashoffset: 240;
            opacity: 0;
          }
        }
        .animate-draw-line-loop {
          stroke-dasharray: 240;
          stroke-dashoffset: 240;
          animation: draw-line-loop 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        /* Pencil traces a continuous writing path — infinite */
        @keyframes pencil-move-loop {
          0%   { transform: translate(22px, 22px) rotate(-45deg); }
          12%  { transform: translate(75px, 30px) rotate(-45deg); }
          24%  { transform: translate(40px, 45px) rotate(-45deg); }
          36%  { transform: translate(78px, 52px) rotate(-45deg); }
          48%  { transform: translate(30px, 60px) rotate(-45deg); }
          60%  { transform: translate(78px, 70px) rotate(-45deg); }
          72%  { transform: translate(40px, 78px) rotate(-45deg); }
          85%  { transform: translate(70px, 78px) rotate(-45deg); }
          100% { transform: translate(22px, 22px) rotate(-45deg); }
        }
        .animate-pencil-move-loop {
          animation: pencil-move-loop 2.0s linear infinite;
        }
      `}} />
    </div>
  );
}
