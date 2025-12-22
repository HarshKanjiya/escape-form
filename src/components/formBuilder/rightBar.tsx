"use client";

import { useFormBuilder } from "@/store/useFormBuilder";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircleQuestionMark, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import QuestionConfigCard from "./ui/questionConfigCard";
import QuestionTypeDropdown from "./ui/questionTypeDropdown";

export default function RightBar() {
    const { selectedQuestionId, deleteQuestion } = useFormBuilder();

    return (
        <div className="bg-accent-bg border-l z-30 overflow-visible h-full w-[360px]">
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto pb-4 overflow-x-hidden">
                    <div className='w-full h-full flex flex-col'>
                        <div className='flex items-center justify-between py-2 px-3 border-b min-h-13'>
                            <span className='text-md overflow-ellipsis line-clamp-1'>Field Config</span>
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div>
                                    <Button variant={'secondary'} onClick={() => deleteQuestion(selectedQuestionId!)} disabled={!selectedQuestionId}>
                                        <Trash size={16} />
                                        Remove
                                    </Button>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div className="p-3 space-y-3">
                            {
                                selectedQuestionId ?
                                    <>
                                        <Card className="p-4 shadow-none border-accent bg-background corner-squircle rounded-4xl">
                                            <CardContent className="p-0">
                                                <QuestionTypeDropdown />
                                            </CardContent>
                                        </Card>
                                        <Card className="p-4 shadow-none border-accent bg-background corner-squircle rounded-4xl">
                                            <CardContent className="p-0">
                                                <QuestionConfigCard />
                                            </CardContent>
                                        </Card>
                                    </>
                                    :
                                    <>
                                        <Card className="p-6 shadow-none border-accent bg-accent-bg border-dashed">
                                            <CardContent className="p-0 flex flex-col items-center justify-center h-52 text-center">
                                                <div className="mb-4 p-3 rounded-full bg-background">
                                                    <MessageCircleQuestionMark className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                                <h3 className="text-sm font-medium text-foreground mb-2">
                                                    Select a Question
                                                </h3>
                                                <p className="text-xs text-muted-foreground leading-relaxed max-w-48">
                                                    Click on any question from the left panel to configure its settings and properties
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
