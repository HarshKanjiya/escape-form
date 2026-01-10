import { Button } from '@/components/ui/button';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from '@xyflow/react';
import { Trash2Icon, XIcon } from 'lucide-react';

export function FlowEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd, selected, data, }: EdgeProps & { data?: { onDelete?: (id: string) => void } }) {
    const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, });

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (data?.onDelete) {
            data.onDelete(id);
        }
    };

    return (
        <>
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    ...style,
                    strokeWidth: selected ? 2 : 1,
                    stroke: selected ? '#6366f1' : '#b1b1b7',
                }}
            />
            {selected && (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            pointerEvents: 'all',
                        }}
                        className="nodrag nopan"
                    >
                        <Button
                            size={'sm-icon'}
                            variant={'destructive'}
                            onClick={handleDelete}
                            className="rounded-full bg-background! border text-white p-0.5 shadow-lg transition-colors"
                            title="Delete edge"
                        >
                            <Trash2Icon className="w-3 h-3 text-destructive" size={10} />
                        </Button>
                    </div>
                </EdgeLabelRenderer>
            )}
        </>
    );
}
