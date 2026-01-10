"use client";

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/useMobile';
import { cn } from '@/lib/utils';
import { useFormBuilder } from '@/store/useFormBuilder';
import { Question } from '@/types/form';
import { TooltipArrow } from '@radix-ui/react-tooltip';
import { ALargeSmallIcon, BoltIcon, FileTextIcon, Menu, SidebarIcon, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import SignInRequired from './signInRequired';
import LeftBarQuestionItem from './ui/leftBarQuestionItem';

import { AnimatePresence, Reorder } from "framer-motion";
import { CustomCard, CustomCardContent } from '../ui/custom-card';


export default function LeftBar() {

    const questions = useFormBuilder((state) => state.questions);
    const dataSource = useFormBuilder((state) => state.dataSource);
    const changeSequence = useFormBuilder((state) => state.changeSequence);

    const isMobile = useIsMobile();
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [mode, setMode] = useState<'expanded' | 'collapsed' | 'hover'>('expanded');

    // Local state for reordering - doesn't propagate to store until saved
    const [localQuestions, setLocalQuestions] = useState<Question[]>(questions);
    const reorderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Sync local questions with store when store questions change
    useEffect(() => {
        setLocalQuestions(questions);
    }, [questions]);

    // Load saved preferences
    useEffect(() => {
        const savedMode = localStorage.getItem('sidebar-mode') as typeof mode;
        if (savedMode) {
            setMode(savedMode);
            setIsExpanded(savedMode === 'expanded');
        }
    }, []);

    // Handle mode changes
    const handleModeChange = (newMode: typeof mode) => {
        setMode(newMode);
        localStorage.setItem('sidebar-mode', newMode);
        setIsExpanded(newMode === 'expanded');
    };

    // Handle hover behavior
    const handleMouseEnter = () => {
        if (mode === 'hover' && !isMobile) {
            setIsExpanded(true);
        }
    };

    const handleMouseLeave = () => {
        if (mode === 'hover' && !isMobile) {
            setIsExpanded(false);
        }
    };

    const onReorder = (newOrder: Question[]) => {
        setLocalQuestions(newOrder);
        if (reorderTimeoutRef.current) {
            clearTimeout(reorderTimeoutRef.current);
        }
        reorderTimeoutRef.current = setTimeout(() => {
            const sequenceForUI = newOrder
                .map((q, index) => ({ id: q.id, newOrder: index + 1 }))
            const sequence = sequenceForUI.filter((item, index) => questions[index]?.id !== item.id);
            if (sequence.length > 0) changeSequence(sequenceForUI.map(i => i.id), sequence);
        }, 800);
    }


    if (isMobile) {
        return (
            <>
                {/* Mobile menu button */}
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="fixed bottom-4 right-4 z-40 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Mobile overlay */}
                {isMobileOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsMobileOpen(false)}
                    />
                )}

                {/* Mobile sidebar from bottom */}
                <div className={cn(
                    "fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-xl shadow-2xl transform transition-transform duration-300 max-h-[80vh] overflow-hidden border-t",
                    isMobileOpen ? "translate-y-0" : "translate-y-full"
                )}>
                    {/* Handle bar */}
                    <div className="flex justify-center py-3 border-b">
                        <div className="w-12 h-1 bg-muted rounded-full" />
                    </div>

                    {/* Close button */}
                    <div className="flex justify-between items-center px-4 py-3 border-b">
                        <h3 className="text-lg font-semibold">Navigation</h3>
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="p-1 hover:bg-accent rounded-md transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mobile navigation */}
                    <div className="overflow-y-auto pb-4">
                        {/* {navigationSections.map((section, index) => (
                            <div key={index} className="p-4">
                                {section.title && (
                                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                        {section.title}
                                    </h4>
                                )}
                                <div className="space-y-1">
                                    {section.items.map(renderNavItem)}
                                </div>
                                {index < navigationSections.length - 1 && (
                                    <div className="h-px bg-border my-4" />
                                )}
                            </div>
                        ))} */}
                    </div>
                </div>
            </>
        );
    }
    return (
        <div className={cn("transition-all duration-300 ease-in-out",
            mode === 'hover' ? "w-16" : (isExpanded ? "w-64" : "w-16")
        )}>
            <aside
                className={cn(
                    "fixed top-16 left-0 bg-background border-r z-30 overflow-visible",
                    "transition-all duration-300 ease-in-out",
                    isExpanded ? "w-64" : "w-16",
                    "h-[calc(100vh-4rem)]"
                )}
                style={{
                    width: mode === 'hover' && !isMobile ? (isExpanded ? '256px' : '64px') : undefined
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="flex flex-col h-full bg-accent-bg">
                    <div className="flex-1 overflow-y-auto pb-4 overflow-x-hidden">
                        <div className='w-full h-full flex flex-col gap-2'>
                            <div className={cn(
                                'flex items-center border-b h-[53px] transition-all',
                                isExpanded ? 'px-3 justify-between' : 'px-2 justify-center'
                            )}>
                                {isExpanded ? (
                                    <div className='h-[53px] flex items-center justify-between w-full'>
                                        <span className='text-md overflow-ellipsis line-clamp-1'>{dataSource.name}</span>
                                        <div className='flex items-center gap-2'>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <SignInRequired>
                                                        <Link href={`analytics?tab=settings`}>
                                                            <Button size={'icon'} variant={'secondary'}>
                                                                <BoltIcon className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                    </SignInRequired>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <TooltipArrow />
                                                    Settings
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='relative group w-full h-[53px]'>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className='flex items-center justify-center w-full'>
                                                    <div className='p-2 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors'>
                                                        <ALargeSmallIcon className="w-4 h-4 text-primary" />
                                                    </div>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side="right">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{dataSource.name}</span>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                        {/* Settings button on hover */}
                                        <div className="absolute left-1/2 opacity-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100 transition-opacity duration-200">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <SignInRequired>
                                                        <Link href={`analytics?tab=settings`}>
                                                            <Button size={'icon'} variant={'ghost'}>
                                                                <BoltIcon className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                    </SignInRequired>
                                                </TooltipTrigger>
                                                <TooltipContent side="right">
                                                    Settings
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <ScrollArea className='h-[calc(100vh-190px)] pr-1'>
                                {
                                    !questions.length ?
                                        isExpanded ? (
                                            <div className='w-full px-2 pt-1'>
                                                <CustomCard className="outline-none" hoverEffect={false}>
                                                    <CustomCardContent>
                                                        <div className="w-full flex flex-col items-center text-center">
                                                            <div className="mb-4 p-3 w-min rounded-full bg-background">
                                                                <FileTextIcon className="w-6 h-6 text-muted-foreground" />
                                                            </div>
                                                            <h3 className="text-sm font-medium text-foreground mb-2">
                                                                No questions yet
                                                            </h3>
                                                            <p className="text-xs text-muted-foreground leading-relaxed max-w-48">
                                                                Start building your form by adding your first question
                                                            </p>
                                                        </div>
                                                    </CustomCardContent>
                                                </CustomCard>
                                            </div>
                                        ) : null
                                        :
                                        <div className='px-2 flex flex-col gap-2 pb-4 pt-1'>
                                            <Reorder.Group
                                                className='flex flex-col gap-2'
                                                axis='y'
                                                onReorder={onReorder}
                                                values={localQuestions}
                                                layoutScroll
                                            >
                                                <AnimatePresence mode="popLayout" initial={false}>
                                                    {localQuestions.map((question) => (
                                                        <LeftBarQuestionItem
                                                            isExpanded={isExpanded}
                                                            key={question.id}
                                                            question={question}
                                                        />
                                                    ))}
                                                </AnimatePresence>
                                            </Reorder.Group>
                                        </div>
                                }
                            </ScrollArea>
                        </div>
                    </div>

                    {/* Sidebar control */}
                    <div className={cn(
                        "border-t p-3 transition-all",
                        isExpanded ? "" : "flex justify-center"
                    )}>
                        <Tooltip>
                            <DropdownMenu>
                                <TooltipTrigger asChild>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant={'secondary'} size={'icon'} className="hover:bg-accent transition-colors">
                                            <SidebarIcon className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                </TooltipTrigger>
                                {!isExpanded && (
                                    <TooltipContent side="right">
                                        Sidebar options
                                    </TooltipContent>
                                )}
                                <DropdownMenuContent side="top" align="start" className="w-48">
                                    <DropdownMenuItem
                                        onClick={() => handleModeChange('expanded')}
                                        className={cn(
                                            "flex items-center gap-3 cursor-pointer",
                                            mode === 'expanded' ? "text-foreground bg-accent" : "text-muted-foreground"
                                        )}
                                    >
                                        {mode === 'expanded' && <div className="w-2 h-2 bg-primary rounded-full" />}
                                        <span className={cn(mode !== 'expanded' && "ml-5")}>Expanded</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleModeChange('collapsed')}
                                        className={cn(
                                            "flex items-center gap-3 cursor-pointer",
                                            mode === 'collapsed' ? "text-foreground bg-accent" : "text-muted-foreground"
                                        )}
                                    >
                                        {mode === 'collapsed' && <div className="w-2 h-2 bg-primary rounded-full" />}
                                        <span className={cn(mode !== 'collapsed' && "ml-5")}>Collapsed</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleModeChange('hover')}
                                        className={cn(
                                            "flex items-center gap-3 cursor-pointer",
                                            mode === 'hover' ? "text-foreground bg-accent" : "text-muted-foreground"
                                        )}
                                    >
                                        {mode === 'hover' && <div className="w-2 h-2 bg-primary rounded-full" />}
                                        <span className={cn(mode !== 'hover' && "ml-5")}>Expand on hover</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </Tooltip>
                    </div>
                </div>
            </aside >
        </div >
    );
}
