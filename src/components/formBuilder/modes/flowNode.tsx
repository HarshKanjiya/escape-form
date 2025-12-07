"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import QuestionIcon from "../ui/questionIcon";

export const FlowNode = ({ data }: { data: any }) => {

    return (
        <BaseNode className="w-52">
            <BaseNodeHeader>
                <QuestionIcon questionType={data.type} size={24} className="rounded-md text-base ring-2 ring-offset-2 ring-muted-foreground/20 ring-offset-background" />
                <BaseNodeHeaderTitle>{data.title}</BaseNodeHeaderTitle>
            </BaseNodeHeader>
            <BaseNodeContent>
                <p className="line-clamp-2 text-ellipsis text-muted-foreground text-xs">
                    {data.description || "No description ..."}
                </p>
            </BaseNodeContent>
            {/* <BaseNodeFooter>
                <h4 className="text-md self-start font-bold">Footer</h4>
            </BaseNodeFooter> */}
        </BaseNode>
    );
}


export function BaseNode({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "text-card-foreground bg-muted relative rounded-md border p-0.5",
                "hover:ring-1",
                "[.react-flow\\_\\_node.selected_&]:border-muted-foreground",
                "[.react-flow\\_\\_node.selected_&]:shadow-lg",
                className,
            )}
            tabIndex={0}
            {...props}
        />
    );
}

export function BaseNodeHeader({
    className,
    ...props
}: ComponentProps<"header">) {
    return (
        <header
            {...props}
            className={cn(
                "flex flex-row items-center justify-between gap-4 px-2 py-2",
                className,
            )}
        />
    );
}

export function BaseNodeHeaderTitle({
    className,
    ...props
}: ComponentProps<"h3">) {
    return (
        <h3
            data-slot="base-node-title"
            className={cn("user-select-none flex-1 text-base line-clamp-1 text-ellipsis", className)}
            {...props}
        />
    );
}

export function BaseNodeContent({
    className,
    ...props
}: ComponentProps<"div">) {
    return (
        <div
            data-slot="base-node-content"
            className={cn("flex flex-col gap-y-2 p-3 bg-card rounded-lg border border-muted-foreground/10", className)}
            {...props}
        />
    );
}

export function BaseNodeFooter({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            data-slot="base-node-footer"
            className={cn(
                "flex flex-col items-center gap-y-2 border-t px-3 pt-2 pb-3",
                className,
            )}
            {...props}
        />
    );
}