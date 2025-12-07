"use client";

import { Background, BackgroundVariant, ReactFlow, addEdge, applyEdgeChanges, applyNodeChanges, useReactFlow, EdgeTypes, useEdgesState, useNodesState, useNodesState } from '@xyflow/react';
import { useCallback, useEffect, useState } from "react";

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import '@xyflow/react/dist/style.css';
import { MinusIcon, PlusIcon, RotateCcwIcon } from 'lucide-react';
import { FlowNode } from './flowNode';
import { useFormBuilder } from '@/store/useFormBuilder';

// Configuration
const FLOW_CONFIG = {
    minZoom: 0.5,
    maxZoom: 1.3,
    zoomStep: 0.1,
    defaultZoom: 1,
    gridSize: 34,
} as const;

const nodeTypes = {
    card: FlowNode,
};

const nodeOrigin = [0.5, 0];

const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

const proOptions = { hideAttribution: true };

export default function FlowEditor() {
    const { questions, edges: savedEdges, addEdge: createNewEdge } = useFormBuilder();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const { getViewport, setViewport, fitView } = useReactFlow();
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        const nodes = questions.map((q) => ({ id: q.id, type: 'card', position: { x: q.posX, y: q.posY }, data: q }));
        setNodes(nodes);
    }, [])

    const handleZoomChange = (num: number) => {
        const z = Math.min(FLOW_CONFIG.maxZoom, Math.max(FLOW_CONFIG.minZoom, num));
        setZoom(z);
        const viewport = getViewport();
        setViewport({ x: viewport.x, y: viewport.y, zoom: z });
    };

    // const onNodesChange = useCallback(
    //     (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    //     [],
    // );
    // const onEdgesChange = useCallback(
    //     (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    //     [],
    // );
    const onConnect = useCallback(
        (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
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
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
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