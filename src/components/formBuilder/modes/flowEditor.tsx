"use client";

import { Background, BackgroundVariant, ReactFlow, addEdge, applyEdgeChanges, applyNodeChanges, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react';
import { useCallback, useEffect, useState } from "react";

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useFormBuilder } from '@/store/useFormBuilder';
import '@xyflow/react/dist/style.css';
import { ClockPlus, MinusIcon, PlusIcon, RotateCcwIcon } from 'lucide-react';
import { FlowNode } from './flowNode';

const nodeTypes = { card: FlowNode };

// Configuration
const FLOW_CONFIG = {
    minZoom: 0.5,
    maxZoom: 1.3,
    zoomStep: 0.1,
    defaultZoom: 1,
    gridSize: 34,
} as const;

const nodeOrigin = [0.5, 0];

const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

const proOptions = { hideAttribution: true };

export default function FlowEditor() {
    const { questions, edges: savedEdges, addEdge: createNewEdge, changePosition, removeEdge } = useFormBuilder();
    const [nodes, setNodes, baseOnNodesChange] = useNodesState<any>([]);
    const [edges, setEdges, baseOnEdgesChange] = useEdgesState(initialEdges);

    const { getViewport, setViewport, fitView } = useReactFlow();
    const [zoom, setZoom] = useState(1);

    const logGraphEvent = useCallback((type: 'node:change' | 'edge:change' | 'edge:connect', payload: any) => {
        console.log('[GraphEvent]', { type, payload });
        if (type == "node:change" && payload.type === 'position:end') {
            changePosition(payload.id, payload.position);
            return;
        }
        if (type == "edge:connect") {
            createNewEdge(payload.source, payload.target);
            return;
        }
        if (type == "edge:change" && payload.type === 'remove') {
            removeEdge(payload.id);
            return;
        }

    }, []);

    useEffect(() => {
        const nodes = questions.map((q) => ({
            id: String(q.id),
            type: 'card',
            position: { x: q.posX, y: q.posY },
            data: q,
        }));
        setNodes(nodes);
    }, [questions])

    useEffect(() => {
        const edges = savedEdges.map((q) => ({
            id: String(q.id),
            source: String(q.sourceNodeId),
            target: String(q.targetNodeId),
            data: q,
        }));
        setEdges(edges);
    }, [savedEdges])

    const handleZoomChange = (num: number) => {
        const z = Math.min(FLOW_CONFIG.maxZoom, Math.max(FLOW_CONFIG.minZoom, num));
        setZoom(z);
        const viewport = getViewport();
        setViewport({ x: viewport.x, y: viewport.y, zoom: z });
    };

    const handleNodesChange = useCallback(
        (changes: any) => {
            setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));
        },
        []
    );
    const handleEdgesChange = useCallback(
        (changes: any) => {
            logGraphEvent('edge:change', changes);
            setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot));
        },
        [logGraphEvent]
    );

    const onConnect = useCallback(
        (params: any) => {
            logGraphEvent('edge:connect', params);
            setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));
        },
        [logGraphEvent]
    );

    const onMove = useCallback(
        (params: any) => {
            if (params?.zoom) setZoom(params?.zoom);
        },
        [],
    );


    return (
        <div className="relative flex-1 h-full w-full">
            <ReactFlow
                fitView
                proOptions={proOptions}
                minZoom={FLOW_CONFIG.minZoom}
                maxZoom={FLOW_CONFIG.maxZoom}
                nodeTypes={nodeTypes}
                nodes={nodes}
                edges={edges}
                onNodesChange={(changes) => { baseOnNodesChange(changes); handleNodesChange(changes); }}
                onEdgesChange={(changes) => { baseOnEdgesChange(changes); handleEdgesChange(changes); }}
                onConnect={onConnect}
                onNodeDragStop={(_, node) => {
                    logGraphEvent('node:change', {
                        type: 'position:end',
                        id: node.id,
                        position: node.position,
                    });
                }}
                fitViewOptions={{ padding: 2 }}
                onMove={(_, v) => onMove(v)}
            >
                <Background color='#555' variant={BackgroundVariant.Dots} />
            </ReactFlow>
            <div className="absolute bottom-4 left-4 flex gap-2 z-999" onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                <div className="bg-secondary rounded px-2 py-1 text-xs text-center min-w-[60px] w-52 flex items-center justify-center gap-3">
                    <Slider
                        value={[((zoom - FLOW_CONFIG.minZoom) / (FLOW_CONFIG.maxZoom - FLOW_CONFIG.minZoom)) * 100]}
                        max={100}
                        step={1}
                        onValueChange={(value) => {
                            const newZoom = FLOW_CONFIG.minZoom + (value[0] / 100) * (FLOW_CONFIG.maxZoom - FLOW_CONFIG.minZoom);
                            handleZoomChange(newZoom);
                        }}
                    />
                    <span>{Math.round(zoom * 100)}%</span>
                </div>

                <Button
                    variant={'secondary'}
                    size={'icon'}
                    onClick={() => handleZoomChange(zoom - FLOW_CONFIG.zoomStep)}
                    disabled={zoom <= FLOW_CONFIG.minZoom}
                >
                    <MinusIcon />
                </Button>
                <Button
                    variant={'secondary'}
                    size={'icon'}
                    onClick={() => handleZoomChange(zoom + FLOW_CONFIG.zoomStep)}
                    disabled={zoom >= FLOW_CONFIG.maxZoom}
                >
                    <PlusIcon />
                </Button>
                <Button
                    variant={'secondary'}
                    size={'icon'}
                    onClick={() => fitView()}
                >
                    <RotateCcwIcon />
                </Button>
            </div>
        </div >
    );
}