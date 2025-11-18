"use client";

import { Question } from "@/types/form";
import { SplitIcon } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import QuestionIcon from "../ui/questionIcon";


export const FlowNode = ({ node, x, y, zoom, positionChange }: {
    node: Question, x: number, y: number, zoom: number, positionChange: (id: any, position: { x: number, y: number }) => void
}) => {

    const elementRef = useRef<HTMLDivElement>(null);
    const pos = useRef({ x: node.posX, y: node.posY });

    const dragStartMouse = useRef({ x: 0, y: 0 });
    const dragStartElem = useRef({ x: 0, y: 0 });

    useEffect(() => {
        pos.current = { x: node.posX, y: node.posY };

        if (elementRef.current) {
            elementRef.current.style.transform =
                `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) scale(${zoom})`;
        }
    }, [node.posX, node.posY, zoom]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button === 0) {
            e.preventDefault();
            e.stopPropagation();

            dragStartMouse.current = { x: e.clientX, y: e.clientY };
            dragStartElem.current = { x: pos.current.x, y: pos.current.y };

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'grabbing';
        }
    }, [zoom]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const dx = e.clientX - dragStartMouse.current.x;
        const dy = e.clientY - dragStartMouse.current.y;

        const newX = dragStartElem.current.x + (dx / zoom);
        const newY = dragStartElem.current.y + (dy / zoom);

        pos.current = { x: newX, y: newY };

        if (elementRef.current) {
            elementRef.current.style.zIndex = '99999';
            elementRef.current.style.transform =
                `translate3d(${newX}px, ${newY}px, 0) scale(${zoom})`;
        }
    }, [zoom]);

    const handleMouseUp = useCallback(() => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'default';
        positionChange(node.id, pos.current);

        if (elementRef.current) {
            elementRef.current.style.zIndex = 'auto'
        }
    }, [node.id, positionChange, handleMouseMove]);

    return (
        <div
            ref={elementRef}
            className="absolute inset-0 bg-background border-2 border-border rounded-xl p-4 shadow-sm pointer-events-auto flex flex-col gap-2 items-start justify-start"
            style={{
                transform: `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) scale(${zoom})`,
                transformOrigin: '0 0',
                width: '200px',
                height: '130px',
                userSelect: "none"
            }}
            onMouseDown={handleMouseDown}
        >
            <div className="absolute top-1/2 -translate-y-1/2 -right-8 cursor-crosshair">
                <div className="rounded-full bg-primary-400">
                    <SplitIcon className="rotate-90 h-6 w-6 p-1.5 text-white" />
                </div>
            </div>
            <div className="p-2 bg-primary-400 dark:bg-primary-300 rounded-lg">
                <QuestionIcon questionType={node.type} className="text-white" />
            </div>
            <p className="line-clamp-1 overflow-ellipsis overflow-hidden">
                {node.title}
            </p>
            <p className="italic text-sm text-muted-foreground line-clamp-2 overflow-ellipsis overflow-hidden">
                {
                    node.description?.length ?
                        <span>
                            {node.description}
                        </span>
                        : '...'
                }
            </p>
        </div>
    );
}

export const FlowNodeWrapper = ({ nodes, x, y, zoom }: { nodes: Question[], x: number, y: number, zoom: number }) => {

    const positionChange = (id: any, position: any) => {
        console.log('Node drag finished :>> ', id, position);
    }

    return (
        <>
            {
                nodes.map((node) => (
                    <FlowNode key={node.id} node={node} x={x} y={y} zoom={zoom} positionChange={positionChange} />
                ))
            }
        </>
    )
}