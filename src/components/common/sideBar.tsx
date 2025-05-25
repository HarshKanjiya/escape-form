// components/Sidebar.tsx
"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
    FileCode,
    Home,
    Menu,
    SidebarIcon,
    Table2,
    X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

// Supabase-style navigation sections
const navigationSections = [
    {
        items: [
            {
                label: 'Project overview',
                href: '/dashboard',
                icon: Home
            },
            {
                label: 'Table Editor',
                href: '/dashboard/form',
                icon: Table2
            },
            {
                label: 'SQL Editor',
                href: '/dashboard/project',
                icon: FileCode
            },
        ]
    },
];

export default function Sidebar() {
    const [mode, setMode] = useState<'expanded' | 'collapsed' | 'hover'>('expanded');
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const isMobile = useIsMobile();
    const pathname = usePathname();

    // Load saved preference from localStorage
    useEffect(() => {
        const savedMode = localStorage.getItem('sidebarMode') as typeof mode;
        if (savedMode) {
            setMode(savedMode);
            setIsExpanded(savedMode === 'expanded');
        }
    }, []);

    // Handle mode changes
    useEffect(() => {
        if (mode === 'expanded') {
            setIsExpanded(true);
        } else if (mode === 'collapsed') {
            setIsExpanded(false);
        }
    }, [mode]);    // Save mode to localStorage
    const handleModeChange = (newMode: typeof mode) => {
        setMode(newMode);
        localStorage.setItem('sidebarMode', newMode);
    };

    // Handle hover for hover mode
    const handleMouseEnter = () => {
        if (mode === 'hover' && !isMobile) {
            setIsExpanded(true);
        }
    };

    const handleMouseLeave = () => {
        if (mode === 'hover' && !isMobile) {
            setIsExpanded(false);
        }
    };    // Render navigation item
    const renderNavItem = (item: any) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
            <Link
                key={item.label}
                href={item.href}
                className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 group relative",
                    isActive
                        ? "  shadow-sm"
                        : " hover:bg-base-100",
                    !isExpanded && "justify-center px-2"
                )}
                onClick={() => isMobile && setIsMobileOpen(false)}
            >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <div className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
                )}>
                    <span className="truncate whitespace-nowrap">
                        {item.label}
                    </span>
                </div>
                {!isExpanded && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                    </div>
                )}
            </Link>
        );
    };

    if (isMobile) {
        return (
            <>
                {/* Mobile menu button */}
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="fixed bottom-4 right-4 z-40 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Mobile overlay */}
                {isMobileOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsMobileOpen(false)}
                    />
                )}

                {/* Mobile sidebar from bottom */}
                <div className={cn(
                    "fixed inset-x-0 bottom-0 z-50  rounded-t-xl shadow-2xl transform transition-transform duration-300 max-h-[80vh] overflow-hidden",
                    isMobileOpen ? "translate-y-0" : "translate-y-full"
                )}>
                    {/* Handle bar */}
                    <div className="flex justify-center py-3 border-b border-base-200">
                        <div className="w-12 h-1 bg-base-300 rounded-full" />
                    </div>

                    {/* Close button */}
                    <div className="flex justify-between items-center px-4 py-3 border-b border-base-200">
                        <h3 className="text-lg font-semibold ">Navigation</h3>
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="p-1 "
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mobile navigation */}
                    <div className="overflow-y-auto pb-4">
                        {navigationSections.map((section, index) => (
                            <div key={index} className="p-4">
                                <div className="space-y-1">
                                    {section.items.map(renderNavItem)}
                                </div>
                                {index < navigationSections.length - 1 && (
                                    <div className="h-px  my-4" />
                                )}
                            </div>
                        ))}
                    </div>                </div>
            </>
        );
    }

    return (
        <aside
            className={cn(
                "fixed top-16 left-0  border-r border-base-200 bg-base-50 z-30 overflow-visible",
                "transition-all duration-300 ease-in-out",
                isExpanded ? "w-64" : "w-16",
                "h-[calc(100vh-4rem)]" // Subtract header height (64px = 4rem)
            )}
            style={{
                width: mode === 'hover' && !isMobile ? (isExpanded ? '256px' : '64px') : undefined
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}        >
            <div className="flex flex-col h-full">
                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-4 overflow-x-hidden">
                    {navigationSections.map((section, index) => (
                        <div key={index} className="px-3 mb-6">
                            <div className="space-y-1">
                                {section.items.map(renderNavItem)}
                            </div>
                            {index < navigationSections.length - 1 && (
                                <div className="h-px my-4 mx-3" />
                            )}
                        </div>
                    ))}
                </div>                {/* Sidebar control */}
                <div className="border-t border-base-200 p-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size={'icon'}>
                                <SidebarIcon className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="top" align="start" className="w-48">
                            <DropdownMenuItem
                                onClick={() => handleModeChange('expanded')}
                            >
                                {mode === 'expanded' && <div className="w-2 h-2 bg-green-600 rounded-full" />}
                                <span className={cn(mode !== 'expanded' && "ml-5")}>Expanded</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleModeChange('collapsed')}
                            >
                                {mode === 'collapsed' && <div className="w-2 h-2 bg-green-600 rounded-full" />}
                                <span className={cn(mode !== 'collapsed' && "ml-5")}>Collapsed</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleModeChange('hover')}
                            >
                                {mode === 'hover' && <div className="w-2 h-2 bg-green-600 rounded-full" />}
                                <span className={cn(mode !== 'hover' && "ml-5")}>Expand on hover</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </aside>
    );
}
