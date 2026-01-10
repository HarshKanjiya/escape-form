"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomCard, CustomCardContent, CustomCardHeader, CustomCardTitle } from "@/components/ui/custom-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { OPERATORS } from "@/constants/common";
import { cn } from "@/lib/utils";
import { useFormBuilder } from "@/store/useFormBuilder";
import { AnimatePresence, motion } from "framer-motion";
import { PlusIcon, RouteIcon, Trash2Icon, XIcon } from "lucide-react";
import { useState } from "react";

type Condition = {
    id: string;
    questionId: string;
    operator: string;
    value: string;
    logicOperator: string | null;
};

type Rule = {
    id: string;
    conditions: Condition[];
    action: {
        type: string;
        targetQuestionId: string;
    };
};

type EdgeData = {
    id: string;
    rules: Rule[];
    defaultAction: {
        type: string;
        targetQuestionId: string;
    };
};

export default function EdgeRulesConfig() {

    const selectedEdge = useFormBuilder((state) => state.selectedEdge);

    const [edgeData, setEdgeData] = useState<EdgeData>({
        id: "edge_123",
        rules: [],
        defaultAction: {
            type: "goto_question",
            targetQuestionId: "",
        },
    });

    const addRule = () => {
        const newRule: Rule = {
            id: `rule_${Date.now()}`,
            conditions: [
                {
                    id: `condition_${Date.now()}`,
                    questionId: "",
                    operator: "",
                    value: "",
                    logicOperator: null,
                },
            ],
            action: {
                type: "goto_question",
                targetQuestionId: "",
            },
        };
        setEdgeData((prev) => ({
            ...prev,
            rules: [...prev.rules, newRule],
        }));
    };

    const removeRule = (ruleId: string) => {
        setEdgeData((prev) => ({
            ...prev,
            rules: prev.rules.filter((rule) => rule.id !== ruleId),
        }));
    };

    const addCondition = (ruleId: string) => {
        setEdgeData((prev) => ({
            ...prev,
            rules: prev.rules.map((rule) => {
                if (rule.id !== ruleId) return rule;
                const updatedConditions = rule.conditions.map((c, i) =>
                    i === rule.conditions.length - 1
                        ? { ...c, logicOperator: "AND" }
                        : c
                );
                return {
                    ...rule,
                    conditions: [
                        ...updatedConditions,
                        {
                            id: `condition_${Date.now()}`,
                            questionId: "",
                            operator: "",
                            value: "",
                            logicOperator: null,
                        },
                    ],
                };
            }),
        }));
    };

    const removeCondition = (ruleId: string, conditionId: string) => {
        setEdgeData((prev) => ({
            ...prev,
            rules: prev.rules.map((rule) =>
                rule.id === ruleId
                    ? {
                        ...rule,
                        conditions: rule.conditions.filter((c) => c.id !== conditionId),
                    }
                    : rule
            ),
        }));
    };

    const updateCondition = (
        ruleId: string,
        conditionId: string,
        field: keyof Condition,
        value: any
    ) => {
        setEdgeData((prev) => ({
            ...prev,
            rules: prev.rules.map((rule) =>
                rule.id === ruleId
                    ? {
                        ...rule,
                        conditions: rule.conditions.map((condition) =>
                            condition.id === conditionId
                                ? { ...condition, [field]: value }
                                : condition
                        ),
                    }
                    : rule
            ),
        }));
    };

    const updateRuleAction = (ruleId: string, targetQuestionId: string) => {
        setEdgeData((prev) => ({
            ...prev,
            rules: prev.rules.map((rule) =>
                rule.id === ruleId
                    ? {
                        ...rule,
                        action: { ...rule.action, targetQuestionId },
                    }
                    : rule
            ),
        }));
    };

    const toggleLogicOperator = (ruleId: string, conditionId: string) => {
        setEdgeData((prev) => ({
            ...prev,
            rules: prev.rules.map((rule) =>
                rule.id === ruleId
                    ? {
                        ...rule,
                        conditions: rule.conditions.map((condition) =>
                            condition.id === conditionId
                                ? {
                                    ...condition,
                                    logicOperator:
                                        condition.logicOperator === "AND" ? "OR" : "AND",
                                }
                                : condition
                        ),
                    }
                    : rule
            ),
        }));
    };

    return (
        <AnimatePresence mode="wait">
            {
                selectedEdge ?
                    <motion.div
                        key={'edge-rules-config'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-2">
                        {edgeData.rules.map((rule, ruleIndex) => (
                            <CustomCard key={rule.id} className="outline-none gap-0!" hoverEffect={false}>
                                {/* Rule Header */}
                                <CustomCardHeader className="flex items-center pb-2">
                                    <CustomCardTitle className="text-xs">
                                        Rule <span className="text-sm font-mono">#{ruleIndex + 1}</span>
                                    </CustomCardTitle>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                        onClick={() => removeRule(rule.id)}
                                    >
                                        <Trash2Icon size={14} />
                                    </Button>
                                </CustomCardHeader>
                                <CustomCardContent className="p-2 space-y-2">
                                    {rule.conditions.map((condition, conditionIndex) => (
                                        <div key={condition.id} className="w-full flex items-start gap-2">
                                            {/* Condition Row */}
                                            <div className="flex items-center justify-center mt-1">
                                                <Badge className="h-6 w-6 rounded-full aspect-square text-xs text-muted-foreground" variant={"secondary"}>{conditionIndex + 1}</Badge>
                                            </div>
                                            <div className="space-y-2 w-full">
                                                <div className="w-full group flex items-center gap-1.5 rounded-md bg-muted/40 hover:bg-muted/60 transition-colors">
                                                    {/* Question Select */}
                                                    <Select
                                                        value={condition.questionId}
                                                        onValueChange={(value) =>
                                                            updateCondition(rule.id, condition.id, "questionId", value)
                                                        }
                                                    >
                                                        <SelectTrigger size="sm" className="dark:bg-input! text-xs flex-1 shadow-none">
                                                            <SelectValue placeholder="Question" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {/* Empty shell */}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="w-full flex items-center gap-2">
                                                    {/* <div className="w-8 h-8 flex items-center justify-center pl-2">
                                            <CornerDownRightIcon size={18} className="text-muted-foreground" />
                                        </div> */}
                                                    <Select
                                                        value={condition.operator}
                                                        onValueChange={(value) =>
                                                            updateCondition(rule.id, condition.id, "operator", value)
                                                        }
                                                    >
                                                        <SelectTrigger size="sm" className="dark:bg-input! text-xs w-18 shadow-none">
                                                            <SelectValue placeholder="Op" className="text-center" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {OPERATORS.map((op) => (
                                                                <SelectItem key={op.value} value={op.value}>
                                                                    <span className="font-mono">{op.label}</span> <span className="text-muted-foreground text-xs ml-2">{op.detail}</span>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>

                                                    <Input
                                                        placeholder="Value"
                                                        value={condition.value}
                                                        onChange={(e) =>
                                                            updateCondition(rule.id, condition.id, "value", e.target.value)
                                                        }
                                                        className="h-8 text-xs shadow-none flex-1 bg-input"
                                                    />
                                                </div>
                                                <div className="w-full flex items-center justify-center gap-2">
                                                    {conditionIndex < rule.conditions.length - 1 && (
                                                        <div className="flex items-center justify-center py-0.5 w-12">
                                                            <button
                                                                onClick={() => toggleLogicOperator(rule.id, condition.id)}
                                                                className={cn(
                                                                    "text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors cursor-pointer",
                                                                    condition.logicOperator === "AND"
                                                                        ? "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                                                                        : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                                                                )}
                                                            >
                                                                {condition.logicOperator || "AND"}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="h-full flex items-start pt-0.5">
                                                <Button
                                                    variant="outline"
                                                    size="sm-icon"
                                                    className="rounded-full shadow-none"
                                                    onClick={() => removeCondition(rule.id, condition.id)}
                                                    disabled={rule.conditions.length === 1}
                                                >
                                                    <XIcon size={12} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Condition */}
                                    <Button
                                        variant={'outline'}
                                        onClick={() => addCondition(rule.id)}
                                        className="w-full shadow-none border-dashed flex items-center justify-center gap-1 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-md transition-colors"
                                    >
                                        <PlusIcon size={12} />
                                        <span>Add condition</span>
                                    </Button>
                                </CustomCardContent>
                                <CustomCardContent wrapperClass="pt-0">
                                    <Label htmlFor="gotoQue" className="text-xs text-muted-foreground w-full mb-2">
                                        Then Go To This Question
                                    </Label>
                                    <Select
                                        value={rule.action.targetQuestionId}
                                        onValueChange={(value) => updateRuleAction(rule.id, value)}
                                    >
                                        <SelectTrigger id="gotoQue" size="sm" className="text-xs flex-1 bg-background w-full shadow-none dark:bg-input!">
                                            <SelectValue placeholder="Go to question..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* Empty shell */}
                                        </SelectContent>
                                    </Select>
                                </CustomCardContent>
                            </CustomCard>
                        ))}

                        {/* Add Rule Button */}
                        <Button
                            variant='outline'
                            onClick={addRule}
                            className={cn(
                                "w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-dashed",
                                "text-sm text-muted-foreground hover:text-foreground",
                                "hover:border-primary/30 hover:bg-primary/5 transition-colors"
                            )}
                        >
                            <PlusIcon size={16} />
                            <span>{edgeData.rules.length === 0 ? "Add branching rule" : "Add another rule"}</span>
                        </Button>

                        {/* Default Action */}
                        {edgeData.rules.length > 0 && (
                            <CustomCard className="outline-none" hoverEffect={false}>
                                <CustomCardHeader>
                                    <CustomCardTitle className="text-muted-foreground text-sm">Default (If no rules match)</CustomCardTitle>
                                </CustomCardHeader>
                                <CustomCardContent>
                                    <Select
                                        value={edgeData.defaultAction.targetQuestionId}
                                        onValueChange={(value) =>
                                            setEdgeData((prev) => ({
                                                ...prev,
                                                defaultAction: {
                                                    ...prev.defaultAction,
                                                    targetQuestionId: value,
                                                },
                                            }))
                                        }
                                    >
                                        <SelectTrigger id="defaultAction" className="h-8 text-xs w-full shadow-none dark:bg-input!">
                                            <SelectValue placeholder="Continue to next question" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* Empty shell */}
                                        </SelectContent>
                                    </Select>
                                </CustomCardContent>
                            </CustomCard>
                        )}
                    </motion.div>
                    :
                    <motion.div
                        key={'no-edge-selected'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}>
                        <CustomCard>
                            <CustomCardContent>
                                <div className="w-full flex flex-col items-center text-center">
                                    <div className="mb-4 p-3 w-min rounded-full bg-background">
                                        <RouteIcon className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-sm font-medium text-foreground mb-2">
                                        Select an Edge
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed max-w-48">
                                        Click on any edge in the workflow to configure branching rules
                                    </p>
                                </div>
                            </CustomCardContent>
                        </CustomCard>
                    </motion.div>
            }
        </AnimatePresence>
    );
}
