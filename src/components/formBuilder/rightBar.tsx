"use client";

import { useFormBuilder } from "@/store/useFormBuilder";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import QuestionConfigCard from "./ui/questionConfigCard";
import QuestionTypeDropdown from "./ui/questionTypeDropdown";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";

export default function RightBar() {
    const { selectedQuestionId, deleteQuestion } = useFormBuilder();

    return (
        <div className="bg-background border-l z-30 overflow-visible h-full w-[360px]">
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
                                        <Card className="p-4">
                                            <CardContent className="p-0">
                                                <QuestionTypeDropdown />
                                            </CardContent>
                                        </Card>
                                        <Card className="p-4">
                                            <CardContent className="p-0">
                                                <QuestionConfigCard />
                                            </CardContent>
                                        </Card>
                                    </> :
                                    <>
                                        <Card className="p-4">
                                            <CardContent className="p-0 flex items-center justify-center h-52">
                                                <Label className="mb-2">Selected a Question to modify</Label>
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
