"use client";

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/useMobile';
import { cn } from '@/lib/utils';
import { FormSettings } from '@/types/form';
import { Menu, SidebarIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SidebarProps {
    formSettings: FormSettings;
    onUpdateSettings: (updates: Partial<FormSettings>) => void;
}

export default function LeftBar({ formSettings, onUpdateSettings }: SidebarProps) {
    const isMobile = useIsMobile();
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [mode, setMode] = useState<'expanded' | 'collapsed' | 'hover'>('expanded');

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
                <div className="flex flex-col h-full">
                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto py-4 overflow-x-hidden">
                        {/* {navigationSections.map((section, index) => (
                        <div key={index} className="px-3 mb-6">
                            {section.title && isExpanded && (
                                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
                                    {section.title}
                                </h4>
                            )}
                            <div className="space-y-1">
                                {section.items.map(renderNavItem)}
                            </div>
                            {index < navigationSections.length - 1 && (
                                <div className="h-px bg-border my-4 mx-3" />
                            )}
                        </div>
                    ))} */}
                    </div>

                    {/* Sidebar control */}
                    <div className="border-t p-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={'secondary'} size={'icon'} >
                                    <SidebarIcon className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" align="start" className="w-48">
                                <DropdownMenuItem
                                    onClick={() => handleModeChange('expanded')}
                                    className={cn(
                                        "flex items-center gap-3",
                                        mode === 'expanded' ? "text-foreground bg-accent" : "text-muted-foreground"
                                    )}
                                >
                                    {mode === 'expanded' && <div className="w-2 h-2 bg-primary rounded-full" />}
                                    <span className={cn(mode !== 'expanded' && "ml-5")}>Expanded</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleModeChange('collapsed')}
                                    className={cn(
                                        "flex items-center gap-3",
                                        mode === 'collapsed' ? "text-foreground bg-accent" : "text-muted-foreground"
                                    )}
                                >
                                    {mode === 'collapsed' && <div className="w-2 h-2 bg-primary rounded-full" />}
                                    <span className={cn(mode !== 'collapsed' && "ml-5")}>Collapsed</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleModeChange('hover')}
                                    className={cn(
                                        "flex items-center gap-3",
                                        mode === 'hover' ? "text-foreground bg-accent" : "text-muted-foreground"
                                    )}
                                >
                                    {mode === 'hover' && <div className="w-2 h-2 bg-primary rounded-full" />}
                                    <span className={cn(mode !== 'hover' && "ml-5")}>Expand on hover</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </aside>
        </div>
    );
}
