"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useFormBuilder } from "@/store/useFormBuilder";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlowNode } from "./flowNode";
import FlowEdge from "./flowEdge";
import NewFlowEdge from "./newFlowEdge";

// Configuration
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
    const { questions, edges, addEdge } = useFormBuilder();

    const [edgesWithPositions, setEdgesWithPositions] = useState<any[]>([]);

    useEffect(() => {
        const edgesWithPositions = edges.map(edge => {
            const startNode = questions.find(q => q.id === edge.sourceNodeId);
            const endNode = questions.find(q => q.id === edge.targetNodeId);
            if (!startNode || !endNode) return edge;
            return {
                ...edge,
                position: {
                    x0: startNode.posX,
                    y0: startNode.posY,
                    x1: endNode.posX,
                    y1: endNode.posY,
                }
            };
        });
        setEdgesWithPositions(edgesWithPositions);
    }, [edges])

    // #region mouse control
    const [viewport, setViewport] = useState<ViewportState>({ x: 0, y: 0, zoom: FLOW_CONFIG.defaultZoom });
    const containerRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const currentViewport = useRef<ViewportState>(viewport);
    const lastPointerPos = useRef({ x: 0, y: 0 });
    const [newEdgeStart, setNewEdgeStart] = useState({ x: 0, y: 0 })
    const [newEdgeEnd, setNewEdgeEnd] = useState({ x: 0, y: 0 })

    const [isDragging, setIsDragging] = useState(false);
    const [isMakingNewEdgeFrom, setIsMakingNewEdgeFrom] = useState<string | null>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        // Only drag if clicking the background and left click
        if ((e.target !== containerRef.current && e.target !== viewportRef.current) || e.button !== 0) {
            return;
        }
        e.preventDefault();
        setIsDragging(true);
        lastPointerPos.current = { x: e.clientX, y: e.clientY };
        document.body.style.cursor = 'grabbing';
    }, []);

    const handleMouseUp = useCallback(() => {
        document.body.style.cursor = 'default';
    }, []);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const { x, y, zoom } = currentViewport.current;

        const zoomDirection = e.deltaY > 0 ? -1 : 1;
        const newZoom = Math.max(
            FLOW_CONFIG.minZoom,
            Math.min(
                FLOW_CONFIG.maxZoom,
                zoom + (zoomDirection * FLOW_CONFIG.zoomStep)
            )
        );

        if (newZoom !== zoom) {
            const zoomFactor = newZoom / zoom;
            const newX = x - (mouseX - x) * (zoomFactor - 1);
            const newY = y - (mouseY - y) * (zoomFactor - 1);
            setViewport({ x: newX, y: newY, zoom: newZoom });
        }
    }, []);

    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            const deltaX = e.clientX - lastPointerPos.current.x;
            const deltaY = e.clientY - lastPointerPos.current.y;

            currentViewport.current.x += deltaX;
            currentViewport.current.y += deltaY;

            lastPointerPos.current = { x: e.clientX, y: e.clientY };

            // 4. Update DOM directly (Bypass React)
            if (viewportRef.current) {
                viewportRef.current.style.transform =
                    `translate3d(${currentViewport.current.x}px, ${currentViewport.current.y}px, 0) scale(${currentViewport.current.zoom})`;
            }
        };

        const handleGlobalMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                // Commit final position to React state
                setViewport(currentViewport.current);
            }
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging]);

    useEffect(() => {
        currentViewport.current = viewport;
        if (viewportRef.current) {
            viewportRef.current.style.transform =
                `translate3d(${viewport.x}px, ${viewport.y}px, 0) scale(${viewport.zoom})`;
        }
    }, [viewport]);
    // #endregion

    const onMouseMoveForNewEdge = useCallback((e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const { x: vpX, y: vpY, zoom } = currentViewport.current;

        const worldX = (e.clientX - rect.left - vpX) / zoom;
        const worldY = (e.clientY - rect.top - vpY) / zoom;

        setNewEdgeEnd({ x: worldX, y: worldY });
    }, []);

    const cleanupNewEdge = useCallback(() => {
        window.removeEventListener('mousemove', onMouseMoveForNewEdge);
        window.removeEventListener('mouseup', cleanupNewEdge);
        setIsMakingNewEdgeFrom(null);
    }, [onMouseMoveForNewEdge]);

    const onEdgeStartMouseDown = (id: string, { x, y }: { x: number, y: number }) => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const { x: vpX, y: vpY, zoom } = currentViewport.current;

        // x, y passed here are from getBoundingClientRect (screen space)
        // Convert to world space
        const worldX = (x - rect.left - vpX) / zoom;
        const worldY = (y - rect.top - vpY) / zoom;

        window.addEventListener('mousemove', onMouseMoveForNewEdge);
        window.addEventListener('mouseup', cleanupNewEdge);
        setNewEdgeStart({ x: worldX, y: worldY });
        setNewEdgeEnd({ x: worldX, y: worldY });
        setIsMakingNewEdgeFrom(id);
    }

    const onEdgeEndMouseDown = (targetId: string) => {
        if (!isMakingNewEdgeFrom) return;
        addEdge(isMakingNewEdgeFrom, targetId);
        cleanupNewEdge();
    }

    return (
        <div className="relative flex-1 h-full w-full">
            <div
                ref={containerRef}
                className="flex-1 relative w-full h-full overflow-hidden select-none"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onWheel={handleWheel}
            >
                <div
                    ref={viewportRef}
                    style={{
                        transform: `translate3d(${viewport.x}px, ${viewport.y}px, 0) scale(${viewport.zoom})`,
                        transformOrigin: '0 0',
                    }}
                >
                    {
                        questions.map((node) => (
                            <FlowNode
                                key={node.id}
                                node={node}
                                zoom={viewport.zoom}
                                isMakingNewEdgeFrom={isMakingNewEdgeFrom}
                                onEdgeStartMouseDown={onEdgeStartMouseDown}
                                onEdgeEndMouseDown={onEdgeEndMouseDown}
                            />
                        ))
                    }
                    {
                        edgesWithPositions.map((edge) => (
                            <FlowEdge
                                key={edge.id}
                                edge={edge}
                                position={edge.position}
                            />
                        ))
                    }
                    {
                        isMakingNewEdgeFrom && (
                            <NewFlowEdge
                                start={newEdgeStart}
                                end={newEdgeEnd}
                            />
                        )
                    }
                </div>
            </div >

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