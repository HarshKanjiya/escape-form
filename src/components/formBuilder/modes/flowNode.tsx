"use client";

import { IQuestion } from "@/types/form";
import { useCallback, useEffect, useRef } from "react";
import QuestionIcon from "../ui/questionIcon";
import { FlowerIcon, SplitIcon } from "lucide-react";


export const FlowNode = ({ node, x, y, zoom, positionChange }: { node: IQuestion, x: number, y: number, zoom: number, positionChange: (id: any, position: { x: number, y: number }) => void }) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const pos = useRef({ x: node.position.x + x, y: node.position.y + y })
    const dragStartMouse = useRef({ x: 0, y: 0 });
    const dragStartElem = useRef({ x: 0, y: 0 });

    useEffect(() => {
        pos.current = { x: node.position.x + x, y: node.position.y + y };
    }, [x, y])

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
    }, [zoom])

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const dx = e.clientX - dragStartMouse.current.x;
        const dy = e.clientY - dragStartMouse.current.y;

        const newX = dragStartElem.current.x + (dx);
        const newY = dragStartElem.current.y + (dy);

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
    }, [node.id, positionChange]);


    return (
        <>
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
                {/* <div className="absolute top-1/2 -translate-y-1/2 -left-8 cursor-grab">
                    <div className="h-4 w-4 rounded-full bg-primary-400">
                    </div>
                </div> */}
                <div className="absolute top-1/2 -translate-y-1/2 -right-8 cursor-crosshair">
                    <div className="rounded-full bg-primary-400">
                        <SplitIcon className="rotate-90 h-6 w-6 p-1.5 text-white" />
                    </div>
                </div>
                {/* Node */}
                <div className="p-2 bg-primary-400 dark:bg-primary-300 rounded-lg">
                    <QuestionIcon questionType={node.type} className="text-white" />
                </div>
                <p className="line-clamp-1 overflow-ellipsis overflow-hidden">
                    {node.question}
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
        </>
    )
}

export const FlowNodeWrapper = ({ nodes, x, y, zoom }: { nodes: IQuestion[], x: number, y: number, zoom: number }) => {

    const positionChange = (id: any, position: any) => {
        console.log('object :>> ', id, position);
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
