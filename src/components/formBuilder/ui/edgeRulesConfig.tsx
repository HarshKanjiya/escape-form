"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChevronRight, PlusIcon, Trash2, X } from "lucide-react";
import { LOGIC_OPERATORS, OPERATORS } from "@/constants/common";
import { cn } from "@/lib/utils";

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
        <div className="space-y-2">
            {edgeData.rules.map((rule, ruleIndex) => (
                <div
                    key={rule.id}
                    className="rounded-lg border bg-card overflow-hidden"
                >
                    {/* Rule Header */}
                    <div className="flex items-center justify-between px-3 py-2 bg-muted/30 border-b">
                        <span className="text-xs font-medium text-muted-foreground">
                            Rule {ruleIndex + 1}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => removeRule(rule.id)}
                        >
                            <Trash2 size={14} />
                        </Button>
                    </div>

                    {/* Conditions */}
                    <div className="p-2 space-y-1">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground px-1 mb-1.5">
                            If
                        </div>

                        {rule.conditions.map((condition, conditionIndex) => (
                            <div key={condition.id}>
                                {/* Condition Row */}
                                <div className="group flex items-center gap-1.5 p-1.5 rounded-md bg-muted/40 hover:bg-muted/60 transition-colors">
                                    {/* Question Select */}
                                    <Select
                                        value={condition.questionId}
                                        onValueChange={(value) =>
                                            updateCondition(rule.id, condition.id, "questionId", value)
                                        }
                                    >
                                        <SelectTrigger className="h-7 text-xs flex-1 min-w-0 bg-background border-0 shadow-sm">
                                            <SelectValue placeholder="Question" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* Empty shell */}
                                        </SelectContent>
                                    </Select>

                                    {/* Operator Select */}
                                    <Select
                                        value={condition.operator}
                                        onValueChange={(value) =>
                                            updateCondition(rule.id, condition.id, "operator", value)
                                        }
                                    >
                                        <SelectTrigger className="h-7 text-xs w-14 bg-background border-0 shadow-sm">
                                            <SelectValue placeholder="Op" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {OPERATORS.map((op) => (
                                                <SelectItem key={op.value} value={op.value}>
                                                    {op.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Value Input */}
                                    <Input
                                        placeholder="Value"
                                        value={condition.value}
                                        onChange={(e) =>
                                            updateCondition(rule.id, condition.id, "value", e.target.value)
                                        }
                                        className="h-7 text-xs w-20 bg-background border-0 shadow-sm"
                                    />

                                    {/* Remove Button */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive shrink-0 transition-opacity"
                                        onClick={() => removeCondition(rule.id, condition.id)}
                                        disabled={rule.conditions.length === 1}
                                    >
                                        <X size={12} />
                                    </Button>
                                </div>

                                {/* Logic Operator Connector */}
                                {conditionIndex < rule.conditions.length - 1 && (
                                    <div className="flex items-center justify-center py-0.5">
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
                        ))}

                        {/* Add Condition */}
                        <button
                            onClick={() => addCondition(rule.id)}
                            className="w-full flex items-center justify-center gap-1 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-md transition-colors"
                        >
                            <PlusIcon size={12} />
                            <span>Add condition</span>
                        </button>
                    </div>

                    {/* Action */}
                    <div className="px-2 pb-2">
                        <div className="flex items-center gap-2 p-2 rounded-md bg-primary/5 border border-primary/10">
                            <ChevronRight size={14} className="text-primary shrink-0" />
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">
                                Then
                            </span>
                            <Select
                                value={rule.action.targetQuestionId}
                                onValueChange={(value) => updateRuleAction(rule.id, value)}
                            >
                                <SelectTrigger className="h-7 text-xs flex-1 bg-background border-0 shadow-sm">
                                    <SelectValue placeholder="Go to question..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* Empty shell */}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            ))}

            {/* Add Rule Button */}
            <button
                onClick={addRule}
                className={cn(
                    "w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-dashed",
                    "text-sm text-muted-foreground hover:text-foreground",
                    "hover:border-primary/30 hover:bg-primary/5 transition-colors"
                )}
            >
                <PlusIcon size={16} />
                <span>{edgeData.rules.length === 0 ? "Add branching rule" : "Add another rule"}</span>
            </button>

            {/* Default Action */}
            {edgeData.rules.length > 0 && (
                <div className="pt-2 border-t">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span className="text-[10px] uppercase tracking-wider">Default</span>
                        <span className="text-muted-foreground/60">— if no rules match</span>
                    </div>
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
                        <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Continue to next question" />
                        </SelectTrigger>
                        <SelectContent>
                            {/* Empty shell */}
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
    );
}
