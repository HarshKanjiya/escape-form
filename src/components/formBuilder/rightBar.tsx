"use client";

import { useFormBuilder } from "@/store/useFormBuilder";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import QuestionConfigCard from "./ui/questionConfigCard";
import QuestionTypeDropdown from "./ui/questionTypeDropdown";

export default function RightBar() {
    const { selectedQuestionId } = useFormBuilder();
    return (
        <div className="bg-background border-l z-30 overflow-visible h-full w-[360px]">
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto pb-4 overflow-x-hidden">
                    <div className='w-full h-full flex flex-col'>
                        <div className='pl-3 pr-2 flex items-center justify-between py-2 border-b min-h-13'>
                            <span className='text-md overflow-ellipsis line-clamp-1'>Field Config</span>
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
