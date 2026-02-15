"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { FaSearchPlus, FaSearchMinus, FaUndo, FaArrowLeft, FaArrowRight, FaArrowUp, FaArrowDown } from "@/lib/icons";

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 5; // Increased from 2 to 5 (500%)
const ZOOM_STEP = 0.25;
const PAN_STEP = 50; // pixels to move per arrow click

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, className = "" }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Zoom handlers
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Pan handlers
  const handlePanLeft = () => {
    setPosition((prev) => ({ ...prev, x: prev.x + PAN_STEP }));
  };

  const handlePanRight = () => {
    setPosition((prev) => ({ ...prev, x: prev.x - PAN_STEP }));
  };

  const handlePanUp = () => {
    setPosition((prev) => ({ ...prev, y: prev.y + PAN_STEP }));
  };

  const handlePanDown = () => {
    setPosition((prev) => ({ ...prev, y: prev.y - PAN_STEP }));
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    // Initialize mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: "dark",
      themeVariables: {
        primaryColor: "#00BFFF",
        primaryTextColor: "#fff",
        primaryBorderColor: "#00BFFF",
        lineColor: "#00BFFF",
        secondaryColor: "#4CAF50",
        tertiaryColor: "#FF9800",
        background: "#1c1c22",
        mainBkg: "#27272c",
        secondBkg: "#2a2a30",
        mainContrastColor: "#fff",
        darkMode: true,
        fontFamily: "JetBrains Mono, monospace",
      },
      flowchart: {
        nodeSpacing: 30,
        rankSpacing: 40,
        padding: 10,
        useMaxWidth: true,
        htmlLabels: true,
        curve: "basis"
      }
    });

    // Render the chart
    if (elementRef.current) {
      // Generate unique ID for this diagram
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

      // Clear previous content
      elementRef.current.innerHTML = "";

      // Create a div for the diagram
      const diagramDiv = document.createElement("div");
      diagramDiv.className = "mermaid";
      diagramDiv.innerHTML = chart;
      elementRef.current.appendChild(diagramDiv);

      // Render with mermaid
      mermaid.contentLoaded();
    }
  }, [chart]);

  return (
    <div className={`relative ${className}`}>
      {/* Zoom and Pan Controls - Top Right */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-gray-900/80 backdrop-blur-sm rounded-lg p-1 border border-purple-500/30">
          {(zoom !== 1 || position.x !== 0 || position.y !== 0) && (
            <button
              onClick={handleResetZoom}
              className="p-2 rounded-md hover:bg-purple-500/20 text-white/70 hover:text-purple-400 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              aria-label="Reset zoom and position"
              title="Reset zoom and position"
            >
              <FaUndo className="w-3 h-3" aria-hidden="true" />
            </button>
          )}

          <button
            onClick={handleZoomOut}
            disabled={zoom <= MIN_ZOOM}
            className="p-2 rounded-md hover:bg-purple-500/20 text-white/70 hover:text-purple-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            aria-label="Zoom out"
            title={`Zoom out (${Math.round(zoom * 100)}%)`}
          >
            <FaSearchMinus className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <span className="text-xs text-white/60 min-w-[50px] text-center font-mono">
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            disabled={zoom >= MAX_ZOOM}
            className="p-2 rounded-md hover:bg-purple-500/20 text-white/70 hover:text-purple-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            aria-label="Zoom in"
            title={`Zoom in (${Math.round(zoom * 100)}%)`}
          >
            <FaSearchPlus className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Pan Controls */}
        <div className="flex flex-col items-center gap-1 bg-gray-900/80 backdrop-blur-sm rounded-lg p-1 border border-purple-500/30">
          <button
            onClick={handlePanUp}
            className="p-1.5 rounded-md hover:bg-purple-500/20 text-white/70 hover:text-purple-400 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            aria-label="Pan up"
            title="Pan up"
          >
            <FaArrowUp className="w-3 h-3" aria-hidden="true" />
          </button>
          <div className="flex gap-1">
            <button
              onClick={handlePanLeft}
              className="p-1.5 rounded-md hover:bg-purple-500/20 text-white/70 hover:text-purple-400 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              aria-label="Pan left"
              title="Pan left"
            >
              <FaArrowLeft className="w-3 h-3" aria-hidden="true" />
            </button>
            <button
              onClick={handlePanRight}
              className="p-1.5 rounded-md hover:bg-purple-500/20 text-white/70 hover:text-purple-400 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              aria-label="Pan right"
              title="Pan right"
            >
              <FaArrowRight className="w-3 h-3" aria-hidden="true" />
            </button>
          </div>
          <button
            onClick={handlePanDown}
            className="p-1.5 rounded-md hover:bg-purple-500/20 text-white/70 hover:text-purple-400 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            aria-label="Pan down"
            title="Pan down"
          >
            <FaArrowDown className="w-3 h-3" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Diagram Container */}
      <div
        ref={containerRef}
        className={`mermaid-container bg-gray-900/50 border border-secondary-default/20 rounded-xl p-6 pt-14 overflow-hidden flex justify-center items-center ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ textAlign: 'center', minHeight: '400px', position: 'relative' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={elementRef}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out'
          }}
        />
      </div>
    </div>
  );
};

export default MermaidDiagram;
