"use client";

import { useFormBuilder } from "@/store/useFormBuilder";
import { MessageCircleQuestionMark, Trash } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import QuestionConfigCard from "./ui/questionConfigCard";
import QuestionTypeDropdown from "./ui/questionTypeDropdown";
import { eViewMode } from "@/enums/form";
import { CustomCard, CustomCardContent, CustomCardHeader } from "../ui/custom-card";

export default function RightBar() {

    const selectedQuestionId = useFormBuilder((state) => state.selectedQuestionId);
    const editorMode = useFormBuilder((state) => state.viewMode);
    const deleteQuestion = useFormBuilder((state) => state.deleteQuestion);

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
                        <div className="p-3 flex flex-col">


                            {
                                !selectedQuestionId ?
                                    <CustomCard className="outline-none" hoverEffect={false}>
                                        <CustomCardContent>
                                            <div className="w-full flex flex-col items-center text-center">
                                                <div className="mb-4 p-3 w-min rounded-full bg-background">
                                                    <MessageCircleQuestionMark className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                                <h3 className="text-sm font-medium text-foreground mb-2">
                                                    Select a Question
                                                </h3>
                                                <p className="text-xs text-muted-foreground leading-relaxed max-w-48">
                                                    Click on any question or Add new
                                                </p>
                                            </div>
                                        </CustomCardContent>
                                    </CustomCard>
                                    : null
                            }
                            {
                                editorMode == eViewMode.Builder ?
                                    <div className="space-y-3">
                                        {
                                            selectedQuestionId ?
                                                <>
                                                    <CustomCard className="outline-none" hoverEffect={false}>
                                                        <CustomCardContent>
                                                            <div className="w-full">
                                                                <QuestionTypeDropdown />
                                                            </div>
                                                        </CustomCardContent>
                                                    </CustomCard>
                                                    <CustomCard className="outline-none" hoverEffect={false}>
                                                        <CustomCardHeader>
                                                            <span>Question Settings</span>
                                                        </CustomCardHeader>
                                                        <CustomCardContent>
                                                            <div className="w-full">
                                                                <QuestionConfigCard />
                                                            </div>
                                                        </CustomCardContent>
                                                    </CustomCard>
                                                </>
                                                : null
                                        }
                                    </div>
                                    : null
                            }
                            {
                                editorMode == eViewMode.Workflow ?

                                    <CustomCard className="outline-none" hoverEffect={false}>
                                        <CustomCardHeader>
                                            <span>Edge Settings</span>
                                        </CustomCardHeader>
                                        <CustomCardContent>
                                            <div className="w-full">
                                                edge settings
                                            </div>
                                        </CustomCardContent>
                                    </CustomCard>
                                    : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
