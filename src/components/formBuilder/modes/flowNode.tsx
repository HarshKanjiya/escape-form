"use client";

import { Handle, Position } from '@xyflow/react';

import { CustomCard, CustomCardContent } from "@/components/ui/custom-card";
import QuestionIcon from "../ui/questionIcon";
import { CableIcon, CircleArrowRightIcon, CirclePlusIcon, MergeIcon, TrendingUpDownIcon } from 'lucide-react';


export const FlowNode = ({ data, isConnectable }: any) => {

    return (
        <>
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                className="group p-2 bg-none w-[2rem] h-[2rem] border-none"
            >
                <CircleArrowRightIcon
                    className='bg-muted h-7 w-7 p-1 rounded-full border-3 border-background top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-muted-foreground cursor-none absolute overflow-visible'
                />
            </Handle>
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
                className="group p-2 bg-none w-[2rem] h-[2rem] border-none"
            >
                <TrendingUpDownIcon
                    className='bg-muted h-7 w-7 p-1 rounded-full border-3 border-background top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-muted-foreground cursor-none absolute overflow-visible'
                />
            </Handle>
        </>
    );
}