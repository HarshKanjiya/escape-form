"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NextButton, PrevButton, usePrevNextButtons } from "@/components/ui/carouselAerrowButtons";
import { DotButtonNav, useDotButton } from "@/components/ui/carouselDotButtons";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { eWorkflowDirection } from "@/enums/form";
import { useFormBuilder } from "@/store/useFormBuilder";
import useEmblaCarousel from "embla-carousel-react";
import { Braces, SeparatorHorizontalIcon } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import AddQuestionDialog from "../ui/addQuestionDialog";
import QuestionCard from "../ui/questionCard";

export default function FormEditor() {

    const selectedQuestion = useFormBuilder((state) => state.selectedQuestion);
    const questions = useFormBuilder((state) => state.questions);
    const setSelectedQuestionId = useFormBuilder((state) => state.setSelectedQuestionId);

    const [direction, setDirection] = useState<eWorkflowDirection>(eWorkflowDirection.Horizontal);


    // Create embla configuration based on direction
    const emblaOptions = {
        axis: direction === eWorkflowDirection.Vertical ? 'y' : 'x',
        containScroll: 'trimSnaps',
        dragFree: false,
        loop: false
    } as const;

    const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);
    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
    const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

    useEffect(() => {
        if (questions && selectedIndex && questions[selectedIndex]) {
            setSelectedQuestionId(questions[selectedIndex].id);
        }
    }, [selectedIndex]);

    useEffect(() => {

        if (selectedQuestion && questions.length > 0 && emblaApi) {
            const index = questions.findIndex(q => q.id === selectedQuestion.id);
            if (index !== -1) {
                setTimeout(() => {
                    emblaApi.scrollTo(index);
                }, 1);
            }
        }
    }, [selectedQuestion, emblaApi]);

    // Force reinitialization when direction changes
    useEffect(() => {
        if (emblaApi) {
            setTimeout(() => {
                emblaApi.reInit();
            }, 1);
        }
    }, [direction, emblaApi]);

    if (!questions?.length) {
        return (
            <div className="h-full w-full flex flex-col items-center p-8 justify-center">
                <Card className="p-4 border-none dark:bg-accent shadow-none">
                    <CardContent className="p-8 flex flex-col gap-6 items-center justify-center max-w-md text-center ">
                        <div className="bg-linear-to-br from-primary/20 to-primary/10 p-4 rounded-full rotate-12 outline-4 outline-offset-4 outline-primary/10">
                            <Braces size={48} className="text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-foreground">No Questions Yet</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Start building your form by adding questions from the sidebar.
                                Create engaging forms with various question types.
                            </p>
                        </div>
                        <AddQuestionDialog>
                            <Button>
                                Add First Question
                            </Button>
                        </AddQuestionDialog>
                    </CardContent>
                </Card>
                {/* <div className="bg-gradient-to-br from-accent/50 to-accent/20 border rounded-xl  shadow-none border-accent bg-white dark:bg-accent">
                </div> */}
            </div>
        )
    }

    return (
        <div className="h-full w-full flex flex-col items-center">
            <div className="flex items-center justify-end w-full p-2">
                <Tooltip >
                    <TooltipTrigger asChild>
                        <Button className="" variant={'secondary'} size={'icon'} onClick={() => setDirection(direction === eWorkflowDirection.Horizontal ? eWorkflowDirection.Vertical : eWorkflowDirection.Horizontal)}>
                            <motion.span
                                animate={{ rotate: direction === eWorkflowDirection.Horizontal ? 90 : 0 }}
                                transition={{ type: "tween", duration: 0.15 }}
                                style={{ display: 'inline-block' }}
                            >
                                <SeparatorHorizontalIcon />
                            </motion.span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Change to {direction === eWorkflowDirection.Horizontal ? 'vertical' : 'horizontal'}
                    </TooltipContent>
                </Tooltip>
            </div>
            <div className="overflow-auto w-full h-full flex-1 flex flex-col gap-4 items-center justify-center p-2 relative">
                {direction === eWorkflowDirection.Vertical ? (
                    // Vertical layout: buttons on left, carousel in center, dots on right
                    <div className="flex items-center justify-center w-full h-full max-w-4xl gap-4">
                        {questions.length > 1 && (
                            <div className="flex flex-col gap-2 items-center justify-center">
                                <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} isVertical={true} />
                                <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} isVertical={true} />
                            </div>
                        )}
                        <section className="embla w-full flex items-center justify-center" key={`${direction}-${questions.length}`}>
                            <div className={`embla__viewport ${direction === eWorkflowDirection.Vertical ? 'embla__viewport--vertical' : ''}`} ref={emblaRef}>
                                <div className={`embla__container ${direction === eWorkflowDirection.Vertical ? 'embla__container--vertical' : ''}`}>
                                    {questions.map((question, index) => (
                                        <div className={`embla__slide ${direction === eWorkflowDirection.Vertical ? 'embla__slide--vertical' : ''}`} key={index}>
                                            <QuestionCard question={question} index={index} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                        {questions.length > 1 && (
                            <div className="flex flex-col gap-2 items-center justify-center">
                                <DotButtonNav
                                    slideCount={scrollSnaps.length}
                                    currentIndex={selectedIndex}
                                    onDotClick={onDotButtonClick}
                                    className="carousel-dot-nav--vertical"
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    // Horizontal layout: original layout
                    <section className="embla w-full max-w-2xl" key={`${direction}-${questions.length}`}>
                        <div className="embla__viewport" ref={emblaRef}>
                            <div className="embla__container">
                                {questions.map((question, index) => (
                                    <div className="embla__slide" key={index}>
                                        <QuestionCard question={question} index={index} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {questions.length > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="embla__buttons">
                                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                                </div>
                                <DotButtonNav
                                    slideCount={scrollSnaps.length}
                                    currentIndex={selectedIndex}
                                    onDotClick={onDotButtonClick}
                                />
                            </div>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
}
