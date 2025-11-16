"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlowNodeWrapper } from "./flowNode";
import { useFormBuilder } from "@/store/useFormBuilder";

// Configuration object for the flow editor
const FLOW_CONFIG = {
    minZoom: 0.5,
    maxZoom: 1.5,
    zoomStep: 0.1,
    defaultZoom: 1,
    gridSize: 34,
} as const;

interface ViewportState {
    x: number;
    y: number;
    zoom: number;
}

export default function FlowEditor() {
    const { selectedQuestion, questions, setSelectedQuestionId } = useFormBuilder();
    const containerRef = useRef<HTMLDivElement>(null);
    const [viewport, setViewport] = useState<ViewportState>({
        x: 0,
        y: 0,
        zoom: FLOW_CONFIG.defaultZoom,
    });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [lastPointerPos, setLastPointerPos] = useState({ x: 0, y: 0 });

    // Handle mouse down for starting drag
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button === 0) {
            e.preventDefault();
            setIsDragging(true);
            setDragStart({ x: e.clientX, y: e.clientY });
            setLastPointerPos({ x: e.clientX, y: e.clientY });
        }
    }, []);

    // Handle mouse move for dragging
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        // Remove the mouse move logic from here since we handle it globally
        // This prevents double movement
    }, []);

    // Handle mouse up for ending drag
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Handle wheel event for zooming
    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();

        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate zoom direction and amount
        const zoomDirection = e.deltaY > 0 ? -1 : 1;
        const newZoom = Math.max(
            FLOW_CONFIG.minZoom,
            Math.min(
                FLOW_CONFIG.maxZoom,
                viewport.zoom + (zoomDirection * FLOW_CONFIG.zoomStep)
            )
        );

        if (newZoom !== viewport.zoom) {
            // Calculate zoom center point
            const zoomFactor = newZoom / viewport.zoom;
            const newX = viewport.x - (mouseX - viewport.x) * (zoomFactor - 1);
            const newY = viewport.y - (mouseY - viewport.y) * (zoomFactor - 1);

            setViewport({
                x: newX,
                y: newY,
                zoom: newZoom,
            });
        }
    }, [viewport]);

    // Add global mouse event listeners for dragging
    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const deltaX = e.clientX - lastPointerPos.x;
                const deltaY = e.clientY - lastPointerPos.y;

                setViewport(prev => ({
                    ...prev,
                    x: prev.x + deltaX,
                    y: prev.y + deltaY,
                }));

                setLastPointerPos({ x: e.clientX, y: e.clientY });
            }
        };

        const handleGlobalMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging, lastPointerPos]);

    return (
        <div className="relative flex-1 h-full w-full">
            <div
                ref={containerRef}
                className="flex-1 relative w-full h-full overflow-hidden select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onWheel={handleWheel}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
                {/* Grid Background */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-40"
                    style={{
                        backgroundImage: `radial-gradient(circle, var(--foreground) ${viewport.zoom}px, transparent ${viewport.zoom}px)`,
                        backgroundSize: `${30 * viewport.zoom}px ${30 * viewport.zoom}px`,
                        backgroundPosition: `${viewport.x % (30 * viewport.zoom)}px ${viewport.y % (30 * viewport.zoom)}px`,
                    }}
                />
                {/* Grid Background for Dark Mode */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-30 dark:block hidden"
                    style={{
                        backgroundImage: `radial-gradient(circle, #94a3b8 ${viewport.zoom}px, transparent ${viewport.zoom}px)`,
                        backgroundSize: `${30 * viewport.zoom}px ${30 * viewport.zoom}px`,
                        backgroundPosition: `${viewport.x % (30 * viewport.zoom)}px ${viewport.y % (30 * viewport.zoom)}px`,
                    }}
                />

                {/* Content Area - This is where you'll add your flow nodes */}
                <FlowNodeWrapper nodes={questions} x={viewport.x} y={viewport.y} zoom={viewport.zoom} />
            </div >
            {/* Zoom Controls */}
            <div className="absolute bottom-4 left-4 flex gap-2 z-[999]" onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                <div className="bg-secondary rounded px-2 py-1 text-xs text-center min-w-[60px] w-52 flex items-center justify-center gap-3">
                    <Slider
                        value={[((viewport.zoom - FLOW_CONFIG.minZoom) / (FLOW_CONFIG.maxZoom - FLOW_CONFIG.minZoom)) * 100]}
                        max={100}
                        step={1}
                        onValueChange={(value) => {
                            const newZoom = FLOW_CONFIG.minZoom + (value[0] / 100) * (FLOW_CONFIG.maxZoom - FLOW_CONFIG.minZoom);
                            setViewport(prev => ({
                                ...prev,
                                zoom: newZoom
                            }));
                        }}
                    />
                    <span>{Math.round(viewport.zoom * 100)}%</span>
                </div>
                <Button
                    variant={'secondary'}
                    size={'icon'}
                    onClick={() => setViewport(prev => ({
                        ...prev,
                        zoom: Math.min(FLOW_CONFIG.maxZoom, prev.zoom + FLOW_CONFIG.zoomStep)
                    }))}
                    disabled={viewport.zoom >= FLOW_CONFIG.maxZoom}
                >
                    <Plus />
                </Button>
                <Button
                    variant={'secondary'}
                    size={'icon'}
                    onClick={() => setViewport(prev => ({
                        ...prev,
                        zoom: Math.max(FLOW_CONFIG.minZoom, prev.zoom - FLOW_CONFIG.zoomStep)
                    }))}
                    disabled={viewport.zoom <= FLOW_CONFIG.minZoom}
                >
                    <Minus />
                </Button>
                <Button
                    variant={'secondary'}
                    size={'icon'}
                    onClick={() => setViewport({
                        x: 0,
                        y: 0,
                        zoom: FLOW_CONFIG.defaultZoom
                    })}
                >
                    <RotateCcw />
                </Button>
            </div>
        </div>
    );
}
