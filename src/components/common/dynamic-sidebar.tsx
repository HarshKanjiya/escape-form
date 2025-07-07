"use client";

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Database,
  Edit,
  Eye,
  FileText,
  FolderOpen,
  Home,
  Menu,
  Settings,
  SidebarIcon,
  Users,
  X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface NavigationItem {
  label: string;
  href: string;
  icon: any;
  isActive?: boolean;
}

interface NavigationSection {
  title?: string;
  items: NavigationItem[];
}

export default function DynamicSidebar() {
  const pathname = usePathname();
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

  // Generate navigation based on current route
  const generateNavigation = (): NavigationSection[] => {
    const segments = pathname.split('/').filter(Boolean);

    // Dashboard root level
    if (segments.length === 1 && segments[0] === 'dashboard') {
      return [
        {
          items: [
            {
              label: 'Overview',
              href: '/dashboard',
              icon: Home,
              isActive: true
            },
            {
              label: 'Teams',
              href: '/dashboard/teams',
              icon: Users
            }
          ]
        }
      ];
    }

    // Team level navigation
    if (segments[1] === 'team' && segments[2]) {
      const teamId = segments[2];
      const baseHref = `/dashboard/team/${teamId}`;

      return [
        {
          title: 'Team',
          items: [
            {
              label: 'Overview',
              href: baseHref,
              icon: Home,
              isActive: segments.length === 3
            },
            {
              label: 'Projects',
              href: `${baseHref}/projects`,
              icon: FolderOpen,
              isActive: segments[3] === 'projects' && segments.length === 4
            },
            {
              label: 'Members',
              href: `${baseHref}/members`,
              icon: Users
            },
            {
              label: 'Settings',
              href: `${baseHref}/settings`,
              icon: Settings
            }
          ]
        }
      ];
    }

    // Project level navigation
    if (segments[3] === 'project' && segments[4]) {
      const teamId = segments[2];
      const projectId = segments[4];
      const baseHref = `/dashboard/team/${teamId}/project/${projectId}`;

      return [
        {
          title: 'Project',
          items: [
            {
              label: 'Overview',
              href: baseHref,
              icon: Home,
              isActive: segments.length === 5
            },
            {
              label: 'Forms',
              href: `${baseHref}/forms`,
              icon: FileText,
              isActive: segments[5] === 'forms' && segments.length === 6
            },
            {
              label: 'Analytics',
              href: `${baseHref}/analytics`,
              icon: BarChart3
            },
            {
              label: 'Database',
              href: `${baseHref}/database`,
              icon: Database
            },
            {
              label: 'Settings',
              href: `${baseHref}/settings`,
              icon: Settings
            }
          ]
        }
      ];
    }

    // Form level navigation
    if (segments[5] === 'form' && segments[6]) {
      const teamId = segments[2];
      const projectId = segments[4];
      const formId = segments[6];
      const baseHref = `/dashboard/team/${teamId}/project/${projectId}/form/${formId}`;

      return [
        {
          title: 'Form',
          items: [
            {
              label: 'Edit',
              href: `${baseHref}/edit`,
              icon: Edit,
              isActive: segments[7] === 'edit'
            },
            {
              label: 'Preview',
              href: `${baseHref}/preview`,
              icon: Eye,
              isActive: segments[7] === 'preview'
            },
            {
              label: 'Analytics',
              href: `${baseHref}/analytics`,
              icon: BarChart3,
              isActive: segments[7] === 'analytics'
            },
            {
              label: 'Settings',
              href: `${baseHref}/settings`,
              icon: Settings,
              isActive: segments[7] === 'settings'
            }
          ]
        }
      ];
    }

    // Legacy routes support
    if (segments[1] === 'project' && segments[2]) {
      const projectId = segments[2];
      return [
        {
          title: 'Project',
          items: [
            {
              label: 'Overview',
              href: `/dashboard/project/${projectId}`,
              icon: Home,
              isActive: segments.length === 3
            },
            {
              label: 'Forms',
              href: `/dashboard/project/${projectId}/forms`,
              icon: FileText
            },
            {
              label: 'Analytics',
              href: `/dashboard/project/${projectId}/analytics`,
              icon: BarChart3
            }
          ]
        }
      ];
    }

    if (segments[1] === 'form' && segments[2]) {
      const formId = segments[2];
      return [
        {
          title: 'Form',
          items: [
            {
              label: 'Edit',
              href: `/dashboard/form/${formId}`,
              icon: Edit,
              isActive: segments.length === 3
            },
            {
              label: 'Preview',
              href: `/dashboard/form/${formId}/preview`,
              icon: Eye,
              isActive: segments[3] === 'preview'
            },
            {
              label: 'Analytics',
              href: `/dashboard/form/${formId}/analytics`,
              icon: BarChart3,
              isActive: segments[3] === 'analytics'
            }
          ]
        }
      ];
    }

    // Default navigation
    return [
      {
        items: [
          {
            label: 'Dashboard',
            href: '/dashboard',
            icon: Home,
            isActive: pathname === '/dashboard'
          }
        ]
      }
    ];
  };

  const navigationSections = generateNavigation();

  const renderNavItem = (item: NavigationItem) => {
    const Icon = item.icon;
    const isActive = item.isActive || pathname === item.href;

    return (
      <Link
        key={item.label}
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 group relative",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
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
          <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md border">
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
            {navigationSections.map((section, index) => (
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
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <aside
      className={cn(
        "fixed top-16 left-0 bg-background border-r z-30 overflow-visible",
        "transition-all duration-300 ease-in-out",
        isExpanded ? "w-64" : "w-16",
        "h-[calc(100vh-4rem)]" // Subtract header height
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
          {navigationSections.map((section, index) => (
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
          ))}
        </div>

        {/* Sidebar control */}
        <div className="border-t p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors",
                  !isExpanded && "justify-center px-2"
                )}
              >
                <SidebarIcon className="w-4 h-4 flex-shrink-0" />
                <div className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out flex-1",
                  isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
                )}>
                  {/* <span className="text-left whitespace-nowrap">Sidebar</span> */}
                </div>
              </button>
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
  );
}
