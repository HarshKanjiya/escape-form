"use client";

import { Handle, Position } from '@xyflow/react';

import { CustomCard, CustomCardContent } from "@/components/ui/custom-card";
import QuestionIcon from "../ui/questionIcon";


export const FlowNode = ({ data, isConnectable }: any) => {

    return (
        <>
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                className="group"
                style={{ width: 18, height: 18, borderRadius: 9999, background: 'var(--muted)', border: '1px solid var(--muted)', boxShadow: '0 0 0 3px var(--background)' }}
            />
            <CustomCard className="w-60 h-40">
                <CustomCardContent className="flex flex-col gap-5 items-start justify-start">
                    <QuestionIcon questionType={data.type} size={24} className="rounded-md text-base ring-2 ring-offset-2 ring-muted-foreground/20 ring-offset-background" />
                    <p className="line-clamp-4 text-ellipsis text-muted-foreground text-xs">
                        {data.title}
                    </p>
                </CustomCardContent>
            </CustomCard>
            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                className="group"
                style={{ width: 18, height: 18, borderRadius: 9999, background: 'var(--muted)', border: '2px solid var(--muted)', boxShadow: '0 0 0 3px var(--background)' }}
            />
        </>
    );
}