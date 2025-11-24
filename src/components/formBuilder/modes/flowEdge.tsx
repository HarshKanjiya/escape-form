"use client";

import { useFormBuilder } from '@/store/useFormBuilder';
import { useState } from 'react';
import "./flowStyles.css";

interface FlowEdgeProps {
    edge: any;
    position: { x0: number, y0: number, x1: number, y1: number };
}

function calculateOffset(value: number): number {
    return value / 2;
}

const FlowEdge = ({ edge, position }: FlowEdgeProps) => {

    const { selectedEdgeId } = useFormBuilder();

    const [middlePoint, setMiddlePoint] = useState<{ x: number; y: number }>({
        x: position.x0 + (position.x1 - position.x0) / 2,
        y: position.y0 + (position.y1 - position.y0) / 2,
    });

    // Update middle point on new positions
    // createEffect(() => {
    //     const middleX = props.position.x0 + (props.position.x1 - props.position.x0) / 2;
    //     const middleY = props.position.y0 + (props.position.y1 - props.position.y0) / 2;
    //     setMiddlePoint({
    //         x: middleX,
    //         y: middleY,
    //     });
    // });

    // Give the edge a little offset so it curves


    function handleOnClickDelete(event: any) {
        // Disable click on board event
        event.stopPropagation();

        // props.onClickDelete();
    }

    const dx = Math.abs(position.x1 - position.x0) * 0.5;

    const c1x = position.x0 + dx;
    const c1y = position.y0;
    const c2x = position.x1 - dx;
    const c2y = position.y1;

    const pathD = `M ${position.x0},${position.y0} C ${c1x},${c1y} ${c2x},${c2y} ${position.x1},${position.y1}`;


    function handleOnMouseDownEdge(e: React.MouseEvent) {
        e.stopPropagation();
    }

    return (

        <svg
            style={{ overflow: "visible", position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
            <path
                d={pathD}
                className="edge edgeNew"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                style={{ pointerEvents: 'none' }}
                onMouseDown={handleOnMouseDownEdge}
            />
        </svg>
        // <svg>
        //     <path
        //         className={
        //             cn(
        //                 "edge",
        //                 selectedEdgeId == edge.id && "edgeSelected",
        //                 edge.isNew && "edgeNew"
        //             )
        //         }
        //         d={`M ${position.x0} ${position.y0} C ${position.x0 + calculateOffset(Math.abs(position.x1 - position.x0))
        //             } ${position.y0}, ${position.x1 - calculateOffset(Math.abs(position.x1 - position.x0))} ${position.y1
        //             }, ${position.x1} ${position.y1}`}
        //         onMouseDown={handleOnMouseDownEdge}
        //     />
        //     <g
        //         className={cn(
        //             "delete",
        //             !selectedEdgeId == edge.id && "deleteHidden"
        //         )}
        //         transform={`translate(${middlePoint.x}, ${middlePoint.y - (selectedEdgeId == edge.id ? 24 : 0)})`}
        //         onMouseDown={handleOnClickDelete}
        //     >
        //         <circle
        //             className="edge-circle"
        //         />

        //         <svg
        //             fill="currentColor"
        //             strokeWidth="0"
        //             width="30"
        //             height="30"
        //             viewBox="210 240 1000 1000"
        //             className='overflow-visible edge-icon'
        //         >
        //             <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0h120.4c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64s14.3-32 32-32h96l7.2-14.3zM32 128h384v320c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"></path>
        //         </svg>
        //     </g >
        // </svg >
    )
}

export default FlowEdge