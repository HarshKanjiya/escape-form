interface NewFlowEdgeProps {
    start: { x: number; y: number };
    end: { x: number; y: number };
}

const NewFlowEdge = ({ start, end }: NewFlowEdgeProps) => {
    // Smooth cubic bezier handle offsets
    const dx = Math.abs(end.x - start.x) * 0.5;

    const c1x = start.x + dx;
    const c1y = start.y;
    const c2x = end.x - dx;
    const c2y = end.y;

    const pathD = `M ${start.x},${start.y} C ${c1x},${c1y} ${c2x},${c2y} ${end.x},${end.y}`;

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
    );
};

export default NewFlowEdge;
